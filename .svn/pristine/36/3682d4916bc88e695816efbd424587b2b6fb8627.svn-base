using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using SkillCow.Classes.Cloud.TableStorage.PersonalityTests.CBNProfessions;

namespace SkillCow.Controllers
{
    public class OldProfessionsController : ControllerBase
    {
        //
        // GET: /OldProfessions/

        public ActionResult Index()
        {
            CBNProfessionClient client = new CBNProfessionClient();

            return View(client.GetAll());
        }

        //
        // GET: /OldProfessions/Details/5

        public ActionResult Details(int id)
        {
            return View();
        }

        //
        // GET: /OldProfessions/Create

        public ActionResult Create()
        {
            return View();
        } 

        //
        // POST: /OldProfessions/Create

        [HttpPost]
        public ActionResult Create(FormCollection collection)
        {
            try
            {
                // TODO: Add insert logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }
        
        //
        // GET: /OldProfessions/Edit/5
 
        public ActionResult Edit(int id)
        {
            return View();
        }

        //
        // POST: /OldProfessions/Edit/5

        [HttpPost]
        public ActionResult Edit(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add update logic here
 
                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        //
        // GET: /OldProfessions/Delete/5
 
        public ActionResult Delete(int id)
        {
            return View();
        }

        //
        // POST: /OldProfessions/Delete/5

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
    }
}
