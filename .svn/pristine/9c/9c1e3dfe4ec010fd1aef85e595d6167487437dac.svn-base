using Microsoft.WindowsAzure.StorageClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SkillCowResponsive.Classes.Cloud.TableStorage.AdminAccount
{
    public class AdminAccountClient : TableServiceClientBase<AdminAccount>
    {
        public AdminAccountClient() 
            : base("AdminAccount")
        {
        }
        public AdminAccount GetBySchool(string school)
        {
            return (from e in Entities()
                    where e.School == school
                    select e).SingleOrDefault();
        }
        public CloudTableQuery<AdminAccount> GetAllNotConfirmed()
        {
            return (from e in TableContext().CreateQuery<AdminAccount>(tableName)
                    where e.SchoolSelected == true && e.ConnectionToSchoolConfirmed == false
                    select e).AsTableServiceQuery<AdminAccount>();
        }
    }
}