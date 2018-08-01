using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.WindowsAzure.StorageClient;
using SkillCowResponsive.Classes.Helpers;
using Newtonsoft.Json.Linq;

namespace SkillCowResponsive.Classes.Cloud.TableStorage.PendingSchool
{
    public class PendingSchool : TableServiceEntity
    {
        public PendingSchool()
        {
            PartitionKey = "pendingschool";          
            Timestamp = DateTime.UtcNow;
            RowKey = ShortGuidGenerator.NewGuid();
            SubmitedOn = EasternTimeConverter.Convert(DateTime.UtcNow);
            Pending = true;
            Approved = false;
            Duplicate = false;
            Incorrect = false;
        }
        //rowkey - school phone number, just digits
        public string SchoolName { get; set; }
        public string OfficialID { get; set; }
        public string PhoneNumber { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string ZipCode { get; set; }

        public string Admin { get; set; }
        public DateTime SubmitedOn { get; set; }
        public bool Pending { get; set; }
        public bool Approved { get; set; }
        public bool Duplicate { get; set; }
        public bool Incorrect { get; set; }
    }
}