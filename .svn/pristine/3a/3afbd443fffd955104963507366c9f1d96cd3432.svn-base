using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.StorageClient;
using Microsoft.WindowsAzure.ServiceRuntime;
using SkillCow.Classes.Cloud.TableStorage.DirectClients.GeoIndex;

namespace SkillCow.Classes.Cloud.TableStorage.DirectClients.Schools.GeoIndex
{
    public class GeoIndexNationalClient : ChainDateTableServiceClientBase<GeoIndexNational>, IGeoIndexClient
    {
        public GeoIndexNationalClient()
            : base("skillcowdirectschoolgeoindexnational")
        {
        }

        public bool AddProgram(string partition, string programid, string campuskey, string clientkey, long attributemask, long importantthingsmask)
        {
            try{
                this.AddNewItem(new GeoIndexNational() { PartitionKey = partition, RowKey = programid, CampusRowKey = campuskey, ClientRowKey = clientkey, AttributeMask = attributemask, ImportantThingsMask = importantthingsmask });
            }
            catch
            {
            }
            return true;
        }
        public bool RemoveProgram(string partition, string programid)
        {
            try
            {
                this.Delete(this.GetByPartitionAndRowKey(partition, programid));
            }
            catch
            {
            }
            return true;
        }
    }
}