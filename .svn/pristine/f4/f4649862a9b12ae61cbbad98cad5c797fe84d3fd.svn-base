using Microsoft.WindowsAzure.StorageClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SkillCowResponsive.Classes.Cloud.TableStorage.AssessmentInterest
{
    public class AssessmentInterest : TableServiceEntity
    {
        public AssessmentInterest()
        {
            Timestamp = DateTime.UtcNow;
        }
        //PartitionKey = school.RowKey 
        //RowKey = user.RowKey + year + grade + dimension (interest or career dol-code)

        public string Interest { get; set; } // dimension name (interest or career dol-code)
        public string Value { get; set; } // value (Extrovert or intrevert or 1 or 0 in case of interests and career ratings)
        public string Misc { get; set; } // any misc info (skill test 1 question multi answers)
        public string Student { get; set; } // students email taking this test
        public bool Gender { get; set; } //true - male, false - female
        public string Year { get; set; } // year taking test
        public string Grade { get; set; } // grade student in this year
        public string Counselor { get; set; } // cousler for this student thius year
        public string GroupName { get; set; } // name of group assigned by admin
    }
}