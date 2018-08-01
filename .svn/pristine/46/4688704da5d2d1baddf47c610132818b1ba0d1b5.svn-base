using Microsoft.WindowsAzure.StorageClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SkillCowResponsive.Classes.Cloud.TableStorage.CounselorInvite
{
    public class CounselorInvite : TableServiceEntity
    {
        public CounselorInvite()
        {
            PartitionKey = "invite";
            Timestamp = DateTime.UtcNow;
        }
        // RowKey = guid used in link
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string School { get; set; }
        public string Email { get; set; }
    }
}