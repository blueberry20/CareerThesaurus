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

using SkillCow.Classes.Cloud.TableStorage.ClientLogoOverrides;

namespace SkillCow.Controllers
{
    public class ClientLogoOverridesController : ControllerBase
    {
        public ActionResult Index()
        {
            ClientLogoOverrideClient dscc = new ClientLogoOverrideClient();
            return View(dscc.GetAll());
        }

        
        public ActionResult Create()
        {
            return View();
        } 

        [HttpPost]
        public ActionResult Create(ClientLogoOverride newitem)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    ClientLogoOverrideClient dscc = new ClientLogoOverrideClient();

                    try
                    {
                        dscc.AddNewItem(newitem);
                        return RedirectToAction("Index");
                    }
                    catch
                    {
                        ModelState.AddModelError("error", "Error creating new logo override");
                    }
                }

                return View(newitem);
            }
            catch
            {
                return View();
            }
        }
                
        public ActionResult Edit(string id)
        {
            ClientLogoOverrideClient dscc = new ClientLogoOverrideClient();

            return View(dscc.GetByRowKey(id));
        }

        
        [HttpPost]
        public ActionResult Edit(string id, ClientLogoOverride item)
        {
            try
            {
                ClientLogoOverrideClient dscc = new ClientLogoOverrideClient();
                dscc.Update(item);
                                
                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        public ActionResult Delete(string id)
        {
            ClientLogoOverrideClient dscc = new ClientLogoOverrideClient();

            return View(dscc.GetByRowKey(id));
        }

        //
        // POST: /DirectSchoolClients/Delete/5

        [HttpPost]
        public ActionResult Delete(string id, FormCollection collection)
        {
            try
            {
                ClientLogoOverrideClient dscc = new ClientLogoOverrideClient();

                ClientLogoOverride item = dscc.GetByRowKey(id);

                PictureManager.Instance.DeletePicture(item.ClientId, "logooverrides", item.ClientType);

                dscc.Delete(item);

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

                        PictureManager.Instance.UploadRawImage(converted, clientid, "logooverrides", clienttype);
                    }
                    else
                    {
                        PictureManager.Instance.UploadRawImage(img, clientid, "logooverrides", clienttype);
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

                    PictureManager.Instance.UploadRawImage(img2, clientid, "logooverrides", clienttype);
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
