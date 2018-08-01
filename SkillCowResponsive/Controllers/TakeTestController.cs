using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using SkillCowResponsive.Classes.Cloud.TableStorage;
using SkillCowResponsive.Classes;
using SkillCowResponsive.Classes.Email;
using SkillCowResponsive.Classes.Cloud.TableStorage.LockedModeUser;
using SkillCowResponsive.Classes.Encryption;
using SkillCowResponsive.Models;
using Newtonsoft.Json.Linq;
using SkillCowResponsive.Classes.Helpers;

namespace SkillCowResponsive.Controllers
{
    public class TakeTestController : AuthenticatedControllerController
    {
        //
        // GET: /TakeTest/
        public ActionResult Index(string source, string v)
        {
            Response.Cookies["locked"].Value = "1";
            Response.Cookies["locked"].Expires = DateTime.UtcNow.AddDays(1);
            if (!string.IsNullOrEmpty(source))
            {
                Response.Cookies["source"].Value = source.ToLower();
                Response.Cookies["source"].Expires = DateTime.UtcNow.AddDays(1);
            }
            if (!string.IsNullOrEmpty(v))
            {
                Response.Cookies["v"].Value = v.ToLower();
                Response.Cookies["v"].Expires = DateTime.UtcNow.AddDays(1);
            }
            Random rnd = RandomHelper.Instance;
            ViewBag.GA = rnd.Next(1, 3);

            return View();
        }
        public ActionResult Color()
        {
            return View();
        }
        public ActionResult Interests()
        {
            return View();
        }
        public ActionResult School()
        {
            string version = Request.Cookies["v"] != null ? Request.Cookies["v"].Value : "";
            //if (!string.IsNullOrEmpty(version) && version == "2")
            //{
            //    return View("School2");
            //}
            //else if (!string.IsNullOrEmpty(version) && version == "1")
            //{
            //    return View("School");
            //}
            return View("School3");
        }
        public ActionResult Shape()
        {
            return View();
        }
        public ActionResult Sport()
        { 
            return View();
        }
        public ActionResult Question()
        {
            return View();
        }
        public ActionResult Thankyou()
        {
            //if (Request.Cookies["locked"] != null)
            //{
            //    Response.Cookies["locked"].Expires = DateTime.Now.AddDays(-1);
            //}
            return View();
        }
        public ActionResult TestResults()
        {
            return View();
        }
        public ActionResult EmailResults()
        {
            return View();
        }
        [HttpPost]
        public ActionResult EmailResults(string name, string email, string phone, string interests, string selectedschool, string otherschools, string originpage)
        {
            AddresseeClient adc = new AddresseeClient();
            LockedModeUserClient lmu = new LockedModeUserClient();
            string emailpartition = AddresseeClient.GetPartitionKeyForEmail(email);
            interests = interests == null ? "" : interests;
            Addressee a = adc.GetByPartitionAndRowKey(emailpartition, email.ToLower());
            if (a == null)
            {
                adc.AddNewItem(new Addressee(email.ToLower()) { Name = name, Email = email.ToLower() });
            }
            LockedModeUser user = lmu.GetByPartitionAndRowKey(emailpartition, email);
            if (user == null)
            {
                lmu.AddNewItem(new LockedModeUser
                {
                    PartitionKey = emailpartition,
                    RowKey = email.ToLower(),
                    Name = name,
                    Email = email.ToLower(),
                    Phone = phone,
                    Referer = "lm",

                    Attitude = Request.Cookies["attitude"] != null ? Request.Cookies["attitude"].Value : "",
                    Action = Request.Cookies["action"] != null ? Request.Cookies["action"].Value : "",
                    Information = Request.Cookies["information"] != null ? Request.Cookies["information"].Value : "",
                    Processing = Request.Cookies["processing"] != null ? Request.Cookies["processing"].Value : "",
                    Endurance = Request.Cookies["endurance"] != null ? Request.Cookies["endurance"].Value : "",
                    Patterns = Request.Cookies["patterns"] != null ? Request.Cookies["patterns"].Value : "",
                    Presence = Request.Cookies["presence"] != null ? Request.Cookies["presence"].Value : "",
                    Compensation = Request.Cookies["compensation"] != null ? Request.Cookies["compensation"].Value : "",
                    Concentration = Request.Cookies["concentration"] != null ? Request.Cookies["concentration"].Value : "",
                    admiration = interests.Contains("admiration") ? 1 : 0,
                    adventure = interests.Contains("adventure") ? 1 : 0,
                    animals = interests.Contains("animals") ? 1 : 0,
                    beauty = interests.Contains("beauty") ? 1 : 0,
                    competition = interests.Contains("competition") ? 1 : 0,
                    coordinating = interests.Contains("coordinating") ? 1 : 0,
                    creativity = interests.Contains("creativity") ? 1 : 0,
                    critical = interests.Contains("critical") ? 1 : 0,
                    drafting = interests.Contains("drafting") ? 1 : 0,
                    duty = interests.Contains("duty") ? 1 : 0,
                    handlabor = interests.Contains("handlabor") ? 1 : 0,
                    helping = interests.Contains("helping") ? 1 : 0,
                    machinery = interests.Contains("machinery") ? 1 : 0,
                    numbers = interests.Contains("numbers") ? 1 : 0,
                    people = interests.Contains("people") ? 1 : 0,
                    politics = interests.Contains("politics") ? 1 : 0,
                    safety = interests.Contains("safety") ? 1 : 0,
                    salesy = interests.Contains("salesy") ? 1 : 0,
                    science = interests.Contains("science") ? 1 : 0,
                    strength = interests.Contains("strength") ? 1 : 0,
                    technology = interests.Contains("technology") ? 1 : 0,

                    Color = Request.Cookies["color"] != null ? Request.Cookies["color"].Value : "",
                    Shape = Request.Cookies["shape"] != null ? Request.Cookies["shape"].Value : "",
                    Sport = Request.Cookies["sport"] != null ? Request.Cookies["sport"].Value : "",
                    School = Request.Cookies["school"] != null ? Request.Cookies["school"].Value : "",
                    EduLevel = Request.Cookies["educationSelected"] != null ? Request.Cookies["educationSelected"].Value : ""
                });
            }
            else
            {
                user.Name = name;
                user.Phone = phone;
                user.Attitude = Request.Cookies["attitude"] != null ? Request.Cookies["attitude"].Value : "";
                user.Action = Request.Cookies["action"] != null ? Request.Cookies["action"].Value : "";
                user.Information = Request.Cookies["information"] != null ? Request.Cookies["information"].Value : "";
                user.Processing = Request.Cookies["processing"] != null ? Request.Cookies["processing"].Value : "";
                user.Endurance = Request.Cookies["endurance"] != null ? Request.Cookies["endurance"].Value : "";
                user.Patterns = Request.Cookies["patterns"] != null ? Request.Cookies["patterns"].Value : "";
                user.Presence = Request.Cookies["presence"] != null ? Request.Cookies["presence"].Value : "";
                user.Compensation = Request.Cookies["compensation"] != null ? Request.Cookies["compensation"].Value : "";
                user.Concentration = Request.Cookies["concentration"] != null ? Request.Cookies["concentration"].Value : "";
                user.admiration = interests.Contains("admiration") ? 1 : 0;
                user.adventure = interests.Contains("adventure") ? 1 : 0;
                user.animals = interests.Contains("animals") ? 1 : 0;
                user.beauty = interests.Contains("beauty") ? 1 : 0;
                user.competition = interests.Contains("competition") ? 1 : 0;
                user.coordinating = interests.Contains("coordinating") ? 1 : 0;
                user.creativity = interests.Contains("creativity") ? 1 : 0;
                user.critical = interests.Contains("critical") ? 1 : 0;
                user.drafting = interests.Contains("drafting") ? 1 : 0;
                user.duty = interests.Contains("duty") ? 1 : 0;
                user.handlabor = interests.Contains("handlabor") ? 1 : 0;
                user.helping = interests.Contains("helping") ? 1 : 0;
                user.machinery = interests.Contains("machinery") ? 1 : 0;
                user.numbers = interests.Contains("numbers") ? 1 : 0;
                user.people = interests.Contains("people") ? 1 : 0;
                user.politics = interests.Contains("politics") ? 1 : 0;
                user.safety = interests.Contains("safety") ? 1 : 0;
                user.salesy = interests.Contains("salesy") ? 1 : 0;
                user.science = interests.Contains("science") ? 1 : 0;
                user.strength = interests.Contains("strength") ? 1 : 0;
                user.technology = interests.Contains("technology") ? 1 : 0;

                user.Color = Request.Cookies["color"] != null ? Request.Cookies["color"].Value : "";
                user.Shape = Request.Cookies["shape"] != null ? Request.Cookies["shape"].Value : "";
                user.Sport = Request.Cookies["sport"] != null ? Request.Cookies["sport"].Value : "";
                user.School = Request.Cookies["school"] != null ? Request.Cookies["school"].Value : "";
                user.EduLevel = Request.Cookies["educationSelected"] != null ? Request.Cookies["educationSelected"].Value : "";
                lmu.Update(user);
            }
            if (!string.IsNullOrEmpty(selectedschool) && !string.IsNullOrEmpty(otherschools))
            {
                sendResultEmailWithSchool(name, email, selectedschool, otherschools);
            }
            else
            {
                sendResultEmail(name, email);
            }

            if (originpage == "testresults")
            {
                TempData["resultsEmailed"] = true;
                return RedirectToAction("TestResults", "TakeTest");
            }
            else
            {
                TempData["resultsEmailed"] = true;
                return RedirectToAction("Thankyou", "TakeTest");
            }

        }
        public ActionResult SchoolResults()
        {
            return View();
        }
        public ActionResult TestReport(string id)
        {
            if (Request.Cookies["locked"] != null)
            {
                Response.Cookies["locked"].Expires = DateTime.Now.AddDays(-1);
            }
            if (!string.IsNullOrEmpty(id))
            {
                SimpleAES aes = new SimpleAES();
                string email = aes.DecryptFromBase64String(id);
                LockedModeUserClient lmu = new LockedModeUserClient();
                LockedModeUser user = lmu.GetByPartitionAndRowKey(LockedModeUserClient.GetPartitionKeyForEmail(email), email);
                if (user != null)
                {
                    Response.Cookies["attitude"].Value = user.Attitude;
                    Response.Cookies["attitude"].Expires = DateTime.UtcNow.AddDays(7);
                    Response.Cookies["endurance"].Value = user.Endurance;
                    Response.Cookies["endurance"].Expires = DateTime.UtcNow.AddDays(7);
                    Response.Cookies["action"].Value = user.Action;
                    Response.Cookies["action"].Expires = DateTime.UtcNow.AddDays(7);
                    Response.Cookies["concentration"].Value = user.Concentration;
                    Response.Cookies["concentration"].Expires = DateTime.UtcNow.AddDays(7);
                    Response.Cookies["information"].Value = user.Information;
                    Response.Cookies["information"].Expires = DateTime.UtcNow.AddDays(7);
                    Response.Cookies["processing"].Value = user.Processing;
                    Response.Cookies["processing"].Expires = DateTime.UtcNow.AddDays(7);
                    Response.Cookies["presence"].Value = user.Presence;
                    Response.Cookies["presence"].Expires = DateTime.UtcNow.AddDays(7);
                    Response.Cookies["patterns"].Value = user.Patterns;
                    Response.Cookies["patterns"].Expires = DateTime.UtcNow.AddDays(7);
                    Response.Cookies["compensation"].Value = user.Compensation;
                    Response.Cookies["compensation"].Expires = DateTime.UtcNow.AddDays(7);
                    Response.Cookies["resultsEmailed"].Value = "yes";
                    Response.Cookies["resultsEmailed"].Expires = DateTime.UtcNow.AddDays(7);

                    if (!string.IsNullOrEmpty(user.Color))
                    {
                        Response.Cookies["color"].Value = user.Color;
                        Response.Cookies["color"].Expires = DateTime.UtcNow.AddDays(7);
                    }
                    if (!string.IsNullOrEmpty(user.Shape))
                    {
                        Response.Cookies["shape"].Value = user.Shape;
                        Response.Cookies["shape"].Expires = DateTime.UtcNow.AddDays(7);
                    }
                    if (!string.IsNullOrEmpty(user.Sport))
                    {
                        Response.Cookies["sport"].Value = user.Sport;
                        Response.Cookies["sport"].Expires = DateTime.UtcNow.AddDays(7);
                    }
                    if (!string.IsNullOrEmpty(user.School))
                    {
                        Response.Cookies["school"].Value = user.School;
                        Response.Cookies["school"].Expires = DateTime.UtcNow.AddDays(7);
                    }
                    if (!string.IsNullOrEmpty(user.EduLevel))
                    {
                        Response.Cookies["educationSelected"].Value = user.EduLevel;
                        Response.Cookies["educationSelected"].Expires = DateTime.UtcNow.AddDays(7);
                    }
                    string str = getInterestsJson(user);
                    ViewBag.Interests = str;
                    if (str != "[]")
                    {
                        Response.Cookies["question10"].Value = "1";
                        Response.Cookies["question10"].Expires = DateTime.UtcNow.AddDays(7);
                    }
                }
            }
            return View();
        }

        //report with roles
        public ActionResult CareerReport(string id)
        {
            if (Request.Cookies["locked"] != null)
            {
                Response.Cookies["locked"].Expires = DateTime.Now.AddDays(-1);
            }
            if (!string.IsNullOrEmpty(id))
            {
                SimpleAES aes = new SimpleAES();
                string email = aes.DecryptFromBase64String(id);
                LockedModeUserClient lmu = new LockedModeUserClient();
                LockedModeUser user = lmu.GetByPartitionAndRowKey(LockedModeUserClient.GetPartitionKeyForEmail(email), email);
                if (user != null)
                {
                    Response.Cookies["attitude"].Value = user.Attitude;
                    Response.Cookies["attitude"].Expires = DateTime.UtcNow.AddDays(7);
                    Response.Cookies["endurance"].Value = user.Endurance;
                    Response.Cookies["endurance"].Expires = DateTime.UtcNow.AddDays(7);
                    Response.Cookies["action"].Value = user.Action;
                    Response.Cookies["action"].Expires = DateTime.UtcNow.AddDays(7);
                    Response.Cookies["concentration"].Value = user.Concentration;
                    Response.Cookies["concentration"].Expires = DateTime.UtcNow.AddDays(7);
                    Response.Cookies["information"].Value = user.Information;
                    Response.Cookies["information"].Expires = DateTime.UtcNow.AddDays(7);
                    Response.Cookies["processing"].Value = user.Processing;
                    Response.Cookies["processing"].Expires = DateTime.UtcNow.AddDays(7);
                    Response.Cookies["presence"].Value = user.Presence;
                    Response.Cookies["presence"].Expires = DateTime.UtcNow.AddDays(7);
                    Response.Cookies["patterns"].Value = user.Patterns;
                    Response.Cookies["patterns"].Expires = DateTime.UtcNow.AddDays(7);
                    Response.Cookies["compensation"].Value = user.Compensation;
                    Response.Cookies["compensation"].Expires = DateTime.UtcNow.AddDays(7);
                    Response.Cookies["resultsEmailed"].Value = "yes";
                    Response.Cookies["resultsEmailed"].Expires = DateTime.UtcNow.AddDays(7);

                    if (!string.IsNullOrEmpty(user.Color))
                    {
                        Response.Cookies["color"].Value = user.Color;
                        Response.Cookies["color"].Expires = DateTime.UtcNow.AddDays(7);
                    }
                    if (!string.IsNullOrEmpty(user.Shape))
                    {
                        Response.Cookies["shape"].Value = user.Shape;
                        Response.Cookies["shape"].Expires = DateTime.UtcNow.AddDays(7);
                    }
                    if (!string.IsNullOrEmpty(user.Sport))
                    {
                        Response.Cookies["sport"].Value = user.Sport;
                        Response.Cookies["sport"].Expires = DateTime.UtcNow.AddDays(7);
                    }
                    if (!string.IsNullOrEmpty(user.School))
                    {
                        Response.Cookies["school"].Value = user.School;
                        Response.Cookies["school"].Expires = DateTime.UtcNow.AddDays(7);
                    }
                    if (!string.IsNullOrEmpty(user.EduLevel))
                    {
                        Response.Cookies["educationSelected"].Value = user.EduLevel;
                        Response.Cookies["educationSelected"].Expires = DateTime.UtcNow.AddDays(7);
                    }
                    string str = getInterestsJson(user);
                    ViewBag.Interests = str;
                    if (str != "[]")
                    {
                        Response.Cookies["question10"].Value = "1";
                        Response.Cookies["question10"].Expires = DateTime.UtcNow.AddDays(7);
                    }
                }
            }
            return View();
        }


        [HttpPost]
        public JsonResult EmailMeMyResults(string name, string email)
        {
            AddresseeClient adc = new AddresseeClient();
            LockedModeUserClient lmu = new LockedModeUserClient();
            string emailpartition = AddresseeClient.GetPartitionKeyForEmail(email);
            Addressee a = adc.GetByPartitionAndRowKey(emailpartition, email);
            if (a == null)
            {
                adc.AddNewItem(new Addressee(email.ToLower()) { Name = name, Email = email.ToLower() });
            }
            LockedModeUser user = lmu.GetByPartitionAndRowKey(emailpartition, email);
            if (user == null)
            {
                lmu.AddNewItem(new LockedModeUser
                {
                    PartitionKey = emailpartition,
                    RowKey = email.ToLower(),
                    Name = name,
                    Email = email.ToLower(),
                    Referer = "lm",

                    Attitude = Request.Cookies["attitude"] != null ? Request.Cookies["attitude"].Value : "",
                    Action = Request.Cookies["action"] != null ? Request.Cookies["action"].Value : "",
                    Information = Request.Cookies["information"] != null ? Request.Cookies["information"].Value : "",
                    Processing = Request.Cookies["processing"] != null ? Request.Cookies["processing"].Value : "",
                    Endurance = Request.Cookies["endurance"] != null ? Request.Cookies["endurance"].Value : "",
                    Patterns = Request.Cookies["patterns"] != null ? Request.Cookies["patterns"].Value : "",
                    Presence = Request.Cookies["presence"] != null ? Request.Cookies["presence"].Value : "",
                    Compensation = Request.Cookies["compensation"] != null ? Request.Cookies["compensation"].Value : "",
                    Concentration = Request.Cookies["concentration"] != null ? Request.Cookies["concentration"].Value : ""
                });
            }
            sendResultEmail(name, email);
            return new JsonResult { Data = new { result = "ok" } };
        }
        private void sendResultEmail(string name, string email)
        {
            SimpleAES aes = new SimpleAES();
            EmailManager emailManager = new EmailManager();
            EmailTemplateHelper eth = new EmailTemplateHelper();
            string token = aes.EncryptToBase64String(email);
            //string url = "http://www.CareerThesaurus.com/TakeTest/TestReport/" + token;
            string url = "http://www.CareerThesaurus.com/TakeTest/CareerReport/" + token;
            string body = eth.GetTemplate("testresults");
            body = body.Replace("{{name}}", name);
            body = body.Replace("{{url}}", url);
            emailManager.SendMail("admin@careerthesaurus.com", "CareerThesaurus", email, "Your Career Test Results", body);
        }
        private void sendResultEmailWithSchool(string name, string email, string selectedschool, string otherschools)
        {
            SimpleAES aes = new SimpleAES();
            EmailManager emailManager = new EmailManager();
            EmailTemplateHelper eth = new EmailTemplateHelper();
            string token = aes.EncryptToBase64String(email);
            string url = "http://www.CareerThesaurus.com/TakeTest/TestReport/" + token;
            string body = eth.GetTemplate("testresultswithschool");
            body = body.Replace("{{name}}", name);
            body = body.Replace("{{url}}", url);

            dynamic selected = JObject.Parse(selectedschool);
            dynamic other = JArray.Parse(otherschools);

            body = body.Replace("{{schoolname}}", (string)selected["name"] );
            body = body.Replace("{{schoollogo}}", (string)selected["logo"] );
            body = body.Replace("{{schoolurl}}", (string)selected["url"]);
            string str = "<table><tr>";
            foreach (dynamic item in other) 
            {
                if (item["name"] != selected["name"])
                {
                    //str += "<td><a href='" + item["url"] + "' ><img src='" + item["logo"] + "' alt='School logo' title='similar school'></a></td>";
                    str += "<td><a style='margin:0;' href='" + item["url"] + "' ><img src='" + item["logo"] + "' alt='' ></a><a style='padding-right:10px;' href='" + item["url"] + "' >" + item["name"] + "</a></td>";
                }
            }
            str += "</tr></table>";
            body = body.Replace("{{otherschools}}", str);

            emailManager.SendMail("admin@careerthesaurus.com", "CareerThesaurus", email, "Your Career Test Results", body);
        }
        private string getInterestsJson(LockedModeUser user)
        {
            InterestsModel model = new InterestsModel();
            List<string> result = new List<string>();
            foreach (var property in model.GetType().GetProperties())
            {
                if (user.GetType().GetProperty(property.Name).GetValue(user, null).ToString() == "1")
                {
                    result.Add(property.Name);
                }
            }
            if (result.Count == 0)
            {
                return "[]";
            }
            return "[\"" + string.Join<string>("\",\"", result) + "\"]";
        }
    }
}
