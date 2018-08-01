using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Text;
using System.Net;
using System.IO;

using SkillCow.Classes.Cloud.TableStorage.PersonalityTests.Tests.SkillAssessment;
using SkillCow.Classes.Cloud.TableStorage.PersonalityTests.CBNProfessions;
using SkillCow.Classes.Cloud.BlobStorage;
using SkillCow.Classes.Helpers;
using SkillCow.Classes.Cloud.TableStorage.PersonalityTests.CBNSchoolForms;
using System.Xml;

namespace SkillCow.Controllers
{
    public class CareersController : ControllerBase
    {
        /// <summary>
        /// Shows Branches
        /// </summary>
        /// <returns></returns>
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// Shows Professions within a branch
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public ActionResult In(string id)
        {
            ViewBag.BranchId = id;
            return View();
        }

        /// <summary>
        /// Shows Professions that require a certain attribute
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public ActionResult ByAttribute(string id)
        {
            ViewBag.Attribute = id;
            return View();
        }
    }
}
