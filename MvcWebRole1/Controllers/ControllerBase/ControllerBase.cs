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
    public class ControllerBase : Controller
    {
        private bool userInitialized = false;

        public ControllerBase()
        {
            
        }

        
        protected override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            base.OnActionExecuting(filterContext);

            if(Request.AcceptTypes.Any(x=>x.Contains("json")))
            {
                return;
            }

            if (ViewBag != null)
            {
                var request = Request;

                ParamToCookie("demo", false); 
                ParamToCookie("layout", false);

#if DEBUG
                ViewBag.CompileMode = "DEBUG";
                ViewBag.ApplicationStatus = "ONLINE";
#else
                ViewBag.CompileMode = "";
                ViewBag.ApplicationStatus = "ONLINE";
#endif
                string defaultexternalcampaignid = "13564694";
                string defaultinternalcampaignid = "13564694";

                ViewBag.TollFreeNumberVanity = "888.EDU.7757";
                ViewBag.TollFreeNumberNumeric = "888.338.7757";
                ViewBag.IndeedChannel = defaultexternalcampaignid;
                ViewBag.CBNCampaign = defaultexternalcampaignid;
                
                //GA variable
                ParamToCookie("utm_source",false);
                ParamToCookie("utm_campaign", false); 
                ParamToCookie("utm_content", true);
                ParamToCookie("utm_term", false);
                
                if (Request.Cookies["utm_source"] != null)
                {
                    ViewBag.UtmSource = Request.Cookies["utm_source"].Value;
                }

                if (Request.Cookies["testresults"] != null)
                {
                    ViewBag.TestResults = Request.Cookies["testresults"].Value;
                }

                string hpheader = "Find out What You were Born to Do in Life";
                if (Request["hpheader"] != null)
                {
                    hpheader = Request["hpheader"];
                }
                string hptext = "Your brain is already \"Wired\" to perform certain tasks better than others. Choosing a Career path that Naturally fits your personality is key to Success! Find out what you were born to do!";
                if (Request["hptext"] != null)
                {
                    hptext = Request["hptext"].Replace("\\n","<br/>");
                }

                ViewBag.HPHeader = hpheader;
                ViewBag.HPText = hptext;

                bool islocked = Request.RawUrl.Contains("m=l");

                if (islocked)
                {
                    Response.Cookies["locked"].Value = "1";
                }

                if (Request.Cookies["locked"] != null && Request.Cookies["locked"].Value != null)
                {
                    ViewBag.IsLockedMode = true;
                    islocked = true;
                }
                else
                {
                    ViewBag.IsLockedMode = false;
                    islocked = false;
                }

                string activecampaignid = defaultinternalcampaignid;

                if (Request.QueryString["campaign_id"] != null && Request.QueryString["campaign_id"] != "")
                {
                    activecampaignid = Request.QueryString["campaign_id"];
                }

                bool recordsubmitted = false;
                bool extendedrecordsubmitted = false;

                if (Request.Cookies["recordsubmitted"] != null)
                {
                    recordsubmitted = true;
                    ViewBag.RecordSubmitted = true;
                }

                if (Request.Cookies["extendedrecordcomplete"] != null)
                {
                    extendedrecordsubmitted = true;
                    ViewBag.ExtendedRecordSubmitted = true;
                }

                //Conversion Google Code Triggers
                if (extendedrecordsubmitted && Request.Cookies["extendedrecordconversionfired"] == null && Request.Cookies["ascv"] != null)
                {
                    ViewBag.FireAdSenseConversion = true;
                    ViewBag.AdSenseConversionValue = Request.Cookies["ascv"].Value;
                    Response.Cookies["extendedrecordconversionfired"].Value = "1";
                    Response.Cookies["extendedrecordconversionfired"].Expires = DateTime.UtcNow.AddDays(90);
                }
                else if (recordsubmitted && Request.Cookies["recordconversionfired"] == null && Request.Cookies["ascv"] != null)
                {
                    ViewBag.FireAdSenseConversion = true;
                    ViewBag.AdSenseConversionValue = Request.Cookies["ascv"].Value;
                    Response.Cookies["recordconversionfired"].Value = "1";
                    Response.Cookies["recordconversionfired"].Expires = DateTime.UtcNow.AddDays(90);
                }
                else
                {
                    ViewBag.FireAdSenseConversion = false;
                }

                ViewBag.HideHomePageJobTools = islocked;

                if (Request.RawUrl.Contains("source=cbn"))
                {
                    Response.Cookies["tollfreenumbervanity"].Value = "800.523.0858";
                    Response.Cookies["tollfreenumbernumeric"].Value = "800.523.0858";

                    Response.Cookies["indeedchannel"].Value = defaultinternalcampaignid;
                    Response.Cookies["cbncampaign"].Value = activecampaignid;
                    Response.Cookies["mode"].Value = "internal";
                    ViewBag.VMCampaign = "7587";
                    Response.Cookies["vmcampaign"].Value = "7587";
                }
                else if (Request.RawUrl.Contains("source=external"))
                {
                    activecampaignid = defaultexternalcampaignid;

                    if (Request["campaign_id"] != null && Request["campaign_id"] != "")
                    {
                        activecampaignid = Request["campaign_id"];
                    }

                    Response.Cookies["tollfreenumbervanity"].Value = "888.EDU.7757";
                    Response.Cookies["tollfreenumbernumeric"].Value = "888.338.7757";
                    Response.Cookies["indeedchannel"].Value= defaultexternalcampaignid;
                    Response.Cookies["cbncampaign"].Value = activecampaignid;
                    Response.Cookies["mode"].Value= "external";
                    ViewBag.VMCampaign = "7871"; //external vm campaign
                    Response.Cookies["vmcampaign"].Value = "7871";
                }
                else
                {
                    if (Request.Cookies["cbncampaign"] == null)
                    {
                        Response.Cookies["cbncampaign"].Value = activecampaignid;
                    }

                    Response.Cookies["mode"].Value = "external";

                    if (Request.Cookies["cbncampaign"] != null) {
                        ViewBag.CBNCampaign = Request.Cookies["cbncampaign"].Value;
                    }

                    if (Request.Cookies["tollfreenumbervanity"] != null)
                    {
                        ViewBag.TollFreeNumberVanity = Request.Cookies["tollfreenumbervanity"].Value;
                    }
                    if (Request.Cookies["tollfreenumbernumeric"] != null)
                    {
                        ViewBag.TollFreeNumberNumeric = Request.Cookies["tollfreenumbernumeric"].Value;
                    }
                    if (Request.Cookies["indeedchannel"] != null)
                    {
                        ViewBag.IndeedChannel = Request.Cookies["indeedchannel"].Value;
                    }

                    ViewBag.VMCampaign = "7871"; //external vm campaign
                    Response.Cookies["vmcampaign"].Value = "7871";
                }

                ViewBag.UrlScheme = request.Url.Scheme;


                
                
#if DEBUG
                string appserverurl=String.Format("{0}://{1}:{2}",
                                    request.Url.Scheme,
                                    request.Url.Host,
                                    85);

                ViewBag.AppServerUrl = appserverurl;
#else
                ViewBag.AppServerUrl = String.Format("{0}://{1}",
                                    request.Url.Scheme,
                                    request.Url.Host);
#endif

                string strUserAgent = "";

                if (Request.UserAgent!=null)
                {
                    Request.UserAgent.ToString().ToLower();
                }

                ViewBag.RequestUserAgent = strUserAgent;

                if (strUserAgent != null)
                {
                    if (Request.Browser.IsMobileDevice == true || strUserAgent.Contains("iphone") ||
                        strUserAgent.Contains("blackberry") || strUserAgent.Contains("mobile") ||
                        strUserAgent.Contains("windows ce") || strUserAgent.Contains("opera mini") ||
                        strUserAgent.Contains("palm") || strUserAgent.Contains("android"))
                    {
                        ViewBag.IsMobileDevice = true;
                    }
                    else
                    {
                        ViewBag.IsMobileDevice = false;
                    }
                }
                else
                {
                    ViewBag.IsMobileDevice = false;
                }

                if (Request.Cookies["layout"] != null && Request.Cookies["layout"].Value == "fb")
                {
                    ViewBag.IsMobileDevice = true;
                }
                
                if (ViewBag.ApplicationStatus == "OFFLINE")
                {
                    if(filterContext.ActionDescriptor.ControllerDescriptor.ControllerName != "Home")
                        filterContext.Result = new RedirectResult("/");
                }

                string appversion = this.GetType().Assembly.GetName().Version.ToString();
                ViewBag.AppVersion = appversion;
                ViewBag.ScreenWidth = Request.Browser.ScreenPixelsWidth;
                ViewBag.ScreenHeight = Request.Browser.ScreenPixelsHeight;

                //SiteVisitClient svc = new SiteVisitClient();
                //svc.AddNewItem(new SiteVisit { Controller = Request.RequestContext.RouteData.Values["controller"].ToString(), IP = Request.UserHostAddress, Browser = Request.Browser.Browser, Action = Request.RequestContext.RouteData.Values["action"].ToString() });
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