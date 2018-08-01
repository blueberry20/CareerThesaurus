using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.WindowsAzure.StorageClient;
using SkillCowResponsive.Classes.Helpers;

namespace SkillCowResponsive.Classes.Cloud.TableStorage.PersonalityTests.CBNSchools
{
    public class CBNSchool : TableServiceEntity
    {
        public CBNSchool()
        {
            PartitionKey = "same";  
        }

        public string Name { get; set; }

        public string FormId { get; set; }
        public string FormUrl { get; set; }
        public string FormImage { get; set; }
        public string FormDescription { get; set; }
    }
}