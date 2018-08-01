using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.StorageClient;
using Microsoft.WindowsAzure.ServiceRuntime;


namespace SkillCowResponsive.Classes.Cloud.TableStorage.DirectClients.Schools
{
    public class DirectSchoolClientClient : ChainDateTableServiceClientBase<DirectSchoolClient>
    {
        public DirectSchoolClientClient()
            : base("skillcowdirectschoolclient")
        {
        }

        public DirectSchoolClient GetByName(string value)
        {
            return (from e in Entities()
                    where e.Name == value
                    select e).SingleOrDefault();
        }
        public DirectSchoolClient GetByClientId(string value)
        {
            return (from e in Entities()
                    where e.ClientId == value
                    select e).SingleOrDefault();
        }

        public DirectSchoolClient Logon(string username, string password)
        {
            return (from e in Entities()
                    where e.UserName == username && e.Password == password
                    select e).SingleOrDefault();
        }
    }
}