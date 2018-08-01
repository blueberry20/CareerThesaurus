using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Text;
using System.Net;
using System.IO;

using SkillCow.Classes.Cloud.TableStorage.PersonalityTests.Tests.SkillAssessment;
using SkillCow.Classes.Cloud.TableStorage.PersonalityTests.CBNProfessions;
using SkillCow.Classes.Cloud.BlobStorage;
using SkillCow.Classes.Helpers;
using SkillCow.Classes.Cloud.TableStorage.PersonalityTests.CBNSchoolForms;
using System.Xml;
using SkillCow.Classes;
using Newtonsoft.Json.Linq;
using SkillCow.Classes.Cloud.TableStorage;

namespace SkillCow.Controllers
{
    public class TENJobsController : ControllerBase
    {
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult MatchJobs(string zip, string attributes, string things)
        {
            try
            {
                ZipCodeClient zcc = new ZipCodeClient();
                ZipCode zipcode = zcc.GetByRowKey(zip);

                if (zipcode == null)
                {
                    throw new Exception("Invalid ZIP");
                }

                JObject oattributes = JObject.Parse(attributes);
                JObject othings = JObject.Parse(things);

                AttributeMaskCalculator amc = new AttributeMaskCalculator();
                long attributemask = amc.GetMask(oattributes);

                ImportantThingsMaskCalculator itmc = new ImportantThingsMaskCalculator();
                long importantthingsmask = itmc.GetMask(othings);

                JobPostingClient jpc = new JobPostingClient();

                List<object> jobs = new List<object>();
                    
                foreach (JobPosting posting in jpc.GetAllBySource("TEN").Execute().Where(x=>x.IsLive!=null && x.IsLive==true))
                {
                    if (posting.AttributeMask!=null && (posting.AttributeMask & attributemask) == attributemask)
                    {
                        bool targetsusa = false;
                        bool targetsstate = false;
                        bool targetszip = false;

                        if (posting.GeoTarget != null)
                        {
                            targetsusa = posting.GeoTarget.Contains("USA");
                            targetsstate = posting.GeoTarget.Contains(zipcode.StateCode);
                            targetszip = posting.GeoTarget.Contains(zipcode.RowKey);
                        }
                        else
                        {
                            Console.Write("geo target not set");
                        }

                        if (targetsusa || targetsstate || targetszip)
                        {
                            try
                            {
                                jobs.Add(new
                                {
                                    id = posting.RowKey,
                                    jobtitle = posting.JobTitle != null ? posting.JobTitle.ToJSONSafeString() : "",
                                    description = posting.Description != null ? posting.Description.ToJSONSafeString() : "",
                                    clientid = posting.ClientId,
                                    clientname = posting.CompanyName != null ? posting.CompanyName.ToJSONSafeString() : "",
                                    formattedlocation = posting.FormattedLocation != null ? posting.FormattedLocation.ToJSONSafeString() : "",
                                    logoimage = posting.Logo,

                                    formid = posting.FormId,
                                    campuskey = posting.PositionLocationId,
                                    campusvalue = posting.PositionLocationName != null ? posting.PositionLocationName.ToJSONSafeString() : "",

                                    //zips = node.E("zips"),
                                    //keywords = node.E("keywords"),
                                    date = posting.PostedDateTime != null ? posting.PostedDateTime.ToString("dd/MM/yyyy HH:mm") : "",
                                    referencenumber = posting.ReferenceId,

                                    dimattitude = posting.DimensionAttitude,
                                    dimaction = posting.DimensionAction,
                                    dimcompensation = posting.DimensionCompensation,
                                    dimconcentration = posting.DimensionConcentration,
                                    dimendurance = posting.DimensionEndurance,
                                    diminformation = posting.DimensionInformation,
                                    dimpatterns = posting.DimensionPatterns,
                                    dimprocessing = posting.DimensionProcessing,
                                    dimpresence = posting.DimensionPresence,

                                    thingadmiration = posting.ImportantThingsAdmiration,
                                    thingadventure = posting.ImportantThingsAdventure,
                                    thinganimals = posting.ImportantThingsAnimals,
                                    thingbeauty = posting.ImportantThingsBeauty,
                                    thingcompetition = posting.ImportantThingsCompetition,

                                    thingcreativity = posting.ImportantThingsCreativity,
                                    thingduty = posting.ImportantThingsDuty,
                                    thingeasy = posting.ImportantThingsEasy,
                                    thinggrowth = posting.ImportantThingsGrowth,
                                    thinghelping = posting.ImportantThingsHelping,

                                    thingpeople = posting.ImportantThingsPeople,
                                    thingpolitics = posting.ImportantThingsPolitics,
                                    thingsafety = posting.ImportantThingsSafety,
                                    thingscience = posting.ImportantThingsScience,
                                    thingtechnology = posting.ImportantThingsTechnology,

                                    attributescore = posting.GetAttributeScore(oattributes),
                                    importantthingsscore = posting.GetImportantThingsScore(othings)

                                });
                            }
                            catch (Exception ex)
                            {
                                Console.Write(ex.Message);
                            }
                        }
                    }
                }
                

                Response.ContentType = "application/json";
                string retvalue = (new { result = "ok", jobs = jobs.ToArray() }).ToJSON();
                Response.Write(retvalue);
                Response.End();
            }
            catch (Exception ex)
            {
                Response.ContentType = "application/json";
                Response.Write(DefaultErrorResponse(ex.Message));
                Response.End();
            }

            return null;
        }
        


        [HttpPost]
        public ActionResult FindJobs(string zip, string title, int pagesize, int pagenumber)
        {
            try
            {
                Dictionary<string, XmlDocument> xmldocs = new Dictionary<string, XmlDocument>();
                string[] tokens = title.Split(',');
                foreach (string term in tokens)
                {
                    if (term.Trim() != "")
                    {
                        if (!xmldocs.ContainsKey(term.Trim()))
                        {
                            xmldocs.Add(term, getXmlDoc("http://www.employmentnetwork.net/xml/?campus_type=j&site_id=1002&campaign_id=13574568&zip=" + zip + "&job_title_name=" + HttpUtility.HtmlEncode(term)));
                        }
                    }
                }

                List<object> resultsets = new List<object>();
                int cnt = 0;
                int loadedcnt = 0;

                foreach (KeyValuePair<string, XmlDocument> kv in xmldocs)
                {
                    XmlDocument xmldoc = kv.Value;
                    XmlNodeList items = xmldoc.GetElementsByTagName("listing");

                    
                    List<object> jobs = new List<object>();
                    foreach (XmlNode node in items)
                    {
                        cnt++;

                        int currentpage = (cnt - (cnt % pagesize)) / pagesize + 1;

                        if (currentpage == pagenumber)
                        {
                            loadedcnt++;

                            List<object> programitems = new List<object>();
                            XmlNode programvaluesnode = node.SelectSingleNode("program_values");
                            if (programvaluesnode != null)
                            {
                                XmlNodeList programnodes = programvaluesnode.SelectNodes("item");
                                foreach (XmlNode programnode in programnodes)
                                {
                                    string desc = programnode.E("description");
                                    programitems.Add(new
                                    {
                                        jobtype = programnode.E("job_type"),
                                        value = programnode.E("value"),
                                        link = programnode.E("link"),
                                        description = desc.Replace("<br/>", "").Replace("<br>", ""),
                                        description2 = programnode.E("description2")
                                    });
                                }
                            }

                            jobs.Add(new
                            {
                                clientid = node.E("client_id"),
                                clientname = node.E("client_name"),
                                city = node.E("city"),
                                state = node.E("state"),
                                country = node.E("country"),
                                logoimage = node.E("logo_image"),

                                formid = node.E("form_id"),
                                campuskey = node.E("campus_key"),
                                campusvalue = node.E("campus_value"),

                                zips = node.E("zips"),
                                keywords = node.E("keywords"),
                                date = node.E("date"),
                                referencenumber = node.E("reference_number"),

                                programs = programitems
                            });

                            if (loadedcnt >= pagesize)
                            {
                                break;
                            }
                        }
                        
                    }

                    resultsets.Add(new { term = kv.Key.ToJSONSafeString(), jobs = jobs });
                    if (loadedcnt >= pagesize)
                    {
                        break;
                    }
                }

                

                Response.ContentType = "application/json";
                string retvalue = (new { result = "ok", resultsets = resultsets.ToArray() }).ToJSON();
                Response.Write(retvalue);
                Response.End();
            }
            catch (Exception ex)
            {
                Response.ContentType = "application/json";
                Response.Write(DefaultErrorResponse(ex.Message));
                Response.End();
            }

            return null;
        }
        private string getForm(string clientid, string formid)
        {
            string datestamp = EasternTimeConverter.Convert(DateTime.UtcNow).ToString("yyyyMMdd");
            string cached = BlobJsonResourceManager.Instance.GetJsonResource("skillcowjobforms", datestamp, "form" + formid);
            if (cached != null && cached.Trim() != "")
                return cached;

            SchoolFormParser parser = new SchoolFormParser();
            string json = parser.ConvertFormsXmlToJson(clientid, formid);
            BlobJsonResourceManager.Instance.SaveJsonResource(json, "form" + formid, "skillcowjobforms", datestamp);

            return json;
        }
        private bool applyFilters(JObject formobject, Dictionary<string, string> filterDictionary)
        {
            bool filtered = false;
            string reason = "";

            var filters = formobject["filters"];
            for (int f = 0; f < filters.Count(); f++)
            {
                var rules = filters[f]["rules"];

                for (int r = 0; r < rules.Count(); r++)
                {
                    var lines = rules[r]["lines"];

                    int trueCount=0;
                    for (int l = 0; l < lines.Count(); l++)
                    {
                        var line = lines[l];

                        string fieldName = line["fieldname"].ToString();
                        string op = line["op"].ToString();
                        var values = line["values"];


                        if (filterDictionary.ContainsKey(fieldName))
                        {
                            for (int v = 0; v < values.Count(); v++)
                            {
                                
                                string filterValue = values[v].ToString();
                                bool wildstart = filterValue.StartsWith("*");
                                bool wildend = filterValue.EndsWith("*");

                                filterValue = filterValue.Replace("*", "");

                                #region Comparisons
                                switch (op)
                                {
                                    case "eq":
                                        if (wildstart && wildend)
                                        {
                                            if (filterDictionary[fieldName].Contains(filterValue))
                                            {
                                                string tempReason = fieldName + ": " + filterDictionary[fieldName] + " contains " + filterValue;
                                                if(reason=="")
                                                    reason = tempReason;
                                                else
                                                    reason += ", " + tempReason;

                                                trueCount++;
                                            }
                                        }
                                        else if (wildstart)
                                        {
                                            if (filterDictionary[fieldName].EndsWith(filterValue))
                                            {
                                                string tempReason = fieldName + ": " + filterDictionary[fieldName] + " ends with " + filterValue;
                                                if(reason=="")
                                                    reason = tempReason;
                                                else
                                                    reason += ", " + tempReason;

                                                trueCount++;
                                            }
                                        }
                                        else if (wildend)
                                        {
                                            if (filterDictionary[fieldName].StartsWith(filterValue))
                                            {
                                                string tempReason = fieldName + ": " + filterDictionary[fieldName] + " starts with " + filterValue;
                                                if (reason == "")
                                                    reason = tempReason;
                                                else
                                                    reason += ", " + tempReason;

                                                trueCount++;
                                            }
                                        }
                                        else 
                                        {
                                            if (filterDictionary[fieldName] == filterValue)
                                            {
                                                string tempReason = fieldName + ": " + filterDictionary[fieldName] + " equals " + filterValue;
                                                if (reason == "")
                                                    reason = tempReason;
                                                else
                                                    reason += ", " + tempReason;

                                                trueCount++;
                                            }
                                        }
                                        
                                        break;
                                    case "neq":
                                        if (wildstart && wildend)
                                        {
                                            if (!filterDictionary[fieldName].Contains(filterValue))
                                            {
                                                string tempReason = fieldName + ": " + filterDictionary[fieldName] + " does not contain " + filterValue;
                                                if (reason == "")
                                                    reason = tempReason;
                                                else
                                                    reason += ", " + tempReason;

                                                trueCount++;
                                            }
                                        }
                                        else if (wildstart)
                                        {
                                            if (!filterDictionary[fieldName].EndsWith(filterValue))
                                            {
                                                string tempReason = fieldName + ": " + filterDictionary[fieldName] + " does not end with " + filterValue;
                                                if (reason == "")
                                                    reason = tempReason;
                                                else
                                                    reason += ", " + tempReason;

                                                trueCount++;
                                            }
                                        }
                                        else if (wildend)
                                        {
                                            if (!filterDictionary[fieldName].StartsWith(filterValue))
                                            {
                                                string tempReason = fieldName + ": " + filterDictionary[fieldName] + " does not start with " + filterValue;
                                                if (reason == "")
                                                    reason = tempReason;
                                                else
                                                    reason += ", " + tempReason;

                                                trueCount++;
                                            }
                                        }
                                        else
                                        {
                                            if (filterDictionary[fieldName] != filterValue)
                                            {
                                                string tempReason = fieldName + ": " + filterDictionary[fieldName] + " does not equal " + filterValue;
                                                if (reason == "")
                                                    reason = tempReason;
                                                else
                                                    reason += ", " + tempReason;

                                                trueCount++;
                                            }
                                        }
                                        break;
                                }
                                #endregion

                            }
                        }

                        if (trueCount == lines.Count())
                        {
                            filtered = true;
                            break;
                        }
                        
                    }
                    if (filtered)
                        break;
                }
                if (filtered)
                    break;
            }

            Console.Write(reason);
            return filtered;
        }

        private XmlDocument getXmlDoc(string url)
        {
            string xml = "";

            string datestamp = EasternTimeConverter.Convert(DateTime.UtcNow).ToString("yyyyMMdd");
            string cached = BlobJsonResourceManager.Instance.GetJsonResource("skillcowtenjobresults", datestamp, "tenjobs");
            if (cached != null && cached.Trim() != "")
            {
                xml = cached;
            }
            else
            {
                xml = GetHttpResponse(url, null);
                BlobJsonResourceManager.Instance.SaveJsonResource(xml, "tenjobs", "skillcowtenjobresults", datestamp);
            }
            
            xml = xml.Replace("<?xml version=\"1.0\" encoding=\"UTF-8\"?>", "");

            XmlDocument xmldoc = new XmlDocument();

            byte[] byteArray = new byte[xml.Length];
            System.Text.ASCIIEncoding encoding = new System.Text.ASCIIEncoding();
            byteArray = encoding.GetBytes(xml);

            // Load the memory stream
            MemoryStream memoryStream = new MemoryStream(byteArray);
            memoryStream.Seek(0, SeekOrigin.Begin);
            xmldoc.Load(memoryStream);
            return xmldoc;
        }

        public ActionResult JobPostings(long am)
        {
            
            ViewBag.AttributeMask = am;

            return View();
        }

        public ActionResult All()
        {
            return View(getXmlDoc("http://www.employmentnetwork.net/xml/?campus_type=j&site_id=1002&campaign_id=13574568&zip=&job_title_name=jobs"));
        }

        public ActionResult new20()
        {
            return View(getXmlDoc("http://www.employmentnetwork.net/xml/?campus_type=j&site_id=1002&campaign_id=13574568&zip=&job_title_name=jobs"));
        }

        public ActionResult showstale()
        {
            return View(getXmlDoc("http://www.employmentnetwork.net/xml/?campus_type=j&site_id=1002&campaign_id=13574568&zip=&job_title_name=jobs"));
        }

        public ActionResult live()
        {
            return View();
        }

        public ActionResult dupes()
        {
            return View();
        }

        public ActionResult MarkListingAsFailedImport(string id)
        {
            JobPostingClient jpc = new JobPostingClient();
            JobPosting posting = new JobPosting();

            posting.PostedDateTime = DateTime.UtcNow;
            posting.ReferenceId = id;
            posting.Source = "TEN";
            posting.JobTitle = "FAILED IMPORT";

            jpc.AddNewItem(posting);

            return RedirectToAction("new20");
        }

        public ActionResult CreateListing(string id)
        {
            ViewBag.ReferenceNumber = id;
            ViewBag.XmlDoc = getXmlDoc("http://www.employmentnetwork.net/xml/?campus_type=j&site_id=1002&campaign_id=13574568&zip=&job_title_name=jobs");

            JobPosting posting = new JobPosting();
            posting.PostedDateTime = DateTime.UtcNow;

            XmlNodeList items = ViewBag.XmlDoc.GetElementsByTagName("listing");
            foreach (XmlNode node in items)
            {
                if (node.E("reference_number") == id)
                {
                    XmlNode programvaluesnode = node.SelectSingleNode("program_values");
                    XmlNode programnode = null;
                    if (programvaluesnode != null)
                    {
                        XmlNodeList programnodes = programvaluesnode.SelectNodes("item");
                        if (programnodes.Count > 0)
                        {
                            programnode = programnodes[0];
                        }
                    }
                
                    posting.ClientId = node.E("client_id");
                    posting.CompanyName = node.E("client_name");
                    posting.Logo = node.E("logo_image");
                    posting.JobTitle = programnode.E("value");
                    posting.Description = programnode.E("description2");

                    if(node.E("city")!="" && node.E("state")!="")
                    {
                        posting.FormattedLocation = node.E("city") + ", " + node.E("state");
                    }
                    else if(node.E("city")!="" && node.E("state")=="")
                    {
                        posting.FormattedLocation = node.E("city");
                    }
                    else if(node.E("city")=="" && node.E("state")!="")
                    {
                        posting.FormattedLocation = node.E("state");
                    }
                    else 
                    {
                        posting.FormattedLocation = "";
                    }
                    
                    posting.Source = "TEN";
                    posting.FormId = node.E("form_id");
                    posting.PositionLocationId = node.E("campus_key");
                    posting.PositionLocationName = node.E("campus_value");
                    
                    posting.ReferenceId = node.E("reference_number");
                    posting.URL = programnode.E("link");

                    string geotargeting = node.E("zips");
                    int stringByteLength = System.Text.ASCIIEncoding.ASCII.GetByteCount(geotargeting);

                    //if (geotargeting.Length > 64000)
                    //{
                    //    posting.GeoTarget = geotargeting.Substring(0, 64000);
                    //    posting.GeoTarget2 = geotargeting.Substring(64000, geotargeting.Length - 64000);
                    //}
                    //else
                    //{
                        posting.GeoTarget = geotargeting;
                        //}

                    posting.GeoTargetType = "zip";

                    Console.WriteLine(node.E("keywords").Length);
                    posting.Keywords = node.E("keywords");
        
                    break;
                }
            }

            return View(posting);
        }

        [HttpPost]
        public ActionResult CreateListing(JobPosting newposting)
        {
            JobPostingClient jpc = new JobPostingClient();

            newposting.PostedDateTime = DateTime.UtcNow;

            AttributeMaskCalculator amc = new AttributeMaskCalculator();
            newposting.AttributeMask = amc.GetMask(newposting);

            ImportantThingsMaskCalculator itmc = new ImportantThingsMaskCalculator();
            newposting.ImportantThingsMask = itmc.GetMask(newposting);


            jpc.AddNewItem(newposting);

            return RedirectToAction("new20");
        }

        public ActionResult CreateFromTemplate(string tenid, string templateid)
        {
            JobPostingClient jpc = new JobPostingClient();

            XmlDocument xmldoc = getXmlDoc("http://www.employmentnetwork.net/xml/?campus_type=j&site_id=1002&campaign_id=13574568&zip=&job_title_name=jobs");

            JobPosting posting = new JobPosting();
            posting.PostedDateTime = DateTime.UtcNow;

            XmlNodeList items = xmldoc.GetElementsByTagName("listing");
            foreach (XmlNode node in items)
            {
                if (node.E("reference_number") == tenid)
                {
                    XmlNode programvaluesnode = node.SelectSingleNode("program_values");
                    XmlNode programnode = null;
                    if (programvaluesnode != null)
                    {
                        XmlNodeList programnodes = programvaluesnode.SelectNodes("item");
                        if (programnodes.Count > 0)
                        {
                            programnode = programnodes[0];
                        }
                    }

                    posting.ClientId = node.E("client_id");
                    posting.CompanyName = node.E("client_name");
                    posting.Logo = node.E("logo_image");
                    posting.JobTitle = programnode.E("value");
                    posting.Description = programnode.E("description2");

                    if (node.E("city") != "" && node.E("state") != "")
                    {
                        posting.FormattedLocation = node.E("city") + ", " + node.E("state");
                    }
                    else if (node.E("city") != "" && node.E("state") == "")
                    {
                        posting.FormattedLocation = node.E("city");
                    }
                    else if (node.E("city") == "" && node.E("state") != "")
                    {
                        posting.FormattedLocation = node.E("state");
                    }
                    else
                    {
                        posting.FormattedLocation = "";
                    }

                    posting.Source = "TEN";
                    posting.FormId = node.E("form_id");
                    posting.PositionLocationId = node.E("campus_key");
                    posting.PositionLocationName = node.E("campus_value");

                    posting.ReferenceId = node.E("reference_number");
                    posting.URL = programnode.E("link");

                    string geotargeting = node.E("zips");
                    //if (geotargeting.Length > 65536)
                    //{
                    //    posting.GeoTarget = geotargeting.Substring(0, 65536);
                    //    posting.GeoTarget2 = geotargeting.Substring(65536, geotargeting.Length - 65536);
                    //}
                    //else
                    //{
                        posting.GeoTarget = geotargeting;
                    //}

                    posting.GeoTargetType = "zip";

                    posting.Keywords = node.E("keywords");

                    break;
                }
            }

            posting.PostedDateTime = DateTime.UtcNow;


            JobPosting template = jpc.GetByRowKey(templateid);

            posting.DimensionAttitude = template.DimensionAttitude;
            posting.DimensionAction = template.DimensionAction;
            posting.DimensionCompensation = template.DimensionCompensation;

            posting.DimensionConcentration = template.DimensionConcentration;
            posting.DimensionEndurance = template.DimensionEndurance;
            posting.DimensionInformation = template.DimensionInformation;

            posting.DimensionPatterns = template.DimensionPatterns;
            posting.DimensionPresence = template.DimensionPresence;
            posting.DimensionProcessing = template.DimensionProcessing;

            posting.ImportantThingsAdmiration = template.ImportantThingsAdmiration;
            posting.ImportantThingsAdventure = template.ImportantThingsAdventure;
            posting.ImportantThingsAnimals = template.ImportantThingsAnimals;
            posting.ImportantThingsBeauty = template.ImportantThingsBeauty;
            posting.ImportantThingsCompetition = template.ImportantThingsCompetition;

            posting.ImportantThingsCreativity = template.ImportantThingsCreativity;
            posting.ImportantThingsDuty = template.ImportantThingsDuty;
            posting.ImportantThingsEasy = template.ImportantThingsEasy;
            posting.ImportantThingsGrowth = template.ImportantThingsGrowth;
            posting.ImportantThingsHelping = template.ImportantThingsHelping;

            posting.ImportantThingsPeople = template.ImportantThingsPeople;
            posting.ImportantThingsPolitics = template.ImportantThingsPolitics;
            posting.ImportantThingsSafety = template.ImportantThingsSafety;
            posting.ImportantThingsScience = template.ImportantThingsScience;
            posting.ImportantThingsTechnology = template.ImportantThingsTechnology;


            posting.AttributeMask = template.AttributeMask;
            posting.ImportantThingsMask = template.ImportantThingsMask;


            jpc.AddNewItem(posting);

            return RedirectToAction("editlisting", new {id=posting.RowKey});
        }

        public ActionResult EditListing(string id)
        {
            JobPostingClient jpc = new JobPostingClient();
            
            ViewBag.XmlDoc = getXmlDoc("http://www.employmentnetwork.net/xml/?campus_type=j&site_id=1002&campaign_id=13574568&zip=&job_title_name=jobs");

            return View(jpc.GetByRowKey(id));
        }
        [HttpPost]
        public ActionResult EditListing(JobPosting posting)
        {
            JobPostingClient jpc = new JobPostingClient();
            posting.PostedDateTime = DateTime.UtcNow;

            
            AttributeMaskCalculator amc = new AttributeMaskCalculator();
            posting.AttributeMask = amc.GetMask(posting);

            ImportantThingsMaskCalculator itmc = new ImportantThingsMaskCalculator();
            posting.ImportantThingsMask = itmc.GetMask(posting);


            jpc.Update(posting);

            return RedirectToAction("jobpostings", new { am=262143 });
        }


        public ActionResult ManualTest()
        {
            return View();
        }

    }
}
