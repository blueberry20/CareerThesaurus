using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using SkillCowResponsive.Classes.Cloud.BlobStorage;
using SkillCowResponsive.Classes.Cloud.TableStorage.UserAccount;

using SkillCowResponsive.Classes.Cloud.TableStorage.StudentAccount;
using SkillCowResponsive.Classes.Cloud.TableStorage.AssessmentDimension;
using SkillCowResponsive.Classes.Cloud.TableStorage.AssessmentInterest;
using SkillCowResponsive.Classes.Cloud.TableStorage.AssessmentCareer;
using SkillCowResponsive.Classes.Cloud.TableStorage.AccessCode;
using SkillCowResponsive.Classes.Cloud.TableStorage.AdminAccount;
using SkillCowResponsive.Classes.Cloud.TableStorage.CounselorAccount;

//using SkillCowResponsive.Classes.Cloud.TableStorage.StudentProfile;
//using SkillCowResponsive.Classes.Cloud.TableStorage.AssessmentGroup;
//using SkillCowResponsive.Classes.Cloud.TableStorage.AssessmentDimensionsRating;
//using SkillCowResponsive.Classes.Cloud.TableStorage.AssessmentInterestRating;
//using SkillCowResponsive.Classes.Cloud.TableStorage.AssessmentCareerRating;

namespace SkillCowResponsive.Controllers
{
    public class AnalyticsController : AuthenticatedControllerController
    {
        //
        // GET: /Analytics/
        public string[] dimensions = { "attitude", "endurance", "action", "concentration", "information", "processing", "presence", "patterns", "compensation" };
        public string[] interests = { "beauty", "helping", "adventure", "safety", "people", "science", "duty", "admiration", "creativity", "competition", "animals", "politics", "technology", "machinery", "handlabor", "strength", "drafting", "coordinating", "numbers", "critical", "salesy" };
        
        private string CurrentGradYear()
        {
            return DateTime.Now.Month < 7 ? DateTime.Now.Year.ToString() : (DateTime.Now.Year + 1).ToString();
        }
        class Dimension
        {
            public string name { get; set; }
            public int count { get; set; }
        }
        class Interest
        {
            public string name { get; set; }
            public int like { get; set; }
            public int dislike { get; set; }
        }
        class Career
        {
            public string dolcode { get; set; }
            public int count { get; set; }
        }
        class Student
        {
            public string firstName { get; set; }
            public string lastName { get; set; }
            public string Email { get; set; }
            public int dimensions { get; set; }
            public int interests { get; set; }
            public int careers { get; set; }
            public int dislikecareers { get; set; }
        }
        class DimensionV3
        {
            public string group { get; set; }
            public List<Dimension> dimensions { get; set; }
        }
        class InterestV3
        {
            public string group { get; set; }
            public List<Interest> interests { get; set; }
        }
        class CareerV3
        {
            public string group { get; set; }
            public List<Career> careers { get; set; }
        }
        class StudentV3
        {
            public string group { get; set; }
            public List<Student> students { get; set; }
        }
        public ActionResult sandbox()
        {
            return View();
        }

        public ActionResult analytics()
        {
            return View();
        }

        public ActionResult Index()
        {
            if (AuthTokens[0] == "demo")
            {
                ViewBag.DemoNextStep = NextStep("m");
            }
            return View();
        }

        public ActionResult Traits()
        {
            string school;
            string email = AuthTokens[1];
            if (AuthTokens[0] == "demo")
            {
                ViewBag.DemoNextStep = NextStep("t");
                school = "7181234567";
            }
            else if (AuthTokens[3] == "administrator")
            {
                AdminAccountClient aac = new AdminAccountClient();
                AdminAccount admin = aac.GetByPartitionAndRowKey("admin", email);
                school = admin.School;
            }
            else if (AuthTokens[3] == "su")
            {
                AdminAccountClient aac = new AdminAccountClient();
                string adminRowKey = Request.Cookies["adminrowkey"].Value;
                AdminAccount admin = aac.GetByPartitionAndRowKey("admin", adminRowKey);
                school = admin.School;
            }
            else 
            {
                CounselorAccountClient cac = new CounselorAccountClient();
                CounselorAccount counselor = cac.GetByPartitionAndRowKey("counselor", email);
                school = counselor.School;
            }
            ViewBag.School = school;
            ViewBag.Year = CurrentGradYear();
            return View("TraitsV2");
        }
        public ActionResult TraitsV2()
        {
            string school;
            string email = AuthTokens[1];
            if (AuthTokens[0] == "demo")
            {
                ViewBag.DemoNextStep = NextStep("t");
                school = "7181234567";
            }
            else if (AuthTokens[3] == "administrator")
            {
                AdminAccountClient aac = new AdminAccountClient();
                AdminAccount admin = aac.GetByPartitionAndRowKey("admin", email);
                school = admin.School;
            }
            else
            {
                CounselorAccountClient cac = new CounselorAccountClient();
                CounselorAccount counselor = cac.GetByPartitionAndRowKey("counselor", email);
                school = counselor.School;
            }
            ViewBag.School = school;
            ViewBag.Year = CurrentGradYear();
            return View();
        }

        public ActionResult Interests()
        {
            string school;
            string email = AuthTokens[1];
            if (AuthTokens[0] == "demo")
            {
                ViewBag.DemoNextStep = NextStep("i");
                school = "7181234567";
            }
            else if (AuthTokens[3] == "administrator")
            {
                AdminAccountClient aac = new AdminAccountClient();
                AdminAccount admin = aac.GetByPartitionAndRowKey("admin", email);
                school = admin.School;
            }
            else if (AuthTokens[3] == "su")
            {
                AdminAccountClient aac = new AdminAccountClient();
                string adminRowKey = Request.Cookies["adminrowkey"].Value;
                AdminAccount admin = aac.GetByPartitionAndRowKey("admin", adminRowKey);
                school = admin.School;
            }
            else
            {
                CounselorAccountClient cac = new CounselorAccountClient();
                CounselorAccount counselor = cac.GetByPartitionAndRowKey("counselor", email);
                school = counselor.School;
            }
            ViewBag.School = school;
            ViewBag.Year = CurrentGradYear();
            return View("InterestsV2");
        }

        public ActionResult InterestsV2()
        {
            string school;
            string email = AuthTokens[1];
            if (AuthTokens[0] == "demo")
            {
                ViewBag.DemoNextStep = NextStep("i");
                school = "7181234567";
            }
            else if (AuthTokens[3] == "administrator")
            {
                AdminAccountClient aac = new AdminAccountClient();
                AdminAccount admin = aac.GetByPartitionAndRowKey("admin", email);
                school = admin.School;
            }
            else
            {
                CounselorAccountClient cac = new CounselorAccountClient();
                CounselorAccount counselor = cac.GetByPartitionAndRowKey("counselor", email);
                school = counselor.School;
            }
            ViewBag.School = school;
            ViewBag.Year = CurrentGradYear();
            return View();
        }
        public ActionResult Careers()
        {
            string school;
            string email = AuthTokens[1];
            if (AuthTokens[0] == "demo")
            {
                ViewBag.DemoNextStep = NextStep("c");
                school = "7181234567";
            }
            else if (AuthTokens[3] == "administrator")
            {
                AdminAccountClient aac = new AdminAccountClient();
                AdminAccount admin = aac.GetByPartitionAndRowKey("admin", email);
                school = admin.School;
            }
            else if (AuthTokens[3] == "su")
            {
                AdminAccountClient aac = new AdminAccountClient();
                string adminRowKey = Request.Cookies["adminrowkey"].Value;
                AdminAccount admin = aac.GetByPartitionAndRowKey("admin", adminRowKey);
                school = admin.School;
            }
            else
            {
                CounselorAccountClient cac = new CounselorAccountClient();
                CounselorAccount counselor = cac.GetByPartitionAndRowKey("counselor", email);
                school = counselor.School;
            }
            ViewBag.School = school;
            ViewBag.Year = CurrentGradYear();
            return View("CareersV2");
        }
        public ActionResult CareersV2()
        {
            string school;
            string email = AuthTokens[1];
            if (AuthTokens[0] == "demo")
            {
                ViewBag.DemoNextStep = NextStep("c");
                school = "7181234567";
            }
            else if (AuthTokens[3] == "administrator")
            {
                AdminAccountClient aac = new AdminAccountClient();
                AdminAccount admin = aac.GetByPartitionAndRowKey("admin", email);
                school = admin.School;
            }
            else
            {
                CounselorAccountClient cac = new CounselorAccountClient();
                CounselorAccount counselor = cac.GetByPartitionAndRowKey("counselor", email);
                school = counselor.School;
            }
            ViewBag.School = school;
            ViewBag.Year = CurrentGradYear();
            return View();
        }
        public ActionResult StudentReports()
        {
            string school;
            string email = AuthTokens[1];
            if (AuthTokens[0] == "demo")
            {
                ViewBag.DemoNextStep = NextStep("!");
                school = "7181234567";
            }
            else if (AuthTokens[3] == "administrator")
            {
                AdminAccountClient aac = new AdminAccountClient();
                AdminAccount admin = aac.GetByPartitionAndRowKey("admin", email);
                school = admin.School;
            }
            else if (AuthTokens[3] == "su")
            {
                AdminAccountClient aac = new AdminAccountClient();
                string adminRowKey = Request.Cookies["adminrowkey"].Value;
                AdminAccount admin = aac.GetByPartitionAndRowKey("admin", adminRowKey);
                school = admin.School;
            }
            else
            {
                CounselorAccountClient cac = new CounselorAccountClient();
                CounselorAccount counselor = cac.GetByPartitionAndRowKey("counselor", email);
                school = counselor.School;
            }
            ViewBag.School = school;
            ViewBag.Year = CurrentGradYear();
            return View("StudentReportsV2");
        }
        public ActionResult StudentReportsV2()
        {
            string school;
            string email = AuthTokens[1];
            if (AuthTokens[0] == "demo")
            {
                ViewBag.DemoNextStep = NextStep("!");
                school = "7181234567";
            }
            else if (AuthTokens[3] == "administrator")
            {
                AdminAccountClient aac = new AdminAccountClient();
                AdminAccount admin = aac.GetByPartitionAndRowKey("admin", email);
                school = admin.School;
            }
            else
            {
                CounselorAccountClient cac = new CounselorAccountClient();
                CounselorAccount counselor = cac.GetByPartitionAndRowKey("counselor", email);
                school = counselor.School;
            }
            ViewBag.School = school;
            ViewBag.Year = CurrentGradYear();
            return View();
        }
        public ActionResult StudentList(string key, string value)
        {
            if (key == null || value == null)
            {
                return RedirectToAction("Index");
            }
            key = key.ToLower();
            string school;
            string email = AuthTokens[1];
            string showCounselor;
            if (AuthTokens[0] == "demo")
            {
                ViewBag.DemoNextStep = NextStep("s");
                school = "7181234567";
                showCounselor = AuthTokens[1];
            }
            else if (AuthTokens[3] == "administrator")
            {
                AdminAccountClient aac = new AdminAccountClient();
                AdminAccount admin = aac.GetByPartitionAndRowKey("admin", email);
                school = admin.School;
                showCounselor = "";
            }
            else if (AuthTokens[3] == "su")
            {
                AdminAccountClient aac = new AdminAccountClient();
                string adminRowKey = Request.Cookies["adminrowkey"].Value;
                AdminAccount admin = aac.GetByPartitionAndRowKey("admin", adminRowKey);
                school = admin.School;
                showCounselor = "";
            }
            else
            {
                CounselorAccountClient cac = new CounselorAccountClient();
                CounselorAccount counselor = cac.GetByPartitionAndRowKey("counselor", email);
                school = counselor.School;
                showCounselor = AuthTokens[1];
            }
            string year = "all";
            string grade = "all";
            string gender = "all";
            string groupName = "all";
            showCounselor = "all";
            if (Request.Cookies["analyticsgrade"] != null)
            {
                grade = Request.Cookies["analyticsgrade"].Value;
            }
            if (Request.Cookies["analyticsgender"] != null)
            {
                gender = Request.Cookies["analyticsgender"].Value;
            }
            if (Request.Cookies["analyticsyear"] != null)
            {
                year = Request.Cookies["analyticsyear"].Value;
            }
            if (Request.Cookies["analyticsgroup"] != null)
            {
                groupName = Request.Cookies["analyticsgroup"].Value;
            }
            if (Request.Cookies["analyticscounselor"] != null)
            {
                showCounselor = Request.Cookies["analyticscounselor"].Value;
            }
            //if (AuthTokens[0] == "demo")
            //{
            //    ViewBag.DemoNextStep = NextStep("s");
            //    school = "7181234567";
            //}
            //else
            //{
            //    if (Request.Cookies["analyticsschoolname"] != null)
            //    {
            //        school = Request.Cookies["analyticsschoolname"].Value;
            //    }
            //    else
            //    {
            //        return RedirectToAction("Index");
            //    }
            //    if (Request.Cookies["analyticsschoolgroup"] != null)
            //    {
            //        group = Request.Cookies["analyticsschoolgroup"].Value;
            //    }
            //}
            UserAccountClient uac = new UserAccountClient();
            List<UserAccount> StudentsList = new List<UserAccount>();
            if (key == "trait")
            {
                value = value.Substring(0, 1).ToUpper() + value.Substring(1).ToLower();
                AssessmentDimensionClient adc = new AssessmentDimensionClient();
                List<AssessmentDimension> dimensionList = new List<AssessmentDimension>(adc.GetAllBySchoolAndValue(school, value));
                if (dimensionList.Count != 0)
                {
                    var matchedDimensions = from e in dimensionList
                                            where (grade == "all" || e.Grade == grade) && (gender == "all" || e.Gender == (gender == "male" ? true : false)) && (year == "all" || e.Year == year) && (showCounselor == "all" || e.Counselor == showCounselor) && (groupName == "all" || e.GroupName == groupName)
                                            select e;
                    if (matchedDimensions.Count() != 0)
                    {
                        foreach (AssessmentDimension dimension in matchedDimensions)
                        {
                            string student = dimension.Student.ToLower();
                            StudentsList.Add(uac.GetByPartitionAndRowKey(UserAccountClient.GetPartitionKeyForEmail(student), student));
                        }
                        
                        ViewBag.PageUrl = "Traits";
                        ViewBag.PageCaption = "Traits";
                        ViewBag.Param = value;
                        ViewBag.Students = StudentsList;
                    }
                }
                //AssessmentDimensionsRatingClient adrc = new AssessmentDimensionsRatingClient();
                //List<AssessmentDimensionsRating> dimensionList;
                //if (group == "")
                //{
                //    dimensionList = new List<AssessmentDimensionsRating>(adrc.GetAllBySchoolAndValue(school, value));
                //}
                //else
                //{
                //    dimensionList = new List<AssessmentDimensionsRating>(adrc.GetAllBySchoolAndGroupAndValue(school, group, value));
                //}
                //if (dimensionList.Count != 0)
                //{
                //    foreach (AssessmentDimensionsRating rating in dimensionList)
                //    {
                //        string student = rating.Student.ToLower();
                //        StudentsList.Add(uac.GetByPartitionAndRowKey(StudentProfileClient.GetPartitionKeyForEmail(student), student));
                //    }
                //    ViewBag.PageUrl = "Traits";
                //    ViewBag.PageCaption = "Traits";
                //    ViewBag.Param = value;
                //    ViewBag.Students = StudentsList;
                //}
            }
            else if (key == "interest")
            {
                value = value.ToLower();
                AssessmentInterestClient aic = new AssessmentInterestClient();
                List<AssessmentInterest> interestList = new List<AssessmentInterest>(aic.GetAllBySchoolAndValue(school, value, "1"));
                if (interestList.Count != 0)
                {
                    var matchedInterests = from e in interestList
                                           where (grade == "all" || e.Grade == grade) && (gender == "all" || e.Gender == (gender == "male" ? true : false)) && (year == "all" || e.Year == year) && (showCounselor == "all" || e.Counselor == showCounselor) && (groupName == "all" || e.GroupName == groupName)
                                           //where (grade == "" || e.Grade == grade) && (gender == "" || e.Gender ==(gender == "male" ? true : false))
                                           select e;
                    if (matchedInterests.Count() != 0)
                    {
                        foreach (AssessmentInterest interest in matchedInterests)
                        {
                            string student = interest.Student.ToLower();
                            StudentsList.Add(uac.GetByPartitionAndRowKey(UserAccountClient.GetPartitionKeyForEmail(student), student));
                        }
                        ViewBag.PageUrl = "Interests";
                        ViewBag.PageCaption = "Interests";
                        ViewBag.Param = value;
                        ViewBag.Students = StudentsList;
                    }
                }
                //AssessmentInterestRatingClient airc = new AssessmentInterestRatingClient();
                //value = value.ToLower();
                //List<AssessmentInterestRating> interestList;
                //if (group == "")
                //{
                //    interestList = new List<AssessmentInterestRating>(airc.GetAllBySchoolAndRating(school, value, "1"));
                //}
                //else
                //{
                //    interestList = new List<AssessmentInterestRating>(airc.GetAllBySchoolAndGroupAndRating(school, value, group, "1"));
                //}
                //if (interestList.Count != 0)
                //{
                //    foreach (AssessmentInterestRating rating in interestList)
                //    {
                //        string student = rating.Student.ToLower();
                //        StudentsList.Add(uac.GetByPartitionAndRowKey(StudentProfileClient.GetPartitionKeyForEmail(student), student));
                //    }
                //    ViewBag.PageUrl = "Interests";
                //    ViewBag.PageCaption = "Interests";
                //    ViewBag.Param = value;
                //    ViewBag.Students = StudentsList;
                //}
            }
            else if (key == "popularcareer" || key == "unpopularcareer")
            {
                string rating = key == "popularcareer" ? "1" : "0";
                string dolcode = "";
                BlobJsonResourceManager blobManager = new BlobJsonResourceManager();
                string str = blobManager.GetJsonResource("careers", "dolcodes", value + ".js");
                if (str != "")
                {
                    Regex regex = new Regex(@"\d{2}-\d{4}");
                    dolcode = regex.Match(str).ToString();
                }
                else
                {
                    return RedirectToAction("Index");
                }
                AssessmentCareerClient acc = new AssessmentCareerClient();
                List<AssessmentCareer> careerList = new List<AssessmentCareer>(acc.GetAllBySchoolAndValue(school, dolcode, rating));
                if (careerList.Count != 0)
                {
                    var matchedCareers = from e in careerList
                                         where (grade == "all" || e.Grade == grade) && (gender == "all" || e.Gender == (gender == "male" ? true : false)) && (year == "all" || e.Year == year) && (showCounselor == "all" || e.Counselor == showCounselor) && (groupName == "all" || e.GroupName == groupName)
                                         //where (grade == "" || e.Grade == grade) && (gender == "" || e.Gender == (gender == "male" ? true : false))
                                         select e;
                    if (matchedCareers.Count() != 0)
                    {
                        foreach (AssessmentCareer career in matchedCareers)
                        {
                            string student = career.Student.ToLower();
                            StudentsList.Add(uac.GetByPartitionAndRowKey(UserAccountClient.GetPartitionKeyForEmail(student), student));
                        }
                        ViewBag.PageUrl = "Careers";
                        ViewBag.PageCaption = "Careers";
                        ViewBag.Param = value;
                        ViewBag.Like = rating == "1" ? "liked" : "didn\'t like";
                        ViewBag.Students = StudentsList;
                    }
                }
                //AssessmentCareerRatingClient acrc = new AssessmentCareerRatingClient();
                //List<AssessmentCareerRating> careerList;
                //if (group == "")
                //{
                //    careerList = new List<AssessmentCareerRating>(acrc.GetAllBySchoolAndRating(school, dolcode, rating));
                //}
                //else
                //{
                //    careerList = new List<AssessmentCareerRating>(acrc.GetAllBySchoolAndGroupAndRating(school, dolcode, group, rating));
                //}
                //if (careerList.Count != 0)
                //{
                //    foreach (AssessmentCareerRating career in careerList)
                //    {
                //        string student = career.Student.ToLower();
                //        StudentsList.Add(uac.GetByPartitionAndRowKey(StudentProfileClient.GetPartitionKeyForEmail(student), student));
                //    }
                //    ViewBag.PageUrl = "Careers";
                //    ViewBag.PageCaption = "Careers";
                //    ViewBag.Param = value;
                //    ViewBag.Like = rating == "1" ? "liked" : "didn\'t like";
                //    ViewBag.Students = StudentsList;
                //}
            }
            else
            {
                return RedirectToAction("Index");
            }
            return View();
        }

        //==============================================================================================================================================================

        [HttpPost]
        public HttpResponse GetYearAndGrade()
        {
            string response;
            string school;
            string email = AuthTokens[1];
            if (AuthTokens[3] == "administrator")
            {
                AdminAccountClient aac = new AdminAccountClient();
                AdminAccount admin = aac.GetByPartitionAndRowKey("admin", email);
                school = admin.School;
            }
            else
            {
                CounselorAccountClient cac = new CounselorAccountClient();
                CounselorAccount counselor = cac.GetByPartitionAndRowKey("counselor", email);
                school = counselor.School;
            }
            AccessCodeClient acc = new AccessCodeClient();
            List<AccessCode> groups = new List<AccessCode>(acc.GetAllBySchool(school));
            if (groups.Count != 0)
            {
                List<string> years = groups.Select(x => x.Year).Distinct().ToList();
                List<string> output = new List<string>();
                foreach (string year in years)
                {
                    output.Add("{\"year\":\"" + year + "\", \"grades\":[\"" + string.Join("\",\"", groups.Where(x => x.Year == year).Select(x => x.Grade).Distinct()) + "\"]}");
                }
                response = "{\"result\": \"ok\", \"results\":[" + string.Join(",", output) + "]}";
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
        [HttpPost]
        public HttpResponse GetDimensionsV2(string year, string grade, string gender, string counselor, string schoolrow)
        {
            JavaScriptSerializer jss = new JavaScriptSerializer();
            string response = "";
            string school;
            string email = AuthTokens[1];
            string showCounselor;
            if (AuthTokens[3] == "administrator")
            {
                AdminAccountClient aac = new AdminAccountClient();
                AdminAccount admin = aac.GetByPartitionAndRowKey("admin", email);
                school = admin.School;
                showCounselor = counselor;
            }
            else if (AuthTokens[3] == "su")
            {
                school = schoolrow;
                showCounselor = counselor;
            }
            else
            {
                CounselorAccountClient cac = new CounselorAccountClient();
                CounselorAccount counselorAccount = cac.GetByPartitionAndRowKey("counselor", email);
                school = counselorAccount.School;
                showCounselor = AuthTokens[1];
            }
            AssessmentDimensionClient adc = new AssessmentDimensionClient();
            List<AssessmentDimension> dimensionsList = new List<AssessmentDimension>(adc.GetAllByPartition(school));
            if (dimensionsList.Count != 0)
            {
                var matchedDimensions = from e in dimensionsList
                                        where (year == "" || e.Year == year) && (grade == "" || e.Grade == grade) && (gender == "" || e.Gender == (gender == "male" ? true : false)) && (counselor == "" || e.Counselor == showCounselor)
                                        select e;
                if (matchedDimensions.Count() != 0)
                {
                    List<Dimension> resultList = new List<Dimension>();
                    foreach (string dimension in dimensions)
                    {
                        var values = matchedDimensions.Where(x => x.Dimension == dimension).GroupBy(x => x.Value).ToList();
                        foreach (var value in values)
                        {
                            resultList.Add(new Dimension { name = value.Key, count = value.Count() });
                        }
                    }
                    response = "{\"result\": \"ok\", \"results\": " + jss.Serialize(resultList) + "}";
                }
                else
                {
                    response = "{\"result\": \"ok\", \"results\": []}";
                }
            }
            else
            {
                response = "{\"result\": \"ok\", \"results\": []}";
            }
            Response.ContentType = "application/json";
            Response.Write(response);
            Response.End();
            return null;
        }
        //============================================================================================================================
        [HttpPost]
        public HttpResponse GetDimensionsV3(string year, string grade, string gender, string counselor, string schoolrow)
        {
            JavaScriptSerializer jss = new JavaScriptSerializer();
            string response = "";
            string school;
            string email = AuthTokens[1];
            string showCounselor;
            if (AuthTokens[3] == "administrator")
            {
                AdminAccountClient aac = new AdminAccountClient();
                AdminAccount admin = aac.GetByPartitionAndRowKey("admin", email);
                school = admin.School;
                showCounselor = counselor;
            }
            else if (AuthTokens[3] == "su")
            {
                school = schoolrow;
                showCounselor = counselor;
            }
            else
            {
                CounselorAccountClient cac = new CounselorAccountClient();
                CounselorAccount counselorAccount = cac.GetByPartitionAndRowKey("counselor", email);
                school = counselorAccount.School;
                showCounselor = counselor;
            }
            AssessmentDimensionClient adc = new AssessmentDimensionClient();
            List<AssessmentDimension> dimensionsList = new List<AssessmentDimension>(adc.GetAllByPartition(school));
            if (dimensionsList.Count != 0)
            {
                var matchedDimensions = from e in dimensionsList
                                        where (year == "" || e.Year == year) && (grade == "" || e.Grade == grade) && (gender == "" || e.Gender == (gender == "male" ? true : false)) && (counselor == "" || e.Counselor == showCounselor)
                                        select e;
                if (matchedDimensions.Count() != 0)
                {
                    List<DimensionV3> resultListV3 = new List<DimensionV3>();
                    var groups = matchedDimensions.Select(x => x.GroupName).Distinct().ToList();
                    foreach (var group in groups)
                    {
                        List<Dimension> resultList = new List<Dimension>();
                        foreach (string dimension in dimensions)
                        {
                            var values = matchedDimensions.Where(x => x.Dimension == dimension && x.GroupName == group).GroupBy(x => x.Value).ToList();
                            foreach (var value in values)
                            {
                                resultList.Add(new Dimension { name = value.Key, count = value.Count() });
                            }
                        }
                        resultListV3.Add(new DimensionV3 { group = group, dimensions = resultList });
                    }
                    response = "{\"result\": \"ok\", \"results\": " + jss.Serialize(resultListV3) + "}";
                }
                else
                {
                    response = "{\"result\": \"ok\", \"results\": []}";
                }
            }
            else
            {
                response = "{\"result\": \"ok\", \"results\": []}";
            }
            Response.ContentType = "application/json";
            Response.Write(response);
            Response.End();
            return null;
        }
        [HttpPost]
        public HttpResponse GetInterestsV2(string year, string grade, string gender, string counselor, string schoolrow)
        {
            JavaScriptSerializer jss = new JavaScriptSerializer();
            string response = "";
            string school;
            string email = AuthTokens[1];
            string showCounselor;
            if (AuthTokens[3] == "administrator")
            {
                AdminAccountClient aac = new AdminAccountClient();
                AdminAccount admin = aac.GetByPartitionAndRowKey("admin", email);
                school = admin.School;
                showCounselor = counselor;
            }
            else if (AuthTokens[3] == "su")
            {
                school = schoolrow;
                showCounselor = counselor;
            }
            else
            {
                CounselorAccountClient cac = new CounselorAccountClient();
                CounselorAccount counselorAccount = cac.GetByPartitionAndRowKey("counselor", email);
                school = counselorAccount.School;
                showCounselor = AuthTokens[1];
            }
            AssessmentInterestClient aic = new AssessmentInterestClient();
            List<AssessmentInterest> interestsList = new List<AssessmentInterest>(aic.GetAllByPartition(school));
            if (interestsList.Count != 0)
            {
                var matchedInterests = from e in interestsList
                                       where (year == "" || e.Year == year) && (grade == "" || e.Grade == grade) && (gender == "" || e.Gender == (gender == "male" ? true : false)) && (counselor == "" || e.Counselor == showCounselor)
                                       select e;
                if (matchedInterests.Count() != 0)
                {
                    List<Interest> resultList = new List<Interest>();
                    foreach (string interest in interests)
                    {
                        var values = matchedInterests.Where(x => x.Interest == interest).GroupBy(x => x.Value).ToList();
                        int like = 0;
                        int dislike = 0;
                        foreach (var value in values)
                        {
                            if (value.Key == "1")
                            {
                                like = value.Count();
                            }
                            else
                            {
                                dislike = value.Count();
                            }
                        }
                        resultList.Add(new Interest { name = interest, like = like, dislike = dislike });
                    }
                    response = "{\"result\": \"ok\", \"results\": " + jss.Serialize(resultList) + "}";
                }
                else
                {
                    response = "{\"result\": \"ok\", \"results\": []}";
                }
            }
            else
            {
                response = "{\"result\": \"ok\", \"results\": []}";
            }
            Response.ContentType = "application/json";
            Response.Write(response);
            Response.End();
            return null;
        }
        //============================================================================================================================
        [HttpPost]
        public HttpResponse GetInterestsV3(string year, string grade, string gender, string counselor, string schoolrow)
        {
            JavaScriptSerializer jss = new JavaScriptSerializer();
            string response = "";
            string school;
            string email = AuthTokens[1];
            string showCounselor;
            if (AuthTokens[3] == "administrator")
            {
                AdminAccountClient aac = new AdminAccountClient();
                AdminAccount admin = aac.GetByPartitionAndRowKey("admin", email);
                school = admin.School;
                showCounselor = counselor;
            }
            else if (AuthTokens[3] == "su")
            {
                school = schoolrow;
                showCounselor = counselor;
            }
            else
            {
                CounselorAccountClient cac = new CounselorAccountClient();
                CounselorAccount counselorAccount = cac.GetByPartitionAndRowKey("counselor", email);
                school = counselorAccount.School;
                showCounselor = counselor;
            }
            AssessmentInterestClient aic = new AssessmentInterestClient();
            List<AssessmentInterest> interestsList = new List<AssessmentInterest>(aic.GetAllByPartition(school));
            if (interestsList.Count != 0)
            {
                var matchedInterests = from e in interestsList
                                       where (year == "" || e.Year == year) && (grade == "" || e.Grade == grade) && (gender == "" || e.Gender == (gender == "male" ? true : false)) && (counselor == "" || e.Counselor == showCounselor)
                                       select e;
                if (matchedInterests.Count() != 0)
                {
                    List<InterestV3> resultListV3 = new List<InterestV3>();
                    var groups = matchedInterests.Select(x => x.GroupName).Distinct().ToList();
                    foreach (var group in groups)
                    {
                        List<Interest> resultList = new List<Interest>();
                        foreach (string interest in interests)
                        {
                            var values = matchedInterests.Where(x => x.Interest == interest && x.GroupName == group).GroupBy(x => x.Value).ToList();
                            int like = 0;
                            int dislike = 0;
                            foreach (var value in values)
                            {
                                if (value.Key == "1")
                                {
                                    like = value.Count();
                                }
                                else
                                {
                                    dislike = value.Count();
                                }
                            }
                            resultList.Add(new Interest { name = interest, like = like, dislike = dislike });
                        }
                        resultListV3.Add(new InterestV3 { group = group, interests = resultList });
                    }
                    response = "{\"result\": \"ok\", \"results\": " + jss.Serialize(resultListV3) + "}";
                }
                else
                {
                    response = "{\"result\": \"ok\", \"results\": []}";
                }
            }
            else
            {
                response = "{\"result\": \"ok\", \"results\": []}";
            }
            Response.ContentType = "application/json";
            Response.Write(response);
            Response.End();
            return null;
        }
        //============================================================================================================================
        [HttpPost]
        public HttpResponse GetCareersV2(string year, string grade, string gender, string counselor, string schoolrow)
        {
            JavaScriptSerializer jss = new JavaScriptSerializer();
            string response = "";
            string school;
            string email = AuthTokens[1];
            string showCounselor;
            if (AuthTokens[3] == "administrator")
            {
                AdminAccountClient aac = new AdminAccountClient();
                AdminAccount admin = aac.GetByPartitionAndRowKey("admin", email);
                school = admin.School;
                showCounselor = counselor;
            }
            else if (AuthTokens[3] == "su")
            {
                school = schoolrow;
                showCounselor = counselor;
            }
            else
            {
                CounselorAccountClient cac = new CounselorAccountClient();
                CounselorAccount counselorAccount = cac.GetByPartitionAndRowKey("counselor", email);
                school = counselorAccount.School;
                showCounselor = AuthTokens[1];
            }
            AssessmentCareerClient acc = new AssessmentCareerClient();
            List<AssessmentCareer> careersList = new List<AssessmentCareer>(acc.GetAllByPartition(school));
            if (careersList.Count != 0)
            {
                var matchedCareers = from e in careersList
                                     where (year == "" || e.Year == year) && (grade == "" || e.Grade == grade) && (gender == "" || e.Gender == (gender == "male" ? true : false)) && (counselor == "" || e.Counselor == showCounselor)
                                     select e;
                if (matchedCareers.Count() != 0)
                {
                    var popular = matchedCareers.Where(x => x.Value == "1").GroupBy(x => x.DolCode).OrderByDescending(g => g.Count()).ToList();
                    List<Career> popularResult = new List<Career>();
                    foreach (var value in popular)
                    {
                        popularResult.Add(new Career { dolcode = value.Key, count = value.Count() });

                    }
                    var unpopular = matchedCareers.Where(x => x.Value == "0").GroupBy(x => x.DolCode).OrderByDescending(g => g.Count()).ToList();
                    List<Career> unpopularResult = new List<Career>();
                    foreach (var value in unpopular)
                    {
                        unpopularResult.Add(new Career { dolcode = value.Key, count = value.Count() });
                    }
                    response = "{\"result\": \"ok\", \"popular\":" + jss.Serialize(popularResult) + ", \"unpopular\":" + jss.Serialize(unpopularResult) + "}";
                }
                else
                {
                    response = "{\"result\": \"ok\", \"popular\":[], \"unpopular\":[]}";
                }
            }
            else
            {
                response = "{\"result\": \"ok\", \"popular\":[], \"unpopular\":[]}";
            }
            Response.ContentType = "application/json";
            Response.Write(response);
            Response.End();
            return null;
        }
        //============================================================================================================================
        [HttpPost]
        public HttpResponse GetCareersV3(string year, string grade, string gender, string counselor, string schoolrow)
        {
            JavaScriptSerializer jss = new JavaScriptSerializer();
            string response = "";
            string school;
            string email = AuthTokens[1];
            string showCounselor;
            if (AuthTokens[3] == "administrator")
            {
                AdminAccountClient aac = new AdminAccountClient();
                AdminAccount admin = aac.GetByPartitionAndRowKey("admin", email);
                school = admin.School;
                showCounselor = counselor;
            }
            else if (AuthTokens[3] == "su")
            {
                school = schoolrow;
                showCounselor = counselor;
            }
            else
            {
                CounselorAccountClient cac = new CounselorAccountClient();
                CounselorAccount counselorAccount = cac.GetByPartitionAndRowKey("counselor", email);
                school = counselorAccount.School;
                showCounselor = counselor;
            }
            AssessmentCareerClient acc = new AssessmentCareerClient();
            List<AssessmentCareer> careersList = new List<AssessmentCareer>(acc.GetAllByPartition(school));
            if (careersList.Count != 0)
            {
                var matchedCareers = from e in careersList
                                     where (year == "" || e.Year == year) && (grade == "" || e.Grade == grade) && (gender == "" || e.Gender == (gender == "male" ? true : false)) && (counselor == "" || e.Counselor == showCounselor)
                                     select e;
                if (matchedCareers.Count() != 0)
                {
                    List<CareerV3> popularListV3 = new List<CareerV3>();
                    List<CareerV3> unpopularListV3 = new List<CareerV3>();
                    var groups = matchedCareers.Select(x => x.GroupName).Distinct().ToList();
                    foreach (var group in groups)
                    {
                        var popular = matchedCareers.Where(x => x.Value == "1" && x.GroupName == group).GroupBy(x => x.DolCode).OrderByDescending(g => g.Count()).ToList();
                        List<Career> popularResult = new List<Career>();
                        foreach (var value in popular)
                        {
                            popularResult.Add(new Career { dolcode = value.Key, count = value.Count() });

                        }
                        var unpopular = matchedCareers.Where(x => x.Value == "0" && x.GroupName == group).GroupBy(x => x.DolCode).OrderByDescending(g => g.Count()).ToList();
                        List<Career> unpopularResult = new List<Career>();
                        foreach (var value in unpopular)
                        {
                            unpopularResult.Add(new Career { dolcode = value.Key, count = value.Count() });
                        }
                        popularListV3.Add(new CareerV3 { group = group, careers = popularResult });
                        unpopularListV3.Add(new CareerV3 { group = group, careers = unpopularResult });
                    }
                    response = "{\"result\": \"ok\", \"popular\":" + jss.Serialize(popularListV3) + ", \"unpopular\":" + jss.Serialize(unpopularListV3) + "}";
                }
                else
                {
                    response = "{\"result\": \"ok\", \"popular\":[], \"unpopular\":[]}";
                }
            }
            else
            {
                response = "{\"result\": \"ok\", \"popular\":[], \"unpopular\":[]}";
            }
            Response.ContentType = "application/json";
            Response.Write(response);
            Response.End();
            return null;
        }
        [HttpPost]
        public HttpResponse GetStudentsV2(string grade, string gender, string counselor, string schoolrow)
        {
            string response;
            JavaScriptSerializer jss = new JavaScriptSerializer();
            StudentAccountClient sac = new StudentAccountClient();
            UserAccountClient uac = new UserAccountClient();
            string school;
            string email = AuthTokens[1];
            string showCounselor;
            List<StudentAccount> studentList;
            if (AuthTokens[3] == "administrator")
            {
                AdminAccountClient aac = new AdminAccountClient();
                AdminAccount admin = aac.GetByPartitionAndRowKey("admin", email);
                school = admin.School;
                showCounselor = counselor;
                studentList = new List<StudentAccount>(sac.GetCurrentBySchool(school));
            }
            else if (AuthTokens[3] == "su")
            {
                school = schoolrow;
                showCounselor = counselor;
                studentList = new List<StudentAccount>(sac.GetCurrentBySchool(school));
            }
            else
            {
                CounselorAccountClient cac = new CounselorAccountClient();
                CounselorAccount counselorAccount = cac.GetByPartitionAndRowKey("counselor", email);
                school = counselorAccount.School;
                showCounselor = AuthTokens[1];
                studentList = new List<StudentAccount>(sac.GetCurrentBySchoolAndCounselor(school, AuthTokens[1]));
            }

            if (studentList.Count != 0)
            {
                var matchedStudents = from e in studentList
                                      where (grade == "" || e.Grade == grade) && (gender == "" || e.Gender == gender) && (counselor == "" || e.Counselor == showCounselor)
                                      select e;
                if (matchedStudents.Count() != 0)
                {
                    List<Student> resultList = new List<Student>();
                    foreach (var student in matchedStudents)
                    {
                        UserAccount account = uac.GetByPartitionAndRowKey(UserAccountClient.GetPartitionKeyForEmail(student.RowKey), student.RowKey);
                        resultList.Add(new Student { firstName = account.FirstName, lastName = account.LastName, Email = student.RowKey });
                    }
                    response = "{\"result\": \"ok\", \"results\": " + jss.Serialize(resultList) + "}";
                }
                else
                {
                    response = "{\"result\": \"ok\", \"results\": []}";
                }
            }
            else
            {
                response = "{\"result\": \"ok\", \"results\": []}";
            }
            Response.ContentType = "application/json";
            Response.Write(response);
            Response.End();
            return null;
        }
        //==============================================================================================================================================================
        [HttpPost]
        public HttpResponse GetStudentsV3(string year, string grade, string gender, string counselor, string schoolrow)
        {
            string response;
            JavaScriptSerializer jss = new JavaScriptSerializer();
            StudentAccountClient sac = new StudentAccountClient();
            UserAccountClient uac = new UserAccountClient();
            string school;
            string email = AuthTokens[1];
            string showCounselor;
            List<StudentAccount> studentList;
            if (AuthTokens[3] == "administrator")
            {
                AdminAccountClient aac = new AdminAccountClient();
                AdminAccount admin = aac.GetByPartitionAndRowKey("admin", email);
                school = admin.School;
                showCounselor = counselor;
                studentList = new List<StudentAccount>(sac.GetCurrentBySchool(school));
            }
            else if (AuthTokens[3] == "su")
            {
                school = schoolrow;
                showCounselor = counselor;
                studentList = new List<StudentAccount>(sac.GetCurrentBySchool(school));
            }
            else
            {
                CounselorAccountClient cac = new CounselorAccountClient();
                CounselorAccount counselorAccount = cac.GetByPartitionAndRowKey("counselor", email);
                school = counselorAccount.School;
                showCounselor = counselor;
                studentList = new List<StudentAccount>(sac.GetCurrentBySchool(school));
            }

            if (studentList.Count != 0)
            {
                var matchedStudents = from e in studentList
                                      where (year == "" || e.Year == year) && (grade == "" || e.Grade == grade) && (gender == "" || e.Gender == gender) && (counselor == "" || e.Counselor == showCounselor)
                                      //where (grade == "" || e.Grade == grade) && (gender == "" || e.Gender == gender) && (counselor == "" || e.Counselor == showCounselor)
                                      select e;
                if (matchedStudents.Count() != 0)
                {
                    List<StudentV3> resultListV3 = new List<StudentV3>();
                    var groups = matchedStudents.Select(x => x.GroupName).Distinct().ToList();
                    foreach (var group in groups)
                    {
                        List<Student> resultList = new List<Student>();
                        foreach (var student in matchedStudents)
                        {
                            if (student.GroupName == group)
                            {
                                UserAccount account = uac.GetByPartitionAndRowKey(UserAccountClient.GetPartitionKeyForEmail(student.RowKey), student.RowKey);
                                resultList.Add(new Student { firstName = account.FirstName, lastName = account.LastName, Email = student.RowKey, careers = student.RatedCareers, dimensions = student.RatedDimensions, interests = student.RatedInterests, dislikecareers = student.DislikeCareers });
                            }
                        }
                        resultListV3.Add(new StudentV3 { group = group, students = resultList });
                    }
                    response = "{\"result\": \"ok\", \"results\": " + jss.Serialize(resultListV3) + "}";
                }
                else
                {
                    response = "{\"result\": \"ok\", \"results\": []}";
                }
            }
            else
            {
                response = "{\"result\": \"ok\", \"results\": []}";
            }
            Response.ContentType = "application/json";
            Response.Write(response);
            Response.End();
            return null;
        }
        //==============================================================================================================================================================
        // ajax
        //[HttpPost]
        //public HttpResponse GetGroupsForSchool(string school, string teacher)
        //{
        //    AssessmentGroupClient agc = new AssessmentGroupClient();
        //    List<AssessmentGroup> groupsList = new List<AssessmentGroup>(agc.GetAllBySchoolAndTeacher(school, teacher));
        //    JavaScriptSerializer jss = new JavaScriptSerializer();
        //    groupsList.Sort(delegate(AssessmentGroup a, AssessmentGroup b)
        //    {
        //        return a.Group.CompareTo(b.Group);
        //    });
        //    string response = groupsList.Count != 0 ? "{\"result\": \"ok\", \"results\":" + jss.Serialize(groupsList) + "}" : "{\"result\": \"ok\", \"results\":[]}";
        //    Response.ContentType = "application/json";
        //    Response.Write(response);
        //    Response.End();
        //    return null;
        //}
        
        //[HttpPost]
        //public HttpResponse GetDimensions(string school, string teacher, string group)
        //{
        //    JavaScriptSerializer jss = new JavaScriptSerializer();        
        //    AssessmentDimensionsRatingClient adrc = new AssessmentDimensionsRatingClient();
        //    List<AssessmentDimensionsRating> dimensionList;
        //    string response;
        //    if (group != "" && group != null)
        //    {
        //        dimensionList = new List<AssessmentDimensionsRating>(adrc.GetAllBySchoolAndGroup(school, teacher, group));
        //    }
        //    else
        //    {
        //        dimensionList = new List<AssessmentDimensionsRating>(adrc.GetAllBySchoolAndTeacher(school, teacher));
        //    }
        //    if (dimensionList.Count != 0)
        //    {
        //        List<Dimension> resultList = new List<Dimension>();
        //        foreach (string dimension in dimensions)
        //        {
        //            var values = dimensionList.Where(x => x.Dimension == dimension).GroupBy(x => x.Value).ToList();
        //            foreach (var value in values)
        //            {
        //                resultList.Add(new Dimension { name = value.Key, count = value.Count() });
        //            }
        //        }
        //        response = "{\"result\": \"ok\", \"results\": " + jss.Serialize(resultList) + "}";
        //    }
        //    else
        //    {
        //        response = "{\"result\": \"ok\", \"results\": []}";
        //    }
        //    Response.ContentType = "application/json";
        //    Response.Write(response);
        //    Response.End();
        //    return null;
        //}

        //[HttpPost]
        //public HttpResponse GetStudents(string school, string teacher, string group)
        //{
        //    string response;
        //    JavaScriptSerializer jss = new JavaScriptSerializer();
        //    StudentProfileClient spc = new StudentProfileClient();
        //    UserAccountClient uac = new UserAccountClient();

        //    List<StudentProfile> studentList;
        //    if (group != "" && group != null)
        //    {
        //        studentList = new List<StudentProfile>(spc.GetAllBySchoolAndGroup(school, teacher, group));
        //    }
        //    else
        //    {
        //        studentList = new List<StudentProfile>(spc.GetAllBySchoolAndTeacher(school, teacher));
        //    }
        //    if (studentList.Count != 0)
        //    {
        //        List<Student> resultList = new List<Student>();
        //        foreach (StudentProfile student in studentList)
        //        {
        //            UserAccount account = uac.GetByPartitionAndRowKey(UserAccountClient.GetPartitionKeyForEmail(student.RowKey), student.RowKey);
        //            resultList.Add(new Student { firstName = account.FirstName, lastName = account.LastName, Email = student.RowKey });

        //            //AssessmentDimensionsRatingClient adrc = new AssessmentDimensionsRatingClient();
        //            //List<AssessmentDimensionsRating> dimensions = new List<AssessmentDimensionsRating>(adrc.GetAllBySchoolAndStudent(school, student.RowKey));
        //            //AssessmentInterestRatingClient airc = new AssessmentInterestRatingClient();
        //            //List<AssessmentInterestRating> interests = new List<AssessmentInterestRating>(airc.GetAllBySchoolAndStudent(school, student.RowKey));
        //            //AssessmentCareerRatingClient acrc = new AssessmentCareerRatingClient();
        //            //List<AssessmentCareerRating> careers = new List<AssessmentCareerRating>(acrc.GetAllBySchoolAndStudent(school, student.RowKey));
        //            //resultList.Add(new Student { firstName = account.FirstName, lastName = account.LastName, Email = student.RowKey, dimensions = dimensions.Count, interests = interests.Count, careers = careers.Count });
        //        }
        //        response = "{\"result\": \"ok\", \"results\": " + jss.Serialize(resultList) + "}";
        //    }
        //    else
        //    {
        //        response = "{\"result\": \"ok\", \"results\": []}";
        //    }
        //    Response.ContentType = "application/json";
        //    Response.Write(response);
        //    Response.End();
        //    return null;
        //}

        //[HttpPost]
        //public HttpResponse GetInterests(string school, string teacher, string group)
        //{
        //    JavaScriptSerializer jss = new JavaScriptSerializer();
        //    AssessmentInterestRatingClient airc = new AssessmentInterestRatingClient();
        //    List<AssessmentInterestRating> interestList;
        //    string response;
        //    if (group != "" && group != null)
        //    {
        //        interestList = new List<AssessmentInterestRating>(airc.GetAllBySchoolAndGroup(school, teacher, group));
        //    }
        //    else
        //    {
        //        interestList = new List<AssessmentInterestRating>(airc.GetAllBySchoolAndTeacher(school, teacher));
        //    }
        //    List<Interest> resultList = new List<Interest>();
        //    if (interestList.Count != 0)
        //    {
        //        foreach (string interest in interests)
        //        {
        //            var values = interestList.Where(x => x.Interest == interest).GroupBy(x => x.Rating).ToList();
        //            int like = 0;
        //            int dislike = 0;
        //            foreach (var value in values)
        //            {
        //                if (value.Key == "1")
        //                {
        //                    like = value.Count();
        //                }
        //                else
        //                {
        //                    dislike = value.Count();
        //                }
        //            }
        //            resultList.Add(new Interest { name = interest, like = like, dislike = dislike });
        //        }
        //        resultList.Sort(delegate(Interest a, Interest b) { return b.like.CompareTo(a.like); });
        //        response = "{\"result\": \"ok\", \"results\":" + jss.Serialize(resultList) + "}";
        //    }
        //    else
        //    {
        //        response = "{\"result\": \"ok\", \"results\":[]}";
        //    }
        //    Response.ContentType = "application/json";
        //    Response.Write(response);
        //    Response.End();
        //    return null;
        //}

        //[HttpPost]
        //public HttpResponse GetCareers(string school, string teacher, string group)
        //{
        //    JavaScriptSerializer jss = new JavaScriptSerializer();
        //    AssessmentCareerRatingClient acrc = new AssessmentCareerRatingClient();
        //    List<AssessmentCareerRating> careerList;
        //    string response;
        //    if (group != "" && group != null)
        //    {
        //        careerList = new List<AssessmentCareerRating>(acrc.GetAllBySchoolAndGroup(school, teacher, group));
        //    }
        //    else
        //    {
        //        careerList = new List<AssessmentCareerRating>(acrc.GetAllBySchoolAndTeacher(school, teacher));
        //    }
        //    if (careerList.Count != 0)
        //    {
        //        var popular = careerList.Where(x => x.Rating == "1").GroupBy(x => x.DolCode).OrderByDescending(g => g.Count()).ToList();
        //        List<Career> popularResult = new List<Career>();
        //        foreach (var value in popular)
        //        {
        //            popularResult.Add(new Career { dolcode = value.Key, count = value.Count() });

        //        }
        //        var unpopular = careerList.Where(x => x.Rating == "0").GroupBy(x => x.DolCode).OrderByDescending(g => g.Count()).ToList();
        //        List<Career> unpopularResult = new List<Career>();
        //        foreach (var value in unpopular)
        //        {
        //            unpopularResult.Add(new Career { dolcode = value.Key, count = value.Count() });
        //        }
        //        response = "{\"result\": \"ok\", \"popular\":" + jss.Serialize(popularResult) + ", \"unpopular\":" + jss.Serialize(unpopularResult) + "}";
        //    }
        //    else
        //    {
        //        response = "{\"result\": \"ok\", \"popular\":[], \"unpopular\":[]}";
        //    }
        //    Response.ContentType = "application/json";
        //    Response.Write(response);
        //    Response.End();
        //    return null;
        //}
        [HttpGet]
        public ActionResult Report()
        {
            if (AuthTokens[0] == "demo")
            {
                ViewBag.DemoNextStep = NextStep("r");
                string studentemail = "sherlock.holmes@careerthesaurus.com";
                StudentAccountClient spc = new StudentAccountClient();
                StudentAccount student = spc.GetByPartitionAndRowKey(StudentAccountClient.GetPartitionKeyForEmail(studentemail), studentemail);
                if (student != null)
                {
                    UserAccountClient uac = new UserAccountClient();
                    UserAccount account = uac.GetByPartitionAndRowKey(UserAccountClient.GetPartitionKeyForEmail(studentemail), studentemail);
                    ViewBag.StudentFirstName = account.FirstName;
                    ViewBag.StudentLastName = account.LastName;
                    ViewBag.StudentToShow = studentemail;
                    return View();
                }
            }
            return RedirectToAction("Index", "Analytics");
        }
        [HttpPost]
        public ActionResult Report(string studentemail)
        {
            if (AuthTokens[0] == "demo")
            {
                ViewBag.DemoNextStep = NextStep("r");
            }
            StudentAccountClient sac = new StudentAccountClient();
            StudentAccount student = sac.GetByPartitionAndRowKey(StudentAccountClient.GetPartitionKeyForEmail(studentemail), studentemail);
            //StudentProfileClient spc = new StudentProfileClient();
            //StudentProfile student = spc.GetByPartitionAndRowKey(StudentProfileClient.GetPartitionKeyForEmail(studentemail), studentemail);
            if (student != null)
            {
                UserAccountClient uac = new UserAccountClient();
                UserAccount account = uac.GetByPartitionAndRowKey(UserAccountClient.GetPartitionKeyForEmail(studentemail), studentemail);
                // ViewBag.StudentName = account.FirstName + " " + account.LastName;
                ViewBag.StudentFirstName = account.FirstName;
                ViewBag.StudentLastName = account.LastName;
                ViewBag.StudentToShow = studentemail;
                return View();
            }
            else
            {
                return RedirectToAction("Analytics", "Index");
            }
        }
        private string NextStep(string action)
        {
            string[] demosteps = { "a", "g", "m", "i", "t", "c", "s", "r" };
            string demoStepsCookie = Request.Cookies["demosteps"].Value;
            if (!demoStepsCookie.Contains(action) && demosteps.Contains(action))
            {
                demoStepsCookie += action;
                Response.Cookies["demosteps"].Value = demoStepsCookie;
            }
            foreach (string step in demosteps)
            {
                if (!demoStepsCookie.Contains(step))
                {
                    return NextStepURL(step);
                }
            }
            return NextStepURL(" ");
        }
        private string NextStepURL(string step)
        {
            switch (step)
            {
                case "a":
                    return "/AdminPortal";
                case "g":
                    return "/AdminPortal/Groups";
                case "m":
                    return "/Analytics";
                case "i":
                    return "/Analytics/Interests";
                case "t":
                    return "/Analytics/Traits";
                case "c":
                    return "/Analytics/Careers";
                case "s":
                    return "/Analytics/StudentList/Trait/Extrovert";
                case "r":
                    return "/Analytics/Report";
                default:
                    return "/SignUp/Administrator";
            }
        }
    }
}
