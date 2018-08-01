using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace SkillCowResponsive
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "BlogIndex",
                url: "Blog",
                defaults: new { controller = "Blog", action = "Index" }
            ); 
            routes.MapRoute(
                name: "BlogPages",
                url: "Blog/Page/{page}",
                defaults: new { controller = "Blog", action = "Index", page = UrlParameter.Optional }
            );  
            routes.MapRoute(
                name: "BlogPost",
                url: "Blog/Post/{year}/{month}/{day}/{title}",
                defaults: new { controller = "Blog", action = "Post", year = UrlParameter.Optional, month = UrlParameter.Optional, day = UrlParameter.Optional, title = UrlParameter.Optional }
            );
            routes.MapRoute(
                name: "BlogCategoryPage",
                url: "Blog/Category/{category}/Page/{page}",
                defaults: new { controller = "Blog", action = "Category", category = UrlParameter.Optional, page = UrlParameter.Optional }
            );
            routes.MapRoute(
                name: "BlogCategory",
                url: "Blog/Category/{category}",
                defaults: new { controller = "Blog", action = "Category", category = UrlParameter.Optional }
            );
            routes.MapRoute(
                name: "BlogArchive",
                url: "Blog/Archive/{year}/{month}",
                defaults: new { controller = "Blog", action = "Archive", year = UrlParameter.Optional, month = UrlParameter.Optional }
            );
            routes.MapRoute(
                name: "StudentList",
                url: "Analytics/StudentList/{key}/{value}",
                defaults: new { controller = "Analytics", action = "StudentList", key = UrlParameter.Optional, value = UrlParameter.Optional }
            );
            routes.MapRoute(
                name: "Classification",
                url: "Classification/{major}/{minor}/{category}",
                defaults: new { controller = "Classification", action = "Index", major = UrlParameter.Optional, minor = UrlParameter.Optional, category = UrlParameter.Optional }
            );
            routes.MapRoute(
                name: "Career",
                url: "Career/{Profession}",
                defaults: new { controller = "Career", action = "Index"}
            );
            routes.MapRoute(
                name: "Personality",
                url: "Personality/{Trait}",
                defaults: new { controller = "Personality", action = "Index" }
            );
            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}