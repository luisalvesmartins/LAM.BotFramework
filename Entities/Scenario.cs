using Microsoft.WindowsAzure.Storage.Table;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LAM.BotFramework.Entities
{
    public class Scenario : TableEntity
    {
        #region PROPERTIES
        public string Version { get; set; }
        public string Definition { get; set; }
        #endregion

        public static CloudTable GetTableReference(CloudTableClient client, string tableName)
        {
            return client.GetTableReference(tableName);
        }

        public virtual void Save(string name)
        {
            this.PartitionKey = name;
            this.RowKey = this.Version;
            TableOperation insertOperation = TableOperation.InsertOrReplace(this);
            Global.tableScenario.Execute(insertOperation);
        }
        public Task SaveAsync(string name)
        {
            this.PartitionKey = name;
            this.RowKey = this.Version;
            TableOperation insertOperation = TableOperation.InsertOrReplace(this);
            return Global.tableScenario.ExecuteAsync(insertOperation);
        }
        public static string LoadRecentScenario(string name)
        {
            var query = new TableQuery<Scenario>().Where(
                    TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, name)
                );
            IEnumerable<Scenario> ICL = Global.tableScenario.ExecuteQuery(query);
            if (ICL.Count() > 0)
                return ICL.First().Definition;
            else
                return "";
        }
    }
}
