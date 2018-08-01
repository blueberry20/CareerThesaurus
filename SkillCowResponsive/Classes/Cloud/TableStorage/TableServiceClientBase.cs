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
    public abstract class TableServiceClientBase<T> where T : TableServiceEntity
    {
        private static CloudStorageAccount _storageAccount;
        private CloudTableClient _tableClient;
        protected string tableName;
        bool connected = false;


        protected TableServiceClientBase(string tableName)
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
                    //comment added just for test
                    string connectionString = "DefaultEndpointsProtocol=https; AccountName=careerthesaurus; AccountKey=52D4zWvYaIL6gfl4FUt6y8cc9Ar8UV8EWNmBttpraVkMJjcy+cOlDhiZYTnmGZLdpKV1nwlNNlGQJiqZh9rlxQ==";
                    _storageAccount = CloudStorageAccount.Parse(connectionString);
                    _tableClient = new CloudTableClient(_storageAccount.TableEndpoint.AbsoluteUri, _storageAccount.Credentials);
                    _tableClient.RetryPolicy = RetryPolicies.Retry(3, TimeSpan.FromSeconds(1));
                    if (!_tableClient.DoesTableExist(tableName))
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

            while (trycount++ < 3)
            {
                try
                {
                    TableServiceContext tableServiceContext = TableContext();
                    tableServiceContext.AddObject(tableName, newItem);
                    tableServiceContext.SaveChanges();
                    success = true;
                    returncode = 1;
                    break;
                }
                catch (Exception ex)
                {
                    if (ex.InnerException != null)
                    {
                        if (ex.InnerException.Message.Contains("EntityAlreadyExists") || ex.InnerException.Message.Contains("OutOfRange"))
                        {
                            success = true;
                            returncode = 0;
                            break;
                        }
                        else
                        {
                            returncode = 0;
                        }
                    }
                    else
                    {
                        returncode = 0;
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

            while (trycount++ < 1)
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
        public void ClearTable()
        {
            DeleteTable();
            CreateTable();
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
        public void CreateTable()
        {
            int trycount = 0;
            bool success = false;
            while (trycount++ < 2)
            {
                try
                {
                    TableClient().CreateTableIfNotExist(tableName);
                    success = true;
                    break;
                }
                catch
                {
                    Connect();
                }
            }
            if (!success)
                throw new Exception("Could not create table");
        }
        public T GetByRowKey(string rowkey)
        {
            return (from e in Entities()
                    where e.RowKey == rowkey
                    select e).SingleOrDefault();
        }

        public T GetByPartitionAndRowKey(string partitionKey, string rowkey)
        {
            try
            {
                return (from e in Entities()
                        where e.PartitionKey == partitionKey && e.RowKey == rowkey
                        select e).SingleOrDefault();
            }
            catch
            {
                return null;
            }
        }

        public CloudTableQuery<T> GetAll()
        {
            return (from e in TableContext().CreateQuery<T>(tableName)
                    select e).AsTableServiceQuery<T>();
        }
        
        public CloudTableQuery<T> GetAllByPartition(string partitionKey)
        {
            return (from e in TableContext().CreateQuery<T>(tableName)
                    where e.PartitionKey==partitionKey
                    select e).AsTableServiceQuery<T>();
        }
                
        public virtual void ExportToBlob(string partition, string targetContainer, string resourceName)
        {
            throw new Exception("Not implemented");
        }
    }
}