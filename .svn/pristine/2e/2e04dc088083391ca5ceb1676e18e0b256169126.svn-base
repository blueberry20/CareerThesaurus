using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.WindowsAzure.StorageClient;
using SkillCowResponsive.Classes.Helpers;
using Newtonsoft.Json.Linq;

namespace SkillCowResponsive.Classes.Cloud.TableStorage.AssessmentCareerRating
{
    public class AssessmentCareerRating : TableServiceEntity
    {
        public AssessmentCareerRating()
        {
            Timestamp = DateTime.UtcNow;
        }
        //PartitionKey = school.RowKey
        //RowKey = user.RowKey + dolcode
        public string DolCode { get; set; }
        public string Rating { get; set; }
        public string Student { get; set; }
        public string GradYear { get; set; }
        public string Teacher { get; set; }
        public string Group { get; set; }
    }
}