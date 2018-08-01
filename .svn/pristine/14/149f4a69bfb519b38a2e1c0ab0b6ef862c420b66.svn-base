using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.WindowsAzure.StorageClient;
using SkillCowResponsive.Classes.Helpers;
using Newtonsoft.Json.Linq;
using SkillCowResponsive.Classes.Cloud.TableStorage.DirectClients.Schools;

namespace SkillCowResponsive.Classes.Cloud.TableStorage.DirectClients.LeadCounters
{
    public class LeadCounter : TableServiceEntity
    {
        public LeadCounter()
        {
            PartitionKey = "same";
        }
                
        public long Total { get; set; }
        public long Annually { get; set; }
        public long Monthly { get; set; }
        public long Weekly { get; set; }
        public long Daily { get; set; }

        public string MonthlyResetTimestamp { get; set; }
        public long MonthlyResetTimestampTicks { get; set; }

        public string AnnualResetTimestamp { get; set; }
        public long AnnualResetTimestampTicks { get; set; }

        public void ResetCountersIfNeeded(LeadCounterClient leadcounterclient)
        {
            DirectSchoolClientLeadClient directleadclient = null;
            bool somethingchaged = false;

            //check if MonthlyResetTimestamp is null OR MonthlyResetTimestamp is not the same as NOW
            if (MonthlyResetTimestamp == null || MonthlyResetTimestamp != DateTime.UtcNow.Year.ToString() + DateTime.UtcNow.Month.ToString())
            {
                //Check if time since last reset has NEVER BEEN SET or more thatn 24 hours has elapsed
                if (MonthlyResetTimestampTicks==null || TimeSpan.FromTicks(Math.Abs(DateTime.UtcNow.Ticks - MonthlyResetTimestampTicks)).TotalHours>24 )
                {
                    if (directleadclient == null)
                    {
                        directleadclient = new DirectSchoolClientLeadClient();
                    }
                    long cnt = directleadclient.CountAllByPartitionSince(this.RowKey, new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1));
                    this.Monthly = cnt;
                    this.MonthlyResetTimestamp = DateTime.UtcNow.Year.ToString() + DateTime.UtcNow.Month.ToString();
                    this.MonthlyResetTimestampTicks = DateTime.UtcNow.Ticks;

                    somethingchaged = true;

                    
                }
            }

            //check if AnnualResetTimestamp is null OR MonthlyResetTimestamp is not the same as NOW
            if (AnnualResetTimestamp == null || AnnualResetTimestamp != DateTime.UtcNow.Year.ToString())
            {
                //Check if time since last reset has NEVER BEEN SET or more thatn 24 hours has elapsed
                if (AnnualResetTimestampTicks == null || TimeSpan.FromTicks(Math.Abs(DateTime.UtcNow.Ticks - AnnualResetTimestampTicks)).TotalHours > 24)
                {
                    if (directleadclient == null)
                    {
                        directleadclient = new DirectSchoolClientLeadClient();
                    }
                    long cnt = directleadclient.CountAllByPartitionSince(this.RowKey, new DateTime(DateTime.UtcNow.Year, 1, 1));
                    this.Annually= cnt;
                    this.AnnualResetTimestamp = DateTime.UtcNow.Year.ToString();
                    this.AnnualResetTimestampTicks = DateTime.UtcNow.Ticks;

                    somethingchaged = true;
                    
                }
            }

            if (somethingchaged)
            {
                leadcounterclient.Update(this);
            }
        
        }
    }
}