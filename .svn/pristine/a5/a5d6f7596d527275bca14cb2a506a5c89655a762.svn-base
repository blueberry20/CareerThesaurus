using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.WindowsAzure.StorageClient;
using SkillCowResponsive.Classes.Helpers;
using Newtonsoft.Json.Linq;
using SkillCowResponsive.Classes.Cloud.TableStorage.DirectClients.GeoIndex;

namespace SkillCowResponsive.Classes.Cloud.TableStorage.DirectClients.Employers.GeoIndex
{
    public class GeoIndexAddZip : TableServiceEntity, IGeoIndex
    {
        public string ProgramId { get; set; }

        public string CampusId { get; set; }
        public string CampusRowKey { get; set; }

        public string ClientId { get; set; }
        public string ClientRowKey { get; set; }

        public long AttributeMask { get; set; }
        public long ImportantThingsMask { get; set; }

        public GeoIndexAddZip()
        {
            
        }

        public override string ToString()
        {
            return ClientId + " - " + CampusId + " - " + ProgramId;
        }
    }
}