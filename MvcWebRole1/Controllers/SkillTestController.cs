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
using SkillCow.Classes.Email;

namespace SkillCow.Controllers
{
    public class SkillTestController : ControllerBase
    {
        //
        // GET: /CareerAssessment/

        public ActionResult Beta()
        {
            ViewBag.CBNCampaignId = Request.Cookies["cbncampaign"] != null ? Request.Cookies["cbncampaign"].Value : "13564694";
            ViewBag.TopCareerChoiceVMProdId = Request.Cookies["topcareerchoicevmprodid"] != null ? Request.Cookies["topcareerchoicevmprodid"].Value : "";

            ViewBag.ThanksFlag = "false";

            return View();
        }

        public ActionResult Index(string f)
        {
            ViewBag.CBNCampaignId = Request.Cookies["cbncampaign"] != null ? Request.Cookies["cbncampaign"].Value : "13564694";
            ViewBag.TopCareerChoiceVMProdId = Request.Cookies["topcareerchoicevmprodid"] != null ? Request.Cookies["topcareerchoicevmprodid"].Value : "";

            ViewBag.ThanksFlag = f != null && f == "thanks";

            return View();
        }

        [HttpPost]
        public ActionResult Index(FormCollection collection)
        {
            if(Request.Cookies["recordsubmitted"] != null)
            {
                return View();
            }
            
#if DEBUG
            string randomip = RandomHelper.Instance.Next(1, 256) + "." + RandomHelper.Instance.Next(0, 256) + "." + RandomHelper.Instance.Next(0, 256) + "." + RandomHelper.Instance.Next(1, 256);
#endif

            string ipaddress = "";
#if DEBUG
            ipaddress = randomip;
#else
            ipaddress = Request.UserHostAddress;
#endif
            string salutation = FormValue(collection, "salutation", "").Trim().ToProperCase();
            string gender = salutation.ToLower() == "mr" ? "M" : "F";
            
            string firstname = FormValue(collection, "firstname", "GET THIS");
            string lastname = FormValue(collection, "lastname", "GET THIS");
            string email = FormValue(collection, "email", "GET THIS");
            string zip = FormValue(collection, "zip", "GET THIS");
            string phone = FormValue(collection, "phone", "GET THIS").Replace(".", "").Replace(" ", "").Replace("-", "").Replace("(", "").Replace(")", "");
            string address = FormValue(collection, "address1", "GET THIS"); 
            string city = FormValue(collection, "city", "GET THIS");
            string state = FormValue(collection, "state", "GET THIS");
            string edulevel = FormValue(collection, "education_level", "GET THIS");
            string campaign = FormValue(collection, "cbncampaign", "13564694");  //(collection["campaign_id"] == null || collection["campaign_id"] == "" ? "GET THIS" : collection["campaign_id"]);

            string gradyear = FormValue(collection, "gradyear", "GET THIS");  //(collection["gradyear"] == null || collection["gradyear"] == "" ? "GET THIS" : collection["gradyear"]);
            string eduintent = FormValue(collection, "edu_intent", "GET THIS");  //(collection["edu_intent"] == null || collection["edu_intent"] == "" ? "GET THIS" : collection["edu_intent"]);
            string dobyear = FormValue(collection, "dobyear", "");

            Random rnd = new Random(DateTime.Now.Millisecond);
            string dobmonth = rnd.Next(1, 13).ToString();
            string dobday = rnd.Next(1, 29).ToString();


            string utmsource = "", utmcampaign = "", utmcontent = "", utmterm="";
            if (Request.Cookies["utm_source"] != null)
            {
                utmsource = HttpUtility.UrlDecode(Request.Cookies["utm_source"].Value);
            }
            if (Request.Cookies["utm_campaign"] != null)
            {
                utmcampaign = HttpUtility.UrlDecode(Request.Cookies["utm_campaign"].Value);
            }
            if (Request.Cookies["utm_content"] != null)
            {
                utmcontent = HttpUtility.UrlDecode(Request.Cookies["utm_content"].Value);
            }
            if (Request.Cookies["utm_term"] != null)
            {
                utmterm = HttpUtility.UrlDecode(Request.Cookies["utm_term"].Value);
            }

            int igradyear;
            int.TryParse(gradyear, out igradyear);

            String result = "";
            String strPost = "campaign_id=" + campaign +
                "&id=1727" +
                "&ip=" + ipaddress +
                "&client=20" +
                "&salutation=" + salutation +
                "&gender=" + gender +
                "&firstname=" + firstname.Trim() +
                "&lastname=" + lastname.Trim() +
                "&email=" + email +
                "&address1=" + address +
                "&city=" + city +
                "&state=" + state +
                "&zip=" + zip +
                "&phone=" + phone +
                "&educationlevel=" + edulevel +
                "&education_level=" + edulevel +
                "&edu_intent=" + eduintent +
                "&gradyear=" + gradyear +
                "&dobyear=" + dobyear +
                "&dobmonth=" + dobmonth +
                "&dobday=" + dobday;

            if (igradyear <= DateTime.Now.Year)
            {
                //Create delayed record
                DelayedRecordClient drc = new DelayedRecordClient();
                //First check if delayed record already exists for this email
                DelayedRecord dr = drc.GetByRowKey(email.FormatEmailAsProgrammaticId());
                if (dr == null)
                {
                    drc.AddNewItem(new DelayedRecord
                    {
                        RowKey = email.FormatEmailAsProgrammaticId(),
                        CampaignId = campaign,
                        ClientId = "20",
                        IP = ipaddress,
                        Salutation = salutation,
                        Gender = gender,
                        FirstName = firstname,
                        LastName = lastname,
                        Email = email,
                        Address1 = address,
                        City = city,
                        State = state,
                        Zip = zip,
                        Phone = phone,
                        EducationLevel = edulevel,
                        EduIntent = eduintent,
                        GradYear = gradyear,
                        DobYear = dobyear,
                        DobMonth = dobmonth,
                        DobDay = dobday


                    });
                }
            }
            

            SkillCowRequestSubmissionClient rsc = new SkillCowRequestSubmissionClient();
            
            string mode = "external";
            if(Request.Cookies["mode"]!=null)
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

            //Advertise.com variables
            string advertise_affsub = FromCookie("AFFSUB"),
                advertise_affiliate = FromCookie("AFFILIATE"),
                advertise_country = FromCookie("COUNTRY"),
                advertise_countrycode = FromCookie("COUNTRYCODE"),
                advertise_geo = FromCookie("GEO"),
                advertise_subid = FromCookie("SUBID"),
                advertise_terms_html_kw = FromCookie("TERMS_HTML_KW"),
                advertise_terms = FromCookie("TERMS");

            rsc.AddNewItem(new SkillCowRequestSubmission { Gender = gender, Salutation = salutation, State = state, City = city, Name = firstname, Zip = zip, Email = email, Phone = phone, IP = ipaddress, Mode = mode, CampaignId = campaign, TestResults = testresults, SourceForm = collection["sourceform"], GradYear = gradyear, EduIntent = eduintent, Data = data, Recommendations = recommendations, UtmSource = utmsource, UtmCampaign=utmcampaign, UtmContent = utmcontent, UtmTerm = utmterm

                ,SubmissionResult = result

                ,advertise_affsub = advertise_affsub
                ,advertise_affiliate = advertise_affiliate
                ,advertise_country = advertise_country
                ,advertise_countrycode = advertise_countrycode
                ,advertise_geo = advertise_geo
                ,advertise_subid = advertise_subid
                ,advertise_terms = advertise_terms
                ,advertise_terms_html_kw = advertise_terms_html_kw
            });
            
            
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
                    Address1 = address,
                    City = city,
                    State = state,
                    Phone = phone,
                    CampaignId = campaign,

                    GradYear = gradyear,
                    EduIntent = eduintent
                };
                profile.PopulateCityAndState();
                profile.SetTestResults(Request);
                profile.SetImportantThings(Request);
                profile.SetRecommendations(recommendations);
                profile.SetCareerChoices(data);
                upc.AddNewItem(profile);
            }

            WelcomeEmail.Send(Request, firstname, email, mode == "external");

            Response.Cookies["recordsubmitted"].Value = "1";
            Response.Cookies["recordsubmitted"].Expires = DateTime.UtcNow.AddDays(90);

            Response.Cookies["ascv"].Value = "0.20";
            Response.Cookies["ascv"].Expires = DateTime.UtcNow.AddDays(90);

            ViewBag.ThanksFlag = false;

            return View();
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
                    string cval = DecodeCookieCharacters(Request.Cookies["careerchoice" + i].Value);
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
            return v.Replace("%7B", "{").Replace("%22", "\"").Replace("%2C", ",").Replace("%3A", ":").Replace("%7D", "}").Replace("%5B", "[").Replace("%5D", "]").Replace("%20", " ").Replace("%27", "'").Replace("%26", "&").Replace("%28", "(").Replace("%29", ")").Replace("%7C", "|");
        }

        
    }
}
