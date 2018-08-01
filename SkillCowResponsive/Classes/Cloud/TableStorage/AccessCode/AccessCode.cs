using Microsoft.WindowsAzure.StorageClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SkillCowResponsive.Classes.Cloud.TableStorage.AccessCode
{
    public class AccessCode : TableServiceEntity
    {
        public AccessCode()
        {
            PartitionKey = "accesscode";
            Timestamp = DateTime.UtcNow;            
        }
        // RowKey is guid used in url

        public string School { get; set; } // must match with User.School, if not, User.School can be updated if user.Active == false

        public string Code { get; set; } // code it self (old version had 5 char system)
        public string Year { get; set; } // year when taking this test
        public string Grade { get; set; } // grade student in this year
        public string Counselor { get; set; } // counselor they are assigned to this year
        public string GroupName { get; set; } // group name they in (alternative to counselor)
    }
}