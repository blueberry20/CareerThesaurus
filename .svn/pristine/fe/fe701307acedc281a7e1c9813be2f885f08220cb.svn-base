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
using Newtonsoft.Json.Linq;
using SkillCow.Classes.Cloud.TableStorage.PersonalityTests.SkillCowRequestSubmissions;

namespace SkillCow.Controllers
{
    public class CareerController : ControllerBase
    {
        public ActionResult Index(string id)
        {
            string rowkey = BlobStringManager.Instance.GetString("skillcow", "professionids", id);
                        
            CBNProfessionClient pc = new CBNProfessionClient();
            CBNProfession p =null;
            if (rowkey == null || rowkey == "")
            {
                p = pc.GetByUrlParam(id);

                ViewBag.Profession = p;
                rowkey = p.RowKey;
                BlobStringManager.Instance.SaveString(p.RowKey, id, "skillcow", "professionids");
            }
            else
            {
                p = pc.GetByRowKey(rowkey);
                ViewBag.Profession = p;
            }

            string json = BlobJsonResourceManager.Instance.GetJsonResource(rowkey, "data", "details");
            if(json!="")
            {
                JObject jo = JObject.Parse(json);
                ViewBag.Description = TrimLineBreaks(jo["description"].ToString());

                string article = "";
                switch (p.Profession[0]) {
                    case 'a':
                    case 'e':
                    case 'i':
                    case 'o':
                    case 'u':
                    case 'A':
                    case 'E':
                    case 'I':
                    case 'O':
                    case 'U':
                        article = "an";
                        break;
                    default:
                        article = "a";
                        break;
                }

                if (jo["duties"] != null && jo["duties"].ToString() != "")
                {
                    ViewBag.DutiesTitle = "Typical duties of " + article + " " + p.Profession;
                    ViewBag.DutiesText = TrimLineBreaks(jo["duties"].ToString());
                }
                if (jo["wheretofind"] != null && jo["wheretofind"].ToString() != "")
                {
                    ViewBag.WhereToFindTitle = "Where " + p.Profession + " jobs are found";
                    ViewBag.WhereToFindText = TrimLineBreaks(jo["wheretofind"].ToString());
                }
                if (jo["salary"] != null && jo["salary"].ToString() != "")
                {
                    ViewBag.SalaryTitle = "Salary of " + article + " " + p.Profession;
                    ViewBag.SalaryText = TrimLineBreaks(jo["salary"].ToString());
                }
                if (jo["demand"] != null && jo["demand"].ToString() != "")
                {
                    ViewBag.DemandTitle = "Demand";
                    ViewBag.DemandText = TrimLineBreaks(jo["demand"].ToString());
                }
            }

            ViewBag.BranchUrlParam = p.Branch.FormatProfessionNameAsUrlParam();
            ViewBag.BranchName = p.Branch;
                                               
            return View();
        }

        public ActionResult Thanks(string id)
        {
            string rowkey = BlobStringManager.Instance.GetString("skillcow", "professionids", id);


            CBNProfessionClient pc = new CBNProfessionClient();
            CBNProfession p = null;
            if (rowkey == null || rowkey == "")
            {
                p = pc.GetByUrlParam(id);
                ViewBag.Profession = p;
                rowkey = p.RowKey;
                BlobStringManager.Instance.SaveString(p.RowKey, id, "skillcow", "professionids");
            }
            else
            {
                p = pc.GetByRowKey(rowkey);
                ViewBag.Profession = p;
            }

            string json = BlobJsonResourceManager.Instance.GetJsonResource(rowkey, "data", "details");
            if (json != "")
            {
                JObject jo = JObject.Parse(json);
                ViewBag.Description = TrimLineBreaks(jo["description"].ToString());

                string article = "";
                switch (p.Profession[0])
                {
                    case 'a':
                    case 'e':
                    case 'i':
                    case 'o':
                    case 'u':
                    case 'A':
                    case 'E':
                    case 'I':
                    case 'O':
                    case 'U':
                        article = "an";
                        break;
                    default:
                        article = "a";
                        break;
                }

                if (jo["duties"] != null && jo["duties"].ToString() != "")
                {
                    ViewBag.DutiesTitle = "Typical duties of " + article + " " + p.Profession;
                    ViewBag.DutiesText = TrimLineBreaks(jo["duties"].ToString());
                }
                if (jo["wheretofind"] != null && jo["wheretofind"].ToString() != "")
                {
                    ViewBag.WhereToFindTitle = "Where " + p.Profession + " jobs are found";
                    ViewBag.WhereToFindText = TrimLineBreaks(jo["wheretofind"].ToString());
                }
                if (jo["salary"] != null && jo["salary"].ToString() != "")
                {
                    ViewBag.SalaryTitle = "Salary of " + article + " " + p.Profession;
                    ViewBag.SalaryText = TrimLineBreaks(jo["salary"].ToString());
                }
                if (jo["demand"] != null && jo["demand"].ToString() != "")
                {
                    ViewBag.DemandTitle = "Demand";
                    ViewBag.DemandText = TrimLineBreaks(jo["demand"].ToString());
                }
            }

            ViewBag.BranchUrlParam = p.Branch.FormatProfessionNameAsUrlParam();
            ViewBag.BranchName = p.Branch;

            return View();
        }


        private string TrimLineBreaks(string text)
        {
            text = text.Trim();
            while (text.StartsWith("<br/>"))
            {
                text = text.Substring(5, text.Length - 5).Trim();
            }
            while (text.EndsWith("<br/>"))
            {
                text = text.Substring(0, text.Length - 5).Trim();
            }
            return text;
        }



    }
}
