using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.WindowsAzure.StorageClient;
using SkillCowResponsive.Classes.Helpers;
using SkillCowResponsive.Classes.CookieData;
using Newtonsoft.Json.Linq;

namespace SkillCowResponsive.Classes.Cloud.TableStorage
{
    public class UserProfile : TableServiceEntity
    {
        public UserProfile()
        {
            PartitionKey = EasternTimeConverter.Convert(DateTime.UtcNow).ToString("yyyyMMdd");
            RegistrationDate = EasternTimeConverter.Convert(DateTime.UtcNow).ToString("yyyyMMdd");
            RowKey = ShortGuidGenerator.NewGuid();
        }
        public UserProfile(string email)
        {
            PartitionKey = AddresseeClient.GetPartitionKeyForEmail(email);
            RegistrationDate = EasternTimeConverter.Convert(DateTime.UtcNow).ToString("yyyyMMdd");
            RowKey = email;
        }

        public string RegistrationDate { get; set; }
        public string Gender { get; set; }
        public string Salutation { get; set; }

        public string FirstName { get; set; }
        public string LastName { get; set; }
        
        public string Email { get; set; }
        public bool Unsubscribed { get; set; }

        public string Zip { get; set; }
        public string Address1 { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        
        public string Phone { get; set; }
        public string CampaignId { get; set; }
        
        public string GradYear { get; set; }
        public string EduIntent { get; set; }

        

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

        public string RecommendedCareer1 { get; set; }
        public string RecommendedCareer2 { get; set; }
        public string RecommendedCareer3 { get; set; }
        public string RecommendedCareer4 { get; set; }
        public string RecommendedCareer5 { get; set; }

        public string CareerChoice1 { get; set; }
        public string CareerChoice2 { get; set; }
        public string CareerChoice3 { get; set; }
        public string CareerChoice4 { get; set; }
        public string CareerChoice5 { get; set; }

        public string Password { get; set; }

        public void PopulateCityAndState()
        {
            if (Zip == null || Zip == "")
            {
                return;
            }

            ZipCodeClient zc = new ZipCodeClient();
            ZipCode zip  = zc.GetByRowKey(Zip);

            if (zip == null)
            {
                return;
            }

            City = zip.City;
            State = zip.StateCode;
        }

        public void SetTestResults(HttpRequestBase request)
        {
            Dictionary<string, string> results = CookieDataTestResults.GetValues(request);

            foreach (KeyValuePair<string, string> kv in results)
            {
                switch (kv.Key)
                {
                    case "Attitude":
                        DimensionAttitude = kv.Value;
                        break;
                    case "Information":
                        DimensionInformation = kv.Value;
                        break;
                    case "Processing":
                        DimensionProcessing = kv.Value;
                        break;
                    case "Action":
                        DimensionAction = kv.Value;
                        break;
                    case "Endurance":
                        DimensionEndurance = kv.Value;
                        break;
                    case "Presence":
                        DimensionPresence = kv.Value;
                        break;
                    case "Concentration":
                        DimensionConcentration = kv.Value;
                        break;
                    case "Patterns":
                        DimensionPatterns = kv.Value;
                        break;
                    case "Compensation":
                        DimensionCompensation = kv.Value;
                        break;
                    default:
                        break;
                }
            }
        }

        public void SetImportantThings(HttpRequestBase request)
        {
            Dictionary<string, string> results = CookieDataImportantThings.GetValues(request);

            foreach (KeyValuePair<string, string> kv in results)
            {
                switch (kv.Key)
                {
                    case "Beauty":
                        ImportantThingsBeauty = kv.Value;
                        break;
                    case "Helping":
                        ImportantThingsHelping = kv.Value;
                        break;
                    case "Adventure":
                        ImportantThingsAdventure = kv.Value;
                        break;
                    case "Safety":
                        ImportantThingsSafety = kv.Value;
                        break;
                    case "Technology":
                        ImportantThingsTechnology = kv.Value;
                        break;

                    case "People":
                        ImportantThingsPeople = kv.Value;
                        break;
                    case "Science":
                        ImportantThingsScience = kv.Value;
                        break;
                    case "Easy":
                        ImportantThingsEasy= kv.Value;
                        break;
                    case "Duty":
                        ImportantThingsDuty = kv.Value;
                        break;
                    case "Growth":
                        ImportantThingsGrowth = kv.Value;
                        break;

                    case "Creativity":
                        ImportantThingsCreativity = kv.Value;
                        break;
                    case "Admiration":
                        ImportantThingsAdmiration = kv.Value;
                        break;
                    case "Competition":
                        ImportantThingsCompetition = kv.Value;
                        break;
                    case "Animals":
                        ImportantThingsAnimals = kv.Value;
                        break;
                    case "Politics":
                        ImportantThingsPolitics = kv.Value;
                        break;
                    default:
                        break;
                }
            }
        }

        public void SetRecommendations(string recommendations)
        {
            if (recommendations != null && recommendations != "")
            {
                try
                {
                    JObject json = JObject.Parse(recommendations);

                    int pcnt = json["professions"].Count();
                    for (int i = 0; i < pcnt; i++)
                    {
                        string careerName = json["professions"][i]["name"].ToString();
                        switch (i)
                        {
                            case 0:
                                this.RecommendedCareer1 = careerName;
                                break;
                            case 1:
                                this.RecommendedCareer2 = careerName;
                                break;
                            case 2:
                                this.RecommendedCareer3 = careerName;
                                break;
                            case 3:
                                this.RecommendedCareer4 = careerName;
                                break;
                            case 4:
                                this.RecommendedCareer5 = careerName;
                                break;
                        }
                        if (i == 4)
                        {
                            break;
                        }
                    }
                }
                catch
                {
                }
            }
        }
        public void SetCareerChoices(string data)
        {
            if (data != null && data != "")
            {
                try
                {
                    if (!data.Contains("careerchoices") && data.Contains("priority"))
                    {
                        data = "{\"careerchoices\":" + data + "}";
                    }
                    string tempdata = data;
                    tempdata = tempdata.Replace("{'", "{#");
                    tempdata = tempdata.Replace("':'", "#:#");
                    tempdata = tempdata.Replace("', '", "#, #");
                    tempdata = tempdata.Replace("','", "#,#");
                    tempdata = tempdata.Replace("'}", "#}");
                    tempdata = tempdata.Replace("'", "\\'");
                    tempdata = tempdata.Replace("{#", "{'");
                    tempdata = tempdata.Replace("#:#", "':'");
                    tempdata = tempdata.Replace("#,#", "','");
                    tempdata = tempdata.Replace("#, #", "', '");
                    tempdata = tempdata.Replace("#}", "'}");

                    JObject toppicks = JObject.Parse(tempdata);
                    if (toppicks["careerchoices"] != null)
                    {
                        for (int j = 0; j < toppicks["careerchoices"].Count(); j++)
                        {
                            string careerChoice = toppicks["careerchoices"][j]["name"].ToString();
                            switch (j)
                            {
                                case 0:
                                    this.CareerChoice1 = careerChoice;
                                    break;
                                case 1:
                                    this.CareerChoice2 = careerChoice;
                                    break;
                                case 2:
                                    this.CareerChoice3 = careerChoice;
                                    break;
                                case 3:
                                    this.CareerChoice4 = careerChoice;
                                    break;
                                case 4:
                                    this.CareerChoice5 = careerChoice;
                                    break;
                            }
                            if (j == 4)
                            {
                                break;
                            }
                        }
                    }
                }
                catch
                {
                }
            }
        }
    }
}