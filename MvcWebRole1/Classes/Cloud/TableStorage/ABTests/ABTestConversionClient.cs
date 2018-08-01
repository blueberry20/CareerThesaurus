using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.StorageClient;
using Microsoft.WindowsAzure.ServiceRuntime;

namespace SkillCow.Classes.Cloud.TableStorage.ABTests
{
    public class ABTestConversionClient : ChainDateTableServiceClientBase<ABTestConversion>
    {
        public ABTestConversionClient()
            : base("abtestconversion")
        {
        }

        public CloudTableQuery<ABTestConversion> GetAllByGoal(string goal, string partitionKeyYYYYMMDD)
        {
            // Specify a partition query, using "Smith" as the partition key,
            // with the row key being up to the letter "E"
            if (partitionKeyYYYYMMDD != null && partitionKeyYYYYMMDD != "")
            {
                return (from e in TableContext().CreateQuery<ABTestConversion>(tableName)
                        where e.PartitionKey == partitionKeyYYYYMMDD &&
                        e.Goal==goal
                        select e).AsTableServiceQuery<ABTestConversion>();
            }
            else
            {
                return (from e in TableContext().CreateQuery<ABTestConversion>(tableName)
                        where e.Goal == goal
                        select e).AsTableServiceQuery<ABTestConversion>();
            }
        }

        public CloudTableQuery<ABTestConversion> GetAll(string partitionKeyYYYYMMDD)
        {
            // Specify a partition query, using "Smith" as the partition key,
            // with the row key being up to the letter "E"
            if (partitionKeyYYYYMMDD != null && partitionKeyYYYYMMDD != "")
            {
                return (from e in TableContext().CreateQuery<ABTestConversion>(tableName)
                        where e.PartitionKey == partitionKeyYYYYMMDD
                        select e).AsTableServiceQuery<ABTestConversion>();
            }
            else
            {
                return (from e in TableContext().CreateQuery<ABTestConversion>(tableName)
                        select e).AsTableServiceQuery<ABTestConversion>();
            }
        }

        public void AddConversion(string goalName, string testId, int weight, int views)
        {
            base.AddNewItem(new ABTestConversion { Goal = goalName, TestID = testId, Weight=weight, Views = views, Timestamp = DateTime.UtcNow });
        }

        
        
    }
}