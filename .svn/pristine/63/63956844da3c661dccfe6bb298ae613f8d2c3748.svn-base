using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.WindowsAzure.StorageClient;

namespace SkillCow.Classes.Cloud.TableStorage.ABTests
{
    public class ABTestResult
    {
        public string Goal { get; set; }
        public string Module { get; set; }
        public string View { get; set; }

        public string CbnCampaign { get; set; }
        public string UtmSource { get; set; }
        public string UtmCampaign { get; set; }
        public string UtmContent { get; set; }
        public string UtmTerm { get; set; }
        
        public string TestID { get; set; }
        public long UniqueVisitors { get; set; }
        public long TotalViews { get; set; }
        public long ConversionCount { get; set; }
        public long ConversionWeightSum { get; set; }

        public double AverageConversionWeight { get { return Ratio(ConversionWeightSum, ConversionCount); } }

        public double ConversionsToUniquesRatio { get { return Ratio(ConversionCount, UniqueVisitors); } }
        public double WeightedConversionToUniquesRatio { get { return Ratio(ConversionWeightSum, UniqueVisitors); } }
        public double ConversionsToViewsRatio { get { return Ratio(ConversionCount, TotalViews ); } }
        public double WeightedConversionToViewsRatio { get { return Ratio(ConversionWeightSum, TotalViews); } }

        private double Ratio(long numerator, long denomenator)
        {
            if (denomenator > 0)
            {
                return (double)numerator / (double)denomenator;
            }
            else
                return 0;
            
        }
                
        public static IEnumerable<ABTestResult> GetResultsByGoal(string goal, string asofdate)
        {
            Dictionary<string, long> impressions = new Dictionary<string, long>();
            Dictionary<string, long> conversions = new Dictionary<string, long>();
            Dictionary<string, long> totalweight = new Dictionary<string, long>();
            Dictionary<string, long> totalviews = new Dictionary<string, long>();

            ABTestImpressionClient abtic = new ABTestImpressionClient();
            CloudTableQuery<ABTestImpression> impressionQuery = abtic.GetAllByGoal(goal, asofdate);
            foreach (var i in impressionQuery.Execute())
            {
                if (impressions.ContainsKey(i.TestID))
                    impressions[i.TestID]++;
                else
                    impressions[i.TestID] = 1;
            }

            ABTestConversionClient abtcc = new ABTestConversionClient();
            CloudTableQuery<ABTestConversion> conversionQuery = abtcc.GetAllByGoal(goal, asofdate);
            foreach (var c in conversionQuery.Execute())
            {
                if (conversions.ContainsKey(c.TestID))
                {
                    conversions[c.TestID]++;
                    totalweight[c.TestID] += c.Weight;
                    totalviews[c.TestID] += c.Views;
                }
                else
                {
                    conversions[c.TestID] = 1;
                    totalweight[c.TestID] = c.Weight;
                    totalviews[c.TestID] = c.Views;
                }
            }
            List<ABTestResult> results = new List<ABTestResult>();
            foreach (var k in impressions.Keys)
            {
                results.Add(new ABTestResult
                {
                    TestID = k
                    ,
                    UniqueVisitors = impressions.ContainsKey(k) ? impressions[k] : 0
                    ,
                    TotalViews = totalviews.ContainsKey(k) ? totalviews[k] : 0
                    ,
                    ConversionCount = conversions.ContainsKey(k) ? conversions[k] : 0
                    ,
                    ConversionWeightSum = totalweight.ContainsKey(k) ? totalweight[k] : 0
                });
            }

            return results;
        }
    }
}