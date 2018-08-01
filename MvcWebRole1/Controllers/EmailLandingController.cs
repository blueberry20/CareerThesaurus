using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SkillCow.Controllers
{
    public class EmailLandingController : ControllerBase
    {
        //
        // GET: /EmailLanding/

        public ActionResult IndeedJob(string jobkey)
        {
            ViewBag.JobKey = jobkey;

            return View();
        }

        public ActionResult UdemyCourse()
        {
            return View();
        }

        public ActionResult TestResults()
        {
            return View();
        }
    }
}
