using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.WindowsAzure.StorageClient;

namespace SkillCowResponsive.Classes.Cloud.TableStorage.AdminAccount
{
    public class AdminAccount : TableServiceEntity
    {
        public AdminAccount()
        {
            PartitionKey = "admin";
            Timestamp = DateTime.UtcNow;
            ConnectionToSchoolConfirmed = false;
            SchoolSelected = false;
        }
        //only one per school, so if status change, entry deleted and new created
        //RowKey = email
        public string PhoneNumber { get; set; } // direct number
        public string PhoneExtension { get; set; } // extension
        public string School { get; set; } // school they in, added upon selection from list or request send, if rejected change to null or empty string
        public bool SchoolSelected { get; set; } // true if school was selected from list or request was submited. if rejected change to false
        public bool ConnectionToSchoolConfirmed { get; set; } // set to true when verified, also school.SchoolAdmin entry updated
        public string RequestStatus { get; set; } // status of adding school
    }
}