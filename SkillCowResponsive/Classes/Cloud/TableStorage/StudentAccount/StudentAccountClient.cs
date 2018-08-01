using Microsoft.WindowsAzure.StorageClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SkillCowResponsive.Classes.Cloud.TableStorage.StudentAccount
{
    public class StudentAccountClient :TableServiceClientBase<StudentAccount>
    {
        public StudentAccountClient()
            : base("StudentAccount")
        {
        }
        public static string GetPartitionKeyForEmail(string email)
        {
            string partitionkey = email.ToLower().Substring(0, 1) + email.Length.ToString();
            return partitionkey;
        }
        public static string CurrentGradYear()
        {
            return DateTime.Now.Month < 7 ? DateTime.Now.Year.ToString() : (DateTime.Now.Year + 1).ToString();
        }
        public CloudTableQuery<StudentAccount> GetAllByCounselor(string counselor)
        {
            return (from e in TableContext().CreateQuery<StudentAccount>(tableName)
                    where e.Counselor == counselor
                    select e).AsTableServiceQuery<StudentAccount>();
        }
        public CloudTableQuery<StudentAccount> GetAllBySchool(string school)
        {
            return (from e in TableContext().CreateQuery<StudentAccount>(tableName)
                    where e.School == school
                    select e).AsTableServiceQuery<StudentAccount>();
        }
        public CloudTableQuery<StudentAccount> GetCurrentBySchool(string school)
        {
            return (from e in TableContext().CreateQuery<StudentAccount>(tableName)
                    where e.School == school && e.Year == CurrentGradYear()
                    select e).AsTableServiceQuery<StudentAccount>();
        }
        public CloudTableQuery<StudentAccount> GetCurrentBySchoolAndCounselor(string school, string counselor)
        {
            return (from e in TableContext().CreateQuery<StudentAccount>(tableName)
                    where e.School == school && e.Counselor == counselor && e.Year == CurrentGradYear()
                    select e).AsTableServiceQuery<StudentAccount>();
        }
        public CloudTableQuery<StudentAccount> GetCurrentByCounselor(string counselor)
        {
            return (from e in TableContext().CreateQuery<StudentAccount>(tableName)
                    where e.Year == CurrentGradYear() && e.Counselor == counselor
                    select e).AsTableServiceQuery<StudentAccount>();
        }
    }
}