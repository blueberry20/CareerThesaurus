using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.WindowsAzure.StorageClient;
using SkillCowResponsive.Classes.Helpers;
using Newtonsoft.Json.Linq;

namespace SkillCowResponsive.Classes.Cloud.TableStorage.SchoolToTeacherConnection
{
    public class SchoolToTeacherConnection : TableServiceEntity
    {
        public SchoolToTeacherConnection()
        {
            Timestamp = DateTime.UtcNow;
            Active = true;
        }
        //PartitionKey = user.RowKey
        //RowKey = school.RowKey

        public bool Active { get; set; }
    }
}