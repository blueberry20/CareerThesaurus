﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.WindowsAzure.StorageClient;
using SkillCowResponsive.Classes.Helpers;
using Newtonsoft.Json.Linq;

namespace SkillCowResponsive.Classes.Cloud.TableStorage.DirectClients.Schools
{
    public class DirectSchoolClient : TableServiceEntity
    {
        public DirectSchoolClient()
        {
            PartitionKey = "same";
            RowKey = ShortGuidGenerator.NewGuid();
            Timestamp = DateTime.UtcNow;
        }

        public string DeliveryMethod { get; set; }
        public string DeliveryDestination { get; set; }
        public string DeliveryFrequency { get; set; }

        public string ClientId { get; set; }
        public string FormId { get; set; }

        public string Logo { get; set; }

        public string Category { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string ImageUrls { get; set; }

        public string Status { get; set; }

        public string AdministrativeContactName { get; set; }
        public string AdministrativeContactPhone1 { get; set; }
        public string AdministrativeContactPhone2 { get; set; }
        public string AdministrativeContactEmail { get; set; }

        public string BillingContactName { get; set; }
        public string BillingContactPhone1 { get; set; }
        public string BillingContactPhone2 { get; set; }
        public string BillingContactEmail { get; set; }

        public string Notes { get; set; }

        public long TotalCap { get; set; }
        public long AnnualCap { get; set; }
        public long MonthlyCap { get; set; }
        public long WeeklyCap { get; set; }
        public long DailyCap { get; set; }

        public string UserName { get; set; }
        public string Password { get; set; }

        public string LeadPostURL { get; set; }
        public string LeadPostForm { get; set; }

        public override string ToString()
        {
            return Name;
        }
    }
}