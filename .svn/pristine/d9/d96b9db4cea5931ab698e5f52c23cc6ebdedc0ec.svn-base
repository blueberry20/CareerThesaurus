using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.StorageClient;
using Microsoft.WindowsAzure.ServiceRuntime;

using SkillCow.Classes.Helpers;

namespace SkillCow.Classes.Cloud.TableStorage.PersonalityTests.CBNProfessions
{
    public class CBNProfessionClient : ChainDateTableServiceClientBase<CBNProfession>
    {
        public CBNProfessionClient()
            : base("cbnprofession")
        {
        }

        public CBNProfession GetByProfessionName(string name)
        {
            return (from e in Entities()
                    where e.Profession == name
                    select e).SingleOrDefault();
        }

        public CBNProfession GetByUrlParam(string urlparam)
        {
            return (from e in Entities()
                    select e).AsEnumerable().Where(x => x.DisplayName.FormatProfessionNameAsUrlParam() == urlparam).SingleOrDefault();
        }
    }
}