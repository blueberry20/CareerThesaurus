using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SkillCowResponsive.Controllers
{
    public class SkillCowController : Controller
    {
        //
        // GET: /SkillCow/

        public ActionResult Index(string catchAllRoute)
        {
            Response.Cookies["skillcow"].Value = "1";
            Response.Cookies["skillcow"].Expires = DateTime.UtcNow.AddDays(1);
            Response.Cookies["source"].Value = "skillcow";
            Response.Cookies["source"].Expires = DateTime.UtcNow.AddDays(1);
            
            return RedirectToAction("Index", "TakeTest");
        }

    }
}
