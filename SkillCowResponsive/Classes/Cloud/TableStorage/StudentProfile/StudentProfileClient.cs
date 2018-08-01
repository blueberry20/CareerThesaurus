﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.StorageClient;
using Microsoft.WindowsAzure.ServiceRuntime;

namespace SkillCowResponsive.Classes.Cloud.TableStorage.StudentProfile
{
    public class StudentProfileClient : TableServiceClientBase <StudentProfile>
    {
        public StudentProfileClient()
            : base("StudentProfile")
        {
        }
        public static string GetPartitionKeyForEmail(string email)
        {
            string partitionkey = email.ToLower().Substring(0, 1) + email.Length.ToString();
            return partitionkey;
        }
        public CloudTableQuery<StudentProfile> GetAllBySchool(string school)
        {
            return (from e in TableContext().CreateQuery<StudentProfile>(tableName)
                    where e.School == school
                    select e).AsTableServiceQuery<StudentProfile>();
        }
        public CloudTableQuery<StudentProfile> GetAllByTeacher(string teacher)
        {
            return (from e in TableContext().CreateQuery<StudentProfile>(tableName)
                    where e.Teacher == teacher
                    select e).AsTableServiceQuery<StudentProfile>();
        }
        public CloudTableQuery<StudentProfile> GetAllBySchoolAndTeacher(string school, string teacher)
        {
            return (from e in TableContext().CreateQuery<StudentProfile>(tableName)
                    where e.School == school && e.Teacher == teacher
                    select e).AsTableServiceQuery<StudentProfile>();
        }
        public CloudTableQuery<StudentProfile> GetAllBySchoolAndGroup(string school, string teacher, string groupName)
        {
            return (from e in TableContext().CreateQuery<StudentProfile>(tableName)
                    where e.School == school && e.Teacher == teacher && e.Group == groupName
                    select e).AsTableServiceQuery<StudentProfile>();
        }
    }
}