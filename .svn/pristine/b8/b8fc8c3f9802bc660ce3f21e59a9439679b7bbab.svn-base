using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Xml;
using System.IO;
using SkillCow.Classes.Helpers;
using System.Text;
using System.Diagnostics;
using SkillCow.Classes.Cloud.TableStorage.DirectClients.Employers;
using System.Collections.Specialized;
using System.Net;

namespace SkillCow.Controllers
{
    public class JobsController : ControllerBase
    {
        //
        // GET: /Jobs/

        public ActionResult Index(string id)
        {
            
            return View();
        }

        public ActionResult Search(string q)
        {
            if (q != null && q.Trim()!="")
            {
                string[] tags = q.Trim().Split(' ');

                StringBuilder sb = new StringBuilder();

                for (int i = 0; i < tags.Length; i++)
                {
                    if (tags[i].Trim() != "")
                    {
                        sb.Append("<div class=\"searchterm\" title=\"Remove\">" + tags[i] + "</div>");
                    }
                }
                ViewBag.SearchTerms = sb.ToString();
            }
            else
            {
                ViewBag.SearchTerms = "";
            }

            if (q != null)
            {
                ViewBag.Query = q.Trim();
            }
            else
            {
                ViewBag.Query = "";
            }

            ViewBag.Title = q.Trim() + " jobs";
            ViewBag.MetaDescription = "Job search results for " + q.Trim();
            ViewBag.MetaKeywords = "jobs,positions,now hiring,near me,immediate openings,find perfect job,career change";

            return View();
        }

        [HttpPost]
        public HttpResponse getindeedjobs(string p, string l, string c, string limit, string start)
        {
            try
            {

                if (l == null)
                    l = "";

                if (limit == null)
                    limit = "10";

                if (start == null)
                    start = "0";

                string ipaddress = "";
#if DEBUG
                ipaddress = RandomHelper.Instance.Next(1, 256) + "." + RandomHelper.Instance.Next(0, 256) + "." + RandomHelper.Instance.Next(0, 256) + "." + RandomHelper.Instance.Next(1, 256);
#else
                ipaddress =  Request.UserHostAddress;
#endif
                p = p.ToLower().Replace(" ", "+").Replace("/", "+");
                string results = GetHttpResponse("http://api.indeed.com/ads/apisearch?publisher=9956090887151436&q=" + HttpUtility.HtmlEncode(p) +
                    "&format=json" + 
                    "&l=" + HttpUtility.HtmlEncode(l) +
                    "&sort=date&radius=25&st=employer&jt=&start=" + start + "&limit=" + limit + "&fromage=&filter=&latlong=1&co=us&chnl=" + c + "&userip=" + ipaddress + 
                    "&useragent=" + HttpUtility.HtmlEncode(Request.UserAgent.ToString()) + "&v=2", null);

                Console.WriteLine(results);
                
                Response.ContentType = "application/json";
                Response.Write("{\"result\": \"ok\", \"results\": " + results.Replace("\n","")  + " }");
                Response.End();
            }
            catch (Exception ex)
            {
                Response.ContentType = "application/json";
                Response.Write(DefaultErrorResponse(ex.Message));
                Response.End();
            }

            return null;
        }

        



        [HttpPost]
        public HttpResponse getindeedjobdescriptions(string jobkeys)
        {
            try
            {
                string results = GetHttpResponse("http://api.indeed.com/ads/apigetjobs?publisher=9956090887151436&jobkeys=" + jobkeys + "&v=2&format=json", null);

                Response.ContentType = "application/json";
                Response.Write("{\"result\": \"ok\", \"results\": " + results + " }");
                Response.End();
            }
            catch (Exception ex)
            {
                Response.ContentType = "application/json";
                Response.Write(DefaultErrorResponse(ex.Message));
                Response.End();
            }

            return null;
        }

        [HttpPost]
        public HttpResponse matchjobs(string zip, string a, string t, string limit, string start, string g)
        {
            try
            {
                if (g == null)
                {
                    g = "";
                }
                if (limit == null)
                    limit = "10";

                if (start == null)
                    start = "0";

                string ipaddress = "";
#if DEBUG
                ipaddress = RandomHelper.Instance.Next(1, 256) + "." + RandomHelper.Instance.Next(0, 256) + "." + RandomHelper.Instance.Next(0, 256) + "." + RandomHelper.Instance.Next(1, 256);
#else
                ipaddress =  Request.UserHostAddress;
#endif
                DirectEmployerSearchEngine engine = new DirectEmployerSearchEngine();

                Response.ContentType = "application/json";
                Response.Write("{\"result\": \"ok\", \"results\": " + engine.FindPositions(Request, zip, a,t, g, "").ToJSON() + " }");
                Response.End();
            }
            catch (Exception ex)
            {
                Response.ContentType = "application/json";
                Response.Write(DefaultErrorResponse(ex.Message));
                Response.End();
            }

            return null;
        }
        [HttpPost]
        public HttpResponse getfeaturedjobsbyprogram(string zip, string programid)
        {
            try
            {
                string ipaddress = "";
#if DEBUG
                ipaddress = RandomHelper.Instance.Next(1, 256) + "." + RandomHelper.Instance.Next(0, 256) + "." + RandomHelper.Instance.Next(0, 256) + "." + RandomHelper.Instance.Next(1, 256);
#else
                ipaddress =  Request.UserHostAddress;
#endif
                DirectEmployerSearchEngine engine = new DirectEmployerSearchEngine();

                Response.ContentType = "application/json";
                Response.Write("{\"result\": \"ok\", \"results\": " + engine.FindPositions(Request, zip, "", "", "", programid).ToJSON() + " }");
                Response.End();
            }
            catch (Exception ex)
            {
                Response.ContentType = "application/json";
                Response.Write(DefaultErrorResponse(ex.Message));
                Response.End();
            }

            return null;
        }
    }
}
