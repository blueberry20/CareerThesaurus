using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Xml;
using System.Text;
using SkillCowResponsive.Classes.Helpers;
using System.IO;
using System.Net;
using SkillCowResponsive.Classes.CookieData;
using SkillCowResponsive.Classes.Cloud.TableStorage;
using SkillCowResponsive.Classes.Cloud.TableStorage.PersonalityTests.SkillCowRequestSubmissions;
using SkillCowResponsive.Models;

namespace SkillCowResponsive.Controllers
{
    public class RequestController : AuthenticatedControllerController
    {

        public ActionResult Info()
        {
            return View();
        }
        public ActionResult ThankYou()
        {
            return View();
        }
        [HttpPost]
        public JsonResult SubmitRecord(CBNRecord record)
        {
            string url = "http://www.explore-schools.com/thankyou/affiliate_submission.php";
            StringBuilder sb = new StringBuilder("campaign_id=13631493&client_id=20");
            sb.Append("&firstname=" + record.firstname);
            sb.Append("&lastname=" + record.lastname);
            sb.Append("&email=" + record.email);
            sb.Append("&city=" + record.city);
            sb.Append("&state=" + record.state);
            sb.Append("&zip=" + record.zip);
            sb.Append("&phone=" + record.phone);
            sb.Append("&campus_key=Main&program_key=Main");
            sb.Append("&ip=" + record.ip);
            sb.Append("&aff_id=1727");
            string postStr = sb.ToString();
            string result = SubmitLead(postStr, url);
            return new JsonResult { Data = new { result = "ok", data = result }, MaxJsonLength = Int32.MaxValue };
        }
        

        [HttpPost]
        public HttpResponse getform(string id)
        {
            try
            {
                //string results = GetHttpResponse("http://www.collegesurfing.com/a3/xmlformfeed2.php?id=1727&form_id=" + id + "&v=5&g=y&s=y&f=y&p=y&hc=y", null);
                string results = GetHttpResponse("http://www.explore-schools.com/a3/xmlformfeed2.php?id=1727&form_id=" + id + "&v=5.1&g=y&s=y&f=y&p=y&hc=y", null);
                XmlDocument xml = new XmlDocument();
                xml.LoadXml(results);
                string jsonString = JsonConvert.SerializeXmlNode(xml);
                Response.ContentType = "application/json";
                Response.Write("{\"result\": \"ok\", \"results\": " + jsonString.Replace("\n", "").Replace("@", "").Replace("�", "'") + " }");
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
        public HttpResponse SubmitSchool(FormCollection collection)
        {
            string result = SubmitForm(collection, "school");
            string output = "";
            if (result == "Filtered")
            {
                output = "filter";
            }
            else
            {
                output = "ok";
            }
            Response.ContentType = "application/json";
            Response.Write("{\"result\": \"ok\", \"results\": \"" + output +  "\" }");
            Response.End();
            return null;
        }
        [HttpPost]
        public HttpResponse SubmitJob(FormCollection collection)
        {
            string result = SubmitForm(collection, "job");
            string output = "";
            if (result == "Filtered")
            {
                output = "filter";
            }
            else
            {
                output = "ok";
            }
            Response.ContentType = "application/json";
            Response.Write("{\"result\": \"ok\", \"results\": \"" + output + "\" }");
            Response.End();
            return null;
        }

        private string SubmitForm(FormCollection collection, string target)
        {
            string submissionResult;
            string campaignid;
            string url;
            string ipaddress = RandomHelper.Instance.Next(1, 256) + "." + RandomHelper.Instance.Next(0, 256) + "." + RandomHelper.Instance.Next(0, 256) + "." + RandomHelper.Instance.Next(1, 256);
            if (target == "school") {
                campaignid = "13601764";
                url = "http://explore-schools.com/affiliate/submit/";
            }
            else
            {
                campaignid = "13601765";
                url = "http://explore-schools.com/affiliate/submit/";
            }
            string submit = collection["submit"] != "true" ? "false" : "true";
            List<string> output = new List<string>();
            foreach (var key in collection.AllKeys)
            {
                if (key.ToLower() == "educationlevel")
                {
                    output.Add(new StringBuilder("education_level" + "=" + HttpUtility.UrlEncode(collection[key])).ToString());
                }
                else if (key.ToLower() == "client")
                {
                    output.Add(new StringBuilder("client_id" + "=" + HttpUtility.UrlEncode(collection[key])).ToString());
                }
                else if (key.ToLower() == "submit")
                {
                    continue;
                }
                output.Add(new StringBuilder(key + "=" + HttpUtility.UrlEncode(collection[key])).ToString());
            }
            string result = new StringBuilder("campaign_id=" + campaignid + "&id=1727" + "&ip=" + ipaddress + "&" + string.Join("&", output)).ToString();
            if (submit == "true")
            {
                //submissionResult = "test";
                submissionResult = SubmitLead(result, url);
            }
            else
            {
                submissionResult = "Filtered";
            }
            //return submissionResult;
            //=================================================================================================================================================================================

            String strPost = result;

            string clientid = FormValue(collection, "client", "");
            string formid = FormValue(collection, "form_id", "");
            string clienttype = clientid.StartsWith("SC") ? "Direct" : "Network";
            string campuskey = FormValue(collection, "campus_key", "");
            string programkey = FormValue(collection, "program_key", "");

            string salutation = FormValue(collection, "salutation", "").Trim().ToProperCase();
            string gender = salutation.ToLower() == "mr" ? "M" : "F";
            string firstname = FormValue(collection, "firstname", "GET THIS");
            string lastname = FormValue(collection, "lastname", "GET THIS");

            string email = FormValue(collection, "email", "GET THIS").Trim().ToLower();
            string zip = FormValue(collection, "zip", "GET THIS");
            string phone = FormValue(collection, "phone", "GET THIS").Replace(".", "").Replace(" ", "").Replace("-", "").Replace("(", "").Replace(")", "");
            string address1 = FormValue(collection, "address1", "GET THIS");
            string city = FormValue(collection, "city", "");
            string state = FormValue(collection, "state", "");

            string educationlevel = FormValue(collection, "education_level", "SC");
            string eduintent = FormValue(collection, "edu_intent", "YES");
            string military = FormValue(collection, "military", "None");
            string gradyear = FormValue(collection, "gradyear", "GET THIS");
            string sourceform = FormValue(collection, "sourceform", "");

            string dobyear = FormValue(collection, "dobyear", "");

            Random rnd = new Random(DateTime.Now.Millisecond);
            int dobmonth = rnd.Next(1, 13);
            int dobday = rnd.Next(1, 29);

            string schoolvariables = "";
            if (Request.Cookies["schoolvariables"] != null)
            {
                schoolvariables = HttpUtility.UrlDecode(Request.Cookies["schoolvariables"].Value);
            }

            //GA variable
            string utmsource = FromCookie("utm_source"),
                utmcampaign = FromCookie("utm_campaign"),
                utmcontent = FromCookie("utm_content"),
                utmterm = FromCookie("utm_term");

            //Advertise.com variables
            string advertise_affsub = FromCookie("AFFSUB"),
                advertise_affiliate = FromCookie("AFFILIATE"),
                advertise_country = FromCookie("COUNTRY"),
                advertise_countrycode = FromCookie("COUNTRYCODE"),
                advertise_geo = FromCookie("GEO"),
                advertise_subid = FromCookie("SUBID"),
                advertise_terms_html_kw = FromCookie("TERMS_HTML_KW"),
                advertise_terms = FromCookie("TERMS");
            StringBuilder sbtestresults = new StringBuilder();
            string testresults = "";
            if (Request.Cookies["testresults"] != null)
            {
                testresults = CookieDecoder.DecodeCookieCharacters(Request.Cookies["testresults"].Value);
            }

            string recommendations = "";
            if (Request.Cookies["recommendations"] != null)
            {
                recommendations = CookieDecoder.DecodeCookieCharacters(Request.Cookies["recommendations"].Value);
            }

            string careerChoicesJson = GetCareerChoicesJson();
            string data = "{\"careerchoices\":" + careerChoicesJson + "}";

            //Update the record with address
            DelayedRecordClient drc = new DelayedRecordClient();
            //First check if delayed record already exists for this email
            DelayedRecord dr = drc.GetByRowKey(email.FormatEmailAsProgrammaticId());
            if (dr != null)
            {
                if (dr.Address1 != address1)
                {
                    dr.Address1 = address1;
                    dr.EduIntent = "YES";
                    drc.Update(dr);
                }
            }
            SkillCowRequestSubmissionClient rsc = new SkillCowRequestSubmissionClient();

            rsc.AddNewItem(new SkillCowRequestSubmission
            {
                Salutation = salutation,
                Name = (firstname + " " + lastname).Trim(),
                Zip = zip,
                Email = email,
                Address1 = address1,
                City = city,
                State = state,
                Phone = phone,
                IP = ipaddress,
                Mode = "CareerThesaurus",
                CampaignId = campaignid,
                TestResults = testresults,
                SourceForm = target,
                GradYear = gradyear,
                EduIntent = "YES",
                Recommendations = recommendations,
                ClientId = clientid,
                FormId = formid,
                CampusKey = campuskey,
                ProgramKey = programkey,
                Gender = gender,
                SubmissionResult = submissionResult,
                Data = data,
                UtmSource = utmsource,
                UtmCampaign = utmcampaign,
                UtmContent = utmcontent,
                UtmTerm = utmterm,
                PostedString = strPost,
                ClientType = clienttype
            });

            AddresseeClient adc = new AddresseeClient();
            string emailpartition = AddresseeClient.GetPartitionKeyForEmail(email);
            Addressee a = adc.GetByPartitionAndRowKey(emailpartition, email);
            if (a == null)
            {
                adc.AddNewItem(new Addressee(email.ToLower()) { Name = firstname, Email = email.ToLower() });

                UserProfileClient upc = new UserProfileClient();
                UserProfile profile = new UserProfile(email.ToLower())
                {
                    Gender = gender,
                    Salutation = salutation,
                    FirstName = firstname,
                    LastName = lastname,
                    Email = email,
                    Unsubscribed = false,
                    Zip = zip,
                    Address1 = address1,
                    City = city,
                    State = state,
                    Phone = phone,
                    CampaignId = campaignid,
                    GradYear = gradyear,
                    EduIntent = "YES"
                };
                profile.PopulateCityAndState();
                profile.SetTestResults(Request);
                profile.SetImportantThings(Request);
                upc.AddNewItem(profile);
            }

            //============================================================================================================================================================================================
            return submissionResult;
        }

        private string SubmitLead(string strPost, string url)
        {
            // need to be removed
            //return "test";
            // ==================

            StreamWriter myWriter = null;

            HttpWebRequest objRequest = (HttpWebRequest)WebRequest.Create(url);
            objRequest.Method = "POST";
            objRequest.ContentLength = strPost.Length;
            objRequest.ContentType = "application/x-www-form-urlencoded";

            try
            {
                myWriter = new StreamWriter(objRequest.GetRequestStream());
                myWriter.Write(strPost);
            }
            catch (Exception e)
            {
                string error = e.Message;
                return null;
            }
            finally
            {
                myWriter.Close();
            }

            string result;
            HttpWebResponse objResponse = (HttpWebResponse)objRequest.GetResponse();
            using (StreamReader sr = new StreamReader(objResponse.GetResponseStream()))
            {
                result = sr.ReadToEnd();

                // Close and clean up the StreamReader
                sr.Close();
            }

            return result;
        }
        string GetCareerChoicesJson()
        {
            if (Request.Cookies["careerchoicescount"] == null)
                return "[]";

            List<object> results = new List<object>();
            string sChoicesCount = Request.Cookies["careerchoicescount"].Value;
            int cnt;
            if (!int.TryParse(sChoicesCount, out cnt))
                return "[]";

            for (int i = 0; i < cnt; i++)
            {
                if (Request.Cookies["careerchoice" + i] != null)
                {
                    string cval = CookieDecoder.DecodeCookieCharacters(Request.Cookies["careerchoice" + i].Value);
                    string[] tokens = cval.Split("|".ToCharArray(), 3);
                    if (tokens.Length >= 3)
                    {
                        results.Add(new
                        {
                            priority = tokens[0],
                            careerid = tokens[1],
                            name = tokens[2]
                        });
                    }
                }

            }

            return results.ToArray().ToJSON();
        }
        string FromCookie(string cookiename)
        {
            if (Request.Cookies[cookiename] != null)
            {
                return HttpUtility.UrlDecode(Request.Cookies[cookiename].Value);
            }
            else
            {
                return "";
            }
        }
        string FormValue(FormCollection collection, string variable, string defaultvalue)
        {
            string temp = (collection[variable] != null && collection[variable].Trim() != "" ? collection[variable].Trim() : defaultvalue);
            if (temp == defaultvalue)
            {
                temp = DecodeCookieCharacters(Request.Cookies[variable] != null ? Request.Cookies[variable].Value : defaultvalue);
            }
            return temp;
        }

        string DecodeCookieCharacters(string v)
        {
            return v.Replace("%7B", "{")
                .Replace("%22", "\"")
                .Replace("%2F", "/")
                .Replace("%2C", ",")
                .Replace("%3A", ":")
                .Replace("%7D", "}")
                .Replace("%5B", "[")
                .Replace("%5D", "]")
                .Replace("%20", " ")
                .Replace("%27", "'")
                .Replace("%26", "&")
                .Replace("%28", "(")
                .Replace("%29", ")")
                .Replace("%7C", "|")
                .Replace("%257B", "{")
                .Replace("%2522", "\"")
                .Replace("%252F", "/")
                .Replace("%252C", ",")
                .Replace("%253A", ":")
                .Replace("%257D", "}")
                .Replace("%255B", "[")
                .Replace("%255D", "]")
                .Replace("%2520", " ")
                .Replace("%2527", "'")
                .Replace("%2526", "&")
                .Replace("%2528", "(")
                .Replace("%2529", ")")
                .Replace("%257C", "|");
        }
    }
}
