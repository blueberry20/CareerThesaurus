using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SkillCow.Classes.Cloud.TableStorage;
using Newtonsoft.Json.Linq;
using SkillCow.Classes.Cloud.TableStorage.DirectClients.Employers;

namespace SkillCow.Classes.Helpers
{
    public class AttributeMaskCalculator
    {
        public long GetMask(JObject jobject)
        {
            double mask = 0;

            mask += GetAttributeScore("Attitude", jobject["Attitude"].ToString());
            mask += GetAttributeScore("Information", jobject["Information"].ToString());
            mask += GetAttributeScore("Processing", jobject["Processing"].ToString());

            mask += GetAttributeScore("Action", jobject["Action"].ToString());
            mask += GetAttributeScore("Endurance", jobject["Endurance"].ToString());
            mask += GetAttributeScore("Presence", jobject["Presence"].ToString());

            mask += GetAttributeScore("Concentration", jobject["Concentration"].ToString());
            mask += GetAttributeScore("Patterns", jobject["Patterns"].ToString());
            mask += GetAttributeScore("Compensation", jobject["Compensation"].ToString());

            return (long)mask;
        }
        public long GetMask(JobPosting posting)
        {
            double mask = 0;

            mask += GetAttributeScore("Attitude", posting.DimensionAttitude);
            mask += GetAttributeScore("Information", posting.DimensionInformation);
            mask += GetAttributeScore("Processing", posting.DimensionProcessing);

            mask += GetAttributeScore("Action", posting.DimensionAction);
            mask += GetAttributeScore("Endurance", posting.DimensionEndurance);
            mask += GetAttributeScore("Presence", posting.DimensionPresence);

            mask += GetAttributeScore("Concentration", posting.DimensionConcentration);
            mask += GetAttributeScore("Patterns", posting.DimensionPatterns);
            mask += GetAttributeScore("Compensation", posting.DimensionCompensation);

            return (long)mask;
        }
        public long GetMask(DirectEmployerClientCampusProgram posting)
        {
            double mask = 0;

            mask += GetAttributeScore("Attitude", posting.DimensionAttitude);
            mask += GetAttributeScore("Information", posting.DimensionInformation);
            mask += GetAttributeScore("Processing", posting.DimensionProcessing);

            mask += GetAttributeScore("Action", posting.DimensionAction);
            mask += GetAttributeScore("Endurance", posting.DimensionEndurance);
            mask += GetAttributeScore("Presence", posting.DimensionPresence);

            mask += GetAttributeScore("Concentration", posting.DimensionConcentration);
            mask += GetAttributeScore("Patterns", posting.DimensionPatterns);
            mask += GetAttributeScore("Compensation", posting.DimensionCompensation);

            return (long)mask;
        }

        private double GetAttributeScore(string dimension, string value)
        {
            switch (dimension) {
                case "Attitude":
                    return AttitudeScore(value);
                case "Information":
                    return InformationScore(value);
                case "Processing":
                    return ProcessingScore(value);
                case "Action":
                    return ActionScore(value);
                case "Endurance":
                    return EnduranceScore(value);
                case "Presence":
                    return PresenceScore(value);
                case "Concentration":
                    return ConcentrationScore(value);
                case "Patterns":
                    return PatternsScore(value);
                case "Compensation":
                    return CompensationScore(value);
                default:
                    return 0;
            }
        }

        private double AttitudeScore(string value)
        {
            switch (value)
            {
                case "Extravert": 
                    return Math.Pow(2, 0);
                case "Introvert": 
                    return Math.Pow(2, 1);
                case "Either":
                    return Math.Pow(2, 0) + Math.Pow(2, 1);
                default:
                    return 0;
            }
        }

        private double InformationScore(string value)
        {
            switch (value)
            {
                case "Facts":
                    return Math.Pow(2, 2);
                case "Imagination": 
                    return Math.Pow(2, 3);
                case "Either":
                    return Math.Pow(2, 2) + Math.Pow(2, 3);
                default:
                    return 0;
            }
        }

        private double ProcessingScore(string value)
        {
            switch (value)
            {
                case "Rational": 
                    return Math.Pow(2, 4);
                case "Emotional": 
                    return Math.Pow(2, 5);
                case "Either":
                    return Math.Pow(2, 4) + Math.Pow(2, 5);
                default:
                    return 0;
            }
        }

        private double ActionScore(string value)
        {
            switch (value)
            {
                case "Process": 
                    return Math.Pow(2, 6);
                case "Result": 
                    return Math.Pow(2, 7);
                case "Either":
                    return Math.Pow(2, 6) + Math.Pow(2, 7);
                default:
                    return 0;
            }
        }

        private double EnduranceScore(string value)
        {
            switch (value)
            {
                case "Stationary": 
                    return Math.Pow(2, 8);
                case "Mobile": 
                    return Math.Pow(2, 9);
                case "Either":
                    return Math.Pow(2, 8) + Math.Pow(2, 9);
                default:
                    return 0;
            }
        }

        private double PresenceScore(string value)
        {
            switch (value)
            {
                case "Present": 
                    return Math.Pow(2, 10);
                case "Remote": 
                    return Math.Pow(2, 11);
                case "Either":
                    return Math.Pow(2, 10) + Math.Pow(2, 11);
                default:
                    return 0;
            }
        }

        private double ConcentrationScore(string value)
        {
            switch (value)
            {
                case "Relaxed": 
                    return Math.Pow(2, 12);
                case "Focused": 
                    return Math.Pow(2, 13);
                case "Either":
                    return Math.Pow(2, 12) + Math.Pow(2, 13);
                default:
                    return 0;
            }
        }

        private double PatternsScore(string value)
        {
            switch (value)
            {
                case "Discover": 
                    return Math.Pow(2, 14);
                case "Routine": 
                    return Math.Pow(2, 15);
                case "Either":
                    return Math.Pow(2, 14) + Math.Pow(2, 15);
                default:
                    return 0;
            }
        }

        private double CompensationScore(string value)
        {
            switch (value)
            {
                case "Fixed": 
                    return Math.Pow(2, 16);
                case "Variable": 
                    return Math.Pow(2, 17);
                case "Either":
                    return Math.Pow(2, 16) + Math.Pow(2, 17);
                default:
                    return 0;
            }
        }
    }
}