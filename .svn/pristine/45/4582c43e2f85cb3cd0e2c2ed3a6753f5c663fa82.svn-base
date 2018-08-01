using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using SkillCowResponsive.Classes.Encryption;
using SkillCowResponsive.Classes.Cloud.TableStorage.UserAccount;

namespace SkillCowResponsive.Controllers
{
    public class WelcomeController : AuthenticatedControllerController
    {
        //
        // GET: /Welcome/

        public ActionResult Index()
        {
            return View();
        }

        private string GetGender(string gender)
        {
            gender = gender.ToLower();
            switch (gender.Replace(@"[^a-z]+", "")) {
                case "mr":
                case "male":
                    return "male";
                case "mrs":
                case "ms":
                case "female":
                    return "female";
                default:
                    return "male";
            }
        }
    }
}
