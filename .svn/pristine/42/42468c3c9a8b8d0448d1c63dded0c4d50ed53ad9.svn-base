using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.WindowsAzure.StorageClient;
using SkillCowResponsive.Classes.Helpers;

namespace SkillCowResponsive.Classes.Cloud.TableStorage.PersonalityTests.SkillCowRequestSubmissions
{
    public class SkillCowRequestSubmission : TableServiceEntity
    {
        public SkillCowRequestSubmission()
        {
            DateTime t = EasternTimeConverter.Convert(DateTime.UtcNow);
            PartitionKey = t.ToString("yyyyMMdd");
            RowKey = ShortGuidGenerator.NewGuid();
            Timestamp = t;
        }

        public string ClientType { get; set; }
        public string Name { get; set; }
        public string Zip { get; set; }
        public string Address1 { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string IP { get; set; }
        public string Mode { get; set; }
        public string CampaignId { get; set; }
        public string TestResults { get; set; }
        public string SourceForm{ get; set; }

        public string GradYear { get; set; }
        public string EduIntent { get; set; }
        
        public string Data{ get; set; }

        public string Recommendations { get; set; }

        public string ClientId { get; set; }
        public string FormId { get; set; }
        public string CareerId { get; set; }

        public string CampusKey { get; set; }
        public string ProgramKey  { get; set; }
        
        public string Gender { get; set; }
        public string Salutation { get; set; }

        public string SubmissionResult { get; set; }

        //GA
        public string UtmSource { get; set; }
        public string UtmCampaign { get; set; }
        public string UtmContent { get; set; }
        public string UtmTerm { get; set; }


        //Advertise.com
        public string advertise_affsub  { get; set; }
        public string advertise_affiliate  { get; set; }
        public string advertise_country  { get; set; }
        public string advertise_countrycode  { get; set; }
        public string advertise_geo  { get; set; }
        public string advertise_subid  { get; set; }
        public string advertise_terms_html_kw  { get; set; }
        public string advertise_terms { get; set; }

        public string PostedString { get; set; }

        public string SchoolSearchResultId { get; set; }

        public override string ToString()
        {
            return UtmContent;
        }
    }
}