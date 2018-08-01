using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Text;
using System.Net;
using System.IO;

using SkillCowResponsive.Classes.Cloud.TableStorage.PersonalityTests.Tests.SkillAssessment;
using SkillCowResponsive.Classes.Cloud.TableStorage.PersonalityTests.CBNProfessions;
using SkillCowResponsive.Classes.Cloud.BlobStorage;
using SkillCowResponsive.Classes.Helpers;
using SkillCowResponsive.Classes.Cloud.TableStorage.PersonalityTests.CBNSchoolForms;
using System.Xml;
using SkillCowResponsive.Classes;

namespace SkillCowResponsive.Classes
{
    

    public class SchoolFormParser
    {
        private Dictionary<string, List<object>> controlEvents = new Dictionary<string, List<object>>();
        public string ConvertFormsXmlToJson(string clientid, string formid)
        {
            #region Download XML
            string id = "1727";
            string url = "http://www.explore-schools.com/xmlformfeed2.php?id=" + id + "&form_id=" + formid + "&v=5&g=y&s=y&f=y&p=y&hc=y";

            string xml;

            try
            {
                xml = GetHttpResponse(url, null);

                if (xml.Contains("a<?xml"))
                {
                    xml = xml.Replace("a<?xml", "<?xml");
                }
            }
            catch (Exception ex)
            {
                throw new Exception("ConvertFormsXmlToJson error 1: " + ex.Message);
            }

            try
            {
                xml = xml.Replace("<?xml version=\"1.0\" encoding=\"UTF-8\"?>", "");
                xml = xml.Replace("<?xml version=\"1.0\" encoding=\"ISO-8859-1\"?>", "");
            }
            catch (Exception ex)
            {
                throw new Exception("ConvertFormsXmlToJson error 2: " + ex.Message);
            }
            
            XmlDocument xmldoc = new XmlDocument();

            byte[] byteArray = new byte[xml.Length];
            System.Text.ASCIIEncoding encoding = new System.Text.ASCIIEncoding();

            try
            {
                byteArray = encoding.GetBytes(xml);
            }
            catch (Exception ex)
            {
                throw new Exception("ConvertFormsXmlToJson error 3: " + ex.Message);
            }
            
            // Load the memory stream
            MemoryStream memoryStream = new MemoryStream(byteArray);

            try
            {
                memoryStream.Seek(0, SeekOrigin.Begin);
                xmldoc.Load(memoryStream);

            }
            catch (Exception ex)
            {
                throw new Exception("ConvertFormsXmlToJson error 4:\n\n" + xml);
            }
            #endregion

            #region LOGO url
            string logourl = "";
            try
            {
                XmlNode imageNode = xmldoc.SelectSingleNode("//form/image");
                if (imageNode != null)
                {
                    XmlAttribute srcAttribute = imageNode.Attributes["src"];
                    if (srcAttribute != null)
                    {
                        logourl = srcAttribute.Value;
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("ConvertFormsXmlToJson error 5: " + ex.Message);
            }
            #endregion

            XmlNode formfieldsnode;
            try
            {
                formfieldsnode = xmldoc.SelectSingleNode("//form/formfields");
            }
            catch (Exception ex)
            {
                throw new Exception("ConvertFormsXmlToJson error 6: " + ex.Message);
            }
                        
            XmlNodeList inputs = null;
            try
            {
                if (formfieldsnode != null)
                {
                    inputs = xmldoc.GetElementsByTagName("input");
                }
            }
            catch (Exception ex)
            {
                throw new Exception("ConvertFormsXmlToJson error 7: " + ex.Message);
            }
            

            XmlNode filtersnode;
            try
            {
                filtersnode = xmldoc.SelectSingleNode("//form/filters");
            }
            catch (Exception ex)
            {
                throw new Exception("ConvertFormsXmlToJson error 8: " + ex.Message);
            }

            
            XmlNodeList filters = null;
            try
            {
                if (filtersnode != null)
                {
                    filters = xmldoc.GetElementsByTagName("filter");
                    if (filters.Count == 0 && xml.Contains("<rule>"))
                    {
                        Console.Write("no filters");
                    }
                    if (filters.Count > 0)
                    {
                        Console.Write("has filters!");
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("ConvertFormsXmlToJson error 9: " + ex.Message);
            }


            

            List<object> fieldsList, filtersList, controleventsList;

            try
            {
                fieldsList = processFormFields(inputs);
            }
            catch (Exception ex)
            {
                throw new Exception("ConvertFormsXmlToJson error 10: " + ex.Message);
            }

            try
            {
                filtersList = processFilters(filters);
            }
            catch (Exception ex)
            {
                throw new Exception("ConvertFormsXmlToJson error 11: " + ex.Message);
            }

            try
            {
                controleventsList = getControlEvents();
            }
            catch (Exception ex)
            {
                throw new Exception("ConvertFormsXmlToJson error 12: " + ex.Message);
            }

            object resultObject;
            try
            {
                resultObject = (new { result = "ok", clientid = clientid, formid = formid, logourl = logourl, fields = fieldsList.ToArray(), filters = filtersList.ToArray(), controlevents = controleventsList.ToArray(), reflection = "reflection.code" });
            }
            catch (Exception ex)
            {
                throw new Exception("ConvertFormsXmlToJson error 13: " + ex.Message);
            }
            
            string result = "";
            try
            {
                result = resultObject.ToJSON();
            }
            catch (Exception ex)
            {
                throw new Exception("ConvertFormsXmlToJson error 14: " + ex.Message);
            }
            
            return result;
        }

        private List<object> getControlEvents()
        {
            List<object> results = new List<object>();

            foreach (KeyValuePair<string, List<object>> kv in controlEvents)
            {
                results.Add(new { control = kv.Key, events = kv.Value });
            }

            return results;
        }

        private List<object> processFormFields(XmlNodeList items)
        {
            List<object> results = new List<object>();

            int cnt = 0;
            foreach (XmlNode node in items)
            {
                cnt++;
                switch (node.A("type"))
                {
                    case "hidden":
                        results.Add(createInputHidden(node));
                        break;
                    case "text":
                        results.Add(createInputText(node));
                        break;
                    case "dropdown":
                        if (node.SelectSingleNode("fieldgroup") != null && node.SelectSingleNode("fieldgroup").A("label") != null && node.SelectSingleNode("fieldgroup").A("label") != "")
                        {
                            var fg = createFieldGroup(node.SelectSingleNode("fieldgroup").A("label"), items);
                            if (fg != null)
                                results.Add(fg);
                        }
                        else
                        {
                            results.Add(createInputDropDown(node));
                        }
                        break;
                    case "radio":
                        if (node.SelectSingleNode("fieldgroup") != null && node.SelectSingleNode("fieldgroup").A("label") != null && node.SelectSingleNode("fieldgroup").A("label") != "")
                        {
                            var rg = createFieldGroup(node.SelectSingleNode("fieldgroup").A("label"), items);
                            if (rg != null)
                                results.Add(rg);
                        }
                        else
                        {
                            results.Add(createInputGeneric(node));
                        }
                        break;
                    case "checkbox":
                        results.Add(createInputCheckbox(node));
                        break;
                    case "textarea":
                        results.Add(createInputTextArea(node));
                        break;
                    default:
                        break;
                }
            }

            return results;
        }

        private List<object> processFilters(XmlNodeList filterNodes)
        {
            List<object> filters = new List<object>();

            foreach (XmlNode filterNode in filterNodes)
            {
                
                XmlNodeList ruleNodes = filterNode.SelectNodes("rule");


                List<object> rules = new List<object>();
                foreach (XmlNode ruleNode in ruleNodes)
                {
                    XmlNodeList lineNodes = ruleNode.SelectNodes("line");

                    List<object> lines = new List<object>();
                    foreach (XmlNode lineNode in lineNodes)
                    {
                        string fieldname = "";
                        string op = "";
                        List<string> values = new List<string>();

                        string lineValue = lineNode.InnerText;
                        string[] lineTokens;

                        if (lineValue.Contains("!="))
                        {
                            op = "neq";
                            lineTokens = lineValue.Replace("!=","=").Split('=');
                        }
                        else
                        {
                            op = "eq";
                            lineTokens = lineValue.Split("=".ToCharArray());
                        }

                        if (lineTokens.Length == 2)
                        {
                            fieldname = lineTokens[0];

                            string lineTokens2 = lineTokens[1].Replace("||", "|");
                            string[] valueTokens = lineTokens2.Split('|');

                            lines.Add(new { type = "line", fieldname = fieldname, op = op, values = valueTokens });    
                        }
                        
                    }

                    rules.Add(new { type = "rule", lines = lines.ToArray() });
                }

                filters.Add(new { type="filter",  rules = rules.ToArray() });
            }

            return filters;
        }

        List<string> processedFieldGroups = new List<string>();
        private object createFieldGroup(string label, XmlNodeList nodes)
        {
            if (processedFieldGroups.Contains(label))
                return null;

            string targetCssClass = "c" + ShortGuidGenerator.NewGuid();

            List<object> options = new List<object>();

            string hidingrule = "";
            bool required = false;
            string groupname = targetCssClass;

            int cnt = 0;
            foreach (XmlNode node in nodes)
            {
                if (node.SelectSingleNode("fieldgroup") != null && node.SelectSingleNode("fieldgroup").A("label") != null && node.SelectSingleNode("fieldgroup").A("label") == label)
                {
                    if (cnt++ == 0)
                    {
                        XmlNode hidingNode = node.SelectSingleNode("hiding");
                        if (hidingNode != null)
                        {
                            XmlNode conditions = hidingNode.SelectSingleNode("conditions");

                            if (conditions != null)
                            {
                                XmlNode ruleNode = conditions.SelectSingleNode("rule");

                                if (ruleNode != null)
                                {
                                    hidingrule = ruleNode.InnerText;

                                    string controlname = "";
                                    string oper = "";
                                    string value = "";

                                    if (hidingrule.Contains("!="))
                                    {
                                        oper = "!=";
                                        string[] tokens = hidingrule.Split(oper.ToCharArray());
                                        controlname = tokens[0];
                                        value = tokens[2];
                                    }
                                    else
                                    {
                                        oper = "=";
                                        string[] tokens = hidingrule.Split(oper.ToCharArray());
                                        controlname = tokens[0];
                                        value = tokens[1];
                                        oper = "==";
                                        if (value.Contains("||"))
                                        {
                                            oper = "in";
                                        }
                                    }

                                    addControlEvent(controlname, oper, value, targetCssClass, "show", "hide");
                                }
                            }
                        }
                    }

                    if (node.E("required") == "true")
                    {
                        required = true;
                    }
                    if (node.E("name")=="dobyear")
                    {
                        groupname = "dob";
                    }

                    if (node.A("type") == "dropdown")
                    {
                        options.Add(createInputDropDown(node));
                    }
                    else
                    {
                        options.Add(createInputGeneric(node));
                    }
                }
            }
            processedFieldGroups.Add(label);
            return new { type = "fieldgroup", name = groupname, cssclass = targetCssClass, label = label, required = required, options = options.ToArray() };
        }

        private object createInputHidden(XmlNode x) { return new { type = "hidden", name = x.E("name"), value = x.E("value") }; }
        private object createInputRadio(XmlNode x) { return new { type = "radio", label = x.E("label"), name = x.E("name"), value = x.E("value"), selected = x.E("checked"), required = x.E("required"), fieldgroup = x.E("fieldgroup") }; }


        private object createInputGeneric(XmlNode x)
        {
            if (x.E("validation") != "")
            {
                addValidationEvent(x.E("name"), x.E("validation"));
            }
            return new { type = x.A("type"), label = x.E("label"), name = x.E("name"), value = x.E("value"), required = x.E("required"), selected = x.E("checked") };
        }

        private object createInputCheckbox(XmlNode x)
        {
            if (x.E("validation") != "")
            {
                addValidationEvent(x.E("name"), x.E("validation"));
            }
            return new { type = "checkbox", label = x.E("label"), name = x.E("name"), value = x.E("value"), required = x.E("required"), selected = x.E("checked") };
        }
        private object createInputText(XmlNode x)
        {
            if (x.E("validation") != "")
            {
                addValidationEvent(x.E("name"), x.E("validation"));
            }
            return new { type = "text", label = x.E("label"), name = x.E("name"), value = x.E("value"), required = x.E("required") };
        }

        private object createInputTextArea(XmlNode x) { return new { type = "textarea", label = x.E("label"), name = x.E("name"), value = x.E("value"), mincharactercount = x.E("mincharactercount"), required = x.E("required") }; }

        private object createInputDropDown(XmlNode x)
        {
            return new { type = "dropdown", label = x.E("label"), name = x.E("name"), value = x.E("value"), required = x.E("required"), options = getDropdownOptions(x).ToArray() };
        }
        private List<object> getDropdownOptions(XmlNode x)
        {
            List<object> options = new List<object>();

            options.Add(new { label = "", value = "" });

            XmlNodeList nodes = x.SelectNodes("optionlist/option");

            int cnt = 0;
            foreach (XmlNode node in nodes)
            {
                options.Add(createDropdownOption(node));
            }
            return options;
        }
        private object createDropdownOption(XmlNode node)
        {
            StringBuilder cssclass = new StringBuilder();

            string campuskey = node.E("campus");
            if (campuskey != "")
            {
                string targetCssClass = "ckeq" + campuskey.FormatAsProgrammaticId();
                cssclass.Append(" " + targetCssClass);
                addControlEvent("campus_key", "=", campuskey, targetCssClass, "show", "hide");
            }
            string programkey = node.E("program");
            if (programkey != "")
            {
                string targetCssClass = "pkeq" + programkey.FormatAsProgrammaticId();
                cssclass.Append(" " + targetCssClass);
                addControlEvent("program_key", "=", programkey, targetCssClass, "show", "hide");
            }
            string gtvalue = node.E("geotargeting");
            if (gtvalue != "")
            {
                string targetCssClass = "c" + ShortGuidGenerator.NewGuid();
                cssclass.Append(" " + targetCssClass);
                addControlEvent("zip", "in", gtvalue, targetCssClass, "show", "");
                addControlEvent("state", "in", gtvalue, targetCssClass, "show", "");
            }

            return new { label = node.E("label"), value = node.E("value"), group1 = node.E("group"), group2 = node.E("type"), cssclass = cssclass.ToString().Trim(), style = gtvalue != "" ? "display: none;" : "" };
        }

        private void addControlEvent(string controlName, string oper, string value, string targetCssClass, string targetActionIfTrue, string targetActionIfFalse)
        {
            if (!controlEvents.ContainsKey(controlName))
                controlEvents.Add(controlName, new List<object>());

            List<object> list = controlEvents[controlName];
            if (oper == "in")
            {
                StringBuilder sbvalues = new StringBuilder();

                string[] tokens = value.Split(',');
                int cnt = 0;
                foreach (string token in tokens)
                {
                    if (cnt++ > 0)
                        sbvalues.Append(",");

                    sbvalues.Append(token);
                }
                list.Add(new { type = "hiding", oper = oper, value = sbvalues.ToString(), valueVariable = ShortGuidGenerator.NewGuid(), cssclass = targetCssClass, actionIfTrue = targetActionIfTrue, actionIfFalse = targetActionIfFalse });
            }
            else
            {
                if (oper == "=")
                    oper = "==";

                list.Add(new { type = "hiding", oper = oper, value = value, valueVariable = ShortGuidGenerator.NewGuid(), cssclass = targetCssClass, actionIfTrue = targetActionIfTrue, actionIfFalse = targetActionIfFalse });
            }
        }

        private void addValidationEvent(string controlName, string validationType)
        {
            if (!controlEvents.ContainsKey(controlName))
                controlEvents.Add(controlName, new List<object>());

            List<object> list = controlEvents[controlName];

            list.Add(new { type = "validation", control = controlName, validation = validationType });
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