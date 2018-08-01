using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SkillCowResponsive.Classes.Cloud.TableStorage;
using System.Reflection;
using Newtonsoft.Json.Linq;
using SkillCowResponsive.Classes.Cloud.TableStorage.DirectClients.Employers;

namespace SkillCowResponsive.Classes.Helpers
{
    public class ImportantThingsMaskCalculator
    {
        enum ImportantThing
        {
            Beauty,
            Helping,
            Adventure,
            Safety,
            Technology,

            People,
            Science,
            Easy,
            Duty,
            Growth,

            Creativity,
            Admiration,
            Competition,
            Animals,
            Politics
        }

        public long GetMask(DirectEmployerClientCampusProgram posting)
        {
            double mask = 0;

            foreach(ImportantThing thing in Enum.GetValues(typeof(ImportantThing)))
            {
                PropertyInfo pi = posting.GetType().GetProperty("ImportantThings" + thing.ToString());
                
                object value = pi.GetValue(posting, null); 

                if(value!=null)
                {
                    if(thing.ToString() == value.ToString())
                    {
                        mask += Math.Pow(2, (double)thing);
                    }
                }
            }

            return (long)mask;
        }

        public long GetMask(JobPosting posting)
        {
            double mask = 0;

            foreach (ImportantThing thing in Enum.GetValues(typeof(ImportantThing)))
            {
                PropertyInfo pi = posting.GetType().GetProperty("ImportantThings" + thing.ToString());

                object value = pi.GetValue(posting, null);

                if (value != null)
                {
                    if (thing.ToString() == value.ToString())
                    {
                        mask += Math.Pow(2, (double)thing);
                    }
                }
            }

            return (long)mask;
        }
        
        public long GetMask(JObject jobject)
        {
            double mask = 0;

            foreach (ImportantThing thing in Enum.GetValues(typeof(ImportantThing)))
            {
                if (jobject[thing.ToString()] != null)
                {
                    mask += Math.Pow(2, (double)thing);
                }
            }

            return (long)mask;
        }
        
    }
}