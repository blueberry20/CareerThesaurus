using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.StorageClient;
using Microsoft.WindowsAzure.ServiceRuntime;

namespace SkillCowResponsive.Classes.Cloud.TableStorage.UserAccount
{
    public class UserAccountClient : TableServiceClientBase<UserAccount>
    {
        public UserAccountClient()
            : base("UserAccount")
        {
        }
        public static string GetPartitionKeyForEmail(string email)
        {
            string partitionkey = email.ToLower().Substring(0, 1) + email.Length.ToString();            
            return partitionkey;
        }

        public UserAccount GetByEmail(string value)
        {
            return (from e in Entities()
                    where e.Email == value
                    select e).SingleOrDefault();
        }
        public UserAccount Logon(string email, string password)
        {
            return (from e in Entities()
                    where e.RowKey == email && e.Password == password
                    select e).SingleOrDefault();
        }
        public CloudTableQuery<UserAccount> GetAllNotConfirmEmails()
        {
            return (from e in TableContext().CreateQuery<UserAccount>(tableName)
                    where e.EmailConfirmed == false
                    select e).AsTableServiceQuery<UserAccount>();
        }
    }
}