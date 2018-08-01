using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using SkillCowResponsive.Classes.Helpers;
using Newtonsoft.Json;
using SkillCowResponsive.Classes.Cloud.TableStorage.AccessCode;
using SkillCowResponsive.Classes.Cloud.TableStorage.CounselorAccount;

namespace SkillCowResponsive.Controllers
{
    public class CounselorPortalController : AuthenticatedControllerController
    {
        //
        // GET: /CounselorPortal/
        [HttpGet]
        public ActionResult Index()
        {
            string counselor = AuthTokens[1];
            AccessCodeClient acc = new AccessCodeClient();
            JavaScriptSerializer jss = new JavaScriptSerializer();
            List<AccessCode> groups = new List<AccessCode>(acc.GetAllByCounselor(counselor));
            string years = "[]";
            string grades = "[]";
            if (groups.Count != 0)
            {

                years = JsonConvert.SerializeObject(groups.Select(x => x.Year).Distinct().ToList());
                grades = JsonConvert.SerializeObject(groups.Select(x => x.Grade).Distinct().ToList());
            }
            if (TempData["counselor"] != null)
            {
                ViewBag.FirstVisit = true;
            }
            ViewBag.CurrentYear = AccessCodeClient.CurrentGradYear();
            ViewBag.Groups = JsonConvert.SerializeObject(groups);
            ViewBag.Years = years;
            ViewBag.Grades = grades;
            if (TempData["error"] != null)
            {
                ViewBag.ErrorMessage = true;
            }
            return View();
        }
        [HttpPost]
        public ActionResult Index(IEnumerable<string> year, IEnumerable<string> grade, IEnumerable<string> groupname)
        {
            if (AuthTokens[0] == "demo")
            {
                return View();
            }
            if (year != null && grade != null && groupname != null)
            {
                if (year.Count() == grade.Count() && year.Count() == groupname.Count())
                {
                    string counselor = AuthTokens[1].ToLower();
                    CounselorAccountClient cac = new CounselorAccountClient();
                    AccessCodeClient acc = new AccessCodeClient();
                    CounselorAccount account = cac.GetByPartitionAndRowKey("counselor", counselor);
                    string school = account.School;                  
                    for (var i = 0; i < year.Count(); i++)
                    {
                        acc.AddNewItem(new AccessCode { RowKey = ShortGuidGenerator.NewGuid(), Code = PinCodeGenerator.NewPin(), Year = year.ElementAt(i), Grade = grade.ElementAt(i), Counselor = counselor, GroupName = groupname.ElementAt(i), School = school });
                    }
                    return RedirectToAction("Index");
                }
            }
            TempData["error"] = true;
            return RedirectToAction("Index");
        }
    }
}
