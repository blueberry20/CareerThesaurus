using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using SkillCow.Classes.Helpers;
using SkillCow.Classes.Cloud.TableStorage.Thesaurus;
using Microsoft.WindowsAzure.StorageClient;
using SkillCow.Classes.Cloud.TableStorage;
using SkillCow.Classes;
namespace SkillCow.Controllers
{
    public class ThesaurusController : SimpleAuthenticatedControllerController
    {
        //
        // GET: /Thesaurus/
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
            AgentClient ac = new AgentClient();
            Agent a = ac.GetAll().Execute().Where(x => x.LoginName == collection["username"]).SingleOrDefault();

            if (a == null)
            {
                throw new Exception("Invalid agent ID or code");
            }

            if (a.Password == collection["password"])
            {
                string sessionkey = ConstructSessionKey(collection["username"], collection["password"], a.Firstname, a.Lastname);
                Response.Cookies["sessionkey"].Value = sessionkey;
                Response.Cookies["username"].Value = collection["username"];
                Response.Cookies["userfirstname"].Value = a.Firstname;
                Response.Cookies["userlastname"].Value = a.Lastname;
            }
            else
            {
                throw new Exception("Invalid agent ID or code");
            }

            return RedirectToAction("Index");
        }

        public ActionResult Index(string p, string highlight)
        {

            if (!IsValidUser(tokens => tokens[0] == Request["username"].ToString()))
            {
                return RedirectToAction("Logon");
            }

            ViewBag.UserFirstName = AuthTokens[2];

            ViewBag.Profession = p;
            ViewBag.Highlight = highlight;
            return View();
        }

        [HttpPost]
        public ActionResult GetEntries()
        {
            try
            {
                if (!IsValidUser(tokens => tokens[0] == Request["username"].ToString()))
                {
                    return null;
                }

                List<object> entries = new List<object>();

                ThesaurusEntryClient c = new ThesaurusEntryClient();
                foreach(ThesaurusEntry entry in c.GetAllByDictionary("similars").Execute())
                {
                    entries.Add(new { rowkey = entry.RowKey, dictionary=entry.PartitionKey, action = entry.AddRemove, from = entry.From, to = entry.To });
                }
                foreach (ThesaurusEntry entry in c.GetAllByDictionary("progressions").Execute())
                {
                    entries.Add(new { rowkey = entry.RowKey, dictionary = entry.PartitionKey, action = entry.AddRemove, from = entry.From, to = entry.To });
                }
                foreach (ThesaurusEntry entry in c.GetAllByDictionary("aka").Execute())
                {
                    entries.Add(new { rowkey = entry.RowKey, dictionary = entry.PartitionKey, action = entry.AddRemove, from = entry.From, to = entry.To });
                }

                Response.ContentType = "application/json";
                string retvalue = (new { result = "ok", entries = entries.ToArray() }).ToJSON();
                Response.Write(retvalue);
                Response.End();
            }
            catch (Exception ex)
            {
                Response.ContentType = "application/json";
                Response.Write("{\"result\":\"error\", \"message\":\""+ex.Message+"\"}");
                Response.End();
            }

            return null;
        }
        [HttpPost]
        public ActionResult GetApprovals()
        {
            try
            {
                if (!IsValidUser(tokens => tokens[0] == Request["username"].ToString()))
                {
                    return null;
                }

                List<object> entries = new List<object>();

                ThesaurusEntryClient c = new ThesaurusEntryClient();
                foreach (ThesaurusEntry entry in c.GetAllByDictionary("approvals").Execute())
                {
                    entries.Add(new { rowkey = entry.RowKey, dictionary = entry.PartitionKey, title = entry.From });
                }
                
                Response.ContentType = "application/json";
                string retvalue = (new { result = "ok", entries = entries.ToArray() }).ToJSON();
                Response.Write(retvalue);
                Response.End();
            }
            catch (Exception ex)
            {
                Response.ContentType = "application/json";
                Response.Write("{\"result\":\"error\", \"message\":\"" + ex.Message + "\"}");
                Response.End();
            }

            return null;
        }

        [HttpPost]
        public ActionResult DeleteEntry(string d, string rowkey)
        {
            try
            {
                if (!IsValidUser(tokens => tokens[0] == Request["username"].ToString()))
                {
                    return null;
                }

                ThesaurusEntryClient c = new ThesaurusEntryClient();
                ThesaurusEntry entry = c.GetByPartitionAndRowKey(d, rowkey);
                if (entry != null)
                {
                    c.Delete(entry);
                    NotifyApprovedItem(entry.From, AuthTokens[2] + " deleted \"" + entry.AddRemove + "\" relationship in " + d + " between \"" + entry.From + "\" and \"" + entry.To + "\"");

                    //get reverse entry
                    ThesaurusEntry reverseentry = c.GetAllByDictionary("similars").Execute().SingleOrDefault(x => x.From == entry.To && x.To == entry.From);
                    if (reverseentry != null)
                    {
                        c.Delete(reverseentry);
                        NotifyApprovedItem(entry.To, AuthTokens[2] + " deleted \"" + entry.AddRemove + "\" relationship in " + d + " between \"" + entry.To + "\" and \"" + entry.From + "\"");
                    }
                 
   

                }

                Response.ContentType = "application/json";
                string retvalue = (new { result = "ok" }).ToJSON();
                Response.Write(retvalue);
                Response.End();
            }
            catch (Exception ex)
            {
                Response.ContentType = "application/json";
                Response.Write("{\"result\":\"error\", \"message\":\"" + ex.Message + "\"}");
                Response.End();
            }

            return null;
        }

        [HttpPost]
        public ActionResult AddEntry(string d, string t, string from, string to)
        {
            try
            {
                if (!IsValidUser(tokens => tokens[0] == Request["username"].ToString()))
                {
                    return null;
                }

                ThesaurusEntryClient c = new ThesaurusEntryClient();
                c.AddNewItem(new ThesaurusEntry { PartitionKey  = d, AddRemove = t, From = from, To = to, RowKey = ShortGuidGenerator.NewGuid()});
                NotifyApprovedItem(from, AuthTokens[2] + " added \"" + t + "\" relationship in " + d + " between \"" + from + "\" and \"" + to + "\"");

                if (d == "similars")
                {
                    var reverseitem = new ThesaurusEntry { PartitionKey = d, AddRemove = t, From = to, To = from, RowKey = ShortGuidGenerator.NewGuid() };
                    c.AddNewItem(reverseitem);
                    NotifyApprovedItem(to, AuthTokens[2] + " added \"" + t + "\" relationship in " + d + " between \"" + to + "\" and \"" + from + "\"");
                }

                Response.ContentType = "application/json";
                string retvalue = (new { result = "ok" }).ToJSON();
                Response.Write(retvalue);
                Response.End();
            }
            catch (Exception ex)
            {
                Response.ContentType = "application/json";
                Response.Write("{\"result\":\"error\", \"message\":\"" + ex.Message + "\"}");
                Response.End();
            }

            return null;
        }

        public ActionResult Similars()
        {
            if (!IsValidUser(tokens => tokens[0] == Request["username"].ToString()))
            {
                return RedirectToAction("Logon");
            }

            ThesaurusEntryClient c = new ThesaurusEntryClient();
            return View(c.GetAllByDictionary("similars").Execute());
        }
        public ActionResult Progressions()
        {
            if (!IsValidUser(tokens => tokens[0] == Request["username"].ToString()))
            {
                return RedirectToAction("Logon");
            }

            ThesaurusEntryClient c = new ThesaurusEntryClient();
            return View(c.GetAllByDictionary("progressions").Execute());
        }

        public ActionResult CreateEntry(string dictionary, string addremove, string from, string to)
        {
            if (!IsValidUser(tokens => tokens[0] == Request["username"].ToString()))
            {
                return RedirectToAction("Logon");
            }

            return View(new ThesaurusEntry { PartitionKey = dictionary, AddRemove = addremove, From = from.Replace("^", "'"), To = to.Replace("^", "'"), RowKey = ShortGuidGenerator.NewGuid() });
        }

        //
        // POST: /DirectSchoolClients/Create

        [HttpPost]
        public ActionResult CreateEntry(ThesaurusEntry newitem)
        {
            try
            {
                if (!IsValidUser(tokens => tokens[0] == Request["username"].ToString()))
                {
                    return RedirectToAction("Logon");
                }

                newitem.Timestamp = DateTime.Now;
                if (ModelState.IsValid)
                {
                    ThesaurusEntryClient c = new ThesaurusEntryClient();
                    c.AddNewItem(newitem);
                    NotifyApprovedItem(newitem.From, AuthTokens[2] + " added \"" + newitem.AddRemove + "\" relationship in " + newitem.PartitionKey + " between \"" + newitem.From + "\" and \"" + newitem.To + "\"");

                    if (newitem.PartitionKey == "similars")
                    {
                        var reverseitem = new ThesaurusEntry { AddedAs="similar", PartitionKey = newitem.PartitionKey, AddRemove = newitem.AddRemove, From = newitem.To, To = newitem.From, RowKey = ShortGuidGenerator.NewGuid() };
                        c.AddNewItem(reverseitem);
                        NotifyApprovedItem(newitem.To, AuthTokens[2] + " added \"" + newitem.AddRemove + "\" relationship in " + newitem.PartitionKey + " between \"" + newitem.To + "\" and \"" + newitem.From + "\"");
                    }
                }


                if (newitem.AddedAs == "predecessor")
                {
                    return RedirectToAction("Index", new { p = newitem.To });
                }
                else
                {
                    return RedirectToAction("Index", new { p = newitem.From });
                }
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("error", ex.Message);
                return View(newitem);
            }
        }

        protected void NotifyApprovedItem(string title, string whathappened)
        {

            ThesaurusEntryClient c = new ThesaurusEntryClient();
            ThesaurusEntry entry = c.GetAllByDictionary("approvals").Execute().SingleOrDefault(x => x.From == title);
            if (entry == null)
            {
                return;
            }

            EmailManager em = new EmailManager();
            em.SendMail("no-reply@skillcow.com", "Career|Thesaurus", "mike@skillcow.com", "Mapping Change Alert", whathappened);
        }

        public ActionResult Merge()
        {
            if (!IsValidUser(tokens => tokens[0] == Request["username"].ToString()))
            {
                return RedirectToAction("Logon");
            }

            ViewBag.UserFirstName = AuthTokens[2];

            return View();
        }

        public ActionResult PurgeManualEntries()
        {
            if (!IsValidUser(tokens => tokens[0] == Request["username"].ToString()))
            {
                return RedirectToAction("Logon");
            }

            ViewBag.UserFirstName = AuthTokens[2];


            List<ThesaurusEntry> entries = new List<ThesaurusEntry>();

            ThesaurusEntryClient c = new ThesaurusEntryClient();
            entries.AddRange(c.GetAllByDictionary("similars").Execute());
            entries.AddRange(c.GetAllByDictionary("progressions").Execute());

            int cnt = 0;
            foreach (ThesaurusEntry entry in entries)
            {
                c.Delete(entry);
                cnt++;
            }

            return View();
        }
    }
}
