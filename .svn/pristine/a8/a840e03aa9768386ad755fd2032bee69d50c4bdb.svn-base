using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SkillCow.Controllers
{
    public class MoreSchoolsController : ControllerBase
    {
        //
        // GET: /MoreSchools/

        public ActionResult Index(string prodid)
        {
            string zip = "";

            if (Request.Cookies["zip"] != null)
            {
                zip = Request.Cookies["zip"].Value;
            }

            ViewBag.ProdId = prodid;
            ViewBag.Zip = zip;

            return View();
        }

    }
}
