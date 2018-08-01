using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SkillCowResponsive.Controllers
{
    public class InfoController : AuthenticatedControllerController
    {
        //
        // GET: /Info/

        public ActionResult Index()
        {
            return RedirectToAction("Index", "Assessment");
        }

    }
}
