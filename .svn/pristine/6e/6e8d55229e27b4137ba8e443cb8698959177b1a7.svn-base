using Microsoft.WindowsAzure.StorageClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SkillCowResponsive.Classes.Cloud.TableStorage.CounselorAccount
{
    public class CounselorAccountClient : TableServiceClientBase<CounselorAccount>
    {
        public CounselorAccountClient()
            : base("CounselorAccount")
        {
        }
        public CloudTableQuery<CounselorAccount> GetAllBySchool(string school)
        {
            return (from e in TableContext().CreateQuery<CounselorAccount>(tableName)
                    where e.PartitionKey == "counselor" && e.School == school
                    select e).AsTableServiceQuery<CounselorAccount>();
        }
        public CloudTableQuery<CounselorAccount> GetAllBySchoolActive(string school)
        {
            return (from e in TableContext().CreateQuery<CounselorAccount>(tableName)
                    where e.PartitionKey == "counselor" && e.School == school && e.Active == true
                    select e).AsTableServiceQuery<CounselorAccount>();
        }
    }
}