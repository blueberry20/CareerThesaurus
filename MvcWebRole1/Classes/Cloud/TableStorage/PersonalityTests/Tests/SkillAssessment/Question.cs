using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.WindowsAzure.StorageClient;
using SkillCow.Classes.Helpers;

namespace SkillCow.Classes.Cloud.TableStorage.PersonalityTests.Tests.SkillAssessment
{
    public class Question : TableServiceEntity
    {
        public Question()
        {
            PartitionKey = "same";  
        }

        public string Category { get; set; }
        public string Dimension { get; set; }
        public int Sequence { get; set; }
        public string Text { get; set; }
        public string Answer1 { get; set; }
        public string Answer2 { get; set; }
        public string Value1 { get; set; }
        public string Value2 { get; set; }
        public string TiebreakerFor { get; set; }
    }
}