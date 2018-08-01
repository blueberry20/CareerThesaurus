using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.WindowsAzure.StorageClient;
using SkillCowResponsive.Classes.Helpers;


namespace SkillCowResponsive.Classes.Cloud.TableStorage
{
    public class SiteVisit : TableServiceEntity
    {
        public SiteVisit()
        {
            DateTime t = EasternTimeConverter.Convert(DateTime.UtcNow);
            PartitionKey = t.ToString("yyyyMMdd");
            RowKey = ShortGuidGenerator.NewGuid();
            
        }

        public string Controller { get; set; }
        public string Action{ get; set; }
        public string IP { get; set; }
        public string Browser{ get; set; }

        
    }
}