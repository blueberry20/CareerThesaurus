using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.WindowsAzure.StorageClient;
using SkillCowResponsive.Classes.Helpers;
using Newtonsoft.Json.Linq;

namespace SkillCowResponsive.Classes.Cloud.TableStorage.School
{
    public class SchoolAccount : TableServiceEntity
    {
        public SchoolAccount()
        {
            PartitionKey = "school";          
            Timestamp = DateTime.UtcNow;
        }
        //RowKey = Phone number
        public string SchoolName { get; set; }
        public string OfficialID { get; set; }
        public string PhoneNumber { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string ZipCode { get; set; }

        public string Admin { get; set; } // admins email connected to school, only set after verification and will be updated if admin change
    }
}