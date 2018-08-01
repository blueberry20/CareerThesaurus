using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.StorageClient;
using Microsoft.WindowsAzure.ServiceRuntime;


namespace SkillCowResponsive.Classes.Cloud.TableStorage
{
    public class UserProfileClient : SkillCowTableServiceClientBase<UserProfile>
    {
        public UserProfileClient()
            : base("userprofiles")
        {
        }

        public CloudTableQuery<UserProfile> GetAll()
        {
            return (from e in TableContext().CreateQuery<UserProfile>(tableName)
                    select e).AsTableServiceQuery<UserProfile>();
            
        }

        public CloudTableQuery<UserProfile> GetAllWithoutGender(string partition)
        {
            return (from e in TableContext().CreateQuery<UserProfile>(tableName)
                    where e.PartitionKey==partition && !(e.Gender!=string.Empty)
                    select e).AsTableServiceQuery<UserProfile>();

        }
    }
}