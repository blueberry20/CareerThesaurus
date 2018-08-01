using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.StorageClient;
using Microsoft.WindowsAzure.ServiceRuntime;

namespace SkillCowResponsive.Classes.Cloud.TableStorage.SchoolToTeacherConnection
{
    public class SchoolToTeacherConnectionClient : TableServiceClientBase<SchoolToTeacherConnection>
    {
        public SchoolToTeacherConnectionClient()
            : base("SchoolToTeacherConnection")
        {
        }
        public CloudTableQuery<SchoolToTeacherConnection> GetAllActive(string partitionKey)
        {
            return (from e in TableContext().CreateQuery<SchoolToTeacherConnection>(tableName)
                    where e.PartitionKey == partitionKey && e.Active == true
                    select e).AsTableServiceQuery<SchoolToTeacherConnection>();
        }
    }
}