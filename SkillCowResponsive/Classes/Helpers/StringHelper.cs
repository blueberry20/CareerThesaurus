using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SkillCowResponsive.Classes.Helpers
{
    public static class StringHelper
    {
        public static string FormatEmailAsProgrammaticId(this string value)
        {
            return value != null ? value.Replace("@", "-").Replace(".", "-").Replace("_", "-") : "";
        }
        public static string FormatAsProgrammaticId(this string value)
        {
            return value != null ? value.Replace(" ", "_")
                .Replace("@", "_").Replace("#", "_").Replace("%", "_").Replace("^", "_").Replace("&", "_").Replace("*", "_")
                .Replace("(", "_").Replace(")", "_")
                .Replace("-", "_").Replace("+", "_").Replace("=", "_")
                .Replace("<", "_")
                .Replace(">", "_")
                .Replace(",", "_")
                .Replace(".", "_")
                .Replace("/", "_")
                .Replace("?", "_").Replace("!", "_")
                .Replace("'", "_").Replace("\"", "_")
                .Replace(":", "_").Replace(";", "_")
                .Replace("{", "_").Replace("}", "_")
                .Replace("[", "_").Replace("]", "_")
                .Replace("|", "_").Replace("\\", "_")
                .Replace("`", "_").Replace("~", "_")
                .Replace("`", "_").Replace("~", "_")
                : "";
        }

        public static string FixProfessionNameAbbreviations(this string value)
        {
            return value != null ? value.Replace("Spec.", "Specialist").Replace("Mgr.", "Manager").Replace("Asst.", "Assistant").Replace("Admin.", "Administrator") : "";
        }
        public static string FixProgramNameAbbreviations(this string value)
        {
            return value != null ? value.Replace("Admin.", "Administration").Replace("Mgmt.", "Management").Replace("Comm.", "Communications") : "";
        }

        public static string FormatProfessionNameAsUrlParam(this string value)
        {
            if (value != null)
            {
                value = value.FixProfessionNameAbbreviations().Trim().Replace("+","-plus-").Replace("&","-and-").Replace(" ", "-").Replace("/","-").ToLower();
 
                while(value.Contains("--"))
                {
                    value = value.Replace("--","-");
                }
                return value;
            }
            else
            {
                return "";
            }
        }

        public static string ToProperCase(this string value)
        {
            if (value.Length > 1)
            {
                return value.Substring(0, 1).ToUpper() + value.Substring(1).ToLower();
            }
            else if (value.Length == 1)
            {
                return value.ToUpper();
            }
            else
            {
                return value;
            }
        }
    }
}