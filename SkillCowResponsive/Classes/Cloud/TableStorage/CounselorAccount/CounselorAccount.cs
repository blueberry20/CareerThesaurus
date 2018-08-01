using Microsoft.WindowsAzure.StorageClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SkillCowResponsive.Classes.Cloud.TableStorage.CounselorAccount
{
    public class CounselorAccount : TableServiceEntity
    {
        public CounselorAccount()
        {
            PartitionKey = "counselor"; 
            Timestamp = DateTime.UtcNow;
            Active = true; // active by default right after creating account
        }
        // PhoneNumber, PhoneExtension, School can be changed if person moved to another school and Active status was changed to false
        // RowKey = email
        public string PhoneNumber { get; set; } // direct number 

        public string PhoneExtension { get; set; } // extension
        public string School { get; set; } // school they in
        public bool Active { get; set; } //if still work at that school and can have access to info
    }
}