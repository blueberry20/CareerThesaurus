using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.WindowsAzure.StorageClient;

namespace SkillCow.Classes.Cloud.TableStorage.ABTests
{
    public class ABTest : TableServiceEntity
    {
        public ABTest()
        {
        }

        public ABTest(string moduleName)
        {
            PartitionKey = "same";

            // Row key allows sorting, so we make sure the rows come back in time order.      
            RowKey = moduleName;
        }

        
    }
}