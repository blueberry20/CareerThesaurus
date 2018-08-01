using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.WindowsAzure.StorageClient;
using SkillCowResponsive.Classes.Helpers;
using Newtonsoft.Json.Linq;

namespace SkillCowResponsive.Classes.Cloud.TableStorage.AssessmentInterestRating
{
    public class AssessmentInterestRating : TableServiceEntity
    {
        public AssessmentInterestRating()
        {
            Timestamp = DateTime.UtcNow;
        }
        //PartitionKey = school.RowKey
        //RowKey = user.RowKey + interest 
        public string Interest { get; set; }
        public string Rating { get; set; }
        public string Student { get; set; }
        public string GradYear { get; set; }
        public string Teacher { get; set; }
        public string Group { get; set; }
    }
}