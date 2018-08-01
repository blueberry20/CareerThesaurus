using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.StorageClient;
using Microsoft.WindowsAzure.ServiceRuntime;


namespace SkillCow.Classes.Cloud.TableStorage
{
    public class AddresseeClient : ChainDateTableServiceClientBase<Addressee>
    {
        public AddresseeClient() : base("skillcowAddressee")
        {
        }

        public static string GetPartitionKeyForEmail(string email)
        {
            string partitionkey = "";

            if (email == null || email.Trim() == "")
            {
                return "same";
            }

            partitionkey = email.Trim()[0].ToString().ToLower();

            return partitionkey;
        }

        public CloudTableQuery<Addressee> GetAll()
        {
            return (from e in TableContext().CreateQuery<Addressee>(tableName)
                    select e).AsTableServiceQuery<Addressee>();
            
        }

        public CloudTableQuery<Addressee> GetAllUnsubscribed()
        {
            return (from e in TableContext().CreateQuery<Addressee>(tableName)
                    where e.Unsubscribed == true
                    select e).AsTableServiceQuery<Addressee>();
            
        }
        
    }
}