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
using Newtonsoft.Json.Linq;
using SkillCow.Classes;
using SkillCow.Classes.Cloud.TableStorage.DirectClients.Schools;
using SkillCow.Classes.Cloud.TableStorage.DirectClients.LeadCounters;
using System.Reflection;
using SkillCow.Classes.CookieData;
using SkillCow.Classes.Email;
using SkillCow.Classes.Cloud.TableStorage.DirectClients.Employers;

namespace SkillCow.Controllers
{
    public class KioskSubmissionController : ControllerBase
    {
        [HttpPost]
        public ActionResult SchoolLead(FormCollection collection)
        {
            try
            {
                Response.ContentType = "application/json";

                //generate random ip address
                string ipaddress = RandomHelper.Instance.Next(1, 256) + "." + RandomHelper.Instance.Next(0, 256) + "." + RandomHelper.Instance.Next(0, 256) + "." + RandomHelper.Instance.Next(1, 256);

                string campaignid = "13574635";

                string besttime = FormValue(collection, "besttime", "Anytime");
                string rateposition = FormValue(collection, "rate_position", "10");
                string leadid = FormValue(collection, "leadid", "");

                string clientid = FormValue(collection, "client_id", "");
                string formid = FormValue(collection, "form_id", "");

                string clienttype = clientid.StartsWith("SC") ? "Direct" : "Network";

                string campuskey = FormValue(collection, "campus_key", "");
                string programkey = FormValue(collection, "correct_program_key","");

                string program = FormValue(collection, "program", "");
                if (program == null || program == "" || program == "undefined")
                {
                    program = "0";
                }

                string salutation = FormValue(collection, "salutation", "").Trim().ToProperCase();
                string gender = salutation.ToLower() == "mr" ? "M" : "F";
                string firstname = FormValue(collection, "firstname", "GET THIS").ToProperCase();
                string lastname = FormValue(collection, "lastname", "GET THIS").ToProperCase();

                string email = FormValue(collection, "email", "GET THIS").Trim().ToLower();
                string zip = FormValue(collection, "zip", "GET THIS");
                string phone = FormValue(collection, "phone", "GET THIS").Replace(".", "").Replace(" ", "").Replace("-", "").Replace("(", "").Replace(")", "");
                string address1 = FormValue(collection, "address1", "GET THIS");
                string city = FormValue(collection, "city", "").ToProperCase();
                string state = FormValue(collection, "state", "");

                string educationlevel = FormValue(collection, "education_level", "SC");
                string military = FormValue(collection, "military", "None");
                string gradyear = FormValue(collection, "gradyear", (DateTime.Now.Year-2).ToString());
                
                string dobyear = FormValue(collection, "dobyear", "");
                string gpa = FormValue(collection, "gpa", "");
                
                Random rnd = new Random(DateTime.Now.Millisecond);
                int dobmonth = rnd.Next(1, 13);
                int dobday = rnd.Next(1, 29);

                string schoolvariables = "";
                if (Request.Cookies["schoolvariables"] != null)
                {
                    schoolvariables = HttpUtility.UrlDecode(Request.Cookies["schoolvariables"].Value);
                }

                //GA variable
                string utmsource = FromCookie("utm_source"),
                    utmcampaign = FromCookie("utm_campaign"),
                    utmcontent = FromCookie("utm_content"),
                    utmterm = FromCookie("utm_term");
                
                String strPost = "campaign_id=" + campaignid +
                "&id=1727" +
                "&ip=" + ipaddress +
                "&client_id=" + clientid +
                "&form_id=" + formid +
                "&campus_key=" + campuskey +
                (programkey != "" ? "&program_key=" + programkey : "") +
                (program != "" ? "&program=" + program : "") +
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
                (military != "" ? "&military=" + military : "") +
                (gradyear != "" ? "&gradyear=" + gradyear : "") +
                (dobyear != "" ? "&dobyear=" + dobyear : "") +
                (dobmonth != 0 ? "&dobmonth=" + dobmonth.ToString() : "") +
                (dobday != 0 ? "&dobday=" + dobday.ToString() : "") + 
                "&besttime=" + besttime +
                "&rate_position=" + rateposition +
                "&leadid=" + leadid;

                strPost = strPost.Replace("=undefined", "=");

                string testresults = "";
                

                StringBuilder sbtestresults = new StringBuilder();
                if (Request.Cookies["testresults"] != null)
                {
                    testresults = CookieDecoder.DecodeCookieCharacters(Request.Cookies["testresults"].Value);
                }
                
                
                
                string recommendations = "";
                if (Request.Cookies["recommendations"] != null)
                {
                    recommendations = CookieDecoder.DecodeCookieCharacters(Request.Cookies["recommendations"].Value);
                }

                string careerChoicesJson = GetCareerChoicesJson();
                string data = "{\"careerchoices\":" + careerChoicesJson + "}";

                
                string submissionResult = "";
                if (clienttype == "Network")
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

                    //SUBMIT THE LEAD!
                    submissionResult = SubmitSchoolLead(strPost);

                    if (clientid == "5469")
                    {
                        Telephony t = new Telephony();
                        t.SendSMS("+19174340659", "Avon Lead: " + firstname + " " + lastname + " by " + utmcontent);
                        t.SendSMS("+19179578770", "Avon Lead: " + firstname + " " + lastname + " by " + utmcontent);
                    }
                }
                else
                {
                    string clientrowkey = FormValue(collection, "client_rowkey", "");
                    string programrowkey = FormValue(collection, "program_rowkey", "");

                    DirectSchoolClientCampusProgramClient programclient = new DirectSchoolClientCampusProgramClient();
                    DirectSchoolClientCampusProgram schoolprogram = programclient.GetByRowKey(programrowkey);

                    DirectSchoolClientLeadClient directleadclient = new DirectSchoolClientLeadClient();

                    DirectSchoolClientLead lead = new DirectSchoolClientLead
                        {
                            PartitionKey = clientrowkey,
                            ClientId = clientid,
                            CampusId = campuskey,
                            ProgramId = programkey,
                            ProgramName = schoolprogram.Name,

                            Salutation = salutation,
                            Gender = gender,
                            FirstName = firstname,
                            LastName = lastname,

                            Address = address1,
                            City = city,
                            State = state,
                            Zip = zip,
                            Phone = phone,
                            Email = email,
                            GradYear = gradyear,
                            Military = military,
                            EducationLevel = educationlevel,
                            GPA = gpa,
                            Status = "New"
                        };

                    try
                    {
                        DirectSchoolClientClient schoolclient = new DirectSchoolClientClient();
                        DirectSchoolClient school = schoolclient.GetByRowKey(clientrowkey);
                        if (school.DeliveryMethod.Contains("Email") && school.DeliveryFrequency == "RT")
                        {
                            SubmitSchoolLeadByEmail(
                                ref lead, 
                                school, 
                                CookieDataTestResults.BulletListForEmail(Request), 
                                CookieDataImportantThings.BulletListForEmail(Request));
                        }

                        if (school.DeliveryMethod.Contains("AutoPost") && school.DeliveryFrequency == "RT")
                        {
                            SubmitSchoolLeadByAutoPost(ref lead, school);
                        }

                        directleadclient.AddNewItem(lead);
                        submissionResult = "ok";
                    }
                    catch(Exception ex)
                    {
                        submissionResult = ex.Message;
                    }



#warning DO THIS IN DEFERRED MODE!!!!!!!!

                    //Update lead counter
                    List<DirectSchoolClientLead> allclientleads = new List<DirectSchoolClientLead>(directleadclient.GetAllByPartition(clientrowkey));

                    LeadCounterClient leadcounterclient = new LeadCounterClient();
                    LeadCounter schoolleadcounter = leadcounterclient.GetByRowKey(clientrowkey);
                    schoolleadcounter.Total = allclientleads.Count();
                    schoolleadcounter.Annually = allclientleads.Where(x => x.Timestamp.Year == DateTime.UtcNow.Year).Count();
                    schoolleadcounter.Monthly = allclientleads.Where(x => x.Timestamp.Year.ToString() + x.Timestamp.Month.ToString() == DateTime.UtcNow.Year.ToString() + DateTime.UtcNow.Month.ToString()).Count();
                    //schoolleadcounter.Weekly = allclientleads.Count();
                    //schoolleadcounter.Daily = allclientleads.Count();
                    leadcounterclient.Update(schoolleadcounter);

                    List<DirectSchoolClientLead> thisprogramleads = new List<DirectSchoolClientLead>(allclientleads.Where(x=>x.ProgramId==programkey));
                    LeadCounter programleadcounter = leadcounterclient.GetByRowKey(programrowkey);
                    programleadcounter.Total = thisprogramleads.Count();
                    programleadcounter.Annually = thisprogramleads.Where(x => x.Timestamp.Year == DateTime.UtcNow.Year).Count();
                    programleadcounter.Monthly = thisprogramleads.Where(x => x.Timestamp.Year.ToString() + x.Timestamp.Month.ToString() == DateTime.UtcNow.Year.ToString() + DateTime.UtcNow.Month.ToString()).Count();
                    //programleadcounter.Weekly = thisprogramleads.Count();
                    //programleadcounter.Daily = thisprogramleads.Count();
                    leadcounterclient.Update(programleadcounter);
                    

                }

                SkillCowRequestSubmissionClient rsc = new SkillCowRequestSubmissionClient();

                rsc.AddNewItem(new SkillCowRequestSubmission
                {
                    Salutation = salutation,
                    Name = (firstname + " " + lastname).Trim(),
                    Zip = zip,
                    Email = email,
                    Address1 = address1,
                    City = city,
                    State = state,
                    Phone = phone,
                    IP = ipaddress,
                    Mode = "kiosk",
                    CampaignId = campaignid,
                    TestResults = testresults,
                    SourceForm = "schoolform",
                    GradYear = gradyear,
                    EduIntent = "YES",
                    Recommendations = recommendations,
                    ClientId = clientid,
                    FormId = formid,
                    CampusKey = campuskey,
                    ProgramKey = programkey,
                    Gender = gender,
                    SubmissionResult = submissionResult,
                    Data = data,
                    UtmSource = utmsource,
                    UtmCampaign = utmcampaign,
                    UtmContent = utmcontent,
                    UtmTerm = utmterm,
                    PostedString = strPost,
                    ClientType = clienttype
                });

                AddresseeClient adc = new AddresseeClient();
                string emailpartition = AddresseeClient.GetPartitionKeyForEmail(email);
                Addressee a = adc.GetByPartitionAndRowKey(emailpartition, email);
                if (a == null)
                {
                    adc.AddNewItem(new Addressee(email.ToLower()) { Name = firstname, Email = email.ToLower() });

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
                        EduIntent = "YES"
                    };
                    profile.PopulateCityAndState();
                    profile.SetTestResults(Request);
                    profile.SetImportantThings(Request);
                    upc.AddNewItem(profile);
                }

                string json = "{\"result\":\"ok\"}";
                Response.Write(json);
                Response.End();
            }
            catch (Exception ex)
            {
                Response.ContentType = "application/json";
                Response.Write(DefaultErrorResponse(ex.Message));
                Response.End();
            }

            return null;

            
        }


        [HttpPost]
        public ActionResult JobLead(FormCollection collection)
        {
            try
            {
                Response.ContentType = "application/json";

                //generate random ip address
                string ipaddress = RandomHelper.Instance.Next(1, 256) + "." + RandomHelper.Instance.Next(0, 256) + "." + RandomHelper.Instance.Next(0, 256) + "." + RandomHelper.Instance.Next(1, 256);

                string campaignid = "13574635";

                string besttime = FormValue(collection, "besttime", "Anytime");
                string rateposition = FormValue(collection, "rate_position", "10");
                string leadid = FormValue(collection, "leadid", "");

                string clientid = FormValue(collection, "client_id", "");
                string formid = FormValue(collection, "form_id", "");

                string clienttype = clientid.StartsWith("SC") ? "Direct" : "Network";

                string campuskey = FormValue(collection, "campus_key", "");
                string programkey = FormValue(collection, "correct_program_key", "");

                string program = FormValue(collection, "program", "");
                if (program == null || program == "" || program == "undefined")
                {
                    program = "0";
                }

                string salutation = FormValue(collection, "salutation", "").Trim().ToProperCase();
                string gender = salutation.ToLower() == "mr" ? "M" : "F";
                string firstname = FormValue(collection, "firstname", "GET THIS").ToProperCase();
                string lastname = FormValue(collection, "lastname", "GET THIS").ToProperCase();

                string email = FormValue(collection, "email", "GET THIS").Trim().ToLower();
                string zip = FormValue(collection, "zip", "GET THIS");
                string phone = FormValue(collection, "phone", "GET THIS").Replace(".", "").Replace(" ", "").Replace("-", "").Replace("(", "").Replace(")", "");
                string address1 = FormValue(collection, "address1", "GET THIS");
                string city = FormValue(collection, "city", "").ToProperCase();
                string state = FormValue(collection, "state", "");

                string educationlevel = FormValue(collection, "education_level", "SC");
                string military = FormValue(collection, "military", "None");
                string gradyear = FormValue(collection, "gradyear", (DateTime.Now.Year - 2).ToString());

                string dobyear = FormValue(collection, "dobyear", "");
                string gpa = FormValue(collection, "gpa", "");

                Random rnd = new Random(DateTime.Now.Millisecond);
                int dobmonth = rnd.Next(1, 13);
                int dobday = rnd.Next(1, 29);

                string schoolvariables = "";
                if (Request.Cookies["schoolvariables"] != null)
                {
                    schoolvariables = HttpUtility.UrlDecode(Request.Cookies["schoolvariables"].Value);
                }

                //GA variable
                string utmsource = FromCookie("utm_source"),
                    utmcampaign = FromCookie("utm_campaign"),
                    utmcontent = FromCookie("utm_content"),
                    utmterm = FromCookie("utm_term");

                String strPost = "campaign_id=" + campaignid +
                "&id=1727" +
                "&ip=" + ipaddress +
                "&client_id=" + clientid +
                "&form_id=" + formid +
                "&campus_key=" + campuskey +
                (programkey != "" ? "&program_key=" + programkey : "") +
                (program != "" ? "&program=" + program : "") +
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
                (military != "" ? "&military=" + military : "") +
                (gradyear != "" ? "&gradyear=" + gradyear : "") +
                (dobyear != "" ? "&dobyear=" + dobyear : "") +
                (dobmonth != 0 ? "&dobmonth=" + dobmonth.ToString() : "") +
                (dobday != 0 ? "&dobday=" + dobday.ToString() : "") +
                "&besttime=" + besttime +
                "&rate_position=" + rateposition +
                "&leadid=" + leadid;

                strPost = strPost.Replace("=undefined", "=");

                string testresults = "";


                StringBuilder sbtestresults = new StringBuilder();
                if (Request.Cookies["testresults"] != null)
                {
                    testresults = CookieDecoder.DecodeCookieCharacters(Request.Cookies["testresults"].Value);
                }
                

                string recommendations = "";
                if (Request.Cookies["recommendations"] != null)
                {
                    recommendations = CookieDecoder.DecodeCookieCharacters(Request.Cookies["recommendations"].Value);
                }

                string careerChoicesJson = GetCareerChoicesJson();
                string data = "{\"careerchoices\":" + careerChoicesJson + "}";


                string submissionResult = "";
                
                string clientrowkey = FormValue(collection, "client_rowkey", "");
                string programrowkey = FormValue(collection, "program_rowkey", "");

                DirectEmployerClientCampusProgramClient programclient = new DirectEmployerClientCampusProgramClient();
                DirectEmployerClientCampusProgram schoolprogram = programclient.GetByRowKey(programrowkey);

                DirectEmployerClientLeadClient directleadclient = new DirectEmployerClientLeadClient();

                DirectEmployerClientLead lead = new DirectEmployerClientLead
                {
                    PartitionKey = clientrowkey,
                    ClientId = clientid,
                    CampusId = campuskey,
                    ProgramId = programkey,
                    ProgramName = schoolprogram.JobTitle,

                    Salutation = salutation,
                    Gender = gender,
                    FirstName = firstname,
                    LastName = lastname,

                    Address = address1,
                    City = city,
                    State = state,
                    Zip = zip,
                    Phone = phone,
                    Email = email,
                    GradYear = gradyear,
                    Military = military,
                    EducationLevel = educationlevel,
                    GPA = gpa,
                    Status = "New"
                };

                try
                {
                    DirectEmployerClientClient schoolclient = new DirectEmployerClientClient();
                    DirectEmployerClient school = schoolclient.GetByRowKey(clientrowkey);
                    if (school.DeliveryMethod.Contains("Email") && school.DeliveryFrequency == "RT")
                    {
                        SubmitJobLeadByEmail(
                            ref lead,
                            school,
                            CookieDataTestResults.BulletListForEmail(Request),
                            CookieDataImportantThings.BulletListForEmail(Request));
                    }

                    if (school.DeliveryMethod.Contains("AutoPost") && school.DeliveryFrequency == "RT")
                    {
                        SubmitJobLeadByAutoPost(ref lead, school);
                    }

                    directleadclient.AddNewItem(lead);
                    submissionResult = "ok";
                }
                catch (Exception ex)
                {
                    submissionResult = ex.Message;
                }



#warning DO THIS IN DEFERRED MODE!!!!!!!!

                //Update lead counter
                List<DirectEmployerClientLead> allclientleads = new List<DirectEmployerClientLead>(directleadclient.GetAllByPartition(clientrowkey));

                LeadCounterClient leadcounterclient = new LeadCounterClient();
                LeadCounter schoolleadcounter = leadcounterclient.GetByRowKey(clientrowkey);
                schoolleadcounter.Total = allclientleads.Count();
                schoolleadcounter.Annually = allclientleads.Where(x => x.Timestamp.Year == DateTime.UtcNow.Year).Count();
                schoolleadcounter.Monthly = allclientleads.Where(x => x.Timestamp.Year.ToString() + x.Timestamp.Month.ToString() == DateTime.UtcNow.Year.ToString() + DateTime.UtcNow.Month.ToString()).Count();
                //schoolleadcounter.Weekly = allclientleads.Count();
                //schoolleadcounter.Daily = allclientleads.Count();
                leadcounterclient.Update(schoolleadcounter);

                List<DirectEmployerClientLead> thisprogramleads = new List<DirectEmployerClientLead>(allclientleads.Where(x => x.ProgramId == programkey));
                LeadCounter programleadcounter = leadcounterclient.GetByRowKey(programrowkey);
                programleadcounter.Total = thisprogramleads.Count();
                programleadcounter.Annually = thisprogramleads.Where(x => x.Timestamp.Year == DateTime.UtcNow.Year).Count();
                programleadcounter.Monthly = thisprogramleads.Where(x => x.Timestamp.Year.ToString() + x.Timestamp.Month.ToString() == DateTime.UtcNow.Year.ToString() + DateTime.UtcNow.Month.ToString()).Count();
                //programleadcounter.Weekly = thisprogramleads.Count();
                //programleadcounter.Daily = thisprogramleads.Count();
                leadcounterclient.Update(programleadcounter);


                

                SkillCowRequestSubmissionClient rsc = new SkillCowRequestSubmissionClient();

                rsc.AddNewItem(new SkillCowRequestSubmission
                {
                    Salutation = salutation,
                    Name = (firstname + " " + lastname).Trim(),
                    Zip = zip,
                    Email = email,
                    Address1 = address1,
                    City = city,
                    State = state,
                    Phone = phone,
                    IP = ipaddress,
                    Mode = "kiosk",
                    CampaignId = campaignid,
                    TestResults = testresults,
                    SourceForm = "schoolform",
                    GradYear = gradyear,
                    EduIntent = "YES",
                    Recommendations = recommendations,
                    ClientId = clientid,
                    FormId = formid,
                    CampusKey = campuskey,
                    ProgramKey = programkey,
                    Gender = gender,
                    SubmissionResult = submissionResult,
                    Data = data,
                    UtmSource = utmsource,
                    UtmCampaign = utmcampaign,
                    UtmContent = utmcontent,
                    UtmTerm = utmterm,
                    PostedString = strPost,
                    ClientType = clienttype
                });

                AddresseeClient adc = new AddresseeClient();
                string emailpartition = AddresseeClient.GetPartitionKeyForEmail(email);
                Addressee a = adc.GetByPartitionAndRowKey(emailpartition, email);
                if (a == null)
                {
                    adc.AddNewItem(new Addressee(email.ToLower()) { Name = firstname, Email = email.ToLower() });

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
                        EduIntent = "YES"
                    };
                    profile.PopulateCityAndState();
                    profile.SetTestResults(Request);
                    profile.SetImportantThings(Request);
                    upc.AddNewItem(profile);
                }

                string json = "{\"result\":\"ok\"}";
                Response.Write(json);
                Response.End();
            }
            catch (Exception ex)
            {
                Response.ContentType = "application/json";
                Response.Write(DefaultErrorResponse(ex.Message));
                Response.End();
            }

            return null;


        }
        


        [HttpPost]
        public ActionResult RequestRecord(FormCollection collection)
        {
            try
            {
                Response.ContentType = "application/json";

                string recordsubmitted = FormValue(collection, "recordsubmitted", "");

                //generate random ip address
                string ipaddress = RandomHelper.Instance.Next(1, 256) + "." + RandomHelper.Instance.Next(0, 256) + "." + RandomHelper.Instance.Next(0, 256) + "." + RandomHelper.Instance.Next(1, 256);

                string campaignid = "13574635";

                string clientid = "20";


                string salutation = FormValue(collection, "salutation", "").Trim().ToProperCase();
                string gender = salutation.ToLower() == "mr" ? "M" : "F";
                string firstname = FormValue(collection, "firstname", "GET THIS");
                string lastname = FormValue(collection, "lastname", "GET THIS");
                string email = FormValue(collection, "email", "GET THIS").Trim().ToLower();
                string zip = FormValue(collection, "zip", "GET THIS");
                string phone = FormValue(collection, "phone", "GET THIS").Replace(".", "").Replace(" ", "").Replace("-", "").Replace("(", "").Replace(")", "");
                string address1 = FormValue(collection, "address1", "GET THIS");
                string city = FormValue(collection, "city", "GET THIS");
                string state = FormValue(collection, "state", "GET THIS");

                string eduintent = FormValue(collection, "edu_intent", "YES");

                string educationlevel = FormValue(collection, "education_level", "SC");
                string military = FormValue(collection, "military", "None");
                string gradyear = FormValue(collection, "gradyear", "GET THIS");

                string dobyear = FormValue(collection, "dobyear", "GET THIS");
                string dobmonth = "0";
                string dobday = "0";

                
                int parseresult;
                if (int.TryParse(dobyear, out parseresult))
                {
                    Random rnd = new Random(DateTime.Now.Millisecond);
                    dobmonth = rnd.Next(1, 13).ToString();
                    dobday = rnd.Next(1, 29).ToString();
                }

                //GA variable
                string utmsource = FromCookie("utm_source"),
                    utmcampaign = FromCookie("utm_campaign"),
                    utmcontent = FromCookie("utm_content"),
                    utmterm = FromCookie("utm_term");

                String strPost = "";
                string submissionResult = "";
                //SUBMIT THE RECORD
                if (recordsubmitted != "1")
                {
                
                    strPost = "campaign_id=" + campaignid +
                     "&id=1727" +
                     "&ip=" + ipaddress +
                     "&client=" + clientid +
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
                     "&edu_intent=" + eduintent +
                     "&military=" + military +
                     "&gradyear=" + gradyear +
                     "&dobyear=" + dobyear +
                     "&dobmonth=" + dobmonth +
                     "&dobday=" + dobday;

                    strPost = strPost.Replace("=undefined", "=");

                    //Create delayed record
                    DelayedRecordClient drc = new DelayedRecordClient();
                    //First check if delayed record already exists for this email
                    DelayedRecord dr = drc.GetByRowKey(email.FormatEmailAsProgrammaticId());
                    if (dr == null)
                    {
                        drc.AddNewItem(new DelayedRecord
                        { 
                            RowKey = email.FormatEmailAsProgrammaticId(),
                            CampaignId = campaignid,
                            ClientId = clientid,
                            IP = ipaddress,
                            Salutation = salutation,
                            Gender = gender,
                            FirstName = firstname,
                            LastName = lastname,
                            Email = email,
                            Address1 = address1,
                            City = city,
                            State = state,
                            Zip = zip,
                            Phone = phone,
                            EducationLevel = educationlevel,
                            EduIntent = eduintent,
                            GradYear = gradyear,
                            DobYear = dobyear,
                            DobMonth = dobmonth,
                            DobDay = dobday


                        });
                    }

                    //submissionResult = SubmitRecord(strPost);
                }

                SkillCowRequestSubmissionClient rsc = new SkillCowRequestSubmissionClient();

                string testresults = "";
                if (Request.Cookies["testresults"] != null)
                {
                    testresults = CookieDecoder.DecodeCookieCharacters(Request.Cookies["testresults"].Value);
                }

                string recommendations = "";
                if (Request.Cookies["recommendations"] != null)
                {
                    recommendations = CookieDecoder.DecodeCookieCharacters(Request.Cookies["recommendations"].Value);
                }


                string recordtype = FormValue(collection, "record_type", "");
                string recorddata = FormValue(collection, "record_data", "GET THIS");
                if (recorddata == null || recorddata == "GET THIS" || recorddata == "")
                {
                    recorddata = "{}";
                }

                string careerChoicesJson = GetCareerChoicesJson();
                string data = "{\"careerchoices\":" + careerChoicesJson + ", \"recorddata\" : "+recorddata+"}";

                rsc.AddNewItem(new SkillCowRequestSubmission
                {
                    Salutation = salutation,
                    Name = (firstname + " " + lastname).Trim(),
                    Zip = zip,
                    Email = email,
                    Address1 = address1,
                    Phone = phone,
                    IP = ipaddress,
                    Mode = "kiosk",
                    CampaignId = campaignid,
                    TestResults = testresults,
                    SourceForm = recordtype,
                    GradYear = gradyear,
                    EduIntent = eduintent,
                    Recommendations = recommendations,
                    ClientId = clientid,
                    Gender = gender,
                    SubmissionResult = submissionResult,
                    Data = data,
                    UtmSource = utmsource,
                    UtmCampaign = utmcampaign,
                    UtmContent = utmcontent,
                    UtmTerm = utmterm,
                    PostedString = strPost
                });

                AddresseeClient adc = new AddresseeClient();
                string emailpartition = AddresseeClient.GetPartitionKeyForEmail(email);
                Addressee a = adc.GetByPartitionAndRowKey(emailpartition, email);
                if (a == null)
                {
                    adc.AddNewItem(new Addressee(email.ToLower()) { Name = firstname, Email = email.ToLower() });

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

                SendEmail(firstname, email.ToLower(), recordtype, recorddata);

                string json = "{\"result\":\"ok\"}";
                Response.Write(json);
                Response.End();
            }
            catch (Exception ex)
            {
                Response.ContentType = "application/json";
                Response.Write(DefaultErrorResponse(ex.Message));
                Response.End();
            }

            return null;


        }

        bool SubmitSchoolLeadByEmail(ref DirectSchoolClientLead lead, DirectSchoolClient school, string testresults, string importantthings)
        {
            EmailManager em = new EmailManager();

            EmailTemplateHelper eth = new EmailTemplateHelper();

            string body = eth.GetTemplate("realtimelead");

            Type t = lead.GetType();
            PropertyInfo[] properties = t.GetProperties();
            foreach (PropertyInfo p in properties)
            {
                object v = p.GetValue(lead, null);
                if (v != null)
                {
                    body = body.Replace("@" + p.Name, v.ToString());
                }
                else
                {
                    body = body.Replace("@" + p.Name, "");
                }
            }

            StringBuilder sbadditionalinfo = new StringBuilder();

            if(testresults!="" || importantthings!="")
            {
                sbadditionalinfo.Append("<br /><h1>About " +lead.FirstName+ "</h1>");
            }
            if(testresults!="")
            {
                sbadditionalinfo.Append("<div class=\"panel\">");
                sbadditionalinfo.Append(lead.FirstName + " took the SkillCow career assessment test which helped us to identify the following Traits about "+(lead.Gender=="M"?"him":"her")+":");
                sbadditionalinfo.Append(testresults);
                sbadditionalinfo.Append("</div>");
            }
            if(importantthings!="")
            {
                sbadditionalinfo.Append("<div class=\"panel\">");
                sbadditionalinfo.Append(lead.FirstName+" has also specified the following things to be important to "+(lead.Gender=="M"?"him":"her")+":");
                sbadditionalinfo.Append(importantthings);
                sbadditionalinfo.Append("</div>");
            }

            body = body.Replace("@AdditionalInfo", sbadditionalinfo.ToString());

            string[] recipients = school.DeliveryDestination.Split(',');
            foreach (string recipient in recipients)
            {
                em.SendMail("no-reply@skillcow.com", "SkillCow", recipient.Trim(), "Inquiry from " + lead.FirstName + " " + lead.LastName, body);
            }
            em.SendMail("no-reply@skillcow.com", "SkillCow", "info@skillcow.com", "Inquiry from " + lead.FirstName + " " + lead.LastName + " | Copy of email sent to " + school.DeliveryDestination, body);

            lead.Status = "Emailed";

            return true;
        }
        bool SubmitJobLeadByEmail(ref DirectEmployerClientLead lead, DirectEmployerClient employer, string testresults, string importantthings)
        {
            EmailManager em = new EmailManager();

            EmailTemplateHelper eth = new EmailTemplateHelper();

            string body = eth.GetTemplate("realtimejoblead");

            Type t = lead.GetType();
            PropertyInfo[] properties = t.GetProperties();
            foreach (PropertyInfo p in properties)
            {
                object v = p.GetValue(lead, null);
                if (v != null)
                {
                    body = body.Replace("@" + p.Name, v.ToString());
                }
                else
                {
                    body = body.Replace("@" + p.Name, "");
                }
            }

            StringBuilder sbadditionalinfo = new StringBuilder();

            if (testresults != "" || importantthings != "")
            {
                sbadditionalinfo.Append("<br /><h1>About " + lead.FirstName + "</h1>");
            }
            if (testresults != "")
            {
                sbadditionalinfo.Append("<div class=\"panel\">");
                sbadditionalinfo.Append(lead.FirstName + " took the SkillCow career assessment test which helped us to identify the following Traits about " + (lead.Gender == "M" ? "him" : "her") + ":");
                sbadditionalinfo.Append(testresults);
                sbadditionalinfo.Append("</div>");
            }
            if (importantthings != "")
            {
                sbadditionalinfo.Append("<div class=\"panel\">");
                sbadditionalinfo.Append(lead.FirstName + " has also specified the following things to be important to " + (lead.Gender == "M" ? "him" : "her") + ":");
                sbadditionalinfo.Append(importantthings);
                sbadditionalinfo.Append("</div>");
            }

            body = body.Replace("@AdditionalInfo", sbadditionalinfo.ToString());

            string[] recipients = employer.DeliveryDestination.Split(',');
            foreach (string recipient in recipients)
            {
                em.SendMail("no-reply@skillcow.com", "SkillCow", recipient.Trim(), "Inquiry from " + lead.FirstName + " " + lead.LastName, body);
            }
            em.SendMail("no-reply@skillcow.com", "SkillCow", "info@skillcow.com", "Inquiry from " + lead.FirstName + " " + lead.LastName + " | Copy of email sent to " + employer.DeliveryDestination, body);

            lead.Status = "Emailed";

            return true;
        }

        void SendEmail(string firstname, string email, string recordtype, string recorddata)
        {
            if (recordtype == "indeedjob")
            {
                try
                {
                    JObject jo = JObject.Parse(recorddata);

                    EmailManager em = new EmailManager();

                    EmailTemplateHelper eth = new EmailTemplateHelper();

                    string body = eth.GetTemplate(recordtype);
                    body = body.Replace("@JOBTITLE", jo["jobtitle"].ToString()).Replace("@JOBKEY", jo["jobkey"].ToString()).Replace("@FIRSTNAME", firstname);

                    em.SendMail("no-reply@skillcow.com", "SkillCow Jobs", email, jo["jobtitle"].ToString(), body);
                }
                catch
                {
                }
            }
            else if (recordtype == "udemycourse")
            {
                try
                {
                    JObject jo = JObject.Parse(recorddata);

                    EmailManager em = new EmailManager();

                    EmailTemplateHelper eth = new EmailTemplateHelper();

                    string body = eth.GetTemplate(recordtype);
                    body = body.Replace("@COURSENAME", jo["name"].ToString()).Replace("@COURSEID", jo["id"].ToString()).Replace("@FIRSTNAME", firstname);

                    em.SendMail("no-reply@skillcow.com", "SkillCow Courses", email, jo["name"].ToString(), body);
                }
                catch
                {
                }
            }
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
                    string cval = CookieDecoder.DecodeCookieCharacters(Request.Cookies["careerchoice" + i].Value);
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

        string SubmitSchoolLead(string strpost)
        {
            return _SubmitLead(strpost, "http://explore-schools.com/affiliate/submit/");
        }
        string SubmitRecord(string strpost)
        {
            return _SubmitLead(strpost, "http://www.explore-schools.com/thankyou/affiliate_submission.php");
        }

        string _SubmitLead(string strPost,string url)
        {
            StreamWriter myWriter = null;

            HttpWebRequest objRequest = (HttpWebRequest)WebRequest.Create(url);
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
                temp = CookieDecoder.DecodeCookieCharacters(Request.Cookies[variable] != null && Request.Cookies[variable].Value.Trim() != "" ? Request.Cookies[variable].Value : defaultvalue);
            }
            return temp;
        }

        private bool SubmitSchoolLeadByAutoPost(ref DirectSchoolClientLead lead, DirectSchoolClient school)
        {
            string url = school.LeadPostURL;
            string form = school.LeadPostForm;

            form = form.Replace("@CampusId", lead.CampusId);
            form = form.Replace("@ProgramId", lead.ProgramId);
            form = form.Replace("@ProgramName", lead.ProgramName);

            form = form.Replace("@Salutation", lead.Salutation);
            form = form.Replace("@Gender", lead.Gender);
            form = form.Replace("@FirstName", lead.FirstName);
            form = form.Replace("@LastName", lead.LastName);

            form = form.Replace("@Address", lead.Address);
            form = form.Replace("@City", lead.City);
            form = form.Replace("@State", lead.State);
            form = form.Replace("@Zip", lead.Zip);

            form = form.Replace("@Phone", lead.Phone);
            form = form.Replace("@Email", lead.Email);
            form = form.Replace("@GradYear", lead.GradYear);
            form = form.Replace("@Military", lead.Military);
            form = form.Replace("@EducationLevel", lead.EducationLevel);
            form = form.Replace("@GPA", lead.GPA);

            _SubmitLead(form, url);

            if (lead.Status != null && lead.Status != "")
            {
                lead.Status += "+AutoPosted";
            }
            else
            {
                lead.Status = "AutoPosted";
            }

            return true;
        }
        private bool SubmitJobLeadByAutoPost(ref DirectEmployerClientLead lead, DirectEmployerClient school)
        {
            string url = school.LeadPostURL;
            string form = school.LeadPostForm;

            form = form.Replace("@CampusId", lead.CampusId);
            form = form.Replace("@ProgramId", lead.ProgramId);
            form = form.Replace("@ProgramName", lead.ProgramName);

            form = form.Replace("@Salutation", lead.Salutation);
            form = form.Replace("@Gender", lead.Gender);
            form = form.Replace("@FirstName", lead.FirstName);
            form = form.Replace("@LastName", lead.LastName);

            form = form.Replace("@Address", lead.Address);
            form = form.Replace("@City", lead.City);
            form = form.Replace("@State", lead.State);
            form = form.Replace("@Zip", lead.Zip);

            form = form.Replace("@Phone", lead.Phone);
            form = form.Replace("@Email", lead.Email);
            form = form.Replace("@GradYear", lead.GradYear);
            form = form.Replace("@Military", lead.Military);
            form = form.Replace("@EducationLevel", lead.EducationLevel);
            form = form.Replace("@GPA", lead.GPA);

            _SubmitLead(form, url);

            if (lead.Status != null && lead.Status != "")
            {
                lead.Status += "+AutoPosted";
            }
            else
            {
                lead.Status = "AutoPosted";
            }

            return true;
        }
    }

    
}
