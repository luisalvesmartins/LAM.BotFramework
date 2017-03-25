using System.Threading.Tasks;
using Microsoft.WindowsAzure.Storage.Table;
using Microsoft.WindowsAzure.Storage;
using Microsoft.Azure;
using Microsoft.WindowsAzure.Storage.Blob;
using System.IO;

namespace LAM.BotFramework.Helpers
{
    /// <summary>
    /// Get Azure Table and Blob clients providing a key to web.config
    /// REVISED LAM 13.03
    /// </summary>
    public static class CloudStorage
    {
        public static CloudTableClient GetTableClient(string Key)
        {
            CloudStorageAccount storageAccount = CloudStorageAccount.Parse(CloudConfigurationManager.GetSetting(Key));
            return storageAccount.CreateCloudTableClient();
        }

        public static CloudBlobClient GetBlobClient(string Key)
        {
            CloudStorageAccount storageAccount = CloudStorageAccount.Parse(CloudConfigurationManager.GetSetting(Key));
            return storageAccount.CreateCloudBlobClient();
        }
        public static string GetBlobFile(CloudBlobContainer container, string file)
        {
            CloudBlockBlob blockBlob = container.GetBlockBlobReference(file);

            string text;
            using (var memoryStream = new MemoryStream())
            {
                blockBlob.DownloadToStream(memoryStream);
                text = System.Text.Encoding.UTF8.GetString(memoryStream.ToArray());
            }
            return text;
        }

    }
}