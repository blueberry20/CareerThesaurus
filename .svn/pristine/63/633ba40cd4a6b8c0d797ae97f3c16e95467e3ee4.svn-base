using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using SkillCow.Classes;

namespace SkillCow.Controllers
{
    public class VMController : ControllerBase
    {
        public ActionResult Index(string p, string m)
        {
            ViewBag.ProgramID = VMMapper.MapAreaOfStudy(p);
            if (m != null && m.ToLower() == "i")
            {
                //internal
                ViewBag.DisplayId = "10103";
                ViewBag.CampaignID = "8012";
                
            }
            else
            {
                //external
                ViewBag.DisplayId = "10586";
                ViewBag.CampaignID = "8013";
                
            }
            return View();
        }
    }
}
