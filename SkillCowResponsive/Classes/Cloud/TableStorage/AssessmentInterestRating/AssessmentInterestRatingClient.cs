﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.StorageClient;
using Microsoft.WindowsAzure.ServiceRuntime;

namespace SkillCowResponsive.Classes.Cloud.TableStorage.AssessmentInterestRating
{
    public class AssessmentInterestRatingClient : TableServiceClientBase<AssessmentInterestRating>
    {
        public AssessmentInterestRatingClient()
            : base("AssessmentInterestRating")
        {
        }
        public CloudTableQuery<AssessmentInterestRating> GetAllByStudent(string student)
        {
            return (from e in TableContext().CreateQuery<AssessmentInterestRating>(tableName)
                    where e.Student == student
                    select e).AsTableServiceQuery<AssessmentInterestRating>();
        }
        public CloudTableQuery<AssessmentInterestRating> GetAllBySchoolAndStudent(string school, string student)
        {
            return (from e in TableContext().CreateQuery<AssessmentInterestRating>(tableName)
                    where e.PartitionKey == school && e.Student == student
                    select e).AsTableServiceQuery<AssessmentInterestRating>();
        }
        public CloudTableQuery<AssessmentInterestRating> GetAllBySchoolAndTeacher(string school, string teacher)
        {
            return (from e in TableContext().CreateQuery<AssessmentInterestRating>(tableName)
                    where e.PartitionKey == school && e.Teacher == teacher
                    select e).AsTableServiceQuery<AssessmentInterestRating>();
        }
        public CloudTableQuery<AssessmentInterestRating> GetAllBySchoolAndGroup(string school, string teacher, string groupName)
        {
            return (from e in TableContext().CreateQuery<AssessmentInterestRating>(tableName)
                    where e.PartitionKey == school && e.Teacher == teacher && e.Group == groupName
                    select e).AsTableServiceQuery<AssessmentInterestRating>();
        }
        public CloudTableQuery<AssessmentInterestRating> GetAllBySchoolAndGradYear(string school, string gradYear)
        {
            return (from e in TableContext().CreateQuery<AssessmentInterestRating>(tableName)
                    where e.PartitionKey == school && e.GradYear == gradYear
                    select e).AsTableServiceQuery<AssessmentInterestRating>();
        }
        public CloudTableQuery<AssessmentInterestRating> GetAllBySchoolAndRating(string school, string interest, string rating)
        {
            return (from e in TableContext().CreateQuery<AssessmentInterestRating>(tableName)
                    where e.PartitionKey == school && e.Interest == interest && e.Rating == rating
                    select e).AsTableServiceQuery<AssessmentInterestRating>();
        }
        public CloudTableQuery<AssessmentInterestRating> GetAllBySchoolAndGroupAndRating(string school, string interest, string schoolGroup, string rating)
        {
            return (from e in TableContext().CreateQuery<AssessmentInterestRating>(tableName)
                    where e.PartitionKey == school && e.Group == schoolGroup && e.Interest == interest && e.Rating == rating
                    select e).AsTableServiceQuery<AssessmentInterestRating>();
        }
    }
}