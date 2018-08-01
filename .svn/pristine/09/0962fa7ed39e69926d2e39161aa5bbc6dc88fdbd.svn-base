using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.WindowsAzure.StorageClient;
using SkillCow.Classes.Helpers;

namespace SkillCow.Classes.Cloud.TableStorage
{
    public class Agent : TableServiceEntity
    {
        
        public Agent()
        {
            PartitionKey = "same";
            RowKey = ShortGuidGenerator.NewGuid();
        }

        public string Firstname { get; set; }
        public string Lastname { get; set; }

        public string LoginName { get; set; }
        public string LoginColor { get; set; }
        public string LoginCode { get; set; }
        public string Password { get; set; }

        public string Address { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Zip { get; set; }

        public string Email { get; set; }
        public string MobilePhone { get; set; }
        public string HomePhone { get; set; }
        
        public string EmploymentStatus { get; set; }
        
        public string CurrentStatus { get; set; }
        public string CurrentLocation { get; set; }
        public string AssignedLocation { get; set; }

        
        public string Supervisor { get; set; }

        public string Notes { get; set; }

        public double PayPerHour { get; set; }
        public double PayPerLead { get; set; }
    }

    
}