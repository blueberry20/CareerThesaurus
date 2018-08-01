using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text;
using SkillCowResponsive.Classes.CookieData;
using SkillCowResponsive.Classes.Helpers;

namespace SkillCowResponsive.Classes.Email
{
    public class WelcomeEmail
    {
        public static bool Send(HttpRequestBase Request, string firstname, string email, bool isexternal)
        {
            EmailManager em = new EmailManager();
            EmailTemplateHelper eth = new EmailTemplateHelper();

            string body = eth.GetTemplate("welcome");

            body = body.Replace("@FirstName", firstname.ToProperCase());
            body = body.Replace("@Email", email);

            StringBuilder sbadditionalinfo = new StringBuilder();

            string testresults = CookieDataTestResults.BulletListForEmail(Request);
            string importantthings = CookieDataImportantThings.BulletListForEmail(Request);

            if(testresults!="")
            {
                sbadditionalinfo.Append("<div class=\"panel\">");
                sbadditionalinfo.Append("Your top professions:");
                sbadditionalinfo.Append(testresults);
                sbadditionalinfo.Append("</div>");
            }
            if(importantthings!="")
            {
                sbadditionalinfo.Append("<div class=\"panel\">");
                sbadditionalinfo.Append("Things that are important to you:");
                sbadditionalinfo.Append(importantthings);
                sbadditionalinfo.Append("</div>");
            }

            body = body.Replace("@AdditionalInfo", sbadditionalinfo.ToString());

            string vmcategories = CookieDecoder.DecodeCookieCharacters(Request.Cookies["topvmcategories"].Value);
            StringBuilder sbvm = new StringBuilder();
            if (vmcategories != null && vmcategories != "")
            {
                sbvm.Append("In the meantime, check out these schools that can help you achieve your goals in the areas where you excel.<br /><br />");
                sbvm.Append("<table border=\"0\" width=\"100%\">");

                string[] tokens = vmcategories.Split(',');
                int cnt = 0;
                foreach (string vmpid in tokens)
                {
                    sbvm.Append("<tr>"+
                        "<td style=\"color: #ccc; font-size: 16pt; font-weight: normal; width: 40px; text-align: center\">" + (++cnt) + "</td>"+
                        "<td style=\"padding: 5px;\"><a style=\"font-size: 16pt; font-weight: bold; color: #0099ff; text-decoration: none; margin-bottom: 100px;\" href=\"http://www.SkillCow.com/vm/index?p=" + vmpid + (isexternal ? "&m=e" : "") + "\">" +
                        VMMapper.MapName(vmpid) + " &raquo;</a></td>" +
                    "</tr>");
                    if (cnt > 5)
                    {
                        break;
                    }
                }

                sbvm.Append("</table>");
            }

            body = body.Replace("@VMListings", sbvm.ToString());
            

            em.SendMail("no-reply@SkillCow.com", "SkillCow", email, "Your Test Results", body);
            
            return true;
        }
    }
}