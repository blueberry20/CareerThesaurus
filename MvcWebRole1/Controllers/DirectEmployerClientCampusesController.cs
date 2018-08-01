using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using SkillCow.Classes.Cloud.TableStorage.DirectClients.Employers;

namespace SkillCow.Controllers
{
    public class DirectEmployerClientCampusesController : ControllerBase
    {
        public ActionResult Create(string clientid)
        {
            DirectEmployerClientClient dscc = new DirectEmployerClientClient();
            ViewBag.Client = dscc.GetByRowKey(clientid);

            return View();
        } 

        [HttpPost]
        public ActionResult Create(DirectEmployerClientCampus item)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    DirectEmployerClientCampusClient dscc = new DirectEmployerClientCampusClient();

                    try
                    {
                        dscc.AddNewItem(item);
                        return RedirectToAction("Edit", "DirectEmployerClients", new { id = item.ClientRowKey });
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
            DirectEmployerClientCampusClient campusclient = new DirectEmployerClientCampusClient();
            DirectEmployerClientCampus campus = campusclient.GetByRowKey(id);

            DirectEmployerClientClient dscc = new DirectEmployerClientClient();
            ViewBag.Client = dscc.GetByRowKey(campus.ClientRowKey);

            return View(campus);
        }

        [HttpPost]
        public ActionResult Edit(string id, DirectEmployerClientCampus item)
        {
            try
            {
                DirectEmployerClientCampusClient dscc = new DirectEmployerClientCampusClient();
                dscc.Update(item);

                return RedirectToAction("Edit", "DirectEmployerClients", new { id = item.ClientRowKey });
            }
            catch
            {
                return View();
            }
        }

        public ActionResult Duplicate(string id)
        {
            DirectEmployerClientCampusClient campusclient = new DirectEmployerClientCampusClient();
            DirectEmployerClientCampus campus = campusclient.GetByRowKey(id);

            DirectEmployerClientCampusProgramClient campusprogramclient = new DirectEmployerClientCampusProgramClient();
            List<DirectEmployerClientCampusProgram> campusprograms = new List<DirectEmployerClientCampusProgram>(campusprogramclient.GetAllByClientId(campus.ClientRowKey).Where(x => x.CampusRowKey == id));
    
            //Create a copy of the campus
            DirectEmployerClientCampus campuscopy = new DirectEmployerClientCampus();
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
            foreach (DirectEmployerClientCampusProgram program in campusprograms)
            {
                DirectEmployerClientCampusProgram pcopy = new DirectEmployerClientCampusProgram();

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


            return RedirectToAction("Edit", "DirectEmployerClients", new { id = campus.ClientRowKey });
        }
    }
}
