using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.StorageClient;
using Microsoft.WindowsAzure.ServiceRuntime;


namespace SkillCowResponsive.Classes.Cloud.TableStorage.PersonalityTests.CBNSchools
{
    public class CBNSchoolClient : ChainDateTableServiceClientBase<CBNSchool>
    {
        public CBNSchoolClient()
            : base("cbnschool")
        {
        }

        
    }
}