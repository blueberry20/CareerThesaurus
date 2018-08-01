using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.WindowsAzure.StorageClient;
using SkillCowResponsive.Classes.Helpers;
using Newtonsoft.Json.Linq;

namespace SkillCowResponsive.Classes.Cloud.TableStorage.TeacherToSchoolConnection
{
    public class TeacherToSchoolConnection : TableServiceEntity
    {
        public TeacherToSchoolConnection()
        {
            Timestamp = DateTime.UtcNow;
            Active = true;
        }
        //PartitionKey = school.RowKey
        //RowKey = user.RowKey

        public bool Active { get; set; }
    }
}