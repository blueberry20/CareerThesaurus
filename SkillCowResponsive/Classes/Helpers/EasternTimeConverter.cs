using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SkillCowResponsive.Classes.Helpers
{
    public class EasternTimeConverter
    {
        static string easternZoneId = "Eastern Standard Time";
        public static DateTime Convert(DateTime utcDate)
        {
            TimeZoneInfo easternZone = TimeZoneInfo.FindSystemTimeZoneById(easternZoneId);
            return TimeZoneInfo.ConvertTimeFromUtc(utcDate, easternZone);
        }
    }
}