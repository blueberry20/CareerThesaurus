using Microsoft.WindowsAzure.StorageClient;
using SkillCowResponsive.Classes.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SkillCowResponsive.Classes.Cloud.TableStorage.AdminMisc
{
    public class AdminMisc : TableServiceEntity
    {
        public AdminMisc()
        {
            PartitionKey = "adminmisc";
            Timestamp = DateTime.UtcNow;
            LastTimeUpdated = EasternTimeConverter.Convert(DateTime.UtcNow);
        }

        public string Notes { get; set; }
        public DateTime LastTimeUpdated { get; set; }
    }
}