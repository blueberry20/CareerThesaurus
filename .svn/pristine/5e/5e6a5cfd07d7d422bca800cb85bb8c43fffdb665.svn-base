using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.WindowsAzure.StorageClient;
using SkillCowResponsive.Classes.Helpers;
using Newtonsoft.Json.Linq;

namespace SkillCowResponsive.Classes.Cloud.TableStorage.AssessmentGroup
{
    public class AssessmentGroup : TableServiceEntity
    {
        public AssessmentGroup()
        {
            Timestamp = DateTime.UtcNow;
        }
        //PartitionKey = school.RowKey
        //RowKey = 5 char guid / pin code
        public string Teacher { get; set; }
        public string Group { get; set; }
    }
}