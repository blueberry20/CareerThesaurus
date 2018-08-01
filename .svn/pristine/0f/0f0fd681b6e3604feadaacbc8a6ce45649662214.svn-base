using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using SkillCow.Classes.Cloud.TableStorage;

namespace SkillCow.Controllers
{
    public class SiteVisitsController : Controller
    {
        //
        // GET: /SiteVisits/

        public ActionResult Index(string partition)
        {
            SiteVisitClient svc = new SiteVisitClient();
            
            return View(svc.GetAllByPartition(partition));
        }

        
    }
}
