using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using System.Xml;
using System.Text.RegularExpressions;
using SkillCowResponsive.Classes.Encryption;
using System.Security.Cryptography;
using Newtonsoft.Json;
using SkillCowResponsive.Classes.Helpers;
using SkillCowResponsive.Classes.DeferredProcesses;
using System.Text;
using System.Drawing;
using System.Web.Script.Serialization;
using SkillCowResponsive.Classes.Cloud.BlobStorage;
using SkillCowResponsive.Classes.Cloud.TableStorage.UserAccount;

namespace SkillCowResponsive.Controllers
{
    public class SandBoxController : AuthenticatedControllerController
    {
        //
        // GET: /SandBox/

        public ActionResult Index()
        {
            string str = "Administrator, Counselor, Communications Specialist";
            string name = "arts";
            string button = "Take the Test";
            Image img = DrawText(str, name, button);
            byte[] bytes = imageToByteArray(img);
            ViewBag.Bytes = Convert.ToBase64String(bytes);
            return View();
        }
        public ActionResult Quin()
        {
            return View();
        }
        public ActionResult Click()
        {
            return View();
        }
        public ActionResult AdministratorWelcome()
        {
            return View();
        }
        public ActionResult SchoolResults()
        {
            return View();
        }
        public ActionResult GetAllRecords()
        {
            UserAccountClient uac = new UserAccountClient();
            List<UserAccount> users = new List<UserAccount>(uac.GetAll());
            return View();
        }

        private Image DrawText(string text, string baseImageName, string buttonText)
        {
            List<string> lines = new List<string>(text.Split(',').Select(x => x.Trim().ToUpper()));

            
            PictureManager pm = new PictureManager();
            string version = "v1";
            string resource = string.Empty;

            foreach (string line in lines)
            {
                resource += line.ToLower().Substring(0, 4);
            }

            string url = "https://careerthesaurus.blob.core.windows.net/share/" + version + "/" + resource + ".jpg";

            if (pm.BlobExist("share", version, resource + ".jpg" ))
            {
                return null;
            }
            
            string filePath = System.Web.HttpContext.Current.Server.MapPath("\\content\\images\\FBShareBackgrounds\\" + baseImageName + ".jpg");

            if (!System.IO.File.Exists(filePath))
            {
                filePath = System.Web.HttpContext.Current.Server.MapPath("\\content\\images\\FBShareBackgrounds\\business.jpg");
            }

            Image baseImage = (Bitmap)Image.FromFile(filePath);

            Image img = new Bitmap(1200, 630);
            Graphics drawing = Graphics.FromImage(img);

            drawing.DrawImage(baseImage, 0, 0);
            baseImage.Dispose();

            drawing.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.AntiAlias;
            drawing.TextRenderingHint = System.Drawing.Text.TextRenderingHint.AntiAlias;
            int index = 0;
            int offset = 64;

            List<string> output = new List<string>();
            if ((lines[0] + lines[1]).Length <= 25)
            {
                output.Add(lines[0] + ", " + lines[1]);
                output.Add(lines[2]);
            }
            else if ((lines[1] + lines[2]).Length <= 25)
            {
                output.Add(lines[0]);
                output.Add(lines[1] + ", " + lines[2]);
            }
            else
            {
                output.AddRange(lines);
                offset = 0;
            }
            
            Font textFont = new Font("Arial", 64, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Pixel);
            int shadowOffset = 3;
            foreach (string line in output)
            {
                string str = line + (index < output.Count - 1 ? "," : "");
                Image textImage = new Bitmap(1, 1);
                Graphics textGraphics = Graphics.FromImage(textImage);
                int textWidth = (int)textGraphics.MeasureString(str, textFont).Width;
                drawing.DrawString(str, textFont, new SolidBrush(Color.FromArgb(200, 0, 0, 0)), 600 - textWidth / 2 + shadowOffset, index * 72 + 150 + offset + shadowOffset);
                drawing.DrawString(str, textFont, new SolidBrush(Color.White), 600 - textWidth / 2, index * 72 + 150 + offset);
                textImage.Dispose();
                textGraphics.Dispose();
                index++;
            }

            Image buttonImage = new Bitmap(1, 1);
            Graphics buttonGraphics = Graphics.FromImage(buttonImage);
            Font buttonFont = new Font("Arial", 72, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Pixel);
            int buttonTextWidth = (int)buttonGraphics.MeasureString(buttonText, buttonFont).Width;
            int buttonTextHeight = (int)buttonGraphics.MeasureString(buttonText, buttonFont).Height;
            int buttonTopPosition = 450;
            int buttonTextMargin = 20;
            //int buttonBorderWidth = 0;
            drawing.FillRectangle(new SolidBrush(Color.FromArgb(255, 204, 0)), 600 - buttonTextMargin * 2 - buttonTextWidth / 2, buttonTopPosition - buttonTextMargin / 4, buttonTextWidth + buttonTextMargin * 4, buttonTextHeight + buttonTextMargin * 2);
            //drawing.DrawRectangle(new Pen(Color.Black, buttonBorderWidth), new Rectangle(600 - buttonTextMargin - buttonTextWidth / 2, buttonTopPosition, buttonTextWidth + buttonTextMargin * 2, buttonTextHeight + buttonTextMargin * 2));
            drawing.DrawString(buttonText, buttonFont, new SolidBrush(Color.Black), 600 - buttonTextWidth / 2, buttonTopPosition + buttonTextMargin);
            drawing.DrawString("I got:", new Font("Arial", 60, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Pixel), new SolidBrush(Color.FromArgb(200, 0, 0, 0)), 60 + shadowOffset, 60 + shadowOffset);
            drawing.DrawString("I got:", new Font("Arial", 60, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Pixel), new SolidBrush(Color.White), 60, 60);

            buttonImage.Dispose();
            buttonGraphics.Dispose();
            buttonFont.Dispose();

            drawing.Flush();


            //pm.UploadPictureToBlobStorage(img, resource, "share", version, 1200, 630, 50, 50, false, false);

            return img;      
        }

        [HttpPost]
        public JsonResult getShareImageUrl(string text, string baseImageName, string buttonText)
        {
            List<string> lines = new List<string>(text.Split(',').Select(x => x.Trim().ToUpper()));

            PictureManager pm = new PictureManager();
            string version = "v1";
            string resource = string.Empty;

            foreach (string line in lines)
            {
                resource += line.ToLower().Substring(0, 4);
            }

            string url = "https://careerthesaurus.blob.core.windows.net/share/" + version + "/" + resource + ".jpg";

            if (pm.BlobExist("share", version, resource + ".jpg"))
            {
                return new JsonResult { Data = new { result = "ok", url = url } };
            }

            string filePath = System.Web.HttpContext.Current.Server.MapPath("\\content\\images\\FBShareBackgrounds\\" + baseImageName + ".jpg");

            if (!System.IO.File.Exists(filePath))
            {
                filePath = System.Web.HttpContext.Current.Server.MapPath("\\content\\images\\FBShareBackgrounds\\business.jpg");
            }

            Image baseImage = (Bitmap)Image.FromFile(filePath);

            Image img = new Bitmap(1200, 630);
            Graphics drawing = Graphics.FromImage(img);

            drawing.DrawImage(baseImage, 0, 0);
            baseImage.Dispose();

            drawing.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.AntiAlias;
            drawing.TextRenderingHint = System.Drawing.Text.TextRenderingHint.AntiAlias;
            int index = 0;
            int offset = 64;

            List<string> output = new List<string>();

            if (lines.Count > 2)
            {
                if ((lines[0] + lines[1]).Length <= 25)
                {
                    output.Add(lines[0] + ", " + lines[1]);
                    if (lines.Count > 2)
                    {
                        output.Add(lines[2]);
                    }
                }
                else if ((lines[1] + lines[2]).Length <= 25)
                {
                    output.Add(lines[0]);
                    output.Add(lines[1] + ", " + lines[2]);
                }
            }            
            else
            {
                output.AddRange(lines);
                offset = 0;
            }
            Font textFont = new Font("Arial", 64, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Pixel);
            int shadowOffset = 3;
            foreach (string line in output)
            {
                string str = line + (index < output.Count - 1 ? "," : "");
                Image textImage = new Bitmap(1, 1);
                Graphics textGraphics = Graphics.FromImage(textImage);
                int textWidth = (int)textGraphics.MeasureString(str, textFont).Width;
                drawing.DrawString(str, textFont, new SolidBrush(Color.FromArgb(200, 0, 0, 0)), 600 - textWidth / 2 + shadowOffset, index * 72 + 150 + offset + shadowOffset);
                drawing.DrawString(str, textFont, new SolidBrush(Color.White), 600 - textWidth / 2, index * 72 + 150 + offset);
                textImage.Dispose();
                textGraphics.Dispose();
                index++;
            }

            Image buttonImage = new Bitmap(1, 1);
            Graphics buttonGraphics = Graphics.FromImage(buttonImage);
            Font buttonFont = new Font("Arial", 72, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Pixel);
            int buttonTextWidth = (int)buttonGraphics.MeasureString(buttonText, buttonFont).Width;
            int buttonTextHeight = (int)buttonGraphics.MeasureString(buttonText, buttonFont).Height;
            int buttonTopPosition = 450;
            int buttonTextMargin = 20;
            //int buttonBorderWidth = 0;
            drawing.FillRectangle(new SolidBrush(Color.FromArgb(255, 204, 0)), 600 - buttonTextMargin * 2 - buttonTextWidth / 2, buttonTopPosition - buttonTextMargin / 4, buttonTextWidth + buttonTextMargin * 4, buttonTextHeight + buttonTextMargin * 2);
            //drawing.DrawRectangle(new Pen(Color.Black, buttonBorderWidth), new Rectangle(600 - buttonTextMargin - buttonTextWidth / 2, buttonTopPosition, buttonTextWidth + buttonTextMargin * 2, buttonTextHeight + buttonTextMargin * 2));
            drawing.DrawString(buttonText, buttonFont, new SolidBrush(Color.Black), 600 - buttonTextWidth / 2, buttonTopPosition + buttonTextMargin);
            drawing.DrawString("I got:", new Font("Arial", 60, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Pixel), new SolidBrush(Color.FromArgb(200, 0, 0, 0)), 60 + shadowOffset, 60 + shadowOffset);
            drawing.DrawString("I got:", new Font("Arial", 60, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Pixel), new SolidBrush(Color.White), 60, 60);

            buttonImage.Dispose();
            buttonGraphics.Dispose();
            buttonFont.Dispose();

            drawing.Flush();

            pm.UploadPictureToBlobStorage(img, resource + ".jpg", "share", version, 1200, 630, 50, 50, false, false);

            return new JsonResult { Data = new { result = "ok", url = url } };
        }

        public byte[] imageToByteArray(System.Drawing.Image image)
        {
            MemoryStream ms = new MemoryStream();
            image.Save(ms, System.Drawing.Imaging.ImageFormat.Bmp);
            return ms.ToArray();
        }

        [HttpPost]
        public HttpResponse getQuinStreet(string json)
        {
            try
            {
                var httpWebRequest = (HttpWebRequest)WebRequest.Create("http://sl.qmp.quinstreet.com");
                httpWebRequest.ContentType = "text/json";
                httpWebRequest.Method = "POST";
                using (var streamWriter = new StreamWriter(httpWebRequest.GetRequestStream()))
                {
                    streamWriter.Write(json);
                }
                var httpResponse = (HttpWebResponse)httpWebRequest.GetResponse();
                string results;
                using (var streamReader = new StreamReader(httpResponse.GetResponseStream()))
                {
                    results = streamReader.ReadToEnd().Trim();
                }
                Response.ContentType = "application/json";
                Response.Write("{\"result\": \"ok\", \"results\": " + results.Replace("\n", "") + " }");
                Response.End();
            }
            catch (Exception ex)
            {
                Response.ContentType = "application/json";
                Response.Write(DefaultErrorResponse(ex.Message));
                Response.End();
            }

            return null;
        }
        
        [HttpPost]
        public HttpResponse getClickNet(string study, string eduLevel, string degree, string ip)
        {
            try
            {
                string affcamid = "1065353";
                string key = "-ysgbvTaQ6o1";
                string results = GetHttpResponse("http://ads.fcmrktplace.com/controls/v2-xml.aspx?format=json&affcamid=" + affcamid + "&key=" + key + "&clicksnet_campus_location=both&clicksnet_degree=" + degree + "&clicksnet_study=" + study + "&clicksnet_current_education=" + eduLevel + "&subid1=&subid2=&ip=" + ip, null);
                Response.ContentType = "application/json";
                Response.Write("{\"result\": \"ok\", \"results\": " + results.Replace("\n", "") + " }");
                Response.End();
            }
            catch (Exception ex)
            {
                Response.ContentType = "application/json";
                Response.Write(DefaultErrorResponse(ex.Message));
                Response.End();
            }
            return null;
        }

        public HttpResponse crawler(string url)
        {
            try
            {
                string results = GetHttpResponse(url, null);
                List<string> output = new List<string>();
                Regex reg = new Regex(@"(<head\b[^<]*(?:(?!<\/head>)<[^<]*)*<\/head>)|(<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>)|(<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>)");
                results = reg.Replace(results, "");
                Regex linksReg = new Regex(@"(<a\b[^<]*(?:(?!<\/a>)<[^<]*)*<\/a>)");
                List<string> linksList = new List<string>();
                MatchCollection matches = linksReg.Matches(results);
                foreach (Match match in matches)
                {
                    string str = match.ToString();
                    if (str.IndexOf("List Schools") != -1)
                    {
                        string href = Regex.Match(str, @"'([^']*)").ToString();
                        linksList.Add(href.Substring(1));
                    }
                }
                
                foreach (string link in linksList)
                {
                    output.Add(getinfo(link));
                }

                Response.ContentType = "application/json";
                Response.Write(string.Join("", output));
                Response.End();
            }
            catch (Exception ex)
            {
                Response.ContentType = "application/json";
                Response.Write(DefaultErrorResponse(ex.Message));
                Response.End();
            }
            return null;
        }
        public string getinfo(string link)
        {
            string output = string.Empty;
            string schoolurl = "http://education.state.nj.us/directory/";
            string fullurl = schoolurl + link;
            string results = GetHttpResponse(fullurl, null);
            Regex reg = new Regex(@"(<head\b[^<]*(?:(?!<\/head>)<[^<]*)*<\/head>)|(<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>)|(<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>)|(<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>)");
            
            results = reg.Replace(results, "");
            output = results;
            return output;
        }
        public HttpResponse crawlerny(string url)
        {
            try
            {
                string results = GetHttpResponse(url, null);
                results = results.ToLower();
                List<string> output = new List<string>();
                Regex reg = new Regex(@"(<head\b[^<]*(?:(?!<\/head>)<[^<]*)*<\/head>)|(<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>)|(<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>)");
                results = reg.Replace(results, "");
                Regex linksReg = new Regex(@"(<a\b[^<]*(?:(?!<\/a>)<[^<]*)*<\/a>)");
                List<string> linksList = new List<string>();
                MatchCollection matches = linksReg.Matches(results);
                foreach (Match match in matches)
                {
                    string str = match.ToString();
                    int temp1 = str.IndexOf("#");
                    int temp2 = str.IndexOf("@");
                    int temp3 = str.IndexOf("admin");
                    int temp4 = str.IndexOf("home");
                    if (str.IndexOf("#") == -1 && str.IndexOf("@") == -1 && str.IndexOf("admin") == -1 && str.IndexOf("home") == -1 && str.IndexOf("name") == -1)
                    {
                        str = str.Replace('\"', '\'');
                        string href = Regex.Match(str, @"'([^']*)").ToString();
                        if (href != null && href.Length > 1)
                        {
                            linksList.Add(href.Substring(1));
                        }
                        else
                        {
                            string temp = href;
                        }
                    }
                }

                foreach (string link in linksList)
                {
                    output.Add(getinfony(link));
                }

                Response.ContentType = "application/json";
                Response.Write(string.Join("", output));
                Response.End();
            }
            catch (Exception ex)
            {
                Response.ContentType = "application/json";
                Response.Write(DefaultErrorResponse(ex.Message));
                Response.End();
            }
            return null;
        }
        public string getinfony(string link)
        {
            string output = string.Empty;
            string schoolurl = "http://www.nysed.gov/admin/";
            string fullurl = schoolurl + link;
            string results = GetHttpResponse(fullurl, null);
            results = results.ToLower();
            Regex reg = new Regex(@"(<head\b[^<]*(?:(?!<\/head>)<[^<]*)*<\/head>)|(<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>)|(<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>)|(<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>)");
            results = reg.Replace(results, "");
            Regex linksReg = new Regex(@"(<a\b[^<]*(?:(?!<\/a>)<[^<]*)*<\/a>)");
            List<string> linksList = new List<string>();
            MatchCollection matches = linksReg.Matches(results);
            foreach (Match match in matches)
            {
                string str = match.ToString();
                if (str.IndexOf("#") == -1 && str.IndexOf("@") == -1 && str.IndexOf("home") == -1)
                {
                    str = str.Replace('\"', '\'');
                    string href = Regex.Match(str, @"'([^']*)").ToString();
                    linksList.Add(href.Substring(1));
                }
            }
            if (linksList.Count < 10)
            {
                return "";
            }
            string infopage = GetHttpResponse(linksList[0], null);
            infopage = infopage.ToLower();
            Regex h2Reg = new Regex(@"(<h2\b[^<]*(?:(?!<\/h2>)<[^<]*)*<\/h2>)");
            Regex preReg = new Regex(@"(<pre\b[^<]*(?:(?!<\/pre>)<[^<]*)*<\/pre>)");
            string pre = preReg.Match(infopage).ToString();
            string district = "";
            MatchCollection matchesh2 = h2Reg.Matches(infopage);
            foreach (Match match in matchesh2)
            {
                string temp = match.ToString();
                if (temp.IndexOf("district:") != -1) {
                    district = temp;
                }
            }
            output = "<p>---------------------------------------------------------------------------</p>" + "<p>" + district + "</p>" + pre;
            return output;
        }
        [HttpPost]
        public HttpResponse getBlockedImage(string url)
        {
            try
            {
                byte[] bytes;
                using (var webClient = new WebClient())
                {
                    bytes = webClient.DownloadData(url);
                }              
                Response.ContentType = "application/json";
                Response.Write("{\"result\": \"ok\", \"results\": \"" + Convert.ToBase64String(bytes) + "\" }");
                Response.End();
            }
            catch (Exception ex)
            {
                Response.ContentType = "application/json";
                Response.Write(DefaultErrorResponse(ex.Message));
                Response.End();
            }

            return null;
        }
        
    }
}
