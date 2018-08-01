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
using SkillCow.Classes;

namespace SkillCow.Controllers
{
    public class TENFormController : ControllerBase
    {
        [HttpGet]
        public ActionResult GetFormJson(string clientid, string formid)
        {
            try
            {
                Response.ContentType = "application/json";

                //string datestamp = EasternTimeConverter.Convert(DateTime.UtcNow).ToString("yyyyMMdd");
                //string cached = BlobJsonResourceManager.Instance.GetJsonResource("skillcowschoolforms", datestamp, "form" + formid);
                //if (cached != null && cached.Trim() != "")
                //{
                //    Response.Write(cached);
                //    Response.End();
                //    return null;
                //}

                SchoolFormParserV2 parser = new SchoolFormParserV2();
                string json = parser.ConvertFormsXmlToJson(clientid, formid);
                //json = json.Replace("reflection.code", json.ToJSONSafeString());

                //BlobJsonResourceManager.Instance.SaveJsonResource(json, "form" + formid, "skillcowschoolforms", datestamp);

                Response.Write(json);
                Response.End();
            }
            catch (Exception ex)
            {
                Response.ContentType = "application/json";
                Response.Write(DefaultErrorResponse(ex.Message));
                Response.End();
            }

            return null;
        }

    }

    
}
