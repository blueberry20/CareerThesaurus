using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.StorageClient;
using Microsoft.WindowsAzure.ServiceRuntime;
using System.Data.Services.Client;

namespace SkillCow.Classes.Cloud.TableStorage.ABTests
{
    public class ABTestImpressionClient : ChainDateTableServiceClientBase<ABTestImpression>
    {
        public ABTestImpressionClient()
            : base("abtestimpression")
        {
        }

        public void AddImpression( string moduleName, string goalName, string testId)
        {
            base.AddNewItem(new ABTestImpression { Module = moduleName, Goal = goalName, TestID = testId });
        }
        
        public int CountA()
        {
            return (from i in CloudQuery().Execute()
                           select i).Count();
            
        }


        public CloudTableQuery<ABTestImpression> GetAllByGoal(string goal, string partitionKeyYYYYMMDD)
        {
            // Specify a partition query, using "Smith" as the partition key,
            // with the row key being up to the letter "E"

            if (partitionKeyYYYYMMDD != null && partitionKeyYYYYMMDD != "")
            {
                return (from e in TableContext().CreateQuery<ABTestImpression>(tableName)
                        where e.PartitionKey == partitionKeyYYYYMMDD &&
                            e.Goal == goal
                        select e).AsTableServiceQuery<ABTestImpression>();
            }
            else
            {
                return (from e in TableContext().CreateQuery<ABTestImpression>(tableName)
                        where e.Goal == goal
                        select e).AsTableServiceQuery<ABTestImpression>();
            }
        }

        public CloudTableQuery<ABTestImpression> GetAll(string partitionKeyYYYYMMDD)
        {
            // Specify a partition query, using "Smith" as the partition key,
            // with the row key being up to the letter "E"

            if (partitionKeyYYYYMMDD != null && partitionKeyYYYYMMDD != "")
            {
                return (from e in TableContext().CreateQuery<ABTestImpression>(tableName)
                        where e.PartitionKey == partitionKeyYYYYMMDD
                        select e).AsTableServiceQuery<ABTestImpression>();
            }
            else
            {
                return (from e in TableContext().CreateQuery<ABTestImpression>(tableName)
                        select e).AsTableServiceQuery<ABTestImpression>();
            }
        }


        //private CloudTableQuery<ABTestImpression> GetQuery()
        //{
        //    int _currentPage = 0;
        //    int _pageSize = 1000;

        //    // Get a query for the Titles feed from the context.
        //    DataServiceQuery<ABTestImpression> query = TableContext().CreateQuery<ABTestImpression>(tableName);
        //    if (_currentPage == 0)
        //    {
        //        // If this is the first page, then also include a count of all titles.
        //        query = query.IncludeTotalCount();
        //    }
        //    // Add paging to the query.
        //    query = query.Skip(_currentPage * _pageSize).Take(_pageSize) as DataServiceQuery<ABTestImpression>;

        //    return query.AsTableServiceQuery();
        //}

    }
   
}