using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Xml;

namespace SkillCowResponsive.Classes.Helpers
{
    public static class XmlNodeParsingHelper
    {
        public static string E(this XmlNode node, string name)
        {
            XmlNode e = node.SelectSingleNode(name);
            if (e != null)
            {
                return e.InnerText.ToJSONSafeString();
            }
            else
            {
                return "";
            }
        }
        public static string A(this XmlNode node, string name)
        {
            XmlAttribute srcAttribute = node.Attributes[name];
            if (srcAttribute != null)
            {
                return srcAttribute.Value.ToJSONSafeString();
            }
            else
            {
                return "";
            }
        }
    }
}