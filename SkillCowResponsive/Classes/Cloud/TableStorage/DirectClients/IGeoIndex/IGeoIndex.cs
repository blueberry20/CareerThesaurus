using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace SkillCowResponsive.Classes.Cloud.TableStorage.DirectClients.GeoIndex
{
    interface IGeoIndex
    {
        string RowKey { get; set; }
        string ProgramId { get; set; }

        string CampusId { get; set; }
        string CampusRowKey { get; set; }

        string ClientId { get; set; }
        string ClientRowKey { get; set; }

        long AttributeMask { get; set; }
        long ImportantThingsMask { get; set; }
    }
}
