using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.StorageClient;
using Microsoft.WindowsAzure.ServiceRuntime;
using System.Web.Mvc;
using SkillCow.Classes.Helpers;

namespace SkillCow.Classes.Cloud.TableStorage.ABTests
{
    public class ABTestClient : ChainDateTableServiceClientBase<ABTest>
    {
        const string APP_NAME = "skillcow";

        //bool suppress=false;
        HttpRequestBase request;
        HttpResponseBase response;
        string suppressingCookieName;
        string moduleName;

        public bool Force { get; set; }
        
        public ABTestClient(Controller moduleController, HttpRequestBase request, HttpResponseBase response)
            : this(moduleController.GetType().Name.Replace("Controller", ""), request, response)
        {
        }
        public ABTestClient(string moduleName, HttpRequestBase request, HttpResponseBase response)
            : base("abtest")
        {
            this.moduleName = moduleName;
            this.request = request;
            this.response = response;
            
            //if(suppressingCookieName!=null && suppressingCookieName!="")
            //{
            //    if (request.Cookies[suppressingCookieName] != null)
            //    {
            //        suppress = true;
            //    }
            //}
        }
        public ABTestClient(string testModuleName)
            : base("abtest")
        {
            this.moduleName = testModuleName;
        }
        public ABTestClient()
            : base("abtest")
        {
            
        }

        public void CreateNew(string moduleName)
        {
            try
            {
                int addStatus = base.AddNewItem(new ABTest(moduleName));
                if (addStatus < 0)
                    throw new Exception();
            }
            catch 
            { 
            }
        }

        public IEnumerable<ABTest> GetAllTests()
        {
            return (from e in Entities()
                    select e).AsEnumerable();
        }

        //public string CreateImpression()
        //{
            
        //    return CreateImpression(null);
        //}
        //public string CreateImpression(string coupledView)
        //{
        //    return CreateImpression(null, coupledView);
        //}


        public void CreateGoalEntry(string goalName, string viewName, string testSuffix)
        {
            if (this.moduleName == null || this.moduleName == "")
                throw new Exception("Module name not specified");

            bool alreadyconverted = request.Cookies[APP_NAME + "." + goalName + ".converted"] != null;

            if (Force || !alreadyconverted)
            {
                string testName;
                if (testSuffix != null && testSuffix.Trim() != "")
                    testName = moduleName + "." + viewName + "." + testSuffix;
                else
                    testName = moduleName + "." + viewName;

                IncrementViewCountCookie(testName);

                bool skip = false;
                if (request != null && request.Cookies[APP_NAME + ".ab." + goalName] != null && request.Cookies[APP_NAME + ".ab." + goalName].Value == testName)
                    skip = true;

                if (Force || !skip)
                {
                    if (response != null)
                        response.Cookies[APP_NAME + ".ab." + goalName].Value = testName;

                    ABTestImpressionClient abtic = new ABTestImpressionClient();
                    abtic.AddImpression(moduleName, goalName, testName);
                }
            }
        }
        public void CreateGoalConversion(string goalName)
        {
            CreateGoalConversion(goalName, 1);
        }
        public void CreateGoalConversion(string goalName, int weight)
        {
            if (request.Cookies[APP_NAME + ".ab." + goalName] != null)
            {
                if (request.Cookies[APP_NAME + "." + goalName + ".converted"] != null)
                    return;

                string testName = request.Cookies[APP_NAME + ".ab." + goalName].Value;

                int views;
                if (!int.TryParse(request.Cookies[APP_NAME + ".ab." + testName + ".views"].Value, out views))
                {
                    views = 1;
                }

                if (testName != null && testName != "")
                {
                    ABTestConversionClient abtcc = new ABTestConversionClient();
                    abtcc.AddConversion(goalName, testName, weight, views);

                    response.Cookies[APP_NAME + "." + goalName + ".converted"].Value = "1";
                }
            }
            
        }


        /// <summary>
        /// Randomly selects one of the comma delimited view names in configuration file under ABTest%CONTROLLER% variable
        /// </summary>
        /// <param name="controller">Controller passed in as this</param>
        /// <param name="response">HttpResponse to set the cookies :)</param>
        /// <param name="multivariateTestNameSuffix">When additional complex conditions are tested, this will be appended to the test name after Controller name, before the view name, e.g. Home.GreenBannerLead.ModernLayout</param>
        /// <returns>View name to be used by the controller</returns>
        //public string CreateImpression(string multivariateTestNameSuffix, string coupledView)
        //{
        //    if (this.moduleName == null || this.moduleName == "")
        //        throw new Exception("Module name not specified");

        //    string viewName = GetViewName(coupledView);

        //    //if(coupledView!=null && coupledView !="")
        //    //    return viewName;

        //    if (Force || !suppress)
        //    {
        //        string testName;
        //        if (multivariateTestNameSuffix != null && multivariateTestNameSuffix.Trim() != "")
        //            testName = moduleName + "." + viewName + "." + multivariateTestNameSuffix;
        //        else
        //            testName = moduleName + "." + viewName;

        //        IncrementViewCountCookie(testName);

        //        bool skip = false;
        //        if (request != null && request.Cookies[APP_NAME + ".ab." + moduleName] != null && request.Cookies[APP_NAME + ".ab." + moduleName].Value == testName)
        //            skip = true;

        //        if (Force || !skip)
        //        {
        //            if (response != null)
        //                response.Cookies[APP_NAME + ".ab." + moduleName].Value = testName;

        //            ABTestImpressionClient abtic = new ABTestImpressionClient(moduleName);

        //            if (request != null)
        //                abtic.AddImpression(testName, request.UserHostAddress);
        //            else
        //                abtic.AddImpression(testName, "");
        //        }
        //    }

        //    return viewName;
        //}
        private void IncrementViewCountCookie(string testName)
        {
            if (request != null && response != null)
            {
                if (request.Cookies[APP_NAME + ".ab." + testName + ".views"] != null)
                {
                    int views;
                    if (int.TryParse(request.Cookies[APP_NAME + ".ab." + testName + ".views"].Value, out views))
                    {
                        views++;
                        response.Cookies[APP_NAME + ".ab." + testName + ".views"].Value = views.ToString();
                    }
                    else
                    {
                        response.Cookies[APP_NAME + ".ab." + testName + ".views"].Value = "1";
                    }
                }
                else
                {
                    response.Cookies[APP_NAME + ".ab." + testName + ".views"].Value = "1";
                }
            }
        }

        public string GetViewName(string coupledView)
        {
            return GetViewName(coupledView, "");
        }
        public string GetViewName(string coupledView, string defaultView)
        {
            if (coupledView != null && coupledView != "")
                return coupledView;

            //Choose the AB test version of the page
            string[] viewTests;

            try
            {
                viewTests = RoleEnvironment.GetConfigurationSettingValue("ABTest" + moduleName).Split(',');
            }
            catch
            {
                viewTests = new string[] { defaultView };
            }

            string viewName;

            if (coupledView != null && coupledView != "" && viewTests.Contains(coupledView))
                viewName = coupledView;
            else
            {
                int randomIndex = RandomHelper.Instance.Next(0, viewTests.Length);
                viewName = viewTests[randomIndex];
            }
            return viewName;
        }

        public void CreateAutomatedConversion(string goalName, string testName, int weight)
        {
            if (Force)
            {
                if (testName != null && testName != "")
                {
                    ABTestConversionClient abtcc = new ABTestConversionClient();
                    abtcc.AddConversion(goalName, testName, weight, 1);
                }
                
            }
        }
        //public void CreateUserConversion()
        //{
        //    CreateUserConversion(1);
        //}
        //public void CreateUserConversion(int weight)
        //{
        //    if (this.moduleName == null || this.moduleName == "")
        //        throw new Exception("Module name not specified");

        //    if (Force || !suppress)
        //    {
        //        if (request.Cookies[APP_NAME + ".ab." + moduleName] != null)
        //        {
        //            string testName = request.Cookies[APP_NAME + ".ab." + moduleName].Value;

        //            int views;
        //            if (!int.TryParse(request.Cookies[APP_NAME + ".ab." + testName + ".views"].Value, out views))
        //            {
        //                views = 1;
        //            }

        //            if (testName != null && testName != "")
        //            {
        //                ABTestConversionClient abtcc = new ABTestConversionClient(moduleName);
        //                abtcc.AddConversion(testName, weight, views);

        //                response.Cookies[suppressingCookieName].Value = "1";
        //            }
        //        }
        //    }
        //}
        public string GetCurrentTestName(string goalName)
        {
            if (request.Cookies[APP_NAME + ".ab." + goalName] != null)
            {
                string testName = request.Cookies[APP_NAME + ".ab." + goalName].Value;
                if (testName != null && testName != "")
                    return testName;
            }

            return "";
        }
        public void SetAffiliateId(string affiliateid)
        {
            if (affiliateid != null && affiliateid != "")
            {
                if (response != null)
                    response.Cookies[APP_NAME + ".affiliateid"].Value = affiliateid;
            }
        }
        public string GetAffiliateId()
        {
            if (request != null)
            {
                if (request.Cookies[APP_NAME + ".affiliateid"] != null)
                {
                    return request.Cookies[APP_NAME + ".affiliateid"].Value;
                }
            }
            return "";
        }
    }
}