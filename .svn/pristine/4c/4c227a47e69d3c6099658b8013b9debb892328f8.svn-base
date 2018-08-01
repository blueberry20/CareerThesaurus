using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using SkillCow.Classes.Helpers;
using System.IO;
using System.Net;

namespace SkillCow.Controllers
{
    public class RequestInfoController : ControllerBase
    {
        //
        // GET: /LearnMore/

        public ActionResult Index()
        {
            return View();
        }


        //Record submission
        [HttpPost]
        public ActionResult Index(FormCollection collection)
        {
            string url = "http://www.explore-schools.com/thankyou/affiliate_submission.php";

#if DEBUG
            string randomip = RandomHelper.Instance.Next(1, 256) + "." + RandomHelper.Instance.Next(0, 256) + "." + RandomHelper.Instance.Next(0, 256) + "." + RandomHelper.Instance.Next(1, 256);
#endif

            String result = "";
            String strPost = "campaign_id=" + collection["campaign_id"] +
                "&id=" + collection["id"] +
#if DEBUG

 "&ip=" + randomip +
#else
                "&ip=" + Request.UserHostAddress + 
#endif
 "&client=20" +
                "&firstname=" + collection["firstname"] +
                "&lastname=" + collection["lastname"] +
                "&email=" + collection["email"] +
                "&address1=" + collection["address1"] +
                "&city=" + collection["city"] +
                "&state=" + collection["state"] +
                "&zip=" + collection["zip"] +
                "&phone=" + collection["phone"] +
                "&gradyear=" + collection["gradyear"];


            StreamWriter myWriter = null;

            HttpWebRequest objRequest = (HttpWebRequest)WebRequest.Create(url);
            objRequest.Method = "POST";
            objRequest.ContentLength = strPost.Length;
            objRequest.ContentType = "application/x-www-form-urlencoded";

            try
            {
                myWriter = new StreamWriter(objRequest.GetRequestStream());
                myWriter.Write(strPost);
            }
            catch (Exception e)
            {
                string error = e.Message;
                return null;
            }
            finally
            {
                myWriter.Close();
            }

            HttpWebResponse objResponse = (HttpWebResponse)objRequest.GetResponse();
            using (StreamReader sr =
               new StreamReader(objResponse.GetResponseStream()))
            {
                result = sr.ReadToEnd();

                // Close and clean up the StreamReader
                sr.Close();
            }

            return View();
        }

        
    }
}
