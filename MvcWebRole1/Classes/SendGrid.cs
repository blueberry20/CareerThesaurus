using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Net;
using System.Net.Mail;
using SendGridMail;
using SendGridMail.Transport;
using System.Web.Security;


namespace SkillCow.Classes
{
    public class EmailManager
    {
        static string _mailaccountusername = "nycdude777";
        static string _mailaccountpassword = "pendejos$15";

        public void SendMail(string fromemail, string fromdisplay, string to, string subject, string body)
        {
            try
            {
                
                SendGrid myMessage = SendGrid.GetInstance();

                myMessage.From = new MailAddress(fromemail, fromdisplay);
                myMessage.Subject = subject;

                myMessage.AddTo(to);
                myMessage.Html = body;

                SendByWeb(myMessage);
            }
            catch
            {
                
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