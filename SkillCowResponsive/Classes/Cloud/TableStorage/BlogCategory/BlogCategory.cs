using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.WindowsAzure.StorageClient;
using SkillCowResponsive.Classes.Helpers;
using Newtonsoft.Json.Linq;

namespace SkillCowResponsive.Classes.Cloud.TableStorage.BlogCategory
{
    public class BlogCategory : TableServiceEntity
    {
        public BlogCategory()
        {
            PartitionKey = "blogCategory";
            Timestamp = DateTime.UtcNow;
        }
        //RowKey - category name
        public string Category { get; set; }
        public int TotalPosts { get; set; }
        public int PublicPosts { get; set; }
    }
}