using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using SkillCow.Classes.Helpers;
using SkillCow.Classes.Cloud.TableStorage;
using System.Globalization;

namespace SkillCow.Controllers
{
    public class UXEventsController : ControllerBase
    {
        public ActionResult Index()
        {
            UXEventClient uxc = new UXEventClient();

            ViewBag.StartDate = EasternTimeConverter.Convert(DateTime.UtcNow);
            ViewBag.EndDate = EasternTimeConverter.Convert(DateTime.UtcNow);

            return View(uxc);
        }


        [HttpPost]
        public ActionResult Index(FormCollection collection)
        {
            UXEventClient uxc = new UXEventClient();

            ViewBag.StartDate = DateTime.ParseExact(collection["startdate"], "yyyyMMdd", CultureInfo.InvariantCulture);
            ViewBag.EndDate = DateTime.ParseExact(collection["enddate"], "yyyyMMdd", CultureInfo.InvariantCulture);

            ViewBag.SearchName = collection["searchname"];

            return View(uxc);
        }

        [HttpPost]
        public ActionResult LogEvent(string medium, string eventname, string customdata)
        {
            try
            {
                Response.ContentType = "application/json";

                //DoLogEvent(medium, eventname, customdata);
                
                string json = "{\"result\":\"ok\"}";
                Response.Write(json);
                Response.End();
            }
            catch (Exception ex)
            {
                Response.Write("{\"result\":\"error\",\"errormessage\":\"\"}");
                Response.End();
            }

            return null;


        }

        string FromCookie(string cookiename)
        {
            return FromCookie(cookiename, "");
        }
        string FromCookie(string cookiename, string defaultvalue)
        {
            if (Request.Cookies[cookiename] != null)
            {
                string temp = HttpUtility.UrlDecode(Request.Cookies[cookiename].Value);
                if (temp == "")
                {
                    return defaultvalue;
                }
                else
                {
                    return temp;
                }
            }
            else
            {
                return defaultvalue;
            }
        }

        public void DoLogEvent(string medium, string eventname, string customdata)
        {
            string ipaddress = "";
#if DEBUG
            ipaddress = RandomHelper.Instance.Next(1, 256) + "." + RandomHelper.Instance.Next(0, 256) + "." + RandomHelper.Instance.Next(0, 256) + "." + RandomHelper.Instance.Next(1, 256);
#else
            ipaddress = Request.UserHostAddress;
#endif

            string campaignid = FromCookie("cbncampaign", "13564694");

            string salutation = FromCookie("salutation", "");
            string gender = salutation.ToLower() == "mr" ? "M" : "F";
            string firstname = FromCookie("firstname", "");
            string lastname = FromCookie("lastname", "");

            string email = FromCookie("email", "").Trim().ToLower();
            string zip = FromCookie("zip", "");
            string phone = FromCookie("phone", "").Replace(".", "").Replace(" ", "").Replace("-", "").Replace("(", "").Replace(")", "");
            string address1 = FromCookie("address1", "");
            string city = FromCookie("city", "");
            string state = FromCookie("state", "");

            string educationlevel = FromCookie("education_level", "SC");
            string eduintent = FromCookie("edu_intent", "YES");
            string military = FromCookie("military", "None");
            string gradyear = FromCookie("gradyear", "");

            string dobyear = FromCookie("dobyear", "");

            Random rnd = new Random(DateTime.Now.Millisecond);
            int dobmonth = rnd.Next(1, 13);
            int dobday = rnd.Next(1, 29);

            //GA variable
            string utmsource = FromCookie("utm_source"),
                utmcampaign = FromCookie("utm_campaign"),
                utmcontent = FromCookie("utm_content"),
                utmterm = FromCookie("utm_term");


            string testdata = "{\"complete\":" + FromCookie("testcomplete", "0") + ",\"elapsedtime\":" + FromCookie("testelapsedtime", "0") + ",\"results\":" + FromCookie("testresults") + "}"; 
            string recommendations = FromCookie("recommendations"); 
            string careerChoicesJson = GetCareerChoicesJson();
            string importantThingsJson = FromCookie("importantthings"); 
            

            UXEventClient uxc = new UXEventClient();

            uxc.AddNewItem(new UXEvent
            {
                EventName = eventname,
                Medium = medium,
                 
                IP = ipaddress,
                CampaignId = campaignid,

                Salutation = salutation,
                Gender = gender,
                FirstName = firstname,
                LastName = lastname,
                Zip = zip,
                Email = email,
                Address1 = address1,
                City = city,
                State = state,
                
                Phone = phone,
                GradYear = gradyear,
                EduIntent = eduintent,
                                
                TestData = testdata,
                ProfessionsRecomended = recommendations,
                ProfessionsSelected = careerChoicesJson,
                ImportantThings = importantThingsJson,

                CustomData = customdata,
                  
                UtmSource = utmsource,
                UtmCampaign = utmcampaign,
                UtmContent = utmcontent,
                UtmTerm = utmterm

                
                 
            });

                    
            
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
                    string cval = FromCookie("careerchoice" + i);
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

        
    }
}
