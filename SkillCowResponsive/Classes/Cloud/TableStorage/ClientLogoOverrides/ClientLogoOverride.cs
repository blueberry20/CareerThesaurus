using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.WindowsAzure.StorageClient;
using SkillCowResponsive.Classes.Helpers;
using Newtonsoft.Json.Linq;

namespace SkillCowResponsive.Classes.Cloud.TableStorage.ClientLogoOverrides
{
    public class ClientLogoOverride : TableServiceEntity
    {
        public ClientLogoOverride()
        {
            PartitionKey = "same";
            RowKey = ShortGuidGenerator.NewGuid();
        }

        public string ClientName { get; set; }
        public string ClientType { get; set; }
        public string ClientId { get; set; }
        public string LogoUrl { get; set; }
    }
}