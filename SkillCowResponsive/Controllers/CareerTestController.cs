﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using SkillCowResponsive.Classes.Cloud.TableStorage.StudentAccount;
using SkillCowResponsive.Classes.Cloud.TableStorage.AssessmentDimension;

//using SkillCowResponsive.Classes.Cloud.TableStorage.AssessmentDimensionsRating;
//using SkillCowResponsive.Classes.Cloud.TableStorage.StudentProfile;

namespace SkillCowResponsive.Controllers
{
    public class CareerTestController : AuthenticatedControllerController
    {
        public string[] dimensions = { "attitude", "endurance", "action", "concentration", "information", "processing", "presence", "patterns", "compensation" };
        //
        // GET: /SkillTest/

        public ActionResult Index(string id)
        {
            string strUserAgent = Request.UserAgent.ToString().ToLower();
            bool isIpad = false;
            bool isDeviceMobile = false;
            if (strUserAgent.Contains("ipad"))
            {
                if (strUserAgent.Contains("version/5"))
                {
                    ViewBag.IsiPad = false;
                }
                else
                {
                    ViewBag.IsiPad = true;
                    isIpad = true;
                }
            }
            else
            {
                ViewBag.IsiPad = false;
            }
            if (Request.Browser.IsMobileDevice == true || strUserAgent.Contains("iphone") ||
                strUserAgent.Contains("blackberry") || strUserAgent.Contains("mobile") ||
                strUserAgent.Contains("windows ce") || strUserAgent.Contains("opera mini") ||
                strUserAgent.Contains("palm") || strUserAgent.Contains("android"))
            {
                ViewBag.IsMobileDevice = true;
                isDeviceMobile = true;
            }
            else
            {
                ViewBag.IsMobileDevice = false;
            }
            if (id != null)
            {
                if (Request.Cookies["gender"] == null)
                {
                    return RedirectToAction("Index", "Home");
                }
                ViewBag.id = Convert.ToInt16(id);
                ViewBag.gender = Request.Cookies["gender"].Value;
                return View(ViewBag.id);
            }
            //if ((Request.Cookies["firstname"] == null) || (Request.Cookies["lastname"] == null) || (Request.Cookies["email"] == null) || (Request.Cookies["gender"] == null))
            if (Request.Cookies["gender"] == null && (!isDeviceMobile || isIpad))
            {
                ViewBag.skilltestModal = true;
                return View();
            }
            else if (Request.Cookies["gender"] == null)
            {
                Response.Cookies["gender"].Value = "male";
            }
            for (var i = 0; i < 9; i++)
            {
                if (Request.Cookies[dimensions[i]] == null)
                {
                    ViewBag.id = i + 1;
                    ViewBag.gender = Request.Cookies["gender"].Value;// != null ? Request.Cookies["gender"].Value : "male" ;                  
                    return View(ViewBag.id);
                }
            }
            ViewBag.id = 1;
            ViewBag.gender = Request.Cookies["gender"].Value;
            return View(ViewBag.id);
        }
        public ActionResult TakeTest(string id)
        {
            Response.Cookies["locked"].Value = "1";
            Response.Cookies["locked"].Expires = DateTime.UtcNow.AddDays(1);
            string strUserAgent = Request.UserAgent.ToString().ToLower();
            bool isIpad = false;
            bool isDeviceMobile = false;
            if (strUserAgent.Contains("ipad"))
            {
                if (strUserAgent.Contains("version/5"))
                {
                    ViewBag.IsiPad = false;
                }
                else
                {
                    ViewBag.IsiPad = true;
                    isIpad = true;
                }
            }
            else
            {
                ViewBag.IsiPad = false;
            }
            if (Request.Browser.IsMobileDevice == true || strUserAgent.Contains("iphone") ||
                strUserAgent.Contains("blackberry") || strUserAgent.Contains("mobile") ||
                strUserAgent.Contains("windows ce") || strUserAgent.Contains("opera mini") ||
                strUserAgent.Contains("palm") || strUserAgent.Contains("android"))
            {
                ViewBag.IsMobileDevice = true;
                isDeviceMobile = true;
            }
            else
            {
                ViewBag.IsMobileDevice = false;
            }
            if (id != null)
            {
                if (Request.Cookies["gender"] == null)
                {
                    return RedirectToAction("Index", "Home");
                }
                ViewBag.id = Convert.ToInt16(id);
                ViewBag.gender = Request.Cookies["gender"].Value;
                return View(ViewBag.id);
            }
            //if ((Request.Cookies["firstname"] == null) || (Request.Cookies["lastname"] == null) || (Request.Cookies["email"] == null) || (Request.Cookies["gender"] == null))
            if (Request.Cookies["gender"] == null) // && (!isDeviceMobile || isIpad))
            {
                ViewBag.skilltestModal = true;
                return View();
            }
            else if (Request.Cookies["gender"] == null)
            {
                //Response.Cookies["gender"].Value = "male";
            }
            for (var i = 0; i < 9; i++)
            {
                if (Request.Cookies[dimensions[i]] == null)
                {
                    ViewBag.id = i + 1;
                    ViewBag.gender = Request.Cookies["gender"].Value;// != null ? Request.Cookies["gender"].Value : "male" ;                  
                    return View(ViewBag.id);
                }
            }
            ViewBag.id = 1;
            ViewBag.gender = Request.Cookies["gender"].Value;
            return View(ViewBag.id);
        }
        public ActionResult Results()
        {
            return View();
        }
        public ActionResult EmailResults()
        {
            return View();
        }
        [HttpPost]
        public HttpResponse verifyemail(string email)
        {
            try
            {
                string results = GetHttpResponse("http://www.xverify.com/services/emails/verify/?email=" + email + "&type=json&apikey=1000905-158C766B&domain=careerthesaurus.com", null);
                Response.ContentType = "application/json";
                Response.Write("{\"result\": \"ok\", \"results\": " + results.Replace("\n", "") + " }");
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
        [HttpPost]
        public void SaveDimension(string user, string dimension, string value, string misc)
        {
            StudentAccountClient sac = new StudentAccountClient();
            StudentAccount student = sac.GetByPartitionAndRowKey(StudentAccountClient.GetPartitionKeyForEmail(user), user);
            if (student != null)
            {
                AssessmentDimensionClient adc = new AssessmentDimensionClient();
                AssessmentDimension dimensionRating = adc.GetByPartitionAndRowKey(student.School, user + student.Year + student.Grade + dimension);
                if (dimensionRating == null)
                {
                    student.RatedDimensions++;
                    sac.Update(student);
                    adc.AddNewItem(new AssessmentDimension { PartitionKey = student.School, RowKey = user + student.Year + student.Grade + dimension, Value = value, Misc = misc, Counselor = student.Counselor, Student = user, Grade = student.Grade, GroupName = student.GroupName, Dimension = dimension, Year = student.Year });
                    //adrc.AddNewItem(new AssessmentDimensionsRating { PartitionKey = student.School, RowKey = user + dimension, Dimension = dimension, Value = value, Misc = misc, GradYear = student.GradYear, Student = student.RowKey, Teacher = student.Teacher, Group = student.Group });
                }
                else
                {
                    dimensionRating.Value = value;
                    dimensionRating.Misc = misc;
                    adc.Update(dimensionRating);
                }
            }

            //StudentProfileClient spc = new StudentProfileClient();
            //StudentProfile student = spc.GetByPartitionAndRowKey(StudentProfileClient.GetPartitionKeyForEmail(user), user);
            //AssessmentDimensionsRatingClient adrc = new AssessmentDimensionsRatingClient();
            //AssessmentDimensionsRating dimensionRating = adrc.GetByPartitionAndRowKey(student.School, user + dimension);
        }

    }
}
