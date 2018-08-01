using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using System.Text.RegularExpressions;
using SkillCowResponsive.Classes.Helpers;
using SkillCowResponsive.Classes.Encryption;
using SkillCowResponsive.Classes.Cloud.TableStorage.UserAccount;
using SkillCowResponsive.Classes.Cloud.TableStorage.PendingSchool;
using SkillCowResponsive.Classes.Cloud.TableStorage.School;
using SkillCowResponsive.Classes.Cloud.TableStorage.CounselorAccount;
using SkillCowResponsive.Classes.Cloud.TableStorage.CounselorInvite;
using SkillCowResponsive.Classes.Cloud.TableStorage.StudentAccount;

using SkillCowResponsive.Classes.Cloud.TableStorage.AdminAccount;
using SkillCowResponsive.Classes.Cloud.TableStorage.AccessCode;
using SkillCowResponsive.Classes;
using SkillCowResponsive.Classes.Email;


//using SkillCowResponsive.Classes.Cloud.TableStorage.AdminProfile;
//using SkillCowResponsive.Classes.Cloud.TableStorage.StudentProfile;
//using SkillCowResponsive.Classes.Cloud.TableStorage.TeacherToSchoolConnection;
//using SkillCowResponsive.Classes.Cloud.TableStorage.SchoolToTeacherConnection;
//using SkillCowResponsive.Classes.Cloud.TableStorage.AssessmentGroup;
//using SkillCowResponsive.Classes.Cloud.TableStorage.AssessmentGroupPinCode;

namespace SkillCowResponsive.Controllers
{
    public class AdminPortalController : AuthenticatedControllerController
    {
        //
        // GET: /AdminPortal/

        [HttpGet]
        public ActionResult Index()
        {
            if (AuthTokens[0] == "demo")
            {
                ViewBag.DemoNextStep = NextStep("a");
            }
            return View();
        }
        [HttpPost]
        public ActionResult Index(IEnumerable<string> firstname, IEnumerable<string> lastname, IEnumerable<string> email)
        {
            if (AuthTokens[0] == "demo")
            {
                ViewBag.DemoNextStep = NextStep("!");
                return View();
            }
            if (firstname != null && lastname != null && email != null)
            {
                if (firstname.Count() == lastname.Count() && firstname.Count() == email.Count())
                {
                    CounselorInviteClient cic = new CounselorInviteClient();
                    AdminAccountClient aac = new AdminAccountClient();
                    UserAccountClient uac = new UserAccountClient();
                    AdminAccount admin = aac.GetByPartitionAndRowKey("admin", AuthTokens[1].ToLower());
                    UserAccount user = uac.GetByPartitionAndRowKey(UserAccountClient.GetPartitionKeyForEmail(AuthTokens[1].ToLower()), AuthTokens[1].ToLower());
                    string school = admin.School;
                    for (var i = 0; i < firstname.Count(); i++)
                    {
                        string emailLower = email.ElementAt(i).ToLower();
                        string guid = ShortGuidGenerator.NewGuid();
                        cic.AddNewItem(new CounselorInvite { FirstName = firstname.ElementAt(i), LastName = lastname.ElementAt(i), Email = emailLower, School = school, RowKey = guid });
                        SendInviteEmail(email.ElementAt(i).ToLower(), firstname.ElementAt(i) + " " + lastname.ElementAt(i), user.FirstName + " " + user.LastName, guid);
                    }
                    return View();
                }
            }
            ViewBag.ErrorMessage = "error";
            return View();
        }

        [HttpPost]
        public ActionResult ChangeRole(string counselor)
        {
            if (AuthTokens[0] == "demo")
            {
                return RedirectToAction("Index", "AdminPortal"); ;
            }
            string currentAdminEmail = AuthTokens[1];
            
            AdminAccountClient aac = new AdminAccountClient();
            CounselorAccountClient cac = new CounselorAccountClient();
            UserAccountClient uac = new UserAccountClient();
            SchoolAccountClient sac = new SchoolAccountClient();
            
            AdminAccount admin = aac.GetByPartitionAndRowKey("admin", currentAdminEmail);
            CounselorAccount counselorAccount = cac.GetByPartitionAndRowKey("counselor", counselor);
            UserAccount currentAdmin = uac.GetByPartitionAndRowKey(UserAccountClient.GetPartitionKeyForEmail(currentAdminEmail), currentAdminEmail);
            UserAccount newAdmin = uac.GetByPartitionAndRowKey(UserAccountClient.GetPartitionKeyForEmail(counselor), counselor);
            SchoolAccount school = sac.GetByPartitionAndRowKey("school", admin.School);

            if (admin != null && counselorAccount != null && currentAdmin != null && newAdmin != null && school != null)
            {
                aac.AddNewItem(new AdminAccount { RowKey = counselor, PhoneNumber = counselorAccount.PhoneNumber, PhoneExtension = counselorAccount.PhoneExtension, School = school.RowKey, SchoolSelected = true, ConnectionToSchoolConfirmed = true });
                cac.AddNewItem(new CounselorAccount { RowKey = currentAdminEmail, PhoneNumber = admin.PhoneNumber, PhoneExtension = admin.PhoneExtension, School = school.RowKey });
                currentAdmin.ProfileType = "counselor";
                uac.Update(currentAdmin);
                newAdmin.ProfileType = "administrator";
                uac.Update(newAdmin);
                school.Admin = counselor;
                sac.Update(school);
                aac.Delete(admin);
                cac.Delete(counselorAccount);
            }
            return RedirectToAction("LogOut", "Account");
        }

        [HttpGet]
        public ActionResult Groups()
        {
            if (AuthTokens[0] == "demo")
            {
                ViewBag.DemoNextStep = NextStep("g");
            }
            ViewBag.CurrentYear = AccessCodeClient.CurrentGradYear();
            return View();
        }
        [HttpPost]
        public ActionResult Groups(IEnumerable<string> year, IEnumerable<string> grade, IEnumerable<string> counselor, IEnumerable<string> groupname)
        {
            if (AuthTokens[0] == "demo")
            {
                ViewBag.DemoNextStep = NextStep("!");
                return View();
            }
            if (year != null && grade != null && counselor != null && groupname != null)
            {
                if (year.Count() == grade.Count() && year.Count() == counselor.Count() && year.Count() == groupname.Count())
                {
                    AdminAccountClient aac = new AdminAccountClient();
                    AccessCodeClient acc = new AccessCodeClient();
                    AdminAccount admin = aac.GetByPartitionAndRowKey("admin", AuthTokens[1].ToLower());
                    string school = admin.School;
                    for (var i = 0; i < year.Count(); i++)
                    {
                        acc.AddNewItem(new AccessCode { RowKey = ShortGuidGenerator.NewGuid(), Code = PinCodeGenerator.NewPin(), Year = year.ElementAt(i), Grade = grade.ElementAt(i), Counselor = counselor.ElementAt(i), GroupName = groupname.ElementAt(i), School = school });
                    }
                    ViewBag.CurrentYear = AccessCodeClient.CurrentGradYear();
                    return View();
                }
            }
            ViewBag.ErrorMessage = "error";
            ViewBag.CurrentYear = AccessCodeClient.CurrentGradYear();
            return View();
        }
        public ActionResult Students()
        {
            if (AuthTokens[0] == "demo")
            {
                ViewBag.DemoNextStep = NextStep("!");
            }
            return View();
        }
        public ActionResult LessonPlan()
        {
            return View();
        }
        public ActionResult SchoolSubmitted()
        {
            if (AuthTokens[0] == "demo")
            {
                ViewBag.DemoNextStep = NextStep("!");
            }
            return View();
        }

        public ActionResult AddSchool()
        {
            if (AuthTokens[0] == "demo")
            {
                ViewBag.DemoNextStep = NextStep("!");
            }
            AdminAccountClient aac = new AdminAccountClient();
            AdminAccount admin = aac.GetByPartitionAndRowKey("admin", AuthTokens[1]);
            if (admin.SchoolSelected)
            {
                return RedirectToAction("Index");
            }
            return View();
        }
        [HttpGet]
        public ActionResult SubmitSchool()
        {
            if (AuthTokens[0] == "demo")
            {
                ViewBag.DemoNextStep = NextStep("!");
            }
            AdminAccountClient aac = new AdminAccountClient();
            AdminAccount adminAccount = aac.GetByPartitionAndRowKey("admin", AuthTokens[1]);
            if (adminAccount.SchoolSelected)
            {
                return RedirectToAction("Index");
            }
            return View();
        }
        [HttpPost]
        public ActionResult SubmitSchool(FormCollection collection)
        {
            if (AuthTokens[0] == "demo")
            {
                ViewBag.DemoNextStep = NextStep("!");
                return View();
            }
            string admin = AuthTokens[1];
            AdminAccountClient aac = new AdminAccountClient();
            AdminAccount adminAccount = aac.GetByPartitionAndRowKey("admin", admin);
            UserAccountClient uac = new UserAccountClient();
            UserAccount user = uac.GetByPartitionAndRowKey(UserAccountClient.GetPartitionKeyForEmail(admin), admin);
            string rowkey = Regex.Replace(collection["schoolphone"], @"[^0-9]", "");
            string phone = rowkey.Substring(0, 3) + "-" + rowkey.Substring(3, 3) + "-" + rowkey.Substring(6);
            PendingSchoolClient psc = new PendingSchoolClient();
            psc.AddNewItem(new PendingSchool { Admin = admin, SchoolName = collection["schoolname"], Address = collection["schooladdress1"], City = collection["schoolcity"], State = collection["schoolstate"], ZipCode = collection["schoolzip"], OfficialID = collection["schoolid"], PhoneNumber = phone, RowKey = rowkey });
            adminAccount.SchoolSelected = true;
            adminAccount.School = rowkey;
            adminAccount.RequestStatus = "";
            aac.Update(adminAccount);

            EmailManager emailManager = new EmailManager();
            string body = "<div>Admin name: " + user.FirstName + " " + user.LastName + "</div><div>Admin phone number and extension:" + adminAccount.PhoneNumber + " x " + adminAccount.PhoneExtension + "</div><div>Admin Email: " + adminAccount.RowKey + "</div>" +
                "<div>School name: " + collection["schoolname"] + "</div><div>School address" + collection["schooladdress1"] + " " + collection["schoolcity"] + " " + collection["schoolstate"] + " " + collection["schoolzip"] + "</div>" +
                "<div>School phone number: " + phone + "</div>";
            emailManager.SendMail("no-reply@careerthesaurus.com", "Admin", "mike@peopli.com", "School request", body);

            return RedirectToAction("SchoolSubmitted");
        }
        [HttpGet]
        public ActionResult School()
        {
            return RedirectToAction("Index", "AdminPortal");
        }
        [HttpPost]
        public ActionResult School(string school)
        {
            if (AuthTokens[0] == "demo")
            {
                ViewBag.DemoNextStep = NextStep("!");
            }
            ViewBag.School = school;
            return View();
        }

        // ajax calls ===========================================================================================================================================
        [HttpPost]
        public HttpResponse CounselorStatus(string user)
        {
            string response;
            if (AuthTokens[0] != "demo")
            {
                CounselorAccountClient cac = new CounselorAccountClient();
                CounselorAccount account = cac.GetByPartitionAndRowKey("counselor", user);
                if (account != null)
                {
                    account.Active = !account.Active;
                    cac.Update(account);
                    response = "{\"result\": \"done\"}";
                }
                else
                {
                    response = "{\"result\": \"error\"}";
                }
            }
            else
            {
                response = "{\"result\": \"done\"}";
            }
            Response.ContentType = "application/json";
            Response.Write(response);
            Response.End();
            return null;
        }
        [HttpPost]
        public HttpResponse StudentStatus(string user)
        {
            string response;
            if (AuthTokens[0] != "demo")
            {   
                StudentAccountClient sac = new StudentAccountClient();
                StudentAccount account = sac.GetByPartitionAndRowKey(StudentAccountClient.GetPartitionKeyForEmail(user), user);
                if (account != null)
                {
                    account.Active = !account.Active;
                    sac.Update(account);
                    response = "{\"result\": \"done\"}";
                }
                else
                {
                    response = "{\"result\": \"error\"}";
                }
            }
            else
            {
                response = "{\"result\": \"done\"}";
            }
            Response.ContentType = "application/json";
            Response.Write(response);
            Response.End();
            return null;
        }
        [HttpPost]
        public HttpResponse ResendEmail(string invite)
        {
            string response;
            if (AuthTokens[0] != "demo")
            {
                CounselorInviteClient cic = new CounselorInviteClient();
                CounselorInvite inviteEntry = cic.GetByPartitionAndRowKey("invite", invite);
                if (inviteEntry != null) {
                    UserAccountClient uac = new UserAccountClient();
                    UserAccount user = uac.GetByPartitionAndRowKey(UserAccountClient.GetPartitionKeyForEmail(AuthTokens[1].ToLower()), AuthTokens[1].ToLower());
                    SendInviteEmail(inviteEntry.Email, inviteEntry.FirstName + " " + inviteEntry.LastName, user.FirstName + " " + user.LastName, inviteEntry.RowKey);
                    response = "{\"result\": \"done\"}";
                }
                else
                {
                    response = "{\"result\": \"error\"}";
                }
            }
            else
            {
                response = "{\"result\": \"done\"}";
            }
            Response.ContentType = "application/json";
            Response.Write(response);
            Response.End();
            return null;
        }
        [HttpPost]
        public HttpResponse DeleteInvite(string invite)
        {
            string response;
            if (AuthTokens[0] != "demo")
            {
                CounselorInviteClient cic = new CounselorInviteClient();
                CounselorInvite inviteEntry = cic.GetByPartitionAndRowKey("invite", invite);
                if (inviteEntry != null)
                {
                    cic.Delete(inviteEntry);
                    response = "{\"result\": \"done\"}";
                }
                else
                {
                    response = "{\"result\": \"error\"}";
                }
            }
            else
            {
                response = "{\"result\": \"done\"}";
            }
            Response.ContentType = "application/json";
            Response.Write(response);
            Response.End();
            return null;
        }
        [HttpPost]
        public HttpResponse GetSchoolsByZip(string zipcode)
        {
            SchoolAccountClient sac = new SchoolAccountClient();
            List<SchoolAccount> schoolList = new List<SchoolAccount>(sac.GetByZipCode(zipcode));
            JavaScriptSerializer jss = new JavaScriptSerializer();
            string response = schoolList.Count != 0 ? "{\"result\": \"ok\", \"results\":" + jss.Serialize(schoolList) + "}" : "{\"result\": \"ok\", \"results\":[]}";
            Response.ContentType = "application/json";
            Response.Write(response);
            Response.End();
            return null;
        }
        
        [HttpPost]
        public HttpResponse AddSchoolPost(string rowkey)
        {
            if (AuthTokens[0] == "demo")
            {
                Response.ContentType = "application/json";
                Response.Write("{\"result\": \"done\"}");
                Response.End();
                return null;
            }

            string response = "";
            SchoolAccountClient sac = new SchoolAccountClient();
            SchoolAccount school = sac.GetByPartitionAndRowKey("school", rowkey);

            if (school != null)
            {
                AdminAccountClient aac = new AdminAccountClient();
                AdminAccount admin = aac.GetByPartitionAndRowKey("admin", AuthTokens[1].ToLower());
                if (school.Admin != null && school.Admin != "")
                {
                    response = "{\"result\": \"exist\"}";
                }
                else
                {
                    if (admin.SchoolSelected && !admin.ConnectionToSchoolConfirmed)
                    {
                        response = "{\"result\": \"not confirm\"}";
                    }
                    else if (admin.ConnectionToSchoolConfirmed)
                    {
                        response = "{\"result\": \"dup\"}";
                    }
                    else
                    {
                        admin.School = school.RowKey;
                        admin.SchoolSelected = true;
                        aac.Update(admin);
                        UserAccountClient uac = new UserAccountClient();
                        UserAccount user = uac.GetByPartitionAndRowKey(UserAccountClient.GetPartitionKeyForEmail(admin.RowKey), admin.RowKey);
                        EmailManager emailManager = new EmailManager();
                        string body = "<div>Admin name: " + user.FirstName + " " + user.LastName + "</div><div>Admin phone number and extension:" + admin.PhoneNumber + " x " + admin.PhoneExtension + "</div><div>Admin Email: " + admin.RowKey + "</div>" +
                            "<div>School name: " + school.SchoolName + "</div><div>School address" + school.Address + " " + school.City + " " + school.State + " " + school.ZipCode + "</div>" +
                            "<div>School phone number: " + school.PhoneNumber + "</div>";
                        emailManager.SendMail("no-reply@careerthesaurus.com", "Admin", "mike@peopli.com", "Admin request", body);
                        response = "{\"result\": \"done\"}";
                    }
                }
            }
            else
            {
                response = "{\"result\": \"error\"}";
            }



            //if (school != null)
            //{
            //    //AdminProfileClient apc = new AdminProfileClient();
            //    //AdminProfile admin = apc.GetByPartitionAndRowKey("adminProfile", AuthTokens[1].ToLower());
            //    if (admin != null)
            //    {
            //        TeacherToSchoolConnectionClient ttscc = new TeacherToSchoolConnectionClient();
            //        TeacherToSchoolConnection connection = ttscc.GetByPartitionAndRowKey(rowkey, admin.RowKey);
            //        SchoolToTeacherConnectionClient sttcc = new SchoolToTeacherConnectionClient();
            //        SchoolToTeacherConnection s2tconnection = sttcc.GetByPartitionAndRowKey(admin.RowKey, rowkey);
            //        if (connection == null)
            //        {
            //            ttscc.AddNewItem(new TeacherToSchoolConnection { PartitionKey = rowkey, RowKey = admin.RowKey });
            //            sttcc.AddNewItem(new SchoolToTeacherConnection { PartitionKey = admin.RowKey, RowKey = rowkey });
            //            response = "{\"result\": \"done\"}";
            //        }
            //        else
            //        {
            //            response = "{\"result\": \"already exist\"}";
            //        }
            //    }
            //    else
            //    {
            //        response = "{\"result\": \"fail\"}";
            //    }
            //}
            //else
            //{
            //    response = "{\"result\": \"fail\"}";
            //}
            Response.ContentType = "application/json";
            Response.Write(response);
            Response.End();
            return null;
        }
        [HttpPost]
        public HttpResponse CreateGroup(string school, string counselor, string groupname, string year, string grade)
        {
            if (AuthTokens[0] == "demo")
            {
                Response.ContentType = "application/json";
                Response.Write("{\"result\": \"ok\", \"pincode\": \"demo1\", \"url\": \"demo\"}");
                Response.End();
                return null;
            }
            string response;
            string pincode = getUniquePinCode(school);
            string guid = ShortGuidGenerator.NewGuid();

            AccessCodeClient acc = new AccessCodeClient();
            acc.AddNewItem(new AccessCode { RowKey = guid, Code = pincode, Counselor = counselor, Grade = grade, School = school, Year = year, GroupName = groupname });

            //AssessmentGroupClient agc = new AssessmentGroupClient();
            //AssessmentGroupPinCodeClient agpcc = new AssessmentGroupPinCodeClient();
            //agc.AddNewItem(new AssessmentGroup { PartitionKey = school, RowKey = pincode, Teacher = teacher, Group = group });
            //agpcc.AddNewItem(new AssessmentGroupPinCode { RowKey = guid, PinCode = pincode, School = school, Teacher = teacher, Group = group });
            response = "{\"result\": \"ok\", \"pincode\": \"" + pincode + "\", \"url\": \"" + guid + "\"}";
            Response.ContentType = "application/json";
            Response.Write(response);
            Response.End();
            return null;
        }

        // private functions ===============================================================================================================================================
        private string getUniquePinCode(string school)
        {
            string pincode = PinCodeGenerator.NewPin();

            AccessCodeClient acc = new AccessCodeClient();
            AccessCode code = acc.GetBySchoolAndPinCode(school, pincode);
            //AssessmentGroupClient agc = new AssessmentGroupClient();
            //AssessmentGroup groupEntry = agc.GetByPartitionAndRowKey(school, pincode);
            while (code != null)
            {
                pincode = PinCodeGenerator.NewPin();
                code = acc.GetBySchoolAndPinCode(school, pincode);
            }
            return pincode;
        }
        private bool checkPinCode(string pin)
        {
            Regex duplicates = new Regex(@"/^(?:([A-Za-z0-9])(?!.*\1))*$/");
            Regex format = new Regex(@"/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{5,}$/");
            return duplicates.IsMatch(pin) && format.IsMatch(pin);
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
        private void SendInviteEmail(string email, string name, string admin, string guid)
        {
            string url = "http://CareerThesaurus.com/SignUp/Counselor/" + guid;
            EmailManager emailManager = new EmailManager();
            EmailTemplateHelper eth = new EmailTemplateHelper();
            string body = eth.GetTemplate("counselorinvite");
            body = body.Replace("{{name}}", name);
            body = body.Replace("{{admin}}", admin);
            body = body.Replace("{{url}}", url);
            emailManager.SendMail("admin@careerthesaurus.com", "CareerThesaurus", email, "You are Invited to Join CareerThesaurus", body);
        }
    }
}
