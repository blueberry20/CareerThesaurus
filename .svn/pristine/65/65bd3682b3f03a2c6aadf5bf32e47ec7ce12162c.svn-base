using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.WindowsAzure.StorageClient;
using SkillCowResponsive.Classes.Helpers;
using Newtonsoft.Json.Linq;

namespace SkillCowResponsive.Classes.Cloud.TableStorage.DirectClients.LeadCaps
{
    public class LeadCap : TableServiceEntity
    {
        public LeadCap()
        {
            PartitionKey = "same";
        }
                
        public long Total { get; set; }
        public long Annually { get; set; }
        public long Monthly { get; set; }
        public long Weekly { get; set; }
        public long Daily { get; set; }
    }
}