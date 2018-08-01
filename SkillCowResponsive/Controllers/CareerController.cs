﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Text.RegularExpressions;
using SkillCowResponsive.Classes.Cloud.BlobStorage;

namespace SkillCowResponsive.Controllers
{
    public class CareerController : AuthenticatedControllerController
    {
        //
        // GET: /Career/

        public ActionResult Index(string Profession)
        {
            if (Profession != null)
            {
                BlobJsonResourceManager blobManager = new BlobJsonResourceManager();
                string str = blobManager.GetJsonResource("careers", "dolcodes", Profession + ".js");
                if (str != "")
                {                    
                    Regex regex = new Regex(@"\d{2}-\d{4}");
                    string dolcode = regex.Match(str).ToString();
                    ViewBag.Dolcode = dolcode;
                    ViewBag.profession = Profession;
                    string descriptionBlog = blobManager.GetJsonResource("careers", "bydolcode/" + dolcode, "description.js");
                    regex = new Regex(@"\{([^}]+)\}");
                    string description = regex.Match(descriptionBlog).ToString().Substring(8);
                    description = description.Substring(0, description.Length - 2).Replace("|", " ");  
                    ViewBag.OgDescription = description;
                    string ogTitle = Profession.Replace("-", " ");
                    ViewBag.OgTitle = ogTitle.Substring(0, 1).ToUpper() + ogTitle.Substring(1).ToLower();                   
                    return View();
                }
            }
            return RedirectToAction("Index", "Careers");
        }
    }
}
