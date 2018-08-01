using Microsoft.WindowsAzure.StorageClient;
using SkillCowResponsive.Classes.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SkillCowResponsive.Classes.Cloud.TableStorage.SchoolNewsletter
{
    public class SchoolNewsletter : TableServiceEntity
    {
        //
        // GET: /SchoolNewsletter/

        public SchoolNewsletter()
        {
            Timestamp = EasternTimeConverter.Convert(DateTime.UtcNow);
        }

        public string Email { get; set; }
        public string Name { get; set; }
        public string Organization { get; set; }
        public string Phone { get; set; }

    }
}
