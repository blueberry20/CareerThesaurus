using Microsoft.WindowsAzure.StorageClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SkillCowResponsive.Classes.Cloud.TableStorage.LockedModeUser
{
    public class LockedModeUserClient : TableServiceClientBase<LockedModeUser>
    {
        public LockedModeUserClient()
            : base("LockedModeUser")
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
        public CloudTableQuery<LockedModeUser> GetByDates(DateTime fromDate, DateTime toDate)
        {
            return (from e in TableContext().CreateQuery<LockedModeUser>(tableName)
                    where e.CreatedOn >= fromDate && e.CreatedOn <= toDate.AddDays(1)
                    select e).AsTableServiceQuery<LockedModeUser>();
        }
    }
}