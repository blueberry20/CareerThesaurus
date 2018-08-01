using Microsoft.WindowsAzure.StorageClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SkillCowResponsive.Classes.Cloud.TableStorage.AccessCode
{
    public class AccessCodeClient : TableServiceClientBase<AccessCode>
    {
        public AccessCodeClient()
            : base("AccessCode")
        {
        }
        public static string CurrentGradYear()
        {
            return DateTime.Now.Month < 7 ? DateTime.Now.Year.ToString() : (DateTime.Now.Year + 1).ToString();
        }
        public AccessCode GetBySchoolPinCodeCounselorGrade(string school, string pincode, string counselor, string grade)
        {
            return (from e in Entities()
                    where e.School == school && e.Code == pincode && e.Counselor == counselor && e.Grade == grade
                    select e).SingleOrDefault();
        }
        public AccessCode GetBySchoolPinCodeGradeCurrent(string school, string pincode, string grade)
        {
            return (from e in Entities()
                    where e.School == school && e.Code == pincode && e.Grade == grade && e.Year == AccessCodeClient.CurrentGradYear()
                    select e).SingleOrDefault();
        }
        public AccessCode GetByPinCodeAndGradeCurrent(string pincode, string grade)
        {
            return (from e in Entities()
                    where e.Code == pincode && e.Grade == grade && e.Year == AccessCodeClient.CurrentGradYear()
                    select e).SingleOrDefault();
        }
        public AccessCode GetBySchoolAndPinCode(string school, string pincode)
        {
            return (from e in Entities()
                    where e.School == school && e.Code == pincode
                    select e).SingleOrDefault();
        }
        public CloudTableQuery<AccessCode> GetAllByCounselor(string counselor)
        {
            return (from e in TableContext().CreateQuery<AccessCode>(tableName)
                    where e.Counselor == counselor
                    select e).AsTableServiceQuery<AccessCode>();
        }
        public CloudTableQuery<AccessCode> GetAllBySchool(string school)
        {
            return (from e in TableContext().CreateQuery<AccessCode>(tableName)
                    where e.School == school
                    select e).AsTableServiceQuery<AccessCode>();
        }
        public CloudTableQuery<AccessCode> GetCurrentByCounselor(string counselor)
        {
            return (from e in TableContext().CreateQuery<AccessCode>(tableName)
                    where e.Year == CurrentGradYear() && e.Counselor == counselor
                    select e).AsTableServiceQuery<AccessCode>();
        }
    }
}