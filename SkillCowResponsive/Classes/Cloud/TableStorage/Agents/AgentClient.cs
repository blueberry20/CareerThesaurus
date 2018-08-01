using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.StorageClient;
using Microsoft.WindowsAzure.ServiceRuntime;


namespace SkillCowResponsive.Classes.Cloud.TableStorage
{
    public class AgentClient : ChainDateTableServiceClientBase<Agent>
    {
        public AgentClient()
            : base("skillcowagent")
        {
        }

        public CloudTableQuery<Agent> GetAll()
        {
            return (from e in TableContext().CreateQuery<Agent>(tableName)
                    select e).AsTableServiceQuery<Agent>();
            
        }
        
    }
}