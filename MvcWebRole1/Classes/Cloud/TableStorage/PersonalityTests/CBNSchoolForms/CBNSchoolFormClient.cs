using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.StorageClient;
using Microsoft.WindowsAzure.ServiceRuntime;


namespace SkillCow.Classes.Cloud.TableStorage.PersonalityTests.CBNSchoolForms
{
    public class CBNSchoolFormsClient : ChainDateTableServiceClientBase<CBNSchoolForm>
    {
        public CBNSchoolFormsClient()
            : base("cbnschoolforms")
        {
        }

        
    }
}