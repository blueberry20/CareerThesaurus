using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using SkillCow.Classes.Cloud.TableStorage.DirectClients.Schools;

using System.Web.Helpers;
using System.Drawing;
using System.IO;
using System.Drawing.Imaging;
using SkillCow.Classes.Cloud.BlobStorage;
using SkillCow.Classes.Cloud.TableStorage.ClientSlideShows;

using SkillCow.Classes.Helpers;

namespace SkillCow.Controllers
{
    public class ClientSlideShowsController : ControllerBase
    {
        //
        // GET: /DirectSchoolClients/

        public ActionResult Index()
        {
            ClientSlideShowClient dscc = new ClientSlideShowClient();
            return View(dscc.GetAll());
        }

        //
        // GET: /DirectSchoolClients/Create

        public ActionResult Create(string clientid)
        {
            ViewBag.ClientId = clientid;
            return View();
        } 

        //
        // POST: /DirectSchoolClients/Create

        [HttpPost]
        public ActionResult Create(ClientSlideShow newitem)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    ClientSlideShowClient dscc = new ClientSlideShowClient();

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
            catch
            {
                return View();
            }
        }
        
        //
        // GET: /DirectSchoolClients/Edit/5
 
        public ActionResult Edit(string id)
        {
            ClientSlideShowClient dscc = new ClientSlideShowClient();

            return View(dscc.GetByRowKey(id));
        }

        //
        // POST: /DirectSchoolClients/Edit/5

        [HttpPost]
        public ActionResult Edit(string id, ClientSlideShow item)
        {
            try
            {
                ClientSlideShowClient dscc = new ClientSlideShowClient();
                dscc.Update(item);

                ExportJson(item.RowKey);
                
                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }


        //
        // GET: /DirectSchoolClients/Delete/5
 
        public ActionResult Delete(string id)
        {
            return View();
        }

        //
        // POST: /DirectSchoolClients/Delete/5

        [HttpPost]
        public ActionResult Delete(string id, FormCollection collection)
        {
            try
            {
                ClientSlideShowClient dscc = new ClientSlideShowClient();
                ClientSlideShow show = dscc.GetByRowKey(id);

                ClientSlideShowSlideClient slides = new ClientSlideShowSlideClient();
                foreach (ClientSlideShowSlide slide in slides.GetAllByPartition(show.RowKey))
                {
                    PictureManager.Instance.DeletePicture(slide.RowKey, "slideshows", show.RowKey);
                    slides.Delete(slide);
                }
                
                dscc.Delete(show);

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        [HttpPost]
        public string UpdateSlideCaption(string slideshowid, string slideid, string caption)
        {
            try
            {
                ClientSlideShowSlideClient dscc = new ClientSlideShowSlideClient();
                ClientSlideShowSlide slide = dscc.GetByPartitionAndRowKey(slideshowid, slideid);
                slide.Caption = caption;
                dscc.Update(slide);

                //Publish JSON to cloud
                ExportJson(slideshowid);

                return "{\"success\":true}";
            }
            catch
            {
                return "{\"error\":\"error\"}";
            }
        }

        [HttpPost]
        public string CreateSlide(System.Web.HttpPostedFileBase Filedata, string slideshowid)
        {
            try
            {
                ClientSlideShowSlideClient slides = new ClientSlideShowSlideClient();
                ClientSlideShowSlide slide = new ClientSlideShowSlide();
                slide.PartitionKey = slideshowid;
                
                slides.AddNewItem(slide);

                UploadSlideImage(Filedata, slide, slideshowid);

                return "{\"success\":true, \"id\" : \""+slide.RowKey+"\"}";
            }
            catch(Exception ex)
            {
                return "{\"error\":\"error\", \"message\":\""+ex.Message+"\"}";
            }
        }
        [HttpPost]
        public string UpdateSlideImage(System.Web.HttpPostedFileBase Filedata, string slideid, string slideshowid)
        {
            try
            {
                ClientSlideShowSlideClient slides = new ClientSlideShowSlideClient();
                ClientSlideShowSlide slide = slides.GetByPartitionAndRowKey(slideshowid, slideid);
                
                UploadSlideImage(Filedata, slide, slideshowid);

                return "{\"success\":true}";
            }
            catch
            {
                return "{\"error\":\"error\"}";
            }
        }

        private void UploadSlideImage(System.Web.HttpPostedFileBase Filedata, ClientSlideShowSlide slide, string slideshowid)
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

                    PictureManager.Instance.UploadRawImage(converted, slide.RowKey, "slideshows", slideshowid);
                }
                else
                {
                    PictureManager.Instance.UploadRawImage(img, slide.RowKey, "slideshows", slideshowid);
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

                PictureManager.Instance.UploadRawImage(img2, slide.RowKey, "slideshows", slideshowid);
            }
        }

        public ActionResult EditSlide(string id, string slideshowid)
        {
            ClientSlideShowSlideClient dscc = new ClientSlideShowSlideClient();

            return View(dscc.GetByPartitionAndRowKey(slideshowid, id));
        }

        //
        // POST: /DirectSchoolClients/Edit/5

        [HttpPost]
        public ActionResult EditSlide(string id, ClientSlideShowSlide item)
        {
            try
            {
                ClientSlideShowSlideClient dscc = new ClientSlideShowSlideClient();
                dscc.Update(item);

                ExportJson(item.PartitionKey);

                return RedirectToAction("Edit", new { id=item.PartitionKey});
            }
            catch
            {
                return View();
            }
        }

        public ActionResult DeleteSlide(string id, string slideshowid)
        {
            ClientSlideShowSlideClient dscc = new ClientSlideShowSlideClient();

            return View(dscc.GetByPartitionAndRowKey(slideshowid, id));
        }

        //
        // POST: /DirectSchoolClients/Edit/5

        [HttpPost]
        public ActionResult DeleteSlide(string id, ClientSlideShowSlide item)
        {
            try
            {
                ClientSlideShowSlideClient dscc = new ClientSlideShowSlideClient();
                dscc.Delete(item);

                ExportJson(item.PartitionKey);

                return RedirectToAction("Edit", new { id = item.PartitionKey });
            }
            catch
            {
                return View();
            }
        }

        private void ExportJson(string slideshowid)
        {
            ClientSlideShowClient slideshowclient = new ClientSlideShowClient();
            ClientSlideShow show = slideshowclient.GetByRowKey(slideshowid);

            ClientSlideShowSlideClient slides = new ClientSlideShowSlideClient();

            List<object> arrayofslides = new List<object>();
            foreach (ClientSlideShowSlide slide in slides.GetAllByPartition(slideshowid).OrderByDescending(x=>x.Priority))
            {
                arrayofslides.Add(new
                {
                    id = slide.RowKey,
                    caption = slide.Caption.ToJSONSafeString()
                });
            }

            string json = (new { id = slideshowid, slides = arrayofslides.ToArray() }).ToJSON();
            BlobJsonResourceManager.Instance.SaveJsonResource("slideshow", "clientslideshows", show.ClientType, show.ClientId.Replace(" ",""), json);
        }
    }
}
