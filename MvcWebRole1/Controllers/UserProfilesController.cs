using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using SkillCow.Classes.Cloud.TableStorage;

namespace SkillCow.Controllers
{
    public class UserProfilesController : ControllerBase
    {
        //
        // GET: /UserProfiles/

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult showgenderresolutionallpartitions()
        {
            UserProfileClient upc = new UserProfileClient();
            return View(upc);
        }

        public ActionResult showgenderresolutionbypartition(string id)
        {
            ViewBag.Partition = id;
            UserProfileClient upc = new UserProfileClient();
            return View(upc);
        }

        public ActionResult updategenders()
        {
            UserProfileClient upc = new UserProfileClient();
            return View(upc);
        }
    }

}
