using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Mvc;


namespace SkillCowResponsive.Controllers
{

    public class ClassificationController : AuthenticatedControllerController
    {
        //
        // GET: /Classification/
        public class Classification
        {
            public string major { get; set; }
            public string names { get; set; }
        }
        public List<Classification> list = new List<Classification> { 
            new Classification {major = "11", names = "Management Occupations"},
            new Classification {major = "13", names = "Business and Financial Operations Occupations"},
            new Classification {major = "15", names = "Computer and Mathematical Occupations"},
            new Classification {major = "17", names = "Architecture and Engineering Occupations"},
            new Classification {major = "19", names = "Life, Physical, and Social Science Occupations"},
            new Classification {major = "21", names = "Community and Social Service Occupations"},
            new Classification {major = "23", names = "Legal Occupations"},
            new Classification {major = "25", names = "Education, Training, and Library Occupations"},
            new Classification {major = "27", names = "Arts, Design, Entertainment, Sports, and Media Occupations"},
            new Classification {major = "29", names = "Healthcare Practitioners and Technical Occupations"},
            new Classification {major = "31", names = "Healthcare Support Occupations"},
            new Classification {major = "33", names = "Protective Service Occupations"},
            new Classification {major = "35", names = "Food Preparation and Serving Related Occupations"},
            new Classification {major = "37", names = "Building and Grounds Cleaning and Maintenance Occupations"},
            new Classification {major = "39", names = "Personal Care and Service Occupations"},
            new Classification {major = "41", names = "Sales and Related Occupations"},
            new Classification {major = "43", names = "Office and Administrative Support Occupations"},
            new Classification {major = "45", names = "Farming, Fishing, and Forestry Occupations"},
            new Classification {major = "47", names = "Construction and Extraction Occupations"},
            new Classification {major = "49", names = "Installation, Maintenance, and Repair Occupations"},
            new Classification {major = "51", names = "Production Occupations"},
            new Classification {major = "53", names = "Transportation and Material Moving Occupations"}
        };
        public ActionResult Index(string major, string minor, string category)
        {
            if (major != null)
            {
                Regex regex = new Regex(@"[^a-z]+");
                foreach (Classification item in list)
                {

                    if (regex.Replace(item.names.ToLower(), "-") == major.ToLower())
                    {
                        ViewBag.major = item.major;
                        ViewBag.minor = minor != null ? minor : "";
                        ViewBag.category = category != null ? category : "";
                        return View();
                    }

                }
            }
            return RedirectToAction("Index", "Careers");            
        }
        
    }
}
