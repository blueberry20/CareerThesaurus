using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.StorageClient;
using Microsoft.WindowsAzure.ServiceRuntime;


namespace SkillCow.Classes.Cloud.TableStorage.DirectClients.Employers
{
    public class DirectEmployerClientClient : ChainDateTableServiceClientBase<DirectEmployerClient>
    {
        public DirectEmployerClientClient()
            : base("skillcowdirectemployerclient")
        {
        }

        public DirectEmployerClient GetByName(string value)
        {
            return (from e in Entities()
                    where e.Name == value
                    select e).SingleOrDefault();
        }
        public DirectEmployerClient GetByClientId(string value)
        {
            return (from e in Entities()
                    where e.ClientId == value
                    select e).SingleOrDefault();
        }

        public DirectEmployerClient Logon(string username, string password)
        {
            return (from e in Entities()
                    where e.UserName == username && e.Password == password
                    select e).SingleOrDefault();
        }
    }
}