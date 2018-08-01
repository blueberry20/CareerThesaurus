using Microsoft.WindowsAzure.StorageClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SkillCowResponsive.Classes.Cloud.TableStorage.CounselorInvite
{
    public class CounselorInviteClient : TableServiceClientBase<CounselorInvite>
    {
        public CounselorInviteClient() 
            : base("CounselorInvite")
        {
        }
        public CloudTableQuery<CounselorInvite> GetAllBySchool(string school)
        {
            return (from e in TableContext().CreateQuery<CounselorInvite>(tableName)
                    where e.PartitionKey == "invite" && e.School == school
                    select e).AsTableServiceQuery<CounselorInvite>();
        }
        public CounselorInvite GetByEmail(string value)
        {
            return (from e in Entities()
                    where e.Email == value
                    select e).SingleOrDefault();
        }
    }
}