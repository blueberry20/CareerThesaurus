using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MvcWebRole1
{
    public class MyViewEngine : RazorViewEngine
    {

        private static string[] NewPartialViewFormats = new[] { 
            "~/Views/{1}/Partial/{0}.cshtml",
            "~/Views/Shared/Partial/{0}.cshtml"
        };

        public MyViewEngine()
        {
            base.PartialViewLocationFormats = base.PartialViewLocationFormats.Union(NewPartialViewFormats).ToArray();

        }

    }
}