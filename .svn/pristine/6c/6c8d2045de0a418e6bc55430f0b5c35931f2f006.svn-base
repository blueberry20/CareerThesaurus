using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.StorageClient;
using Microsoft.WindowsAzure.ServiceRuntime;


namespace SkillCowResponsive.Classes.Cloud.TableStorage.DirectClients.Employers
{
    public class DirectEmployerClientCampusProgramClient : ChainDateTableServiceClientBase<DirectEmployerClientCampusProgram>
    {
        public DirectEmployerClientCampusProgramClient()
            : base("skillcowdirectemployerclientcampusprogram")
        {
        }

        public IEnumerable<DirectEmployerClientCampusProgram> GetAllByClientId(string clientid)
        {
            return (from e in Entities()
                    where e.ClientRowKey == clientid
                    select e).AsEnumerable();
        }
    }
}