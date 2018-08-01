using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using SkillCow.Classes.Cloud.TableStorage.DirectClients.GeoIndex;
using SkillCow.Classes.Cloud.TableStorage.DirectClients.Schools;
using SkillCow.Classes.Cloud.TableStorage.DirectClients.Schools.GeoIndex;
using SkillCow.Classes.Cloud.BlobStorage;
using SkillCow.Classes.Cloud.TableStorage.DirectClients;
using SkillCow.Classes.Cloud.TableStorage.DirectClients.LeadCaps;
using SkillCow.Classes.Cloud.TableStorage.DirectClients.LeadCounters;

namespace SkillCow.Controllers
{
    public class DirectSchoolClientCampusProgramsController : ControllerBase
    {
        public ActionResult Create(string campusid)
        {
            DirectSchoolClientCampusClient campusclient = new DirectSchoolClientCampusClient();
            DirectSchoolClientCampus campus = campusclient.GetByRowKey(campusid);
            ViewBag.Campus = campus;

            DirectSchoolClientClient dscc = new DirectSchoolClientClient();
            ViewBag.Client = dscc.GetByRowKey(campus.ClientRowKey);
            
            return View();
        } 

        //
        // POST: /DirectSchoolClientCampusPrograms/Create

        [HttpPost]
        public ActionResult Create(DirectSchoolClientCampusProgram item)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    DirectSchoolClientCampusProgramClient programclient = new DirectSchoolClientCampusProgramClient();

                    try
                    {
                        programclient.AddNewItem(item);
                        return RedirectToAction("Edit", "DirectSchoolClientCampuses", new { id = item.CampusId });
                    }
                    catch
                    {
                        ModelState.AddModelError("error", "Error creating new program");
                    }
                }

                DirectSchoolClientCampusClient campusclient = new DirectSchoolClientCampusClient();
                DirectSchoolClientCampus campus = campusclient.GetByRowKey(item.CampusId);
                ViewBag.Campus = campus;

                DirectSchoolClientClient dscc = new DirectSchoolClientClient();
                ViewBag.Client = dscc.GetByRowKey(item.ClientRowKey);

                return View(item);
            }
            catch
            {
                return View();
            }
        }

        public ActionResult Delete(string id)
        {
            DirectSchoolClientCampusProgramClient programclient = new DirectSchoolClientCampusProgramClient();
            DirectSchoolClientCampusProgram program = programclient.GetByRowKey(id);

            //Unpublish
            string currentGeoAddStates = BlobStringManager.Instance.GetString("skillcowschoolprogramgeoindex", "AddStates", id);
            string currentGeoAddZips = BlobStringManager.Instance.GetString("skillcowschoolprogramgeoindex", "AddZips", id);
            string currentGeoSubtractStates = BlobStringManager.Instance.GetString("skillcowschoolprogramgeoindex", "SubtractStates", id);
            string currentGeoSubtractZips = BlobStringManager.Instance.GetString("skillcowschoolprogramgeoindex", "SubtractZips", id);

            List<string> currentcategories = new List<string>();
            if (program.ProgramCategories != null)
            {
                currentcategories = new List<string>(program.ProgramCategories.Split(','));
            }

            GeoIndexNationalClient addnational = new GeoIndexNationalClient();

            foreach (string programcategory in currentcategories)
            {
                addnational.RemoveProgram(programcategory, program.RowKey);

                RemoveProgramCategory("AddStates", currentGeoAddStates, programcategory.Trim(), program.RowKey, new GeoIndexAddStateClient());
                RemoveProgramCategory("AddZips", currentGeoAddZips, programcategory.Trim(), program.RowKey, new GeoIndexAddZipClient());
                RemoveProgramCategory("SubtractStates", currentGeoSubtractStates, programcategory.Trim(), program.RowKey, new GeoIndexSubtractStateClient());
                RemoveProgramCategory("SubtractZips", currentGeoSubtractZips, programcategory.Trim(), program.RowKey, new GeoIndexSubtractZipClient());
            }

            programclient.Delete(program);

            BlobStringManager.Instance.DeleteString(id, "skillcowschoolprogramgeoindex", "AddStates");
            BlobStringManager.Instance.DeleteString(id, "skillcowschoolprogramgeoindex", "AddZips");
            BlobStringManager.Instance.DeleteString(id, "skillcowschoolprogramgeoindex", "SubtractStates");
            BlobStringManager.Instance.DeleteString(id, "skillcowschoolprogramgeoindex", "SubtractZips");

            return RedirectToAction("Edit", "DirectSchoolClientCampuses", new { id = program.CampusRowKey });
        }

        public ActionResult Edit(string id)
        {
            DirectSchoolClientCampusProgramClient programclient = new DirectSchoolClientCampusProgramClient();
            DirectSchoolClientCampusProgram program = programclient.GetByRowKey(id);
            
            DirectSchoolClientCampusClient campusclient = new DirectSchoolClientCampusClient();
            DirectSchoolClientCampus campus = campusclient.GetByRowKey(program.CampusRowKey);
            ViewBag.Campus = campus;

            DirectSchoolClientClient dscc = new DirectSchoolClientClient();
            ViewBag.Client = dscc.GetByRowKey(program.ClientRowKey);

            ViewBag.GeoAddStates = BlobStringManager.Instance.GetString("skillcowschoolprogramgeoindex", "AddStates", id);
            ViewBag.GeoAddZips = BlobStringManager.Instance.GetString("skillcowschoolprogramgeoindex", "AddZips", id);
            ViewBag.GeoSubtractStates = BlobStringManager.Instance.GetString("skillcowschoolprogramgeoindex", "SubtractStates", id);
            ViewBag.GeoSubtractZips = BlobStringManager.Instance.GetString("skillcowschoolprogramgeoindex", "SubtractZips", id);

            return View(program);
        }

        //
        // POST: /DirectSchoolClientCampusPrograms/Edit/5

        [HttpPost]
        public ActionResult Edit(string id, DirectSchoolClientCampusProgram updateditem)
        {
            DirectSchoolClientCampusProgramClient programclient = new DirectSchoolClientCampusProgramClient();
            DirectSchoolClientCampusProgram currentitem = programclient.GetByRowKey(updateditem.RowKey);

            if (updateditem.GeoAddNational == null)
            {
                updateditem.GeoAddNational = "";
            }
            if (updateditem.GeoAddNational == null)
            {
                updateditem.GeoAddNational = "";
            }
            if (updateditem.GeoAddStates == null)
            {
                updateditem.GeoAddStates = "";
            }
            if (updateditem.GeoAddZips == null)
            {
                updateditem.GeoAddZips = "";
            }
            if (updateditem.GeoSubtractStates == null)
            {
                updateditem.GeoSubtractStates = "";
            }
            if (updateditem.GeoSubtractZips == null)
            {
                updateditem.GeoSubtractZips = "";
            }

            try
            {
                
                if (PublishGeoIndex(currentitem, updateditem))
                {
                    updateditem.GeoAddStates = "";
                    updateditem.GeoAddZips= "";
                    updateditem.GeoSubtractStates= "";
                    updateditem.GeoSubtractZips = "";

                    programclient.Update(updateditem);

                    //Save LeadCap
                    LeadCapClient leadcapclient = new LeadCapClient();
                    LeadCap leadcap = leadcapclient.GetByRowKey(updateditem.RowKey);
                    bool createnewcap = false;
                    if(leadcap == null)
                    {
                        leadcap = new LeadCap();
                        leadcap.RowKey = updateditem.RowKey;
                        createnewcap = true;
                    }
                    leadcap.Total = updateditem.TotalCap;
                    leadcap.Annually = updateditem.AnnualCap;
                    leadcap.Monthly = updateditem.MonthlyCap;
                    leadcap.Weekly = updateditem.WeeklyCap;
                    leadcap.Daily = updateditem.DailyCap;
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
                    LeadCounter leadcounter = leadcounterclient.GetByRowKey(updateditem.RowKey);
                    if (leadcounter == null)
                    {
                        leadcounter = new LeadCounter();
                        leadcounter.RowKey = updateditem.RowKey;
                        leadcounter.Total = 0;
                        leadcounter.Annually = 0;
                        leadcounter.Monthly = 0;
                        leadcounter.Weekly = 0;
                        leadcounter.Daily = 0;
                        leadcounterclient.AddNewItem(leadcounter);
                    }
                                        
                }
                else
                {
                    throw new Exception("Failed to publish GEO index");
                }

                return RedirectToAction("Edit", "DirectSchoolClientCampuses", new { id = updateditem.CampusRowKey });
            }
            catch
            {
                DirectSchoolClientCampusClient campusclient = new DirectSchoolClientCampusClient();
                DirectSchoolClientCampus campus = campusclient.GetByRowKey(updateditem.CampusRowKey);
                ViewBag.Campus = campus;

                DirectSchoolClientClient dscc = new DirectSchoolClientClient();
                ViewBag.Client = dscc.GetByRowKey(updateditem.ClientRowKey);

                ViewBag.GeoAddStates = BlobStringManager.Instance.GetString("skillcowschoolprogramgeoindex", "AddStates", id);
                ViewBag.GeoAddZips = BlobStringManager.Instance.GetString("skillcowschoolprogramgeoindex", "AddZips", id);
                ViewBag.GeoSubtractStates = BlobStringManager.Instance.GetString("skillcowschoolprogramgeoindex", "SubtractStates", id);
                ViewBag.GeoSubtractZips = BlobStringManager.Instance.GetString("skillcowschoolprogramgeoindex", "SubtractZips", id);


                return View(updateditem);
            }
        }

        private string NullString(string value)
        {
            if (value == null)
                return "";
            else
                return value;
        }
        private bool PublishGeoIndex(DirectSchoolClientCampusProgram currentitem, DirectSchoolClientCampusProgram updateditem)
        {
            //List<string> programcategories = new List<string>();
            //if (updateditem.ProgramCategories != null)
            //{
            //    programcategories = new List<string>(updateditem.ProgramCategories.Split(','));
            //}
            
            //See which program categories need to be added or removed
            List<string> currentcategories = new List<string>();
            if (currentitem.ProgramCategories != null)
            {
                currentcategories = new List<string>(currentitem.ProgramCategories.Split(','));
            }

            List<string> updatedcategories = new List<string>();
            if (updateditem.ProgramCategories != null)
            {
                updatedcategories = new List<string>(updateditem.ProgramCategories.Split(','));
            }

            if (currentcategories.Count == 0 && updatedcategories.Count == 0)
            {
                return true;
            }
            else
            {
                Console.Write("Categories changed");
            }


            List<string> categoriestoremove = new List<string>();
            List<string> categoriestoadd = new List<string>();

            //find strings to remove
            foreach (string token in currentcategories)
            {
                if (!updatedcategories.Contains(token))
                {
                    categoriestoremove.Add(token);
                }
            }

            //find strings to add
            foreach (string token in updatedcategories)
            {
                if (!currentcategories.Contains(token))
                {
                    categoriestoadd.Add(token);
                }
            }

            GeoIndexNationalClient addnational = new GeoIndexNationalClient();
            
            foreach (string programcategory in categoriestoremove)
            {
                addnational.RemoveProgram(programcategory, updateditem.RowKey);

                RemoveProgramCategory("AddStates", updateditem.GeoAddStates, programcategory.Trim(), updateditem.RowKey, new GeoIndexAddStateClient());
                RemoveProgramCategory("AddZips", updateditem.GeoAddZips, programcategory.Trim(), updateditem.RowKey, new GeoIndexAddZipClient());
                RemoveProgramCategory("SubtractStates", updateditem.GeoSubtractStates, programcategory.Trim(), updateditem.RowKey, new GeoIndexSubtractStateClient());
                RemoveProgramCategory("SubtractZips", updateditem.GeoSubtractZips, programcategory.Trim(), updateditem.RowKey, new GeoIndexSubtractZipClient());
            }



            foreach (string programcategory in updatedcategories)
            {
                bool newcategory = !currentcategories.Contains(programcategory);

                if (updateditem.GeoAddNational == "National")
                {
                    addnational.AddProgram(programcategory, updateditem.RowKey, updateditem.CampusRowKey, updateditem.ClientRowKey,0,0);
                }
                else
                {
                    addnational.RemoveProgram(programcategory, updateditem.RowKey);
                }
                
                ProcessGeoTargetingListString("AddStates", updateditem.GeoAddStates, programcategory.Trim(), newcategory, updateditem.RowKey, updateditem.CampusRowKey, updateditem.ClientRowKey, new GeoIndexAddStateClient());
                ProcessGeoTargetingListString("AddZips", updateditem.GeoAddZips, programcategory.Trim(), newcategory, updateditem.RowKey, updateditem.CampusRowKey, updateditem.ClientRowKey, new GeoIndexAddZipClient());
                ProcessGeoTargetingListString("SubtractStates", updateditem.GeoSubtractStates, programcategory.Trim(), newcategory, updateditem.RowKey, updateditem.CampusRowKey, updateditem.ClientRowKey, new GeoIndexSubtractStateClient());
                ProcessGeoTargetingListString("SubtractZips", updateditem.GeoSubtractZips, programcategory.Trim(), newcategory, updateditem.RowKey, updateditem.CampusRowKey, updateditem.ClientRowKey, new GeoIndexSubtractZipClient());
            }


            string currentGeoAddStates = BlobStringManager.Instance.GetString("skillcowschoolprogramgeoindex", "AddStates", updateditem.RowKey);
            string currentGeoAddZips = BlobStringManager.Instance.GetString("skillcowschoolprogramgeoindex", "AddZips", updateditem.RowKey);
            string currentGeoSubtractStates = BlobStringManager.Instance.GetString("skillcowschoolprogramgeoindex", "SubtractStates", updateditem.RowKey);
            string currentGeoSubtractZips = BlobStringManager.Instance.GetString("skillcowschoolprogramgeoindex", "SubtractZips", updateditem.RowKey);

            if (currentGeoAddStates != updateditem.GeoAddStates)
            {
                BlobStringManager.Instance.SaveString(NullString(updateditem.GeoAddStates), updateditem.RowKey, "skillcowschoolprogramgeoindex", "AddStates");
            }
            if (currentGeoAddZips != updateditem.GeoAddZips)
            {
                BlobStringManager.Instance.SaveString(NullString(updateditem.GeoAddZips), updateditem.RowKey, "skillcowschoolprogramgeoindex", "AddZips");
            }
            if (currentGeoSubtractStates != updateditem.GeoSubtractStates)
            {
                BlobStringManager.Instance.SaveString(NullString(updateditem.GeoSubtractStates), updateditem.RowKey, "skillcowschoolprogramgeoindex", "SubtractStates");
            }
            if (currentGeoSubtractZips != updateditem.GeoSubtractZips)
            {
                BlobStringManager.Instance.SaveString(NullString(updateditem.GeoSubtractZips), updateditem.RowKey, "skillcowschoolprogramgeoindex", "SubtractZips");
            }
            return true;
        }

        private bool RemoveProgramCategory(string stringtype, string updatedstringvalue, string programcategory, string itemrowkey, IGeoIndexClient indexclient)
        {
            string currentstring = BlobStringManager.Instance.GetString("skillcowschoolprogramgeoindex", stringtype, itemrowkey);
            if (currentstring != null && currentstring.Trim() != "")
            {
                List<string> currenttokens = new List<string>(currentstring.Split(','));
                RemoveTokens(currenttokens, programcategory, itemrowkey, indexclient);
            }

            return true;
        }

        private bool ProcessGeoTargetingListString(string stringtype, string updatedstringvalue, string programcategory, bool newcategory, string itemrowkey, string campuskey, string clientkey, IGeoIndexClient indexclient)
        {
            string currentstring = BlobStringManager.Instance.GetString("skillcowschoolprogramgeoindex", stringtype, itemrowkey);
            if (currentstring != null && currentstring.Trim() != "")
            {
                //Previous string exists
                if (newcategory)
                {
                    if(updatedstringvalue != null && updatedstringvalue.Trim() != "")
                    {
                        List<string> updatedtokens = new List<string>(updatedstringvalue.Split(','));
                        AddTokens(updatedtokens, programcategory, itemrowkey, campuskey, clientkey, indexclient);
                    }
                }
                else
                {
                    if (currentstring != updatedstringvalue)
                    {
                        List<string> currenttokens = new List<string>(currentstring.Split(','));
                        List<string> updatedtokens = new List<string>(updatedstringvalue.Split(','));

                        List<string> tokenstoremove = new List<string>();
                        List<string> tokenstoadd = new List<string>();

                        //find strings to remove
                        foreach (string token in currenttokens)
                        {
                            if (!updatedtokens.Contains(token))
                            {
                                tokenstoremove.Add(token);
                            }
                        }

                        //find strings to add
                        foreach (string token in updatedtokens)
                        {
                            if (!currenttokens.Contains(token))
                            {
                                tokenstoadd.Add(token);
                            }
                        }

                        RemoveTokens(tokenstoremove, programcategory, itemrowkey, indexclient);
                        AddTokens(tokenstoadd, programcategory, itemrowkey, campuskey, clientkey, indexclient);
                    }
                }
                
            }
            else
            {
                //Previous string does not exist
                if (updatedstringvalue != null && updatedstringvalue.Trim() != "")
                {
                    if (updatedstringvalue.Trim().Length > 0)
                    {
                        string[] tokens = updatedstringvalue.Split(',');
                        AddTokens(tokens, programcategory, itemrowkey, campuskey, clientkey, indexclient);
                    }
                }
            }
            

            return true;
        }

        private bool AddTokens(IEnumerable<string> tokens, string programcategory, string programrowkey, string campuskey, string clientkey, IGeoIndexClient indexclient)
        {
            foreach (string token in tokens)
            {
                indexclient.AddProgram(token.Trim() + "-" + programcategory, programrowkey, campuskey, clientkey,0,0);
            }
            return true;
        }
        private bool RemoveTokens(IEnumerable<string> tokens, string programcategory, string programrowkey, IGeoIndexClient indexclient)
        {
            foreach (string token in tokens)
            {
                indexclient.RemoveProgram(token.Trim() + "-" + programcategory, programrowkey);
            }
            return true;
        }
    }
}
