using Microsoft.WindowsAzure.StorageClient;
using SkillCowResponsive.Classes.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SkillCowResponsive.Classes.Cloud.TableStorage.LockedModeUser
{
    public class LockedModeUser : TableServiceEntity
    {
        public LockedModeUser()
        {
            Timestamp = EasternTimeConverter.Convert(DateTime.UtcNow);
            CreatedOn = EasternTimeConverter.Convert(DateTime.UtcNow);
        }

        public string Email { get; set; }
        public string Name { get; set; }
        public string Phone { get; set; }
        public string Referer { get; set; }
        public string EduLevel { get; set; }
        public DateTime CreatedOn { get; set; }
        public string OriginPage { get; set; }

        public string Attitude { get; set; }
        public string Information { get; set; }
        public string Processing { get; set; }
        public string Action { get; set; }
        public string Endurance { get; set; }
        public string Presence { get; set; }
        public string Concentration { get; set; }
        public string Patterns { get; set; }
        public string Compensation { get; set; }

        public int admiration { get; set; }
        public int adventure { get; set; }
        public int animals { get; set; }
        public int beauty { get; set; }
        public int competition { get; set; }
        public int coordinating { get; set; }
        public int creativity { get; set; }
        public int critical { get; set; }
        public int drafting { get; set; }
        public int duty { get; set; }
        public int handlabor { get; set; }
        public int helping { get; set; }
        public int machinery { get; set; }
        public int numbers { get; set; }
        public int people { get; set; }
        public int politics { get; set; }
        public int safety { get; set; }
        public int salesy { get; set; }
        public int science { get; set; }
        public int strength { get; set; }
        public int technology { get; set; }

        public string Color { get; set; }
        public string Shape { get; set; }
        public string Sport { get; set; }
        public string School { get; set; }
    }
}