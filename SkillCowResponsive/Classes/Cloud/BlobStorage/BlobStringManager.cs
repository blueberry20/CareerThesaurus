using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.StorageClient;
using System.Web.Helpers;
using Microsoft.WindowsAzure.ServiceRuntime;
using System.Web.UI.WebControls;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.IO;
using System.Drawing.Imaging;
using SkillCowResponsive.Classes.Helpers;
using System.Net;

namespace SkillCowResponsive.Classes.Cloud.BlobStorage
{
    public class BlobStringManager
    {
        //private const string tableName = "EmailVerificationTable";
        private const string connectionStringName = "DataConnectionStringProd";
        private static CloudStorageAccount storageAccount;
        private CloudBlobClient blobClient;

        [ThreadStatic]
        private static BlobStringManager instance = null;
        static readonly object padlock = new object();
        
        public static BlobStringManager Instance
        {
            get
            {
                if (instance == null)
                {
                    lock (padlock)
                    {
                        if (instance == null)
                        {
                            instance = new BlobStringManager();
                        }
                    }
                }
                return instance;
            }
        }

        private BlobStringManager()
        {
            //Connect to blob service
            string connectionString = RoleEnvironment.GetConfigurationSettingValue(connectionStringName);
            storageAccount = CloudStorageAccount.Parse(connectionString);
            blobClient = storageAccount.CreateCloudBlobClient();

        }

        public bool SaveString(string value, string resourceid, string containerName, string directoryPath)
        {
            // Retrieve a reference to a container 
            CloudBlobContainer container = blobClient.GetContainerReference(containerName);
            CloudBlobDirectory dir = container.GetDirectoryReference(directoryPath);
            
            // Create the container if it doesn't already exist
            container.CreateIfNotExist();
            container.SetPermissions(new BlobContainerPermissions { PublicAccess = BlobContainerPublicAccessType.Blob });
            
            try
            {
                CloudBlob stringblob = dir.GetBlobReference(resourceid);

                string guid = ShortGuidGenerator.NewGuid();

                stringblob.UploadText(value);

                return true;
            }
            catch
            {
                return false;
            }
        }

        public string GetString(string container, string directory, string resourceid)
        {
            // Retrieve a reference to a container 
            CloudBlobContainer cont = blobClient.GetContainerReference(container);
            CloudBlobDirectory dir = cont.GetDirectoryReference(directory);
                        
            try
            {
                CloudBlob stringblob = dir.GetBlobReference(resourceid);
                return stringblob.DownloadText();
            }
            catch
            {
                return "";
            }
        }

        public bool DeleteString(string resourceid, string containerName, string directoryPath)
        {
            // Retrieve a reference to a container 
            CloudBlobContainer container = blobClient.GetContainerReference(containerName);
            CloudBlobDirectory dir = container.GetDirectoryReference(directoryPath);
                        
            try
            {
                // Retrieve reference to the stored preview blob
                CloudBlob stringblob = dir.GetBlobReference(resourceid);
                stringblob.DeleteIfExists();

                return true;
            }
            catch
            {
                return false;
            }
        }

        
    }
}