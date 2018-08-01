using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text;
using Newtonsoft.Json.Linq;

namespace SkillCowResponsive.Classes.CookieData
{
    public class CookieDataTestResults
    {
        public static string[] Dimensions
        {
            get 
            {
                return new string[9] { "Attitude", "Information", "Processing", "Action", "Endurance", "Presence", "Concentration", "Patterns", "Compensation" };
            }
        }

        public static Dictionary<string, string> GetValues(string jsonstring)
        {
            Dictionary<string, string> values = new Dictionary<string, string>();

            try
            {
                if (jsonstring == null || jsonstring == "")
                {
                    foreach (string dim in Dimensions)
                    {
                        values.Add(dim, "");
                    }
                    return values;
                }

                JObject jo = JObject.Parse(jsonstring);
                JArray items = (JArray)jo["dimesions"];

                foreach (string dim in Dimensions)
                {
                    string v = "";

                    foreach (JObject item in items)
                    {
                        if (item[dim] != null)
                        {
                            v = item[dim].ToString();
                        }
                    }

                    values.Add(dim, v);
                }
            }
            catch
            {
            }
            return values;
        }

        public static Dictionary<string, string> GetValues(HttpRequestBase Request)
        {
            Dictionary<string, string> values = new Dictionary<string, string>();

            try{
                if (Request.Cookies["testresults2"] != null)
                {
                    string testresults2 = CookieDecoder.DecodeCookieCharacters(Request.Cookies["testresults2"].Value);
                    JObject jo = JObject.Parse(testresults2);

                    foreach (string dim in Dimensions)
                    {
                        values.Add(dim, jo[dim].ToString());
                    }
                }
            }
            catch
            {
            }
            return values;
        }

        public static string BulletListForEmail(HttpRequestBase Request)
        {
            StringBuilder sbtestresults = new StringBuilder();

            if (Request.Cookies["testresults2"] != null)
            {
                string testresults2 = CookieDecoder.DecodeCookieCharacters(Request.Cookies["testresults2"].Value);
                JObject jo = JObject.Parse(testresults2);
                sbtestresults.Append("<ul>");

                foreach (string dim in Dimensions)
                {
                    sbtestresults.Append("<li>" + AnnotateTraitForEmail(jo, dim) + "</li>");
                }

                /*
                sbtestresults.Append("<li>" + AnnotateTraitForEmail(jo, "Attitude") + "</li>");
                sbtestresults.Append("<li>" + AnnotateTraitForEmail(jo, "Information") + "</li>");
                sbtestresults.Append("<li>" + AnnotateTraitForEmail(jo, "Processing") + "</li>");
                sbtestresults.Append("<li>" + AnnotateTraitForEmail(jo, "Action") + "</li>");
                sbtestresults.Append("<li>" + AnnotateTraitForEmail(jo, "Endurance") + "</li>");
                sbtestresults.Append("<li>" + AnnotateTraitForEmail(jo, "Presence") + "</li>");
                sbtestresults.Append("<li>" + AnnotateTraitForEmail(jo, "Concentration") + "</li>");
                sbtestresults.Append("<li>" + AnnotateTraitForEmail(jo, "Patterns") + "</li>");
                sbtestresults.Append("<li>" + AnnotateTraitForEmail(jo, "Compensation") + "</li>");
                 * */
                sbtestresults.Append("</ul>");
            }
            return sbtestresults.ToString();
        }

        private static string AnnotateTraitForEmail(JObject jo, string dimension)
        {
            string value = jo[dimension].ToString();
            switch (dimension)
            {
                case "Attitude":
                    switch (value)
                    {
                        case "Extravert":
                            return "<b>Extravert</b>";
                        case "Introvert":
                            return "<b>Introvert</b>";
                        default:
                            return "";
                    }
                case "Information":
                    switch (value)
                    {
                        case "Imagination":
                            return "Often relies on own <b>Imagination</b>";
                        case "Facts":
                            return "Relies on Concrete <b>Facts</b>";
                        default:
                            return "";
                    }
                case "Processing":
                    switch (value)
                    {
                        case "Emotional":
                            return "Tends to be an <b>Emotional</b> thinker";
                        case "Rational":
                            return "Tends to be a <b>Rational</b> thinker";
                        default:
                            return "";
                    }
                case "Action":
                    switch (value)
                    {
                        case "Result":
                            return "<b>Results</b> Oriented";
                        case "Process":
                            return "<b>Process</b> Oriented";
                        default:
                            return "";
                    }
                case "Endurance":
                    switch (value)
                    {
                        case "Stationary":
                            return "Ok being <b>Stationary</b>";
                        case "Mobile":
                            return "Prefers to be <b>Mobile</b>";
                        default:
                            return "";
                    }
                case "Presence":
                    switch (value)
                    {
                        case "Present":
                            return "Prefers to be <b>Present</b>";
                        case "Remote":
                            return "Prefers to be <b>Remote</b>";
                        default:
                            return "";
                    }
                case "Concentration":
                    switch (value)
                    {
                        case "Focused":
                            return "Likes to stay <b>Focused</b>";
                        case "Relaxed":
                            return "Prefers a <b>Relaxed</b> work environment";
                        default:
                            return "";
                    }
                case "Patterns":
                    switch (value)
                    {
                        case "Discover":
                            return "Tries to <b>Discover</b> new ways";
                        case "Routine":
                            return "Prefers <b>Routine</b> patterns";
                        default:
                            return "";
                    }
                case "Compensation":
                    switch (value)
                    {
                        case "Variable":
                            return "Okay with <b>Variable</b> compensation";
                        case "Fixed":
                            return "Prefers <b>Stable</b> pay check";
                        default:
                            return "";
                    }
                default:
                    return "";
            }
        }
    }
}