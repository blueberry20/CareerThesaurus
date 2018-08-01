using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.WindowsAzure.StorageClient;
using SkillCowResponsive.Classes.Helpers;
using Newtonsoft.Json.Linq;

namespace SkillCowResponsive.Classes.Cloud.TableStorage
{
    public class JobPosting : TableServiceEntity
    {

        public JobPosting()
        {
            PartitionKey = "same";
            RowKey = ShortGuidGenerator.NewGuid();
            Timestamp = DateTime.UtcNow;
        }

        public long AttributeMask { get; set; }
        public long ImportantThingsMask { get; set; }

        public bool IsLive { get; set; }

        public string GeoTarget { get; set; }
        public string GeoTarget2 { get; set; }
        public string GeoTarget3 { get; set; }
        public string GeoTargetType { get; set; }

        public string Industry { get; set; }

        public string Category { get; set; } //Sales, Management, Operations, IT, 
        public string SubCategory { get; set; } //

        public int ExperienceLevel { get; set; } // 0 - no experience necessary, 1 - some experience, 2 - experience required, 3 - veteran (executive level)
        
        public string JobTitle { get; set; }
        public string CompanyName { get; set; }
        public string FormattedLocation { get; set; }
                
        public string Description { get; set; }
        public string Description2 { get; set; }

        public string Keywords { get; set; }

        public string Logo { get; set; }

        public string Source { get; set; }
        public string ReferenceId { get; set; }

        public string ClientId { get; set; }
        public string FormId { get; set; }

        public bool BasePay  { get; set; }
        public double BasePayAmount { get; set; }
        public string BasePayPer { get; set; }

        public bool CommissionPay { get; set; }
        public string CommissionStructure{ get; set; }

        public DateTime PostedDateTime { get; set; }

        public string PositionLocationId { get; set; }
        public string PositionLocationName { get; set; }
        public string URL{ get; set; }

        public string DimensionAttitude { get; set; }
        public string DimensionInformation { get; set; }
        public string DimensionProcessing { get; set; }

        public string DimensionAction { get; set; }
        public string DimensionEndurance { get; set; }
        public string DimensionPresence { get; set; }

        public string DimensionConcentration { get; set; }
        public string DimensionPatterns { get; set; }
        public string DimensionCompensation { get; set; }

        public string ImportantThingsBeauty { get; set; }
        public string ImportantThingsHelping { get; set; }
        public string ImportantThingsAdventure { get; set; }
        public string ImportantThingsSafety { get; set; }
        public string ImportantThingsTechnology { get; set; }

        public string ImportantThingsPeople { get; set; }
        public string ImportantThingsScience { get; set; }
        public string ImportantThingsEasy { get; set; }
        public string ImportantThingsDuty { get; set; }
        public string ImportantThingsGrowth { get; set; }

        public string ImportantThingsCreativity { get; set; }
        public string ImportantThingsAdmiration { get; set; }
        public string ImportantThingsCompetition { get; set; }
        public string ImportantThingsAnimals { get; set; }
        public string ImportantThingsPolitics { get; set; }


        public double GetAttributeScore(JObject attributes)
        {
            double score = 0;

            if (DimensionAction == "Either") {score+=0.5;} else if (DimensionAction==attributes["Action"].ToString()) {score+=1;}
            if (DimensionAttitude == "Either") {score+=0.5;} else if (DimensionAttitude==attributes["Attitude"].ToString()) {score+=1;}
            if (DimensionCompensation == "Either") { score += 0.5; } else if (DimensionCompensation == attributes["Compensation"].ToString()) { score += 1; }

            if (DimensionConcentration == "Either") { score += 0.5; } else if (DimensionConcentration == attributes["Concentration"].ToString()) { score += 1; }
            if (DimensionEndurance == "Either") { score += 0.5; } else if (DimensionEndurance == attributes["Endurance"].ToString()) { score += 1; }
            if (DimensionInformation == "Either") { score += 0.5; } else if (DimensionInformation == attributes["Information"].ToString()) { score += 1; }

            if (DimensionPatterns == "Either") { score += 0.5; } else if (DimensionPatterns == attributes["Patterns"].ToString()) { score += 1; }
            if (DimensionPresence == "Either") { score += 0.5; } else if (DimensionPresence == attributes["Presence"].ToString()) { score += 1; }
            if (DimensionProcessing == "Either") { score += 0.5; } else if (DimensionProcessing == attributes["Processing"].ToString()) { score += 1; }

            return score;
        }

        public double GetImportantThingsScore(JObject things)
        {
            double score = 0;

            if (things["Admiration"]!=null && ImportantThingsAdmiration == things["Admiration"].ToString()) { score+=10; }
            if (things["Adventure"] != null && ImportantThingsAdventure == things["Adventure"].ToString()) { score+=10; }
            if (things["Animals"] != null && ImportantThingsAnimals == things["Animals"].ToString()) { score+=10; }
            if (things["Beauty"] != null && ImportantThingsBeauty == things["Beauty"].ToString()) { score+=10; }
            if (things["Competition"] != null && ImportantThingsCompetition == things["Competition"].ToString()) { score+=10; }

            if (things["Creativity"] != null && ImportantThingsCreativity == things["Creativity"].ToString()) { score+=10; }
            if (things["Duty"] != null && ImportantThingsDuty == things["Duty"].ToString()) { score+=10; }
            if (things["Easy"] != null && ImportantThingsEasy == things["Easy"].ToString()) { score+=10; }
            if (things["Growth"] != null && ImportantThingsGrowth == things["Growth"].ToString()) { score+=10; }
            if (things["Helping"] != null && ImportantThingsHelping == things["Helping"].ToString()) { score+=10; }

            if (things["People"] != null && ImportantThingsPeople == things["People"].ToString()) { score+=10; }
            if (things["Politics"] != null && ImportantThingsPolitics == things["Politics"].ToString()) { score+=10; }
            if (things["Safety"] != null && ImportantThingsSafety == things["Safety"].ToString()) { score+=10; }
            if (things["Science"] != null && ImportantThingsScience == things["Science"].ToString()) { score+=10; }
            if (things["Technology"] != null && ImportantThingsTechnology == things["Technology"].ToString()) { score+=10; }

            return score;
        }

    }
}