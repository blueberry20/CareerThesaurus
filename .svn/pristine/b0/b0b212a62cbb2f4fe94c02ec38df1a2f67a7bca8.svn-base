using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.WindowsAzure.StorageClient;
using SkillCowResponsive.Classes.Helpers;
using Newtonsoft.Json.Linq;

namespace SkillCowResponsive.Classes.Cloud.TableStorage.DirectClients.Employers
{
    public class DirectEmployerClientCampus : TableServiceEntity
    {
        public DirectEmployerClientCampus()
        {
            PartitionKey = "same";
            RowKey = ShortGuidGenerator.NewGuid();
            Timestamp = DateTime.UtcNow;
        }

        public string Status { get; set; }

        public string CampusId { get; set; }

        public string ClientRowKey { get; set; }
        public string ClientId { get; set; }
        public string CampusType { get; set; }
        public string Name { get; set; }

        public string Address { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Zip { get; set; }

        public override string ToString()
        {
            return Name;
        }
    }
}