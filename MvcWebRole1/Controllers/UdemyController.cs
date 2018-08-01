using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using SkillCow.Classes.Cloud.BlobStorage;
using SkillCow.Classes;
using SkillCow.Classes.Helpers;

namespace SkillCow.Controllers
{
    public class UdemyController : ControllerBase
    {
        //
        // GET: /Udemy/

        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public ActionResult GetCourseDetails(string id, string url)
        {
            try
            {
                Response.ContentType = "application/json";

                string datestamp = EasternTimeConverter.Convert(DateTime.UtcNow).ToString("yyyyMMdd");
                //string cached = BlobJsonResourceManager.Instance.GetJsonResource("skillcowschoolforms", datestamp, id);
                //if (cached != null && cached.Trim() != "")
                //{
                //    Response.Write(cached);
                //    Response.End();
                //    return null;
                //}

                UdemyCourseParser parser = new UdemyCourseParser();
                string json = parser.ParsePage(url);
                BlobJsonResourceManager.Instance.SaveJsonResource(json, id, "skillcowudemycourses", datestamp);

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
