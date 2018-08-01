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
using SkillCow.Classes.ProgramMapper;
using SkillCow.Classes.Cloud.TableStorage.DirectClients.Schools;
using System.Text.RegularExpressions;

namespace SkillCow.Controllers
{
    public class SchoolsController : ControllerBase
    {
        //
        // GET: /CareerAssessment/

        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult GetSchoolsByProfession(string zip, string professionname, string professionid, string f, string edulevel)
        {
            try
            {
                

                if (f == null)
                    f = "";
                if (edulevel == null)
                    edulevel = "";

                DirectSchoolSearchEngine directschoolssearchengine = new DirectSchoolSearchEngine();

                ProgramMapper pm = new ProgramMapper();
                //pm.CheckNames();
                string degrees = pm.ResolveProgramId(professionname, professionid);

                int totalschoolsloaded = 0;
                string[] tokens = degrees.Split(',');
                Dictionary<string, XmlDocument> xmldocs = new Dictionary<string, XmlDocument>();
                foreach (string degree in tokens)
                {
                    if (degree.Trim() != "")
                    {
                        if (!xmldocs.ContainsKey(degree.Trim()))
                        {
                            XmlDocument doc = getXmlDoc("http://www.explore-schools.com/a3/xmlcapsulecreate.php?id=1727&code=aa798f5765dc0736aa8957a7968dffd3&desc=1&zip=" + zip + "&degree=" + degree.Trim() + "&campaign_id=13564694&show_searched_location=true");
                            xmldocs.Add(degree, doc);

                            totalschoolsloaded += doc.GetElementsByTagName("capsule").Count;

                            if (totalschoolsloaded > 30)
                            {
                                break;
                            }
                        }
                    }
                }

                Dictionary<string, string> filters = new Dictionary<string, string>();
                string[] filterPairs = f.Split(',');
                foreach (string pair in filterPairs)
                {
                    string[] pairTokens = pair.Split('=');
                    filters.Add(pairTokens[0], pairTokens[1]);
                }

                List<object> resultsets = new List<object>();
                List<string> directclientnames = new List<string>();
                    
                    
                foreach (KeyValuePair<string, XmlDocument> kv in xmldocs)
                {
                    XmlDocument xmldoc = kv.Value;
                    XmlNodeList items = xmldoc.GetElementsByTagName("capsule");

                    int cnt = 0;
                    List<object> schools = new List<object>();

                    //Add direct
                    schools.AddRange(directschoolssearchengine.FindSchools(Request, zip, kv.Key, edulevel, ref directclientnames));

                    foreach (XmlNode node in items)
                    {
                        cnt++;


                        string formname = node.SelectSingleNode("form_name").InnerText.ToJSONSafeString();
                        if (formname.Contains("Grand Can"))
                        {
                            Console.Write("GC");
                        }

                        string clientid = node.A("client_id");
                        string clientsetid = node.A("clientset_id");
                        string formid = node.A("id");
                        string distance = node.SelectSingleNode("distance").InnerText.Replace(",", "");
                        string imageurl = node.SelectSingleNode("image").InnerText.Replace("http:","https:");
                        string campustype = node.SelectSingleNode("campus").Attributes["type"].Value;
                        string campuskey = node.SelectSingleNode("campus").Attributes["id"].Value;

                        string clientfrontendname = node.SelectSingleNode("client_frontendname").InnerText.ToJSONSafeString();
                        string formdescription = node.SelectSingleNode("form_description").InnerText; //.ToJSONSafeString();
                        string city = node.SelectSingleNode("city").InnerText.ToJSONSafeString();
                        string state = node.SelectSingleNode("state").InnerText.ToJSONSafeString();

                        string programkey = "";
                        XmlNodeList programnodes = node.SelectNodes("program");
                        List<object> programitems = new List<object>();

                        bool gotprogramkey = false;
                        foreach (XmlNode programnode in programnodes)
                        {
                            programitems.Add(new { id = programnode.A("id"), type = programnode.A("program_type"), typename = programnode.A("program_type_name"), isprimary = programnode.A("is_primary"), name = programnode.InnerText.ToJSONSafeString() });
                            if (!gotprogramkey)
                            {
                                if (",hs,ged,crt,sc,as,inhs,none,".Contains("," + edulevel.ToLower() + ","))
                                {
                                    string testprogramkey = programnode.A("program_type");
                                    //Exclude MS
                                    if (!(",ms,ma,maed,mba,me,mfa,ms,mst,phd,psy,".Contains("," + testprogramkey.ToLower() + ",")))
                                    {
                                        programkey = HttpUtility.UrlDecode(programnode.A("id"));
                                        gotprogramkey = true;
                                    }
                                }
                                else
                                {

                                    programkey = HttpUtility.UrlDecode(programnode.A("id"));
                                    gotprogramkey = true;

                                }
                            }
                        }

                        string formjson = getSchoolForm(clientid, formid);
                        JObject formobject = JObject.Parse(formjson);

                        bool filtered = applyFilters(formobject, filters);

                        //Additional filters
                        if (formname.ToLower().Contains("grand canyon"))
                            filtered = true;

                        if (clientid == "3239" || clientid == "1759")
                            filtered = true;

                        if (programkey == "")
                            filtered = true;
                    
                        if (directclientnames.Contains(formname) || directclientnames.Contains(clientfrontendname))
                        {
                            filtered = true;
                        }
                    
                        if (!filtered)
                        {
                            schools.Add(new
                            {
                                clienttype = "network",
                                formname = formname,
                                clientfrontendname = clientfrontendname,
                                formdescription = formdescription,
                                city = city,
                                state = state,
                                image = imageurl,
                                clientid = clientid,
                                clientsetid = clientsetid,
                                logoclientid = clientsetid != "0" ? clientsetid : clientid,
                                program = kv.Key,
                                formid = formid,
                                distance = distance,
                                campustype = campustype,
                                campuskey = campuskey,
                                programs = programitems.ToArray(),
                                programkey = programkey
                            });
                        }
                    }

                    
                    resultsets.Add(new { degree = kv.Key, schools = schools });
                }



                Response.ContentType = "application/json";
                string retvalue = (new { result = "ok", resultsets = resultsets.ToArray(), resultid = ShortGuidGenerator.NewGuid() }).ToJSON();
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
        public ActionResult GetSchoolsWithForms(string zip, string degrees, string f, string edulevel, string medium)
        {
            try
            {
                if (f == null)
                    f = "";
                if (edulevel == null)
                    edulevel = "";

                //Program remapping helper
                ProgramMapper pm = new ProgramMapper();
                
                string[] tokens = degrees.Split(',');
                Dictionary<string, XmlDocument> xmldocs = new Dictionary<string, XmlDocument>();
                foreach (string degree in tokens)
                {
                    if(degree.Trim()!=""){
                        
                        //Remap the degrees if necessary
                        string[] programidprofessiontokens = degree.Split('|');

                        string remappeddegrees = "";
                        if (programidprofessiontokens.Length > 1)
                        {
                            remappeddegrees = pm.ResolveProgramId(programidprofessiontokens[1], programidprofessiontokens[0]);

                            string[] remappedtokens = remappeddegrees.Split(',');

                            foreach (string remappeddegree in remappedtokens)
                            {
                                if (!xmldocs.ContainsKey(remappeddegree.Trim()))
                                {
                                    xmldocs.Add(programidprofessiontokens[0], getXmlDoc("http://www.explore-schools.com/a3/xmlcapsulecreate.php?id=1727&code=aa798f5765dc0736aa8957a7968dffd3&desc=1&zip=" + zip + "&degree=" + remappeddegree.Trim() + "&campaign_id=13564694&show_searched_location=true"));
                                }
                            }
                        }
                        else
                        {
                            //NOT REMAPPED
                            if (!xmldocs.ContainsKey(degree.Trim()))
                            {
                                xmldocs.Add(degree, getXmlDoc("http://www.explore-schools.com/a3/xmlcapsulecreate.php?id=1727&code=aa798f5765dc0736aa8957a7968dffd3&desc=1&zip=" + zip + "&degree=" + degree.Trim() + "&campaign_id=13564694&show_searched_location=true"));
                            }
                        }
                    }
                }

                Dictionary<string, string> filters = new Dictionary<string, string>();
                string[] filterPairs = f.Split(',');
                foreach (string pair in filterPairs)
                {
                    string[] pairTokens = pair.Split('=');
                    filters.Add(pairTokens[0], pairTokens[1]);
                }

                List<object> resultsets = new List<object>();

                foreach (KeyValuePair<string, XmlDocument> kv in xmldocs)
                {
                    XmlDocument xmldoc = kv.Value;
                    XmlNodeList items = xmldoc.GetElementsByTagName("capsule");

                    int cnt = 0;
                    List<object> schools = new List<object>();
                    foreach (XmlNode node in items)
                    {
                        cnt++;
                        
                        
                        string formname = node.SelectSingleNode("form_name").InnerText.ToJSONSafeString();
                        string clientid = node.A("client_id");
                        string formid = node.A("id");
                        string distance = node.SelectSingleNode("distance").InnerText.Replace(",","");
                        string imageurl = node.SelectSingleNode("image").InnerText.Replace("http:", "https:");
                        string campustype = node.SelectSingleNode("campus").Attributes["type"].Value;
                        string campuskey = node.SelectSingleNode("campus").Attributes["id"].Value;

                        string clientfrontendname = node.SelectSingleNode("client_frontendname").InnerText.ToJSONSafeString();
                        string formdescription = node.SelectSingleNode("form_description").InnerText.ToJSONSafeString();
                        string city = node.SelectSingleNode("city").InnerText.ToJSONSafeString();
                        string state = node.SelectSingleNode("state").InnerText.ToJSONSafeString();

                        string programkey = "";
                        XmlNodeList programnodes = node.SelectNodes("program");
                        List<object> programitems = new List<object>();

                        bool gotprogramkey = false;
                        foreach (XmlNode programnode in programnodes)
                        {
                            programitems.Add(new { id = programnode.A("id"), type = programnode.A("program_type"), typename = programnode.A("program_type_name"), isprimary = programnode.A("is_primary"), name = programnode.InnerText.ToJSONSafeString() });
                            if (!gotprogramkey)
                            {
                                if (",hs,ged,crt,sc,as,inhs,none,".Contains("," + edulevel.ToLower() + ","))
                                {
                                    string testprogramkey = programnode.A("program_type");
                                    //Exclude MS
                                    if (!(",ms,ma,maed,mba,me,mfa,ms,mst,phd,psy,".Contains("," + testprogramkey.ToLower() + ",")))
                                    {
                                        programkey = HttpUtility.UrlDecode(programnode.A("id"));
                                        gotprogramkey = true;
                                    }
                                }
                                else
                                {

                                    programkey = HttpUtility.UrlDecode(programnode.A("id"));
                                    gotprogramkey = true;

                                }
                            }
                        }
                                                
                        string formjson = getSchoolForm(clientid, formid);
                        JObject formobject = JObject.Parse(formjson);

                        bool filtered = applyFilters(formobject, filters);

                        //Additional filters
                        if (formname.ToLower().Contains("grand canyon"))
                            filtered = true;

                        if (clientid == "3239" || clientid == "1759")
                            filtered = true;

                        //Filters for web only
                        if (medium!=null && medium == "web")
                        {
                            if (clientid == "4156" || clientid == "5779")
                            filtered = true;
                        }
                        

                        if (programkey == "")
                            filtered = true;

                        if (!filtered)
                        {
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
                        }
                    }

                    resultsets.Add(new { degree=kv.Key, schools = schools });
                }

                

                Response.ContentType = "application/json";
                string retvalue = (new { result = "ok", resultsets = resultsets.ToArray(), resultid = ShortGuidGenerator.NewGuid() }).ToJSON();
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
            string xml = GetHttpResponse(url, null);
            xml = RemoveTroublesomeCharacters(xml);

            //xml = xml.Replace("<?xml version=\"1.0\" encoding=\"UTF-8\"?>", "");

            XmlDocument xmldoc = new XmlDocument();
            byte[] byteArray = new byte[xml.Length];
            
            if (xml.Contains("ISO-8859-1"))
            {
                byteArray = Encoding.GetEncoding("ISO-8859-1").GetBytes(xml);
            }
            else
            {
                System.Text.ASCIIEncoding encoding = new System.Text.ASCIIEncoding();
                byteArray = encoding.GetBytes(xml);
            }

            // Load the memory stream
            MemoryStream memoryStream = new MemoryStream(byteArray);
            memoryStream.Seek(0, SeekOrigin.Begin);
            xmldoc.Load(memoryStream);
            return xmldoc;
        }
        private string RemoveTroublesomeCharacters(string inString)
        {
            if (inString == null) return null;

            StringBuilder newString = new StringBuilder();
            char ch;

            for (int i = 0; i < inString.Length; i++)
            {

                ch = inString[i];
                // remove any characters outside the valid UTF-8 range as well as all control characters
                // except tabs and new lines
                if ((ch < 0x00FD && ch > 0x001F) || ch == '\t' || ch == '\n' || ch == '\r')
                {
                    newString.Append(ch);
                }
            }
            return newString.ToString();

        }

        private string getSchoolForm(string clientid, string formid)
        {
            string datestamp = EasternTimeConverter.Convert(DateTime.UtcNow).ToString("yyyyMMdd");
            string cached = BlobJsonResourceManager.Instance.GetJsonResource("skillcowschoolforms", datestamp, "form" + formid);
            if (cached != null && cached.Trim() !="")
                return cached;

            SchoolFormParser parser = new SchoolFormParser();
            string json = parser.ConvertFormsXmlToJson(clientid, formid);
            BlobJsonResourceManager.Instance.SaveJsonResource(json, "form" + formid, "skillcowschoolforms", datestamp);
            return json;
        }

        [HttpPost]
        public ActionResult SchoolIndex(string z, string p)
        {
            try
            {
                CBNSchoolFormsClient formsclient = new CBNSchoolFormsClient();


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
                        if (city != "0" && state != "0")
                            addr = city + ", " + state;
                        else if (city == "0")
                            addr = state;
                        else
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

                Response.ContentType = "application/json";
                Response.Write((new { result = "ok", items = results.ToArray() }).ToJSON());
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
        public ActionResult FindSchoolsByCareer(string zip, string careers, string f, string edulevel)
        {
            Response.ContentType = "application/json";

            //For cloud caching
            string datestamp = EasternTimeConverter.Convert(DateTime.UtcNow).ToString("yyyyMMdd");

            try
            {
                if (f == null)
                    f = "";
                if (edulevel == null)
                    edulevel = "";

                
                //string cached = BlobJsonResourceManager.Instance.GetJsonResource("skillcowschoolresults", datestamp, "z" + zip + "c" + careers + "e" + edulevel);
                //if (cached != null && cached.Trim() != "")
                //{
                //    Response.Write(cached);
                //    Response.End();
                //    return null;
                //}

                int resultcount = 0;

                string[] tokens = careers.Split(',');
                Dictionary<string, XmlDocument> xmldocs = new Dictionary<string, XmlDocument>();
                foreach (string career in tokens)
                {
                    if (career.Trim() != "")
                    {
                        if (!xmldocs.ContainsKey(career.Trim()))
                        {
                            xmldocs.Add(career, getXmlDoc("http://www.explore-schools.com/a3/xmlcapsulecreate.php?id=1727&code=aa798f5765dc0736aa8957a7968dffd3&desc=1&zip=" + zip + "&career=" + career.Trim() + "&campaign_id=13564694&show_searched_location=true"));
                        }
                    }
                }

                Dictionary<string, string> filters = new Dictionary<string, string>();
                string[] filterPairs = f.Split(',');
                foreach (string pair in filterPairs)
                {
                    string[] pairTokens = pair.Split('=');
                    filters.Add(pairTokens[0], pairTokens[1]);
                }

                List<object> resultsets = new List<object>();

                foreach (KeyValuePair<string, XmlDocument> kv in xmldocs)
                {
                    XmlDocument xmldoc = kv.Value;
                    XmlNodeList items = xmldoc.GetElementsByTagName("capsule");

                    int cnt = 0;
                    List<object> schools = new List<object>();
                    foreach (XmlNode node in items)
                    {
                        cnt++;
                        string formname = node.SelectSingleNode("form_name").InnerText.ToJSONSafeString();
                        string clientfrontendname = node.SelectSingleNode("client_frontendname").InnerText.ToJSONSafeString();
                        string formdescription = node.SelectSingleNode("form_description").InnerText.ToJSONSafeString();
                        string city = node.SelectSingleNode("city").InnerText.ToJSONSafeString();
                        string state = node.SelectSingleNode("state").InnerText.ToJSONSafeString();
                        string clientid = node.A("client_id");
                        string formid = node.A("id");
                        string distance = node.SelectSingleNode("distance").InnerText.Replace(",", "");
                        string imageurl = node.SelectSingleNode("image").InnerText.Replace("http:", "https:");
                        string campustype = node.SelectSingleNode("campus").Attributes["type"].Value;
                        string campuskey = node.SelectSingleNode("campus").Attributes["id"].Value;

                        string programkey = "";
                        XmlNodeList programnodes = node.SelectNodes("program");
                        List<object> programitems = new List<object>();

                        bool gotprogramkey = false;
                        foreach (XmlNode programnode in programnodes)
                        {
                            programitems.Add(new {id = programnode.A("id"), type = programnode.A("program_type"), typename = programnode.A("program_type_name"), isprimary = programnode.A("is_primary"), name = programnode.InnerText.ToJSONSafeString() });
                            if (!gotprogramkey)
                            {
                                if (",hs,ged,crt,sc,as,inhs,none,".Contains("," + edulevel.ToLower() + ","))
                                {
                                    string testprogramkey = programnode.A("program_type");
                                    //Exclude MS
                                    if (!(",ms,ma,maed,mba,me,mfa,ms,mst,".Contains("," + testprogramkey.ToLower() + ",")))
                                    {
                                        programkey = HttpUtility.UrlDecode(programnode.A("id"));
                                        gotprogramkey = true;
                                    }
                                }
                                else
                                {

                                    programkey = HttpUtility.UrlDecode(programnode.A("id"));
                                    gotprogramkey = true;

                                }
                            }
                        }


                        string formjson = getSchoolForm(clientid, formid);
                        JObject formobject = JObject.Parse(formjson);

                        bool filtered = applyFilters(formobject, filters);

                        //Additional filters
                        if (formname.ToLower().Contains("grand canyon"))
                            filtered = true;

                        if (clientid == "3239" || clientid == "1759")
                            filtered = true;

                        if (programkey == "")
                            filtered = true;

                        if (!filtered)
                        {

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
                                programkey = programkey //,
                                //form = formobject
                            });
                            resultcount++;
                        }
                    }

                    resultsets.Add(new { degree = kv.Key, schools = schools });
                }


                string retvalue = (new { result = "ok", resultsets = resultsets.ToArray() }).ToJSON();

                //if (resultcount > 0)
                //{
                //    BlobJsonResourceManager.Instance.SaveJsonResource(retvalue, "z" + zip + "c" + careers + "e" + edulevel, "skillcowschoolresults", datestamp);
                //}

                Response.Write(retvalue);
                Response.End();
            }
            catch (Exception ex)
            {
                
                Response.Write(DefaultErrorResponse(ex.Message));
                Response.End();
            }

            return null;
        }


        [HttpPost]
        public ActionResult FindSchoolsByDegree(string zip, string career, string degrees, string f, string edulevel)
        {
            Response.ContentType = "application/json";

            //For cloud caching
            string datestamp = EasternTimeConverter.Convert(DateTime.UtcNow).ToString("yyyyMMdd");

            try
            {
                if (f == null)
                    f = "";
                if (edulevel == null)
                    edulevel = "";
                
                //string cached = BlobJsonResourceManager.Instance.GetJsonResource("skillcowschoolresults", datestamp, "z" + zip + "c" + careers + "e" + edulevel);
                //if (cached != null && cached.Trim() != "")
                //{
                //    Response.Write(cached);
                //    Response.End();
                //    return null;
                //}

                int networkresultcount = 0;
                List<object> resultsets = new List<object>();
                List<string> directclientnames = new List<string>();
                
                DirectSchoolSearchEngine directschoolssearchengine = new DirectSchoolSearchEngine();

                string[] tokens = degrees.Split(',');
                Dictionary<string, XmlDocument> xmldocs = new Dictionary<string, XmlDocument>();
                foreach (string degree in tokens)
                {
                    if (degree.Trim() != "")
                    {
                        if (!xmldocs.ContainsKey(degree.Trim()))
                        {
                            //Add direct
                            List<object> schools = new List<object>();
                            schools.AddRange(directschoolssearchengine.FindSchools(Request, zip, degree, edulevel, ref directclientnames));
                            if (schools.Count > 0)
                            {
                                resultsets.Add(new { degree = degree, schools = schools });
                            }

                            xmldocs.Add(degree, getXmlDoc("http://www.explore-schools.com/a3/xmlcapsulecreate.php?id=1727&code=aa798f5765dc0736aa8957a7968dffd3&desc=1&zip=" + zip + "&degree=" + degree.Trim() + "&campaign_id=13564694&show_searched_location=true"));
                        }
                    }

                }
                
                Dictionary<string, string> filters = new Dictionary<string, string>();
                string[] filterPairs = f.Split(',');
                foreach (string pair in filterPairs)
                {
                    string[] pairTokens = pair.Split('=');
                    filters.Add(pairTokens[0], pairTokens[1]);
                }

                ProcessXmlDocs(xmldocs, ref directclientnames, filters, edulevel, ref networkresultcount, ref resultsets);

                if (networkresultcount == 0)
                {
                    //Check if no network results by degree then load by career
                    if (career != null && career.Trim() != "")
                    {
                        xmldocs = new Dictionary<string, XmlDocument>();
                        xmldocs.Add("c" + career, getXmlDoc("http://www.explore-schools.com/a3/xmlcapsulecreate.php?id=1727&code=aa798f5765dc0736aa8957a7968dffd3&desc=1&zip=" + zip + "&career=" + career.Trim() + "&campaign_id=13564694&show_searched_location=true"));
                        ProcessXmlDocs(xmldocs, ref directclientnames, filters, edulevel, ref networkresultcount, ref resultsets);
                    }
                }

                string retvalue = (new { result = "ok", resultsets = resultsets.ToArray() }).ToJSON();

                //if (resultcount > 0)
                //{
                //    BlobJsonResourceManager.Instance.SaveJsonResource(retvalue, "z" + zip + "c" + careers + "e" + edulevel, "skillcowschoolresults", datestamp);
                //}

                Response.Write(retvalue);
                Response.End();
            }
            catch (Exception ex)
            {

                Response.Write(DefaultErrorResponse(ex.Message));
                Response.End();
            }

            return null;
        }


        private void ProcessXmlDocs(Dictionary<string, XmlDocument> xmldocs, ref List<string> directclientnames, Dictionary<string, string> filters, string edulevel, ref int networkresultcount, ref List<object> resultsets)
        {
            foreach (KeyValuePair<string, XmlDocument> kv in xmldocs)
            {
                XmlDocument xmldoc = kv.Value;
                XmlNodeList items = xmldoc.GetElementsByTagName("capsule");

                int cnt = 0;
                List<object> schools = new List<object>();

                //Add network
                foreach (XmlNode node in items)
                {
                    cnt++;
                    string formname = node.SelectSingleNode("form_name").InnerText.ToJSONSafeString();
                    string clientfrontendname = node.SelectSingleNode("client_frontendname").InnerText.ToJSONSafeString();
                    string formdescription = RemoveLinks(node.SelectSingleNode("form_description").InnerText.Replace("Â", "").ToJSONSafeString().Replace("http://", "https://"));

                    string city = node.SelectSingleNode("city").InnerText.ToJSONSafeString();
                    string state = node.SelectSingleNode("state").InnerText.ToJSONSafeString();
                    string clientid = node.A("client_id");
                    string clientsetid = node.A("clientset_id");
                    string formid = node.A("id");
                    string distance = node.SelectSingleNode("distance").InnerText.Replace(",", "");
                    string imageurl = node.SelectSingleNode("image").InnerText.Replace("http:", "https:");
                    string campustype = node.SelectSingleNode("campus").Attributes["type"].Value;
                    string campuskey = node.SelectSingleNode("campus").Attributes["id"].Value;

                    string programkey = "";
                    XmlNodeList programnodes = node.SelectNodes("program");
                    List<object> programitems = new List<object>();

                    bool gotprogramkey = false;
                    foreach (XmlNode programnode in programnodes)
                    {
                        programitems.Add(new { id = programnode.A("id"), type = programnode.A("program_type"), typename = programnode.A("program_type_name"), isprimary = programnode.A("is_primary"), name = programnode.InnerText.ToJSONSafeString() });
                        if (!gotprogramkey)
                        {
                            if (",hs,ged,crt,sc,as,inhs,none,".Contains("," + edulevel.ToLower() + ","))
                            {
                                string testprogramkey = programnode.A("program_type");
                                //Exclude MS
                                if (!(",ms,ma,maed,mba,me,mfa,ms,mst,".Contains("," + testprogramkey.ToLower() + ",")))
                                {
                                    programkey = HttpUtility.UrlDecode(programnode.A("id"));
                                    gotprogramkey = true;
                                }
                            }
                            else
                            {

                                programkey = HttpUtility.UrlDecode(programnode.A("id"));
                                gotprogramkey = true;

                            }
                        }
                    }


                    string formjson = getSchoolForm(clientid, formid);
                    JObject formobject = JObject.Parse(formjson);

                    bool filtered = applyFilters(formobject, filters);

                    //Additional filters
                    if (formname.ToLower().Contains("grand canyon"))
                        filtered = true;

                    if (clientid == "3239" || clientid == "1759")
                        filtered = true;

                    if (programkey == "")
                        filtered = true;

                    if (directclientnames.Contains(formname) || directclientnames.Contains(clientfrontendname))
                    {
                        filtered = true;
                    }

                    if (!filtered)
                    {

                        schools.Add(new
                        {
                            clienttype = "network",
                            formname = formname,
                            clientfrontendname = clientfrontendname,
                            formdescription = formdescription,
                            city = city,
                            state = state,
                            image = imageurl,
                            clientid = clientid,
                            clientsetid = clientsetid,
                            logoclientid = clientsetid != "0" ? clientsetid : clientid,
                            program = kv.Key,
                            formid = formid,
                            distance = distance,
                            campustype = campustype,
                            campuskey = campuskey,
                            programs = programitems.ToArray(),
                            programkey = programkey
                        });
                        networkresultcount++;
                    }
                }
                resultsets.Add(new { degree = kv.Key, schools = schools });
            }
        }

        private string RemoveLinks(string text)
        {
            string tag = "";
            int cnt = 0;
            do
            {
                tag = FindTag(text, "<a", "</a>");
                if (tag!="")
                {
                    string fullstarttag = GetFullTag(text, "<a");
                    string tagcontents = GetTagContents(tag, fullstarttag, "</a>");
                    if (tagcontents.Contains("<div") ||
                        tagcontents.Contains("<img") ||
                        tagcontents.Contains("<span"))
                    {
                        //Contains HTML elements

                        string hrefattribute = FindTag(tag, "href=\"", "\"");
                        if (hrefattribute != "")
                        {
                            string newtag = tag.Replace(hrefattribute, "href=\"\"");
                            text = text.Replace(tag, newtag);
                        }
                    }
                    else
                    {
                        //Contains text
                        string hrefattribute = FindTag(tag, "href=\"", "\"");
                        if (hrefattribute != "")
                        {
                            string hrefurl = GetTagContents(hrefattribute, "href=\"", "\"");
                            hrefurl.Replace("http://", "").Replace("https://", "");
                            if (hrefurl.EndsWith("/"))
                            {
                                hrefurl = hrefurl.Substring(0, hrefurl.Length - 1);
                            }
                            text = text.Replace(tag, hrefurl);
                        }
                        else
                        {
                            text = text.Replace(tag, tagcontents);
                        }
                    }
                }

            } while (tag.Length > 0 && cnt++<100);

            return text;
        }

        protected string FindTag(string source, string start, string end)
        {
            int startpos = source.IndexOf(start);

            if (startpos >= 0)
            {
                int endpos = source.IndexOf(end, startpos + start.Length);
                if (endpos >= 0)
                {
                    return source.Substring(startpos, (endpos + end.Length - startpos));
                }
                else
                {
                    return "";
                }
            }
            else
                return "";
        }

        protected string GetTagContents(string source, string starttag, string endtag)
        {
            int startpos = source.ToLower().IndexOf(starttag.ToLower());
            if (startpos == -1)
                return "";

            int endpos = source.ToLower().IndexOf(endtag.ToLower(), startpos + starttag.Length);

            if (startpos >= 0 && endpos >= 0)
            {
                return source.Substring(startpos + starttag.Length, endpos - startpos - starttag.Length);
            }
            else
            {
                return "";
            }
        }

        protected bool IsNumeric(string val)
        {
            double result;
            if (double.TryParse(val, out result))
                return true;
            return false;
        }

        protected string GetFullTag(string source, string startswith)
        {
            int startpos = source.ToLower().IndexOf(startswith.ToLower());

            if (startpos < 0)
                return "";

            int endpos = source.ToLower().IndexOf(">", startpos);

            if (endpos < 0)
                return "";

            return source.Substring(startpos, endpos - startpos + 1);
        }
    }
}
