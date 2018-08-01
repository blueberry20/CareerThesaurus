using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace SkillCow.Classes.Cloud.TableStorage.DirectClients.Schools.GeoIndex
{
    interface IGeoIndexClient
    {
        bool AddProgram(string partition, string programkey, string campuskey, string clientkey);
        bool RemoveProgram(string partition, string programkey);
    }
}
