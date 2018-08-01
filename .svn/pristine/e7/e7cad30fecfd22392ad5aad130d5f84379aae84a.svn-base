using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.StorageClient;
using Microsoft.WindowsAzure.ServiceRuntime;


namespace SkillCow.Classes.Cloud.TableStorage
{
    public class JobPostingClient : ChainDateTableServiceClientBase<JobPosting>
    {
        public JobPostingClient()
            : base("skilljobposting")
        {
        }

        public CloudTableQuery<JobPosting> GetAllBySource(string source)
        {
            return (from e in TableContext().CreateQuery<JobPosting>(tableName)
                    where e.Source == source
                    select e).AsTableServiceQuery<JobPosting>();
        }

        
    }
}