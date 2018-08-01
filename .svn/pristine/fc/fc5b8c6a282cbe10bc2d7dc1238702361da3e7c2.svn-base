using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Drawing;
using System.Web.Security;
using System.Diagnostics;
using Microsoft.WindowsAzure.ServiceRuntime;

using SkillCow.Classes.Helpers;
using SkillCow.Classes.Cloud.BlobStorage;
using System.Net;
using System.IO;
using SkillCow.Classes.Cloud.TableStorage.PersonalityTests.SkillCowRequestSubmissions;
using SkillCow.Classes.Cloud.TableStorage.ABTests;
using System.Text;
using SkillCow.Classes.Cloud.TableStorage;


namespace SkillCow.Controllers
{
    public class SimpleControllerBase : Controller
    {
        private bool userInitialized = false;

        public SimpleControllerBase()
        {
            
        }

        
        protected override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            base.OnActionExecuting(filterContext);

            //SiteVisitClient svc = new SiteVisitClient();
            //svc.AddNewItem(new SiteVisit { Controller = Request.RequestContext.RouteData.Values["controller"].ToString(), IP = Request.UserHostAddress, Browser = Request.Browser.Browser, Action = Request.RequestContext.RouteData.Values["action"].ToString() });

            if (ViewBag != null)
            {
                var request = Request;

#if DEBUG
                string appserverurl=String.Format("{0}://{1}:{2}",
                                    request.Url.Scheme,
                                    request.Url.Host,
                                    81);

                ViewBag.AppServerUrl = appserverurl;
#else
                ViewBag.AppServerUrl = String.Format("{0}://{1}",
                                    request.Url.Scheme,
                                    request.Url.Host);
#endif

                
            }
        }

        protected void ParamToCookie(string paramname, bool ignoreifset)
        {
            try
            {

                if (Request.QueryString[paramname] != null && Request.QueryString[paramname] != "")
                {
                    if (ignoreifset)
                    {
                        if (Request.QueryString[paramname] != null)
                        {
                            return;
                        }
                    }
                    Response.Cookies[paramname].Value = Request.QueryString[paramname];
                    Response.Cookies[paramname].Path = "/";
                }
            }
            catch(Exception e)
            {
            }
        }

        protected string DefaultErrorResponse(string errormessage)
        {
            object responseobject = null;
            responseobject = new
            {
                result = "error",
                errormessage = (errormessage != null && errormessage.Trim() != "" ? errormessage.ToJSONSafeString() : "")
            };

            return responseobject.ToJSON();
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