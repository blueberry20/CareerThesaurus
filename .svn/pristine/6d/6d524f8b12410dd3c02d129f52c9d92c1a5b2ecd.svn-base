using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using SkillCow.Classes.Cloud.TableStorage.PersonalityTests.SkillCowRequestSubmissions;
using System.Globalization;
using SkillCow.Classes.Cloud.TableStorage;
using SkillCow.Classes.Helpers;
using System.IO;
using System.Net;
using SkillCow.Classes;
using System.Text;
using SkillCow.Classes.DeferredProcesses;

namespace SkillCow.Controllers
{
    public class xyzController : ControllerBase
    {
        //
        // GET: /xyz/
        

        public ActionResult _addressees()
        {
            AddresseeClient adc = new AddresseeClient();

            return View(adc);
        }

        public ActionResult _nobodyknows()
        {
            SkillCowRequestSubmissionClient rsc = new SkillCowRequestSubmissionClient();

            ViewBag.StartDate = EasternTimeConverter.Convert(DateTime.UtcNow);
            ViewBag.EndDate = EasternTimeConverter.Convert(DateTime.UtcNow);

            
            

            return View(rsc);
        }


        [HttpPost]
        public ActionResult _nobodyknows(FormCollection collection)
        {
            SkillCowRequestSubmissionClient rsc = new SkillCowRequestSubmissionClient();

            ViewBag.StartDate = DateTime.ParseExact(collection["startdate"], "yyyyMMdd", CultureInfo.InvariantCulture);
            ViewBag.EndDate = DateTime.ParseExact(collection["enddate"], "yyyyMMdd", CultureInfo.InvariantCulture);

            ViewBag.SearchName = collection["searchname"];

            return View(rsc);
        }

        public ActionResult _mgid()
        {
            SkillCowRequestSubmissionClient rsc = new SkillCowRequestSubmissionClient();

            ViewBag.StartDate = EasternTimeConverter.Convert(DateTime.UtcNow);
            ViewBag.EndDate = EasternTimeConverter.Convert(DateTime.UtcNow);




            return View(rsc);
        }


        [HttpPost]
        public ActionResult _mgid(FormCollection collection)
        {
            SkillCowRequestSubmissionClient rsc = new SkillCowRequestSubmissionClient();

            ViewBag.StartDate = DateTime.ParseExact(collection["startdate"], "yyyyMMdd", CultureInfo.InvariantCulture);
            ViewBag.EndDate = DateTime.ParseExact(collection["enddate"], "yyyyMMdd", CultureInfo.InvariantCulture);

            return View(rsc);
        }

        public ActionResult _resultmapping()
        {
            SkillCowRequestSubmissionClient rsc = new SkillCowRequestSubmissionClient();

            ViewBag.StartDate = EasternTimeConverter.Convert(DateTime.UtcNow);
            ViewBag.EndDate = EasternTimeConverter.Convert(DateTime.UtcNow);




            return View(rsc);
        }

        

        [HttpPost]
        public ActionResult _resultmapping(FormCollection collection)
        {
            SkillCowRequestSubmissionClient rsc = new SkillCowRequestSubmissionClient();

            ViewBag.StartDate = DateTime.ParseExact(collection["startdate"], "yyyyMMdd", CultureInfo.InvariantCulture);
            ViewBag.EndDate = DateTime.ParseExact(collection["enddate"], "yyyyMMdd", CultureInfo.InvariantCulture);

            return View(rsc);
        }

        public ActionResult _testresults()
        {
            SkillCowRequestSubmissionClient rsc = new SkillCowRequestSubmissionClient();

            ViewBag.StartDate = EasternTimeConverter.Convert(DateTime.UtcNow);
            ViewBag.EndDate = EasternTimeConverter.Convert(DateTime.UtcNow);




            return View(rsc);
        }


        [HttpPost]
        public ActionResult _testresults(FormCollection collection)
        {
            SkillCowRequestSubmissionClient rsc = new SkillCowRequestSubmissionClient();

            ViewBag.StartDate = DateTime.ParseExact(collection["startdate"], "yyyyMMdd", CultureInfo.InvariantCulture);
            ViewBag.EndDate = DateTime.ParseExact(collection["enddate"], "yyyyMMdd", CultureInfo.InvariantCulture);

            return View(rsc);
        }

        public ActionResult _campaigns()
        {
            SkillCowRequestSubmissionClient rsc = new SkillCowRequestSubmissionClient();

            ViewBag.StartDate = EasternTimeConverter.Convert(DateTime.UtcNow);
            ViewBag.EndDate = EasternTimeConverter.Convert(DateTime.UtcNow);




            return View(rsc);
        }

        [HttpPost]
        public ActionResult _campaigns(FormCollection collection)
        {
            SkillCowRequestSubmissionClient rsc = new SkillCowRequestSubmissionClient();

            ViewBag.StartDate = DateTime.ParseExact(collection["startdate"], "yyyyMMdd", CultureInfo.InvariantCulture);
            ViewBag.EndDate = DateTime.ParseExact(collection["enddate"], "yyyyMMdd", CultureInfo.InvariantCulture);

            return View(rsc);
        }

        public ActionResult _kiosks()
        {
            SkillCowRequestSubmissionClient rsc = new SkillCowRequestSubmissionClient();

            ViewBag.StartDate = EasternTimeConverter.Convert(DateTime.UtcNow);
            ViewBag.EndDate = EasternTimeConverter.Convert(DateTime.UtcNow);




            return View(rsc);
        }

        [HttpPost]
        public ActionResult _kiosks(FormCollection collection)
        {
            SkillCowRequestSubmissionClient rsc = new SkillCowRequestSubmissionClient();

            ViewBag.StartDate = DateTime.ParseExact(collection["startdate"], "yyyyMMdd", CultureInfo.InvariantCulture);
            ViewBag.EndDate = DateTime.ParseExact(collection["enddate"], "yyyyMMdd", CultureInfo.InvariantCulture);

            return View(rsc);
        }

        public ActionResult DelayedRecords()
        {

            //return null;
            string url = "http://www.explore-schools.com/thankyou/affiliate_submission.php";

            DelayedRecordClient drc = new DelayedRecordClient();
            //drc.DeleteTable();
            List<DelayedRecord> allrecords = new List<DelayedRecord>(drc.GetAll().Execute());

            DateTime cursordate = DateTime.UtcNow.AddMinutes(-30);

            UserProfileClient upc = new UserProfileClient();

            int cnt = 0;
            foreach (DelayedRecord dr in allrecords)
            {
                cnt++;
                if (dr.Timestamp < cursordate)
                {
                    dr.Submitted = true;
                    try
                    {
                        string strPost = dr.GetPostString(upc);

                        StreamWriter myWriter = null;
                        HttpWebRequest objRequest = (HttpWebRequest)WebRequest.Create(url);
                        objRequest.Method = "POST";
                        objRequest.ContentLength = System.Text.ASCIIEncoding.ASCII.GetByteCount(strPost);
                        objRequest.ContentType = "application/x-www-form-urlencoded";

                        myWriter = new StreamWriter(objRequest.GetRequestStream());
                        myWriter.Write(strPost);
                        myWriter.Close();

                        HttpWebResponse objResponse = (HttpWebResponse)objRequest.GetResponse();
                        using (StreamReader sr =
                           new StreamReader(objResponse.GetResponseStream()))
                        {
                            string result = sr.ReadToEnd();
                            if (result.Contains("Success") || result.ToLower().Contains("already in our database"))
                            {
                                drc.Delete(dr);

                            }
                            else
                            {
                                dr.SubmissionError = true;
                            }

                            // Close and clean up the StreamReader
                            sr.Close();
                        }
                    }catch(Exception e)
                    {
                        drc.Delete(dr);
                    }

                    

                    //if (++cnt >= 30)
                    //{
                    //    break;
                    //}
                }
            }

            ViewBag.SubmittedRecords = cnt;

            return View(allrecords);
        }


        public ActionResult ExportDelayedRecordsToExcel(string startdate, string enddate)
        {
            
            Response.ContentType = "application/vnd.ms-excel";
            Response.AppendHeader("content-disposition", "attachment; filename=Skillcow_DelayedRecords.csv");
            Response.AddHeader("Cache-Control", "must-revalidate");
            Response.AddHeader("Pragma", "must-revalidate");

            return View();
        }

        public ActionResult _dump()
        {
            SkillCowRequestSubmissionClient rsc = new SkillCowRequestSubmissionClient();

            ViewBag.StartDate = EasternTimeConverter.Convert(DateTime.UtcNow);
            ViewBag.EndDate = EasternTimeConverter.Convert(DateTime.UtcNow);




            return View(rsc);
        }

        [HttpPost]
        public ActionResult _dump(FormCollection collection)
        {
            SkillCowRequestSubmissionClient rsc = new SkillCowRequestSubmissionClient();

            ViewBag.StartDate = DateTime.ParseExact(collection["startdate"], "yyyyMMdd", CultureInfo.InvariantCulture);
            ViewBag.EndDate = DateTime.ParseExact(collection["enddate"], "yyyyMMdd", CultureInfo.InvariantCulture);

            return View(rsc);
        }


        public ActionResult _logons()
        {
            ViewBag.StartDate = EasternTimeConverter.Convert(DateTime.UtcNow);
            ViewBag.EndDate = EasternTimeConverter.Convert(DateTime.UtcNow);

            return View();
        }


        [HttpPost]
        public ActionResult _logons(FormCollection collection)
        {

            ViewBag.StartDate = DateTime.ParseExact(collection["startdate"], "yyyyMMdd", CultureInfo.InvariantCulture);
            ViewBag.EndDate = DateTime.ParseExact(collection["enddate"], "yyyyMMdd", CultureInfo.InvariantCulture);
            ViewBag.Agent = collection["agent"];

            AgentClient ac = new AgentClient();
            List<Agent> agentsprofiles = new List<Agent>(ac.GetAll().Execute());


            List<AgentDailyActivity> activity = AgentDailyActivity.Create(agentsprofiles, ViewBag.StartDate, ViewBag.EndDate, ViewBag.Agent);

            return View(activity);
        }

        public ActionResult Export()
        {
            ViewBag.StartDate = DateTime.Now;
            ViewBag.EndDate = DateTime.Now;
            
            return View();
        }
        public ActionResult Download(string startdate, string enddate, string utmsource, string sourceform, string mode, string clienttype)
        {
            ViewBag.StartDate = DateTime.ParseExact(startdate, "yyyyMMdd", CultureInfo.InvariantCulture);
            ViewBag.EndDate = DateTime.ParseExact(enddate, "yyyyMMdd", CultureInfo.InvariantCulture);
            ViewBag.UtmSource = utmsource;
            ViewBag.SourceForm = sourceform;
            ViewBag.Mode = mode;
            ViewBag.ClientType = clienttype;

            Response.ContentType = "application/vnd.ms-excel";
            Response.AppendHeader("content-disposition", "attachment; filename=Skillcow_Leads_Export_" + startdate + "_to_" + enddate + ".csv");
            
            Response.AddHeader("Cache-Control", "must-revalidate");
            Response.AddHeader("Pragma", "must-revalidate");

            return View();
        }

        public ActionResult Thesaurus(string profession)
        {
            ViewBag.Profession = profession;
            return View();
        }
    }
}
