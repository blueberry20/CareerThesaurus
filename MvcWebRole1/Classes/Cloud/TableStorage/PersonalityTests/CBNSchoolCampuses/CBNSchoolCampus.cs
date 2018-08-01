using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.WindowsAzure.StorageClient;
using SkillCow.Classes.Helpers;

namespace SkillCow.Classes.Cloud.TableStorage.PersonalityTests.CBNSchoolCampuses
{
    public class CBNSchoolCampus : TableServiceEntity
    {
        public CBNSchoolCampus()
        {
            //PartitionKey = "same"; //Set to SchoolId
            RowKey = ShortGuidGenerator.NewGuid();
        }

        public string SchoolId { get; set; }
        public string CampusId { get; set; }

        public string CampusName { get; set; }
        public string CampusKey { get; set; }
        public string CampusCity { get; set; }
        public string CampusState { get; set; }
        public string CampusZip { get; set; }
        public string CampusType { get; set; }
        
        public string FormId { get; set; }
        public string FormUrl { get; set; }
        public string FormImage { get; set; }
        public string FormDescription { get; set; }
    }
}