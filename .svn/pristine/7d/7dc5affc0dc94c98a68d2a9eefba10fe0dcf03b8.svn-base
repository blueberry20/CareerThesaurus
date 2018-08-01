using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.StorageClient;
using Microsoft.WindowsAzure.ServiceRuntime;

namespace SkillCowResponsive.Classes.Cloud.TableStorage.PendingSchool
{
    public class PendingSchoolClient : TableServiceClientBase<PendingSchool>
    {
        public PendingSchoolClient()
            :base("PendingSchool")
        {
        }
        public CloudTableQuery<PendingSchool> GetAllPending()
        {
            return (from e in Entities()
                    where e.Pending == true
                    select e).AsTableServiceQuery<PendingSchool>();
        }
        public CloudTableQuery<PendingSchool> GetAllApproved()
        {
            return (from e in Entities()
                    where e.Approved == true
                    select e).AsTableServiceQuery<PendingSchool>();
        }
        public CloudTableQuery<PendingSchool> GetAllDuplicates()
        {
            return (from e in Entities()
                    where e.Duplicate == true
                    select e).AsTableServiceQuery<PendingSchool>();
        }
        public CloudTableQuery<PendingSchool> GetAllIncorrect()
        {
            return (from e in Entities()
                    where e.Incorrect == true
                    select e).AsTableServiceQuery<PendingSchool>();
        }
        public PendingSchool GetByAdmin(string value)
        {
            return (from e in Entities()
                    where e.Admin == value && e.Pending
                    select e).SingleOrDefault();
        }
    }
}