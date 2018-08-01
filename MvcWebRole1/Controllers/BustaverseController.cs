using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SkillCow.Controllers
{
    public class BustaverseController : ControllerBase
    {
        //
        // GET: /Bustaverse/

        public ActionResult Index()
        {
            return View();
        }
                
        public ActionResult SyllableCounter()
        {
            return View();
        }
        public ActionResult Accent()
        {
            return View();
        }
        public ActionResult Rhyme()
        {
            return View();
        }

       
    }
}
