using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.StorageClient;
using Microsoft.WindowsAzure.ServiceRuntime;


namespace SkillCow.Classes.Cloud.TableStorage.PersonalityTests.SkillCowRequestSubmissions
{
    public class SkillCowRequestSubmissionClient : ChainDateTableServiceClientBase<SkillCowRequestSubmission>
    {
        public SkillCowRequestSubmissionClient()
            : base("skillcowrequestsubmission")
        {
        }

        public CloudTableQuery<SkillCowRequestSubmission> GetAllByClient(string partitionKeyYYYYMMDD, string clientid)
        {
            return (from e in TableContext().CreateQuery<SkillCowRequestSubmission>(tableName)
                    where e.PartitionKey == partitionKeyYYYYMMDD && e.ClientType == "Direct" && e.ClientId == clientid
                    select e).AsTableServiceQuery<SkillCowRequestSubmission>();
        }

        public CloudTableQuery<SkillCowRequestSubmission> GetAll(string partitionKeyYYYYMMDD)
        {
            // Specify a partition query, using "Smith" as the partition key,
            // with the row key being up to the letter "E"

            if (partitionKeyYYYYMMDD != null && partitionKeyYYYYMMDD != "")
            {
                return (from e in TableContext().CreateQuery<SkillCowRequestSubmission>(tableName)
                        where e.PartitionKey == partitionKeyYYYYMMDD
                        select e).AsTableServiceQuery<SkillCowRequestSubmission>();
            }
            else
            {
                return (from e in TableContext().CreateQuery<SkillCowRequestSubmission>(tableName)
                        select e).AsTableServiceQuery<SkillCowRequestSubmission>();
            }
        }

        public CloudTableQuery<SkillCowRequestSubmission> ByCampaign(string partitionKeyYYYYMMDD, string campaignid)
        {
            // Specify a partition query, using "Smith" as the partition key,
            // with the row key being up to the letter "E"

            if (partitionKeyYYYYMMDD != null && partitionKeyYYYYMMDD != "")
            {
                return (from e in TableContext().CreateQuery<SkillCowRequestSubmission>(tableName)
                        where e.PartitionKey == partitionKeyYYYYMMDD && e.CampaignId==campaignid
                        select e).AsTableServiceQuery<SkillCowRequestSubmission>();
            }
            else
            {
                return (from e in TableContext().CreateQuery<SkillCowRequestSubmission>(tableName)
                        where  e.CampaignId==campaignid
                        select e).AsTableServiceQuery<SkillCowRequestSubmission>();
            }
        }
        public CloudTableQuery<SkillCowRequestSubmission> ByDayAndAgent(string partitionKeyYYYYMMDD, string agentid)
        {
            // Specify a partition query, using "Smith" as the partition key,
            // with the row key being up to the letter "E"

            return (from e in TableContext().CreateQuery<SkillCowRequestSubmission>(tableName)
                    where e.PartitionKey == partitionKeyYYYYMMDD && e.UtmContent == agentid
                    select e).AsTableServiceQuery<SkillCowRequestSubmission>();
            
        }

        public List<SkillCowRequestSubmission> GetByUtmSource(DateTime startdate, DateTime enddate, string source)
        {
            List<SkillCowRequestSubmission> allrecords = new List<SkillCowRequestSubmission>();

            DateTime cursordate = startdate;

            while (cursordate <= enddate)
            {
                CloudTableQuery<SkillCowRequestSubmission> query = this.GetAll(cursordate.ToString("yyyyMMdd"));
                allrecords.AddRange(query.Execute().Where(x => x.UtmSource == source).OrderBy(x => x.Timestamp));
                cursordate = cursordate.AddDays(1);
            }

            return allrecords;
        }
        public List<SkillCowRequestSubmission> GetKioskLeads(DateTime startdate, DateTime enddate)
        {
            List<SkillCowRequestSubmission> allrecords = new List<SkillCowRequestSubmission>();

            DateTime cursordate = startdate;

            while (cursordate <= enddate)
            {
                CloudTableQuery<SkillCowRequestSubmission> query = null;

                query = (from e in TableContext().CreateQuery<SkillCowRequestSubmission>(tableName)
                    where e.PartitionKey == cursordate.ToString("yyyyMMdd")
                    && e.UtmSource == "Kiosks"
                    && e.SourceForm == "schoolform"
                    select e).AsTableServiceQuery<SkillCowRequestSubmission>();
                    
                allrecords.AddRange(query.Execute().OrderBy(x => x.Timestamp));
                cursordate = cursordate.AddDays(1);
            }

            return allrecords;
        }

        public List<SkillCowRequestSubmission> GetByUtmCampaign(DateTime startdate, DateTime enddate, string source, string campaign)
        {
            List<SkillCowRequestSubmission> allrecords = new List<SkillCowRequestSubmission>();

            DateTime cursordate = startdate;

            while (cursordate <= enddate)
            {
                CloudTableQuery<SkillCowRequestSubmission> query = this.GetAll(cursordate.ToString("yyyyMMdd"));
                allrecords.AddRange(query.Execute().Where(x => x.UtmSource == source && x.UtmCampaign == campaign).OrderBy(x => x.Timestamp));
                cursordate = cursordate.AddDays(1);
            }

            return allrecords;
        }
        public List<SkillCowRequestSubmission> GetByUtmContent(DateTime startdate, DateTime enddate, string source, string content)
        {
            List<SkillCowRequestSubmission> allrecords = new List<SkillCowRequestSubmission>();

            DateTime cursordate = startdate;

            while (cursordate <= enddate)
            {
                CloudTableQuery<SkillCowRequestSubmission> query = this.GetAll(cursordate.ToString("yyyyMMdd"));
                allrecords.AddRange(query.Execute().Where(x => x.UtmSource == source && x.UtmContent == content).OrderBy(x => x.Timestamp));
                cursordate = cursordate.AddDays(1);
            }

            return allrecords;
        }
    }
}