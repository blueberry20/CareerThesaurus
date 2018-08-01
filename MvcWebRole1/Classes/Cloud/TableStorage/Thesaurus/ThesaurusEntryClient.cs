using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.StorageClient;
using Microsoft.WindowsAzure.ServiceRuntime;
using System.Web.Mvc;
using SkillCow.Classes.Helpers;

namespace SkillCow.Classes.Cloud.TableStorage.Thesaurus
{
    public class ThesaurusEntryClient : ChainDateTableServiceClientBase<ThesaurusEntry>
    {
        public ThesaurusEntryClient()
            : base("thesaurusentries")
        {
            
        }

        public CloudTableQuery<ThesaurusEntry> GetAllByDictionary(string dictionarytype)
        {
            return (from e in TableContext().CreateQuery<ThesaurusEntry>(tableName)
                    where e.PartitionKey == dictionarytype 
                    select e).AsTableServiceQuery<ThesaurusEntry>();
            
        }
    }
}