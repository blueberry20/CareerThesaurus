using SkillCowResponsive.Classes.Cloud.BlobStorage;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;
using SkillCowResponsive.Classes.Helpers;
using System.Text.RegularExpressions;
using SkillCowResponsive.Classes.Email;
using SkillCowResponsive.Classes;
using SkillCowResponsive.Classes.Cloud.TableStorage.School;
using SkillCowResponsive.Classes.Cloud.TableStorage.PendingSchool;
using SkillCowResponsive.Classes.Encryption;
using SkillCowResponsive.Classes.Cloud.TableStorage.UserAccount;

using SkillCowResponsive.Classes.Cloud.TableStorage.StudentAccount;
using SkillCowResponsive.Classes.Cloud.TableStorage.AdminAccount;
using SkillCowResponsive.Classes.Cloud.TableStorage.CounselorAccount;
using SkillCowResponsive.Classes.Cloud.TableStorage.AccessCode;

using SkillCowResponsive.Classes.Cloud.TableStorage.AssessmentDimension;
using SkillCowResponsive.Classes.Cloud.TableStorage.AssessmentInterest;
using SkillCowResponsive.Classes.Cloud.TableStorage.AssessmentCareer;

using System.Web.Helpers;
using SkillCowResponsive.Classes.Cloud.TableStorage.AdminMisc;
using SkillCowResponsive.Models;
using SkillCowResponsive.Classes.Cloud.TableStorage;
using SkillCowResponsive.Classes.Cloud.TableStorage.SendGridEvent;
using SkillCowResponsive.Classes.Cloud.TableStorage.BlogPost;
using SkillCowResponsive.Classes.Cloud.TableStorage.BlogCategory;
using SkillCowResponsive.Classes.Cloud.TableStorage.BlogTag;
using SkillCowResponsive.Classes.Cloud.TableStorage.LockedModeUser;
using System.Diagnostics;
using SkillCowResponsive.Classes.DeferredProcesses;
using System.Web.Script.Serialization;

namespace SkillCowResponsive.Controllers
{
    public class AdminController : AuthenticatedControllerController
    {
        //
        // GET: /Admin/

        // permanent admin pages ==========================================================================================================================================================================
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult PendingSchools()
        {
            return View();
        }
        [HttpGet]
        public ActionResult EditPendingSchools(string id)
        {
            ViewBag.PendingId = id;
            return View();
        }
        [HttpPost]
        public ActionResult EditPendingSchools(string rowkey, string name, string phone, string address, string city, string state, string zip)
        {
            PendingSchoolClient psc = new PendingSchoolClient();
            PendingSchool school = psc.GetByPartitionAndRowKey("pendingschool", rowkey);
            if (school != null)
            {
                school.SchoolName = name;
                school.PhoneNumber = phone;
                school.Address = address;
                school.City = city;
                school.State = state;
                school.ZipCode = zip;
                psc.Update(school);
            }
            return RedirectToAction("PendingSchools");
        }
        public ActionResult AdminRequests()
        {
            return View();
        }
        public ActionResult Admins()
        {
            return View();
        }
        
        public ActionResult Students()
        {
            StudentAccountClient sac = new StudentAccountClient();
            UserAccountClient uac = new UserAccountClient();
            List<StudentReportEntry> reportEntries = new List<StudentReportEntry>();
            List<StudentAccount> studentsAll = new List<StudentAccount>(sac.GetAll());
            List<StudentAccount> students = studentsAll.Where(x => x.School != "7181234567").ToList();
            foreach (StudentAccount student in students)
            {
                UserAccount user = uac.GetByPartitionAndRowKey(UserAccountClient.GetPartitionKeyForEmail(student.RowKey), student.RowKey);
                UserAccount counselor = uac.GetByPartitionAndRowKey(UserAccountClient.GetPartitionKeyForEmail(student.Counselor), student.Counselor);
                if (user != null && counselor != null)
                {
                    reportEntries.Add(new StudentReportEntry { email = student.RowKey, emailconfirmed = user.EmailConfirmed, firstname = user.FirstName, lastname = user.LastName, counselorname = counselor.FirstName + " " + counselor.LastName, counseloremail = student.Counselor, interests = student.RatedInterests, traits = student.RatedDimensions, likecareers = student.RatedCareers, dislikecareers = student.DislikeCareers });
                }
            }
            return View(reportEntries.OrderBy(x => x.counselorname).ThenBy(x => x.firstname).ThenBy(x => x.lastname));
        }

        public ActionResult Newsletter()
        {
            return View();
        }

        public ActionResult SendGrid()
        {
            return View();
        }
        public string LockedMode()
        {
            LockedModeUserClient lmuc = new LockedModeUserClient();
            List<LockedModeUser> users = new List<LockedModeUser>(lmuc.GetAll());
            return users.Count.ToString();
        }
        public ActionResult Records()
        {
            return View();
        }
        [HttpGet]
        public JsonResult MoreInfo(string email)
        {
            if (email == null)
            {
                return null;
            }
            JsonResult result = new JsonResult();
            result.JsonRequestBehavior = JsonRequestBehavior.AllowGet;
            email = email.ToLower();
            UserAccountClient uac = new UserAccountClient();
            SchoolAccountClient sc = new SchoolAccountClient();
            UserAccount user = uac.GetByPartitionAndRowKey(UserAccountClient.GetPartitionKeyForEmail(email), email);
            switch (user.ProfileType)
            {
                case "student":
                    StudentAccountClient sac = new StudentAccountClient();
                    StudentAccount student = sac.GetByPartitionAndRowKey(StudentAccountClient.GetPartitionKeyForEmail(email), email);
                    SchoolAccount school = sc.GetByPartitionAndRowKey("school", student.School);
                    result.Data = new
                    {
                        type = "Student",
                        name = user.FirstName + " " + user.LastName,
                        email = email,
                        confirmed = user.EmailConfirmed,
                        signup = user.CreatedOn.ToString("MM/dd/yyyy"),
                        school = school != null ? school.SchoolName : "N/A",
                        zipcode = school != null ? school.ZipCode : "N/A"
                    };
                    break;
                case "admin":
                    AdminAccountClient aac = new AdminAccountClient();
                    AdminAccount admin = aac.GetByPartitionAndRowKey("admin", email);
                    SchoolAccount schoolAdmin = sc.GetByPartitionAndRowKey("school", admin.School);
                    result.Data = new
                    {
                        type = "Admin",
                        name = user.FirstName + " " + user.LastName,
                        email = email,
                        confirmed = user.EmailConfirmed,
                        signup = user.CreatedOn.ToString("MM/dd/yyyy"),
                        school = schoolAdmin != null ? schoolAdmin.SchoolName : "N/A",
                        zipcode = schoolAdmin != null ? schoolAdmin.ZipCode : "N/A"
                    };
                    break;
                case "counselor":
                    CounselorAccountClient cac = new CounselorAccountClient();
                    CounselorAccount counselor = cac.GetByPartitionAndRowKey("counselor", email);
                    SchoolAccount schoolCounselor = sc.GetByPartitionAndRowKey("school", counselor.School);
                    result.Data = new
                    {
                        type = "Counselor",
                        name = user.FirstName + " " + user.LastName,
                        email = email,
                        confirmed = user.EmailConfirmed,
                        signup = user.CreatedOn.ToString("MM/dd/yyyy"),
                        school = schoolCounselor != null ? schoolCounselor.SchoolName : "N/A",
                        zipcode = schoolCounselor != null ? schoolCounselor.ZipCode : "N/A"
                    };
                    break;
                default:
                    return null;
            }
            return result;
        }
        // temp pages ========================================================================================================================================================================================
        public ActionResult __SchoolAdmin()
        {
            return View();
        }
        public ActionResult __SchoolStudents()
        {
            return View();
        }
        public ActionResult __Subscribed()
        {
            return View();
        }
        public ActionResult __Schools()
        {
            return View();
        }

        // ajax calls ========================================================================================================================================================================================
        [HttpPost]
        public HttpResponse AdminStatus(string user, string status)
        {
            string response;
            AdminAccountClient aac = new AdminAccountClient();
            AdminAccount admin = aac.GetByPartitionAndRowKey("admin", user);
            UserAccountClient uac = new UserAccountClient();
            UserAccount account = uac.GetByPartitionAndRowKey(UserAccountClient.GetPartitionKeyForEmail(user), user);
            if (status == "approve")
            {
                SchoolAccountClient sac = new SchoolAccountClient();
                SchoolAccount school = sac.GetByPartitionAndRowKey("school", admin.School);
                admin.ConnectionToSchoolConfirmed = true;
                admin.RequestStatus = "";
                aac.Update(admin);
                school.Admin = admin.RowKey;
                sac.Update(school);
                response = "{\"result\": \"" + account.FirstName + " " + account.LastName + " request to connect to school " + school.SchoolName + " was approved\"}";
            }
            else
            {
                admin.School = null;
                admin.SchoolSelected = false;
                admin.ConnectionToSchoolConfirmed = false;
                admin.RequestStatus = "Declined";
                aac.Update(admin);
                response = "{\"result\": \"" + account.FirstName + " " + account.LastName + " request was declined\"}";
            }
            Response.ContentType = "application/json";
            Response.Write(response);
            Response.End();
            return null;
        }
        [HttpPost]
        public HttpResponse updateStatus(string rowkey, string status)
        {
            string response;
            PendingSchoolClient psc = new PendingSchoolClient();
            SchoolAccountClient sac = new SchoolAccountClient();
            PendingSchool school = psc.GetByPartitionAndRowKey("pendingschool", rowkey);
            if (school != null)
            {
                UserAccountClient uac = new UserAccountClient();
                UserAccount admin = uac.GetByPartitionAndRowKey(UserAccountClient.GetPartitionKeyForEmail(school.Admin), school.Admin);
                AdminAccountClient aac = new AdminAccountClient();
                AdminAccount adminAccount = aac.GetByPartitionAndRowKey("admin", school.Admin);
                string name = admin != null ?  admin.FirstName + " " + admin.LastName : "";
                if (status == "approved")
                {
                    school.Approved = true;
                    school.Pending = false;
                    psc.Update(school);
                    string RowKeyFormated = Regex.Replace(school.PhoneNumber, @"[^0-9]", "");
                    SchoolAccount schoolAccount = sac.GetByPartitionAndRowKey("school", RowKeyFormated);
                    if (schoolAccount == null)
                    {
                        sac.AddNewItem(new SchoolAccount { RowKey = RowKeyFormated, SchoolName = school.SchoolName, Address = school.Address, City = school.City, State = school.State, ZipCode = school.ZipCode, PhoneNumber = school.PhoneNumber });
                    }
                    else
                    {
                        schoolAccount.SchoolName = school.SchoolName;
                        schoolAccount.Address = school.Address;
                        schoolAccount.City = school.City;
                        schoolAccount.State = school.State;
                        schoolAccount.ZipCode = school.ZipCode;
                        schoolAccount.PhoneNumber = school.PhoneNumber;
                        sac.Update(schoolAccount);
                    }
                    response = "{\"result\": \"ok\"}";
                    SendNotificationEmail(school.Admin, name, status);
                }
                else if (status == "dup")
                {
                    school.Duplicate = true;
                    school.Pending = false;
                    psc.Update(school);
                    adminAccount.SchoolSelected = false;
                    adminAccount.RequestStatus = "Duplicate";
                    aac.Update(adminAccount);
                    response = "{\"result\": \"ok\"}";
                    SendNotificationEmail(school.Admin, name, status);
                }
                else if (status == "invalid" || status == "elementary")
                {
                    school.Incorrect = true;
                    school.Pending = false;
                    psc.Update(school);
                    adminAccount.SchoolSelected = false;
                    adminAccount.RequestStatus = status == "invalid" ? "Invalid" : "Elementary";
                    aac.Update(adminAccount);
                    response = "{\"result\": \"ok\"}";
                    SendNotificationEmail(school.Admin, name, status);
                }
                else
                {
                    response = "{\"result\": \"error\"}";
                }
            }
            else
            {
                response = "{\"result\": \"error\"}";
            }                
            Response.ContentType = "application/json";
            Response.Write(response);
            Response.End();
            return null;
        }
        [HttpPost]
        public JsonResult GetNotes(string rk)
        {
            AdminMiscClient amc = new AdminMiscClient();
            AdminMisc misc = amc.GetByPartitionAndRowKey("adminmisc", rk);
            string notes = "";
            string lasttime = "N/A";
            if (misc != null)
            {
                notes = misc.Notes;
                lasttime = misc.LastTimeUpdated.ToString("f");
            }
            return new JsonResult { Data = new { result = "ok", notes = notes, lasttime = lasttime } };
        }
        [HttpPost]
        public JsonResult SaveNotes(string rk, string notes) {
            if (notes.Length < 65535)
            {
                AdminMiscClient amc = new AdminMiscClient();
                AdminMisc misc = amc.GetByPartitionAndRowKey("adminmisc", rk);
                if (misc != null)
                {
                    misc.Notes = notes;
                    misc.LastTimeUpdated = EasternTimeConverter.Convert(DateTime.UtcNow);
                    amc.Update(misc);
                }
                else
                {
                    amc.AddNewItem(new AdminMisc
                    {
                        RowKey = rk,
                        Notes = notes
                    });
                }
                return new JsonResult { Data = new { result = "ok" } };
            }
            return new JsonResult { Data = new { result = "error" } };
        }
        [HttpPost]
        public JsonResult getRecords(string fromdate, string todate)
        {
            SendGridEventClient sgec = new SendGridEventClient();
            List<SendGridEvent> records = new List<SendGridEvent>(sgec.GetByDates(Convert.ToDateTime(fromdate), Convert.ToDateTime(todate)));
            return new JsonResult { Data = new { result = "ok", data = records }, MaxJsonLength = Int32.MaxValue };
        }
        [HttpPost]
        public JsonResult getSignupRecords(string fromdate, string todate)
        {
            LockedModeUserClient lmuc = new LockedModeUserClient();
            List<LockedModeUser> records = new List<LockedModeUser>(lmuc.GetByDates(Convert.ToDateTime(fromdate), Convert.ToDateTime(todate)));
            return new JsonResult { Data = new { result = "ok", total = records.Count, phone = records.Count(x => !string.IsNullOrWhiteSpace(x.Phone)), email = records.Count(x => string.IsNullOrWhiteSpace(x.Phone)) }, MaxJsonLength = Int32.MaxValue };
        }
        // email sending functions auto ==========================================================================================================================================================
        private void SendNotificationEmail(string email, string name, string status)
        {
            EmailManager emailManager = new EmailManager();
            EmailTemplateHelper eth = new EmailTemplateHelper();
            string body = eth.GetTemplate("pendingschoolstatus" + status);
            body = body.Replace("{{name}}", name);
            emailManager.SendMail("no-reply@careerthesaurus.com", "CareerThesaurus", email, "Update School Request", body);
        }

        // email sending functions custom ========================================================================================================================================================
        private string NacacEmail()
        {
            string filename = @"c:\csv\nacac_emails.csv";

            int cnt = 0;

            using (StreamReader sr = new StreamReader(filename))
            {
                string line;
                do
                {
                    line = sr.ReadLine();
                    if (line != null)
                    {
                        if (cnt++ > 0)
                        {
                            List<string> values = ParseCSV(line);
                            // 0 - name, 1 - title, 2 - school name, 3 - address, 4 - city, 5 - state, 6 - zip code, 7 - direct phone, 8 - ext, 9 - cell, 10 - main number, 11 - email
                            if (values[0] != null && values[0] != "")
                            {
                                string firstName = values[0].Substring(0, values[0].IndexOf(" "));
                                string lastName = values[0].Substring(values[0].IndexOf(" ") + 1);
                                string urlparam = "?firstname=" + firstName + "&lastname=" + lastName + "&email=" + HttpUtility.UrlEncode(values[11]) + "&phone=" + values[10].Replace("-", "");
                                SendNacacEmail(values[11], firstName, urlparam);
                            }
                        }
                    }
                } while (line != null);
            }
            return "";
        }
        private void SendNacacEmail(string email, string name, string urlparam)
        {
            if (!string.IsNullOrEmpty(email) && !string.IsNullOrEmpty(name) && !string.IsNullOrEmpty(urlparam))
            {
                EmailManager emailManager = new EmailManager();

                EmailTemplateHelper eth = new EmailTemplateHelper();
                string body = eth.GetTemplate("nacacfollowupv2");
                body = body.Replace("{{name}}", name);
                body = body.Replace("{{urlparam}}", urlparam);
                //emailManager.SendMail("no-reply@careerthesaurus.com", "CareerThesaurus", email, "Following up on our NACAC meeting", body);
            }
            else
            {
                Console.Write("error");
            }
        }
        private string OtherConference()
        {
            string filename = @"c:\csv\conference_emails.csv";

            int cnt = 0;

            using (StreamReader sr = new StreamReader(filename))
            {
                string line;
                do
                {
                    line = sr.ReadLine();
                    if (line != null)
                    {
                        if (cnt++ > 0)
                        {
                            List<string> values = ParseCSV(line);
                            // 0 - name, 1 - source, 2 - school name, 3 - address, 4 - city, 5 - state, 6 - zip code, 7 - direct phone, 8 - ext, 9 - cell, 11 - main number, 12 - email
                            if (values[0] != null && values[0] != "")
                            {
                                string firstName = values[0].Substring(0, values[0].IndexOf(" "));
                                string lastName = values[0].Substring(values[0].IndexOf(" ") + 1);
                                lastName = lastName == "!" ? "" : lastName;
                                string urlparam = "?firstname=" + firstName + "&lastname=" + lastName + "&email=" + HttpUtility.UrlEncode(values[12]) +"&phone=" + values[11].Replace("-", "");
                                string source = values[1];
                                SendOtherConferenceEmail(values[12], (firstName + " " + lastName).Trim(), urlparam, source);
                            }
                        }
                    }
                } while (line != null);
            }
            return "";
        }
        private void SendOtherConferenceEmail(string email, string name, string urlparam, string source)
        {
            if (!string.IsNullOrEmpty(email) && !string.IsNullOrEmpty(name) && !string.IsNullOrEmpty(urlparam))
            {
                EmailManager emailManager = new EmailManager();
                EmailTemplateHelper eth = new EmailTemplateHelper();
                string body = eth.GetTemplate("stateschoolcounselingprospects");
                body = body.Replace("{{name}}", name);
                body = body.Replace("{{source}}", source);
                body = body.Replace("{{urlparam}}", urlparam);
                //emailManager.SendMail("no-reply@careerthesaurus.com", "CareerThesaurus", email, "Following up on our meeting", body);
            }
            else
            {
                Console.Write("error");
            }
        }

        // additional publishing functions ========================================================================================================================================================
        private  string PublishProfessions()
        {
            //string filename = @"c:\csv\ct_professions.csv";
            string filename = @"c:\csv\aka2.csv"; //values[0] - dolcode, values[1] - title, values[2] - aka
            int cnt = 0;

            BlobJsonResourceManager blobManager = new BlobJsonResourceManager();
            
            using(StreamReader sr = new StreamReader(filename))
            {
                string line;
                do
                {
                    line = sr.ReadLine();
                    if (line != null)
                    {
                        //DO SOMETHING
                        if(cnt++>0)
                        {
                            List<string> values = ParseCSV(line);
                            string[] info = new string[5];
                            Regex regex = new Regex(@"[^a-zA-Z0-9]+");
                            values[1] = values[1].Trim();
                            string careername = regex.Replace(values[1], "-");
                            Regex reg = new Regex(@",\s?");
                            string aka = reg.Replace(values[2], ", ");
                            string description = "";//values[3];
                            string duties = "information coming soon";
                            string salary = "information coming soon";
                            string wheretofind = "information coming soon";
                            string demand = "information coming soon";
                            bool publish = false;
                            string file = @"c:\professionsConverted\" + values[0] + ".txt";
                            //if (values[0] == "47-3012" || values[0] == "47-3015" || values[0] == "47-3013")
                            //{
                            //    publish = true;
                            //}
                            //publish = true;
                            if (System.IO.File.Exists(file))
                            {
                                publish = true;
                                using (StreamReader streamR = new StreamReader(file))
                                {
                                    string fileline;
                                    int index = 0;                                    
                                    do
                                    {
                                        fileline = streamR.ReadLine();
                                        if (fileline != null && !fileline.Contains("-----") && fileline.Trim() != "")
                                        {
                                            fileline = fileline.Trim();
                                            if (fileline == "Description")
                                            {
                                                index = 0;
                                            }
                                            else if (fileline == "Duties")
                                            {
                                                index = 1;
                                            }
                                            else if (fileline == "Salary")
                                            {
                                                index = 2;
                                            }
                                            else if (fileline == "Where to Find")
                                            {
                                                index = 3;
                                            }
                                            else if (fileline == "Demand")
                                            {
                                                index = 4;
                                            }
                                            else
                                            {                                            
                                                info[index] = info[index] + "|" + fileline.Replace(@"\s+", " ");
                                            }
                                        }
                                    } while (fileline != null);
                                }
                            }
                            description = info[0] == null ? description : info[0];
                            duties = info[1] == null ? duties : info[1];
                            salary = info[2] == null ? salary : info[2];
                            wheretofind = info[3] == null ? wheretofind : info[3];
                            demand = info[4] == null ? demand : info[4];
                            if (publish)
                            {
                                //blobManager.SaveJsonResource("dolcode", "careers", "dolcodes", careername.ToLower(), "{value:\"" + values[0] + "\"}");
                                //blobManager.SaveJsonResource("career_title", "careers", "bydolcode/" + values[0], "title", "{value:\"" + values[1] + "\"}");
                                //blobManager.SaveJsonResource("career_aka", "careers", "bydolcode/" + values[0], "aka", "{value:\"" + aka + "\"}");
                                //blobManager.SaveJsonResource("career_description", "careers", "bydolcode/" + values[0], "description", "{value:\"" + description + "\"}");
                                //blobManager.SaveJsonResource("career_short_description", "careers", "bydolcode/" + values[0], "short_description", "{value:\"" + description + "\"}");
                                //blobManager.SaveJsonResource("career_duties", "careers", "bydolcode/" + values[0], "duties", "{value:\"" + duties + "\"}");
                                //blobManager.SaveJsonResource("career_salary", "careers", "bydolcode/" + values[0], "salary", "{value:\"" + salary + "\"}");
                                //blobManager.SaveJsonResource("career_wheretofind", "careers", "bydolcode/" + values[0], "wheretofind", "{value:\"" + wheretofind + "\"}");
                                //blobManager.SaveJsonResource("career_demand", "careers", "bydolcode/" + values[0], "demand", "{value:\"" + demand + "\"}");
                            }
                        }
                    }
                } while (line != null);
            }

            //using(StreamWriter sw = new StreamWriter(@"c:\csv\temp.csv"))
            //{
            //    sw.WriteLine();
            //}            

            return "";
        }

        public string PublishAudioBooks()
        {
            string filename = @"c:\csv\audiobooks.csv"; //values[0] - dolcode, values[1] - title, values[2] - aka
            int cnt = 0;

            BlobJsonResourceManager blobManager = new BlobJsonResourceManager();

            List<Role> roles = new List<Role>();
            string currentRole = "";
            bool publish = false;

            using (StreamReader sr = new StreamReader(filename))
            {
                string line;
                do
                {
                    line = sr.ReadLine();
                    if (line != null)
                    {
                        //DO SOMETHING
                        if (cnt++ > 0)
                        {
                            List<string> values = ParseCSV(line);
                            
                            AudioBook book = new AudioBook
                            {
                                Name = values[1],
                                ShortDescription = values[3],
                                LongDescription = values[4],
                                SKU = values[7],
                                ASIN = values[8],
                                OurPrice = values[9],
                                RetailPrice = values[10],
                                BuyUrl = values[16],
                                ThumbNailUrl = values[17],
                                LargeImageUrl = values[18],
                                Author = values[19],
                                Publisher = values[20],
                                AudioLength = values[21],
                                SampleUrl = values[22],
                                ReleaseDate = values[23],
                                Narrator = values[24],
                                Rank = values[5]
                            };

                            if (currentRole != values[6])
                            {
                                currentRole = values[6];
                                roles.Add(new Role { role = values[6], AudioBooks = new List<AudioBook>()});
                            }
                            roles.Last().AudioBooks.Add(book);
                            
                            

                        }
                    }
                } while (line != null);
            }
            foreach (Role role in roles)
            {
                string temp = role.AudioBooks.ToJSON();
                blobManager.SaveJsonResource("audiobooks", "audiobooks", "byrole", role.role.ToLower().Replace(" ", "-"), "{value:" + role.AudioBooks.ToJSON() + "}");
            }

            return "";
        }

        private class Role
        {
            public string role { get; set; }
            public List<AudioBook> AudioBooks { get; set; }
        }

        private class AudioBook
        {
            // rank [6] role [7]
            public string Rank { get; set; }
            public string Name { get; set; } // values[1]
            public string ShortDescription { get; set; } // values[4]
            public string LongDescription { get; set; } //values[5]
            public string SKU { get; set; } //values[8]
            public string ASIN { get; set; } //values[9]
            public string OurPrice { get; set; } //values[11]
            public string RetailPrice { get; set; } //values[12]
            public string BuyUrl { get; set; } //values[13]
            public string ThumbNailUrl { get; set; } //values[14]
            public string LargeImageUrl { get; set; } //values[15]
            public string Author { get; set; } //values[16]
            public string Publisher { get; set; } //values[17]
            public string AudioLength { get; set; } //values[18]
            public string SampleUrl { get; set; } //values[19]
            public string ReleaseDate { get; set; } //values[20]
            public string Narrator { get; set; } //values[21]
        }

        private class Category
        {
            public string occ { get; set; }
            public string dolcode { get; set; }
            public string major { get; set; }
            public string minor { get; set; }
            public string category { get; set; }
            public string career { get; set; }
        }
        private class Programs
        {
            public string dolcode { get; set; }
            public string primary { get; set; }
            public string secondary { get; set; }
            public string vm { get; set; }
        }
        private string PublishCategory()
        {
            string filename = @"c:\csv\ct_profession.csv";
            //string filename = @"c:\csv\ct_profession2.csv";

            int cnt = 0;

            //BlobJsonResourceManager blobManager = new BlobJsonResourceManager();
            //List<Category> categoryList = new List<Category>();
            //List<Programs> programs = new List<Programs>();
            using (StreamReader sr = new StreamReader(filename))
            {
                string line;
                do
                {
                    line = sr.ReadLine();
                    if (line != null)
                    {
                        //DO SOMETHING
                        if (cnt++ > 0)
                        {
                            List<string> values = ParseCSV(line);
                            if (values[1] == "" || values[0].Length < 2)
                            {
                                continue;
                            }
                            //categoryList.Add(new Category { occ = values[0].Substring(0, 2), dolcode = values[0], major = values[3], minor = values[4], category = values[6], career = values[1] });
                            //programs.Add(new Programs { dolcode = values[0], primary = values[10], secondary = values[11], vm = values[16] });
                        }
                    }
                } while (line != null);
            }
            //List<string> results = new List<string>();
            //List<string> occs = categoryList.Select(x => x.occ).Distinct().ToList();
            //List<string> majors = categoryList.Select(x => x.major).Distinct().ToList();
            //foreach (string major in majors)
            //{
            //    List<string> minors = categoryList.Where(x => x.major == major).Select(x => x.minor).Distinct().ToList();
            //    List<string> minorsArray = new List<string>();
            //    foreach (string minor in minors)
            //    {
            //        //result += "{minor:\"" + minor + "\",categories:[";
            //        List<string> categories = categoryList.Where(x => x.major == major && x.minor == minor).Select(x => x.category).Distinct().ToList();
            //        List<string> careersArray = new List<string>();
            //        foreach (string category in categories)
            //        {
            //            List<string> careers = categoryList.Where(x => x.major == major && x.minor == minor && x.category == category).Select(x => x.career).Distinct().ToList();
            //            List<string> codesCareers = new List<string>();
            //            foreach (string career in careers)
            //            {
            //                string dolcode = categoryList.Where(x => x.career == career).Select(x => x.dolcode).First();
            //                codesCareers.Add(new StringBuilder("{dolcode:\"" + dolcode + "\",career:\"" + career + "\"}").ToString());
            //            }
            //            string careersStr = new StringBuilder("{category:\"" + category + "\",careers:[" + string.Join<string>(",", codesCareers) + "]}").ToString();
            //            careersArray.Add(careersStr);
            //        }
            //        string minorStr = new StringBuilder("{minor:\"" + minor + "\",categories:[" + string.Join<string>(",", careersArray) + "]}").ToString();
            //        minorsArray.Add(minorStr);
            //    }
            //    string majorStr = new StringBuilder("{major:\"" + major + "\",minors:[" + string.Join<string>(",", minorsArray) + "]}").ToString();
            //    results.Add(majorStr);
            //}

            //for (var i = 0; i < results.Count; i++ )
            //{
            //    if (occs[i] == "21")
            //    {
                    //blobManager.SaveJsonResource("career_tree", "careers", "bymajor/" + occs[i], "tree", results[i]);
                //}
                //Console.Write(results[i]);
                //Console.Write(occs[i]);
            //}
            //for (var i = 0; i < programs.Count; i++)
            //{
            //    blobManager.SaveJsonResource("career_program", "careers", "bydolcode/" + programs[i].dolcode, "program", "{primary:\"" + programs[i].primary + "\",secondary:\"" + programs[i].secondary + "\",vm:\"" + programs[i].vm + "\"}");
            //}
            return "";
        }

        private class bystate
        {
            public string dolcode { get; set; }
            public string state { get; set; }
            public string a_mean { get; set; }
            public string a_pct10 { get; set; }
            public string a_pct90 { get; set; }
        }

        private string PublishSalaryStats()
        {
            List<string> dolCodes = new List<string>();
            string filename = @"c:\csv\dolcodes.csv";
            int cnt = 0;
            using (StreamReader sr = new StreamReader(filename))
            {
                string line;
                do
                {
                    line = sr.ReadLine();
                    if (line != null)
                    {
                        if (cnt++ > 0)
                        {
                            List<string> values = ParseCSV(line);
                            dolCodes.Add(values[0]);
                        }
                    }
                } while (line != null);
            }

            List<bystate> bystatelist = new List<bystate>();

            List<List<bystate>> data = new List<List<bystate>>();
            filename = @"c:\csv\statesalary.csv";

            List<string> placeholderValues = new List<string>();
            cnt = 0;
            string currentDolCode = "";
            
            BlobJsonResourceManager blobManager = new BlobJsonResourceManager();

            using (StreamReader sr = new StreamReader(filename))
            {
                string line;
                do
                {
                    line = sr.ReadLine();
                    if (line != null)
                    {
                        if (cnt++ > 0)
                        {
                            List<string> values = ParseCSV(line);
                            if (values[1] == "PR" || values[1] == "VI" || values[1] == "GU" || values[1] == "HI")
                            {
                                continue;
                            }
                            if (currentDolCode == values[3])
                            {
                                bystatelist.Add(new bystate { dolcode = currentDolCode, state = values[1], a_mean = values[11], a_pct10 = values[18], a_pct90 = values[22] });
                            }
                            else
                            {
                                if (!dolCodes.Contains(values[3]))
                                {
                                    continue;
                                }
                                if (currentDolCode != "")
                                {
                                    data.Add(bystatelist);
                                }
                                currentDolCode = values[3];
                                bystatelist = new List<bystate>();
                                bystatelist.Add(new bystate { dolcode = currentDolCode, state = values[1], a_mean = values[11], a_pct10 = values[18], a_pct90 = values[22] });
                            }
                        }
                    }
                } while (line != null);
            }
            List<bystate> nationalList = new List<bystate>();
            filename = @"c:\csv\nationalsalary.csv";
            cnt = 0;
            using (StreamReader sr = new StreamReader(filename))
            {
                string line;
                do
                {
                    line = sr.ReadLine();
                    if (line != null)
                    {
                        if (cnt++ > 0)
                        {
                            List<string> values = ParseCSV(line);
                            nationalList.Add(new bystate { dolcode = values[0], state = null, a_mean = values[6], a_pct10 = null, a_pct90 = null });
                        }
                    }
                } while (line != null);
            }
            foreach (var value in data)
            {
                List<string> results = new List<string>();
                string dolcode = "";
                foreach (bystate state in value)
                {
                    dolcode = state.dolcode;
                    results.Add(new StringBuilder("{state:\"" + state.state + "\",a_mean:\"" + state.a_mean + "\",a_pct10:\"" + state.a_pct10 + "\",a_pct90:\"" + state.a_pct90 + "\"}").ToString());
                }
                string national_a_mean = nationalList.Where(x => x.dolcode == dolcode).Select(x => x.a_mean).First();
                string str = new StringBuilder("[{state:\"national\",a_mean:\"" + national_a_mean + "\",a_pct10:" + "\"\"" + ",a_pct90:" + "\"\"" + "}," + string.Join<string>(",", results) + "]").ToString();
                //blobManager.SaveJsonResource("career_salaries", "careers", "bydolcode/" + dolcode, "salaries", str);
            }

            return "";
        }

        private class byindustry
        {
            public string dolcode { get; set; }
            public string naics { get; set; }
            public string industry { get; set; }
            public string employed { get; set; }
            public string a_mean { get; set; }
        }

        private class forecast
        {
            public string naics { get; set; }
            public string change { get; set; }
        }

        private string PublishIndustry()
        {
            List<byindustry> byindustrylist = new List<byindustry>();

            List<List<byindustry>> data = new List<List<byindustry>>();

            string filename = @"c:\csv\industries.csv";

            int cnt = 0;
            string currentDolCode = "";

            BlobJsonResourceManager blobManager = new BlobJsonResourceManager();

            using (StreamReader sr = new StreamReader(filename))
            {
                string line;
                do
                {
                    line = sr.ReadLine();
                    if (line != null)
                    {
                        if (cnt++ > 0)
                        {
                            List<string> values = ParseCSV(line);
                            if (values[6].Contains("*") || values[11].Contains("*") || values[11].Contains("#"))
                            {
                                continue;
                            }                          
                            if (currentDolCode == values[3])
                            {
                                byindustrylist.Add(new byindustry { dolcode = currentDolCode, naics = values[0], industry = values[2], employed = values[6], a_mean = values[11] });
                            }
                            else
                            {
                                if (currentDolCode != "")
                                {
                                    data.Add(byindustrylist);
                                }
                                currentDolCode = values[3];
                                byindustrylist = new List<byindustry>();
                                byindustrylist.Add(new byindustry { dolcode = currentDolCode, naics = values[0], industry = values[2], employed = values[6], a_mean = values[11] });
                            }
                        }
                    }
                } while (line != null);
            }
            foreach (var value in data)
            {
                List<string> results = new List<string>();
                int a_mean = 0;
                int total = 0;
                string dolcode = value.First().dolcode;
                cnt = 0;
                List<forecast> forecastList = new List<forecast>();
                string file = @"c:\csvdol\occ_" + dolcode + ".csv";
                try
                {
                    using (StreamReader sr = new StreamReader(file))
                    {
                        string line;
                        do
                        {
                            line = sr.ReadLine();
                            if (line != null)
                            {
                                if (cnt++ > 5)
                                {
                                    List<string> values = ParseCSV(line);
                                    //values[1] and values[10]
                                    forecastList.Add(new forecast { naics = values[1], change = values[10] });
                                }
                            }
                        } while (line != null);
                    }
                }
                catch (FileNotFoundException)
                {

                }

                foreach (byindustry industry in value)
                {
                    dolcode = industry.dolcode;
                    a_mean += Convert.ToInt32(industry.a_mean);
                    total += Convert.ToInt32(industry.employed);
                    string change;
                    try
                    {
                        change = forecastList.Where(x => x.naics == industry.naics).Select(x => x.change).First();
                    }
                    catch (InvalidOperationException)
                    {
                        change = "N/A";
                    }
                    results.Add(new StringBuilder("{industry:\"" + industry.industry + "\",a_mean:" + industry.a_mean + ",employed:" + industry.employed + ",change:\"" + change + "\"}").ToString());
                }                
                int industry_a_mean = (int)a_mean / value.Count;
                string str = new StringBuilder("[{industry:\"national\",a_mean:" + industry_a_mean + ",employed:" + total + ",change:\"" + "\"}," + string.Join<string>(",", results) + "]").ToString();
                //blobManager.SaveJsonResource("career_industries", "careers", "bydolcode/" + dolcode, "industries", str);
            }
            return "";
        } 

        private string PublishForecast()
        {
            string filename = @"c:\csv\forecast.csv";

            int cnt = 0;

            BlobJsonResourceManager blobManager = new BlobJsonResourceManager();

            using (StreamReader sr = new StreamReader(filename))
            {
                string line;
                do
                {
                    line = sr.ReadLine();
                    if (line != null)
                    {
                        if (cnt++ > 0)
                        {
                            List<string> values = ParseCSV(line);
                            string str = new StringBuilder("{current:" + values[3] + ",employed:" + values[4] + ",forecast:" + values[8] + ",replacements:" + values[9] + "}").ToString();
                            if (values[1] == "25-3098")
                            {
                                string temp = "";
                            }
                            //blobManager.SaveJsonResource("career_forecast", "careers", "bydolcode/" + values[1], "forecast", str);
                        }
                    }
                } while (line != null);
            }
            return "";
        }

        class professions 
        {
            public string dolcode { get; set; }
            public List<string> progressionsList = new List<string>();
            public List<string> similarsList = new List<string>();
        }

        private string PublishSimilars()
        {
            string filename = @"c:\csv\similars.csv";
            int cnt = 0;
            string currentDolCode = "";

            List<professions> data = new List<professions>();            
            professions currentProfession = new professions();

            BlobJsonResourceManager blobManager = new BlobJsonResourceManager();

            using (StreamReader sr = new StreamReader(filename))
            {
                string line;
                do
                {
                    line = sr.ReadLine();
                    if (line != null)
                    {
                        if (cnt++ > 0)
                        {
                            List<string> values = ParseCSV(line);
                            string str = new StringBuilder("{dolcode:\"" + values[3] + "\",title:\"" + values[4] + "\",a_mean:" + values[5] + "}").ToString();

                            if (currentDolCode != values[1])
                            {                                
                                if (currentDolCode != "")
                                {
                                    data.Add(currentProfession);
                                }                                
                                currentDolCode = values[1];
                                currentProfession = new professions();
                                currentProfession.dolcode = currentDolCode;

                            }
                            if (values[0] == "progressions")
                            {
                                currentProfession.progressionsList.Add(str);
                            }
                            else
                            {
                                currentProfession.similarsList.Add(str);
                            }
                            if (values[1] == "53-7121" && values[3] == "43-5011")
                            {
                                data.Add(currentProfession);
                            }
                        }
                    }
                } while (line != null);
            }
            foreach (professions profession in data)
            {
                string progressions = new StringBuilder("[" + string.Join<string>(",",profession.progressionsList) + "]").ToString();
                string similars = new StringBuilder("[" + string.Join<string>(",", profession.similarsList) + "]").ToString();
                blobManager.SaveJsonResource("career_progressions", "careers", "bydolcode/" + profession.dolcode, "progressions", progressions);
                blobManager.SaveJsonResource("career_similars", "careers", "bydolcode/" + profession.dolcode, "similars", similars);
            }
            return "";
        }
        class predec
        {
            public string dolcode { get; set; }
            public List<string> predecessors = new List<string>();
        }
        private string PublishPre()
        {
            string filename = @"c:\csv\ct_predecessor.csv";
            int cnt = 0;
            string currentDolCode = "";

            List<predec> data = new List<predec>();
            predec currentProfession = new predec();

            BlobJsonResourceManager blobManager = new BlobJsonResourceManager();

            using (StreamReader sr = new StreamReader(filename))
            {
                string line;
                do
                {
                    line = sr.ReadLine();
                    if (line != null)
                    {
                        if (cnt++ > 0)
                        {
                            List<string> values = ParseCSV(line);
                            string str = new StringBuilder("{dolcode:\"" + values[4] + "\",title:\"" + values[5] + "\",a_mean:" + values[6] + "}").ToString();

                            if (currentDolCode != values[1])
                            {
                                if (currentDolCode != "")
                                {
                                    data.Add(currentProfession);
                                }
                                currentDolCode = values[1];
                                currentProfession = new predec();
                                currentProfession.dolcode = currentDolCode;

                            }
                            currentProfession.predecessors.Add(str);
                           
                            //data.Add(currentProfession);
                            
                        }
                    }
                } while (line != null);
            }
            foreach (predec profession in data)
            {
                string progressions = new StringBuilder("[" + string.Join<string>(",", profession.predecessors) + "]").ToString();
                //string similars = new StringBuilder("[" + string.Join<string>(",", profession.similarsList) + "]").ToString();
                //blobManager.SaveJsonResource("career_predecessors", "careers", "bydolcode/" + profession.dolcode, "predecessors", progressions);
                //blobManager.SaveJsonResource("career_similars", "careers", "bydolcode/" + profession.dolcode, "similars", similars);
            }
            return "";
        }

        private string PublishOccTitles()
        {
            string filename = @"c:\csv\occtitles.csv";

            int cnt = 0;

            BlobJsonResourceManager blobManager = new BlobJsonResourceManager();

            using (StreamReader sr = new StreamReader(filename))
            {
                string line;
                do
                {
                    line = sr.ReadLine();
                    if (line != null)
                    {
                        if (cnt++ > 0)
                        {
                            List<string> values = ParseCSV(line);
                            string str = new StringBuilder("{value:\"" + values[2] + "\"}").ToString();
                            //blobManager.SaveJsonResource("career_occtitle", "careers", "bydolcode/" + values[0], "occtitle", str);
                        }
                    }
                } while (line != null);
            }
            return "";
        }


        private string Publish()
        {
            BlobJsonResourceManager blobManager = new BlobJsonResourceManager();
            //blobManager.SaveJsonResource("career_progressions", "careers", "bydolcode/11-1011", "progressions", "[]");
            //blobManager.SaveJsonResource("career_similars", "careers", "bydolcode/11-1011", "similars", "[]");
            return "";
        }

        private string akatitles()
        {
            string filename = @"c:\csv\akatitles.csv";
            int cnt = 0;
            List<string> cblist = new List<string>();

            List<string> akalist = new List<string>();

            using (StreamReader sr = new StreamReader(filename))
            {
                string line;
                do
                {
                    line = sr.ReadLine();
                    if (line != null)
                    {
                        if (cnt++ > 0)
                        {
                            List<string> values = ParseCSV(line);
                            if (values[0] != "")
                            {
                                cblist.Add(values[0].Trim().ToLower());
                            }
                            if (values.Count > 3)
                            {
                                if (values[3] != "")
                                {
                                    List<string> aka = new List<string>(values[3].Split(',').Select(x => x.Trim().ToLower()).ToList());
                                    akalist.AddRange(aka);
                                }
                            }
                        }
                    }
                } while (line != null);
            }
            using (StreamWriter sw = new StreamWriter(@"c:\csv\temp.txt"))
            {
                foreach (string cbtitle in cblist)
                {
                    if (!akalist.Contains(cbtitle))
                    {
                        sw.WriteLine(cbtitle);
                        Console.Write(cbtitle);
                    }
                }
                
            }
            return "";
        }
        public string ctProfessions()
        {
            string filename = @"c:\csv\ctprofessions.csv";
            int cnt = 0;
            List<string> ctProfessions = new List<string>();

            using (StreamReader sr = new StreamReader(filename))
            {
                string line;
                do
                {
                    line = sr.ReadLine();
                    if (line != null)
                    {
                        if (cnt++ > 0)
                        {
                            List<string> values = ParseCSV(line);
                            ctProfessions.Add(new StringBuilder("{code:\"" + values[0] + "\",title:\"" + values[1] + "\",major:" + values[2] + ",minor:" + values[3] + ",field:" + values[4] + ",minedulevel:" + values[5] + ",training:" + values[6] + ",salary:" + values[7] + ",popularity:" + values[8] + ",attitude:\"" + values[9] + "\",information:\"" + values[10] + "\",processing:\"" + values[11] + "\",action:\"" + values[12] + "\",endurance:\"" + values[13] + "\",presence:\"" + values[14] + "\",concentration:\"" + values[15] + "\",patterns:\"" + values[16] + "\",compensation:\"" + values[17] + "\",beauty:" + values[18] + ",helping:" + values[19] + ",adventure:" + values[20] + ",safety:" + values[21] + ",people:" + values[22] + ",science:" + values[23] + ",duty:" + values[24] + ",admiration:" + values[25] + ",creativity:" + values[26] + ",competition:" + values[27] + ",animals:" + values[28] + ",politics:" + values[29] + ",technology:" + values[30] + ",machinery:" + values[31] + ",gender:\"" + values[32] + "\",salesy:" + values[33] + ",critical:" + values[34] + ",numbers:" + values[35] + ",coordinating:" + values[36] + ",handlabor:" + values[37] + ",strength:" + values[38] + ",drafting:" + values[39] + ",vm:" + values[40] + ",fld:[" + values[41] + "]}").ToString());                        }
                    }
                } while (line != null);
            }
            string result = new StringBuilder("var professions = [" + string.Join(",\n", ctProfessions) + "];").ToString();

            using (StreamWriter sw = new StreamWriter(@"c:\csv\temp.js"))
            {
                sw.WriteLine(result);
            }
            return "";
        }

        private string ctProfessionsRelated()
        {
            //string filename = @"c:\csv\ct_professions.csv"; 
            string filename = @"c:\csv\aka2.csv"; 

            int cnt = 0;
            List<string> ctProfessions = new List<string>();

            using (StreamReader sr = new StreamReader(filename))
            {
                string line;
                do
                {
                    line = sr.ReadLine();
                    if (line != null)
                    {
                        if (cnt++ > 0)
                        {
                            List<string> values = ParseCSV(line);
                            Regex regex = new Regex(@"[^a-zA-Z0-9]+");                            
                            string str = regex.Replace(values[1], "-");
                            List<string> keywords = new List<string>(str.Split('-').ToList());
                            regex = new Regex(@",\s?");
                            str = regex.Replace(values[2], "\",\"");
                            ctProfessions.Add(new StringBuilder("{code:\"" + values[0] + "\",title:\"" + values[1] + "\",keywords:[\"" + string.Join("\",\"", keywords) + "\"],alttitles:[\"" + str + "\"]}").ToString());
                        }
                    }
                } while (line != null);
            }
            string result = new StringBuilder("var professionsinfo = [" + string.Join(",\n", ctProfessions) + "];").ToString();

            using (StreamWriter sw = new StreamWriter(@"c:\csv\keywords.txt"))
            {
                sw.WriteLine(result);
            }
            return "";
        }

        private static List<string> ParseCSV(string line)
        {

            int q = 0;

            StringBuilder sb = new StringBuilder();
            List<string> values = new List<string>();

            foreach (char c in line)
            {
                if (c == '\"')
                {
                    q++;
                }
                if (c == ',' && q % 2 == 0)
                {
                    values.Add(sb.ToString().Replace("\"", ""));
                    sb = new StringBuilder();
                }
                else
                {
                    sb.Append(c);
                }
            }
            values.Add(sb.ToString().Replace("\"", ""));

            return values;
        }

        private string PublishSchools()
        {
            List<SchoolAccount> schoolList = new List<SchoolAccount>();
            SchoolAccountClient sac = new SchoolAccountClient();
            string filename = @"c:\csv\schools2.csv";
            int cnt = 0;
            using (StreamReader sr = new StreamReader(filename))
            {
                string line;
                do
                {
                    line = sr.ReadLine();
                    if (line != null)
                    {
                        if (cnt++ > 0)
                        {
                            List<string> values = ParseCSV(line);
                            if (values[0] != "" && values[0] != null)
                            {
                                string RowKey = Regex.Replace(values[16], @"[^0-9]", "");
                                SchoolAccount account = sac.GetByPartitionAndRowKey("school", RowKey);
                                if (account == null)
                                {
                                    //sac.AddNewItem(new SchoolAccount { SchoolName = values[7], Address = values[8], City = values[9], State = values[10], ZipCode = values[0], PhoneNumber = values[16], RowKey = RowKey });
                                }
                            }
                        }
                    }
                } while (line != null);
            }
            return "";
        }
        private string TestSchool()
        {
            SchoolAccountClient sac = new SchoolAccountClient();
            //sac.AddNewItem(new SchoolAccount { SchoolName = "Test School", Address = "1 Test Drive", City = "Statest Island", State = "NY", ZipCode = "11111", PhoneNumber = "718-333-2222", RowKey = "7183332222" });
            return "";
        }
        private string PublishSchoolsManually()
        {
            SchoolAccountClient sac = new SchoolAccountClient();
            string filename = @"c:\csv\hsupdate2.csv";
            int cnt = 0;
            using (StreamReader sr = new StreamReader(filename))
            {
                string line;
                do
                {
                    line = sr.ReadLine();
                    if (line != null)
                    {
                        if (cnt++ > 0)
                        {
                            List<string> values = ParseCSV(line);
                            if (values[0] != "" && values[0] != null)
                            {
                                string RowKey = Regex.Replace(values[5], @"[^0-9]", "");
                                SchoolAccount account = sac.GetByPartitionAndRowKey("school", RowKey);
                                if (account == null)
                                {
                                    //sac.AddNewItem(new SchoolAccount { SchoolName = values[0], Address = values[1], City = values[2], State = values[3], ZipCode = values[4], PhoneNumber = values[5], RowKey = RowKey });
                                }
                            }
                        }
                    }
                } while (line != null);
            }
            return "";
        }

        // delete or clear or update table storage =========================================================================================================================================================
        private void CreateSUAccount()
        {
            UserAccountClient uac = new UserAccountClient();
            uac.AddNewItem(new UserAccount { PartitionKey = UserAccountClient.GetPartitionKeyForEmail("mike@peopli.com"), RowKey = "mike@peopli.com", Email = "mike@peopli.com", FirstName = "Mike", LastName = "Mesh", Password = "Superuser1", EmailConfirmed = true, ProfileType = "su" });
        }
        
        private void deleteTestInfo()
        {
            string[] emails = { "sfelker16@hotmail.com", "nheymer@marist.org" };
            //string[] schools = { "7183332222", "9175555555" };
            //string schoolresetadmin = "7187587200";
            UserAccountClient uac = new UserAccountClient();
            AdminAccountClient aac = new AdminAccountClient();
            StudentAccountClient sac = new StudentAccountClient();
            SchoolAccountClient schoolac = new SchoolAccountClient();
            CounselorAccountClient cac = new CounselorAccountClient();
            AccessCodeClient acc = new AccessCodeClient();
            foreach (string email in emails)
            {
                AdminAccount admin = aac.GetByPartitionAndRowKey("admin", email.ToLower());
                if (admin != null)
                {
                    List<AccessCode> groups = new List<AccessCode>(acc.GetAllByCounselor(email.ToLower()));
                    if (groups.Count != 0)
                    {
                        foreach (AccessCode group in groups)
                        {
                            acc.Delete(group);
                        }
                    }
                    if (!string.IsNullOrEmpty(admin.School)) {
                        SchoolAccount school = schoolac.GetByPartitionAndRowKey("school", admin.School);
                        if (school != null)
                        {
                            school.Admin = "";
                            schoolac.Update(school);
                        }
                    }
                    aac.Delete(admin);
                }
                CounselorAccount counselor = cac.GetByPartitionAndRowKey("counselor", email);
                if (counselor != null)
                {
                    List<AccessCode> groups = new List<AccessCode>(acc.GetAllByCounselor(email.ToLower()));
                    if (groups.Count != 0)
                    {
                        foreach (AccessCode group in groups)
                        {
                            acc.Delete(group);
                        }
                    }
                    cac.Delete(counselor); 
                }
                StudentAccount student = sac.GetByPartitionAndRowKey(StudentAccountClient.GetPartitionKeyForEmail(email), email);
                if (student != null)
                {
                    sac.Delete(student);
                }

                UserAccount user = uac.GetByPartitionAndRowKey(UserAccountClient.GetPartitionKeyForEmail(email), email);
                if (user != null)
                {
                    uac.Delete(user);
                }
            }
            //SchoolAccount schoolAccount = schoolac.GetByPartitionAndRowKey("school", schoolresetadmin);
            //if (schoolAccount != null)
            //{
            //    schoolAccount.Admin = "";
            //    schoolac.Update(schoolAccount);
            //}
            //foreach (string str in schools)
            //{
            //    schoolAccount = schoolac.GetByPartitionAndRowKey("school", str);
            //    if (schoolAccount != null)
            //    {
            //        schoolac.Delete(schoolAccount);
            //    }
            //}
        }
      
        private void DemoSchoolV2()
        {
            string schoolPhone = "7181234567";
            string demoAdminEmail = "ed.rooney@careerthesaurus.com";

            string counselorEmail = "minerva.mcgonagall@careerthesaurus.com";


            SchoolAccountClient sac = new SchoolAccountClient();
            SchoolAccount school = sac.GetByPartitionAndRowKey("school", schoolPhone);
            if (school != null)
            {
                school.Admin = demoAdminEmail;
                sac.Update(school);
            }
            AdminAccountClient aac = new AdminAccountClient();
            aac.AddNewItem(new AdminAccount { RowKey = demoAdminEmail, PhoneNumber = "718-111-5555", PhoneExtension = "123", School = schoolPhone, ConnectionToSchoolConfirmed = true, SchoolSelected = true });

            UserAccountClient uac = new UserAccountClient();
            uac.AddNewItem(new UserAccount { PartitionKey = UserAccountClient.GetPartitionKeyForEmail(counselorEmail), RowKey = counselorEmail, Email = counselorEmail, EmailConfirmed = true, FirstName = "Minerva", LastName = "McGonagall", Password = "DemoPass1", ProfileType = "counselor" });

            CounselorAccountClient cac = new CounselorAccountClient();
            cac.AddNewItem(new CounselorAccount { RowKey = counselorEmail, Active = true, PhoneNumber = "718-222-5555", PhoneExtension = "234", School = schoolPhone });

            AccessCodeClient acc = new AccessCodeClient();
            acc.AddNewItem(new AccessCode { RowKey = ShortGuidGenerator.NewGuid(), Code = PinCodeGenerator.NewPin(), Year = "2015", Grade = "12", Counselor = counselorEmail, GroupName = "Demo Group", School = schoolPhone });
        }
        private void DemoSctudents() 
        {
            string[] dimensions = { "attitude", "endurance", "action", "concentration", "information", "processing", "presence", "patterns", "compensation" };
            string schoolPhone = "7181234567";
            string demoAdminEmail = "ed.rooney@careerthesaurus.com";
            string counselorEmail = "minerva.mcgonagall@careerthesaurus.com";
            string group = "Demo Group";
            string password = "DemoStudent1";
            string year = "2015";
            string grade = "12"; 

            UserAccountClient uac = new UserAccountClient();

            StudentAccountClient sac = new StudentAccountClient();
            AssessmentCareerClient acc = new AssessmentCareerClient();
            AssessmentDimensionClient adc = new AssessmentDimensionClient();
            AssessmentInterestClient aic = new AssessmentInterestClient();

            string filename = @"c:\csv\demostudents.csv";
            int cnt = 0;
            using (StreamReader sr = new StreamReader(filename))
            {
                string line;
                do
                {
                    line = sr.ReadLine();
                    if (line != null)
                    {
                        if (cnt++ > 0)
                        {
                            List<string> values = ParseCSV(line);
                            string email = values[0].ToLower() + "." + values[1].ToLower() + "@careerthesaurus.com";
                            string gender = values[2];

                            sac.AddNewItem(new StudentAccount { PartitionKey = StudentAccountClient.GetPartitionKeyForEmail(email), RowKey = email, Gender = gender, Active = true, AssessmentComplete = true, Counselor = counselorEmail, Grade = grade, School = schoolPhone, GroupName = group, Year = year });

                            // dimensions
                            for (int i = 0; i < dimensions.Length; i++)
                            {
                                adc.AddNewItem(new AssessmentDimension { PartitionKey = schoolPhone, RowKey = email + year + grade + dimensions[i], Dimension = dimensions[i], Counselor = counselorEmail, Gender = (gender == "male"), Grade = grade, GroupName = group, Student = email, Year = year, Value = values[i + 3] });
                            }
                            // 3 interests
                            aic.AddNewItem(new AssessmentInterest { PartitionKey = schoolPhone, RowKey = email + year + grade + values[12], Interest = values[12], Counselor = counselorEmail, Gender = (gender == "male"), Grade = grade, GroupName = group, Student = email, Year = year, Value = "1" });
                            aic.AddNewItem(new AssessmentInterest { PartitionKey = schoolPhone, RowKey = email + year + grade + values[13], Interest = values[13], Counselor = counselorEmail, Gender = (gender == "male"), Grade = grade, GroupName = group, Student = email, Year = year, Value = "1" });
                            aic.AddNewItem(new AssessmentInterest { PartitionKey = schoolPhone, RowKey = email + year + grade + values[14], Interest = values[14], Counselor = counselorEmail, Gender = (gender == "male"), Grade = grade, GroupName = group, Student = email, Year = year, Value = "1" });
                            // 5 careers - like
                            for (int i = 0; i < 5; i++)
                            {
                                string dolcode = values[15 + i];
                                acc.AddNewItem(new AssessmentCareer { PartitionKey = schoolPhone, RowKey = email + year + grade + dolcode, DolCode = dolcode, Counselor = counselorEmail, Gender = (gender == "male"), Grade = grade, GroupName = group, Student = email, Year = year, Value = "1" });
                            }
                            // 5 careers - dont like
                            for (int i = 0; i < 5; i++)
                            {
                                string dolcode = values[20 + i];
                                acc.AddNewItem(new AssessmentCareer { PartitionKey = schoolPhone, RowKey = email + year + grade + dolcode, DolCode = dolcode, Counselor = counselorEmail, Gender = (gender == "male"), Grade = grade, GroupName = group, Student = email, Year = year, Value = "0" });
                            }
                        }
                    }
                } while (line != null);
            }
        }
        
        private string CareerImages()
        {

            string filename = @"c:\csv\aka2.csv"; //values[0] - dolcode, values[1] - title, values[2] - aka
            int cnt = 0;

            PictureManager pm = new PictureManager();

            using (StreamReader sr = new StreamReader(filename))
            {
                string line;
                do
                {
                    line = sr.ReadLine();
                    if (line != null)
                    {
                        //DO SOMETHING
                        if (cnt++ > 0)
                        {
                            List<string> values = ParseCSV(line);
                            bool publish = false;
                            string file = @"c:\careerimages\" + values[0] + ".jpg";

                            if (System.IO.File.Exists(file))
                            {
                                publish = true;

                                WebImage image = new WebImage(file);
                                //pm.UploadRawImage(image, "image", "careerimages", values[0]);
                                pm.UploadPictureToBlobStorage(image, "image", "careerimages", values[0], 700, 394, 0, 0, false, false);
                                //pm.UploadRawImage(image, "image.jpg", "careerimages", values[0]);
                            }

                        }
                    }
                } while (line != null);
            }
            return "";
        }

        private string bachelormajors()
        {
            string filename = @"c:\csv\bachelormajors.csv";

            int cnt = 0;
            List<string> ctProfessions = new List<string>();

            using (StreamReader sr = new StreamReader(filename))
            {
                string line;
                do
                {
                    line = sr.ReadLine();
                    if (line != null)
                    {
                        if (cnt++ > 0)
                        {
                            List<string> values = ParseCSV(line);

                            ctProfessions.Add(new StringBuilder("{code:" + values[1] + ",title:\"" + values[2] + "\"}").ToString());
                        }
                    }
                } while (line != null);
            }
            string result = new StringBuilder("var bachelorMajors = [" + string.Join(",\n", ctProfessions) + "];").ToString();

            using (StreamWriter sw = new StreamWriter(@"c:\csv\bachelormajors.js"))
            {
                sw.WriteLine(result);
            }
            return "";
        }
        private string careermajorsmapping()
        {
            string filename = @"c:\csv\careermajorsmapping.csv";

            int cnt = 0;
            List<string> ctProfessions = new List<string>();

            using (StreamReader sr = new StreamReader(filename))
            {
                string line;
                do
                {
                    line = sr.ReadLine();
                    if (line != null)
                    {
                        if (cnt++ > 0)
                        {
                            List<string> values = ParseCSV(line);

                            ctProfessions.Add(new StringBuilder("{code:\"" + values[0] + "\",majors:[" + values[2] + "]}").ToString());
                        }
                    }
                } while (line != null);
            }
            string result = new StringBuilder("var eduMajors = [" + string.Join(",\n", ctProfessions) + "];").ToString();

            using (StreamWriter sw = new StreamWriter(@"c:\csv\careermajorsmapping.js"))
            {
                sw.WriteLine(result);
            }
            return "";
        }

        private void updateResult() {
            StudentAccountClient sac = new StudentAccountClient();
            AssessmentCareerClient acc = new AssessmentCareerClient();
            AssessmentDimensionClient adc = new AssessmentDimensionClient();
            AssessmentInterestClient aic = new AssessmentInterestClient();
            List<StudentAccount> students = new List<StudentAccount>(sac.GetAll());
            foreach (StudentAccount student in students)
            {
                List<AssessmentCareer> careers = new List<AssessmentCareer>(acc.GetAllCurrentByStudent(student.School, student.RowKey, student.Year, student.Grade));
                List<AssessmentDimension> dimensions = new List<AssessmentDimension>(adc.GetAllCurrentByStudent(student.School, student.RowKey, student.Year, student.Grade));
                List<AssessmentInterest> interests = new List<AssessmentInterest>(aic.GetAllCurrentByStudent(student.School, student.RowKey, student.Year, student.Grade));
                student.RatedCareers = careers.Where(x=>x.Value =="1").Count();
                student.DislikeCareers = careers.Where(x => x.Value == "0").Count();
                student.RatedDimensions = dimensions.Count < 10 ? dimensions.Count : 9;
                if (dimensions.Count > 9)
                {
                    string a = "";
                }
                student.RatedInterests = interests.Where(x => x.Value == "1").Count();
                sac.Update(student);
            }
        }
        public void deleteAcoounts()
        {
            string[] emails = { "ron.canada@sendgrid.com", "mnorwoo2@schools.nyc.gov" };
            StudentAccountClient sac = new StudentAccountClient();
            AdminAccountClient aac = new AdminAccountClient();
            UserAccountClient uac = new UserAccountClient();
            foreach (string email in emails) {
                AdminAccount admin = aac.GetByPartitionAndRowKey("admin", email);
                UserAccount user = uac.GetByPartitionAndRowKey(UserAccountClient.GetPartitionKeyForEmail(email), email);
                if (admin != null)
                {
                    aac.Delete(admin);
                }
                if (user != null)
                {
                    uac.Delete(user);
                }
            }
        }
        private void resendEmails()
        {
            string[] emails = { "sharez_2@yahoo.com", "lauren@sledsbr.org", "genevieve.carr@sledsbr.org", "halley.perry@sledsbr.org", "j.p.putman@sledsbr.org", "katelyn.kerr@sledsbr.org", 
                                "dinojbarujel@gmail.com", "asencio5@yahoo.com", "bunny1365@gail.com", "kjaeskender@gmail.com", "ahamed.arif@sitechhs.com", "aishaoloyede@gmail.com", "alfred.ioffe@sithhs.com", 
                                "alinathegymnast@gmail.com", "therealmsfelton@gmail.com", "aswagie@verizon.net", "amanda41799@yahoo.com", "mandarox222@yahoo.com", "siths123456789@gmail.com", 
                                "anna.m.frenkel@gmail.com", "anton.lagochniak@sitechhs.org", "ari.ayzidor@sitechhs.com", "brenden.barclay@sitechhs.com", "caila.marashaj@sitechhs.com", 
                                "ceclina.cao@sitechhs.com", "farleyciaran@yahoo.com", "davidroyspielman@sitechhs.com", "derek.wong@sitechhs.com", "donnamigs@aol.icom", "emma.shen@sitechhs.com", 
                                "evantbrewi@gmail.com", "evan.brewi@sitechhs.com", "lui.evan@hotmail.com", "capetee@msn.com", "fion.lin@sitechhs.com", "garysaharov@hotmail.com", "strikerz9@yahoo.com", 
                                "gregory.shnitkind@aol.com", "harris.syed@sitechhs.com", "harristherockstar@gmail.com", "harvey.cheung1997@gmail.com", "isabellakwasnik@gmail.com", "jbat2838@gmail.com", 
                                "jbatson64@gmail.com", "jaeshon@live.com", "jessicawalsh97@yahoo.com", "jim123my27@yahoo.com", "jingo123@yahoo.com", "justin_boy12@hotmail.com", "kiamaster12345@gmail.com", 
                                "kstremmy@verizon.net", "xmd1412@gmail.com", "msbonoan@yahoo.com", "marina.andrawis@sitechhs.com", "martin.r.hsu@gmail.com", "queco@mac.com", "jacobsonmh@yahoo.com", 
                                "wilhelmsen2@aol.com", "merrick.eng@sitechhs.com", "mjdzielski2@gmail.com", "niklombino@gmail.com", "pheleznov19@gmail.com", "razuzin@gmail.com", "rabia.osman47@gmail.com", 
                                "rayanli2000@hotmail.com", "rnicosia@hotmail.com", "ahtnamas717@aol.com", "sarahrim1221@gmail.com", "shay.rw17@gmail.com", "chen.sheryl@yahoo.com", 
                                "tharushierera@sitechhs.com", "tbone1198@aol.com", "tstremmy2@verizon.net", "tiffany.thai@siitechhs.com", "tiffanycong17@gmail.com", "tjthegreat8@gmail.com", 
                                "shtanko97@gmail.com", "xi.lin@sitedhhs.com", "zane.gutch@sitechhs.com", "darraniquetaylor@mail.tmcc.edu", "gregory_payne@tmcc.edu", "imani_akala@mail.tmcc.edu", 
                                "kamrynn_dewees@tmcc.mail.edu", "karla_zelaya@mail.tmcc.edu", "brownlauren42@gmail.com", "molly_schuhmac@mail.tmcc.edu", "ritaballuff@gmail.com", "bernis1125@hotmail.com", 
                                "mengting64@hotmail.com", "rusnakstephanie@gmail.com", "ash@careerthesaurus.com", "mike.mesheriakov@gmail.com", "tom.jerry@test.com", "brandonmartin@bvcs.org", 
                                "brandonward@bvcs.org", "caitlynwherry@bvcs.org", "clairewray@bvcs.org", "clarissadagostino@bvcs.org", "colemanbowman@bvcs.org", "dyl112888@gmail.com", 
                                "jonahsale@bvcs.org", "joshuaparker@bvcs.org", "joshuagentry@bvcs.org", "kylewatson@bvcs.org", "madelynncannon@bvcs.org", "sierrahamblin@bvcs.org", 
                                "stephaniemcclure@bvcs.org", "alexi.va4345@vusd.us", "linnz@west-branch.k12.ia.us" };


            UserAccountClient uac = new UserAccountClient();
            foreach (string email in emails)
            {
                UserAccount account = uac.GetByPartitionAndRowKey(UserAccountClient.GetPartitionKeyForEmail(email), email);
                SimpleAES aes = new SimpleAES();
                string token = aes.EncryptToString(email.ToLower());
                string url = "http://CareerThesaurus.com/Account/ConfirmEmail/" + token;
                EmailManager emailManager = new EmailManager();
                EmailTemplateHelper eth = new EmailTemplateHelper();
                string body = eth.GetTemplate("confirmemail");
                body = body.Replace("{{name}}", account.FirstName);
                body = body.Replace("{{url}}", url);
                emailManager.SendMail("no-reply@careerthesaurus.com", "CareerThesaurus", email, "Account Notification - Confirm Email", body);
            }
        }
        private void deletetestemails()
        {
            string[] emails = { "test@test.com", "sveta@aaa.com", "olgasales@gmail.com", "olga@peopli.com" };
            AddresseeClient ac = new AddresseeClient();
            foreach (string email in emails)
            {
                Addressee addresse = ac.GetByPartitionAndRowKey(AddresseeClient.GetPartitionKeyForEmail(email), email);
                if (addresse != null)
                {
                    ac.Delete(addresse);
                }
            } 
        }
        public void resetblogtable()
        {
            BlogPostClient bpc = new BlogPostClient();
            BlogCategoryClient bcc = new BlogCategoryClient();
            BlogTagClient btc = new BlogTagClient();
            bpc.DeleteTable();
            bcc.DeleteTable();
            btc.DeleteTable();
        }
        private void fixtags() 
        {
            BlogPostClient bpc = new BlogPostClient();
            BlogTagClient btc = new BlogTagClient();
            List<BlogPost> posts = new List<BlogPost>(bpc.GetAll());
            //List<BlogTag> tags = new List<BlogTag>(btc.GetAll());
            //btc.DeleteTable();
            foreach (BlogPost post in posts)
            {
                if (post.ArticleDescription == null) {
                    post.ArticleDescription = "";
                }
                post.Tags = post.Tags.ToLower();
                List<string> tagsList = post.Tags.Split(',').ToList();
                List<BlogTag> blogTags = new List<BlogTag>();
                foreach (string tag in tagsList)
                {
                    BlogTag blogTag = btc.GetByPartitionAndRowKey("blogTag", tag);
                    if (blogTag != null)
                    {
                        blogTag.TotalPosts++;
                        if (!post.Removed)
                        {
                            blogTag.PublicPosts++;
                        }
                        btc.Update(blogTag);
                    }
                    else
                    {
                        int pub = post.Removed ? 0 : 1;
                        btc.AddNewItem(new BlogTag { RowKey = tag, Tag = tag.Replace("-", " "), TotalPosts = 1, PublicPosts = pub });
                    }
                }
                bpc.Update(post);
            }
        }
        public ActionResult userprofiles(string pk)
        {
            //UserProfileClient upc = new UserProfileClient();
            //List<UserProfile> profiles = new List<UserProfile>(upc.GetAllByPartition(pk));
            if (string.IsNullOrEmpty(pk))
            {
                return null;
            }
            ViewBag.pk = pk;
            Response.ContentType = "application/vnd.ms-excel";
            Response.AppendHeader("content-disposition", "attachment; filename=Skillcow_Leads_Export_" + pk + ".csv");

            Response.AddHeader("Cache-Control", "must-revalidate");
            Response.AddHeader("Pragma", "must-revalidate");

            return View();
        }
        public ActionResult EmailList()
        {
            return View();
        }
        public ActionResult EmailCampaign()
        {
            return View();
        }
        [HttpPost]
        [ValidateInput(false)]
        public JsonResult SendEmail(EmailCampaign campaign)
        {
            JavaScriptSerializer jss = new JavaScriptSerializer();
            string modelJson = jss.Serialize(campaign);
            MessageBroker mb = new MessageBroker();
            string[] pkOptions = { "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9" };
            foreach (string pk in pkOptions)
            {
                (new DeferredEmailCampaign { PartitionKey = pk, modelJson = modelJson }).Run(mb);
            }
            return new JsonResult { Data = new { data = new { result = "ok" } } };
        }
        [HttpPost]
        [ValidateInput(false)]
        public JsonResult SendTest(EmailCampaign campaign)
        {
            MessageBroker mb = new MessageBroker();
            (new DeferredEmailSender { FromDisplay = campaign.FromDiplay, FromEmail = campaign.FromEmail, Body = campaign.Body, Subject = campaign.Subject, To = "mike@peopli.com" }).Execute(mb);
            return new JsonResult { Data = new { data = new { result = "ok" } } };
        }
        public JsonResult getEmailList2(PersonalityModel model)
        {
            Stopwatch stopWatch = new Stopwatch();
            stopWatch.Start();


            JavaScriptSerializer jss = new JavaScriptSerializer();
            string modelJson = jss.Serialize(model);
            MessageBroker mb = new MessageBroker();
            string[] pkOptions = { "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9" };
            foreach (string pk in pkOptions)
            {

                (new DeferredEmailCampaign { PartitionKey = pk, modelJson = modelJson }).Run(mb);
            }

            stopWatch.Stop();
            TimeSpan ts = stopWatch.Elapsed;
            string elapsedTime = String.Format("{0:00}:{1:00}:{2:00}.{3:00}", ts.Hours, ts.Minutes, ts.Seconds, ts.Milliseconds / 10);
            (new DeferredEmailSender { FromDisplay = "Test", FromEmail = "test@test.com", Body = "Time spend creating partinion requests: " + elapsedTime, Subject = "done", To = "andrey.zalomskiy@gmail.com" }).Execute(mb);

            return new JsonResult { Data = new { data = elapsedTime } };
        }

        public JsonResult getEmailList(PersonalityModel model)
        {
            Stopwatch stopWatch = new Stopwatch();
            stopWatch.Start();
            MessageBroker mb = new MessageBroker();
            UserProfileClient upc = new UserProfileClient();
            //List<string> domains = new List<string>();
            //List<KeyValuePair<string, int>> ouput = new List<KeyValuePair<string, int>>();
            List<UserProfile> result = new List<UserProfile>();
            //List<UserProfile> result2 = new List<UserProfile>();
            //string[] pkOptions = { "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9" };
            string[] pkOptions = { "a" };
            //string[] pkOptions = { "1" };

            foreach (string pk in pkOptions)
            {
                List<UserProfile> profiles = new List<UserProfile>(upc.GetAllByPartition(pk));
                List<UserProfile> filtered = new List<UserProfile>(profiles.Where(x => !string.IsNullOrEmpty(x.Email) && IsValidEmail(x.Email) && model.GetType().GetProperties().All(y => (y.GetValue(model, null) == null || (x.GetType().GetProperty(y.Name).GetValue(x, null) != null && y.GetValue(model, null).ToString() == x.GetType().GetProperty(y.Name).GetValue(x, null).ToString())))));
                foreach (UserProfile user in filtered)
                {
                    //mb.SendDeferredProcessAsMessage((new DeferredEmailSender { FromDisplay = "Test", FromEmail = "test@test.com", Body = "test body", Subject = "test", To = user.Email }), "");
                    (new DeferredEmailSender { FromDisplay = "Test", FromEmail = "test@test.com", Body = "test body", Subject = "test subject", To = user.Email }).Run(mb);
                }
                result.AddRange(filtered);
                //result.AddRange(profiles.Where(x => model.GetType().GetProperties().All(y => (y.GetValue(model, null) == null || (x.GetType().GetProperty(y.Name).GetValue(x, null) != null && y.GetValue(model, null).ToString() == x.GetType().GetProperty(y.Name).GetValue(x, null).ToString())))));
                //result2.AddRange(profiles.Where(x => !x.Unsubscribed));
                //domains.AddRange(profiles.Where(x => x.Email.Contains('@')).Select(x => x.Email.ToLower().Substring(x.Email.IndexOf('@') + 1)));
            }
            //var grouped = domains.GroupBy(x => x);
            //foreach (var item in grouped)
            //{
            //    ouput.Add(new KeyValuePair<string, int>(item.Key, item.Count()));
            //}
            stopWatch.Stop();
            TimeSpan ts = stopWatch.Elapsed;
            string elapsedTime = String.Format("{0:00}:{1:00}:{2:00}.{3:00}", ts.Hours, ts.Minutes, ts.Seconds, ts.Milliseconds / 10);
            //mb.SendDeferredProcessAsMessage((new DeferredEmailSender { FromDisplay = "Test", FromEmail = "test@test.com", Body = "Records processed: " + result.Count + " Time spend: " + elapsedTime, Subject = "done", To = "andrey.zalomskiy@gmail.com" }), "");
            (new DeferredEmailSender { FromDisplay = "Test", FromEmail = "test@test.com", Body = "Records processed: " + result.Count + " Time spend: " + elapsedTime, Subject = "done", To = "andrey.zalomskiy@gmail.com" }).Run(mb);
            return new JsonResult { Data = new { data = elapsedTime } };
            //return new JsonResult { Data = new { data = result.Select(x => x.Email) } };
        }
        private bool IsValidEmail(string str)
        {
            return Regex.IsMatch(str, @"^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$");
        }
    }
}
