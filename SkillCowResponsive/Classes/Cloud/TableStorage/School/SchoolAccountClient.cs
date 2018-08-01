using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.StorageClient;
using Microsoft.WindowsAzure.ServiceRuntime;

namespace SkillCowResponsive.Classes.Cloud.TableStorage.School
{
    public class SchoolAccountClient : TableServiceClientBase<SchoolAccount>
    {
        public SchoolAccountClient()
            :base("SchoolAccount")
        {
        }
        public CloudTableQuery<SchoolAccount> GetByZipCode(string value)
        {
            return (from e in Entities()
                    where e.ZipCode == value
                    select e).AsTableServiceQuery<SchoolAccount>();
        }
        
    }
}