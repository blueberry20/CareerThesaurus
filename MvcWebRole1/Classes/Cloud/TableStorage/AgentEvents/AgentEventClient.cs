using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.StorageClient;
using Microsoft.WindowsAzure.ServiceRuntime;


namespace SkillCow.Classes.Cloud.TableStorage
{
    public class AgentEventClient : ChainDateTableServiceClientBase<AgentEvent>
    {
        public AgentEventClient()
            : base("skillcowagentevent")
        {
        }

        public CloudTableQuery<AgentEvent> GetAll()
        {
            return (from e in TableContext().CreateQuery<AgentEvent>(tableName)
                    select e).AsTableServiceQuery<AgentEvent>();
            
        }
        
    }
}