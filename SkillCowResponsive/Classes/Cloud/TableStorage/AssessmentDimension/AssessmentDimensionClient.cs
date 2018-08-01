using Microsoft.WindowsAzure.StorageClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SkillCowResponsive.Classes.Cloud.TableStorage.AssessmentDimension
{
    public class AssessmentDimensionClient : TableServiceClientBase<AssessmentDimension>
    {
        public AssessmentDimensionClient()
            : base("AssessmentDimension")
        {
        }
        public static string CurrentGradYear()
        {
            return DateTime.Now.Month < 7 ? DateTime.Now.Year.ToString() : (DateTime.Now.Year + 1).ToString();
        }
        public CloudTableQuery<AssessmentDimension> GetAllBySchoolAndValue(string school, string value)
        {
            return (from e in TableContext().CreateQuery<AssessmentDimension>(tableName)
                    where e.PartitionKey == school && e.Value == value && e.Year == CurrentGradYear()
                    select e).AsTableServiceQuery<AssessmentDimension>();
        }
        public CloudTableQuery<AssessmentDimension> GetAllCurrentByStudent(string partitionkey, string student, string year, string grade)
        {
            return (from e in TableContext().CreateQuery<AssessmentDimension>(tableName)
                    where e.PartitionKey == partitionkey && e.Student == student && e.Year == year && e.Grade == grade
                    select e).AsTableServiceQuery<AssessmentDimension>();
        }
    }
}