using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.WindowsAzure.StorageClient;
using SkillCow.Classes.Helpers;

namespace SkillCow.Classes.Cloud.TableStorage
{
    public class UXEvent : TableServiceEntity
    {
        public UXEvent()
        {
            DateTime t = EasternTimeConverter.Convert(DateTime.UtcNow);
            PartitionKey = t.ToString("yyyyMMdd");
            RowKey = ShortGuidGenerator.NewGuid();
            Timestamp = t;
        }

        public string Medium { get; set; }
        public string EventName { get; set; }

        public string Salutation { get; set; }
        public string Gender { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Zip { get; set; }
        public string Address1 { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string IP { get; set; }
        public string CampaignId { get; set; }
        
        public string GradYear { get; set; }
        public string EduIntent { get; set; }
        
        //GA
        public string UtmSource { get; set; }
        public string UtmCampaign { get; set; }
        public string UtmContent { get; set; }
        public string UtmTerm { get; set; }

        public string TestData { get; set; } //JSON {"completed":1, "timeseconds":360, "testresults":[]}
        public string ImportantThings { get; set; } //JSON ["","",""]

        public string ProfessionsRecomended { get; set; } //JSON ["","",""]
        public string ProfessionsSelected { get; set; } //JSON ["","",""]

        public string CustomData { get; set; } 
    }
}