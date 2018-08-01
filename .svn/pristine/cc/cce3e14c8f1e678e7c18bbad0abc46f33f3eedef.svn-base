using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.StorageClient;
using Microsoft.WindowsAzure.ServiceRuntime;


namespace SkillCowResponsive.Classes.Cloud.TableStorage
{
    public class SiteVisitClient : ChainDateTableServiceClientBase<SiteVisit>
    {
        public SiteVisitClient()
            : base("skillcowsitevisits")
        {
        }


        public CloudTableQuery<SiteVisit> GetAll(string partitionKeyYYYYMMDD)
        {
            // Specify a partition query, using "Smith" as the partition key,
            // with the row key being up to the letter "E"

            if (partitionKeyYYYYMMDD != null && partitionKeyYYYYMMDD != "")
            {
                return (from e in TableContext().CreateQuery<SiteVisit>(tableName)
                        where e.PartitionKey == partitionKeyYYYYMMDD
                        select e).AsTableServiceQuery<SiteVisit>();
            }
            else
            {
                return (from e in TableContext().CreateQuery<SiteVisit>(tableName)
                        select e).AsTableServiceQuery<SiteVisit>();
            }
        }
    }
}