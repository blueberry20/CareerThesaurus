using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.StorageClient;
using Microsoft.WindowsAzure.ServiceRuntime;

namespace SkillCowResponsive.Classes.Cloud.TableStorage.AssessmentGroup
{
    public class AssessmentGroupClient : TableServiceClientBase<AssessmentGroup>
    {
        public AssessmentGroupClient()
            :base("AssessmentGroup")
        {
        }
        public CloudTableQuery<AssessmentGroup> GetAllBySchoolAndTeacher(string school, string teacher)
        {
            return (from e in TableContext().CreateQuery<AssessmentGroup>(tableName)
                    where e.PartitionKey == school && e.Teacher == teacher
                    select e).AsTableServiceQuery<AssessmentGroup>();
        }
        public CloudTableQuery<AssessmentGroup> GetAllByTeacher(string teacher)
        {
            return (from e in TableContext().CreateQuery<AssessmentGroup>(tableName)
                    where e.Teacher == teacher
                    select e).AsTableServiceQuery<AssessmentGroup>();
        }
    }
}