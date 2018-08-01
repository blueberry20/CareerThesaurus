using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SkillCowResponsive.Classes.Helpers;
using SkillCowResponsive.Classes.Cloud.TableStorage.DirectClients.GeoIndex;
using SkillCowResponsive.Classes.Cloud.TableStorage.DirectClients.LeadCounters;
using SkillCowResponsive.Classes.Cloud.TableStorage.DirectClients.LeadCaps;
using SkillCowResponsive.Classes.Cloud.TableStorage.DirectClients.Employers.GeoIndex;
using Newtonsoft.Json.Linq;
using SkillCowResponsive.Classes.Cloud.BlobStorage;


namespace SkillCowResponsive.Classes.Cloud.TableStorage.DirectClients.Employers
{
    public class DirectEmployerSearchEngine
    {
        public List<object> FindPositions(HttpRequestBase Request, string zipcode, string attributes, string things, string gender, string programid)
        {
            bool demomode = Request["demo"] != null && Request["demo"] == "1";

            LeadCounterClient leadcounterclient = new LeadCounterClient();
            List<LeadCounter> leadcounters = null;

            LeadCapClient leadcapclient = new LeadCapClient();
            List<LeadCap> leadcaps = null;

            List<object> results = new List<object>();

            bool validprogramcategoryid = false;
            if (programid!="" && !programid.StartsWith("c"))
            {
                validprogramcategoryid = true;
            }
            
            //ZipCodeClient zipclient = new ZipCodeClient();
            //ZipCode zipobject = zipclient.GetByRowKey(zipcode);
            BlobJsonResourceManager blobmgr = new BlobJsonResourceManager();
            string zipjson = blobmgr.GetJsonResource("skillcow", "zipcodes", zipcode);
            JObject jzip = null;
            if (zipjson != "")
            {
                jzip = JObject.Parse(zipjson);
            }
                        
            GeoIndexNationalClient nclient = new GeoIndexNationalClient();
            GeoIndexAddStateClient addstateclient = new GeoIndexAddStateClient();
            GeoIndexAddZipClient addzipclient = new GeoIndexAddZipClient();
            GeoIndexSubtractStateClient subtractstateclient = new GeoIndexSubtractStateClient();
            GeoIndexSubtractZipClient subtractzipclient = new GeoIndexSubtractZipClient();

            List<IGeoIndex> allresults = new List<IGeoIndex>();
            List<IGeoIndex> subtractions = new List<IGeoIndex>();

            //By program id
            if (validprogramcategoryid)
            {
                allresults.AddRange(nclient.GetAllByPartition(programid));
                if (jzip != null)
                {
                    //allresults.AddRange(addstateclient.GetAllByPartition(zipobject.StateCode + "-" + programid));
                    allresults.AddRange(addstateclient.GetAllByPartition(jzip["statecode"].ToString() + "-" + programid));
                    allresults.AddRange(addzipclient.GetAllByPartition(zipcode + "-" + programid));
                }
                
                if (jzip != null)
                {
                    //subtractions.AddRange(subtractstateclient.GetAllByPartition(zipobject.StateCode + "-" + programid));
                    subtractions.AddRange(subtractstateclient.GetAllByPartition(jzip["statecode"].ToString() + "-" + programid));
                    subtractions.AddRange(subtractzipclient.GetAllByPartition(zipcode + "-" + programid));
                }
            }
            else{
                allresults.AddRange(nclient.GetAllByPartition("attr"));
                if (jzip != null)
                {
                    //allresults.AddRange(addstateclient.GetAllByPartition(zipobject.StateCode));
                    allresults.AddRange(addstateclient.GetAllByPartition(jzip["statecode"].ToString()));
                    allresults.AddRange(addzipclient.GetAllByPartition(zipcode));
                }

                if (jzip != null)
                {
                    //subtractions.AddRange(subtractstateclient.GetAllByPartition(zipobject.StateCode));
                    subtractions.AddRange(subtractstateclient.GetAllByPartition(jzip["statecode"].ToString()));
                    subtractions.AddRange(subtractzipclient.GetAllByPartition(zipcode));
                }
            }

            IEnumerable<IGeoIndex> difference = allresults.Except(subtractions, new CompareGeoIndexResults());
                        
            DirectEmployerClientClient clientclient = new DirectEmployerClientClient();
            DirectEmployerClientCampusClient campusclient = new DirectEmployerClientCampusClient();
            DirectEmployerClientCampusProgramClient programclient = new DirectEmployerClientCampusProgramClient();

            JObject oattributes = null;
            JObject othings = null;

            long attributemask = 0;
            long importantthingsmask = 0;

            if (attributes != null && attributes != "")
            {
                oattributes = JObject.Parse(attributes);
                AttributeMaskCalculator amc = new AttributeMaskCalculator();
                attributemask = amc.GetMask(oattributes);
            }
            if (things != null && things != "")
            {
                othings = JObject.Parse(things);
                ImportantThingsMaskCalculator itmc = new ImportantThingsMaskCalculator();
                importantthingsmask = itmc.GetMask(othings);
            }

            foreach (IGeoIndex geoindex in allresults)
            {
                if (geoindex.AttributeMask != null && (geoindex.AttributeMask & attributemask) == attributemask)
                {
                    DirectEmployerClientCampusProgram job = programclient.GetByRowKey(geoindex.RowKey);

                    if (job.Status == "Live" || (demomode == true && job.Status == "Demo"))
                    {
                        bool filtered = false;
                        //Apply other filters
                        if (gender != "" && job.Gender != null && job.Gender != "")
                        {
                            if (job.Gender!=gender)
                            {
                                filtered = true;
                            }
                        }

                        if (!filtered)
                        {
                            DirectEmployerClientCampus campus = campusclient.GetByRowKey(geoindex.CampusRowKey);
                            DirectEmployerClient employer = clientclient.GetByRowKey(geoindex.ClientRowKey);

                            bool acceptingleads = false;

                            if (employer.Status == "Live" || (demomode == true && employer.Status == "Demo"))
                            {
                                if (campus.Status == "Live" || (demomode == true && campus.Status == "Demo"))
                                {
                                    //List<DirectEmployerClientCampusProgram> campusprograms = new List<DirectEmployerClientCampusProgram>(programclient.GetAllByClientId(employer.RowKey).Where(x => x.CampusRowKey == campus.RowKey));
                                    if (leadcounters == null)
                                    {
                                        leadcounters = new List<LeadCounter>(leadcounterclient.GetAll());
                                        leadcaps = new List<LeadCap>(leadcapclient.GetAll());
                                    }

                                    LeadCap schoolcap = leadcaps.Find(x => x.RowKey == employer.RowKey);
                                    LeadCap programcap = leadcaps.Find(x => x.RowKey == job.RowKey);
                                    LeadCounter schoolcounter = leadcounters.Find(x => x.RowKey == employer.RowKey);
                                    LeadCounter programcounter = leadcounters.Find(x => x.RowKey == job.RowKey);

                                    acceptingleads = AcceptingLeads(schoolcap, programcap, schoolcounter, programcounter);
                                    if (acceptingleads)
                                    {
                                        results.Add(new
                                        {
                                            clienttype = employer.ClientType,
                                            clientid = employer.ClientId,
                                            clientsetid = employer.ClientId,
                                            logoclientid = employer.ClientId,
                                            program = programid,
                                            formid = employer.FormId,
                                            distance = 0,
                                            campustype = campus.CampusType,
                                            campuskey = campus.CampusId,
                                            programkey = geoindex.RowKey,
                                            clientrowkey = employer.RowKey,

                                            jobkey = job.RowKey,
                                            jobtitle = job.JobTitle,
                                            company = employer.Name.ToJSONSafeString(),
                                            companylogo = "https://chaindate.blob.core.windows.net/resources/employerlogos/" + employer.ClientType + employer.RowKey,
                                            city = campus.City,
                                            state = campus.State,
                                            date = job.PostedDateTime.ToString("ddd, dd MMM yyyy HH:mm:ss") + " GMT",
                                            snippet = job.Description,

                                            attributescore = oattributes != null ? job.GetAttributeScore(oattributes) : 0,
                                            importantthingsscore = othings != null ? job.GetImportantThingsScore(othings) : 0

                                        });
                                    }

                                }
                            }
                        }
                    }
                }
            }

            return results;
        }

        


        private bool AcceptingLeads(LeadCap schoolcap, LeadCap programcap, LeadCounter schoolcounter, LeadCounter programcounter)
        {
            //Check program level
            if (programcap.Total > 0 && programcounter.Total >= programcap.Total)
            {
                return false;
            }
            if (programcap.Annually > 0 && programcounter.Annually >= programcap.Annually)
            {
                return false;
            }
            if (programcap.Monthly > 0 && programcounter.Monthly >= programcap.Monthly)
            {
                return false;
            }

            //Check school level
            if (schoolcap.Total > 0 && schoolcounter.Total >= schoolcap.Total)
            {
                return false;
            }
            if (schoolcap.Annually > 0 && schoolcounter.Annually >= schoolcap.Annually)
            {
                return false;
            }
            if (schoolcap.Monthly > 0 && schoolcounter.Monthly >= schoolcap.Monthly)
            {
                return false;
            }

            return true;
        }

    }



    class CompareGeoIndexResults : IEqualityComparer<IGeoIndex>
    {
        public bool Equals(IGeoIndex x, IGeoIndex y)
        {
            return x.RowKey == y.RowKey;
        }
        public int GetHashCode(IGeoIndex codeh)
        {
            return codeh.RowKey.GetHashCode();
        }
    }

}