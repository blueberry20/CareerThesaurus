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
using SkillCow.Classes.Cloud.TableStorage.PersonalityTests.SkillCowRequestSubmissions;
using SkillCow.Classes.Cloud.TableStorage;
using SkillCow.Classes.Cloud.TableStorage.ABTests;
using SkillCow.Classes.Email;

namespace SkillCow.Controllers
{
    public class DirectSubmissionController : ControllerBase
    {
        [HttpPost]
        public ActionResult Index(FormCollection collection)
        {
            if (Request.Cookies["extendedrecordcomplete"] != null)
                return RedirectToAction("Index","SkillTest");
            
            #region IP ADDRESS
#if DEBUG
            string randomip = RandomHelper.Instance.Next(1, 256) + "." + RandomHelper.Instance.Next(0, 256) + "." + RandomHelper.Instance.Next(0, 256) + "." + RandomHelper.Instance.Next(1, 256);
#endif
            string ipaddress = "";
#if DEBUG
            ipaddress = randomip;
#else
            ipaddress = Request.UserHostAddress;
#endif
            #endregion

            double LEAD_CONVERSION_VALUE = 1;
            double RECORD_CONVERSION_VALUE = 0.2;

            double conversionValue = 0;

            string schoolsearchresultid = FromCookie("schoolsearchresultid");

            string campaignid = FormValue(collection, "cbncampaign", "13564694");
            
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

            string schoolvariables ="";
            if(Request.Cookies["schoolvariables"]!=null)
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
            
            string[] distinctSubmissions = schoolvariables.Split('^');
            foreach (string submission in distinctSubmissions)
            {
                if (submission != "")
                {

                    string[] submissionTokens = submission.Split('!');

                    string campuskey = submissionTokens[3];
                    string programkey = submissionTokens.Length > 4 ? submissionTokens[4] : "";



                    String strPost = "campaign_id=" + campaignid +
                    "&id=1727" +
                    "&ip=" + ipaddress +
                    "&client_id=" + submissionTokens[1] +
                    "&salutation=" + salutation +
                    "&gender=" + gender +
                    "&firstname=" + firstname.Trim() +
                    "&lastname=" + lastname.Trim() +
                    "&email=" + email +
                    "&zip=" + zip +
                    "&phone=" + phone +
                    "&address1=" + address1 +
                    "&city=" + city +
                    "&state=" + state +
                    "&education_level=" + educationlevel +
                    "&educationlevel=" + educationlevel +
                    "&edu_intent=YES" +
                    "&military=" + military +
                    "&campus_key=" + submissionTokens[3] +
                    "&program_key=" + programkey +
                    "&gradyear=" + gradyear +
                    "&dobyear=" + dobyear +
                    "&dobmonth=" + dobmonth.ToString() +
                    "&dobday=" + dobday.ToString() +
                    "&form_id=" + submissionTokens[2] +
                    "&program=" + submissionTokens[0];

                    int igradyear;
                    int.TryParse(gradyear, out igradyear);

                    //Do not submit young leads to CBN
                    if (igradyear <= DateTime.Now.Year)
                    {
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
                    }

                    string submissionResult = "";

                    try
                    {
                        if (igradyear <= DateTime.Now.Year)
                        {
                            submissionResult = SubmitLead(strPost);
                            conversionValue += LEAD_CONVERSION_VALUE;
                        }

                        SkillCowRequestSubmissionClient rsc = new SkillCowRequestSubmissionClient();

                        string mode = "external";
                        if (Request.Cookies["mode"] != null)
                        {
                            mode = Request.Cookies["mode"].Value;
                        }

                        string testresults = "";
                        if (Request.Cookies["testresults"] != null)
                        {
                            testresults = DecodeCookieCharacters(Request.Cookies["testresults"].Value);
                        }

                        string recommendations = "";
                        if (Request.Cookies["recommendations"] != null)
                        {
                            recommendations = DecodeCookieCharacters(Request.Cookies["recommendations"].Value);
                        }

                        string careerChoicesJson = GetCareerChoicesJson();
                        string data = "{\"careerchoices\":" + careerChoicesJson + "}";

                        rsc.AddNewItem(new SkillCowRequestSubmission
                        {
                            Salutation = salutation,
                            Name = (firstname + " " + lastname).Trim(),
                            Zip = zip,
                            Email = email,
                            Address1 = address1,
                            Phone = phone,
                            IP = ipaddress,
                            Mode = mode,
                            CampaignId = campaignid,
                            TestResults = testresults,
                            SourceForm = collection["sourceform"],
                            GradYear = gradyear,
                            EduIntent = eduintent,
                            Recommendations = recommendations,
                            ClientId = submissionTokens[1],
                            FormId = submissionTokens[2],
                            Gender = gender,
                            CareerId = submissionTokens[0],
                            SubmissionResult = submissionResult,
                            Data = data,
                            UtmSource = utmsource,
                            UtmCampaign = utmcampaign,
                            UtmContent = utmcontent,
                            UtmTerm = utmterm

                            ,
                            City = city
                            ,
                            State = state
                            ,
                            CampusKey = campuskey
                            ,
                            ProgramKey = programkey

                            ,
                            advertise_affsub = advertise_affsub
                            ,
                            advertise_affiliate = advertise_affiliate
                            ,
                            advertise_country = advertise_country
                            ,
                            advertise_countrycode = advertise_countrycode
                            ,
                            advertise_geo = advertise_geo
                            ,
                            advertise_subid = advertise_subid
                            ,
                            advertise_terms = advertise_terms
                            ,
                            advertise_terms_html_kw = advertise_terms_html_kw,

                            PostedString = strPost,
                            SchoolSearchResultId = schoolsearchresultid

                        });


                        if (campaignid == "13564694")
                        {
                            //Telephony t = new Telephony();
                            //t.SendSMS("+19174340659", "Web lead: " + firstname + " " + lastname);
                        }
                    }
                    catch (Exception ex)
                    {
                    }
                }
            }

            AddresseeClient adc = new AddresseeClient();
            string emailpartition = AddresseeClient.GetPartitionKeyForEmail(email);
            Addressee a = adc.GetByPartitionAndRowKey(emailpartition, email);
            if (a == null)
            {
                adc.AddNewItem(new Addressee(email.ToLower()) { Name = firstname, Email = email.ToLower(), });

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
                    EduIntent = eduintent
                };
                profile.PopulateCityAndState();
                profile.SetTestResults(Request);
                profile.SetImportantThings(Request);
                upc.AddNewItem(profile);
            }

            ABTestClient abtc = null;
            abtc = new ABTestClient("Home", Request, Response);
            abtc.CreateGoalConversion("schoolleads", distinctSubmissions.Length);

            Response.Cookies["extendedrecordcomplete"].Value = "1";
            Response.Cookies["extendedrecordcomplete"].Expires = DateTime.UtcNow.AddDays(90);

            //Only set this cookie for internal
            if (campaignid != "13564694")
            {
                Response.Cookies["ascv"].Value = conversionValue.ToString();
                Response.Cookies["ascv"].Expires = DateTime.UtcNow.AddDays(90);
            }

            return RedirectToAction("Index", "SkillTest", new {f="thanks" });
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

        string GetCareerChoicesJson()
        {
            if(Request.Cookies["careerchoicescount"]==null)
                return "[]";

            List<object> results = new List<object>();
            string sChoicesCount = Request.Cookies["careerchoicescount"].Value;
            int cnt;
            if (!int.TryParse(sChoicesCount, out cnt))
                return "[]";

            for (int i = 0; i < cnt; i++)
            {
                if(Request.Cookies["careerchoice" + i]!=null)
                {
                    string cval = DecodeCookieCharacters(Request.Cookies["careerchoice" + i].Value);
                    string[] tokens = cval.Split("|".ToCharArray(), 3);
                    if(tokens.Length>=3)
                    {
                        results.Add(new
                        {
                            priority =tokens[0],
                            careerid = tokens[1],
                            name = tokens[2]
                        });
                    }
                }
                
            }

            return results.ToArray().ToJSON();
        }

        string SubmitLead(string strPost)
        {
            StreamWriter myWriter = null;

            HttpWebRequest objRequest = (HttpWebRequest)WebRequest.Create("http://explore-schools.com/affiliate/submit/");
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
            using (StreamReader sr =
               new StreamReader(objResponse.GetResponseStream()))
            {
                result = sr.ReadToEnd();

                // Close and clean up the StreamReader
                sr.Close();
            }

            return result;

            
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
