using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.IO;

namespace SkillCowResponsive.Classes.Email
{
    public class EmailTemplateHelper
    {
        public string GetTemplate(string name)
        {
            string filepath = System.Web.HttpContext.Current.Server.MapPath("\\content\\emails\\"+name+".htm");
            string content = string.Empty;

            try
            {
                using (var stream = new StreamReader(filepath))
                {
                    content = stream.ReadToEnd();
                }
            }
            catch 
            {
                return "";
            }

            return content;
        }
    }
}