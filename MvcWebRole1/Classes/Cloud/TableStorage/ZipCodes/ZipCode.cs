﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.WindowsAzure.StorageClient;
using SkillCow.Classes.Helpers;

namespace SkillCow.Classes.Cloud.TableStorage
{
    public class ZipCode : TableServiceEntity
    {
        public ZipCode()
        {
            PartitionKey = "same";
        }

        public string City { get; set; }
        public string State { get; set; }
        public string StateCode { get; set; }
        public string County { get; set; }

    }
}