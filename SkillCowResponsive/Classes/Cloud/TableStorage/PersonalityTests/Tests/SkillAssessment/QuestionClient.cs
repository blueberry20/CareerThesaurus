using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.StorageClient;
using Microsoft.WindowsAzure.ServiceRuntime;


namespace SkillCowResponsive.Classes.Cloud.TableStorage.PersonalityTests.Tests.SkillAssessment
{
    public class QuestionClient : ChainDateTableServiceClientBase<Question>
    {
        public QuestionClient()
            : base("testquestionmb1")
        {
        }
    }
}