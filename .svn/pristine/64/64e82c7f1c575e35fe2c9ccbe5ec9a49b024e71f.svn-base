using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.WindowsAzure.StorageClient;
using SkillCowResponsive.Classes.Helpers;
using Newtonsoft.Json.Linq;

namespace SkillCowResponsive.Classes.Cloud.TableStorage.AssessmentDimensionsRating
{
    public class AssessmentDimensionsRating : TableServiceEntity
    {
        public AssessmentDimensionsRating()
        {
            Timestamp = DateTime.UtcNow;
        }
        //PartitionKey = school.RowKey
        //RowKey = user.RowKey + dimension
        public string Dimension { get; set; }
        public string Value { get; set; }
        public string Misc { get; set; }
        public string Student { get; set; }
        public string GradYear { get; set; }
        public string Teacher { get; set; }
        public string Group { get; set; }
    }
}