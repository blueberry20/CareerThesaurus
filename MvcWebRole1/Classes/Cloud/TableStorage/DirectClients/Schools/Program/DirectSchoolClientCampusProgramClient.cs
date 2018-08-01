using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.StorageClient;
using Microsoft.WindowsAzure.ServiceRuntime;


namespace SkillCow.Classes.Cloud.TableStorage.DirectClients.Schools
{
    public class DirectSchoolClientCampusProgramClient : ChainDateTableServiceClientBase<DirectSchoolClientCampusProgram>
    {
        public DirectSchoolClientCampusProgramClient()
            : base("skillcowdirectschoolclientcampusprogram")
        {
        }

        public IEnumerable<DirectSchoolClientCampusProgram> GetAllBySchoolId(string schoolid)
        {
            return (from e in Entities()
                    where e.ClientRowKey == schoolid
                    select e).AsEnumerable();
        }
    }
}