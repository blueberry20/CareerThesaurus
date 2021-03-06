﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.StorageClient;
using Microsoft.WindowsAzure.ServiceRuntime;

namespace SkillCowResponsive.Classes.Cloud.TableStorage.AssessmentDimensionsRating
{
    public class AssessmentDimensionsRatingClient : TableServiceClientBase<AssessmentDimensionsRating>
    {
        public AssessmentDimensionsRatingClient()
            : base("AssessmentDimensionsRating")
        {
        }
        public CloudTableQuery<AssessmentDimensionsRating> GetAllByStudent(string student)
        {
            return (from e in TableContext().CreateQuery<AssessmentDimensionsRating>(tableName)
                    where e.Student == student
                    select e).AsTableServiceQuery<AssessmentDimensionsRating>();
        }
        public CloudTableQuery<AssessmentDimensionsRating> GetAllBySchoolAndStudent(string school, string student)
        {
            return (from e in TableContext().CreateQuery<AssessmentDimensionsRating>(tableName)
                    where e.PartitionKey == school && e.Student == student
                    select e).AsTableServiceQuery<AssessmentDimensionsRating>();
        }
        public CloudTableQuery<AssessmentDimensionsRating> GetAllBySchoolAndTeacher(string school, string teacher)
        {
            return (from e in TableContext().CreateQuery<AssessmentDimensionsRating>(tableName)
                    where e.PartitionKey == school && e.Teacher == teacher
                    select e).AsTableServiceQuery<AssessmentDimensionsRating>();
        }
        public CloudTableQuery<AssessmentDimensionsRating> GetAllBySchoolAndGroup(string school, string teacher, string groupName)
        {
            return (from e in TableContext().CreateQuery<AssessmentDimensionsRating>(tableName)
                    where e.PartitionKey == school && e.Teacher == teacher && e.Group == groupName
                    select e).AsTableServiceQuery<AssessmentDimensionsRating>();
        }
        public CloudTableQuery<AssessmentDimensionsRating> GetAllBySchoolAndGradYear(string school, string gradYear)
        {
            return (from e in TableContext().CreateQuery<AssessmentDimensionsRating>(tableName)
                    where e.PartitionKey == school && e.GradYear == gradYear
                    select e).AsTableServiceQuery<AssessmentDimensionsRating>();
        }
        public CloudTableQuery<AssessmentDimensionsRating> GetAllBySchoolAndValue(string school, string value)
        {
            return (from e in TableContext().CreateQuery<AssessmentDimensionsRating>(tableName)
                    where e.PartitionKey == school && e.Value == value
                    select e).AsTableServiceQuery<AssessmentDimensionsRating>();
        }
        public CloudTableQuery<AssessmentDimensionsRating> GetAllBySchoolAndGroupAndValue(string school, string schoolGroup, string value)
        {
            return (from e in TableContext().CreateQuery<AssessmentDimensionsRating>(tableName)
                    where e.PartitionKey == school && e.Group == schoolGroup && e.Value == value
                    select e).AsTableServiceQuery<AssessmentDimensionsRating>();
        }
    }
}