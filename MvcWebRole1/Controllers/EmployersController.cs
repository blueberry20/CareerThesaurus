using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using SkillCow.Classes.Cloud.TableStorage.DirectClients.Schools;
using SkillCow.Classes.Encryption;
using System.Globalization;
using SkillCow.Classes.Cloud.TableStorage.DirectClients.Employers;

namespace SkillCow.Controllers
{
    public class EmployersController : AuthenticatedControllerController
    {
        public ActionResult Index(string passworderror)
        {
            if (!IsValidUser(tokens => tokens[1] == Request["username"].ToString()))
            {
                return RedirectToAction("Logon");
            }
                        
            ViewBag.StartDate = DateTime.Now;
            ViewBag.EndDate = DateTime.Now;

            ViewBag.ClientId = AuthTokens[2];
            ViewBag.ClientRowKey = AuthTokens[3];

            ViewBag.PasswordError = passworderror;

            return View();
        }
        [HttpPost]
        public ActionResult Index(FormCollection collection)
        {
            if (!IsValidUser(tokens => tokens[1] == Request["username"].ToString()))
            {
                return RedirectToAction("Logon");
            }
            

            ViewBag.StartDate = DateTime.ParseExact(collection["startdate"], "yyyyMMdd", CultureInfo.InvariantCulture);
            ViewBag.EndDate = DateTime.ParseExact(collection["enddate"], "yyyyMMdd", CultureInfo.InvariantCulture);

            ViewBag.ClientId = AuthTokens[2];
            ViewBag.ClientRowKey = AuthTokens[3];
            ViewBag.Username = AuthTokens[1];
            
            return View();
        }

        public ActionResult Logoff()
        {
            Response.Cookies["sessionkey"].Value = "";
            Response.Cookies["username"].Value = "";

            return RedirectToAction("Index");
        }

        public ActionResult Logon()
        {
            return View();
        }
        [HttpPost]
        public ActionResult Logon(FormCollection collection)
        {
            DirectEmployerClientClient cc = new DirectEmployerClientClient();

            DirectEmployerClient client = cc.Logon(collection["username"], collection["password"]);

            if (client == null)
            {
                ViewBag.ErrorMessage = "Invalid Username or Password";
                return View();
            }

            string sessionkey = ClientSession.GetClientSessionKey("employer", collection["username"], client.ClientId, client.RowKey);

            Response.Cookies["sessionkey"].Value = sessionkey;
            //Response.Cookies["sessionkey"].Expires = DateTime.UtcNow.AddMinutes(20);

            Response.Cookies["username"].Value = collection["username"];
            //Response.Cookies["username"].Expires = DateTime.UtcNow.AddMinutes(20);
            

            return RedirectToAction("Index");
        }
        
        [HttpPost]
        public ActionResult ChangePassword(FormCollection collection)
        {
            if (!IsValidUser(tokens => tokens[1] == Request["username"].ToString()))
            {
                return RedirectToAction("Logon");
            }

            DirectEmployerClientClient cc = new DirectEmployerClientClient();
            DirectEmployerClient client = cc.GetByRowKey(AuthTokens[3]);

            if (client == null)
            {
                return RedirectToAction("Logon");
            }

            if (collection["newpassword"].Trim() == collection["confirmpassword"].Trim())
            {
                client.Password = collection["newpassword"].Trim();
                cc.Update(client);
                return RedirectToAction("Index");
            }
            else
            {
                return RedirectToAction("Index", new { PasswordError = "Password does not match confirmation"});
            }
        }

        
        public ActionResult ExportToExcel(string startdate, string enddate)
        {
            if (!IsValidUser(tokens => tokens[1] == Request["username"].ToString()))
            {
                return RedirectToAction("Logon");
            }
            

            ViewBag.StartDate = DateTime.ParseExact(startdate, "yyyyMMdd", CultureInfo.InvariantCulture);
            ViewBag.EndDate = DateTime.ParseExact(enddate, "yyyyMMdd", CultureInfo.InvariantCulture);

            ViewBag.ClientId = AuthTokens[2];
            ViewBag.ClientRowKey = AuthTokens[3];

            Response.ContentType = "application/vnd.ms-excel";
            Response.AppendHeader("content-disposition", "attachment; filename=Skillcow_Leads_" + startdate + "_to_" + enddate + ".csv");
            Response.AddHeader("Cache-Control", "must-revalidate");
            Response.AddHeader("Pragma", "must-revalidate");

            return View();
        }
    }
}
