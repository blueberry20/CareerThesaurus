using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SkillCowResponsive.Classes.Cloud.TableStorage.AdminMisc
{
    public class AdminMiscClient : TableServiceClientBase<AdminMisc>
    {
        public AdminMiscClient()
            : base("AdminMisc")
        {
        }
    }
}