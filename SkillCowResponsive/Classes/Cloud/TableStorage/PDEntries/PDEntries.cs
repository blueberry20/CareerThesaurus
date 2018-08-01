using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.WindowsAzure.StorageClient;
using SkillCowResponsive.Classes.Helpers;
using Newtonsoft.Json.Linq;

namespace SkillCowResponsive.Classes.Cloud.TableStorage.PDEntries
{
    public class PDEntries : TableServiceEntity
    {
        public PDEntries()
        {
            PartitionKey = DateTime.UtcNow.Date.ToString("MM-dd-yyyy");
            Timestamp = DateTime.UtcNow;
            RowKey = ShortGuidGenerator.NewGuid();
        }

        public string AgencyName { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Zip { get; set; }
        public string FullName { get; set; }
        public string Title { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
    }
}