using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using SkillCowResponsive.Classes.Encryption;
using System.Text;
using SkillCowResponsive.Classes.Cloud.TableStorage;

namespace SkillCowResponsive.Controllers
{
    public class AuthenticatedControllerController : ControllerBase
    {
        protected SimpleAES SimpleAES = new SimpleAES();
        protected string[] AuthTokens;

        protected bool IsValidUser(Func<string[], bool> logic)
        {
            if (Request["sessionkey"] == null || Request["sessionkey"] == "")
                return false;

            string decryptedsessionkey = SimpleAES.DecryptString(Request["sessionkey"].ToString());
            AuthTokens = decryptedsessionkey.Split('|');
            if (!logic(AuthTokens))
            {
                return false;
            }

            return true;
        }

        protected string ConstructSessionKey(params string[] tokens)
        {
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < tokens.Length; i++ )
            {
                if (i < tokens.Length - 1)
                {
                    sb.Append(tokens[i] + "|");
                }
                else
                {
                    sb.Append(tokens[i]);
                }

            }
            SimpleAES simpleaes = new SimpleAES();
            return simpleaes.EncryptToString(sb.ToString());
        }

        protected override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            base.OnActionExecuting(filterContext);
            string controller = filterContext.ActionDescriptor.ControllerDescriptor.ControllerName;
            SetAuthTokens();
            if (controller == "AdminPortal")
            {
                if (!IsValidUser(tokens => Request["sessionusername"] != null && tokens[1] == Request["sessionusername"].ToString() && (tokens[3] == "administrator" || tokens[3] == "su")))
                {
                    filterContext.Result = new RedirectResult("/Home");
                    return;
                }
            }
            else if (controller == "Analytics")
            {
                if (!IsValidUser(tokens => Request["sessionusername"] != null && tokens[1] == Request["sessionusername"].ToString() && (tokens[3] == "administrator" || tokens[3] == "counselor" || tokens[3] == "su")))
                {
                    filterContext.Result = new RedirectResult("/Home");
                    return;
                }
            }
            else if (controller == "CounselorPortal")
            {
                if (!IsValidUser(tokens => Request["sessionusername"] != null && tokens[1] == Request["sessionusername"].ToString() && (tokens[3] == "counselor" || tokens[3] == "su")))
                {
                    filterContext.Result = new RedirectResult("/Home");
                    return;
                }
            }
            else if (controller == "StudentPortal")
            {
                if (!IsValidUser(tokens => Request["sessionusername"] != null && tokens[1] == Request["sessionusername"].ToString() && (tokens[3] == "student")))
                {
                    filterContext.Result = new RedirectResult("/Home");
                    return;
                }
            }
            else if (controller == "Admin")
            {
                if (!IsValidUser(tokens => Request["sessionusername"] != null && tokens[1] == Request["sessionusername"].ToString() && tokens[3] == "su"))
                {
                    filterContext.Result = new RedirectResult("/Home");
                    return;
                }
            }
            //SiteVisitClient svc = new SiteVisitClient();
            //svc.AddNewItem(new SiteVisit { Controller = Request.RequestContext.RouteData.Values["controller"].ToString(), IP = Request.UserHostAddress, Browser = Request.Browser.Browser, Action = Request.RequestContext.RouteData.Values["action"].ToString() });
        }

        void SetAuthTokens()
        {
            bool valid = IsValidUser(tokens => Request["sessionusername"] != null && tokens[1] == Request["sessionusername"].ToString());
            if (AuthTokens != null)
            {
                if (AuthTokens[0] == "demo")
                {
                    ViewBag.Demo = true;
                }
                ViewBag.Name = AuthTokens[2];
                ViewBag.Email = AuthTokens[1];
                ViewBag.ProfileType = AuthTokens[3];
                if (AuthTokens[3] == "su")
                {
                    ViewBag.SUName = AuthTokens[2];
                    ViewBag.SUEmail = AuthTokens[1];
                    string adminRowKey = Request["adminrowkey"] != null ? Request["adminrowkey"].ToString() : "";
                    string adminName = Request["adminname"] != null ? Request["adminname"].ToString() : "";
                    if (adminRowKey != "" && adminName != "")
                    {
                        ViewBag.Name = HttpUtility.UrlDecode(adminName);
                        ViewBag.Email = adminRowKey;
                    }
                }
            }
        }
    }
}
