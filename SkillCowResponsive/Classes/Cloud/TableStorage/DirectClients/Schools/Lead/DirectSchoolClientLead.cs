using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.WindowsAzure.StorageClient;
using SkillCowResponsive.Classes.Helpers;
using Newtonsoft.Json.Linq;

namespace SkillCowResponsive.Classes.Cloud.TableStorage.DirectClients.Schools
{
    public class DirectSchoolClientLead : TableServiceEntity
    {
        public DirectSchoolClientLead()
        {
            
            RowKey = ShortGuidGenerator.NewGuid();
            Timestamp = DateTime.UtcNow;
        }

        public string ClientId { get; set; }
        
        public string CampusId { get; set; }
        public string ProgramId { get; set; }
        public string ProgramName { get; set; }
        
        public string Salutation { get; set; }
        public string Gender { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }

        public string Address { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Zip { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string GradYear { get; set; }
        public string Military { get; set; }
        public string EducationLevel{ get; set; }
        public string GPA { get; set; }

        public string Status { get; set; }
        
    }
}