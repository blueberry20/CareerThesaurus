using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using SkillCowResponsive.Classes.Cloud.TableStorage;
using SkillCowResponsive.Classes;
using SkillCowResponsive.Classes.Email;
using SkillCowResponsive.Classes.Cloud.TableStorage.LockedModeUser;
using SkillCowResponsive.Classes.Encryption;
using SkillCowResponsive.Classes.Cloud.TableStorage.StudentAccount;
using SkillCowResponsive.Classes.Cloud.TableStorage.AssessmentInterest;
using SkillCowResponsive.Classes.Cloud.TableStorage.AssessmentCareer;

//using SkillCowResponsive.Classes.Cloud.TableStorage.AssessmentInterestRating;
//using SkillCowResponsive.Classes.Cloud.TableStorage.AssessmentCareerRating;
//using SkillCowResponsive.Classes.Cloud.TableStorage.StudentProfile;

namespace SkillCowResponsive.Controllers
{
    public class CareersController : AuthenticatedControllerController
    {
        //
        // GET: /Careers/


        public ActionResult Index(string id)
        {
            if (id == null)
            {
                return View();
            }
            else
            {
                return View(id);
            }
        }
        public ActionResult ByInterest()
        {

            return View();
        }
        public ActionResult SelectInterests()
        {
            return View();
        }
        public ActionResult ByPersonality()
        {
            return View();
        }
        public ActionResult ByPersonalityV2()
        {
            return View();
        }

        public ActionResult In(string id)
        {
            return View();
        }

        public ActionResult Index_pics()
        {
            return View();
        }

        [HttpPost]
        public JsonResult EmailMeMyResults(string name, string email, string attitude, string action, string information, string processing, string endurance, string patterns, string presence, string compensation, string concentration)
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
                    Referer = "general",

                    Attitude = attitude == null ? "" : attitude,
                    Action = action == null ? "" : action,
                    Information = information == null ? "" : information,
                    Processing = processing == null ? "" : processing,
                    Endurance = endurance == null ? "" : endurance,
                    Patterns = patterns == null ? "" : patterns,
                    Presence = presence == null ? "" : presence,
                    Compensation = compensation == null ? "" : compensation,
                    Concentration = concentration == null ? "" : concentration
                });
            }
            else
            {
                user.Attitude = attitude == null ? "" : attitude;
                user.Action = action == null ? "" : action;
                user.Information = information == null ? "" : information;
                user.Processing = processing == null ? "" : processing;
                user.Endurance = endurance == null ? "" : endurance;
                user.Patterns = patterns == null ? "" : patterns;
                user.Presence = presence == null ? "" : presence;
                user.Compensation = compensation == null ? "" : compensation;
                user.Concentration = concentration == null ? "" : concentration;
                lmu.Update(user);
            }
            sendResultEmail(name, email);
            return new JsonResult { Data = new { result = "ok" } };
        }

        [HttpPost]
        public JsonResult EmailMeMyInterestResults(string name, string email, int admiration, int adventure, int animals, int beauty, int competition, int coordinating, int creativity, int critical, int drafting, int duty, int handlabor, int helping, int machinery, int numbers, int people, int politics, int safety, int salesy, int science, int strength, int technology)
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
                    Referer = "general",
                    admiration = admiration,
                    adventure = adventure,
                    animals = animals, 
                    beauty = beauty,
                    competition = competition, 
                    coordinating = coordinating, 
                    creativity = creativity, 
                    critical = critical, 
                    drafting = drafting, 
                    duty = duty, 
                    handlabor = handlabor,
                    helping = helping, 
                    machinery = machinery, 
                    numbers = numbers, 
                    people = people, 
                    politics = politics, 
                    safety = safety, 
                    salesy = salesy, 
                    science = science, 
                    strength = strength, 
                    technology = technology
                });
            }
            else
            {
                    user.admiration = admiration;
                    user.adventure = adventure;
                    user.animals = animals;
                    user.beauty = beauty;
                    user.competition = competition; 
                    user.coordinating = coordinating; 
                    user.creativity = creativity; 
                    user.critical = critical; 
                    user.drafting = drafting; 
                    user.duty = duty; 
                    user.handlabor = handlabor;
                    user.helping = helping; 
                    user.machinery = machinery; 
                    user.numbers = numbers; 
                    user.people = people; 
                    user.politics = politics; 
                    user.safety = safety; 
                    user.salesy = salesy; 
                    user.science = science; 
                    user.strength = strength;
                    user.technology = technology;
                lmu.Update(user);
            }
            sendInterestResultEmail(name, email);
            return new JsonResult { Data = new { result = "ok" } };
        }

        [HttpPost]
        public void SaveInterest(string user, string interest, string rating)
        {
            StudentAccountClient sac = new StudentAccountClient();
            StudentAccount student = sac.GetByPartitionAndRowKey(StudentAccountClient.GetPartitionKeyForEmail(user), user);
            if (student != null)
            {
                AssessmentInterestClient aic = new AssessmentInterestClient();
                AssessmentInterest interestRating = aic.GetByPartitionAndRowKey(student.School, user + student.Year + student.Grade + interest);
                if (interestRating == null)
                {
                    aic.AddNewItem(new AssessmentInterest { PartitionKey = student.School, RowKey = user + student.Year + student.Grade + interest, Value = rating, Counselor = student.Counselor, Student = user, Grade = student.Grade, GroupName = student.GroupName, Interest = interest, Year = student.Year });
                    //airc.AddNewItem(new AssessmentInterestRating { PartitionKey = student.School, RowKey = user + interest, Rating = rating, GradYear = student.GradYear, Student = user, Teacher = student.Teacher, Group = student.Group });
                }
                else
                {
                    interestRating.Value = rating;
                    aic.Update(interestRating);
                }
            }

            //StudentProfileClient spc = new StudentProfileClient();
            //StudentProfile student = spc.GetByPartitionAndRowKey(StudentProfileClient.GetPartitionKeyForEmail(user), user);
            //AssessmentInterestRatingClient airc = new AssessmentInterestRatingClient();
            //AssessmentInterestRating interestRating = airc.GetByPartitionAndRowKey(student.School, user + interest);
        }
        [HttpPost]
        public void SaveCareerRating(string user, string career, string rating)
        {
            StudentAccountClient sac = new StudentAccountClient();
            StudentAccount student = sac.GetByPartitionAndRowKey(StudentAccountClient.GetPartitionKeyForEmail(user), user);
            if (student != null)
            {
                AssessmentCareerClient acc = new AssessmentCareerClient();
                AssessmentCareer careerRating = acc.GetByPartitionAndRowKey(student.School, user + student.Year + student.Grade + career);
                if (careerRating == null)
                {
                    acc.AddNewItem(new AssessmentCareer { PartitionKey = student.School, RowKey = user + student.Year + student.Grade + career, Value = rating, Counselor = student.Counselor, Student = user, Grade = student.Grade, GroupName = student.GroupName, DolCode = career, Year = student.Year });
                    //acrc.AddNewItem(new AssessmentCareerRating { PartitionKey = student.School, RowKey = user + career, DolCode = career, Rating = rating, GradYear = student.GradYear, Student = user, Teacher = student.Teacher, Group = student.Group });
                    if (rating == "1")
                    {
                        student.RatedCareers++;
                    }
                    else
                    {
                        student.DislikeCareers++;
                    }
                    sac.Update(student);
                }
                else
                {
                    if (careerRating.Value != rating) {
                        if (rating == "1")
                        {
                            student.DislikeCareers--;
                            student.RatedCareers++;
                        }
                        else
                        {
                            student.DislikeCareers++;
                            student.RatedCareers--;
                        }
                        sac.Update(student);
                    }
                    careerRating.Value = rating;
                    acc.Update(careerRating);
                }
            }

            //StudentProfileClient spc = new StudentProfileClient();
            //StudentProfile student = spc.GetByPartitionAndRowKey(StudentProfileClient.GetPartitionKeyForEmail(user), user);
            //AssessmentCareerRatingClient acrc = new AssessmentCareerRatingClient();
            //AssessmentCareerRating careerRating = acrc.GetByPartitionAndRowKey(student.School, user + career);
        }
        class CareerRating
        {
            public string dolcode { get; set; }
            public string rating { get; set; }
        }
        [HttpPost]
        public HttpResponse GetCareerRatings(string user)
        {
            JavaScriptSerializer jss = new JavaScriptSerializer();

            StudentAccountClient sac = new StudentAccountClient();
            StudentAccount student = sac.GetByPartitionAndRowKey(StudentAccountClient.GetPartitionKeyForEmail(user), user);
            AssessmentCareerClient acc = new AssessmentCareerClient();
            List<AssessmentCareer> careerRatings = new List<AssessmentCareer>(acc.GetAllCurrentByStudent(student.School, user, student.Year, student.Grade));

            //StudentProfileClient spc = new StudentProfileClient();
            //StudentProfile student = spc.GetByPartitionAndRowKey(StudentProfileClient.GetPartitionKeyForEmail(user), user);
            //AssessmentCareerRatingClient acrc = new AssessmentCareerRatingClient();
            //List<AssessmentCareerRating> careerRatings =  new List<AssessmentCareerRating>(acrc.GetAllBySchoolAndStudent(student.School, user));
            List<CareerRating> results = new List<CareerRating>();
            string response;
            if (careerRatings.Count != 0)
            {
                foreach (AssessmentCareer careerRating in careerRatings)
                {
                    results.Add(new CareerRating { dolcode = careerRating.DolCode, rating = careerRating.Value });
                }
                response = "{\"result\": \"ok\", \"results\":" + jss.Serialize(results) + "}";
            }
            else
            {
                response = "{\"result\": \"ok\", \"results\":[]}";
            }            
            Response.ContentType = "application/json";
            Response.Write(response);
            Response.End();
            return null;
        }

        public ActionResult CareerReport(string id)
        {
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
                    return View();
                }
            }
            return RedirectToAction("Index", "Home");
        }

        public ActionResult InterestReport(string id)
        {
            if (!string.IsNullOrEmpty(id))
            {
                SimpleAES aes = new SimpleAES();
                string email = aes.DecryptFromBase64String(id);
                LockedModeUserClient lmu = new LockedModeUserClient();
                LockedModeUser user = lmu.GetByPartitionAndRowKey(LockedModeUserClient.GetPartitionKeyForEmail(email), email);
                List<string> interests = new List<string>();
                if (user != null)
                {
                    Type userType = user.GetType();
                    foreach (var key in userType.GetProperties())
                    {
                        if (key.CanRead)
                        {
                             object value = key.GetValue(user, null);
                            if (value.ToString() == "1")
                            {
                                interests.Add(key.Name);
                            }
                        }
                    }
                    ViewBag.Interests = interests;
                    return View();
                }
            }
            return RedirectToAction("Index", "Home");
        }

        private void sendResultEmail(string name, string email)
        {
            SimpleAES aes = new SimpleAES();
            EmailManager emailManager = new EmailManager();
            EmailTemplateHelper eth = new EmailTemplateHelper();
            string token = aes.EncryptToBase64String(email);
            string url = "http://www.CareerThesaurus.com/Careers/CareerReport/" + token;
            string body = eth.GetTemplate("testresults");
            body = body.Replace("{{name}}", name);
            body = body.Replace("{{url}}", url);
            emailManager.SendMail("admin@careerthesaurus.com", "CareerThesaurus", email, "Your Career Test Results", body);
        }

        private void sendInterestResultEmail(string name, string email)
        {
            SimpleAES aes = new SimpleAES();
            EmailManager emailManager = new EmailManager();
            EmailTemplateHelper eth = new EmailTemplateHelper();
            string token = aes.EncryptToBase64String(email);
            string url = "http://www.CareerThesaurus.com/Careers/InterestReport/" + token;
            string body = eth.GetTemplate("interestresults");
            body = body.Replace("{{name}}", name);
            body = body.Replace("{{url}}", url);
            emailManager.SendMail("admin@careerthesaurus.com", "CareerThesaurus", email, "Your Career Test Results", body);
        }
    }
}
