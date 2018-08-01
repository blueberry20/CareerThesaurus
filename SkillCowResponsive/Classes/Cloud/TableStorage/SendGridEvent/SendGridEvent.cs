using Microsoft.WindowsAzure.StorageClient;
using SkillCowResponsive.Classes.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SkillCowResponsive.Classes.Cloud.TableStorage.SendGridEvent
{
    public class SendGridEvent : TableServiceEntity
    {
        public SendGridEvent()
        {
            Timestamp = EasternTimeConverter.Convert(DateTime.UtcNow);
            CreatedOn = EasternTimeConverter.Convert(DateTime.UtcNow);
            LastUpdated = EasternTimeConverter.Convert(DateTime.UtcNow);
            Spam = false;
            Unsubscribed = false;
        }

        public string Email { get; set; }
        public bool Delivered { get; set; }
        public int Opened { get; set; }
        public int Clicked { get; set; }
        public bool Unsubscribed { get; set; }
        public bool Spam { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime LastUpdated { get; set; }
    }
}