using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using SkillCowResponsive.Classes.Helpers;
using SkillCowResponsive.Classes.Cloud.TableStorage.UserAccount;

using SkillCowResponsive.Classes.Cloud.TableStorage.AccessCode;
using SkillCowResponsive.Classes.Cloud.TableStorage.StudentAccount;
using SkillCowResponsive.Classes.Cloud.TableStorage.AssessmentInterest;
using SkillCowResponsive.Classes.Cloud.TableStorage.AssessmentCareer;
using SkillCowResponsive.Classes.Cloud.TableStorage.AssessmentDimension;

//using SkillCowResponsive.Classes.Cloud.TableStorage.StudentProfile;
//using SkillCowResponsive.Classes.Cloud.TableStorage.AssessmentCareerRating;
//using SkillCowResponsive.Classes.Cloud.TableStorage.AssessmentDimensionsRating;
//using SkillCowResponsive.Classes.Cloud.TableStorage.AssessmentInterestRating;

namespace SkillCowResponsive.Controllers
{
    public class StudentPortalController : AuthenticatedControllerController
    {
        //
        // GET: /StudentPortal/ 
        List<ImportantThings> importantThings = new List<ImportantThings>() {
            new  ImportantThings { name = "beauty", caption = "Beauty & Visual Perfection" },
            new  ImportantThings { name = "helping", caption = "Helping Others" },
            new  ImportantThings { name = "adventure", caption = "Risk & Adventure" },
            new  ImportantThings { name = "safety", caption = "Safety of Others" },
            new  ImportantThings { name = "people", caption = "Working with People" },
            new  ImportantThings { name = "science", caption = "Scientific Methods & Precision" },
            new  ImportantThings { name = "duty", caption = "Sense of Duty" },
            new  ImportantThings { name = "admiration", caption = "Being in a Spot Light" },
            new  ImportantThings { name = "creativity", caption = "Creativity" },
            new  ImportantThings { name = "competition", caption = "Competitiveness" },
            new  ImportantThings { name = "animals", caption = "Nature & Animals" },
            new  ImportantThings { name = "politics", caption = "Politics & Strategy" },
            new  ImportantThings { name = "technology", caption = "Technology & Gadgets" },
            new  ImportantThings { name = "machinery", caption = "Machinery" },
            new  ImportantThings { name = "handlabor", caption = "Hand Labor" },
            new  ImportantThings { name = "strength", caption = "Using Body Strength" },
            new  ImportantThings { name = "drafting", caption = "Drafting & Sketching" },
            new  ImportantThings { name = "coordinating", caption = "Coordinating Groups" },
            new  ImportantThings { name = "numbers", caption = "Working with Numbers" },
            new  ImportantThings { name = "critical", caption = "Giving Critical Advice" },
            new  ImportantThings { name = "salesy", caption = "Salesiness" }
        };
        [HttpGet]
        public ActionResult Index()
        {
            string user = AuthTokens[1];

            StudentAccountClient sac = new StudentAccountClient();
            StudentAccount student = sac.GetByPartitionAndRowKey(StudentAccountClient.GetPartitionKeyForEmail(user), user);
            AssessmentInterestClient aic = new AssessmentInterestClient();
            List<AssessmentInterest> importantThingRatings = new List<AssessmentInterest>(aic.GetAllCurrentByStudent(student.School, user, student.Year, student.Grade));
            AssessmentCareerClient acc = new AssessmentCareerClient();
            List<AssessmentCareer> careerRatings = new List<AssessmentCareer>(acc.GetAllCurrentByStudent(student.School, user, student.Year, student.Grade));

            //StudentProfileClient spc = new StudentProfileClient();
            //StudentProfile student = spc.GetByPartitionAndRowKey(StudentProfileClient.GetPartitionKeyForEmail(user), user);
            //AssessmentInterestRatingClient airc = new AssessmentInterestRatingClient();
            //List<AssessmentInterestRating> importantThingRatings = new List<AssessmentInterestRating>(airc.GetAllBySchoolAndStudent(student.School, user));
            //AssessmentCareerRatingClient acrc = new AssessmentCareerRatingClient();
            //List<AssessmentCareerRating> careerRatings = new List<AssessmentCareerRating>(acrc.GetAllBySchoolAndStudent(student.School, user));
            ViewBag.CareersRated = careerRatings.Count == 0 ? "no" : "yes";
            ViewBag.School = student.School;
            JavaScriptSerializer jss = new JavaScriptSerializer();
            ViewBag.interestsRated = jss.Serialize(importantThingRatings.Where(x => x.Value == "1").Select(x => x.Interest).ToList());
            if (importantThingRatings.Where(x => x.Value == "1").ToList().Count == 3)
            {
                ViewBag.ImportantThings = "yes";
            }
            else
            {
                ViewBag.ImportantThings = "no";
            }
            if (TempData["message"] != null)
            {
                ViewBag.Message = TempData["message"];
            }
            if (TempData["successmessage"] != null)
            {
                ViewBag.Successmessage = TempData["successmessage"];
            }
            ViewBag.UpdateAccessCode = student.Year != AccessCodeClient.CurrentGradYear();
            return View();
        }
        [HttpPost]
        public ActionResult Index(string grade, string accesscode, string zipcode)
        {
            string user = AuthTokens[1];
             
            StudentAccountClient sac = new StudentAccountClient();
            StudentAccount student = sac.GetByPartitionAndRowKey(StudentAccountClient.GetPartitionKeyForEmail(user), user);
            AccessCodeClient acc = new AccessCodeClient();
            AccessCode accessCode = acc.GetByPinCodeAndGradeCurrent(accesscode, grade);

            if (accessCode != null)
            {
                if (student.Active)
                {
                    if (student.School != accessCode.School)
                    {
                        TempData["message"] = "You still have an active status in another school";
                    }
                    else if (student.Year == accessCode.Year)
                    {
                        TempData["message"] = "You already updated your information with new access code this year";
                    }
                    else
                    {
                        student.Year = accessCode.Year;
                        student.Grade = accessCode.Grade;
                        student.Counselor = accessCode.Counselor;
                        student.GroupName = accessCode.GroupName;
                        student.AssessmentComplete = false;
                        student.RatedCareers = 0;
                        student.RatedDimensions = 0;
                        student.RatedInterests = 0;
                        sac.Update(student);
                        TempData["successmessage"] = "Your information was updated for this year";
                    }
                }
                else
                {
                    if (student.School != accessCode.School)
                    {
                        student.School = accessCode.School;
                        student.Year = accessCode.Year;
                        student.Grade = accessCode.Grade;
                        student.Counselor = accessCode.Counselor;
                        student.GroupName = accessCode.GroupName;
                        student.AssessmentComplete = false;
                        student.RatedCareers = 0;
                        student.RatedDimensions = 0;
                        student.RatedInterests = 0;
                        sac.Update(student);
                        TempData["successmessage"] = "Your information and school was updated for this year";
                    }
                    else
                    {
                        TempData["message"] = "Your account was marked as inactive";
                    }
                }
            }
            else
            {
                TempData["message"] = "Access link you used is invalid or expired";
            }
            return RedirectToAction("Index");
        }
        [HttpGet]
        public ActionResult RateInterests()
        {
            string user = AuthTokens[1];
            StudentAccountClient sac = new StudentAccountClient();
            StudentAccount student = sac.GetByPartitionAndRowKey(StudentAccountClient.GetPartitionKeyForEmail(user), user);

            //StudentProfileClient spc = new StudentProfileClient();
            //StudentProfile student = spc.GetByPartitionAndRowKey(StudentProfileClient.GetPartitionKeyForEmail(user), user);
            ViewBag.School = student.School;
            ViewBag.Year = student.Year;
            ViewBag.Grade = student.Grade;
            ViewBag.importantThings = importantThings;
            return View();
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
                    if (rating == "1")
                    {
                        student.RatedInterests++;
                        sac.Update(student);
                    }
                    aic.AddNewItem(new AssessmentInterest { PartitionKey = student.School, RowKey = user + student.Year + student.Grade + interest, Value = rating, Counselor = student.Counselor, Student = user, Grade = student.Grade, GroupName = student.GroupName, Interest = interest, Year = student.Year });
                    //airc.AddNewItem(new AssessmentInterestRating { PartitionKey = student.School, RowKey = user + interest, Rating = rating, GradYear = student.GradYear, Student = user, Teacher = student.Teacher, Group = student.Group });
                }
                else
                {
                    interestRating.Value = rating;
                    aic.Update(interestRating);
                    if (rating == "1")
                    {
                        student.RatedInterests++;
                    }
                    else
                    {
                        student.RatedInterests--;
                    }
                    sac.Update(student);
                }
            }

            //StudentProfileClient spc = new StudentProfileClient();
            //StudentProfile student = spc.GetByPartitionAndRowKey(StudentProfileClient.GetPartitionKeyForEmail(user), user);
            //AssessmentInterestRatingClient airc = new AssessmentInterestRatingClient();
            //AssessmentInterestRating interestRating = airc.GetByPartitionAndRowKey(student.School, user + interest);
        }
        public ActionResult Report(string id)
        {
            if (id != null && id != "")
            {
                StudentAccountClient sac = new StudentAccountClient();
                StudentAccount student = sac.GetByPartitionAndRowKey(StudentAccountClient.GetPartitionKeyForEmail(id), id);

                //StudentProfileClient spc = new StudentProfileClient();
                //StudentProfile student = spc.GetByPartitionAndRowKey(StudentProfileClient.GetPartitionKeyForEmail(id), id);
                if (student != null && AuthTokens[3] == "administrator" && student.Counselor == AuthTokens[1])
                {
                    UserAccountClient uac = new UserAccountClient();
                    UserAccount account = uac.GetByPartitionAndRowKey(UserAccountClient.GetPartitionKeyForEmail(id), id);
                    // ViewBag.StudentName = account.FirstName + " " + account.LastName;
                    ViewBag.StudentFirstName = account.FirstName;
                    ViewBag.StudentLastName = account.LastName;
                    ViewBag.StudentToShow = id;
                }
            }
            else if (AuthTokens[3] == "administrator")
            {
                return RedirectToAction("Assessment", "Index");
            }
            return View();
        }
    }
}
