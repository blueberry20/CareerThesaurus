using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SkillCowResponsive.Classes.Cloud.TableStorage.ABTests
{
    public class ABTestStringParser
    {
        public ABTestStringComponents Parse(string abteststring)
        {
            ABTestStringComponents result = new ABTestStringComponents();
            
            if (abteststring == null || abteststring.Trim() == "")
                return result;

            string[] tokens = abteststring.Split('.');
                        
            if (tokens.Length > 1)
            {
                result.View = tokens[1];

                if (tokens.Length > 2)
                {
                    result.Source = tokens[2];

                    if (tokens.Length > 3)
                    {
                        result.Ad = tokens[3];
                    }
                }
            }

            return result;
        }
    }
}