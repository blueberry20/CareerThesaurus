using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using SkillCowResponsive.Classes.Encryption;
using SkillCowResponsive.Classes;
using SkillCowResponsive.Classes.Email;
using SkillCowResponsive.Classes.Helpers;
using SkillCowResponsive.Classes.Cloud.TableStorage.UserAccount;

using SkillCowResponsive.Classes.Cloud.TableStorage.AccessCode;
using SkillCowResponsive.Classes.Cloud.TableStorage.CounselorAccount;
using SkillCowResponsive.Classes.Cloud.TableStorage.AdminAccount;
using SkillCowResponsive.Classes.Cloud.TableStorage.StudentAccount;
using SkillCowResponsive.Classes.Cloud.TableStorage.AssessmentDimension;
using SkillCowResponsive.Classes.Cloud.TableStorage.AssessmentInterest; 

//using SkillCowResponsive.Classes.Cloud.TableStorage.StudentProfile;
//using SkillCowResponsive.Classes.Cloud.TableStorage.AdminProfile;
//using SkillCowResponsive.Classes.Cloud.TableStorage.AssessmentDimensionsRating;
//using SkillCowResponsive.Classes.Cloud.TableStorage.AssessmentInterestRating; 

namespace SkillCowResponsive.Controllers
{
    public class AccountController : AuthenticatedControllerController
    {

        public string[] dimensions = { "attitude", "endurance", "action", "concentration", "information", "processing", "presence", "patterns", "compensation" };

        [HttpGet]
        public ActionResult Index()
        {
            if (AuthTokens == null)
            {
                return RedirectToAction("LogIn");
            }
            else if (AuthTokens[3] == "student")
            {
                return RedirectToAction("Index", "StudentPortal");
            }
            else if (AuthTokens[3] == "administrator")
            {
                return RedirectToAction("Index", "AdminPortal");
            }
            return RedirectToAction("Index", "Home");
        }
        [HttpGet]
        public ActionResult LogIn(string id)
        {
            if (AuthTokens != null)
            {
                return RedirectToAction("Index");
            }
            if (id != null)
            {
                ViewBag.AccessCode = id;
            }
            if (TempData["Done"] != null)
            {
                ViewBag.ResendDone = true;
            }
            else if (TempData["Reset"] != null)
            {
                ViewBag.ResetDone = true;
            }
            return View();
        }
        [HttpPost]
        public ActionResult LogIn(FormCollection collection)
        {
            string accessurl = collection["accessurl"];
            UserAccountClient uac = new UserAccountClient();
            UserAccount account = uac.Logon(collection["email"].ToLower(), collection["password"]);
            if (account == null)
            {
                if (accessurl != null)
                {
                    ViewBag.AccessCode = accessurl;
                }
                ViewBag.InvalidEmail = collection["email"].ToLower();
                return View();
            }
            else if (account.EmailConfirmed == false)
            {
                ViewBag.VerifyEmail = collection["email"].ToLower();
                ViewBag.ResendConfirmationEmail = true;
                return View();
            }
            if (account.ProfileType == "su")
            {
                SaveSessionCookie(collection["email"].ToLower(), account.FirstName + " " + account.LastName, account.ProfileType);
            }
            else if (account.ProfileType == "administrator")
            {
                AdminAccountClient aac = new AdminAccountClient();
                AdminAccount admin = aac.GetByPartitionAndRowKey("admin", account.RowKey);
                SaveSessionCookie(collection["email"].ToLower(), account.FirstName + " " + account.LastName, account.ProfileType);
                if (admin.SchoolSelected)
                {
                    return RedirectToAction("Index", "AdminPortal");
                }
                else
                {
                    return RedirectToAction("AddSchool", "AdminPortal");
                }
            }
            else if (account.ProfileType == "counselor") {
                CounselorAccountClient cac = new CounselorAccountClient();
                CounselorAccount counselor = cac.GetByPartitionAndRowKey("counselor", account.RowKey);
                if (counselor.Active)
                {
                    SaveSessionCookie(collection["email"].ToLower(), account.FirstName + " " + account.LastName, account.ProfileType);
                    return RedirectToAction("Index", "CounselorPortal");
                }
                else
                {
                    ViewBag.ErrorMessage = "Not Active";
                    return View();
                }
            }
            else if (account.ProfileType == "student")
            {
                StudentAccountClient sac = new StudentAccountClient();
                StudentAccount student = sac.GetByPartitionAndRowKey(StudentAccountClient.GetPartitionKeyForEmail(account.Email), account.Email);
                AccessCodeClient acc = new AccessCodeClient();
                AccessCode accessCode = acc.GetByPartitionAndRowKey("accesscode", accessurl);
                if (accessCode != null && accessCode.Year == AccessCodeClient.CurrentGradYear())
                {
                    if (student.Active)
                    {
                        if (student.School != accessCode.School)
                        {
                            TempData["activeschool"] = true;
                        }
                        else if (student.Year == accessCode.Year)
                        {
                            TempData["sameyear"] = true;
                        }
                        else
                        {
                            student.Year = accessCode.Year;
                            student.Grade = accessCode.Grade;
                            student.Counselor = accessCode.Counselor;
                            student.GroupName = accessCode.GroupName;
                            student.AssessmentComplete = false;
                            sac.Update(student);
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
                            sac.Update(student);
                        }
                        else
                        {
                            TempData["inactive"] = true;
                        }
                    }
                }
                else
                {
                    TempData["invalid"] = true;
                }
                SaveSessionCookie(collection["email"].ToLower(), account.FirstName + " " + account.LastName, account.ProfileType);
                //StudentProfileClient spc = new StudentProfileClient();
                //StudentProfile student = spc.GetByPartitionAndRowKey(StudentProfileClient.GetPartitionKeyForEmail(account.Email), account.Email);
                Response.Cookies["firstname"].Value = account.FirstName;
                Response.Cookies["firstname"].Expires = DateTime.UtcNow.AddDays(7);
                Response.Cookies["lastname"].Value = account.LastName;
                Response.Cookies["lastname"].Expires = DateTime.UtcNow.AddDays(7);
                Response.Cookies["email"].Value = account.Email;
                Response.Cookies["email"].Expires = DateTime.UtcNow.AddDays(7);
                Response.Cookies["gender"].Value = student.Gender;
                Response.Cookies["gender"].Expires = DateTime.UtcNow.AddDays(7);
                Response.Cookies["clr"].Value = "1";
                Response.Cookies["clr"].Expires = DateTime.UtcNow.AddDays(7);
                Response.Cookies["cbnvm"].Value = "1";
                Response.Cookies["cbnvm"].Expires = DateTime.UtcNow.AddDays(7);

                AssessmentDimensionClient adc = new AssessmentDimensionClient();
                AssessmentInterestClient aic = new AssessmentInterestClient();

                //AssessmentDimensionsRatingClient adrc = new AssessmentDimensionsRatingClient();
                //AssessmentInterestRatingClient airc = new AssessmentInterestRatingClient();
                JavaScriptSerializer jss = new JavaScriptSerializer();
                List<AssessmentInterest> importantThingRatings = new List<AssessmentInterest>(aic.GetAllCurrentByStudent(student.School, account.RowKey, student.Year, student.Grade));
                //List<AssessmentInterestRating> importantThingRatings = new List<AssessmentInterestRating>(airc.GetAllBySchoolAndStudent(student.School, account.RowKey));
                Response.Cookies["interests"].Value = jss.Serialize(importantThingRatings.Where(x => x.Value == "1").Select(x => x.Interest).ToList());
                Response.Cookies["interests"].Expires = DateTime.UtcNow.AddDays(7);
                for (var i = 0; i < dimensions.Length; i++)
                {
                    //AssessmentDimensionsRating dimensionsRating = adrc.GetByPartitionAndRowKey(student.School, account.Email + dimensions[i]);
                    AssessmentDimension dimensionsRating = adc.GetByPartitionAndRowKey(student.School, account.Email + student.Year + student.Grade + dimensions[i]);
                    if (dimensionsRating != null)
                    {
                        Response.Cookies[dimensions[i]].Value = dimensionsRating.Value;
                        Response.Cookies[dimensions[i]].Expires = DateTime.UtcNow.AddDays(7);
                        if (i == 0)
                        {
                            Response.Cookies["question1"].Value = (dimensionsRating.Misc != null ? dimensionsRating.Misc : dimensionsRating.Value);
                            Response.Cookies["question1"].Expires = DateTime.UtcNow.AddDays(7);
                        }
                    }
                }
                return RedirectToAction("Index", "StudentPortal");
            }
            return RedirectToAction("Index", "Home");
        }
        private void SaveSessionCookie(string email, string name, string type)
        {
            string sessionkey = ClientSession.GetClientSessionKey("user", email.ToLower(), name, type);
            Response.Cookies["sessionkey"].Value = sessionkey;
            Response.Cookies["sessionkey"].Expires = DateTime.UtcNow.AddDays(7);
            Response.Cookies["sessionusername"].Value = email.ToLower();
            Response.Cookies["sessionusername"].Expires = DateTime.UtcNow.AddDays(7);
            Response.Cookies["cbnvm"].Value = "1";
            Response.Cookies["cbnvm"].Expires = DateTime.UtcNow.AddDays(7);
        }
        public ActionResult Logout()
        {
            if (AuthTokens != null)
            {
                if (AuthTokens[3] == "student")
                {
                    Response.Cookies["gender"].Expires = DateTime.Now.AddDays(-1d);
                    Response.Cookies["interests"].Expires = DateTime.Now.AddDays(-1d);
                    Response.Cookies["firstname"].Expires = DateTime.Now.AddDays(-1d);
                    Response.Cookies["lastname"].Expires = DateTime.Now.AddDays(-1d);
                    Response.Cookies["email"].Expires = DateTime.Now.AddDays(-1d);
                    Response.Cookies["question1"].Expires = DateTime.Now.AddDays(-1d);
                    Response.Cookies["clr"].Expires = DateTime.Now.AddDays(-1d);
                    Response.Cookies["cbnvm"].Expires = DateTime.Now.AddDays(-1d);
                    for (var i = 0; i < dimensions.Length; i++)
                    {
                        Response.Cookies[dimensions[i]].Expires = DateTime.Now.AddDays(-1d);
                    }
                    HttpCookieCollection cookies = Request.Cookies;
                    for (var i = 0; i < cookies.Count; i++)
                    {
                        string cookiename = cookies[i].Name;
                        if (cookiename.Contains("dolcode_"))
                        {
                            Response.Cookies[cookiename].Expires = DateTime.Now.AddDays(-1d);
                        }
                    }
                }
                Response.Cookies["sessionkey"].Expires = DateTime.Now.AddDays(-1d);
                Response.Cookies["sessionusername"].Expires = DateTime.Now.AddDays(-1d);
                if (AuthTokens[0] == "demo")
                {
                    Response.Cookies["demosteps"].Expires = DateTime.Now.AddDays(-1d);
                }
            }
            return RedirectToAction("Index", "Home");
        }

        [HttpGet]
        public ActionResult ResetPassword()
        {
            if (AuthTokens != null)
            {
                return RedirectToAction("Index");
            }
            return View();
        }
        [HttpPost]
        public ActionResult ResetPassword(string email)
        {
            if (email.ToLower() == "mike@peopli.com")
            {               
                return View();
            }
            UserAccountClient uac = new UserAccountClient();
            UserAccount account = uac.GetByPartitionAndRowKey(UserAccountClient.GetPartitionKeyForEmail(email), email);
            if (account != null)
            {
                string password = Password.TempPassword();
                account.Password = password;
                uac.Update(account);
                SendResetPasswordEmail(email, password, account.FirstName);
                TempData["Reset"] = true;
                return RedirectToAction("LogIn");
            }
            ViewBag.Response = "Account not found";            
            return View();
        }
        [HttpGet]
        public ActionResult ChangePassword()
        {
            if (AuthTokens == null)
            {
                return RedirectToAction("LogIn");
            }
            return View();
        }
        [HttpPost]
        public ActionResult ChangePassword(string oldPassword, string newPassword, string confirmNewPassword)
        {
            if (AuthTokens == null)
            {
                return RedirectToAction("LogIn");
            }
            if (AuthTokens[0] == "demo")
            {
                ViewBag.Response = "You cannot change password in demo";
                return View();
            }
            string email = AuthTokens[1];
            UserAccountClient uac = new UserAccountClient();
            UserAccount account = uac.GetByPartitionAndRowKey(UserAccountClient.GetPartitionKeyForEmail(email), email);
            if (account == null)
            {
                return RedirectToAction("LogIn");
            }
            else if (account.Password == oldPassword && Password.checkPassword(newPassword) && newPassword == confirmNewPassword)
            {
                account.Password = newPassword;
                uac.Update(account);
                SendPasswordChangeEmail(email);
                ViewBag.PasswordUpdated = true;
            }
            else if (account.Password != oldPassword)
            {
                ViewBag.InvalidPassword = true;
            }
            return View();
        }
        public ActionResult ConfirmEmail(string id)
        {
            if (id != null)
            {
                SimpleAES aes = new SimpleAES();
                string email = aes.DecryptString(id);
                UserAccountClient uac = new UserAccountClient();
                UserAccount account = uac.GetByPartitionAndRowKey(UserAccountClient.GetPartitionKeyForEmail(email), email);
                if (account != null)
                {
                    account.EmailConfirmed = true;
                    uac.Update(account);
                    if (account.ProfileType == "student")
                    {
                        StudentAccountClient sac = new StudentAccountClient();
                        StudentAccount student = sac.GetByPartitionAndRowKey(StudentAccountClient.GetPartitionKeyForEmail(account.Email), account.Email);

                        //StudentProfileClient spc = new StudentProfileClient();
                        //StudentProfile student = spc.GetByPartitionAndRowKey(UserAccountClient.GetPartitionKeyForEmail(account.Email), account.Email);
                        string sessionkey = ClientSession.GetClientSessionKey("user", account.Email, account.FirstName + " " + account.LastName, "student");
                        Response.Cookies["sessionkey"].Value = sessionkey;
                        Response.Cookies["sessionkey"].Expires = DateTime.UtcNow.AddDays(7);
                        Response.Cookies["sessionusername"].Value = account.Email;
                        Response.Cookies["sessionusername"].Expires = DateTime.UtcNow.AddDays(7);
                        Response.Cookies["firstname"].Value = account.FirstName;
                        Response.Cookies["firstname"].Expires = DateTime.UtcNow.AddDays(7);
                        Response.Cookies["lastname"].Value = account.LastName;
                        Response.Cookies["lastname"].Expires = DateTime.UtcNow.AddDays(7);
                        Response.Cookies["email"].Value = account.Email;
                        Response.Cookies["email"].Expires = DateTime.UtcNow.AddDays(7);
                        Response.Cookies["gender"].Value = student.Gender;
                        Response.Cookies["gender"].Expires = DateTime.UtcNow.AddDays(7);
                        Response.Cookies["cbnvm"].Value = "1";
                        Response.Cookies["cbnvm"].Expires = DateTime.UtcNow.AddDays(7);
                        SendCongratulationsEmailToStudent(account.Email, account.FirstName);
                        return RedirectToAction("Index", "StudentPortal");
                    }
                    else if (account.ProfileType == "administrator")
                    {
                        string sessionkey = ClientSession.GetClientSessionKey("user", account.Email, account.FirstName + " " + account.LastName, "administrator");
                        Response.Cookies["sessionkey"].Value = sessionkey;
                        Response.Cookies["sessionkey"].Expires = DateTime.UtcNow.AddDays(7);
                        Response.Cookies["sessionusername"].Value = account.Email;
                        Response.Cookies["sessionusername"].Expires = DateTime.UtcNow.AddDays(7);
                        Response.Cookies["cbnvm"].Value = "1";
                        Response.Cookies["cbnvm"].Expires = DateTime.UtcNow.AddDays(7);
                        SendCongratulationsEmailToAdmin(account.Email, account.FirstName + " " + account.LastName);
                        return RedirectToAction("AddSchool", "AdminPortal");
                    }
                    return View();
                }
                else
                {
                    ViewBag.ErrorMessage = "No account found";
                }
            }
            return RedirectToAction("LogIn");
        }

        public ActionResult ResendVerificationEmail(string id)
        {
            if (id == null)
            {
                return RedirectToAction("LogIn");
            }
            UserAccountClient uac = new UserAccountClient();
            UserAccount account = uac.GetByPartitionAndRowKey(UserAccountClient.GetPartitionKeyForEmail(id), id);
            if (account != null)
            {
                if (account.EmailConfirmed == false)
                {
                    SendVerificationEmail(id, account.FirstName);
                    TempData["Done"] = true;
                    return RedirectToAction("LogIn");
                }
            }
            return RedirectToAction("LogIn");
        }

        private void SendVerificationEmail(string email, string name)
        {
            SimpleAES aes = new SimpleAES();
            string token = aes.EncryptToString(email.ToLower());
            string url = "http://CareerThesaurus.com/Account/ConfirmEmail/" + token;
            EmailManager emailManager = new EmailManager();
            EmailTemplateHelper eth = new EmailTemplateHelper();
            string body = eth.GetTemplate("confirmemail");
            body = body.Replace("{{name}}", name);
            body = body.Replace("{{url}}", url);
            emailManager.SendMail("no-reply@careerthesaurus.com", "CareerThesaurus", email, "Account Notification - Confirm Email", body);
        }
        private void SendResetPasswordEmail(string email, string password, string name)
        {
            EmailManager emailManager = new EmailManager();
            EmailTemplateHelper eth = new EmailTemplateHelper();
            string body = eth.GetTemplate("resetpassword");
            body = body.Replace("{{name}}", name);
            body = body.Replace("{{password}}", password);
            emailManager.SendMail("no-reply@careerthesaurus.com", "CareerThesaurus", email, "Account Notification - Reset Password", body);
        }
        private void SendPasswordChangeEmail(string email)
        {
            EmailManager emailManager = new EmailManager();
            EmailTemplateHelper eth = new EmailTemplateHelper();
            string body = eth.GetTemplate("passwordchanged");
            emailManager.SendMail("admin@careerthesaurus.com", "CareerThesaurus", email, "Account Notification - Password Changed", body);
        }
        private void SendCongratulationsEmailToAdmin(string email, string name)
        {
            EmailManager emailManager = new EmailManager();
            EmailTemplateHelper eth = new EmailTemplateHelper();
            string body = eth.GetTemplate("adminreg");
            body = body.Replace("{{name}}", name);
            emailManager.SendMail("admin@careerthesaurus.com", "CareerThesaurus", email, "Your CareerThesaurus Account Registration", body);
        }
        private void SendCongratulationsEmailToStudent(string email, string name)
        {
            EmailManager emailManager = new EmailManager();
            EmailTemplateHelper eth = new EmailTemplateHelper();
            string body = eth.GetTemplate("studentreg");
            body = body.Replace("{{name}}", name);
            emailManager.SendMail("no-reply@careerthesaurus.com", "CareerThesaurus", email, "You're Registered -- W00t!", body);
        }
    }
}
