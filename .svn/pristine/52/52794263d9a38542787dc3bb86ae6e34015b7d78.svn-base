using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;


using System.Web.Helpers;
using System.Drawing;
using System.IO;
using System.Drawing.Imaging;
using SkillCow.Classes.Cloud.BlobStorage;

using SkillCow.Classes.Cloud.TableStorage.DirectClients.Employers;
using SkillCow.Classes.Cloud.TableStorage.DirectClients.Employers.GeoIndex;
using SkillCow.Classes.Cloud.TableStorage.DirectClients.LeadCaps;
using SkillCow.Classes.Cloud.TableStorage.DirectClients.LeadCounters;

namespace SkillCow.Controllers
{
    public class DirectEmployerClientsController : ControllerBase
    {
        //
        // GET: /DirectSchoolClients/

        public ActionResult Index(string sort)
        {
            DirectEmployerClientClient dscc = new DirectEmployerClientClient();
            IEnumerable<DirectEmployerClient> results = dscc.GetAll();

            if(sort!=null)
            {
                switch(sort)
                {
                    case "Name":
                        results = results.OrderBy(x => x.Name);
                        break;
                    case "Status":
                        results = results.OrderBy(x => x.Status);
                        break;
                    case "Category":
                        results = results.OrderBy(x => x.Category);
                        break;
                    default:
                        break;
                }
            }
            
            return View(results);
        }
        public ActionResult Dashboard()
        {
            DirectEmployerClientClient dscc = new DirectEmployerClientClient();
            return View(dscc.GetAll());
        }
        //
        // GET: /DirectSchoolClients/Create

        public ActionResult Create()
        {
            return View();
        } 

        //
        // POST: /DirectSchoolClients/Create

        [HttpPost]
        public ActionResult Create(DirectEmployerClient newitem)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    
                    if (newitem.Name == null || newitem.Name == "")
                    {
                        throw new Exception("Client name missing");
                    }
                    if (newitem.ClientId == null) 
                    {
                        throw new Exception("ClientId missing");
                    }

                    string clientid = newitem.ClientId.ToUpper().Replace(" ", "");
                    if (clientid == "")
                    {
                        throw new Exception("ClientId cannot be empty");
                    }

                    newitem.ClientId = clientid;

                    DirectEmployerClientClient dscc = new DirectEmployerClientClient();

                    if (dscc.GetByName(newitem.Name) != null)
                    {
                        throw new Exception("A client with this name already exists");
                    }

                    if (dscc.GetByClientId(newitem.ClientId) != null)
                    {
                        throw new Exception("A client with this ClientId already exists");
                    }

                    try
                    {
                        dscc.AddNewItem(newitem);
                        return RedirectToAction("Index");
                    }
                    catch
                    {
                        ModelState.AddModelError("error", "Error creating new client");
                    }
                }

                return View(newitem);
            }
            catch(Exception ex)
            {
                ModelState.AddModelError("error", ex.Message);
                return View(newitem);
            }
        }
        
        //
        // GET: /DirectSchoolClients/Edit/5
 
        public ActionResult Edit(string id)
        {
            //Clean up all indexes
            /*
            GeoIndexNationalClient c1 = new GeoIndexNationalClient();
            c1.DeleteTable();
            GeoIndexAddStateClient c2 = new GeoIndexAddStateClient();
            c2.DeleteTable();
            GeoIndexAddZipClient c3 = new GeoIndexAddZipClient();
            c3.DeleteTable();
            GeoIndexSubtractStateClient c4 = new GeoIndexSubtractStateClient();
            c4.DeleteTable();
            GeoIndexSubtractZipClient c5 = new GeoIndexSubtractZipClient();
            c5.DeleteTable();
            */

            DirectEmployerClientClient dscc = new DirectEmployerClientClient();

            return View(dscc.GetByRowKey(id));
        }

        //
        // POST: /DirectSchoolClients/Edit/5

        [HttpPost]
        public ActionResult Edit(string id, DirectEmployerClient item)
        {
            try
            {
                DirectEmployerClientClient dscc = new DirectEmployerClientClient();
                if (item.Description == null)
                {
                    item.Description = "";
                }

                dscc.Update(item);

                //Save LeadCap
                LeadCapClient leadcapclient = new LeadCapClient();
                LeadCap leadcap = leadcapclient.GetByRowKey(item.RowKey);
                bool createnewcap = false;
                if (leadcap == null)
                {
                    leadcap = new LeadCap();
                    leadcap.RowKey = item.RowKey;
                    createnewcap = true;
                }
                leadcap.Total = item.TotalCap;
                leadcap.Annually = item.AnnualCap;
                leadcap.Monthly = item.MonthlyCap;
                leadcap.Weekly = item.WeeklyCap;
                leadcap.Daily = item.DailyCap;
                if (createnewcap)
                {
                    leadcapclient.AddNewItem(leadcap);
                }
                else
                {
                    leadcapclient.Update(leadcap);
                }

                //Create LeadCounter if doesn't exist
                LeadCounterClient leadcounterclient = new LeadCounterClient();
                LeadCounter leadcounter = leadcounterclient.GetByRowKey(item.RowKey);
                if (leadcounter == null)
                {
                    leadcounter = new LeadCounter();
                    leadcounter.RowKey = item.RowKey;
                    leadcounter.Total = 0;
                    leadcounter.Annually = 0;
                    leadcounter.Monthly = 0;
                    leadcounter.Weekly = 0;
                    leadcounter.Daily = 0;
                    leadcounterclient.AddNewItem(leadcounter);
                }

                return RedirectToAction("Edit", new { id=item.RowKey});
            }
            catch
            {
                return View();
            }
        }

        
        public ActionResult ExcludeZipCodesByState()
        {
            return View();
        }
        [HttpPost]
        public ActionResult ExcludeZipCodesByState(FormCollection collection)
        {
            ViewBag.Zips = collection["zips"];
            ViewBag.States= collection["states"];

            return View();
        }


        //
        // GET: /DirectSchoolClients/Delete/5
 
        public ActionResult Delete(int id)
        {
            return View();
        }

        //
        // POST: /DirectSchoolClients/Delete/5

        [HttpPost]
        public ActionResult Delete(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add delete logic here
 
                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        [HttpPost]
        public string UploadLogo(System.Web.HttpPostedFileBase Filedata, string clienttype, string clientid)
        {
            try
            {
                WebImage img = WebImage.GetImageFromRequest();

                if (img != null)
                {
                    if (img.ImageFormat == "Bitmap")
                    {
                        Image bmp = null;
                        Image converted = null;

                        using (MemoryStream stream = new MemoryStream())
                        using (MemoryStream ms = new MemoryStream())
                        {
                            ms.Write(img.GetBytes(), 0, img.GetBytes().Length);
                            Image.FromStream(ms).Save(stream, ImageFormat.Png);
                            converted = Image.FromStream(stream);
                        }

                        PictureManager.Instance.UploadRawImage(converted, clienttype + clientid, "resources", "employerlogos");
                    }
                    else
                    {
                        PictureManager.Instance.UploadRawImage(img, clienttype + clientid, "resources", "employerlogos");
                    }
                }
                else
                {
                    Image img2 = null;

                    if (String.IsNullOrEmpty(Request["qqfile"]))
                    {
                        //This works with IE
                        HttpPostedFileBase httpPostedFileBase = Request.Files[0] as HttpPostedFileBase;
                        img2 = Image.FromStream(httpPostedFileBase.InputStream);
                    }
                    else
                    {
                        img2 = Image.FromStream(Request.InputStream);
                    }

                    PictureManager.Instance.UploadRawImage(img2, clienttype + clientid, "resources", "employerlogos");
                }



                return "{\"success\":true}";
            }
            catch
            {
                return "{\"error\":\"error\"}";
            }
        }
    }
}
