using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.StorageClient;
using Microsoft.WindowsAzure.ServiceRuntime;


namespace SkillCow.Classes.Cloud.TableStorage.DirectClients.LeadCaps
{
    public class LeadCapClient : ChainDateTableServiceClientBase<LeadCap>
    {
        public LeadCapClient()
            : base("skillcowdirectleadcaps")
        {
        }
    }
}