using Microsoft.WindowsAzure.StorageClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SkillCowResponsive.Classes.Cloud.TableStorage.StudentAccount
{
    public class StudentAccount : TableServiceEntity
    {
        public StudentAccount()
        {
            Timestamp = DateTime.UtcNow;
            Active = true;
            AssessmentComplete = false;
        }
        //PartitionKey = 1 char in email and email length
        //RowKey = email
        public string Gender { get; set; }

        public string StudentID { get; set; } // optional may help to id students
        public bool AssessmentComplete { get; set; } // true if finished assessment and reset to false after its time to take new one
        public string School { get; set; } // assign by pincode system send to student via email to register, cannot be changes is Active == true
        public string Counselor { get; set; } // counselor that this student is assign to this year, cannot be changes is Active == true
        public string Year { get; set; } // last year for student to take a test, changed with access code entry while taking test
        public string Grade { get; set; } // students grade this year, changed with access code entry while taking test
        public string GroupName { get; set; } // name of group admin assign
        public bool Active { get; set; } // if student is still in same school or may changed schools

        public int RatedDimensions { get; set; }
        public int RatedInterests { get; set; }
        public int RatedCareers { get; set; }
        public int DislikeCareers { get; set; }
    }
}