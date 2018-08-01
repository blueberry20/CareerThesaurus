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
using SkillCow.Classes.Helpers;
using System.Net;

namespace SkillCow.Classes.Cloud.BlobStorage
{
    public class BlobJsonResourceManager
    {
        //private const string tableName = "EmailVerificationTable";
        private const string connectionStringName = "DataConnectionStringProd";
        private static CloudStorageAccount storageAccount;
        private CloudBlobClient blobClient;

        [ThreadStatic]
        private static BlobJsonResourceManager instance = null;
        static readonly object padlock = new object();
        
        public static BlobJsonResourceManager Instance
        {
            get
            {
                if (instance == null)
                {
                    lock (padlock)
                    {
                        if (instance == null)
                        {
                            instance = new BlobJsonResourceManager();
                        }
                    }
                }
                return instance;
            }
        }

        private BlobJsonResourceManager()
        {
            //Connect to blob service
            string connectionString = RoleEnvironment.GetConfigurationSettingValue(connectionStringName);
            storageAccount = CloudStorageAccount.Parse(connectionString);
            blobClient = storageAccount.CreateCloudBlobClient();

        }

        public bool SaveJsonResourceToExistingContainer(string json, string resourceid, string containerName, string directoryPath)
        {
            return SaveJsonResource(null, containerName, directoryPath, resourceid, json, false);
        }

        public bool SaveJsonResource(string json, string resourceid, string containerName, string directoryPath)
        {
            return SaveJsonResource(null, containerName, directoryPath, resourceid, json, true);
        }
        public bool SaveJsonResource(string resourcetype, string containerName, string directoryPath, string resourceid, string json)
        {
            return SaveJsonResource(resourcetype, containerName, directoryPath, resourceid, json, true);
        }
        public bool SaveJsonResource(string resourcetype, string containerName, string directoryPath, string resourceid, string json, bool ensurecontainerexists)
        {
            // Retrieve a reference to a container 
            CloudBlobContainer container = blobClient.GetContainerReference(containerName);
            CloudBlobDirectory dir = container.GetDirectoryReference(directoryPath);

            if (ensurecontainerexists)
            {
                // Create the container if it doesn't already exist
                container.CreateIfNotExist();
                container.SetPermissions(new BlobContainerPermissions { PublicAccess = BlobContainerPublicAccessType.Blob });
            }

            try
            {
                CloudBlob jsblob = dir.GetBlobReference(resourceid + ".js");
                CloudBlob jsonblob = dir.GetBlobReference(resourceid);

                string guid = ShortGuidGenerator.NewGuid();

                if (resourcetype != null)
                {
                    jsblob.UploadText("var $" + guid + " = " + json + "; $" + resourcetype + "_ready($" + guid + ",'" + containerName + "','" + resourceid + "');");
                }
                else
                {
                    jsblob.UploadText("var $" + guid + " = " + json + "; $" + resourceid.Replace("-", "") + "_ready($" + guid + ",'" + containerName + "');");
                }
                jsonblob.UploadText(json);

                return true;
            }
            catch
            {
                return false;
            }
        }

        public string GetJsonResource(string container, string directory, string resourceid)
        {
            // Retrieve a reference to a container 
            CloudBlobContainer cont = blobClient.GetContainerReference(container);
            CloudBlobDirectory dir = cont.GetDirectoryReference(directory);
                        
            try
            {
                CloudBlob jsonblob = dir.GetBlobReference(resourceid);
                return jsonblob.DownloadText();
            }
            catch
            {
                return "";
            }
        }

        public bool DeleteJsonResource(string resourceid, string containerName, string directoryPath)
        {
            // Retrieve a reference to a container 
            CloudBlobContainer container = blobClient.GetContainerReference(containerName);
            CloudBlobDirectory dir = container.GetDirectoryReference(directoryPath);
                        
            try
            {
                // Retrieve reference to the stored preview blob
                CloudBlob blobStored = dir.GetBlobReference(resourceid);
                blobStored.DeleteIfExists();

                return true;
            }
            catch
            {
                return false;
            }
        }

        
    }
}