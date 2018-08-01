using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.WindowsAzure.StorageClient;
using SkillCow.Classes.Helpers;
using Newtonsoft.Json.Linq;
using System.ComponentModel.DataAnnotations;

namespace SkillCow.Classes.Cloud.TableStorage.DirectClients.Schools
{
    public class DirectSchoolClientCampusProgram : TableServiceEntity
    {
        public DirectSchoolClientCampusProgram()
        {
            PartitionKey = "same";
            RowKey = ShortGuidGenerator.NewGuid();
            Timestamp = DateTime.UtcNow;
        }

        public string ProgramId { get; set; }

        public string ClientRowKey { get; set; }
        public string ClientId { get; set; }

        public string CampusRowKey { get; set; }
        public string CampusId { get; set; }
        
        public string ProgramType { get; set; }
        public string Name { get; set; }
        public double Payout { get; set; }
                
        public long TotalCap { get; set; }
        public long AnnualCap { get; set; }
        public long MonthlyCap { get; set; }
        public long WeeklyCap { get; set; }
        public long DailyCap { get; set; }

        public string Status { get; set; }
        public string CapStatus { get; set; }

        public string GeoAddNational { get; set; }

        [NotMapped]
        public string GeoAddStates { get; set; }
        [NotMapped]
        public string GeoAddZips { get; set; }
        [NotMapped]
        public string GeoSubtractStates { get; set; }
        [NotMapped]
        public string GeoSubtractZips { get; set; }
        
        public string ProgramCategories { get; set; }

        public string ResolveProgramTypeName()
        {
            switch (this.ProgramType)
            {
                case "AS":
                    return "Associates";
                case "BA":
                    return "Bachelor of Art";
                case "BS":
                    return "Bachelor of Science";
                case "MA":
                    return "Master's";
                case "PHD":
                    return "PhD Program";
                case "CRT":
                    return "Certificate";
                case "DIP":
                    return "Diploma";
                case "GED":
                    return "GED"; 
                default:
                    return "";
            }
        }
        public override string ToString()
        {
            return Name;
        }
    }
}