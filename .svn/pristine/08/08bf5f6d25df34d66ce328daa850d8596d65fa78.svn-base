using SkillCowResponsive.Classes.Encryption;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SkillCowResponsive.Controllers
{
    public class DemoStudentsController : Controller
    {
        //
        // GET: /DemoStudents/

        public ActionResult Index()
        {
            string sessionkey = ClientSession.GetClientSessionKey("demo", "ed.rooney@careerthesaurus.com", "Ed Rooney", "administrator");
            Response.Cookies["sessionkey"].Value = sessionkey;
            Response.Cookies["sessionkey"].Expires = DateTime.UtcNow.AddDays(1);
            Response.Cookies["sessionusername"].Value = "ed.rooney@careerthesaurus.com";
            Response.Cookies["sessionusername"].Expires = DateTime.UtcNow.AddDays(1);
            Response.Cookies["cbnvm"].Value = "1";
            Response.Cookies["cbnvm"].Expires = DateTime.UtcNow.AddDays(1);
            Response.Cookies["demosteps"].Value = "";
            Response.Cookies["demosteps"].Expires = DateTime.UtcNow.AddDays(1);
            return RedirectToAction("StudentReports", "Analytics");
        }

    }
}
