using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using SkillCowResponsive.Classes.Cloud.TableStorage;
using SkillCowResponsive.Classes;
using SkillCowResponsive.Classes.Cloud.TableStorage.SchoolNewsletter;
using SkillCowResponsive.Classes.Email;

namespace SkillCowResponsive.Controllers
{
    public class AboutController : AuthenticatedControllerController
    {
        //
        // GET: /About/

        public ActionResult Index()
        {
            return View();
        }
        [HttpGet]
        public ActionResult Advertise()
        {
            return View();
        }
        [HttpPost]
        public ActionResult Advertise(string name, string email, string message)
        {
            EmailManager emailManager = new EmailManager();
            string body = "<p>Full name: " + name + "</p><p>Email: " + email + "</p><p>" + message + "</p>";
            emailManager.SendMail("no-reply@careerthesaurus.com", "Admin", "mike@peopli.com", "Advertising request", body);
            return RedirectToAction("MessageSubmitted", "About");
        }
        public ActionResult MessageSubmitted()
        {
            return View();
        }
        [HttpGet]
        public ActionResult Newsletter()
        {
            return View();
        }
        [HttpPost]
        public ActionResult Newsletter(string name, string email)
        {
            AddresseeClient adc = new AddresseeClient();
            string emailpartition = AddresseeClient.GetPartitionKeyForEmail(email);
            Addressee a = adc.GetByPartitionAndRowKey(emailpartition, email);
            if (a == null)
            {
                adc.AddNewItem(new Addressee(email.ToLower()) { Name = name, Email = email.ToLower() });
                EmailManager emailManager = new EmailManager();
                string str = "<p>Name: " + name + "</p><p>Email: " + email.ToLower() + "</p>";
                emailManager.SendMail("no-reply@careerthesaurus.com", "Admin", "mike@peopli.com", "Newsletter subscribed", str);
            }
            return RedirectToAction("Thankyou", "About");
        }
        [HttpGet]
        public ActionResult SchoolNewsletter()
        {
            return View();
        }
        [HttpPost]
        public ActionResult SchoolNewsletter(string name, string email, string organization, string phone)
        {
            AddresseeClient adc = new AddresseeClient();
            SchoolNewsletterClient snc = new SchoolNewsletterClient(); 
            string emailpartition = AddresseeClient.GetPartitionKeyForEmail(email);
            Addressee a = adc.GetByPartitionAndRowKey(emailpartition, email);
            if (a == null)
            {
                adc.AddNewItem(new Addressee(email.ToLower()) { Name = name, Email = email.ToLower() });
                EmailManager emailManager = new EmailManager();
                string str = "<p>Name: " + name + "</p><p>Email: " + email.ToLower() + "</p><p>Organization/School: " + organization + "</p><p>Phone:" + phone + "</p>";
                emailManager.SendMail("no-reply@careerthesaurus.com", "Admin", "mike@peopli.com", "School Newsletter subscribed", str);
            }
            SchoolNewsletter user = snc.GetByPartitionAndRowKey(emailpartition, email);
            if (user == null)
            {
                snc.AddNewItem(new SchoolNewsletter
                {
                    PartitionKey = emailpartition,
                    RowKey = email.ToLower(),
                    Name = name,
                    Email = email.ToLower(),
                    Organization = organization,
                    Phone = phone
                });
            }
            sendSignupEmail(name, email);
            return RedirectToAction("Thankyou", "About");
        }
        public ActionResult Thankyou()
        {            
            return View();
        }
        public ActionResult contactus()
        {
            return View();
        }
        public ActionResult Terms()
        {
            return View();
        }
        public ActionResult Privacy()
        {
            return View();
        }
        public ActionResult Methodology()
        {
            return View();
        }

        private void sendSignupEmail(string name, string email)
        {
           // SimpleAES aes = new SimpleAES();
            EmailManager emailManager = new EmailManager();
            EmailTemplateHelper eth = new EmailTemplateHelper();
          //  string token = aes.EncryptToBase64String(email);
          //  string url = "http://www.CareerThesaurus.com/Careers/CareerReport/" + token;
            string body = eth.GetTemplate("signupthankyou");
            body = body.Replace("{{name}}", name);
           // body = body.Replace("{{url}}", url);
            emailManager.SendMail("admin@careerthesaurus.com", "CareerThesaurus", email, "Thank you for signing up", body);
        }

    }
}
