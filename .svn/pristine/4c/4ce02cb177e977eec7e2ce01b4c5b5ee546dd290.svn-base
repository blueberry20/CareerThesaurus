using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Text;
using System.Net;
using System.IO;

using SkillCow.Classes.Cloud.TableStorage.PersonalityTests.Tests.SkillAssessment;
using SkillCow.Classes.Cloud.TableStorage.PersonalityTests.CBNProfessions;
using SkillCow.Classes.Cloud.BlobStorage;
using SkillCow.Classes.Helpers;
using SkillCow.Classes.Cloud.TableStorage.PersonalityTests.CBNSchoolForms;
using System.Xml;
using SkillCow.Classes;

namespace SkillCow.Classes
{
    

    public class UdemyCourseParser
    {
        string html;
        int cursor = 0;

        public string ParsePage(string url)
        {
            try
            {
                html = GetHttpResponse(url, null);

                string shortdescription = "";
                string fulldescription = "";
                int users = 0;
                
                
                string verifiablecertificate = "";

                string shortdescriptiontag = FindTag(html, "<meta name=\"description\" content=\"", "\"/>");
                if (shortdescriptiontag != "")
                {
                    shortdescription = GetTagContents(shortdescriptiontag, "<meta name=\"description\" content=\"", "\"/>");
                }
                

                string fulldescriptiontag = FindTag(html, "<div class=\"w3c-default\">", "</div>");
                if (fulldescriptiontag != "")
                {
                    fulldescription = GetTagContents(fulldescriptiontag, "<div class=\"w3c-default\">", "</div>");
                }

                string userscontainertag = FindTag(html, "<div class=\"slp-num-of-subscribers curly-shadow\">", "<div class=\"rand-user-imgs clearfix\">");
                if (userscontainertag!="")
                {
                    string userstag = FindTag(userscontainertag, "<b>", "</b>");
                    if (userstag != "")
                    {
                        string temp = GetTagContents(userstag, "<b>", "</b>");
                        if(IsNumeric(temp))
                        {
                            users = int.Parse(temp);
                        }
                    }
                }

                List<object> requirements = ParseList(FindTag(html, "<span>Course Requirements...</span>", "<div class=\"slp-list-box curly-shadow\">"),"<li>","</li>");
                List<object> reviews = ParseList(FindTag(html, "<h3>Reviews</h3>", "<div class=\"see-all\">"), "<article", "</article>");
                List<object> contents = ParseList(FindTag(html, "<div id=\"table-of-contents\">", "</div>"), "<li", "</li>");
               
                
                verifiablecertificate = html.ToLower().Contains("A Verifiable Certificate of Completion") ? "1" : "";
                

                object resultObject;
                resultObject = (new { result = "ok", shortdescription = shortdescription, users=users, fulldescription = fulldescription, requirements = requirements.ToArray(), contents = contents.ToArray(), reviews = reviews.ToArray(), certificate=verifiablecertificate });

                string result = resultObject.ToJSON();

                return result;

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        protected List<object> ParseList(string source, string itemstarttag, string itemendtag)
        {
            List<object> results = new List<object>();
            while (source.Contains(itemstarttag))
            {
                string articletag = FindTag(source, itemstarttag, itemendtag);
                if (articletag != "")
                {
                    string starttag = GetFullTag(articletag, itemstarttag);
                    string article = GetTagContents(articletag, starttag, itemendtag);

                    results.Add(new { text = article });

                    source = source.Replace(articletag, "");
                }
            }

            //If source did not have a UL list, see if its a paragraph and return as single item
            if (results.Count == 0 && source != "")
            {
                string articletag = FindTag(source, "<p>", "</p>");
                if (articletag != "") {
                    string article = GetTagContents(articletag, "<p>", "</p>");
                    results.Add(new { text = article });
                }
            }
            return results;
        }

        protected string FindTag(string source, string start, string end)
        {
            int startpos = source.IndexOf(start);

            if (startpos >= 0)
            {
                int endpos = source.IndexOf(end, startpos);
                if(endpos>=0)
                {
                    return source.Substring(startpos, (endpos + end.Length - startpos));
                }
                else{
                    return "";
                }
            }
            else
                return "";
        }
        
        protected string GetTagContents(string source, string starttag, string endtag)
        {
            int startpos = source.ToLower().IndexOf(starttag.ToLower());
            if (startpos == -1)
                return "";

            int endpos = source.ToLower().IndexOf(endtag.ToLower(), startpos);

            if (startpos >= 0 && endpos >= 0)
            {
                return source.Substring(startpos + starttag.Length, endpos - startpos - starttag.Length);
            }
            else
            {
                return "";
            }
        }

        protected bool IsNumeric(string val)
        {
            double result;
            if (double.TryParse(val, out result))
                return true;
            return false;
        }

        protected string GetFullTag(string source, string startswith)
        {
            int startpos = source.ToLower().IndexOf(startswith.ToLower());

            if (startpos < 0)
                return "";

            int endpos = source.ToLower().IndexOf(">", startpos);

            if (endpos < 0)
                return "";

            return source.Substring(startpos, endpos - startpos + 1);
        }

        protected string GetHttpResponse(string requestUrl, byte[] data)
        {
            // declare objects
            string responseData = String.Empty;
            HttpWebRequest req = null;
            HttpWebResponse resp = null;
            StreamReader strmReader = null;

            try
            {
                req = (HttpWebRequest)HttpWebRequest.Create(requestUrl);

                // in case of POST you need to post data
                if ((data != null) && (data.Length > 0))
                {
                    using (Stream strm = req.GetRequestStream())
                    {
                        strm.Write(data, 0, data.Length);
                    }
                }

                resp = (HttpWebResponse)req.GetResponse();
                strmReader = new StreamReader(resp.GetResponseStream());
                responseData = strmReader.ReadToEnd().Trim();
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
            finally
            {
                if (req != null)
                {
                    req = null;
                }

                if (resp != null)
                {
                    resp.Close();
                    resp = null;
                }
            }

            return responseData;
        }

        
    }
}