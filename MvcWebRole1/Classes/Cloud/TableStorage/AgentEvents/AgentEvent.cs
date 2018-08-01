using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.WindowsAzure.StorageClient;
using SkillCow.Classes.Helpers;

namespace SkillCow.Classes.Cloud.TableStorage
{
    public class AgentEvent : TableServiceEntity
    {
        public AgentEvent()
        {
        }
        public AgentEvent(string agent, string eventtype, string location)
        {
            DateTime t = EasternTimeConverter.Convert(DateTime.UtcNow);
            PartitionKey = t.ToString("yyyyMM");
            RowKey = ShortGuidGenerator.NewGuid();
            EventTime = t;
            Agent = agent;
            EventType = eventtype;
            Location = location;
        }

        public string Agent { get; set; }
        public string EventType { get; set; }
        public DateTime EventTime { get; set; }
        public string Location { get; set; }
    }

    
}