using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using SkillCow.Classes.Encryption;
using System.Text;
using SkillCow.Classes.Cloud.TableStorage;

namespace SkillCow.Controllers
{
    public class SimpleAuthenticatedControllerController : SimpleControllerBase
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
            for (int i = 0; i < tokens.Length; i++)
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

            //SiteVisitClient svc = new SiteVisitClient();
            //svc.AddNewItem(new SiteVisit { Controller = Request.RequestContext.RouteData.Values["controller"].ToString(), IP = Request.UserHostAddress, Browser = Request.Browser.Browser, Action = Request.RequestContext.RouteData.Values["action"].ToString() });
        }
    }
}
