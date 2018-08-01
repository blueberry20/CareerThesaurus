using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Helpers;
using Microsoft.WindowsAzure.StorageClient;
using SkillCowResponsive.Classes.Cloud.BlobStorage;
using SkillCowResponsive.Classes.Cloud.TableStorage.BlogPost;
using SkillCowResponsive.Classes.Cloud.TableStorage.BlogCategory;
using SkillCowResponsive.Classes.Cloud.TableStorage.BlogTag;
using System.Text.RegularExpressions;

namespace SkillCowResponsive.Controllers
{
    public class BlogController : AuthenticatedControllerController
    {
        //
        // GET: /Blog/

        public ActionResult Index(string page)
        {
            BlogPostClient bpc = new BlogPostClient();
            List<BlogPost> postsList = new List<BlogPost>(bpc.GetAllPublicAndNotRemoved());
            postsList.Sort((a, b) => DateTime.Compare(b.Date, a.Date));
            int pages = Convert.ToInt32(Math.Ceiling((double)postsList.Count / 10));
            int currentPageNumber = 1;
            int skip = 0;
            if (page != null)
            {
                if (!Regex.IsMatch(page, @"^\d+$"))
                {
                    return RedirectToAction("Index");
                }
                currentPageNumber = Convert.ToInt32(page);
                skip = (currentPageNumber - 1) * 10;
            }
            ViewBag.Pages = pages;
            ViewBag.CurrentPage = currentPageNumber;
            List<BlogPost> currentPage = postsList.Skip(skip).Take(10).ToList();
            if (currentPage.Count == 0)
            {               
                return RedirectToAction("Index");
            }
            ViewBag.Articles = currentPage;
            return View(); 
        }
        public ActionResult Post(string year, string month, string day, string title)
        {
            if (year != null && month != null && day != null && title != null)
            {
                BlogPostClient bpc = new BlogPostClient();
                string rowkey = year + month + day + title;
                BlogPost post = bpc.GetByPartitionAndRowKey("blogPost", rowkey.ToLower());
                if (post != null && post.Removed == false) // && post.Public == true && post.Removed == false)
                {
                    ViewBag.PostTitle = post.Title;
                    ViewBag.HeaderImage = post.HeaderImageCode;
                    ViewBag.Category = post.Category;
                    post.Tags = post.Tags != null ? post.Tags : "";
                    ViewBag.Tags = post.Tags.Split(',');
                    ViewBag.Path = rowkey.ToLower();
                    ViewBag.Url = post.Date.ToString("yyyy/MM/dd/") + Regex.Replace(post.Title.ToLower(), @"[^a-zA-z0-9]+", "-");
                    ViewBag.Date = monthName(month) + " " + day + ", " + year;
                    ViewBag.ArticleDescription = post.ArticleDescription;
                    string text = post.Article1 + post.Article2 + post.Article3 + post.Article4;
                    ViewBag.Article = text.Replace("\n", "").Replace("\r", "");                    
                    return View();
                }
            }
            return RedirectToAction("Index");
        }
        private string monthName(string month)
        {
            switch (month)
            {
                case "01":
                    return "January";
                case "02":
                    return "February";
                case "03":
                    return "March";
                case "04":
                    return "April";
                case "05":
                    return "May";
                case "06":
                    return "June";
                case "07":
                    return "July";
                case "08":
                    return "August";
                case "09":
                    return "Septemper";
                case "10":
                    return "October";
                case "11":
                    return "November";
                case "12":
                    return "December";
                default:
                    return month;
            }
        }
        public ActionResult Admin()
        {
            return View();
        }
        public ActionResult Articles()
        {
            return View();
        }
        public ActionResult Article()
        {
            return View();
        }
        [HttpGet]
        public ActionResult Edit(string id)
        {
            PictureManager pm = new PictureManager();
            if (AuthTokens == null || AuthTokens[3] != "su")
            {
                return RedirectToAction("Index", "Home");
            }
            if (id == null || id == "")
            {
                return RedirectToAction("Admin");
            }
            BlogPostClient bpc = new BlogPostClient();
            string rowkey = id;
            BlogPost post = bpc.GetByPartitionAndRowKey("blogPost", rowkey);
            if (post != null) // && post.Public == true && post.Removed == false)
            {
                ViewBag.RowKey = post.RowKey;
                ViewBag.PostTitle = post.Title;
                ViewBag.Category = post.Category;
                ViewBag.Path = rowkey;
                ViewBag.Author = post.Author;
                ViewBag.HeaderImageCode = post.HeaderImageCode;
                ViewBag.Tags = post.Tags.Split(',');
                ViewBag.Url = post.Date.ToString("yyyy/MM/dd/") + Regex.Replace(post.Title.ToLower(), @"[^a-zA-z0-9]+", "-");
                ViewBag.Date = post.Date.ToString("MMMMMMMMM dd, yyyy");
                string text = post.Article1 + post.Article2 + post.Article3 + post.Article4;
                ViewBag.ArticleDescription = post.ArticleDescription;
                ViewBag.Article = text.Replace("\n", "").Replace("\r", "");
                ViewBag.Images = pm.ListBlobsSegmented("blog", rowkey).Select(x => x.Uri.Segments.Last()).Where(x => !x.Contains("_t") && x != post.HeaderImageCode.Substring(2, 4));
                return View();
            }
            return RedirectToAction("Admin");
        }
        [HttpPost]
        [ValidateInput(false)]
        public ActionResult Edit(string inputTitle, string tags, string text, string rowkey, string articledescription, HttpPostedFileBase headerImage, IEnumerable<HttpPostedFileBase> inputFile, IEnumerable<string> inputCode)
        {
            if (AuthTokens == null || AuthTokens[3] != "su")
            {
                return RedirectToAction("Index", "Home");
            }
            BlogPostClient bpc = new BlogPostClient();
            BlogTagClient btc = new BlogTagClient();
            BlogPost blogPost = bpc.GetByPartitionAndRowKey("blogPost", rowkey);
            if (blogPost != null)
            {
                string article1 = "";
                string article2 = "";
                string article3 = "";
                string article4 = "";
                if (text.Length <= 32500)
                {
                    article1 = text;
                }
                else if (text.Length > 32500 && text.Length <= 65000)
                {
                    article1 = text.Substring(0, 32500);
                    article2 = text.Substring(32500);
                }
                else if (text.Length > 65000 && text.Length <= 97500)
                {
                    article1 = text.Substring(0, 32500);
                    article2 = text.Substring(32500, 32500);
                    article3 = text.Substring(65000);
                }
                else if (text.Length > 97500 && text.Length <= 130000)
                {
                    article1 = text.Substring(0, 32500);
                    article2 = text.Substring(32500, 32500);
                    article3 = text.Substring(65000, 32500);
                    article4 = text.Substring(97500);
                }
                else
                {
                    ViewBag.Error = "Article too long";
                    return View();
                }
                blogPost.Article1 = article1;
                blogPost.Article2 = article2;
                blogPost.Article3 = article3;
                blogPost.Article4 = article4;
                blogPost.Title = inputTitle;
                blogPost.ArticleDescription = articledescription;
                List<string> currentTagList = blogPost.Tags.Split(',').ToList();
                List<string> newTagList = tags.Split(',').ToList();
                foreach (string tag in currentTagList)
                {
                    if (!newTagList.Contains(tag))
                    {
                        BlogTag blogTag = btc.GetByPartitionAndRowKey("blogTag", tag);
                        if (blogTag != null)
                        {
                            blogTag.PublicPosts--;
                            btc.Update(blogTag);
                        }
                    }
                }
                foreach (string tag in newTagList)
                {
                    if (!currentTagList.Contains(tag))
                    {
                        BlogTag blogTag = btc.GetByPartitionAndRowKey("blogTag", tag);
                        if (blogTag != null)
                        {
                            blogTag.PublicPosts++;
                            btc.Update(blogTag);
                        }
                    }
                }
                blogPost.Tags = tags.ToLower();
                bpc.Update(blogPost);
                PictureManager pm = new PictureManager();
                if (headerImage != null)
                {
                    WebImage image = new WebImage(headerImage.InputStream);
                    var b = pm.UploadPictureToBlobStorage(image, blogPost.HeaderImageCode.Substring(2, 4), "blog", rowkey, 960, 960, 50, 50, false, false);
                }
                if (inputFile != null)
                {
                    List<HttpPostedFileBase> files = inputFile.ToList();
                    List<string> codes = inputCode.ToList();
                    for (var i = 0; i < files.Count; i++)
                    {
                        if (files[i] != null)
                        {
                            WebImage image = new WebImage(files[i].InputStream);
                            pm.UploadPictureToBlobStorage(image, codes[i].Substring(2, 4), "blog", rowkey, 960, 960, 50, 50, false, false);
                        }
                    }
                }
            }
            return RedirectToAction("Admin");
        }
        [HttpGet]
        public ActionResult NewArticle()
        {
            if (AuthTokens == null || AuthTokens[3] != "su")
            {
                return RedirectToAction("Index", "Home");
            }
            return View();
        }
        [HttpPost]
        [ValidateInput(false)]
        public ActionResult NewArticle(HttpPostedFileBase headerImage, string headerCode, IEnumerable<HttpPostedFileBase> inputFile, IEnumerable<string> inputCode, string inputTitle, string category, string tags, string text, string articleDescription, string author, string makepublic)
        {
            if (AuthTokens == null || AuthTokens[3] != "su")
            {
                return RedirectToAction("Index", "Home");
            }
            headerCode = headerCode == null ? "" : headerCode;
            category = category == null ? "" : category;
            BlogCategoryClient bcc = new BlogCategoryClient();
            BlogPostClient bpc = new BlogPostClient();
            BlogTagClient btc = new BlogTagClient();
            string article1 = "";
            string article2 = "";
            string article3 = "";
            string article4 = "";
            if (text.Length <= 32500)
            {
                article1 = text;
            }
            else if (text.Length > 32500 && text.Length <= 65000)
            {
                article1 = text.Substring(0, 32500);
                article2 = text.Substring(32500);
            }
            else if (text.Length > 65000 && text.Length <= 97500)
            {
                article1 = text.Substring(0, 32500);
                article2 = text.Substring(32500, 32500);
                article3 = text.Substring(65000);
            }
            else if (text.Length > 97500 && text.Length <= 130000)
            {
                article1 = text.Substring(0, 32500);
                article2 = text.Substring(32500, 32500);
                article3 = text.Substring(65000, 32500);
                article4 = text.Substring(97500);
            } else {
                ViewBag.Error = "Article too long";
                return View();
            }
            string patt = @"yyyyMMdd";
            string rowkey = DateTime.UtcNow.ToString(patt) + Regex.Replace(inputTitle.ToLower(), @"[^a-zA-z0-9]+", "-");
            bpc.AddNewItem(new BlogPost { Author = author, Category = category.ToLower(), Title = inputTitle, HeaderImageCode = headerCode, Public = (makepublic != null), Removed = false, Date = DateTime.UtcNow, Article1 = article1, Article2 = article2, Article3 = article3, Article4 = article4, ArticleDescription = articleDescription, Tags = tags.ToLower(), RowKey = rowkey });            
            List<string> tagsList = tags.Split(',').ToList();
            List<BlogTag> blogTags = new List<BlogTag>();
            foreach (string tag in tagsList)
            {
                BlogTag blogTag = btc.GetByPartitionAndRowKey("blogTag", tag);
                if (blogTag != null)
                {
                    blogTag.TotalPosts++;
                    blogTag.PublicPosts++;
                    btc.Update(blogTag);
                }
                else
                {
                    btc.AddNewItem(new BlogTag { RowKey = tag, TotalPosts = 1, PublicPosts = 1 });
                }
            }
            //BlogCategory categoryToUpdate = bcc.GetByPartitionAndRowKey("blogCategory", category.ToLower());
            //categoryToUpdate.TotalPosts++;
            //bcc.Update(categoryToUpdate);
            PictureManager pm = new PictureManager();
            if (headerImage != null && headerCode != "")
            {
                WebImage image = new WebImage(headerImage.InputStream);
                pm.UploadPictureToBlobStorage(image, headerCode.Substring(2, 4), "blog", rowkey, 960, 960, 50, 50, false, false);
            }
            List<HttpPostedFileBase> files = inputFile.ToList();
            List<string> codes = inputCode.ToList();
            for (var i = 0; i < files.Count; i++)
            {
                if (files[i] != null)
                {
                    WebImage image = new WebImage(files[i].InputStream);
                    pm.UploadPictureToBlobStorage(image, codes[i].Substring(2, 4), "blog", rowkey, 960, 960, 50, 50, false, false);
                }
            }
            return View();
        }
        public ActionResult Category(string category, string page)
        {
            BlogPostClient bpc = new BlogPostClient();
            List<BlogPost> postsList = new List<BlogPost>(bpc.GetAllForCategory(category.ToLower()));
            postsList.Sort((a, b) => DateTime.Compare(b.Date, a.Date));
            if (postsList.Count == 0)
            {
                ViewBag.Articles = null;
            }
            else
            {
                int pages = Convert.ToInt32(Math.Ceiling((double)postsList.Count / 10));
                int currentPageNumber = 1;
                int skip = 0;
                if (page != null)
                {
                    if (!Regex.IsMatch(page, @"^\d+$"))
                    {
                        return RedirectToAction("Index");
                    }
                    currentPageNumber = Convert.ToInt32(page);
                    skip = (currentPageNumber - 1) * 10;
                }
                ViewBag.Pages = pages;
                ViewBag.CurrentPage = currentPageNumber;
                List<BlogPost> currentPage = postsList.Skip(skip).Take(10).ToList();
                if (currentPage.Count == 0)
                {
                    return RedirectToAction("Index");
                }
                ViewBag.Category = category;
                ViewBag.Articles = currentPage;
            }
            return View();
        }
        public ActionResult Tag(string tag, string page)
        {
            BlogPostClient bpc = new BlogPostClient();
            List<BlogPost> postsList = new List<BlogPost>(bpc.GetAllForTag(tag.ToLower()));
            postsList.Sort((a, b) => DateTime.Compare(b.Date, a.Date));
            if (postsList.Count == 0)
            {
                ViewBag.Articles = null;
            }
            else
            {
                int pages = Convert.ToInt32(Math.Ceiling((double)postsList.Count / 10));
                int currentPageNumber = 1;
                int skip = 0;
                if (page != null)
                {
                    if (!Regex.IsMatch(page, @"^\d+$"))
                    {
                        return RedirectToAction("Index");
                    }
                    currentPageNumber = Convert.ToInt32(page);
                    skip = (currentPageNumber - 1) * 10;
                }
                ViewBag.Pages = pages;
                ViewBag.CurrentPage = currentPageNumber;
                List<BlogPost> currentPage = postsList.Skip(skip).Take(10).ToList();
                if (currentPage.Count == 0)
                {
                    return RedirectToAction("Index");
                }
                ViewBag.Tag = tag;
                ViewBag.Articles = currentPage;
            }
            return View();
        }
        public ActionResult Archive(string year, string month)
        {
            BlogPostClient bpc = new BlogPostClient();
            if (!Regex.IsMatch(year, @"^\d{4}$") || !Regex.IsMatch(month, @"^\d{2}$"))
            {
                return RedirectToAction("Index");
            }
            DateTime date = Convert.ToDateTime(month + "/" + year);
            List<BlogPost> postsList = new List<BlogPost>(bpc.GetAllFromArchive(date));
            postsList.Sort((a, b) => DateTime.Compare(b.Date, a.Date));
            if (postsList.Count == 0)
            {
                ViewBag.Articles = null;
            }
            else
            {
                ViewBag.Year = year;
                ViewBag.Month = monthName(month);
                ViewBag.Articles = postsList;
            }
            return View();
        }
        
        [HttpPost]
        public HttpResponse newcategory(string newcategory)
        {
            string result = "";
            BlogCategoryClient bcc = new BlogCategoryClient();
            BlogCategory category = bcc.GetByPartitionAndRowKey("blogCategory", newcategory.ToLower());
            if (category == null)
            {
                bcc.AddNewItem(new BlogCategory { RowKey = newcategory.ToLower(), Category = newcategory, PublicPosts = 0, TotalPosts = 0 });
                result = "ok";
            }
            else
            {
                result = "exist";
            }
            Response.ContentType = "application/json";
            Response.Write("{\"result\": \"" + result + "\"}");
            Response.End();
            return null;
        }
        [HttpPost]
        public HttpResponse newtag(string tag)
        {
            string result = "";
            BlogTagClient btc = new BlogTagClient();
            BlogTag blogTag = btc.GetByPartitionAndRowKey("blogTag", tag.ToLower());
            if (blogTag == null)
            {
                btc.AddNewItem(new BlogTag { RowKey = tag.ToLower().Replace(" ", "-"), Tag = tag.ToLower(), PublicPosts = 0, TotalPosts = 0 });
                result = "ok";
            }
            else
            {
                result = "exist";
            }
            Response.ContentType = "application/json";
            Response.Write("{\"result\": \"" + result + "\"}");
            Response.End();
            return null;
        }
        [HttpPost]
        public JsonResult togglePost(string rowkey)
        {
            BlogPostClient bpc = new BlogPostClient();
            BlogTagClient btc = new BlogTagClient();
            BlogPost blogPost = bpc.GetByPartitionAndRowKey("blogPost", rowkey);
            if (blogPost != null)
            {
                blogPost.Removed = !blogPost.Removed;
                bpc.Update(blogPost);
                List<string> tags = new List<string>(blogPost.Tags.Split(','));
                foreach (string tag in tags)
                {
                    BlogTag blogTag = btc.GetByPartitionAndRowKey("blogTag", tag);
                    if (blogTag != null)
                    {
                        if (blogPost.Removed)
                        {
                            blogTag.PublicPosts--;
                        }
                        else
                        {
                            blogTag.PublicPosts++;
                        }
                        btc.Update(blogTag);
                    }
                }
            }
            return new JsonResult { Data = new { result = "ok" } };
        }
        [HttpPost]
        public JsonResult deleteImage(string resource, string dir)
        {
            PictureManager pm = new PictureManager();
            bool deleted = pm.DeletePicture(resource, "blog", dir);

            return new JsonResult { Data = new { result = deleted ? "ok" : "error" } };
        }
        private void deleteCategories()
        {
            BlogCategoryClient bcc = new BlogCategoryClient();
            BlogPostClient bpc = new BlogPostClient();
            //bcc.DeleteTable();
            //bpc.DeleteTable();
        }
    }
}
