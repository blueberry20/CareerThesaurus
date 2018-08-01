using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using SkillCow.Classes.Helpers;
using SkillCow.Classes.Cloud.BlobStorage;
using SkillCow.Classes.Cloud.TableStorage.PersonalityTests.CBNProfessions;
using System.Text;
using SkillCow.Classes.Cloud.TableStorage.ABTests;

namespace SkillCow.Controllers
{
    public class HomeController : ControllerBase
    {
        //
        // GET: /Home/

        public ActionResult Index()
        {
            //ABTestClient abtc = new ABTestClient(this, Request, Response);

            string network = Request.QueryString["utm_source"] != null ? Request.QueryString["utm_source"] : "";
            string campaign = Request.QueryString["utm_campaign"] != null ? Request.QueryString["utm_campaign"] : "";
            string utmcontent = Request.QueryString["utm_content"] != null ? Request.QueryString["utm_content"] : "";
            string utmterm = Request.QueryString["utm_term"] != null ? Request.QueryString["utm_term"] : "";

            string activecampaignid = "13564694";
            if (Request.QueryString["campaign_id"] != null && Request.QueryString["campaign_id"] != "")
            {
                activecampaignid = Request.QueryString["campaign_id"];
            }

            if (activecampaignid != "13564694")
            {
                network = "Google";
            }

            if (network == "")
            {
                network = "Direct";
            }

            //object json = new
            //{
            //    CbnCampaign = activecampaignid,
            //    Network = network.ToJSONSafeString(),
            //    Campaign = campaign.ToJSONSafeString(),
            //    Content = utmcontent.ToJSONSafeString(),
            //    Term = utmterm.ToJSONSafeString()
            //};

            //string abtestname = json.ToJSON();
            //if (abtestname.Length > 0)
            //    abtc.Force = true;

            //abtc.CreateGoalEntry("schoolleads", "Index", abtestname.ToString());

            return View();
        }

        public ActionResult SchoolForm()
        {
            return View();
        }
    }
}
