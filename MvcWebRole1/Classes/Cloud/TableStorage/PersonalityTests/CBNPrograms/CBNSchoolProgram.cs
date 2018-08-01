using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.WindowsAzure.StorageClient;
using SkillCow.Classes.Helpers;

namespace SkillCow.Classes.Cloud.TableStorage.PersonalityTests.CBNSchoolPrograms
{
    public class CBNSchoolProgram : TableServiceEntity
    {
        public CBNSchoolProgram()
        {
            //PartitionKey = SchoolId;
            RowKey = ShortGuidGenerator.NewGuid();
        }

        public string SchoolId { get; set; }
        public string CampusId { get; set; }
        public string ProgramId { get; set; }

        public string ProgramName { get; set; }
        public string ProgramKey { get; set; }
        public string ProgramType { get; set; }
        public string ProgramGroup { get; set; }
        public string ProgramCategoryIds { get; set; }
        
        public string FormId { get; set; }
        public string FormUrl { get; set; }
        public string FormImage { get; set; }
        public string FormDescription { get; set; }
    }
}