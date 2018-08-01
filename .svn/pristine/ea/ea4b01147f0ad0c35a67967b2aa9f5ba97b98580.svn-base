using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using SkillCow.Classes.Cloud.TableStorage.DirectClients.GeoIndex;
using SkillCow.Classes.Cloud.TableStorage.DirectClients.Employers;
using SkillCow.Classes.Cloud.TableStorage.DirectClients.Employers.GeoIndex;
using SkillCow.Classes.Cloud.BlobStorage;
using SkillCow.Classes.Cloud.TableStorage.DirectClients;
using SkillCow.Classes.Cloud.TableStorage.DirectClients.LeadCaps;
using SkillCow.Classes.Cloud.TableStorage.DirectClients.LeadCounters;
using SkillCow.Classes.Helpers;

namespace SkillCow.Controllers
{
    public class DirectEmployerClientCampusProgramsController : ControllerBase
    {
        public ActionResult TempCreate()
        {
            return View();
        }
        public ActionResult TempEdit()
        {
            return View();
        }

        public ActionResult Create(string campusid)
        {
            DirectEmployerClientCampusClient campusclient = new DirectEmployerClientCampusClient();
            DirectEmployerClientCampus campus = campusclient.GetByRowKey(campusid);
            ViewBag.Campus = campus;

            DirectEmployerClientClient dscc = new DirectEmployerClientClient();
            ViewBag.Client = dscc.GetByRowKey(campus.ClientRowKey);

            DirectEmployerClientCampusProgram newitem = new DirectEmployerClientCampusProgram();
            newitem.PostedDateTime = DateTime.UtcNow;
            return View(newitem);
        } 

        //
        // POST: /DirectEmployerClientCampusPrograms/Create

        [HttpPost]
        public ActionResult Create(DirectEmployerClientCampusProgram item)
        {
            try
            {
                
                if (ModelState.IsValid)
                {
                    DirectEmployerClientCampusProgramClient programclient = new DirectEmployerClientCampusProgramClient();

                    item.PostedDateTime = DateTime.UtcNow;

                    AttributeMaskCalculator amc = new AttributeMaskCalculator();
                    item.AttributeMask = amc.GetMask(item);

                    ImportantThingsMaskCalculator itmc = new ImportantThingsMaskCalculator();
                    item.ImportantThingsMask = itmc.GetMask(item);
                    
                    try
                    {
                        programclient.AddNewItem(item);
                        return RedirectToAction("Edit", "DirectEmployerClientCampuses", new { id = item.CampusId });
                    }
                    catch
                    {
                        ModelState.AddModelError("error", "Error creating new program");
                    }
                }

                DirectEmployerClientCampusClient campusclient = new DirectEmployerClientCampusClient();
                DirectEmployerClientCampus campus = campusclient.GetByRowKey(item.CampusId);
                ViewBag.Campus = campus;

                DirectEmployerClientClient dscc = new DirectEmployerClientClient();
                ViewBag.Client = dscc.GetByRowKey(item.ClientRowKey);

                return View(item);
            }
            catch
            {
                DirectEmployerClientCampusClient campusclient = new DirectEmployerClientCampusClient();
                DirectEmployerClientCampus campus = campusclient.GetByRowKey(item.CampusId);
                ViewBag.Campus = campus;

                DirectEmployerClientClient dscc = new DirectEmployerClientClient();
                ViewBag.Client = dscc.GetByRowKey(item.ClientRowKey);
                
                return View();
            }
        }

        public ActionResult Delete(string id)
        {
            DirectEmployerClientCampusProgramClient programclient = new DirectEmployerClientCampusProgramClient();
            DirectEmployerClientCampusProgram program = programclient.GetByRowKey(id);

            //Unpublish
            string currentGeoAddStates = BlobStringManager.Instance.GetString("skillcowemployerprogramgeoindex", "AddStates", id);
            string currentGeoAddZips = BlobStringManager.Instance.GetString("skillcowemployerprogramgeoindex", "AddZips", id);
            string currentGeoSubtractStates = BlobStringManager.Instance.GetString("skillcowemployerprogramgeoindex", "SubtractStates", id);
            string currentGeoSubtractZips = BlobStringManager.Instance.GetString("skillcowemployerprogramgeoindex", "SubtractZips", id);

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

            BlobStringManager.Instance.DeleteString(id, "skillcowemployerprogramgeoindex", "AddStates");
            BlobStringManager.Instance.DeleteString(id, "skillcowemployerprogramgeoindex", "AddZips");
            BlobStringManager.Instance.DeleteString(id, "skillcowemployerprogramgeoindex", "SubtractStates");
            BlobStringManager.Instance.DeleteString(id, "skillcowemployerprogramgeoindex", "SubtractZips");

            return RedirectToAction("Edit", "DirectEmployerClientCampuses", new { id = program.CampusRowKey });
        }

        public ActionResult Edit(string id)
        {
            DirectEmployerClientCampusProgramClient programclient = new DirectEmployerClientCampusProgramClient();
            DirectEmployerClientCampusProgram program = programclient.GetByRowKey(id);
            program.PostedDateTime = DateTime.UtcNow;

            DirectEmployerClientCampusClient campusclient = new DirectEmployerClientCampusClient();
            DirectEmployerClientCampus campus = campusclient.GetByRowKey(program.CampusRowKey);
            ViewBag.Campus = campus;

            DirectEmployerClientClient dscc = new DirectEmployerClientClient();
            ViewBag.Client = dscc.GetByRowKey(program.ClientRowKey);

            ViewBag.GeoAddStates = BlobStringManager.Instance.GetString("skillcowemployerprogramgeoindex", "AddStates", id);
            ViewBag.GeoAddZips = BlobStringManager.Instance.GetString("skillcowemployerprogramgeoindex", "AddZips", id);
            ViewBag.GeoSubtractStates = BlobStringManager.Instance.GetString("skillcowemployerprogramgeoindex", "SubtractStates", id);
            ViewBag.GeoSubtractZips = BlobStringManager.Instance.GetString("skillcowemployerprogramgeoindex", "SubtractZips", id);

            ViewBag.Html = BlobStringManager.Instance.GetString("skillcowjobs", "HTML", id);

            return View(program);
        }

        //
        // POST: /DirectEmployerClientCampusPrograms/Edit/5

        [HttpPost]
        public ActionResult Edit(string id, DirectEmployerClientCampusProgram updateditem)
        {
            DirectEmployerClientCampusProgramClient programclient = new DirectEmployerClientCampusProgramClient();
            DirectEmployerClientCampusProgram currentitem = programclient.GetByRowKey(updateditem.RowKey);
            
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
                AttributeMaskCalculator amc = new AttributeMaskCalculator();
                updateditem.AttributeMask = amc.GetMask(updateditem);

                ImportantThingsMaskCalculator itmc = new ImportantThingsMaskCalculator();
                updateditem.ImportantThingsMask = itmc.GetMask(updateditem);
                    

                if (PublishGeoIndex2(currentitem, updateditem))
                {
                    BlobStringManager.Instance.SaveString(NullString(updateditem.Html), updateditem.RowKey, "skillcowjobs", "HTML");

                    object htmljson = new {html = updateditem.Html.ToJSONSafeString().Replace("'","\'")};
                    BlobJsonResourceManager.Instance.SaveJsonResource("customhtml", "skillcowjobs", "JSON", updateditem.RowKey, htmljson.ToJSON());

                    updateditem.GeoAddStates = "";
                    updateditem.GeoAddZips= "";
                    updateditem.GeoSubtractStates= "";
                    updateditem.GeoSubtractZips = "";
                    updateditem.Html = "";

                    
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

                return RedirectToAction("Edit", "DirectEmployerClientCampusPrograms", new { id = updateditem.RowKey});
            }
            catch
            {
                DirectEmployerClientCampusClient campusclient = new DirectEmployerClientCampusClient();
                DirectEmployerClientCampus campus = campusclient.GetByRowKey(updateditem.CampusRowKey);
                ViewBag.Campus = campus;

                DirectEmployerClientClient dscc = new DirectEmployerClientClient();
                ViewBag.Client = dscc.GetByRowKey(updateditem.ClientRowKey);

                ViewBag.GeoAddStates = BlobStringManager.Instance.GetString("skillcowemployerprogramgeoindex", "AddStates", id);
                ViewBag.GeoAddZips = BlobStringManager.Instance.GetString("skillcowemployerprogramgeoindex", "AddZips", id);
                ViewBag.GeoSubtractStates = BlobStringManager.Instance.GetString("skillcowemployerprogramgeoindex", "SubtractStates", id);
                ViewBag.GeoSubtractZips = BlobStringManager.Instance.GetString("skillcowemployerprogramgeoindex", "SubtractZips", id);
                ViewBag.Html = BlobStringManager.Instance.GetString("skillcowjobs", "HTML", id);

                ModelState.AddModelError("error", "Failed to save");

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

        /*
        private bool PublishGeoIndex(DirectEmployerClientCampusProgram currentitem, DirectEmployerClientCampusProgram updateditem)
        {
            bool programschanged = false;

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
                programschanged = true;
            }
            else
            {
                programschanged = true;
            }

            if (programschanged)
            {
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
                        addnational.AddProgram(programcategory, updateditem.RowKey, updateditem.CampusRowKey, updateditem.ClientRowKey, 0, 0);
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


            }

            string currentGeoAddStates = BlobStringManager.Instance.GetString("skillcowemployerprogramgeoindex", "AddStates", updateditem.RowKey);
            string currentGeoAddZips = BlobStringManager.Instance.GetString("skillcowemployerprogramgeoindex", "AddZips", updateditem.RowKey);
            string currentGeoSubtractStates = BlobStringManager.Instance.GetString("skillcowemployerprogramgeoindex", "SubtractStates", updateditem.RowKey);
            string currentGeoSubtractZips = BlobStringManager.Instance.GetString("skillcowemployerprogramgeoindex", "SubtractZips", updateditem.RowKey);
            
            if (currentGeoAddStates != updateditem.GeoAddStates)
            {
                BlobStringManager.Instance.SaveString(NullString(updateditem.GeoAddStates), updateditem.RowKey, "skillcowemployerprogramgeoindex", "AddStates");
            }
            if (currentGeoAddZips != updateditem.GeoAddZips)
            {
                BlobStringManager.Instance.SaveString(NullString(updateditem.GeoAddZips), updateditem.RowKey, "skillcowemployerprogramgeoindex", "AddZips");
            }
            if (currentGeoSubtractStates != updateditem.GeoSubtractStates)
            {
                BlobStringManager.Instance.SaveString(NullString(updateditem.GeoSubtractStates), updateditem.RowKey, "skillcowemployerprogramgeoindex", "SubtractStates");
            }
            if (currentGeoSubtractZips != updateditem.GeoSubtractZips)
            {
                BlobStringManager.Instance.SaveString(NullString(updateditem.GeoSubtractZips), updateditem.RowKey, "skillcowemployerprogramgeoindex", "SubtractZips");
            }
            return true;
        }
        */

        private bool PublishGeoIndex2(DirectEmployerClientCampusProgram currentitem, DirectEmployerClientCampusProgram updateditem)
        {
            bool programschanged = false;

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
                programschanged = false;
            }
            else
            {
                programschanged = true;
            }

            GeoIndexNationalClient addnational = new GeoIndexNationalClient();

            if (programschanged)
            {
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
                        addnational.AddProgram(programcategory, updateditem.RowKey, updateditem.CampusRowKey, updateditem.ClientRowKey, 0, 0);
                    }
                    else
                    {
                        addnational.RemoveProgram(programcategory, updateditem.RowKey);
                    }

                    ProcessGeoTargetingListString("AddStates", updateditem.GeoAddStates, programcategory.Trim(), newcategory, updateditem.RowKey, updateditem.CampusRowKey, updateditem.ClientRowKey, 0, 0, false, new GeoIndexAddStateClient());
                    ProcessGeoTargetingListString("AddZips", updateditem.GeoAddZips, programcategory.Trim(), newcategory, updateditem.RowKey, updateditem.CampusRowKey, updateditem.ClientRowKey, 0, 0, false, new GeoIndexAddZipClient());
                    ProcessGeoTargetingListString("SubtractStates", updateditem.GeoSubtractStates, programcategory.Trim(), newcategory, updateditem.RowKey, updateditem.CampusRowKey, updateditem.ClientRowKey, 0, 0, false, new GeoIndexSubtractStateClient());
                    ProcessGeoTargetingListString("SubtractZips", updateditem.GeoSubtractZips, programcategory.Trim(), newcategory, updateditem.RowKey, updateditem.CampusRowKey, updateditem.ClientRowKey, 0, 0, false, new GeoIndexSubtractZipClient());
                }


            }

            //Publish for attributes
            bool maskschanged = (updateditem.AttributeMask != currentitem.AttributeMask || updateditem.ImportantThingsMask != currentitem.ImportantThingsMask);

            if (updateditem.GeoAddNational == "National")
            {
                if (maskschanged)
                {
                    addnational.RemoveProgram("attr", updateditem.RowKey);
                }
                addnational.AddProgram("attr", updateditem.RowKey, updateditem.CampusRowKey, updateditem.ClientRowKey, updateditem.AttributeMask, updateditem.ImportantThingsMask);
            }
            else
            {
                addnational.RemoveProgram("attr", updateditem.RowKey);
            }

            ProcessGeoTargetingListString("AddStates", updateditem.GeoAddStates, "", false, updateditem.RowKey, updateditem.CampusRowKey, updateditem.ClientRowKey, updateditem.AttributeMask, updateditem.ImportantThingsMask, maskschanged, new GeoIndexAddStateClient());
            ProcessGeoTargetingListString("AddZips", updateditem.GeoAddZips, "", false, updateditem.RowKey, updateditem.CampusRowKey, updateditem.ClientRowKey, updateditem.AttributeMask, updateditem.ImportantThingsMask, maskschanged, new GeoIndexAddZipClient());
            ProcessGeoTargetingListString("SubtractStates", updateditem.GeoSubtractStates, "", false, updateditem.RowKey, updateditem.CampusRowKey, updateditem.ClientRowKey, updateditem.AttributeMask, updateditem.ImportantThingsMask, maskschanged, new GeoIndexSubtractStateClient());
            ProcessGeoTargetingListString("SubtractZips", updateditem.GeoSubtractZips, "", false, updateditem.RowKey, updateditem.CampusRowKey, updateditem.ClientRowKey, updateditem.AttributeMask, updateditem.ImportantThingsMask, maskschanged, new GeoIndexSubtractZipClient());
            
            string currentGeoAddStates = BlobStringManager.Instance.GetString("skillcowemployerprogramgeoindex", "AddStates", updateditem.RowKey);
            string currentGeoAddZips = BlobStringManager.Instance.GetString("skillcowemployerprogramgeoindex", "AddZips", updateditem.RowKey);
            string currentGeoSubtractStates = BlobStringManager.Instance.GetString("skillcowemployerprogramgeoindex", "SubtractStates", updateditem.RowKey);
            string currentGeoSubtractZips = BlobStringManager.Instance.GetString("skillcowemployerprogramgeoindex", "SubtractZips", updateditem.RowKey);

            if (currentGeoAddStates != updateditem.GeoAddStates)
            {
                BlobStringManager.Instance.SaveString(NullString(updateditem.GeoAddStates), updateditem.RowKey, "skillcowemployerprogramgeoindex", "AddStates");
            }
            if (currentGeoAddZips != updateditem.GeoAddZips)
            {
                BlobStringManager.Instance.SaveString(NullString(updateditem.GeoAddZips), updateditem.RowKey, "skillcowemployerprogramgeoindex", "AddZips");
            }
            if (currentGeoSubtractStates != updateditem.GeoSubtractStates)
            {
                BlobStringManager.Instance.SaveString(NullString(updateditem.GeoSubtractStates), updateditem.RowKey, "skillcowemployerprogramgeoindex", "SubtractStates");
            }
            if (currentGeoSubtractZips != updateditem.GeoSubtractZips)
            {
                BlobStringManager.Instance.SaveString(NullString(updateditem.GeoSubtractZips), updateditem.RowKey, "skillcowemployerprogramgeoindex", "SubtractZips");
            }
            return true;
        }

        private bool RemoveProgramCategory(string stringtype, string updatedstringvalue, string programcategory, string itemrowkey, IGeoIndexClient indexclient)
        {
            string currentstring = BlobStringManager.Instance.GetString("skillcowemployerprogramgeoindex", stringtype, itemrowkey);
            if (currentstring != null && currentstring.Trim() != "")
            {
                List<string> currenttokens = new List<string>(currentstring.Split(','));
                RemoveTokens(currenttokens, programcategory, itemrowkey, indexclient);
            }

            return true;
        }

        private bool ProcessGeoTargetingListString(string stringtype, string updatedstringvalue, string programcategory, bool newcategory, string itemrowkey, string campuskey, string clientkey, long attributemask, long importantthingsmask, bool maskschanged, IGeoIndexClient indexclient)
        {
            string currentstring = BlobStringManager.Instance.GetString("skillcowemployerprogramgeoindex", stringtype, itemrowkey);
            if (currentstring != null && currentstring.Trim() != "")
            {
                //Previous string exists
                if (newcategory)
                {
                    if (updatedstringvalue != null && updatedstringvalue.Trim() != "")
                    {
                        List<string> updatedtokens = new List<string>(updatedstringvalue.Split(','));
                        AddTokens(updatedtokens, programcategory, itemrowkey, campuskey, clientkey, attributemask, importantthingsmask, indexclient);
                    }
                }
                else
                {
                    if (currentstring != updatedstringvalue || maskschanged)
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
                            else
                            {
                                if (maskschanged)
                                {
                                    tokenstoremove.Add(token);
                                    tokenstoadd.Add(token);
                                }
                            }
                        }

                        RemoveTokens(tokenstoremove, programcategory, itemrowkey, indexclient);
                        AddTokens(tokenstoadd, programcategory, itemrowkey, campuskey, clientkey, attributemask, importantthingsmask, indexclient);
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
                        AddTokens(tokens, programcategory, itemrowkey, campuskey, clientkey, attributemask, importantthingsmask, indexclient);
                    }
                }
            }
            

            return true;
        }

        private bool AddTokens(IEnumerable<string> tokens, string programcategory, string programrowkey, string campuskey, string clientkey, long attributemask, long importantthingsmask, IGeoIndexClient indexclient)
        {
            foreach (string token in tokens)
            {
                string partition = programcategory != "" ? token.Trim() + "-" + programcategory : token.Trim();
                indexclient.AddProgram(partition, programrowkey, campuskey, clientkey, attributemask, importantthingsmask);
            }
            return true;
        }
        private bool RemoveTokens(IEnumerable<string> tokens, string programcategory, string programrowkey, IGeoIndexClient indexclient)
        {
            foreach (string token in tokens)
            {
                string partition = programcategory != "" ? token.Trim() + "-" + programcategory : token.Trim();
                indexclient.RemoveProgram(partition, programrowkey);
            }
            return true;
        }
    }
}
