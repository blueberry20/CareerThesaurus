using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.WindowsAzure.StorageClient;
using SkillCowResponsive.Classes.Helpers;
using Newtonsoft.Json.Linq;

namespace SkillCowResponsive.Classes.Cloud.TableStorage.BlogPost
{
    public class BlogPost : TableServiceEntity
    {
        public BlogPost()
        {
            PartitionKey = "blogPost";
            Timestamp = DateTime.UtcNow;
        }
        //RowKey = 20140101title-title (yearmounthdaytitle)
        public string Author { get; set; }
        public DateTime Date { get; set; }
        public string Category { get; set; }
        public string Title { get; set; }
        public string HeaderImageCode { get; set; }
        public string Tags { get; set; }
        public string Article1 { get; set; }
        public string Article2 { get; set; }
        public string Article3 { get; set; }
        public string Article4 { get; set; }
        public string ArticleDescription { get; set; }
        public bool Public { get; set; }
        public bool Removed { get; set; }
    }
}