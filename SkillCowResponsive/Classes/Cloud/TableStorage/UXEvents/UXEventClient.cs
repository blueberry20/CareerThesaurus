using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.StorageClient;
using Microsoft.WindowsAzure.ServiceRuntime;


namespace SkillCowResponsive.Classes.Cloud.TableStorage
{
    public class UXEventClient : ChainDateTableServiceClientBase<UXEvent>
    {
        public UXEventClient()
            : base("skillcowuxevent")
        {
        }

        public CloudTableQuery<UXEvent> GetAll()
        {
            return (from e in TableContext().CreateQuery<UXEvent>(tableName)
                    select e).AsTableServiceQuery<UXEvent>();

        }

        public CloudTableQuery<UXEvent> GetAll(string partitionKeyYYYYMMDD)
        {
            // Specify a partition query, using "Smith" as the partition key,
            // with the row key being up to the letter "E"

            if (partitionKeyYYYYMMDD != null && partitionKeyYYYYMMDD != "")
            {
                return (from e in TableContext().CreateQuery<UXEvent>(tableName)
                        where e.PartitionKey == partitionKeyYYYYMMDD
                        select e).AsTableServiceQuery<UXEvent>();
            }
            else
            {
                return (from e in TableContext().CreateQuery<UXEvent>(tableName)
                        select e).AsTableServiceQuery<UXEvent>();
            }
        }
    }
}