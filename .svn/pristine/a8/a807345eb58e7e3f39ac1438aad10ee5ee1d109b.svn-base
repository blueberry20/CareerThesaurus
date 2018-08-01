using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.WindowsAzure.StorageClient;
using SkillCowResponsive.Classes.Helpers;
using Newtonsoft.Json.Linq;

namespace SkillCowResponsive.Classes.Cloud.TableStorage.ClientSlideShows
{
    public class ClientSlideShowSlide : TableServiceEntity
    {
        public ClientSlideShowSlide()
        {
            PartitionKey = "same";
            RowKey = ShortGuidGenerator.NewGuid();
        }

        public string ImageURL { get; set; }
        public string Caption { get; set; }
        public int Priority { get; set; }
    }
}