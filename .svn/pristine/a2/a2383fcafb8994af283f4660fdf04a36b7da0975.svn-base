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
    public class GeoIndexAddZipClient : ChainDateTableServiceClientBase<GeoIndexAddZip>, IGeoIndexClient
    {
        public GeoIndexAddZipClient()
            : base("skillcowdirectschoolgeoindexaddzip")
        {
        }

        public bool AddProgram(string zip, string programid, string campuskey, string clientkey, long attributemask, long importantthingsmask)
        {
            this.AddNewItem(new GeoIndexAddZip() { PartitionKey = zip, RowKey = programid, CampusRowKey = campuskey, ClientRowKey = clientkey, AttributeMask = attributemask, ImportantThingsMask = importantthingsmask });
            return true;
        }

        public bool RemoveProgram(string zip, string programid)
        {
            try
            {
                this.Delete(this.GetByPartitionAndRowKey(zip, programid));
            }
            catch
            {
            }
            return true;
        }
    }
}