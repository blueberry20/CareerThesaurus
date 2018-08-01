using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using SkillCow.Classes.Cloud.TableStorage;
using SkillCow.Classes.Helpers;

namespace SkillCow.Controllers
{
    public class UnsubscribeController : ControllerBase
    {
        //
        // GET: /Unsubscribe/

        public ActionResult Index(string email)
        {
            ViewBag.Email = email;
            return View();
        }
        
        [HttpPost]
        public ActionResult Index(FormCollection collection)
        {
            string email = collection["email"];

            if (email != null)
            {
                AddresseeClient adc = new AddresseeClient();
                string partitionkey = AddresseeClient.GetPartitionKeyForEmail(email);

                //Addressee ad = adc.GetByRowKey(email.ToLower());
                Addressee ad = adc.GetByPartitionAndRowKey(partitionkey, email.ToLower());
                if (ad != null)
                {
                    ad.Unsubscribed = true;
                    ad.UnsubscribedUTCDate = EasternTimeConverter.Convert(DateTime.UtcNow);
                    adc.Update(ad);
                }

                UserProfileClient upc = new UserProfileClient();
                UserProfile p = upc.GetByPartitionAndRowKey(partitionkey, email.ToLower());
                if (p != null)
                {
                    p.Unsubscribed = true;
                    upc.Update(p);
                }

            }
            else
            {
                email = "";
            }
            

            return RedirectToAction("Unsubscribed", new { email = email });
        }

        public ActionResult Unsubscribed(string email)
        {
            ViewBag.Email = email;
            return View();
        }

        public ActionResult WhoDid()
        {
            

            return View();
        }
    }
}
