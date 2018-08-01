using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.StorageClient;
using Microsoft.WindowsAzure.ServiceRuntime;

namespace SkillCowResponsive.Classes.Cloud.TableStorage.BlogPost
{
    public class BlogPostClient : TableServiceClientBase<BlogPost>
    {
        public BlogPostClient()
            :base("BlogPost")
        {
        }
        public CloudTableQuery<BlogPost> GetAllNotPublish()
        {
            return (from e in TableContext().CreateQuery<BlogPost>(tableName)
                    where e.PartitionKey == "blogPost" && e.Public == false
                    select e).AsTableServiceQuery<BlogPost>();
        }
        public CloudTableQuery<BlogPost> GetAllRemoved()
        {
            return (from e in TableContext().CreateQuery<BlogPost>(tableName)
                    where e.PartitionKey == "blogPost" && e.Removed == true
                    select e).AsTableServiceQuery<BlogPost>();
        }
        public CloudTableQuery<BlogPost> GetAllPublicAndNotRemoved()
        {
            return (from e in TableContext().CreateQuery<BlogPost>(tableName)
                    where e.PartitionKey == "blogPost" && e.Public == true && e.Removed == false
                    select e).AsTableServiceQuery<BlogPost>();
        }
        public CloudTableQuery<BlogPost> GetAllForCategory(string category)
        {
            return (from e in TableContext().CreateQuery<BlogPost>(tableName)
                    where e.PartitionKey == "blogPost" && e.Category == category.ToLower() && e.Public == true && e.Removed == false
                    select e).AsTableServiceQuery<BlogPost>();
        }
        public CloudTableQuery<BlogPost> GetAllFromArchive(DateTime date)
        {
            return (from e in TableContext().CreateQuery<BlogPost>(tableName)
                    where e.PartitionKey == "blogPost" && e.Date > date && e.Date <= date.AddMonths(1) && e.Public == true && e.Removed == false
                    select e).AsTableServiceQuery<BlogPost>();
        }
        public List<BlogPost> GetAllForTag(string tag)
        {
            var posts = TableContext().CreateQuery<BlogPost>(tableName);
            List<BlogPost> result = new List<BlogPost>();
            foreach (BlogPost e in posts)
            {
                bool contain = e.Tags.Split(',').Contains(tag.ToLower());
                if (e.PartitionKey == "blogPost" && e.Public == true && e.Removed == false && contain)
                {
                    result.Add(e);
                }
            }
            return result;
        }
        public CloudTableQuery<BlogPost> GetAllForTags(string[] tags)
        {
            return (from e in TableContext().CreateQuery<BlogPost>(tableName)
                    where e.PartitionKey == "blogPost" && tags.All( x=> e.Tags.Split(',').Contains(x)) && e.Public == true && e.Removed == false
                    select e).AsTableServiceQuery<BlogPost>();
        }
    }
}