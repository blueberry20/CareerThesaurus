using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.WindowsAzure.StorageClient;
using SkillCowResponsive.Classes.Helpers;
using Newtonsoft.Json.Linq;

namespace SkillCowResponsive.Classes.Cloud.TableStorage.AdminProfile
{
    public class AdminProfile : TableServiceEntity
    {
        public AdminProfile()
        {
            PartitionKey = "adminProfile";
            Timestamp = DateTime.UtcNow;
        }
        //RowKey = email
        public string PhoneNumber { get; set; }
    }
}