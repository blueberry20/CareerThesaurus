using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.WindowsAzure.StorageClient;
using SkillCow.Classes.Helpers;
using Newtonsoft.Json.Linq;

namespace SkillCow.Classes.Cloud.TableStorage.ClientSlideShows
{
    public class ClientSlideShow : TableServiceEntity
    {
        public ClientSlideShow()
        {
            PartitionKey = "same";
            RowKey = ShortGuidGenerator.NewGuid();
        }

        public string ClientName { get; set; }
        public string ClientType { get; set; }
        public string ClientId { get; set; }
        
    }
}