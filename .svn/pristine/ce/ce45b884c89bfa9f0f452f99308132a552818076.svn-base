using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SkillCow.Classes.Cloud.TableStorage;
using SkillCow.Classes.Helpers;

namespace SkillCow.Classes
{
    class AgentLocationDate
    {
        public string Agent { get; set; }
        public string Location { get; set; }
        public string Date { get; set; }
    }
    public class AgentDailyActivity
    {
        public string FormattedDate { get; set; }
        public string Agent { get; set; }
        public string Location{ get; set; }

        public string LogonTime { get; set; }
        public string LogoffTime { get; set; }
        public int LogonHour { get; set; }
        public int LogoffHour { get; set; }

        public double Hours { get; set; }


        public int Leads { get; set; }
        public int TENJobs { get; set; }
        public int IndeedJobs { get; set; }
        public int UdemyCourses { get; set; }

        public static List<AgentDailyActivity> Create(List<Agent> agentprofiles, DateTime startdate, DateTime enddate, string agent)
        {
            AgentEventClient aec = new AgentEventClient();
            List<AgentEvent> allrecords = new List<AgentEvent>();

            DateTime cursordate = startdate;

            if (agent != null && agent != "")
            {
                while (cursordate <= enddate)
                {
                    allrecords.AddRange(aec.GetAllByPartition(cursordate.ToString("yyyyMM")).Where(x => x.EventTime.ToString("yyyyMMdd") == cursordate.ToString("yyyyMMdd") && x.Agent == agent).OrderBy(x => x.Timestamp));
                    cursordate = cursordate.AddDays(1);
                }
            }
            else
            {
                while (cursordate <= enddate)
                {
                    allrecords.AddRange(aec.GetAllByPartition(cursordate.ToString("yyyyMM")).Where(x => x.EventTime.ToString("yyyyMMdd") == cursordate.ToString("yyyyMMdd")).OrderBy(x => x.Timestamp));
                    cursordate = cursordate.AddDays(1);
                }
            }

            List<AgentDailyActivity> retlist = new List<AgentDailyActivity>();

            List<AgentLocationDate> alds = GetAgentDateList(allrecords);
                        
            DateTime currenttime = EasternTimeConverter.Convert(DateTime.UtcNow);

            foreach (AgentLocationDate ald in alds)
            {
                try
                {
                    if (ald.Agent == "victorr")
                    {
                        Console.Write("");
                    }
                    AgentEvent logonevent = GetLogonEvent(allrecords, ald);
                    AgentEvent logoffevent = GetLogoffEvent(allrecords, ald);

                    double hoursworked = 0;

                    Agent a = agentprofiles.SingleOrDefault(x => x.LoginName == ald.Agent.Replace("cindy","sydneyc"));
                    bool currentlyloggedon = false;
                    if (a.CurrentStatus == "loggedon" && logonevent != null && logonevent.EventTime.ToString("yyyyMMdd") == currenttime.ToString("yyyyMMdd"))
                    {
                        currentlyloggedon = true;
                    }


                    if (logonevent != null && logoffevent != null)
                    {
                        if (currentlyloggedon)
                        {
                            //relogged on
                            hoursworked = (double)(currenttime.Ticks - logonevent.EventTime.Ticks) / TimeSpan.TicksPerHour;
                        }
                        else
                        {
                            hoursworked = (double)(logoffevent.EventTime.Ticks - logonevent.EventTime.Ticks) / TimeSpan.TicksPerHour;
                        }
                    }
                    else if (logonevent != null && logoffevent == null && logonevent.EventTime.ToString("yyyyMMdd") == currenttime.ToString("yyyyMMdd"))
                    {
                        hoursworked = (double)(currenttime.Ticks - logonevent.EventTime.Ticks) / TimeSpan.TicksPerHour;
                    }


                    retlist.Add(new AgentDailyActivity
                    {
                        FormattedDate = ald.Date,
                        Agent = ald.Agent,
                        Location = ald.Location,

                        LogonTime = logonevent != null ? logonevent.EventTime.ToString("HH:mm") : "",
                        LogonHour = logonevent != null ? int.Parse(logonevent.EventTime.ToString("HH")) : -1,


                        LogoffTime = logoffevent != null && !currentlyloggedon ? logoffevent.EventTime.ToString("HH:mm") : "",
                        LogoffHour = logoffevent != null && !currentlyloggedon ? int.Parse(logoffevent.EventTime.ToString("HH")) : -1,

                        Hours = hoursworked


                    });
                }
                catch (Exception ex)
                {
                    Console.Write(ex.Message);
                }
            }

            return retlist;
        }

        private static List<AgentLocationDate> GetAgentLocationDateList(List<AgentEvent> events)
        {
            List<AgentLocationDate> retlist = new List<AgentLocationDate>();

            foreach(AgentEvent item in events)
            {
                if (retlist.SingleOrDefault(x => x.Agent == item.Agent && x.Location == item.Location && x.Date == item.EventTime.ToString("yyyyMMdd")) == null)
                {
                    retlist.Add(new AgentLocationDate { Agent = item.Agent, Location = item.Location, Date = item.EventTime.ToString("yyyyMMdd") });
                }
            }

            return retlist;
        }
        private static List<AgentLocationDate> GetAgentDateList(List<AgentEvent> events)
        {
            List<AgentLocationDate> retlist = new List<AgentLocationDate>();

            foreach (AgentEvent item in events)
            {
                if (retlist.SingleOrDefault(x => x.Agent == item.Agent && x.Date == item.EventTime.ToString("yyyyMMdd")) == null)
                {
                    retlist.Add(new AgentLocationDate { Agent = item.Agent, Location = item.Location, Date = item.EventTime.ToString("yyyyMMdd") });
                }
            }

            return retlist;
        }

        private static AgentEvent GetLogonEvent(List<AgentEvent> events, AgentLocationDate ald)
        {
            IOrderedEnumerable<AgentEvent> orderedevents = events.Where(x => 
                x.EventType == "logon" && 
                x.Agent == ald.Agent && 
                //x.Location == ald.Location && 
                x.EventTime.ToString("yyyyMMdd") == ald.Date)
                .OrderBy(x => x.EventTime);

            if (orderedevents.Count() > 0)
            {
                return orderedevents.ElementAt(0);
            }

            return null;
        }

        private static AgentEvent GetLogoffEvent(List<AgentEvent> events, AgentLocationDate ald)
        {
            IOrderedEnumerable<AgentEvent> orderedevents = events.Where(x =>
                x.EventType == "logoff" &&
                x.Agent == ald.Agent &&
                //x.Location == ald.Location &&
                x.EventTime.ToString("yyyyMMdd") == ald.Date)
                .OrderByDescending(x => x.EventTime);

            if (orderedevents.Count() > 0)
            {
                return orderedevents.ElementAt(0);
            }

            return null;
        }
    }
}