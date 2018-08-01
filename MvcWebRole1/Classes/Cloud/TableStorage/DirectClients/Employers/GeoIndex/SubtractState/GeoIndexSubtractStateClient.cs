﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.StorageClient;
using Microsoft.WindowsAzure.ServiceRuntime;
using SkillCow.Classes.Cloud.TableStorage.DirectClients.GeoIndex;

namespace SkillCow.Classes.Cloud.TableStorage.DirectClients.Employers.GeoIndex
{
    public class GeoIndexSubtractStateClient : ChainDateTableServiceClientBase<GeoIndexSubtractState>, IGeoIndexClient
    {
        public GeoIndexSubtractStateClient()
            : base("skillcowdirectemployergeoindexsubtractstate")
        {
        }

        public bool AddProgram(string state, string programid, string campuskey, string clientkey, long attributemask, long importantthingsmask)
        {
            this.AddNewItem(new GeoIndexSubtractState() { PartitionKey = state, RowKey = programid, CampusRowKey = campuskey, ClientRowKey = clientkey });
            return true;
        }

        public bool RemoveProgram(string state, string programid)
        {
            try
            {
                this.Delete(this.GetByPartitionAndRowKey(state, programid));
            }
            catch
            {
            }
            return true;
        }
    }
}