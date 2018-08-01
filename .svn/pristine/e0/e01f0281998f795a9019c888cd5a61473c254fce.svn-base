using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Net;
using System.IO;
using SkillCow.Classes.Helpers;
using Newtonsoft.Json.Linq;

namespace SkillCow.Controllers
{
    public class TVController : ControllerBase
    {
        //
        // GET: /TvPresentation/

        public ActionResult Index()
        {
            return View("andrey");
            
        }

        public ActionResult Andrey()
        {
            return View();
        }
        public ActionResult ImageMap()
        {
            return View();
        }

        public ActionResult IndeedSources()
        {
            string[] keywords = new string[] { "customer service","accountant","certified nursing assistant","delivery driver","financial analyst","graphic designer",
            "human resources assistant","generalist","manager","laborer","project manager","welder","electrician","licensed practical nurse","maintenance technician",
            "assembler","product manager","medical assistant","nurse practitioner","part time","pharmacy technician","receptionist","registered nurse","teacher","truck driver"};
            string[] zips = new string[] {"79936","90011","60629","90650","90201","77084","92335","78521","77449","78572","90250","90280","11226","90805","91331","8701",
            "90044","92336","926","94565","10467","92683","75052","91342","92704","30044","10025","92503","92804","78577","75217","92376","93307","10456","10002","91911",
            "91744","75070","77036","93722","92345","60618","93033","93550","95076","11230","11368","37013","11373","79912","37211","30043","11206","10453","92154",
            "11355","95823","77479","91706","10458","92553","90706","23464","11212","60617","91709","11214","11219","91910","22193","77429","93535","66062","93257",
            "30349","60647","77584","10452","77573","11377","11207","77494","75211","11234","28269","11235","94544","10029","60625","89110","92509","77083","91335",
            "85364","87121","10468","90255","93065","91710","10462"};

            int cnt = 0;

            using (StreamWriter sw = new StreamWriter(@"c:\chaindate\skillcow\indeedsources_employers_clientname.csv"))
            {
                foreach (string zip in zips)
                {
                    foreach (string kw in keywords)
                    {
                        string ipaddress = RandomHelper.Instance.Next(1, 256) + "." + RandomHelper.Instance.Next(0, 256) + "." + RandomHelper.Instance.Next(0, 256) + "." + RandomHelper.Instance.Next(1, 256);
                        string results = GetHttpResponse("http://api.indeed.com/ads/apisearch?publisher=9956090887151436&q=" + HttpUtility.HtmlEncode(kw.ToLower().Replace(" ", "+").Replace("/", "+")) +
                            "&format=json" +
                            "&l=" + HttpUtility.HtmlEncode(zip) +
                            "&sort=date&radius=25&st=employer&jt=&start=0&limit=50&fromage=&filter=&latlong=1&co=us&chnl=13564694&userip=" + ipaddress +
                            "&useragent=" + HttpUtility.HtmlEncode(Request.UserAgent.ToString()) + "&v=2", null);

                        JObject json = null;
                        try
                        {
                            json = JObject.Parse(results);

                            for (int i = 0; i < json["results"].Count(); i++)
                            {
                                
                                sw.WriteLine("\"" + json["results"][i]["source"] + "\"," + json["results"][i]["sponsored"] + ",\"" + json["results"][i]["company"] + "\"");
                                cnt++;
                                
                            }
                        }
                        catch
                        {
                        }
                    }
                }
            }

            return View();
            
        }
        protected string GetHttpResponse(string requestUrl, byte[] data)
        {
            // declare objects
            string responseData = String.Empty;
            HttpWebRequest req = null;
            HttpWebResponse resp = null;
            StreamReader strmReader = null;

            try
            {
                req = (HttpWebRequest)HttpWebRequest.Create(requestUrl);

                // in case of POST you need to post data
                if ((data != null) && (data.Length > 0))
                {
                    using (Stream strm = req.GetRequestStream())
                    {
                        strm.Write(data, 0, data.Length);
                    }
                }

                resp = (HttpWebResponse)req.GetResponse();
                strmReader = new StreamReader(resp.GetResponseStream());
                responseData = strmReader.ReadToEnd().Trim();
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
            finally
            {
                if (req != null)
                {
                    req = null;
                }

                if (resp != null)
                {
                    resp.Close();
                    resp = null;
                }
            }

            return responseData;
        }
    }
}
