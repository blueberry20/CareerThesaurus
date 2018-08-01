using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.WindowsAzure.StorageClient;
using SkillCowResponsive.Classes.Helpers;

namespace SkillCowResponsive.Classes.Cloud.TableStorage.PersonalityTests.CBNProfessions
{
    public class CBNProfession : TableServiceEntity
    {
        public CBNProfession()
        {
            PartitionKey = "same";  
            RowKey = ShortGuidGenerator.NewGuid();
        }

        public string Profession { get; set; }
        public string CareerVertical	 { get; set; }
        public string Discipline	 { get; set; }
        public string Branch	 { get; set; }
        public string Program	 { get; set; }

        public string Attitude	 { get; set; }
        public string Information { get; set; }
        public string Evidence	 { get; set; }
        public string Processing	 { get; set; }
        public string Action	 { get; set; }
        public string Endurance	 { get; set; }
        public string Presence	 { get; set; }
        public string Concentration	 { get; set; }
        public string Patterns	 { get; set; }
        public string Compensation { get; set; }
        public string ProgramId { get; set; }
        public string DisplayName { get; set; }

        public string ImageUrl { get; set; }

        public string Description { get; set; }
        public string Duties { get; set; }
        public string Salary { get; set; }
        public string WhereToFind { get; set; }
        public string Demand { get; set; }

        //Additional Applicable attributes added in March 2013
        public int Beauty { get; set; }
        public int Helping { get; set; }
        public int Adventure { get; set; }
        public int Safety { get; set; }
        public int People { get; set; }

        public int Science { get; set; }
        public int Easy { get; set; }
        public int Duty { get; set; }
        public int Admiration { get; set; }
        public int Creativity { get; set; }

        public int Competition { get; set; }
        public int Animals { get; set; }
        public int Politics { get; set; }
        public int Technology { get; set; }
        public int Growth { get; set; }

        public int VMProdId { get; set; }
        

        public int CountAttributes()
        {
            int points = 0;

            if (Attitude != "")
                points += 1;
            
            if (Information != "")
                points += 1;
            
            if (Evidence != "")
                points += 1;
            
            if (Processing != "")
                points += 1;
            
            if (Action != "")
                points += 1;
            
            if (Endurance != "")
                points += 1;
            
            if (Presence != "")
                points += 1;
            
            if (Concentration != "")
                points += 1;
            
            if (Patterns != "")
                points += 1;
            

            if (Compensation != "")
                points += 1;
            
            return points;
        }
    }
}