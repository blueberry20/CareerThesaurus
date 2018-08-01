using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SkillCowResponsive.Controllers
{
    public class PersonalityController : AuthenticatedControllerController
    {
        //
        // GET: /Personality/
        class Dimension
        {
            public string name { get; set; }
            public string[] values { get; set; }
        }
        List<Dimension> dimensions = new List<Dimension>{
            new Dimension { name = "attitude", values = new string[2] {"Extrovert", "Introvert"} },
            new Dimension { name = "endurance", values = new string[2] {"Stationary", "Mobile"} },
            new Dimension { name = "action", values = new string[2] {"Process", "Result"} },
            new Dimension { name = "concentration", values = new string[2] {"Focused", "Relaxed"} },
            new Dimension { name = "information", values = new string[2] {"Facts", "Imagination"} },
            new Dimension { name = "processing", values = new string[2] {"Rational", "Emotional"} },
            new Dimension { name = "presence", values = new string[2] {"Present", "Remote"} },
            new Dimension { name = "patterns", values = new string[2] {"Routine", "Discover"} },
            new Dimension { name = "compensation", values = new string[2] {"Variable", "Fixed"} }
        };

        public ActionResult Index(string trait)
        {
            if (trait == null)
            {
                return RedirectToAction("Index", "Home");
            }
            trait = trait.ToLower();
            trait = char.ToUpper(trait[0]) + trait.Substring(1);
            foreach (Dimension dimension in dimensions)
            {
                if (dimension.values.Contains(trait))
                {
                    ViewBag.Trait = trait;
                    ViewBag.Dimension = dimension.name;
                    return View();
                }
            }
            return RedirectToAction("Index", "Home");         
        }
    }
}
