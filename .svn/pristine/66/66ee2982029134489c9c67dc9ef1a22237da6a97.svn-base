using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using SkillCow.Classes.Cloud.TableStorage.DirectClients.Schools;

namespace SkillCow.Controllers
{
    public class DirectSchoolClientCampusesController : ControllerBase
    {
        public ActionResult Create(string schoolid)
        {
            DirectSchoolClientClient dscc = new DirectSchoolClientClient();
            ViewBag.Client = dscc.GetByRowKey(schoolid);

            return View();
        } 

        [HttpPost]
        public ActionResult Create(DirectSchoolClientCampus item)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    DirectSchoolClientCampusClient dscc = new DirectSchoolClientCampusClient();

                    try
                    {
                        dscc.AddNewItem(item);
                        return RedirectToAction("Edit", "DirectSchoolClients", new { id = item.ClientRowKey });
                    }
                    catch
                    {
                        ModelState.AddModelError("error", "Error creating new campus");
                    }
                }

                return View(item);
            }
            catch
            {
                return View();
            }
        }
 
        public ActionResult Edit(string id)
        {
            DirectSchoolClientCampusClient campusclient = new DirectSchoolClientCampusClient();
            DirectSchoolClientCampus campus = campusclient.GetByRowKey(id);

            DirectSchoolClientClient dscc = new DirectSchoolClientClient();
            ViewBag.Client = dscc.GetByRowKey(campus.ClientRowKey);

            return View(campus);
        }

        [HttpPost]
        public ActionResult Edit(string id, DirectSchoolClientCampus item)
        {
            try
            {
                DirectSchoolClientCampusClient dscc = new DirectSchoolClientCampusClient();
                dscc.Update(item);

                return RedirectToAction("Edit", "DirectSchoolClients", new { id = item.ClientRowKey });
            }
            catch
            {
                return View();
            }
        }

        public ActionResult Duplicate(string id)
        {
            DirectSchoolClientCampusClient campusclient = new DirectSchoolClientCampusClient();
            DirectSchoolClientCampus campus = campusclient.GetByRowKey(id);

            DirectSchoolClientCampusProgramClient campusprogramclient = new DirectSchoolClientCampusProgramClient();
            List<DirectSchoolClientCampusProgram> campusprograms = new List<DirectSchoolClientCampusProgram>(campusprogramclient.GetAllBySchoolId(campus.ClientRowKey).Where(x => x.CampusRowKey == id));
    
            //Create a copy of the campus
            DirectSchoolClientCampus campuscopy = new DirectSchoolClientCampus();
            campuscopy.Address = campus.Address;
            campuscopy.CampusType = campus.CampusType;
            campuscopy.City = campus.Address;
            campuscopy.ClientId = campus.ClientId;
            campuscopy.ClientRowKey = campus.ClientRowKey;
            campuscopy.Name = "Copy of " + campus.Name;
            campuscopy.State = campus.State;
            campuscopy.Zip = campus.Zip;
            campusclient.AddNewItem(campuscopy);

            //Now create copies of Programs
            foreach (DirectSchoolClientCampusProgram program in campusprograms)
            {
                DirectSchoolClientCampusProgram pcopy = new DirectSchoolClientCampusProgram();

                pcopy.ClientId = program.ClientId;
                pcopy.ClientRowKey = program.ClientRowKey;
                pcopy.CampusId = campuscopy.CampusId;
                pcopy.CampusRowKey = campuscopy.RowKey;
                
                pcopy.Name = program.Name;
                pcopy.ProgramId = program.ProgramId;
                pcopy.ProgramType = program.ProgramType;
                pcopy.Payout = program.Payout;
                pcopy.ProgramCategories = program.ProgramCategories;
                
                pcopy.TotalCap = program.TotalCap;
                pcopy.AnnualCap = program.AnnualCap;
                pcopy.MonthlyCap = program.MonthlyCap;
                pcopy.WeeklyCap = program.WeeklyCap;
                pcopy.DailyCap = program.DailyCap;
                
                pcopy.Status = program.Status;
                
                campusprogramclient.AddNewItem(pcopy);
            }


            return RedirectToAction("Edit", "DirectSchoolClients", new { id = campus.ClientRowKey });
        }
    }
}
