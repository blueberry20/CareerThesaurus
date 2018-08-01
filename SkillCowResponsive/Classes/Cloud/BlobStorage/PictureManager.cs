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
    public class PictureManager
    {
        //private const string tableName = "EmailVerificationTable";
        private const string connectionStringName = "DataConnectionStringProd";
        private static CloudStorageAccount storageAccount;
        private CloudBlobClient blobClient;

        [ThreadStatic]
        private static PictureManager instance = null;
        static readonly object padlock = new object();

        public static PictureManager Instance
        {
            get
            {
                if (instance == null)
                {
                    lock (padlock)
                    {
                        if (instance == null)
                        {
                            instance = new PictureManager();
                        }
                    }
                }
                return instance;
            }
        }

        public PictureManager()
        {
            //Connect to blob service
            //string connectionString = RoleEnvironment.GetConfigurationSettingValue(connectionStringName);
            string connectionString = "DefaultEndpointsProtocol=https; AccountName=careerthesaurus; AccountKey=52D4zWvYaIL6gfl4FUt6y8cc9Ar8UV8EWNmBttpraVkMJjcy+cOlDhiZYTnmGZLdpKV1nwlNNlGQJiqZh9rlxQ==";
            storageAccount = CloudStorageAccount.Parse(connectionString);
            blobClient = storageAccount.CreateCloudBlobClient();

        }
        

        public bool ConvertPictureToJpeg(string pictureId, string containerName, string directoryPath)
        {
            try
            {
                // Retrieve a reference to a container 
                CloudBlobContainer sourceContainer = blobClient.GetContainerReference(containerName);
                CloudBlobDirectory sourceDir = sourceContainer.GetDirectoryReference(directoryPath);

                // Retrieve reference to the stored preview blob
                CloudBlob sourceBlob = sourceDir.GetBlobReference(pictureId);

                System.Drawing.Image imgStored;
                using (MemoryStream ms = new MemoryStream())
                {
                    sourceBlob.DownloadToStream(ms);
                    imgStored = System.Drawing.Image.FromStream(ms);
                }

                if (imgStored != null)
                {
                    UploadPictureToBlobStorage(imgStored, pictureId, containerName, directoryPath, 540, 540, 140, 140, true, false, 80);
                }

                return true;
            }
            catch
            {
                return false;
            }
        }

        public bool MovePicture(string sourcePictureId, string sourceContainerName, string sourceDirectoryPath, string targetPictureId, string targetContainerName, string targetDirectoryPath)
        {
            try
            {
                // Retrieve a reference to a container 
                CloudBlobContainer sourceContainer = blobClient.GetContainerReference(sourceContainerName);
                CloudBlobDirectory sourceDir = sourceContainer.GetDirectoryReference(sourceDirectoryPath);

                CloudBlobContainer targetContainer = blobClient.GetContainerReference(targetContainerName);
                CloudBlobDirectory targetDir = targetContainer.GetDirectoryReference(targetDirectoryPath);

                // Create the Target container if it doesn't already exist
                targetContainer.CreateIfNotExist();
                targetContainer.SetPermissions(new BlobContainerPermissions { PublicAccess = BlobContainerPublicAccessType.Blob });

                // Retrieve reference to the stored preview blob
                CloudBlob sourceBlob = sourceDir.GetBlobReference(sourcePictureId);

                System.Drawing.Image imgStored;
                using (MemoryStream ms = new MemoryStream())
                {
                    sourceBlob.DownloadToStream(ms);
                    imgStored = System.Drawing.Image.FromStream(ms);
                }

                CloudBlob targetBlob = targetDir.GetBlobReference(targetPictureId);
                using (MemoryStream ms = new MemoryStream())
                {
                    imgStored.Save(ms, ImageFormat.Png);
                    targetBlob.UploadByteArray(ms.ToArray());
                }

                sourceBlob.DeleteIfExists();

                return true;
            }
            catch
            {
                return false;
            }
        }

        public bool UploadRawImage(WebImage img, string newid, string containerName, string directoryPath)
        {
            System.Drawing.Image imgConverted;
            using (MemoryStream ms = new MemoryStream(img.GetBytes()))
            {
                imgConverted = System.Drawing.Image.FromStream(ms);
            }
            return UploadRawImage(imgConverted, newid, containerName, directoryPath);
        }
        public bool UploadRawImage(System.Drawing.Image img, string newid, string containerName, string directoryPath)
        {
            try
            {
                CloudBlobContainer container = blobClient.GetContainerReference(containerName);
                CloudBlobDirectory dir = container.GetDirectoryReference(directoryPath);

                // Create the container if it doesn't already exist
                container.CreateIfNotExist();
                container.SetPermissions(new BlobContainerPermissions { PublicAccess = BlobContainerPublicAccessType.Blob });

                System.Drawing.Image imgFull = (System.Drawing.Image)img.Clone();

                // Retrieve reference to a blob by username
                CloudBlob blobFull = dir.GetBlobReference(newid);
                using (MemoryStream ms = new MemoryStream())
                {
                    imgFull.Save(ms, ImageFormat.Png);
                    blobFull.UploadByteArray(ms.ToArray());
                }
                return true;
            }
            catch
            {
                return false;
            }
        }

        public bool UploadPictureToBlobStorage(WebImage img, string newid, string containerName, string directoryPath, int maxWidth, int maxHeight, int maxWidthT, int maxHeightT, bool createArtifactThumbnails, bool makeSquare)
        {
            return UploadPictureToBlobStorage(img, newid, containerName, directoryPath, maxWidth, maxHeight, maxWidthT, maxHeightT, createArtifactThumbnails, makeSquare, 80);
        }
        public bool UploadPictureToBlobStorage(WebImage img, string newid, string containerName, string directoryPath, int maxWidth, int maxHeight, int maxWidthT, int maxHeightT, bool createArtifactThumbnails, bool makeSquare, long jpegquality)
        {
            System.Drawing.Image imgConverted;
            using (MemoryStream ms = new MemoryStream(img.GetBytes()))
            {
                imgConverted = System.Drawing.Image.FromStream(ms);
            }

            return UploadPictureToBlobStorage(imgConverted, newid, containerName, directoryPath, maxWidth, maxHeight, maxWidthT, maxHeightT, createArtifactThumbnails, makeSquare, jpegquality);
        }

        public bool UploadPictureToBlobStorage(System.Drawing.Image img, string newid, string containerName, string directoryPath, int maxWidth, int maxHeight, int maxWidthT, int maxHeightT, bool createArtifactThumbnails, bool makeSquare)
        {
            return UploadPictureToBlobStorage(img, newid, containerName, directoryPath, maxWidth, maxHeight, maxWidthT, maxHeightT, createArtifactThumbnails, makeSquare, 80L);
        }
        public bool UploadPictureToBlobStorage(System.Drawing.Image img, string newid, string containerName, string directoryPath, int maxWidth, int maxHeight, int maxWidthT, int maxHeightT, bool createArtifactThumbnails, bool makeSquare, long jpegquality)
        {
            // Retrieve a reference to a container 
            CloudBlobContainer container = blobClient.GetContainerReference(containerName);
            CloudBlobDirectory dir = container.GetDirectoryReference(directoryPath);

            // Create the container if it doesn't already exist
            container.CreateIfNotExist();
            container.SetPermissions(new BlobContainerPermissions { PublicAccess = BlobContainerPublicAccessType.Blob });

            System.Drawing.Image imgFull = (System.Drawing.Image)img.Clone();
            System.Drawing.Image imgThumb = (System.Drawing.Image)img.Clone();
            System.Drawing.Image imgThumb20 = (System.Drawing.Image)img.Clone();
            System.Drawing.Image imgThumb40 = (System.Drawing.Image)img.Clone();

            System.Drawing.Image imgFullSquare = null;
            imgFullSquare = makeItSquare(img);

            int MAX_WIDTH = maxWidth;
            int MAX_HEIGHT = maxHeight;
            int MAX_WIDTH_T = maxWidthT;
            int MAX_HEIGHT_T = maxHeightT;

            try
            {
                if (maxWidthT > 0)
                {
                    if (imgThumb.Width > MAX_WIDTH_T || imgThumb.Height > MAX_HEIGHT_T)
                    {
                        imgThumb = resizeImage(imgFullSquare, new Size(MAX_WIDTH_T, MAX_HEIGHT_T), new Point(0, 0), new Size(imgFullSquare.Width, imgFullSquare.Height), true);
                        imgThumb20 = resizeImage(imgFullSquare, new Size(20, 20), new Point(0, 0), new Size(imgFullSquare.Width, imgFullSquare.Height), true);
                        imgThumb40 = resizeImage(imgFullSquare, new Size(40, 40), new Point(0, 0), new Size(imgFullSquare.Width, imgFullSquare.Height), true);
                    }
                }

                if (makeSquare)
                    imgFull = resizeImage(imgFullSquare, new Size(MAX_WIDTH, MAX_HEIGHT), new Point(0, 0), new Size(imgFullSquare.Width, imgFullSquare.Height), makeSquare);
                else
                    imgFull = resizeImage(imgFull, new Size(MAX_WIDTH, MAX_HEIGHT), new Point(0, 0), new Size(imgFull.Width, imgFull.Height), makeSquare);


                // Retrieve reference to a blob by username
                CloudBlob blobFull = dir.GetBlobReference(newid);
                using (MemoryStream ms = new MemoryStream())
                {
                    SaveImageAsJpeg(ms, imgFull, jpegquality);
                    //imgFull.Save(ms, ImageFormat.Png);
                    blobFull.UploadByteArray(ms.ToArray());
                }

                if (maxWidthT > 0)
                {
                    CloudBlob blobThumb = dir.GetBlobReference(newid + "_t");
                    using (MemoryStream ms = new MemoryStream())
                    {
                        SaveImageAsJpeg(ms, imgThumb, jpegquality);
                        //imgThumb.Save(ms, ImageFormat.Png);
                        blobThumb.UploadByteArray(ms.ToArray());
                    }

                    if (createArtifactThumbnails)
                    {
                        CloudBlob blobThumb20 = dir.GetBlobReference(newid + "_t20");
                        using (MemoryStream ms = new MemoryStream())
                        {
                            SaveImageAsJpeg(ms, imgThumb20, jpegquality);
                            //imgThumb.Save(ms, ImageFormat.Png);
                            blobThumb20.UploadByteArray(ms.ToArray());
                        }

                        CloudBlob blobThumb40 = dir.GetBlobReference(newid + "_t40");
                        using (MemoryStream ms = new MemoryStream())
                        {
                            SaveImageAsJpeg(ms, imgThumb40, jpegquality);
                            //imgThumb.Save(ms, ImageFormat.Png);
                            blobThumb40.UploadByteArray(ms.ToArray());
                        }
                    }
                }

                if (createArtifactThumbnails)
                {
                    System.Drawing.Image imgFullBW = GraphicsHelper.MakeGrayscale3(imgFull);
                    //System.Drawing.Image imgFullR = GraphicsHelper.OvalImage(imgFull);
                    //System.Drawing.Image imgFullBWR = GraphicsHelper.OvalImage(imgFullBW);

                    System.Drawing.Image imgThumbBW = null;
                    System.Drawing.Image imgThumbR = null;
                    System.Drawing.Image imgThumbBWR = null;

                    if (maxWidthT > 0)
                    {
                        imgThumbBW = GraphicsHelper.MakeGrayscale3(imgThumb);
                        imgThumbR = GraphicsHelper.OvalImage(imgThumb);
                        imgThumbBWR = GraphicsHelper.OvalImage(imgThumbBW);
                    }

                    //CloudBlob blobFullBW = dir.GetBlobReference(newid + "_bw");
                    //using (MemoryStream ms = new MemoryStream())
                    //{
                    //    SaveImageAsJpeg(ms, imgFullBW, jpegquality);
                    //    //imgFullBW.Save(ms, ImageFormat.Png);
                    //    blobFullBW.UploadByteArray(ms.ToArray());
                    //}
                    //CloudBlob blobFullR = dir.GetBlobReference(newid + "_r");
                    //using (MemoryStream ms = new MemoryStream())
                    //{
                    //    imgFullR.Save(ms, ImageFormat.Png);
                    //    blobFullR.UploadByteArray(ms.ToArray());
                    //}
                    //CloudBlob blobFullBWR = dir.GetBlobReference(newid + "_bwr");
                    //using (MemoryStream ms = new MemoryStream())
                    //{
                    //    imgFullBWR.Save(ms, ImageFormat.Png);
                    //    blobFullBWR.UploadByteArray(ms.ToArray());
                    //}


                    if (maxWidthT > 0)
                    {
                        CloudBlob blobThumbBW = dir.GetBlobReference(newid + "_tbw");
                        using (MemoryStream ms = new MemoryStream())
                        {
                            SaveImageAsJpeg(ms, imgThumbBW, jpegquality);
                            //imgThumbBW.Save(ms, ImageFormat.Png);
                            blobThumbBW.UploadByteArray(ms.ToArray());
                        }
                        CloudBlob blobThumbR = dir.GetBlobReference(newid + "_tr");
                        using (MemoryStream ms = new MemoryStream())
                        {
                            //SaveImageAsJpeg(ms, imgThumbR, jpegquality);
                            imgThumbR.Save(ms, ImageFormat.Png);
                            blobThumbR.UploadByteArray(ms.ToArray());
                        }
                        CloudBlob blobThumbBWR = dir.GetBlobReference(newid + "_tbwr");
                        using (MemoryStream ms = new MemoryStream())
                        {
                            //SaveImageAsJpeg(ms, imgThumbBWR, jpegquality);
                            imgThumbBWR.Save(ms, ImageFormat.Png);
                            blobThumbBWR.UploadByteArray(ms.ToArray());
                        }
                    }
                }

                return true;
            }
            catch
            {
                return false;
            }
        }

        public bool ResizeAndSave(string id, string newid, string containerName, string directoryPath, int maxWidth, int maxHeight, int maxWidthT, int maxHeightT, int xoffset, int yoffset, int rwidth, int rheight, long jpegquality)
        {


            // Retrieve a reference to a container 
            CloudBlobContainer container = blobClient.GetContainerReference(containerName);
            CloudBlobDirectory dir = container.GetDirectoryReference(directoryPath);

            // Retrieve reference to the stored preview blob
            CloudBlob blobStored = dir.GetBlobReference(id);

            System.Drawing.Image imgStored;
            using (MemoryStream ms = new MemoryStream())
            {
                blobStored.DownloadToStream(ms);
                imgStored = System.Drawing.Image.FromStream(ms);
            }

            System.Drawing.Image imgFull = null;
            System.Drawing.Image imgThumb = null;
            System.Drawing.Image imgThumb20 = null;
            System.Drawing.Image imgThumb40 = null;

            int MAX_WIDTH = maxWidth;
            int MAX_HEIGHT = maxHeight;
            int MAX_WIDTH_T = maxWidthT;
            int MAX_HEIGHT_T = maxHeightT;

            try
            {
                imgFull = resizeImage(imgStored, new Size(MAX_WIDTH, MAX_HEIGHT), new Point(xoffset, yoffset), new Size(rwidth, rheight), true);

                if (maxWidthT > 0)
                {
                    if (imgStored.Width > MAX_WIDTH_T || imgStored.Height > MAX_HEIGHT_T)
                    {
                        imgThumb = resizeImage(imgFull, new Size(MAX_WIDTH_T, MAX_HEIGHT_T), new Point(0, 0), new Size(imgFull.Width, imgFull.Height), true);
                        imgThumb20 = resizeImage(imgFull, new Size(20, 20), new Point(0, 0), new Size(imgFull.Width, imgFull.Height), true);
                        imgThumb40 = resizeImage(imgFull, new Size(40, 40), new Point(0, 0), new Size(imgFull.Width, imgFull.Height), true);
                    }
                }

                System.Drawing.Image imgFullBW = GraphicsHelper.MakeGrayscale3(imgFull);

                System.Drawing.Image imgThumbBW = null;
                System.Drawing.Image imgThumbR = null;
                System.Drawing.Image imgThumbBWR = null;

                if (maxWidthT > 0)
                {
                    imgThumbBW = GraphicsHelper.MakeGrayscale3(imgThumb);
                    imgThumbR = GraphicsHelper.OvalImage(imgThumb);
                    imgThumbBWR = GraphicsHelper.OvalImage(imgThumbBW);
                }

                // Retrieve reference to a blob by username
                CloudBlob blobFull = dir.GetBlobReference(newid);
                using (MemoryStream ms = new MemoryStream())
                {
                    SaveImageAsJpeg(ms, imgFull, jpegquality);
                    //imgFull.Save(ms, ImageFormat.Png);
                    blobFull.UploadByteArray(ms.ToArray());
                }
                //CloudBlob blobFullBW = dir.GetBlobReference(newid + "_bw");
                //using (MemoryStream ms = new MemoryStream())
                //{
                //    imgFullBW.Save(ms, ImageFormat.Png);
                //    blobFullBW.UploadByteArray(ms.ToArray());
                //}
                //CloudBlob blobFullR = dir.GetBlobReference(newid + "_r");
                //using (MemoryStream ms = new MemoryStream())
                //{
                //    imgFullR.Save(ms, ImageFormat.Png);
                //    blobFullR.UploadByteArray(ms.ToArray());
                //}
                //CloudBlob blobFullBWR = dir.GetBlobReference(newid + "_bwr");
                //using (MemoryStream ms = new MemoryStream())
                //{
                //    imgFullBWR.Save(ms, ImageFormat.Png);
                //    blobFullBWR.UploadByteArray(ms.ToArray());
                //}


                if (maxWidthT > 0)
                {
                    CloudBlob blobThumb = dir.GetBlobReference(newid + "_t");
                    using (MemoryStream ms = new MemoryStream())
                    {
                        SaveImageAsJpeg(ms, imgThumb, jpegquality);
                        //imgThumb.Save(ms, ImageFormat.Png);
                        blobThumb.UploadByteArray(ms.ToArray());
                    }

                    CloudBlob blobThumb20 = dir.GetBlobReference(newid + "_t20");
                    using (MemoryStream ms = new MemoryStream())
                    {
                        SaveImageAsJpeg(ms, imgThumb20, jpegquality);
                        //imgThumb.Save(ms, ImageFormat.Png);
                        blobThumb20.UploadByteArray(ms.ToArray());
                    }

                    CloudBlob blobThumb40 = dir.GetBlobReference(newid + "_t40");
                    using (MemoryStream ms = new MemoryStream())
                    {
                        SaveImageAsJpeg(ms, imgThumb40, jpegquality);
                        //imgThumb.Save(ms, ImageFormat.Png);
                        blobThumb40.UploadByteArray(ms.ToArray());
                    }


                    CloudBlob blobThumbBW = dir.GetBlobReference(newid + "_tbw");
                    using (MemoryStream ms = new MemoryStream())
                    {
                        SaveImageAsJpeg(ms, imgThumbBW, jpegquality);
                        //imgThumbBW.Save(ms, ImageFormat.Png);
                        blobThumbBW.UploadByteArray(ms.ToArray());
                    }
                    CloudBlob blobThumbR = dir.GetBlobReference(newid + "_tr");
                    using (MemoryStream ms = new MemoryStream())
                    {
                        //SaveImageAsJpeg(ms, imgThumbR, jpegquality);
                        imgThumbR.Save(ms, ImageFormat.Png);
                        blobThumbR.UploadByteArray(ms.ToArray());
                    }
                    CloudBlob blobThumbBWR = dir.GetBlobReference(newid + "_tbwr");
                    using (MemoryStream ms = new MemoryStream())
                    {
                        //SaveImageAsJpeg(ms, imgThumbBWR, jpegquality);
                        imgThumbBWR.Save(ms, ImageFormat.Png);
                        blobThumbBWR.UploadByteArray(ms.ToArray());
                    }
                }

                blobStored.DeleteIfExists();

                return true;
            }
            catch
            {
                return false;
            }
        }

        public bool RotateCW(string id, string containerName, string directoryPath, int maxWidth, int maxHeight, int maxWidthT, int maxHeightT)
        {
            // Retrieve a reference to a container 
            CloudBlobContainer container = blobClient.GetContainerReference(containerName);
            CloudBlobDirectory dir = container.GetDirectoryReference(directoryPath);

            // Retrieve reference to the stored preview blob
            CloudBlob blobStored = dir.GetBlobReference(id);

            System.Drawing.Image imgStored;
            using (MemoryStream ms = new MemoryStream())
            {
                blobStored.DownloadToStream(ms);
                imgStored = System.Drawing.Image.FromStream(ms);
            }

            imgStored.RotateFlip(RotateFlipType.Rotate90FlipNone);

            UploadPictureToBlobStorage(imgStored, "pic", containerName, "pictures", maxWidth, maxHeight, maxWidthT, maxHeightT, true, false, 100L);

            return true;
        }

        public bool RotateCCW(string id, string containerName, string directoryPath, int maxWidth, int maxHeight, int maxWidthT, int maxHeightT)
        {
            // Retrieve a reference to a container 
            CloudBlobContainer container = blobClient.GetContainerReference(containerName);
            CloudBlobDirectory dir = container.GetDirectoryReference(directoryPath);

            // Retrieve reference to the stored preview blob
            CloudBlob blobStored = dir.GetBlobReference(id);

            System.Drawing.Image imgStored;
            using (MemoryStream ms = new MemoryStream())
            {
                blobStored.DownloadToStream(ms);
                imgStored = System.Drawing.Image.FromStream(ms);
            }

            imgStored.RotateFlip(RotateFlipType.Rotate270FlipNone);

            UploadPictureToBlobStorage(imgStored, "pic", containerName, "pictures", maxWidth, maxHeight, maxWidthT, maxHeightT, true, false, 100L);

            return true;
        }
        public bool Reprocess(string id, string containerName, string directoryPath, int maxWidth, int maxHeight, int maxWidthT, int maxHeightT)
        {
            // Retrieve a reference to a container 
            CloudBlobContainer container = blobClient.GetContainerReference(containerName);
            CloudBlobDirectory dir = container.GetDirectoryReference(directoryPath);

            // Retrieve reference to the stored preview blob
            CloudBlob blobStored = dir.GetBlobReference(id);

            System.Drawing.Image imgStored;
            using (MemoryStream ms = new MemoryStream())
            {
                blobStored.DownloadToStream(ms);
                imgStored = System.Drawing.Image.FromStream(ms);
            }

            UploadPictureToBlobStorage(imgStored, "pic", containerName, "pictures", maxWidth, maxHeight, maxWidthT, maxHeightT, true, false, 100L);

            return true;
        }
        public bool DeletePicture(string id, string containerName, string directoryPath)
        {
            // Retrieve a reference to a container 
            CloudBlobContainer container = blobClient.GetContainerReference(containerName);
            CloudBlobDirectory dir = container.GetDirectoryReference(directoryPath);


            try
            {
                // Retrieve reference to the stored preview blob
                CloudBlob blobStored = dir.GetBlobReference(id);
                blobStored.DeleteIfExists();

                CloudBlob blobStoredT = dir.GetBlobReference(id + "_t");
                blobStoredT.DeleteIfExists();


                return true;
            }
            catch
            {
                return false;
            }
        }

        private static System.Drawing.Image resizeImage(System.Drawing.Image imgToResize, Size targetSize, Point startingPoint, Size sourceSize, bool makeSquare)
        {
            int sourceWidth = imgToResize.Width;
            int sourceHeight = imgToResize.Height;

            float nPercent = 0;
            float nPercentW = 0;
            float nPercentH = 0;

            nPercentW = ((float)targetSize.Width / (float)sourceWidth);
            nPercentH = ((float)targetSize.Height / (float)sourceHeight);

            if (nPercentH < nPercentW)
                nPercent = nPercentH;
            else
                nPercent = nPercentW;

            int destWidth = (int)(sourceWidth * nPercent);
            int destHeight = (int)(sourceHeight * nPercent);

            if (makeSquare)
            {
                if (destWidth > destHeight)
                    destWidth = destHeight;
                else
                    destHeight = destWidth;
            }

            Bitmap b = new Bitmap(destWidth, destHeight);
            Graphics g = Graphics.FromImage((System.Drawing.Image)b);
            g.InterpolationMode = InterpolationMode.HighQualityBicubic;
            g.DrawImage(imgToResize, new Rectangle(0, 0, destWidth, destHeight), new Rectangle(startingPoint, sourceSize), GraphicsUnit.Pixel);
            g.Dispose();

            return (System.Drawing.Image)b;
        }

        private static System.Drawing.Image makeItSquare(System.Drawing.Image imgToResize)
        {
            int sourceWidth = imgToResize.Width;
            int sourceHeight = imgToResize.Height;

            int startingx, startingy, newwidth, newheight;

            if (sourceWidth == sourceHeight)
            {
                return (System.Drawing.Image)imgToResize.Clone();
            }
            else if (sourceWidth > sourceHeight)
            {
                startingx = (sourceWidth - sourceHeight) / 2;
                startingy = 0;
                newwidth = sourceHeight;
                newheight = newwidth;
            }
            else
            {
                startingx = 0;
                startingy = (sourceHeight - sourceWidth) / 2;
                newwidth = sourceWidth;
                newheight = newwidth;
            }

            Bitmap b = new Bitmap(newwidth, newheight);
            Graphics g = Graphics.FromImage((System.Drawing.Image)b);
            g.InterpolationMode = InterpolationMode.HighQualityBicubic;
            g.DrawImage(imgToResize, new Rectangle(0, 0, newwidth, newheight), new Rectangle(startingx, startingy, newwidth, newheight), GraphicsUnit.Pixel);
            g.Dispose();

            return (System.Drawing.Image)b;
        }

        public IEnumerable<IListBlobItem> ListBlobs(string containerName, string directoryPath)
        {
            // Retrieve a reference to a container 
            CloudBlobContainer container = blobClient.GetContainerReference(containerName);

            CloudBlobDirectory dir = container.GetDirectoryReference(directoryPath);

            if (dir == null)
                return null;
            var a = dir.ListBlobsSegmented(null);
            
            return dir.ListBlobs();
        }
        public IEnumerable<IListBlobItem> ListBlobsSegmented(string containerName, string directoryPath)
        {
            // Retrieve a reference to a container 
            CloudBlobContainer container = blobClient.GetContainerReference(containerName);

            CloudBlobDirectory dir = container.GetDirectoryReference(directoryPath);

            if (dir == null)
                return null;

            return dir.ListBlobsSegmented(null).Results;
        }
        public bool BlobExist(string containerName, string directoryPath, string resourceId)
        {
            // Retrieve a reference to a container 
            CloudBlobContainer container = blobClient.GetContainerReference(containerName);

            CloudBlobDirectory dir = container.GetDirectoryReference(directoryPath);

            try
            {
                CloudBlob blob = dir.GetBlobReference(resourceId);
                blob.FetchAttributes();
                return true;
            }
            catch
            {
                return false;
            }
        }
        private void SaveImageAsJpeg(MemoryStream ms, System.Drawing.Image img, long quality)
        {
            ImageCodecInfo jgpEncoder = GetEncoder(ImageFormat.Jpeg);

            // Create an Encoder object based on the GUID 
            // for the Quality parameter category.
            System.Drawing.Imaging.Encoder myEncoder =
                System.Drawing.Imaging.Encoder.Quality;

            // Create an EncoderParameters object. 
            // An EncoderParameters object has an array of EncoderParameter 
            // objects. In this case, there is only one 
            // EncoderParameter object in the array.
            EncoderParameters myEncoderParameters = new EncoderParameters(1);

            EncoderParameter myEncoderParameter = new EncoderParameter(myEncoder, quality);
            myEncoderParameters.Param[0] = myEncoderParameter;
            img.Save(ms, jgpEncoder, myEncoderParameters);
        }

        private ImageCodecInfo GetEncoder(ImageFormat format)
        {
            ImageCodecInfo[] codecs = ImageCodecInfo.GetImageDecoders();

            foreach (ImageCodecInfo codec in codecs)
            {
                if (codec.FormatID == format.Guid)
                {
                    return codec;
                }
            }
            return null;
        }
    }
}