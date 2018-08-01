using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.WindowsAzure.StorageClient;
using SkillCowResponsive.Classes.Helpers;
using Newtonsoft.Json.Linq;

namespace SkillCowResponsive.Classes.Cloud.TableStorage.BlogTag
{
    public class BlogTag : TableServiceEntity
    {
        public BlogTag()
        {
            PartitionKey = "blogTag";
            Timestamp = DateTime.UtcNow;
        }
        //RowKey - tag name
        public string Tag { get; set; }
        public int TotalPosts { get; set; }
        public int PublicPosts { get; set; }
    }
}