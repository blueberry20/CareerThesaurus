using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.WindowsAzure.StorageClient;
using SkillCowResponsive.Classes.Helpers;
using Newtonsoft.Json.Linq;

namespace SkillCowResponsive.Classes.Cloud.TableStorage.StudentProfile
{
    public class StudentProfile : TableServiceEntity
    {
        public StudentProfile()
        {
            Timestamp = DateTime.UtcNow;
        }
        //PartitionKey = 1 char in email and email length
        //RowKey = email
        public string Gender { get; set; }
        public string GradYear { get; set; }
        public string SchoolZip { get; set; }
        public string School { get; set; }
        public string Teacher { get; set; }
        public string Group { get; set; }
    }
}