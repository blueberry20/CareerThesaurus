using System.Web.Script.Serialization;

using SkillCowResponsive.Classes.Cloud.TableStorage.AccessCode;

using SkillCowResponsive.Classes.Encryption;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Mvc;
using SkillCowResponsive.Classes.Helpers;

namespace SkillCowResponsive.Controllers
{
    public class AssessmentController : AuthenticatedControllerController
    {
        public string zipcode { get; set; }
        public string[] dimensions = { "attitude", "endurance", "action", "concentration", "information", "processing", "presence", "patterns", "compensation" };

        List<ImportantThings> importantThings = new List<ImportantThings>() {
            new  ImportantThings { name = "beauty", caption = "Beauty & Visual Perfection" },
            new  ImportantThings { name = "helping", caption = "Helping Others" },
            new  ImportantThings { name = "adventure", caption = "Risk & Adventure" },
            new  ImportantThings { name = "safety", caption = "Safety of Others" },
            new  ImportantThings { name = "people", caption = "Working with People" },
            new  ImportantThings { name = "science", caption = "Scientific Methods & Precision" },
            new  ImportantThings { name = "duty", caption = "Sense of Duty" },
            new  ImportantThings { name = "admiration", caption = "Being in a Spot Light" },
            new  ImportantThings { name = "creativity", caption = "Creativity" },
            new  ImportantThings { name = "competition", caption = "Competitiveness" },
            new  ImportantThings { name = "animals", caption = "Nature & Animals" },
            new  ImportantThings { name = "politics", caption = "Politics & Strategy" },
            new  ImportantThings { name = "technology", caption = "Technology & Gadgets" },
            new  ImportantThings { name = "machinery", caption = "Machinery" },
            new  ImportantThings { name = "handlabor", caption = "Hand Labor" },
            new  ImportantThings { name = "strength", caption = "Using Body Strength" },
            new  ImportantThings { name = "drafting", caption = "Drafting & Sketching" },
            new  ImportantThings { name = "coordinating", caption = "Coordinating Groups" },
            new  ImportantThings { name = "numbers", caption = "Working with Numbers" },
            new  ImportantThings { name = "critical", caption = "Giving Critical Advice" },
            new  ImportantThings { name = "salesy", caption = "Salesiness" }
        };
        //
        // GET: /Assessment/

        [HttpGet]
        public ActionResult Index(string firstname, string lastname, string email, string phone)
        {
            if (firstname != null && lastname != null && email != null)// && phone != null)
            {
                ViewBag.adminFirstName = firstname;
                ViewBag.adminLastName = lastname;
                ViewBag.adminEmail = HttpUtility.UrlDecode(email);
                ViewBag.adminPhone = phone;
            }
            return View("Welcome");
            //return RedirectToAction("LogIn", "Account");
        }
        public ActionResult AccessCode(string id)
        {
            Regex reg = new Regex("^[a-zA-Z0-9]*$");
            if (id != null && reg.IsMatch(id))
            {
                AccessCodeClient acc = new AccessCodeClient();
                AccessCode accessCode = acc.GetByPartitionAndRowKey("accesscode", id);
                if (accessCode != null)
                {
                    ViewBag.AccessCode = id;
                    return View();
                }
            }
            return RedirectToAction("Index", "Home");
        }        
    }
}
