using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.WindowsAzure.StorageClient;
using SkillCowResponsive.Classes.Helpers;
using System.ComponentModel.DataAnnotations;

namespace SkillCowResponsive.Classes.Cloud.TableStorage
{
    public class DelayedRecord : TableServiceEntity
    {

        public DelayedRecord()
        {
            PartitionKey = "same";
        }

        public string CampaignId{get;set;}
        public string IP {get;set;}
        public string ClientId{get;set;}
        public string Salutation {get;set;}
        public string Gender {get;set;}

        public string FirstName {get;set;}
        public string LastName {get;set;}
        public string Email {get;set;}
        public string Zip {get;set;}
        public string Phone {get;set;}
        public string Address1 {get;set;}

        public string City {get;set;}
        public string State {get;set;}

        public string EducationLevel {get;set;}
        public string EduIntent {get;set;}
        
        public string GradYear {get;set;}
        public string DobYear {get;set;}
        public string DobMonth {get;set;}
        public string DobDay {get;set;}

        //[NotMapped]
        public bool Submitted { get; set; }
        //[NotMapped]
        public bool SubmissionError { get; set; }

        public string GetPostString(UserProfileClient upc) 
        {
            string partitionkey = AddresseeClient.GetPartitionKeyForEmail(Email);
            UserProfile profile = upc.GetByPartitionAndRowKey(partitionkey, Email);
            if (profile != null)
            {

                Phone = profile.Phone;
                Address1 = profile.Address1;
                City = profile.City;
                State = profile.State;
                
            }

            return "campaign_id=" + CampaignId +
                     "&id=1727" +
                     "&ip=" + IP +
                     "&client=" + ClientId +
                     "&salutation=" + Salutation +
                     "&gender=" + Gender +
                     "&firstname=" + FirstName.Trim() +
                     "&lastname=" + LastName.Trim() +
                     "&email=" + Email +
                     "&zip=" + Zip +
                     "&phone=" + Phone +
                     "&address1=" + Address1 +
                     "&city=" + City +
                     "&state=" + State +
                     "&education_level=" + EducationLevel +
                     "&educationlevel=" + EducationLevel +
                     "&edu_intent=" + EduIntent +
                     "&gradyear=" + GradYear +
                     "&dobyear=" + DobYear +
                     "&dobmonth=" + DobMonth +
                     "&dobday=" + DobDay;

            
        }

        

        
    }
}