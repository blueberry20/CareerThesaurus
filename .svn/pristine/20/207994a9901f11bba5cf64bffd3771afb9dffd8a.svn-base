using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SkillCow.Controllers
{
    public class CourseController : ControllerBase
    {
        //
        // GET: /Course/

        public ActionResult Index(string id)
        {
            ViewBag.CourseId = id;
            ViewBag.CourseUrl = "http://ude.my/" + id;
            
            return View();
        }

    }
}
