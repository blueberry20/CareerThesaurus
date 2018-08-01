using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text;
using Newtonsoft.Json.Linq;

namespace SkillCowResponsive.Classes.CookieData
{
    public class CookieDataImportantThings
    {
        public static Dictionary<string, string> GetValues(HttpRequestBase Request)
        {
            Dictionary<string, string> values = new Dictionary<string, string>();

            try
            {
                string importantthingsjson = CookieDecoder.DecodeCookieCharacters(Request.Cookies["importantthings2"].Value);
                JObject joimpthings = JObject.Parse(importantthingsjson);
                JToken thingsarray = joimpthings["importantthings"];

                for (int i = 0; i < thingsarray.Count(); i++)
                {
                    values.Add(thingsarray[i]["name"].ToString(), thingsarray[i]["name"].ToString());
                }

            }
            catch
            {
            }
            
            return values;
        }
   
        public static string BulletListForEmail(HttpRequestBase Request)
        {
            StringBuilder sbimportantthings = new StringBuilder();
            if (Request.Cookies["importantthings2"] != null)
            {
                string importantthingsjson = CookieDecoder.DecodeCookieCharacters(Request.Cookies["importantthings2"].Value);
                JObject joimpthings = JObject.Parse(importantthingsjson);
                JToken thingsarray = joimpthings["importantthings"];

                sbimportantthings.Append("<ul>");
                for (int i = 0; i < thingsarray.Count(); i++)
                {
                    sbimportantthings.Append("<li>" + AnnotateImportantThingForEmail(thingsarray[i]["name"].ToString()) + "</li>");
                }
                sbimportantthings.Append("</ul>");
            }

            return sbimportantthings.ToString();
        }
        private static string AnnotateImportantThingForEmail(string importantthing)
        {
            switch (importantthing)
            {
                case "Beauty": return "Beauty and Visual Perfection";
                case "Helping": return "Helping Others";
                case "Adventure": return "Risk & Adventure";
                case "Safety": return "Safety of Others";
                case "People": return "Working with People";
                case "Science": return "Science & Precision";
                case "Easy": return "Low Involvement";
                case "Duty": return "Sense of Duty";
                case "Admiration": return "Admiration by Others";
                case "Creativity": return "Creativity";
                case "Competition": return "High Competition";
                case "Animals": return "Nature & Animals";
                case "Politics": return "Politics, Strategy & Tactics";
                case "Technology": return "Technology";
                case "Growth": return "Growth Potential";
                default:
                    return importantthing;
            }
        }
    }
}