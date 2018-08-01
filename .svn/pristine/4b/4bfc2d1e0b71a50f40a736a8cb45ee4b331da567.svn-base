using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.StorageClient;
using Microsoft.WindowsAzure.ServiceRuntime;


namespace SkillCow.Classes.Cloud.TableStorage.DirectClients.Schools
{
    public class DirectSchoolClientLeadClient : ChainDateTableServiceClientBase<DirectSchoolClientLead>
    {
        public DirectSchoolClientLeadClient()
            : base("skillcowdirectschoolclientlead")
        {
        }

        public long CountAllByPartitionSince(string partitionkey, DateTime starttime)
        {
            try
            {
                return (from e in Entities()
                        where e.PartitionKey == partitionkey && e.Timestamp >= starttime
                        select e).AsEnumerable().Count();
            }
            catch
            {
                return 0;
            }
        }
    }
}