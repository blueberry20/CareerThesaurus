using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.WindowsAzure.StorageClient;
using SkillCowResponsive.Classes.Helpers;
using Newtonsoft.Json.Linq;

namespace SkillCowResponsive.Classes.Cloud.TableStorage.UserAccount
{
    public class UserAccount : TableServiceEntity
    {
        public UserAccount()
        {
            Timestamp = DateTime.UtcNow;
            EmailConfirmed = false;
            CreatedOn = EasternTimeConverter.Convert(DateTime.UtcNow);
        }
        //PartitionKey = 1 char in email and email length
        //RowKey = email
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public string ProfileType { get; set; }
        public string ProfileID { get; set; }
        public DateTime CreatedOn { get; set; }
        public bool EmailConfirmed { get; set; }

        public override string ToString()
        {
            return Email;
        }
    }
}