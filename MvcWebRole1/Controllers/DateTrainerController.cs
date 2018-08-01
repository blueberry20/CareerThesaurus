using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SkillCow.Controllers
{
    public class DateTrainerController : ControllerBase
    {
        //
        // GET: /DateTrainer/

        public ActionResult Index(string view)
        {
            string res = "hd720";
            string lang = "eng";
            int qindex = 1;

            if (view == null || view == "")
            {
                view = "Index";
            }

            if (Request["res"] != null)
            {
                res = Request["res"];
            }
            ViewBag.VideoResolution = res;

            if (Request["lang"] != null)
            {
                lang = Request["lang"];
            }
            ViewBag.Language = lang;

            if (Request["q"] != null)
            {
                string temp = Request["q"];
                int itemp;
                if(int.TryParse(temp, out itemp))
                {
                    if (itemp >= 1 && itemp <= 6)
                    {
                        qindex = itemp;
                    }
                }
            }

            ViewBag.InitialQIndex = qindex - 2;

            return View(view);
        }

        public ActionResult AudioIndex()
        {
            return View();
        }

        public ActionResult Files()
        {
            return View();
        }

        public ActionResult BrowserTest()
        {
            return View();
        }

        public ActionResult AudioTest()
        {
            return View();
        }
    }
}
