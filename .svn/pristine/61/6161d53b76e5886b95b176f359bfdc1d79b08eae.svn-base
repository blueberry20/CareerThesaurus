using Microsoft.WindowsAzure.StorageClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SkillCowResponsive.Classes.Cloud.TableStorage.AssessmentInterest
{
    public class AssessmentInterestClient : TableServiceClientBase<AssessmentInterest>
    {
        public AssessmentInterestClient()
            : base("AssessmentInterest")
        {
        }
        public static string CurrentGradYear()
        {
            return DateTime.Now.Month < 7 ? DateTime.Now.Year.ToString() : (DateTime.Now.Year + 1).ToString();
        }
        public CloudTableQuery<AssessmentInterest> GetAllCurrentByStudent(string partitionkey, string student, string year, string grade)
        {
            return (from e in TableContext().CreateQuery<AssessmentInterest>(tableName)
                    where e.PartitionKey == partitionkey && e.Student == student && e.Year == year && e.Grade == grade
                    select e).AsTableServiceQuery<AssessmentInterest>();
        }
        public CloudTableQuery<AssessmentInterest> GetAllBySchoolAndValue(string school, string interest, string rating)
        {
            return (from e in TableContext().CreateQuery<AssessmentInterest>(tableName)
                    where e.PartitionKey == school && e.Interest == interest && e.Value == rating && e.Year == CurrentGradYear()
                    select e).AsTableServiceQuery<AssessmentInterest>();
        }
    }
}