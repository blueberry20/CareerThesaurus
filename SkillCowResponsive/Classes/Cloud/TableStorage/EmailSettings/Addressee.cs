using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.WindowsAzure.StorageClient;
using SkillCowResponsive.Classes.Helpers;

namespace SkillCowResponsive.Classes.Cloud.TableStorage
{
    public class Addressee : TableServiceEntity
    {
        public Addressee()
        {
        }
        public Addressee(string email)
        {
            PartitionKey = AddresseeClient.GetPartitionKeyForEmail(email);
            RowKey = email;
            Timestamp = EasternTimeConverter.Convert(DateTime.UtcNow);
            Unsubscribed = false;
            UnsubscribedUTCDate = DateTime.MaxValue;
        }
        
        public string Name { get; set; }
        public string Email { get; set; }
        

        public bool Unsubscribed { get; set; }
        public DateTime UnsubscribedUTCDate { get; set; }
    }

    
}