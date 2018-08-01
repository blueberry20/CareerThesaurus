using Microsoft.WindowsAzure.StorageClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SkillCowResponsive.Classes.Cloud.TableStorage.AssessmentCareer
{
    public class AssessmentCareerClient : TableServiceClientBase<AssessmentCareer>
    {
        public AssessmentCareerClient()
            : base("AssessmentCareer")
        {
        }
        public static string CurrentGradYear()
        {
            return DateTime.Now.Month < 7 ? DateTime.Now.Year.ToString() : (DateTime.Now.Year + 1).ToString();
        }
        public CloudTableQuery<AssessmentCareer> GetAllCurrentByStudent(string partitionkey, string student, string year, string grade)
        {
            return (from e in TableContext().CreateQuery<AssessmentCareer>(tableName)
                    where e.PartitionKey == partitionkey && e.Student == student && e.Year == year && e.Grade == grade
                    select e).AsTableServiceQuery<AssessmentCareer>();
        }
        public CloudTableQuery<AssessmentCareer> GetAllBySchoolAndValue(string school, string dolcode, string rating)
        {
            return (from e in TableContext().CreateQuery<AssessmentCareer>(tableName)
                    where e.PartitionKey == school && e.DolCode == dolcode && e.Value == rating && e.Year == CurrentGradYear()
                    select e).AsTableServiceQuery<AssessmentCareer>();
        }
    }
}