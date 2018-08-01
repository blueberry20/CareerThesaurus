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
using System.Net;
using SkillCowResponsive.Classes.Helpers;

namespace SkillCowResponsive.Classes.Cloud.BlobStorage
{
    public class BlobJsonResourceManager
    {
        //private const string tableName = "EmailVerificationTable";
        private const string connectionStringName = "DataConnectionString";
        private static CloudStorageAccount storageAccount;
        private CloudBlobClient blobClient;

        [ThreadStatic]
        private static BlobJsonResourceManager instance = null;
        static readonly object padlock = new object();
                

        public BlobJsonResourceManager()
        {
            //Connect to blob service
            string connectionString = "DefaultEndpointsProtocol=https; AccountName=careerthesaurus; AccountKey=52D4zWvYaIL6gfl4FUt6y8cc9Ar8UV8EWNmBttpraVkMJjcy+cOlDhiZYTnmGZLdpKV1nwlNNlGQJiqZh9rlxQ==";
            storageAccount = CloudStorageAccount.Parse(connectionString);
            blobClient = storageAccount.CreateCloudBlobClient();

        }

        public bool SaveJsonResource(string json, string resourceid, string containerName, string directoryPath)
        {
            return SaveJsonResource(null, containerName, directoryPath, resourceid, json);
        }
        public bool SaveJsonResource(string resourcetype, string containerName, string directoryPath, string resourceid, string json)
        {
            // Retrieve a reference to a container 
            CloudBlobContainer container = blobClient.GetContainerReference(containerName);

            string[] pathTokens = directoryPath.Split('/');
            CloudBlobDirectory dir = container.GetDirectoryReference(pathTokens[0]);
            if (pathTokens.Length > 1)
            {
                for (var i = 1; i < pathTokens.Length; i++)
                {
                    dir = dir.GetSubdirectory(pathTokens[i]);
                }
            }
                        
            // Create the container if it doesn't already exist
            container.CreateIfNotExist();
            container.SetPermissions(new BlobContainerPermissions { PublicAccess = BlobContainerPublicAccessType.Blob });
            
            try
            {
                CloudBlob jsblob = dir.GetBlobReference(resourceid + ".js");
                
                string guid = ShortGuidGenerator.NewGuid();

                if (resourcetype != null)
                {
                    jsblob.UploadText("var $" + guid + " = " + json + "; $" + resourcetype + "_ready($" + guid + ",'" + containerName + "', '" + resourceid + "', '" + directoryPath + "');");
                }
                else
                {
                    jsblob.UploadText("var $" + guid + " = " + json + "; $" + resourceid.Replace("-", "") + "_ready($" + guid + ",'" + containerName + "', '" + directoryPath + "');");
                }
                
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