using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Net;
using System.Net.Mail;

using SendGridMail;
using SendGridMail.Transport;
using System.Web.Security;


namespace SkillCowResponsive.Classes
{
    public class EmailManager
    {
        //static string _mailaccountusername = "nycdude777";
        //the request was aborted: could not create ssl/tls secure channel.
        static string _mailaccountusername = "CareerThesaurus";
        static string _mailaccountpassword = "pendejos$15";
        bool done = false;
        int trycount = 0;

        public void SendMail(string fromemail, string fromdisplay, string to, string subject, string body)
        {
            try
            {
                trycount++;
                SendGrid myMessage = SendGrid.GetInstance();

                myMessage.From = new MailAddress(fromemail, fromdisplay);
                myMessage.Subject = subject;

                myMessage.AddTo(to);
                myMessage.Html = body;

                SendByWeb(myMessage);
                done = true;
            }
            catch (Exception e)
            {
                var excp = e;
                var str = "";
            }
            if (!done && trycount <= 3)
            {
                SendMail(fromemail, fromdisplay, to, subject, body);
            }
        }

        private bool SendByWeb(SendGrid myMessage)
        {
            // Create credentials, specifying your user name and password.
            var credentials = new NetworkCredential(_mailaccountusername, _mailaccountpassword);

            // Create an REST transport for sending email.
            var transportWeb = Web.GetInstance(credentials);

            // Send the email.
            transportWeb.Deliver(myMessage);
            return true;
        }
    }
}