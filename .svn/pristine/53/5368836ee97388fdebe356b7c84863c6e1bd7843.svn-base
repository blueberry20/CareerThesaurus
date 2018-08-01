using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using SkillCow.Classes.Cloud.TableStorage.ABTests;
using Microsoft.WindowsAzure.StorageClient;
using Newtonsoft.Json.Linq;


namespace SkillCow.Controllers
{
    public class ABTestsController : ControllerBase
    {
        public ActionResult Index(string g, string d)
        {
            ViewBag.GoalName = g;

            IEnumerable<ABTestResult> results =null;
            
            results = ABTestResult.GetResultsByGoal(g, d).OrderByDescending(r => r.ConversionCount);

            Dictionary<string, ABTestResult> resultsBySource = new Dictionary<string, ABTestResult>();
            
            Dictionary<string, ABTestResult> resultsByAd = new Dictionary<string, ABTestResult>();
            Dictionary<string, ABTestResult> resultsByTerm = new Dictionary<string, ABTestResult>();

            Dictionary<string, ABTestResult> resultsByView = new Dictionary<string, ABTestResult>();
                        
            foreach (ABTestResult r in results)
            {
                if(r.TestID!=null && r.TestID!="")
                {
                    try
                    {
                        string[] tokens = r.TestID.Split(".".ToCharArray(), 3);

                        if (tokens.Length > 2)
                        {
                            if (tokens[2] != null && tokens[2].Contains("{"))
                            {
                                JObject json = JObject.Parse(tokens[2]);

                                if (true || json["Network"].ToString() == "mgid.com")
                                {
                                    r.Goal = g;
                                    r.Module = tokens[0];
                                    r.View = tokens[1];

                                    GroupResult(resultsByView, r.View, r);

                                    r.CbnCampaign = json["CbnCampaign"].ToString();
                                    r.UtmSource = json["Network"].ToString();


                                    r.UtmCampaign = json["Campaign"].ToString();

                                    r.UtmContent = json["Content"].ToString();

                                    r.UtmTerm = json["Term"].ToString();


                                    //Group results

                                    //By source
                                    GroupResult(resultsBySource, json["Network"].ToString(), r);

                                    //by Ad
                                    string campaignKey = json["Network"].ToString() + "." + json["CbnCampaign"].ToString() + "." + json["Content"].ToString();
                                    GroupResult(resultsByAd, campaignKey, r);

                                    //by term
                                    string termKey = json["Network"].ToString() + "." + json["CbnCampaign"].ToString() + "." + json["Term"].ToString();
                                    GroupResult(resultsByTerm, termKey, r);
                                }
                            }
                        }
                    }
                    catch
                    {
                    }
                }
            }

            ViewBag.Results = results.OrderByDescending(r => r.UtmSource + (1000000 + r.UniqueVisitors));

            ViewBag.ResultsBySource = resultsBySource.OrderByDescending(kv => kv.Value.UtmSource + (1000000 + kv.Value.UniqueVisitors));
            ViewBag.ResultsByAd = resultsByAd.OrderByDescending(kv => kv.Value.UtmSource + (1000000 + kv.Value.UniqueVisitors));
            ViewBag.ResultsByTerm = resultsByTerm.OrderByDescending(kv => kv.Value.UtmSource + (1000000 + kv.Value.UniqueVisitors));

            ViewBag.ResultsByView = resultsByView.OrderByDescending(kv => kv.Value.UtmSource + (1000000 + kv.Value.UniqueVisitors));

            
            return View();
        }
        private void GroupResult(Dictionary<string, ABTestResult> dictResults, string key, ABTestResult r)
        {
            if(dictResults.ContainsKey(key))
            {
                dictResults[key].UniqueVisitors += r.UniqueVisitors;
                dictResults[key].TotalViews += r.TotalViews;
                dictResults[key].ConversionCount += r.ConversionCount;
                dictResults[key].ConversionWeightSum += r.ConversionWeightSum;
            }
            else
            {
                dictResults.Add(key, new ABTestResult
                {
                    TestID = r.TestID,
                    Module = r.Module,
                    View = r.View,
                    Goal = r.Goal, 
                    UniqueVisitors=r.UniqueVisitors, 
                    TotalViews=r.TotalViews, 
                    ConversionCount=r.ConversionCount, 
                    ConversionWeightSum=r.ConversionWeightSum,
                    CbnCampaign=r.CbnCampaign, 
                    UtmSource=r.UtmSource, 
                    UtmCampaign=r.UtmCampaign, 
                    UtmContent=r.UtmContent,
                    UtmTerm = r.UtmTerm
                 });
            }
        }

        public ActionResult Create()
        {
            
            return View();
        }
                
        [HttpPost]
        public ActionResult Create(ABTest abtest)
        {
            if (ModelState.IsValid)
            {
                ABTestClient abtc = new ABTestClient();

                try
                {
                    abtc.CreateNew(abtest.RowKey);
                    return RedirectToAction("Index");
                }
                catch
                {
                    ModelState.AddModelError("error", "Error creating new test");
                }
            }

            return View(abtest);
        }

    }
}
