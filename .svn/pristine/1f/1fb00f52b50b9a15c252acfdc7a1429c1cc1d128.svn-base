using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SkillCowResponsive.Controllers
{
    public class HomeController : AuthenticatedControllerController
    {
        //
        // GET: /Home/

        public ActionResult Index(string id)
        {
            bool islocked = Request.Cookies["locked"] != null && Request.Cookies["locked"].Value == "1";
            if (islocked)
            {
                return RedirectToAction("TakeTest", "CareerTest");
            }
            if (id == null)
            {
                return View();
            }
            else
            {
                return View(id);
            }
        }

        public ActionResult HomeV2()
        {
            return View();
        }
    }
}
