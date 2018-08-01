using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.StorageClient;
using Microsoft.WindowsAzure.ServiceRuntime;

using SkillCowResponsive.Classes.Helpers;

namespace SkillCowResponsive.Classes.Cloud.TableStorage
{
    public class DelayedRecordClient : TableServiceClientBase<DelayedRecord>
    {
        public DelayedRecordClient()
            : base("skillcowcbndelayedrecord")
        {
        }

        
        public CloudTableQuery<DelayedRecord> GetAll()
        {
            return (from e in TableContext().CreateQuery<DelayedRecord>(tableName)
                    select e).AsTableServiceQuery<DelayedRecord>();
        }

        public CloudTableQuery<DelayedRecord> GetDelayedRecords(int delayminutes)
        {
            
            DateTime cursordate = DateTime.UtcNow.AddMinutes(-delayminutes);

            return (from e in TableContext().CreateQuery<DelayedRecord>(tableName)
                    where e.Timestamp < cursordate 
                    select e).AsTableServiceQuery<DelayedRecord>();
        }
        
    }
}