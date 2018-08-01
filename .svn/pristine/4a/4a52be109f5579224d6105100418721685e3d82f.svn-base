using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Text;

using SkillCow.Classes.Cloud.TableStorage.PersonalityTests.CBNProfessions;
using SkillCow.Classes.Helpers;
using SkillCow.Classes.Cloud.BlobStorage;
using SkillCow.Classes.Cloud.TableStorage.PersonalityTests.CBNSchoolForms;
using System.Reflection;
using SkillCow.Classes.Cloud.TableStorage.PersonalityTests.Tests.SkillAssessment;
using System.IO;
using SkillCow.Classes.Cloud.TableStorage;
using SkillCow.Classes.Cloud.TableStorage.PersonalityTests.SkillCowRequestSubmissions;
using System.Globalization;
using Microsoft.WindowsAzure.StorageClient;
using System.Xml;
using System.Net;
using SkillCow.Classes;
using Newtonsoft.Json.Linq;

namespace SkillCow.Controllers
{
    public class SchoolProgramResult
    {
        public string ClientId { get; set; }
        public string ClientSetId { get; set; }
        public string FormId { get; set; }
        public string FormName { get; set; }
        public string FrontEndName { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Distance { get; set; }
        public string Payout { get; set; }
        public string CampusId { get; set; }
        public string CampusType { get; set; }
        public string CampusName { get; set; }
        public string ProgramId { get; set; }
        public string ProgramType { get; set; }
        public string ProgramTypeName { get; set; }
        public string ProgramIsPrimary { get; set; }
        public string ProgramName { get; set; }
        public string Filters { get; set; }
    }
    public class ProgramTaxonomyItem
    {
        public string ParentId { get; set; }
        public string ParentName { get; set; }
        public string ProgramId { get; set; }
        public string ProgramName { get; set; }
    }
#if DEBUG
    public class AdminController : ControllerBase
    {
        public string FixDemoSource(string startdate)
        {
            int cnt = 0;

            SkillCowRequestSubmissionClient rsc = new SkillCowRequestSubmissionClient();

            DateTime cursordate = DateTime.ParseExact(startdate,"yyyyMMdd", CultureInfo.InvariantCulture);

            List<SkillCowRequestSubmission> submissions = new List<SkillCowRequestSubmission>();

            while(cursordate<DateTime.UtcNow.AddDays(1))
            {
                CloudTableQuery<SkillCowRequestSubmission> query = rsc.GetAll(cursordate.ToString("yyyyMMdd"));

                foreach (SkillCowRequestSubmission s in query.Execute().Where(x => x.UtmSource == "demo"))
                {
                    submissions.Add(s);
                }
                
                cursordate = cursordate.AddDays(1);
            }

            foreach (SkillCowRequestSubmission x in submissions)
            {
                x.UtmSource = "Kiosks";
                x.UtmCampaign = "JerseyGardens";
                x.UtmTerm = "Station1";
                rsc.Update(x);
            }

            return cnt.ToString() + " leads fixed";
        }

        //
        // GET: /Admin/\
        public string PublishZipCodesToBlob()
        {
            ZipCodeClient zcc = new ZipCodeClient();

            int cnt = 0;

            StringBuilder sb = new StringBuilder();

            List<ZipCode> zipcodes = new List<ZipCode>(zcc.GetAll().Execute());
            foreach(ZipCode z in zipcodes)
            {
                if (cnt > 3297)
                {
                    try
                    {
                        object jo = new { zip = z.RowKey, city = z.City, state = z.State, statecode = z.StateCode, county = z.County };
                        BlobJsonResourceManager.Instance.SaveJsonResourceToExistingContainer(jo.ToJSON(), z.RowKey, "skillcow", "zipcodes");
                    }
                    catch
                    {
                        //Failed zip codes
                        sb.AppendLine(z.RowKey);
                    }
                }
                cnt++;
            }

            return cnt + " processed";
        }
        public string UploadZipCodes(int start)
        {
            ZipCodeClient zcc = new ZipCodeClient();

            bool processing = false;

            int cnt = 0;
            int lineno = 0;

            using (StreamReader sr = new StreamReader(@"c:\chaindate\skillcow\zipcodes.csv"))
            {
                string line = sr.ReadLine();
                lineno++;


                while(line!=null)
                {
                    line = sr.ReadLine();

                    lineno++;

                    if (lineno >= start)
                    {
                        processing = true;
                    }

                    if (line != null)
                    {
                        List<string> tokens = ParseCSV(line);

                        if (tokens.Count > 0)
                        {
                            try
                            {
                                string zip = tokens[0];

                                if (processing)
                                {
                                    if (zip.Length < 5)
                                    {
                                        zip = String.Format("{0:00000}", int.Parse(zip));
                                    }

                                    int result = zcc.AddNewItem(new ZipCode { RowKey = zip, City = tokens[1], State = tokens[2], StateCode = tokens[3], County = tokens[4] });

                                    if (result > 0)
                                    {
                                        processing = true;
                                    }
                                    //object jo = new { zip = zip, city = tokens[1], state = tokens[2], statecode = tokens[3], county = tokens[4] };

                                    //BlobJsonResourceManager.Instance.SaveJsonResource(jo.ToJSON(), zip, "skillcow", "zipcodes");

                                    cnt++;
                                }

                                //if (zip == "31759")
                                //{
                                //    processing = true;
                                //}
                            }
                            catch
                            {
                            }
                        }
                    }
                }
            }

            return cnt + " processed";
        }
        public static List<string> ParseCSV(string line)
        {
            int q = 0;

            StringBuilder sb = new StringBuilder();
            List<string> values = new List<string>();

            foreach (char c in line)
            {
                if (c == '\"')
                {
                    q++;
                }
                if (c == ',' && q % 2 == 0)
                {
                    values.Add(sb.ToString().Replace("\"", ""));
                    sb = new StringBuilder();
                }
                else
                {
                    sb.Append(c);
                }


            }
            values.Add(sb.ToString().Replace("\"", ""));

            return values;
        }

        public string ExportJSONP()
        {
            CBNProfessionClient pc = new CBNProfessionClient();
            List<CBNProfession> professions = new List<CBNProfession>(pc.GetAll());
            
            //ExportProfessionsWithAttributesForSkillTest(professions);
            //ExportProfessionBranches(professions);
            //ExportProfessionsByBranch(professions);

            //ExportProfessionsByAttribute(professions);

            //ExportSchoolsByProgramId(professions);

            QuestionClient qc = new QuestionClient();
            List<Question> questions = new List<Question>(qc.GetAllByPartition("skillcowtestshort").OrderBy(x => x.Sequence).Where(x=>x.Sequence>=19));
            
            ExportTestQuestions(questions, "ultrashorttest", false);

            return "ok";
        }

        private void ExportProfessionsWithAttributesForSkillTest(List<CBNProfession> professions)
        {
            List<object> items = new List<object>();

            foreach (CBNProfession p in professions)
            {
                items.Add(new {
                    RowKey = p.RowKey,
                    Profession = p.Profession.ToJSONSafeString(),
                    CareerVertical = p.CareerVertical.ToJSONSafeString(),
                    Discipline = p.Discipline.ToJSONSafeString(),
                    Branch= p.Branch.ToJSONSafeString(),
                    Program= p.Program.ToJSONSafeString(),
                    Attitude= p.Attitude,
                    Information= p.Information,
                    Evidence= p.Evidence,
                    Processing= p.Processing,
                    Action= p.Action,
                    Endurance= p.Endurance,
                    Presence= p.Presence,
                    Concentration= p.Concentration,
                    Patterns= p.Patterns,
                    Compensation= p.Compensation,
                    ProgramId= p.ProgramId,
                    DisplayName= p.DisplayName.FixProfessionNameAbbreviations(),

                    Beauty = p.Beauty,
                    Helping = p.Helping,
                    Adventure = p.Adventure,
                    Safety = p.Safety,
                    People = p.People,

                    Science= p.Science,
                    Easy = p.Easy,
                    Duty = p.Duty,
                    Admiration = p.Admiration,
                    Creativity = p.Creativity,

                    Competition = p.Competition,
                    Animals = p.Animals,
                    Politics = p.Politics,
                    Technology = p.Technology,
                    Growth = p.Growth,

                    VMProdId = p.VMProdId,

                    UrlParam = p.DisplayName.FormatProfessionNameAsUrlParam()
                });
            }
        
            object o = new {items=items.ToArray()};

            BlobJsonResourceManager.Instance.SaveJsonResource(o.ToJSON(), "allwithattributes", "skillcow", "professions");
        }

        private void ExportProfessionsByAttribute(List<CBNProfession> professions)
        {
            Dictionary<string, KeyValuePair<string, string>> attributes = GetUniqueAttributePairs(professions);

            foreach (KeyValuePair<string, KeyValuePair<string, string>> attribute in attributes)
            {
                string propertyname = attribute.Key.Split('.')[0];
                List<object> items = new List<object>();
                foreach (CBNProfession p in professions)
                {
                    Type t = p.GetType();
                    PropertyInfo prop = t.GetProperty(propertyname);
                    string value = prop.GetValue(p, null).ToString();

                    if (attribute.Value.Key == value)
                    {
                        items.Add(new
                        {
                            RowKey = p.RowKey,
                            Profession = p.Profession.ToJSONSafeString(),
                            CareerVertical = p.CareerVertical.ToJSONSafeString(),
                            Discipline = p.Discipline.ToJSONSafeString(),
                            Branch = p.Branch.ToJSONSafeString(),
                            Program = p.Program.ToJSONSafeString(),
                            Attitude = p.Attitude,
                            Information = p.Information,
                            Evidence = p.Evidence,
                            Processing = p.Processing,
                            Action = p.Action,
                            Endurance = p.Endurance,
                            Presence = p.Presence,
                            Concentration = p.Concentration,
                            Patterns = p.Patterns,
                            Compensation = p.Compensation,
                            ProgramId = p.ProgramId,
                            DisplayName = p.DisplayName.FixProfessionNameAbbreviations(),
                            UrlParam = p.DisplayName.FormatProfessionNameAsUrlParam()
                        });
                    }
                }
                object o = new { attribute = propertyname, value = attribute.Value.Key, opposite = attribute.Value.Value, items = items.ToArray() };

                BlobJsonResourceManager.Instance.SaveJsonResource(o.ToJSON(), propertyname.ToLower() + "-" + attribute.Value.Key.ToLower(), "skillcow", "professions");
            }
        }

        private Dictionary<string, KeyValuePair<string, string>> GetUniqueAttributePairs(List<CBNProfession> professions)
        {
            Dictionary<string, KeyValuePair<string, string>> results = new Dictionary<string, KeyValuePair<string, string>>();
            
            string v1="", v2="";

            string[] propertynames = new string[] { "Attitude", "Information", "Evidence", "Processing", "Action", "Endurance", "Presence", "Concentration", "Patterns", "Compensation" };

            foreach (string propertyname in propertynames)
            {
                v1 = ""; v2 = "";
                foreach (CBNProfession p in professions)
                {
                    Type t = p.GetType();
                    PropertyInfo prop = t.GetProperty(propertyname);
                    string value = prop.GetValue(p, null).ToString();
                    if (value != null && value != "")
                    {
                        if (v1 == "")
                            v1 = value;
                        else if(value!=v1)
                            v2 = value;

                        if (v1 != "" && v2 != "")
                        {
                            results.Add(propertyname + "." + v1, new KeyValuePair<string, string>(v1, v2));
                            results.Add(propertyname + "." + v2, new KeyValuePair<string, string>(v2, v1));
                            break;
                        }
                    }
                }
            }

            return results;
        }

        private void ExportProfessionsByBranch(List<CBNProfession> professions)
        {
            foreach (string branchname in UniqueBranchNames(professions))
            {
                List<object> careers = new List<object>();
                foreach (CBNProfession p in professions)
                {
                    if (p.Branch == branchname)
                    {
                        careers.Add(new
                        {
                            rowkey = p.RowKey,
                            displayname = p.DisplayName.FixProfessionNameAbbreviations().ToJSONSafeString(),
                            urlparam = p.DisplayName.FormatProfessionNameAsUrlParam().ToJSONSafeString(),
                            program = p.Program.FixProgramNameAbbreviations().ToJSONSafeString()
                        });
                    }
                }

                object o = new
                {
                    branch = branchname.ToJSONSafeString(),
                    items = careers.ToArray()
                };

                string branchurlparam = branchname.FormatProfessionNameAsUrlParam();
                BlobJsonResourceManager.Instance.SaveJsonResource(o.ToJSON(), branchurlparam, "skillcow", "professions");
            }
            
        }
        private List<string> UniqueBranchNames(List<CBNProfession> professions)
        {
            List<string> results = new List<string>();
            foreach (CBNProfession p in professions)
            {
                if (!results.Contains(p.Branch))
                {
                    results.Add(p.Branch);
                }
            }
            return results;
        }

        public void ExportProfessionBranches(List<CBNProfession> professions)
        {
            Dictionary<string, int> uniques = new Dictionary<string, int>();
            foreach (CBNProfession p in professions)
            {
                if (uniques.ContainsKey(p.Branch))
                {
                    uniques[p.Branch]++;
                }
                else
                {
                    uniques.Add(p.Branch, 1);
                }
            }

            List<object> branches = new List<object>();
            foreach (KeyValuePair<string, int> kv in uniques)
            {
                branches.Add(new
                {
                    branch = kv.Key.ToJSONSafeString(),
                    id = kv.Key.ToJSONSafeString().Replace(" ", "").Replace(",", ""),
                    urlparam = kv.Key.FormatProfessionNameAsUrlParam().ToJSONSafeString(),
                    count = kv.Value
                });
            }

            object o = new { items = branches.ToArray() };
            BlobJsonResourceManager.Instance.SaveJsonResource(o.ToJSON(), "branches", "skillcow", "professions");
        }

        private void ExportSchoolsByProgramId(List<CBNProfession> professions)
        {
            CBNSchoolFormsClient formsclient = new CBNSchoolFormsClient();
            
            foreach (string p in UniqueProgramIds(professions))
            {
                List<object> results = new List<object>();
                int cnt = 0;
                foreach (CBNSchoolForm form in formsclient.GetAllByPartition(p))
                {
                    cnt++;
                    string formname = form.FormName;
                    string city = form.CampusCity;
                    string state = form.CampusState;
                    string addr = "";
                    string distance = "";

                    if (city != "" && state != "")
                    {
                        if (city.Trim() != "0" && state.Trim() != "0")
                            addr = city + ", " + state;
                        else if (city.Trim() == "0" && state.Trim() != "0")
                            addr = state;
                        else if (state.Trim() == "0" && city.Trim() != "0")
                            addr = city;
                    }

                    string imageurl = form.FormImage;
                    string link = form.FormUrl;

                    string campustype = form.CampusType;
                    string campusname = form.CampusName;
                    string programgroup = form.ProgramGroup;

                    List<object> programitems = new List<object>();

                    string description = form.FormDescription.ToJSONSafeString();

                    results.Add(new
                    {
                        schoolid = form.SchoolId,
                        formid = form.FormId,
                        formname = formname.ToJSONSafeString(),
                        formdescription = description,
                        city = city.ToJSONSafeString(),
                        state = state.ToJSONSafeString(),
                        address = addr.ToJSONSafeString(),
                        distance = distance.ToJSONSafeString(),
                        imageurl = imageurl.ToJSONSafeString(),
                        link = link.ToJSONSafeString(),
                        campustype = campustype.ToLower().ToJSONSafeString(),
                        campusname = campusname.ToJSONSafeString(),
                        programgroup = programgroup.ToJSONSafeString(),
                        programs = programitems.ToArray(),
                        programname = form.ProgramName.ToJSONSafeString(),
                        programtype = form.ProgramType.ToJSONSafeString()
                    });
                }

                object o = new { items = results.ToArray() };
                BlobJsonResourceManager.Instance.SaveJsonResource(o.ToJSON(), "p" + p, "skillcow", "schoolsbyprogram");
            }
        }

        private List<string> UniqueProgramIds(List<CBNProfession> professions)
        {
            List<string> results = new List<string>();
            foreach (CBNProfession p in professions)
            {
                if (!results.Contains(p.ProgramId))
                {
                    results.Add(p.ProgramId);
                }
            }
            return results;
        }


        private void ExportTestQuestions(List<Question> questions, string testid, bool usetiebrekaers)
        {
            List<object> items = new List<object>();

            foreach (Question q in questions)
            {
                items.Add(new
                {
                    RowKey = q.RowKey,
                    Text = q.Text.ToJSONSafeString(),
                    Value1 = q.Value1.ToJSONSafeString(),
                    Value2 = q.Value2.ToJSONSafeString(),
                    Dimension = q.Dimension.ToJSONSafeString(),
                    Answer1 = q.Answer1.ToLower().ToJSONSafeString(),
                    Answer2 = q.Answer2.ToLower().ToJSONSafeString(),
                    TiebreakerFor = usetiebrekaers ? q.TiebreakerFor.ToJSONSafeString() : ""
                });
                
            }
                        
            object o = new { items = items.ToArray() };

            BlobJsonResourceManager.Instance.SaveJsonResource(o.ToJSON(), testid, "skillcow", "tests");
        }

        
        public ActionResult ProgramCoverageByZip(string zip)
        {
            List<ProgramTaxonomyItem> taxonomy = new List<ProgramTaxonomyItem>();
            using (StreamReader sr = new StreamReader(@"c:\chaindate\skillcow\programtaxonomy.csv"))
            {
                string line = sr.ReadLine(); //Skip header
                line = sr.ReadLine();

                while (line != null)
                {
                    List<string> tokens = ParseCSV(line);

                    taxonomy.Add(new ProgramTaxonomyItem { ParentId = tokens[0], ParentName = tokens[1], ProgramId = tokens[2], ProgramName = tokens[3] } );
                    line = sr.ReadLine();
                }
            }

            ViewBag.Taxonomy = taxonomy;
            ViewBag.Controller = this;
            ViewBag.Zip = zip;

            Response.ContentType = "application/vnd.ms-excel";
            Response.AppendHeader("content-disposition", "attachment; filename=ProgramCoverage_byzip_" + zip + ".csv");

            Response.AddHeader("Cache-Control", "must-revalidate");
            Response.AddHeader("Pragma", "must-revalidate");

            return View();
        }
        
        public List<SchoolProgramResult> ParseSchools(XmlDocument xmldoc)
        {
            XmlNodeList items = xmldoc.GetElementsByTagName("capsule");

            int cnt = 0;
            List<SchoolProgramResult> programs = new List<SchoolProgramResult>();
            foreach (XmlNode node in items)
            {
                cnt++;
                
                string clientid = node.A("client_id");
                string formid = node.A("id");
                
                //string formjson = getSchoolForm(clientid, formid);
                //JObject formobject = JObject.Parse(formjson);
                //string filters = FiltersAsString(formobject);

                XmlNodeList programnodes = node.SelectNodes("program");

                XmlNode campus = node.SelectSingleNode("campus");

                foreach (XmlNode programnode in programnodes)
                {
                    programs.Add(new SchoolProgramResult {
                         ClientId = node.A("client_id"),
                         ClientSetId = node.A("clientset_id"),
                         FormId = node.A("id"),
                         FormName = node.E("form_name"), 
                         FrontEndName = node.E("client_frontendname"), 
                         City = node.E("city"), 
                         State = node.E("state"), 
                         Distance = node.E("distance"), 
                         Payout = node.E("payout"), 
                         CampusId = campus.A("id"),
                         CampusType = campus.A("type"), 
                         CampusName = campus.InnerText,
                         ProgramId = programnode.A("id"),
                         ProgramType = programnode.A("program_type"), 
                         ProgramTypeName = programnode.A("program_type_name"), 
                         ProgramIsPrimary = programnode.A("is_primary"), 
                         ProgramName = programnode.InnerText
                         //Filters = filters 
                    });

                    //programitems.Add(new { id = programnode.A("id"), type = programnode.A("program_type"), typename = programnode.A("program_type_name"), isprimary = programnode.A("is_primary"), name = programnode.InnerText });
                }

                /*
                    schools.Add(new
                    {
                        formname = formname,
                        clientfrontendname = clientfrontendname,
                        formdescription = formdescription,
                        city = city,
                        state = state,
                        image = imageurl,
                        clientid = clientid,
                        program = kv.Key,
                        formid = formid,
                        distance = distance,
                        campustype = campustype,
                        campuskey = campuskey,
                        programs = programitems.ToArray(),
                        programkey = programkey
                    });
                 * */
                //}
            }

            return programs;
        }

        public string FiltersAsString(JObject formobject)
        {
            StringBuilder sb = new StringBuilder();

            var filters = formobject["filters"];
            for (int f = 0; f < filters.Count(); f++)
            {
                var rules = filters[f]["rules"];

                for (int r = 0; r < rules.Count(); r++)
                {
                    var lines = rules[r]["lines"];

                    for (int l = 0; l < lines.Count(); l++)
                    {
                        var line = lines[l];

                        string fieldName = line["fieldname"].ToString();
                        string op = line["op"].ToString();
                        var values = line["values"];

                        sb.Append(fieldName + op.Replace("neq", "==").Replace("eq", "!=") + " " + values + "; ");
                    }
                }
            }

            return sb.ToString();
        }


        public string getSchoolForm(string clientid, string formid)
        {
            string datestamp = EasternTimeConverter.Convert(DateTime.UtcNow).ToString("yyyyMMdd");
            string cached = BlobJsonResourceManager.Instance.GetJsonResource("skillcowschoolforms", datestamp, "form" + formid);
            if (cached != null && cached.Trim() != "")
                return cached;

            SchoolFormParser parser = new SchoolFormParser();
            string json = parser.ConvertFormsXmlToJson(clientid, formid);
            BlobJsonResourceManager.Instance.SaveJsonResource(json, "form" + formid, "skillcowschoolforms", datestamp);

            return json;
        }
        public XmlDocument getXmlDoc(string url)
        {
            string xml = GetHttpResponse(url, null);
            xml = xml.Replace("<?xml version=\"1.0\" encoding=\"UTF-8\"?>", "");

            XmlDocument xmldoc = new XmlDocument();

            byte[] byteArray = new byte[xml.Length];
            System.Text.ASCIIEncoding encoding = new System.Text.ASCIIEncoding();
            byteArray = encoding.GetBytes(xml);

            // Load the memory stream
            MemoryStream memoryStream = new MemoryStream(byteArray);
            memoryStream.Seek(0, SeekOrigin.Begin);

            try
            {
                xmldoc.Load(memoryStream);
            }
            catch(Exception ex)
            {
                Console.Write(ex.Message);
            }
            return xmldoc;
        }
        protected string GetHttpResponse(string requestUrl, byte[] data)
        {
            // declare objects
            string responseData = String.Empty;
            HttpWebRequest req = null;
            HttpWebResponse resp = null;
            StreamReader strmReader = null;

            try
            {
                req = (HttpWebRequest)HttpWebRequest.Create(requestUrl);

                // in case of POST you need to post data
                if ((data != null) && (data.Length > 0))
                {
                    using (Stream strm = req.GetRequestStream())
                    {
                        strm.Write(data, 0, data.Length);
                    }
                }

                resp = (HttpWebResponse)req.GetResponse();
                strmReader = new StreamReader(resp.GetResponseStream());
                responseData = strmReader.ReadToEnd().Trim();
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
            finally
            {
                if (req != null)
                {
                    req = null;
                }

                if (resp != null)
                {
                    resp.Close();
                    resp = null;
                }
            }

            return responseData;
        }

        public ActionResult ExportProfiles1()
        {
            SkillCowRequestSubmissionClient rsc = new SkillCowRequestSubmissionClient();

            ViewBag.StartDate = EasternTimeConverter.Convert(DateTime.UtcNow);
            ViewBag.EndDate = EasternTimeConverter.Convert(DateTime.UtcNow);


            return View(rsc);
        }
        [HttpPost]
        public ActionResult ExportProfiles1(FormCollection collection)
        {
            SkillCowRequestSubmissionClient rsc = new SkillCowRequestSubmissionClient();

            ViewBag.StartDate = DateTime.ParseExact(collection["startdate"], "yyyyMMdd", CultureInfo.InvariantCulture);
            ViewBag.EndDate = DateTime.ParseExact(collection["enddate"], "yyyyMMdd", CultureInfo.InvariantCulture);

            return View(rsc);
        }
    }
#endif
}
