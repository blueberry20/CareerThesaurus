using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.WindowsAzure.StorageClient;
using SkillCowResponsive.Classes.Helpers;

namespace SkillCowResponsive.Classes.Cloud.TableStorage.ABTests
{
    public class ABTestConversion : TableServiceEntity
    {
        public ABTestConversion()
        {
            PartitionKey = EasternTimeConverter.Convert(DateTime.UtcNow).ToString("yyyyMMdd");

            // Row key allows sorting, so we make sure the rows come back in time order.      
            RowKey = string.Format("{0:10}_{1}", DateTime.MaxValue.Ticks - DateTime.Now.Ticks, Guid.NewGuid());
        }

        public string Goal { get; set; }
        public string TestID { get; set; }
        public int Weight { get; set; }
        public int Views { get; set; }
    }
}