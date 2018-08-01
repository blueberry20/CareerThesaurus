using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;


namespace SkillCowResponsive.Classes.Cloud.TableStorage.SchoolNewsletter
{
    public class SchoolNewsletterClient : TableServiceClientBase<SchoolNewsletter>
    {
        public SchoolNewsletterClient()
            :base("SchoolNewsletter")
        {
        }
        public static string GetPartitionKeyForEmail(string email)
        {
            string partitionkey = "";

            if (email == null || email.Trim() == "")
            {
                return "same";
            }

            partitionkey = email.Trim()[0].ToString().ToLower();

            return partitionkey;
        }

    }
}
