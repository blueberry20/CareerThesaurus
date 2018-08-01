using SkillCowResponsive.Classes.Cloud.TableStorage;
using SkillCowResponsive.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Script.Serialization;

namespace SkillCowResponsive.Classes.DeferredProcesses
{
    public class DeferredEmailCampaign : DeferredProcess
    {
        public string PartitionKey { get; set; }
        public string modelJson { get; set; }
        public EmailCampaign campaign { get; set; }
        public PersonalityModel model { get; set; }

        public override DeferredProcessExitCode Execute(MessageBroker messageBroker)
        {
            try
            {
                JavaScriptSerializer jss = new JavaScriptSerializer();
                campaign = jss.Deserialize<EmailCampaign>(modelJson);
                model = jss.Deserialize<PersonalityModel>(modelJson);
                UserProfileClient upc = new UserProfileClient();
                List<UserProfile> profiles = new List<UserProfile>(upc.GetAllByPartition(PartitionKey));
                List<UserProfile> filtered = new List<UserProfile>(profiles.Where(x => !string.IsNullOrEmpty(x.Email) && IsValidEmail(x.Email) &&
                    (string.IsNullOrEmpty(campaign.GradYears) || (!string.IsNullOrEmpty(x.GradYear) && campaign.GradYears.Contains(x.GradYear))) &&
                    model.GetType().GetProperties().All(y =>(y.GetValue(model, null) == null || (x.GetType().GetProperty(y.Name).GetValue(x, null) != null && y.GetValue(model, null).ToString() == x.GetType().GetProperty(y.Name).GetValue(x, null).ToString())))));
                foreach (UserProfile user in filtered)
                {
                    (new DeferredEmailSender { FromDisplay = campaign.FromDiplay, FromEmail = campaign.FromEmail, Body = campaign.Body, Subject = campaign.Subject, To = user.Email }).Run(messageBroker);
                }

                string body = "<p>Subject Line: " + campaign.Subject + "</p>" +
                    "<p>Partition: " + PartitionKey + "</p>" +
                    "<p>Emails to be sent: " + filtered.Count + "</p>";
                    
                (new DeferredEmailSender { FromDisplay = "Admin", FromEmail = "no-reply@careerthesaurus.com", Body = body, Subject = "Partition " + PartitionKey, To = "mike@peopli.com" }).Execute(messageBroker);
                return DeferredProcessExitCode.Success;
            }
            catch
            {
                return DeferredProcessExitCode.Error;
            }
        }
        private bool IsValidEmail(string str)
        {
            return Regex.IsMatch(str, @"^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$");
        }
    }
}