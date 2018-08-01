using Microsoft.WindowsAzure.StorageClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SkillCowResponsive.Classes.Cloud.TableStorage.SendGridEvent
{
    public class SendGridEventClient : TableServiceClientBase<SendGridEvent>
    {
        public SendGridEventClient()
            : base("SendGridEvent")
        {
        }
        public static string GetPartitionKeyForEmail(string email)
        {
            string partitionkey = email.ToLower().Substring(0, 1) + email.Length.ToString();
            return partitionkey;
        }
        public CloudTableQuery<SendGridEvent> GetByDates(DateTime fromDate, DateTime toDate)
        {
            return (from e in TableContext().CreateQuery<SendGridEvent>(tableName)
                    where e.LastUpdated >= fromDate && e.LastUpdated <= toDate.AddDays(1)
                    select e).AsTableServiceQuery<SendGridEvent>();
        }
    }
}