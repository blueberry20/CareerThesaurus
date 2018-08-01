using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SkillCow.Classes.Helpers;
using SkillCow.Classes.Cloud.TableStorage.DirectClients.Schools.GeoIndex;
using SkillCow.Classes.Cloud.TableStorage.DirectClients.LeadCounters;
using SkillCow.Classes.Cloud.TableStorage.DirectClients.LeadCaps;
using SkillCow.Classes.Cloud.TableStorage.DirectClients.GeoIndex;

namespace SkillCow.Classes.Cloud.TableStorage.DirectClients.Schools
{
    public class DirectSchoolSearchEngine
    {

        public List<object> FindSchools(HttpRequestBase Request, string zipcode, string programcategoryid, string edulevel, ref List<string> directclientnames)
        {
            bool demomode = Request["demo"] != null && Request["demo"] == "1";

            LeadCounterClient leadcounterclient = new LeadCounterClient();
            List<LeadCounter> leadcounters = null;

            LeadCapClient leadcapclient = new LeadCapClient();
            List<LeadCap> leadcaps = null;

            List<object> results = new List<object>();

            if (programcategoryid.StartsWith("c"))
            {
                return results;
            }
            

            ZipCodeClient zipclient = new ZipCodeClient();
            ZipCode zipobject = zipclient.GetByRowKey(zipcode);
                        
            GeoIndexNationalClient nclient = new GeoIndexNationalClient();
            GeoIndexAddStateClient addstateclient = new GeoIndexAddStateClient();
            GeoIndexAddZipClient addzipclient = new GeoIndexAddZipClient();
            GeoIndexSubtractStateClient subtractstateclient = new GeoIndexSubtractStateClient();
            GeoIndexSubtractZipClient subtractzipclient = new GeoIndexSubtractZipClient();

            List<IGeoIndex> allresults = new List<IGeoIndex>();
            allresults.AddRange(nclient.GetAllByPartition(programcategoryid));

            if (zipobject != null)
            {
                allresults.AddRange(addstateclient.GetAllByPartition(zipobject.StateCode + "-" + programcategoryid));
                allresults.AddRange(addzipclient.GetAllByPartition(zipcode + "-" + programcategoryid));
            }

            List<IGeoIndex> subtractions = new List<IGeoIndex>();
            if (zipobject != null)
            {
                subtractions.AddRange(subtractstateclient.GetAllByPartition(zipobject.StateCode + "-" + programcategoryid));
                subtractions.AddRange(subtractzipclient.GetAllByPartition(zipcode + "-" + programcategoryid));
            }

            IEnumerable<IGeoIndex> difference = allresults.Except(subtractions, new CompareGeoIndexResults());

            IEnumerable<IGrouping<string, IGeoIndex>> bycampus = difference.GroupBy(x => x.CampusRowKey);

            DirectSchoolClientClient clientclient = new DirectSchoolClientClient();
            DirectSchoolClientCampusClient campusclient = new DirectSchoolClientCampusClient();
            DirectSchoolClientCampusProgramClient programclient = new DirectSchoolClientCampusProgramClient();

            foreach (IGrouping<string, IGeoIndex> campusgroup in bycampus)
            {
                DirectSchoolClientCampus campus = campusclient.GetByRowKey(campusgroup.Key);
                DirectSchoolClient school = clientclient.GetByRowKey(campus.ClientRowKey);
                bool acceptingleads = false;

                if (school.Status == "Live" || (demomode==true && school.Status=="Demo")) 
                {
                    if (campus.Status == "Live" || (demomode == true && campus.Status == "Demo"))
                    {
                        List<DirectSchoolClientCampusProgram> campusprograms = new List<DirectSchoolClientCampusProgram>(programclient.GetAllBySchoolId(school.RowKey).Where(x => x.CampusRowKey == campus.RowKey));

                        string programkey = "";
                        bool gotprogramkey = false;
                        List<object> programitems = new List<object>();
                        foreach (IGeoIndex programresult in campusgroup)
                        {
                            DirectSchoolClientCampusProgram program = campusprograms.SingleOrDefault(x => x.RowKey == programresult.RowKey);

                            if (program.Status == "Live" || (demomode == true && program.Status == "Demo"))
                            {

                                if (leadcounters == null)
                                {
                                    leadcounters = new List<LeadCounter>(leadcounterclient.GetAll());
                                    leadcaps = new List<LeadCap>(leadcapclient.GetAll());
                                }

                                LeadCap schoolcap = leadcaps.Find(x => x.RowKey == school.RowKey);
                                LeadCap programcap = leadcaps.Find(x => x.RowKey == program.RowKey);
                                LeadCounter schoolcounter = leadcounters.Find(x => x.RowKey == school.RowKey);
                                LeadCounter programcounter = leadcounters.Find(x => x.RowKey == program.RowKey);

                                //see if counters need to be reset
                                schoolcounter.ResetCountersIfNeeded(leadcounterclient);
                                programcounter.ResetCountersIfNeeded(leadcounterclient);

                                acceptingleads = AcceptingLeads(schoolcap, programcap, schoolcounter, programcounter);
                                if (acceptingleads)
                                {
                                    programitems.Add(new { id = program.ProgramId + "." + program.RowKey, type = program.ProgramType, typename = program.ResolveProgramTypeName(), isprimary = 1, name = program.Name.ToJSONSafeString() });
                                    if (!gotprogramkey)
                                    {
                                        if (",hs,ged,crt,sc,as,inhs,none,".Contains("," + edulevel.ToLower() + ","))
                                        {
                                            string testprogramkey = program.ProgramType;
                                            //Exclude MS
                                            if (!(",ms,ma,maed,mba,me,mfa,ms,mst,".Contains("," + testprogramkey.ToLower() + ",")))
                                            {
                                                programkey = HttpUtility.UrlDecode(program.ProgramId);
                                                gotprogramkey = true;
                                            }
                                        }
                                        else
                                        {

                                            programkey = HttpUtility.UrlDecode(program.ProgramId);
                                            gotprogramkey = true;

                                        }
                                    }
                                }
                            }
                        }

                        if (acceptingleads)
                        {
                            if (!directclientnames.Contains(school.Name))
                            {
                                directclientnames.Add(school.Name);
                            }

                            results.Add(new
                            {
                                clienttype = "direct",
                                formname = school.Name.ToJSONSafeString(),
                                clientfrontendname = school.Name.ToJSONSafeString(),
                                formdescription = school.Description.ToJSONSafeString(),
                                city = campus.City,
                                state = campus.State,
                                image = "https://chaindate.blob.core.windows.net/resources/schoollogos/" + school.RowKey,
                                clientid = school.ClientId,
                                clientsetid = school.ClientId,
                                logoclientid = school.ClientId,
                                program = programcategoryid,
                                formid = school.FormId,
                                distance = 0,
                                campustype = campus.CampusType,
                                campuskey = campus.CampusId,
                                programs = programitems.ToArray(),
                                programkey = programkey,
                                clientrowkey = school.RowKey

                            });
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