using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.StorageClient;
using Microsoft.WindowsAzure.ServiceRuntime;
using System.Data.Services.Client;


namespace SkillCowResponsive.Classes.Cloud.TableStorage
{
    public class ListRowsContinuationToken
    {
        public string PartitionKey { get; set; }
        public string RowKey { get; set; }
    }
    public abstract class ChainDateTableServiceClientBase<T> where T : TableServiceEntity
    {
        private const string connectionStringName = "DataConnectionStringProd";
        private static CloudStorageAccount _storageAccount;
        private CloudTableClient _tableClient;
        protected string tableName;
        bool connected = false;

        
        protected ChainDateTableServiceClientBase(string tableName)
        {
            this.tableName = tableName;
        }
        private void Connect()
        {
            connected = false;

            int trycount = 0;

            while (trycount++ < 3)
            {
                try
                {
                    string connectionString = RoleEnvironment.GetConfigurationSettingValue(connectionStringName);
                    _storageAccount = CloudStorageAccount.Parse(connectionString);
                    _tableClient = new CloudTableClient(_storageAccount.TableEndpoint.AbsoluteUri, _storageAccount.Credentials);
                    _tableClient.RetryPolicy = RetryPolicies.Retry(3, TimeSpan.FromSeconds(1));
                    if(!_tableClient.DoesTableExist(tableName))
                        _tableClient.CreateTableIfNotExist(tableName);

                    connected = true;
                    break;
                }
                catch
                {
                }
            }

            if (!connected)
                throw new Exception("Could not connect to table service");
        }

        private CloudTableClient TableClient()
        {
            if (!connected)
                Connect();

            return _tableClient;
        }
        protected TableServiceContext TableContext()
        {
            return TableClient().GetDataServiceContext();
        }

        protected CloudTableQuery<T> CloudQuery()
        {
            return TableContext().CreateQuery<T>(tableName).AsTableServiceQuery();
            
        }

        public DataServiceQuery<T> Entities()
        {
            return TableContext().CreateQuery<T>(tableName);   
        }

        public int AddNewItem(T newitem)
        {
            return Add(newitem);
        }
        private int Add(T newItem)
        {
            int trycount = 0;
            bool success = false;
            int returncode = 0;

            while (trycount++ < 10)
            {
                try
                {
                    TableServiceContext tableServiceContext = TableContext();
                    tableServiceContext.AddObject(tableName, newItem);
                    tableServiceContext.SaveChangesWithRetries();
                    success = true;
                    returncode = 1;
                    break;
                }
                catch(Exception ex)
                {
                    if (ex.InnerException != null)
                    {
                        if (ex.InnerException.Message.Contains("EntityAlreadyExists"))
                        {
                            success = true;
                            returncode = 0;
                            break;
                        }
                    }
                    Connect();
                }
            }
            if (!success)
                returncode = -1;

            return returncode;
        }
        public void Update(T item)
        {
            int trycount = 0;
            bool success = false;

            while (trycount++ < 10)
            {
                try
                {
                    TableServiceContext tableServiceContext = TableContext();
                    tableServiceContext.AttachTo(tableName, item, "*");
                    tableServiceContext.UpdateObject(item);
                    // Submit the operation to the table service
                    tableServiceContext.SaveChangesWithRetries();
                    success = true;
                    break;
                }
                catch
                {
                    Connect();
                }
            }
            if (!success)
                throw new Exception("Could not update " + typeof(T).Name);
        }
        public void Delete(T item)
        {
            int trycount = 0;
            bool success = false;
            while (trycount++ < 1)
            {
                try
                {
                    TableServiceContext tableServiceContext = TableContext();
                    tableServiceContext.AttachTo(tableName, item, "*");
                    tableServiceContext.DeleteObject(item);
                    tableServiceContext.SaveChangesWithRetries();
                    success = true;
                    break;
                }
                catch
                {
                    Connect();
                }
            }
            if (!success)
                throw new Exception("Could not delete " + typeof(T).Name);
        }
        public void DeleteTable()
        {
            int trycount = 0;
            bool success = false;
            while (trycount++ < 2)
            {
                try
                {
                    TableClient().DeleteTableIfExist(tableName);
                    success = true;
                    break;
                }
                catch
                {
                    Connect();
                }
            }
            if (!success)
                throw new Exception("Could not delete table");
        }
        public T GetByRowKey(string rowkey)
        {
            return (from e in Entities()
                    where e.RowKey == rowkey
                    select e).SingleOrDefault();
        }

        public T GetByPartitionAndRowKey(string partitionKeyYYYYMMDD, string rowkey)
        {
            try
            {
                return (from e in Entities()
                        where e.PartitionKey == partitionKeyYYYYMMDD && e.RowKey == rowkey
                        select e).SingleOrDefault();
            }
            catch
            {
                return null;
            }
        }

        public virtual IEnumerable<T> GetAll()
        {
            return (from e in Entities()
                    select e).AsEnumerable();
        }

        public IEnumerable<T> GetAllByPartition(string partitionkey)
        {
            try
            {
                return (from e in Entities()
                        where e.PartitionKey == partitionkey
                        select e).AsEnumerable();
            }
            catch
            {
                return null;
            }
        }

        public virtual void ExportToBlob(string partition, string targetContainer, string resourceName)
        {
            throw new Exception("Not implemented");
        }
    }
}