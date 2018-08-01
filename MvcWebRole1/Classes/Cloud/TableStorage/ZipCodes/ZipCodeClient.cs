using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.StorageClient;
using Microsoft.WindowsAzure.ServiceRuntime;


namespace SkillCow.Classes.Cloud.TableStorage
{
    public class ZipCodeClient : ChainDateTableServiceClientBase<ZipCode>
    {
        public ZipCodeClient()
            : base("zipcodes")
        {
        }

        public CloudTableQuery<ZipCode> GetAll()
        {
            return (from e in TableContext().CreateQuery<ZipCode>(tableName)
                    select e).AsTableServiceQuery<ZipCode>();

        }
        public CloudTableQuery<ZipCode> GetAllByState(string statecode)
        {
            return (from e in TableContext().CreateQuery<ZipCode>(tableName)
                    where e.StateCode == statecode
                    select e).AsTableServiceQuery<ZipCode>();

        }

#warning zip codes need to be published to the blob cloud
#warning publish zips by state
    }
}