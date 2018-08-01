using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.StorageClient;
using Microsoft.WindowsAzure.ServiceRuntime;


namespace SkillCowResponsive.Classes.Cloud.TableStorage.DirectClients.Employers
{
    public class DirectEmployerClientCampusClient : ChainDateTableServiceClientBase<DirectEmployerClientCampus>
    {
        public DirectEmployerClientCampusClient()
            : base("skillcowdirectemployerclientlocation")
        {
        }

        public IEnumerable<DirectEmployerClientCampus> GetAllByClientId(string clientid)
        {
            return (from e in Entities()
                    where e.ClientRowKey == clientid
                    select e).AsEnumerable();
        }
    }
}