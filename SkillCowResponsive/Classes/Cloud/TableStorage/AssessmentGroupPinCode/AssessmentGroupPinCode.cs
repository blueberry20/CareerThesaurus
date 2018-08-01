﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.WindowsAzure.StorageClient;
using Newtonsoft.Json.Linq;

namespace SkillCowResponsive.Classes.Cloud.TableStorage.AssessmentGroupPinCode
{
    public class AssessmentGroupPinCode : TableServiceEntity
    {
        public AssessmentGroupPinCode()
        {
            PartitionKey = "pincodes";
            Timestamp = DateTime.UtcNow;            
        }
        // row key is guid used in url

        public string School { get; set; }
        public string PinCode { get; set; }
        public string Teacher { get; set; }
        public string Group { get; set; }
    }
}