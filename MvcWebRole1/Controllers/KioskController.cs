using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using SkillCow.Classes.Helpers;
using SkillCow.Classes.Cloud.TableStorage;
using SkillCow.Classes.Cloud.TableStorage.PersonalityTests.SkillCowRequestSubmissions;
using Microsoft.WindowsAzure.StorageClient;
using System.Globalization;

namespace SkillCow.Controllers
{
    public class KioskController : ControllerBase
    {
        //
        // GET: /Kiosk/

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult FindJobs()
        {
            return View();
        }
        public ActionResult FindSchools()
        {
            return View();
        }

        public ActionResult CareerAssessmentIntro()
        {
            return View();
        }

        public ActionResult CareerAssessmentTest()
        {
            return View();
        }

        public ActionResult Profession(string id)
        {
            ViewBag.ProfessionId = id;
            return View();
        }

        public ActionResult Keyboard()
        {
            return View();
        }

        public ActionResult Agent()
        {
            return View();
        }

        public ActionResult TEN(string keyword, string client, string form)
        {
            ViewBag.Keyword = keyword;
            ViewBag.Client = client;
            ViewBag.Form = form;

            return View();
        }

        public ActionResult iospage1()
        {
            return View();
        }
        public ActionResult iospage2()
        {
            return View();
        }
        public ActionResult iospage3()
        {
            return View();
        }
        public ActionResult iospage4()
        {
            return View();
        }
        public ActionResult iospage5()
        {
            return View();
        }
        public ActionResult iospage6()
        {
            return View();
        }
        public ActionResult iospage7()
        {
            return View();
        }
        public ActionResult iospage8()
        {
            return View();
        }

        [HttpPost]
        public HttpResponse checkagentlogoncode(string location, string agent, string code)
        {
            try
            {
                Response.ContentType = "application/json";

                if (location == null || location == "")
                    throw new Exception("Invalid location");

                AgentClient ac = new AgentClient();
                Agent a = ac.GetAll().Execute().Where(x=>x.LoginName==agent).SingleOrDefault();

                if (a == null)
                {
                    throw new Exception("Invalid agent ID or code");
                }

                if (a.LoginCode == code)
                {
                    a.CurrentLocation = location;
                    a.CurrentStatus = "loggedon";
                    ac.Update(a);
                    
                    AgentEventClient aec = new AgentEventClient();
                    aec.AddNewItem(new AgentEvent(agent, "logon", location));

#if DEBUG
#else
                    Telephony t = new Telephony();
                    //Send to Rick
                    //t.SendSMS("+19174340659", agent + " logged on at " + location);

                    //Send to Mike
                    t.SendSMS("+19179578770", agent + " logged on at " + location);
#endif

                    Response.Write("{\"result\": \"ok\", \"logonname\": \"" + a.LoginName + "\", \"logoncolor\": \"" + a.LoginColor + "\"}");
                    Response.End();
                }
                else
                {
                    throw new Exception("Invalid agent ID or code");
                }
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
        public HttpResponse logoff(string location, string agent, string code)
        {
            try
            {
                Response.ContentType = "application/json";
                
                AgentClient ac = new AgentClient();
                Agent a = ac.GetAll().Execute().Where(x => x.LoginName == agent).SingleOrDefault();

                if (a == null)
                {
                    throw new Exception("Invalid agent ID or code");
                }

                if (a.LoginCode == code)
                {

                    DateTime nowTime = EasternTimeConverter.Convert(DateTime.UtcNow);


                    AgentEventClient aec = new AgentEventClient();
                    AgentEvent lastEvent = aec.GetAll().Execute().Where(x => x.Agent == agent).OrderByDescending(x => x.EventTime).FirstOrDefault();

                    string hoursworked = "No prior logon.";
                    string production = "No results.";
                    if (lastEvent.EventType == "logon")
                    {
                        long elapsedTicks = nowTime.Ticks - lastEvent.EventTime.Ticks;
                        TimeSpan ts = new TimeSpan(elapsedTicks);
                        hoursworked = ts.Hours.ToString() + "h : " + ts.Minutes + "m logged.";

                        //Count how many leads
                        List<SkillCowRequestSubmission> allrecords = new List<SkillCowRequestSubmission>();

                        DateTime cursordate = lastEvent.EventTime;

                        SkillCowRequestSubmissionClient rsc = new SkillCowRequestSubmissionClient();
                        while (cursordate <= nowTime)
                        {
                            CloudTableQuery<SkillCowRequestSubmission> query = rsc.GetAll(cursordate.ToString("yyyyMMdd"));
                            allrecords.AddRange(query.Execute().Where(x => x.UtmCampaign == location && x.UtmContent == agent).OrderBy(x => x.Timestamp));
                            cursordate = cursordate.AddDays(1);
                        }

                        //tally up
                        int totalschoolleads = 0;
                        int totalindeedjobs = 0;
                        int totalcourses = 0;
                        foreach (SkillCowRequestSubmission x in allrecords)
                        {
                            switch (x.SourceForm)
                            {
                                case "schoolform":
                                    totalschoolleads++;
                                    break;
                                case "indeedjob":
                                    totalindeedjobs++;
                                    break;
                                case "udemycourse":
                                    totalcourses++;
                                    break;

                            }
                        }
                        if (totalschoolleads + totalindeedjobs + totalcourses > 0)
                        {
                            production = "\n";
                            production += totalschoolleads + " school leads\n";
                            production += totalindeedjobs + " indeed jobs\n";
                            production += totalcourses + " udemy courses";
                        }
                    }

                    //Log event
                    aec.AddNewItem(new AgentEvent(agent, "logoff", location));
                    
                    a.CurrentLocation = "";
                    a.CurrentStatus = "loggedoff";
                    ac.Update(a);
                    
#if DEBUG
#else

                    Telephony t = new Telephony();

                    string message = agent + " logged OFF at " + location + "\n" + hoursworked + "\n" + production;
                    //Send to Rick
                    //t.SendSMS("+19174340659", message);

                    t.SendSMS("+19179578770", message);
#endif

                    Response.Write("{\"result\": \"ok\", \"logonname\": \"" + a.LoginName + "\"}");
                    Response.End();
                }
                else
                {
                    throw new Exception("Invalid agent ID or code");
                }
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
        public HttpResponse getactiveagents(string location)
        {
            try
            {
                Response.ContentType = "application/json";

                AgentClient ac = new AgentClient();
                List<object> agents = new List<object>();
                foreach(var agent in ac.GetAll().Execute().Where(x => x.CurrentStatus == "loggedon" && x.CurrentLocation == location))
                {
                    agents.Add(new { logonname = agent.LoginName, firstname = agent.Firstname, lastname = agent.Lastname, logoncolor=agent.LoginColor }); 
                }

                string response = "{\"result\": \"ok\", \"agents\": " + agents.ToArray().ToJSON() + " }";
                Response.Write(response);
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
        public HttpResponse ManualTimeEntry(string formatteddate, string location, string agent, string eventtype, int hours, int minutes)
        {
            try
            {
                Response.ContentType = "application/json";

                AgentEventClient aec = new AgentEventClient();

                DateTime eventdate = DateTime.ParseExact(formatteddate, "yyyyMMdd", CultureInfo.InvariantCulture);
                DateTime eventtime = new DateTime(eventdate.Year, eventdate.Month, eventdate.Day, hours, minutes, 0);

                AgentEvent manualevent = new AgentEvent();

                manualevent.PartitionKey = eventtime.ToString("yyyyMM");
                manualevent.RowKey = ShortGuidGenerator.NewGuid();
                manualevent.EventTime = eventtime;
                manualevent.Agent = agent;
                manualevent.EventType = eventtype;
                manualevent.Location = location;

                aec.AddNewItem(manualevent);
                                
                Response.Write("{\"result\": \"ok\"}");
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

    }
}
