using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using SkillCow.Classes.Helpers;
using SkillCow.Classes.Cloud.TableStorage.PersonalityTests.SkillCowRequestSubmissions;
using Microsoft.WindowsAzure.StorageClient;
using System.Globalization;
using SkillCow.Classes;
using SkillCow.Classes.Cloud.BlobStorage;
using SkillCow.Classes.Cloud.TableStorage;

namespace SkillCow.Controllers
{
    public class DashboardController : ControllerBase
    {
        public ActionResult Agents()
        {
            ViewBag.StartDate = DateTime.Now;
            ViewBag.EndDate = DateTime.Now;
            
            return View();
        }

        public ActionResult AgentReport(string startdate, string enddate)
        {
            ViewBag.StartDate = startdate;
            ViewBag.EndDate = enddate;

            return View();
        }


        [HttpPost]
        public ActionResult GetAgentPerformance(string startdate, string enddate)
        {
            //try
            //{
                Response.ContentType = "application/json";

          

                string datestamp = EasternTimeConverter.Convert(DateTime.UtcNow).ToString("yyyyMMdd");
                string cached = BlobJsonResourceManager.Instance.GetJsonResource("skillcowagentdashboard", datestamp, "range" + startdate + enddate);
                if (cached != null && cached.Trim() != "")
                {
                    Response.Write(cached);
                    Response.End();
                    return null;
                }
                

                SkillCowRequestSubmissionClient rsc = new SkillCowRequestSubmissionClient();

                DateTime dstartdate = DateTime.ParseExact(startdate, "yyyyMMdd", CultureInfo.InvariantCulture);
                DateTime denddate = DateTime.ParseExact(enddate, "yyyyMMdd", CultureInfo.InvariantCulture);


                AgentClient ac = new AgentClient();
                List<Agent> agentsprofiles = new List<Agent>(ac.GetAll().Execute());
                                
                //Get agent hours
                List<AgentDailyActivity> tempactivity = AgentDailyActivity.Create(agentsprofiles, dstartdate, denddate, null);
                Dictionary<string, IGrouping<string, AgentDailyActivity>> agenthours = new Dictionary<string, IGrouping<string, AgentDailyActivity>>();
                foreach (IGrouping<string, AgentDailyActivity> ag in tempactivity.GroupBy(x => x.Agent))
                {
                    agenthours.Add(ag.Key, ag);
                }

                List<SkillCowRequestSubmission> allrecords = rsc.GetKioskLeads(dstartdate, denddate);


                List<object> agents = new List<object>();

                foreach (KeyValuePair<string, IGrouping<string, AgentDailyActivity>> kv in agenthours)
                {
                    Agent agentprofile = agentsprofiles.SingleOrDefault(x => x.LoginName == kv.Key.Replace("cindy","sydneyc"));
                    
                    List<object> dates = new List<object>();

                    double totalhours = 0;
                    
                    Dictionary<string, List<double>> aggregate = new Dictionary<string,List<double>>();

                    aggregate.Add("hours", new List<double>());
                    aggregate.Add("billablehours", new List<double>());
                    aggregate.Add("hourlyearnings", new List<double>());
                    aggregate.Add("validschoolleadsnetwork", new List<double>());
                    aggregate.Add("companyvalidschoolleadsnetwork", new List<double>());
                    aggregate.Add("invalidschoolleadsnetwork", new List<double>());
                    aggregate.Add("companyinvalidschoolleadsnetwork", new List<double>());
                    aggregate.Add("commissionsschoolleadsnetwork", new List<double>());
                    aggregate.Add("AvgRetentionSchoolLeads", new List<double>());
                    aggregate.Add("CompanyAvgRetentionSchoolLeads", new List<double>());
                    aggregate.Add("AvgLPH", new List<double>());
                    aggregate.Add("Stochastic", new List<double>());
                    aggregate.Add("CompanyAverageLPHMean", new List<double>());

                    List<object> ProductionChartData = new List<object>();
                    
                    ProductionChartData.Add(new string[] {"Date", "Best", "Worst", "Average", kv.Key});
                    
                    DateTime cursordate = dstartdate;
                    while (cursordate <= denddate)
                    {
                        IEnumerable<SkillCowRequestSubmission> companyvalidnetworkschoolleads = allrecords.Where(x => 
                            x.PartitionKey == cursordate.ToString("yyyyMMdd") &&
                            x.GradYear != "GET THIS" &&
                            x.GradYear != "undefined" &&
                            (int.Parse(x.GradYear) < DateTime.UtcNow.Year || (int.Parse(x.GradYear) == DateTime.UtcNow.Year && DateTime.UtcNow.Month > 5)) && 
                            x.SourceForm == "schoolform");

                        IEnumerable<SkillCowRequestSubmission> companyinvalidnetworkschoolleads = allrecords.Where(x => 
                            x.PartitionKey == cursordate.ToString("yyyyMMdd") &&
                            !(x.GradYear != "GET THIS" && x.GradYear != "undefined" && (int.Parse(x.GradYear) < DateTime.UtcNow.Year || (int.Parse(x.GradYear) == DateTime.UtcNow.Year && DateTime.UtcNow.Month > 5))) &&
                            x.SourceForm == "schoolform");

                        IEnumerable<SkillCowRequestSubmission> validnetworkschoolleads = allrecords.Where(x => 
                            x.PartitionKey == cursordate.ToString("yyyyMMdd") &&
                            x.GradYear != "GET THIS" &&
                            x.GradYear != "undefined" &&
                            (int.Parse(x.GradYear) < DateTime.UtcNow.Year || (int.Parse(x.GradYear) == DateTime.UtcNow.Year && DateTime.UtcNow.Month > 5)) &&
                            x.SourceForm == "schoolform" &&
                            x.UtmContent == kv.Key);

                        IEnumerable<SkillCowRequestSubmission> invalidnetworkschoolleads = allrecords.Where(x => 
                            x.PartitionKey == cursordate.ToString("yyyyMMdd") &&
                            !(x.GradYear != "GET THIS" && x.GradYear != "undefined" && (int.Parse(x.GradYear) < DateTime.UtcNow.Year || (int.Parse(x.GradYear) == DateTime.UtcNow.Year && DateTime.UtcNow.Month > 5))) &&
                            x.SourceForm == "schoolform" &&
                            x.UtmContent == kv.Key);
                        
                        AgentDailyActivity locationday = null;
                        if(agenthours.ContainsKey(kv.Key))
                        {
                            locationday = agenthours[kv.Key].SingleOrDefault(x=>x.FormattedDate==cursordate.ToString("yyyyMMdd"));
                        }

                        int validnetworkschoolleadcount = validnetworkschoolleads.Count();

#warning TO DO: Replace with hourly pay rate from admin
                        double hoursworked = (locationday != null ? locationday.Hours : 0);

                        double lunch = 0;
                        if (hoursworked > 7)
                        {
                            lunch = 1;
                        }
                        else if (hoursworked > 4)
                        {
                            lunch = 0.5;
                        }

                        double billablehours = hoursworked - lunch;

                        double hourlyrate = agentprofile.PayPerHour;
                        double hourlyearnings = billablehours * hourlyrate;
                        double CommissionRatePerSchoolLeadNetwork = agentprofile.PayPerLead;//TO DO: Replace with hourly pay rate from admin
                        double CommissionRatePerSchoolLeadDirect = agentprofile.PayPerLead;//TO DO: Replace with hourly pay rate from admin
                        double CommissionRatePerJobLeadNetwork = 0.25;//TO DO: Replace with hourly pay rate from admin
                        double CommissionRatePerJobLeadDirect = 0.25;//TO DO: Replace with hourly pay rate from admin
                        double CommissionsSchoolLeadsNetwork = validnetworkschoolleadcount * CommissionRatePerSchoolLeadNetwork;

                        int uniquestudents = validnetworkschoolleads.GroupBy(x => x.Email).Count();
                        double AvgRetentionSchoolLeads = uniquestudents > 0 ? (double)validnetworkschoolleadcount / uniquestudents : 0;

                        int companyuniquestudents = companyvalidnetworkschoolleads.GroupBy(x => x.Email).Count();
                        double CompanyAvgRetentionSchoolLeads = companyuniquestudents>0 ? (double)companyvalidnetworkschoolleads.Count()  / companyvalidnetworkschoolleads.GroupBy(x => x.Email).Count() : 0;

                        
                        
                        double AvgLPH = locationday != null && locationday.Hours>0 ? CalculateLPH(validnetworkschoolleadcount, locationday.Hours) : 0;
                        double CompanyAverageLPHMean = GetAvgLPHMean(cursordate, companyvalidnetworkschoolleads, agenthours);
                        double CompanyAverageLPHMax = GetAvgLPHMax (cursordate, companyvalidnetworkschoolleads, agenthours);
                        double CompanyAverageLPHMin= GetAvgLPHMin(cursordate, companyvalidnetworkschoolleads, agenthours);
                        
                        double Stochastic = 0;
                        if (CompanyAverageLPHMax - CompanyAverageLPHMin > 0 && AvgLPH > 0)
                        {
                            Stochastic = (AvgLPH - CompanyAverageLPHMin) / (CompanyAverageLPHMax - CompanyAverageLPHMin);
                        }

                        

                        dates.Add(new
                        {
                            Agent = kv.Key,
                            Date = cursordate.ToString("MMM-d"),

                            ValidSchoolLeadsNetwork = validnetworkschoolleadcount,
                            CompanyValidSchoolLeadsNetwork = companyvalidnetworkschoolleads.Count(),
                            //ValidSchoolLeadsDirect = GetValidSchoolLeads(allrecords),
                            //ValidJobLeadsNetwork = GetValidSchoolLeads(allrecords),
                            //ValidJobLeadsDirect = GetValidSchoolLeads(allrecords),
                            InvalidSchoolLeadsNetwork = invalidnetworkschoolleads.Count(),
                            CompanyInvalidSchoolLeadsNetwork = companyinvalidnetworkschoolleads.Count(),
                            //InvalidSchoolLeadsDirect = GetValidSchoolLeads(allrecords),
                            //InvalidJobLeadsNetwork = GetValidSchoolLeads(allrecords),
                            //InvalidJobLeadsDirect = GetValidSchoolLeads(allrecords),
                            //IndeedJobs = GetValidSchoolLeads(allrecords),
                            //UdemyCourses = GetValidSchoolLeads(allrecords),
                            UniqueStudents = validnetworkschoolleads.GroupBy(x => x.Email).Count(),
                            AvgRetentionSchoolLeads = AvgRetentionSchoolLeads,
                            CompanyAvgRetentionSchoolLeads = CompanyAvgRetentionSchoolLeads,
                            
                            CompanyAvgLPHMax = CompanyAverageLPHMax,
                            CompanyAvgLPHMean = CompanyAverageLPHMean,
                            CompanyAvgLPHMin = CompanyAverageLPHMin,
                            AvgLPH = AvgLPH,

                            Hours = hoursworked,
                            BillableHours = billablehours,
                            Lunch = lunch, 
                            Logon = locationday!=null ? locationday.LogonTime : "",
                            Logoff = locationday!=null ? locationday.LogoffTime : "",

                            HourlyRate = hourlyrate, 
                            HourlyEarnings = hourlyearnings,

                            CommissionRatePerSchoolLeadNetwork = CommissionRatePerSchoolLeadNetwork, 
                            CommissionRatePerSchoolLeadDirect = CommissionRatePerSchoolLeadDirect,
                            CommissionRatePerJobLeadNetwork = CommissionRatePerJobLeadNetwork,
                            CommissionRatePerJobLeadDirect = CommissionRatePerJobLeadDirect,

                            CommissionsSchoolLeadsNetwork = CommissionsSchoolLeadsNetwork,

                            TotalEarnings = hourlyearnings + CommissionsSchoolLeadsNetwork,

                            Stochastic = Stochastic,

                            Payments = 0,
                            Adjustments = 0

                            //,CumulativeEarnings

                        });


                        //Build production chart data arrays
                        if (hoursworked > 0)
                        {
                            try
                            {
                                ProductionChartData.Add(new object[] {
                                    cursordate.ToString("MMM-d"), 
                                    float.Parse(String.Format("{0:0.0}", CompanyAverageLPHMax)), 
                                    float.Parse(String.Format("{0:0.0}", CompanyAverageLPHMin)), 
                                    float.Parse(String.Format("{0:0.0}", CompanyAverageLPHMean)), 
                                    float.Parse(String.Format("{0:0.0}", AvgLPH)) });
                               
                            }
                            catch (Exception ex)
                            {
                                Console.Write(ex.Message);
                            }

                            //running totals
                            totalhours += hoursworked;
                            if (locationday != null) 
                            { 
                                aggregate["hours"].Add(hoursworked);
                                aggregate["billablehours"].Add(billablehours); 
                            }
                            aggregate["hourlyearnings"].Add(hourlyearnings);

                            aggregate["validschoolleadsnetwork"].Add(validnetworkschoolleadcount);
                            aggregate["companyvalidschoolleadsnetwork"].Add(companyvalidnetworkschoolleads.Count());

                            aggregate["invalidschoolleadsnetwork"].Add(invalidnetworkschoolleads.Count());
                            aggregate["companyinvalidschoolleadsnetwork"].Add(companyinvalidnetworkschoolleads.Count());

                            aggregate["commissionsschoolleadsnetwork"].Add(CommissionsSchoolLeadsNetwork);

                            aggregate["AvgRetentionSchoolLeads"].Add(AvgRetentionSchoolLeads);
                            aggregate["CompanyAvgRetentionSchoolLeads"].Add(CompanyAvgRetentionSchoolLeads);
                            aggregate["AvgLPH"].Add(AvgLPH);
                            aggregate["CompanyAverageLPHMean"].Add(CompanyAverageLPHMean);
                            aggregate["Stochastic"].Add(Stochastic);
                        }

                        
                        

                        cursordate = cursordate.AddDays(1);
                    }

                    double aggregatelph = aggregate["AvgLPH"].Average();


                    agents.Add(new
                    {
                        Id = kv.Key,
                        Dates = dates.ToArray(),
                        
                        TotalHours = totalhours,
                        TotalBillableHours = aggregate["billablehours"].Sum(),
                        AvgHoursPerDay = aggregate.ContainsKey("hours") ? aggregate["hours"].Average() : 0,
                        TotalHourlyEarnings = aggregate["hourlyearnings"].Sum(),

                        TotalValidSchoolLeadsNetwork = aggregate["validschoolleadsnetwork"].Sum(),
                        AvgValidSchoolLeadsNetwork = aggregate["validschoolleadsnetwork"].Average(),
                        CompanyTotalValidSchoolLeadsNetwork = aggregate["companyvalidschoolleadsnetwork"].Sum(),

                        TotalInvalidSchoolLeadsNetwork = aggregate["invalidschoolleadsnetwork"].Sum(),
                        AvgInvalidSchoolLeadsNetwork = aggregate["invalidschoolleadsnetwork"].Average(),
                        CompanyTotalInvalidSchoolLeadsNetwork = aggregate["companyinvalidschoolleadsnetwork"].Sum(),

                        //totalvalidschoolleadsdirect = 0;
                        //totalvalidjobleadsnetwork = 0;
                        //totalvalidjobleadsdirect = 0;

                        TotalCommissionCchoolLeadsNetwork = aggregate["commissionsschoolleadsnetwork"].Sum(),

                        TotalEarnings = aggregate["hourlyearnings"].Sum() + aggregate["commissionsschoolleadsnetwork"].Sum(),

                        //totalcommissionschoolleadsdirect = 0;
                        //totalcommissionjobleadsnetwork = 0;
                        //totalcommissionjobleadsdirect = 0;

                        AvgRetentionSchoolLeads = aggregate["AvgRetentionSchoolLeads"].Average(),
                        CompanyAvgRetentionSchoolLeads = aggregate["CompanyAvgRetentionSchoolLeads"].Average(),

                        AvgLPH = aggregatelph,
                        CompanyAverageLPHMean = aggregate["CompanyAverageLPHMean"].Average(),

                        Stochastic = aggregate["Stochastic"].Average(),

                        ProductionChartData = ProductionChartData.ToArray()
                            
                    });
                }

                
                string retvalue = (new { result = "ok", agents = agents.ToArray() }).ToJSON();

                //Save cached version
                BlobJsonResourceManager.Instance.SaveJsonResource(retvalue, "range" + startdate + enddate, "skillcowagentdashboard", datestamp);
                
                Response.Write(retvalue);
                Response.End();
            //}
            //catch (Exception ex)
            //{
            //    Response.ContentType = "application/json";
            //    Response.Write(DefaultErrorResponse(ex.Message));
            //    Response.End();
            //}

            return null;
        }
                

        private double GetAvgLPHMax(DateTime asofdate, IEnumerable<SkillCowRequestSubmission> leads, Dictionary<string, IGrouping<string, AgentDailyActivity>> agentdata )
        {
            IEnumerable<IGrouping<string, SkillCowRequestSubmission>> grouppedByAgent = leads.GroupBy(x => x.UtmContent);

            int cnt=0;
            double result=0;

            foreach (IGrouping<string, SkillCowRequestSubmission> agentgroup in grouppedByAgent)
            {
                if(agentdata.ContainsKey(agentgroup.Key))
                {
                    AgentDailyActivity locationday = agentdata[agentgroup.Key].SingleOrDefault(x=>x.FormattedDate==asofdate.ToString("yyyyMMdd"));
                    if (locationday != null)
                    {
                        if (locationday.Hours > 0)
                        {
                            int leadsbyagentforday = leads.Where(x => x.UtmContent == agentgroup.Key).Count();
                            double lph = CalculateLPH(leadsbyagentforday, locationday.Hours);

                            if (cnt++ == 0 || result < lph)
                            {
                                result = lph;
                            }
                        }
                    }
                }
            }
            return result;
        }

        private double GetAvgLPHMin(DateTime asofdate, IEnumerable<SkillCowRequestSubmission> leads, Dictionary<string, IGrouping<string, AgentDailyActivity>> agentdata)
        {
            IEnumerable<IGrouping<string, SkillCowRequestSubmission>> grouppedByAgent = leads.GroupBy(x => x.UtmContent);

            int cnt = 0;
            double result = 0;

            foreach (IGrouping<string, SkillCowRequestSubmission> agentgroup in grouppedByAgent)
            {
                if (agentdata.ContainsKey(agentgroup.Key))
                {
                    AgentDailyActivity locationday = agentdata[agentgroup.Key].SingleOrDefault(x => x.FormattedDate == asofdate.ToString("yyyyMMdd"));
                    if (locationday != null)
                    {
                        if (locationday.Hours > 0)
                        {
                            int leadsbyagentforday = leads.Where(x => x.UtmContent == agentgroup.Key).Count();
                            double lph = CalculateLPH(leadsbyagentforday, locationday.Hours);

                            if (cnt++ == 0 || result > lph)
                            {
                                result = lph;
                            }
                        }
                    }
                }
            }
            return result;
        }

        private double GetAvgLPHMean(DateTime asofdate, IEnumerable<SkillCowRequestSubmission> leads, Dictionary<string, IGrouping<string, AgentDailyActivity>> agentdata)
        {
            IEnumerable<IGrouping<string, SkillCowRequestSubmission>> grouppedByAgent = leads.GroupBy(x => x.UtmContent);

            int cnt = 0;
            double result = 0;
            int n = 0;

            foreach (IGrouping<string, SkillCowRequestSubmission> agentgroup in grouppedByAgent)
            {
                if (agentdata.ContainsKey(agentgroup.Key))
                {
                    AgentDailyActivity locationday = agentdata[agentgroup.Key].SingleOrDefault(x => x.FormattedDate == asofdate.ToString("yyyyMMdd"));
                    if (locationday != null)
                    {
                        if (locationday.Hours > 0)
                        {
                            n++;

                            int leadsbyagentforday = leads.Where(x => x.UtmContent == agentgroup.Key).Count();
                            double lph = CalculateLPH(leadsbyagentforday, locationday.Hours);

                            result += lph;
                            
                        }
                    }
                }
            }

            if (n > 0)
            {
                return result / n;
            }
            else
            {
                return 0;
            }
        }

        private double CalculateLPH(int leads, double hours)
        {
            return (double)leads / Math.Max(hours, 1);
        }

        protected string DefaultErrorResponse(string errormessage)
        {
            object responseobject = null;
            responseobject = new
            {
                result = "error",
                errormessage = (errormessage != null && errormessage.Trim() != "" ? errormessage.ToJSONSafeString() : "")
            };

            return responseobject.ToJSON();
        }
    }
}
