using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.WindowsAzure.Storage.Table;
using Microsoft.WindowsAzure.Storage;
using System.Threading.Tasks;

namespace LAM.BotFramework.Entities
{ 
    /// <summary>
    /// Base Entity for Azure Table Objects
    /// Provides:
    ///   LoadByKey, LoadByKeyAsync
    ///   Save, SaveAsync
    ///   Merge, MergeAsync
    /// REVISED LAM 13.03
    /// </summary>
    public abstract class BaseEntity : TableEntity
    {
        public abstract void SetKeys();

        public static CloudTable GetTableReference(CloudTableClient client, string tableName)
        {
            return client.GetTableReference(tableName);
        }

        public BaseEntity() { }

        public static T LoadByKey<T>(CloudTable table, string partitionKey, string rowKey) where T : TableEntity
        {
            return table.Execute(TableOperation.Retrieve<T>(partitionKey, rowKey)).Result as T;
        }

        public static async Task<T> LoadByKeyAsync<T>(CloudTable table, string partitionKey, string rowKey) where T : TableEntity
        {
            var result = await table.ExecuteAsync(TableOperation.Retrieve<T>(partitionKey, rowKey));
            return result.Result as T;
        }

        public virtual void Save(CloudTable _table)
        {
            SetKeys();
            TableOperation insertOperation = TableOperation.InsertOrReplace(this);
            _table.Execute(insertOperation);
        }
        public virtual void SaveAsync(CloudTable _table)
        {
            SetKeys();
            TableOperation insertOperation = TableOperation.InsertOrReplace(this);
            _table.ExecuteAsync(insertOperation);
        }

        public virtual Task<TableResult> MergeAsync(CloudTable table)
        {
            SetKeys();
            return table.ExecuteAsync(TableOperation.InsertOrMerge(this));
        }

        async public static Task<bool> SaveAsync(CloudTable table, IEnumerable<BaseEntity> items)
        {
            TableBatchOperation batch = new TableBatchOperation();

            foreach (var item in items)
            {
                item.SetKeys();
                batch.InsertOrMerge(item);
            }

            bool retry = true;
            bool createTable = false;
            do
            {
                try
                {
                    if (createTable)
                    {
                        // Try to create the table
                        await table.CreateIfNotExistsAsync();
                        createTable = false;
                    }

                    // Execute the batch
                    var result = await table.ExecuteBatchAsync(batch);
                    // Check the status codes (success is 200-299)
                    return result.All(o => o.HttpStatusCode >= 200 && o.HttpStatusCode < 300);
                }
                catch (AggregateException ex)
                {
                    if (ex.InnerExceptions.Any(o => o is StorageException))
                    {
                        // Table doesn't exist
                        // Set our value to loop around and try again, creating the table first
                        // Don't do it if we were already trying to create the table
                        if (retry)
                        {
                            createTable = true;
                            retry = false;
                        }
                        else
                        {
                            // We must have generated an exception after trying to create the table,
                            // so don't try again.
                            createTable = false;
                            retry = false;
                        }
                    }
                }
                catch (StorageException ex)
                {
                    // Check the status code
                    System.Diagnostics.Debug.WriteLine(ex);

                    // Table doesn't exist
                    // Set our value to loop around and try again, creating the table first
                    // Don't do it if we were already trying to create the table
                    if (retry)
                    {
                        createTable = true;
                        retry = false;
                    }
                    else
                    {
                        // We must have generated an exception after trying to create the table,
                        // so don't try again.
                        createTable = false;
                        retry = false;
                    }
                }
            } while (createTable);

            return false;
        }
    }

}