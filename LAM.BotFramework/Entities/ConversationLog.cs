using Microsoft.WindowsAzure.Storage.Table;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LAM.BotFramework.Entities
{
    /// <summary>
    /// Conversation Log object
    /// Logs all conversation from bot or user
    /// Stores Conversation Log in Azure Table "BOTLOG"
    /// Revised LAM 13.03
    /// </summary>
    public class ConversationLog : BaseEntity
    {
        #region Properties
        public string Text { get; set; }
        public string ConversationID { get; set; }
        public string Origin { get; set; }
        public string Scenario { get; set; }
        public int CurrentQuestion { get; set; }
        #endregion

        private const string TABLE_NAME = "BotLog";
        public static CloudTable GetTableReference(CloudTableClient client)
        {
            return client.GetTableReference(TABLE_NAME);
        }
        public override void SetKeys()
        {
            this.PartitionKey = ConversationID;
            this.RowKey = DateTime.Now.Ticks.ToString();
        }

        public static IEnumerable<ConversationLog> LoadAll(CloudTable table, string conversationID)
        {
            var query = new TableQuery<ConversationLog>().Where(
                    TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, conversationID)
                );
            return table.ExecuteQuery(query);
        }
        public static IEnumerable<ConversationLog> LoadScenario(CloudTable table, string Scenario)
        {
            var query = new TableQuery<ConversationLog>().Where(
                    TableQuery.GenerateFilterCondition("Scenario", QueryComparisons.Equal, Scenario)
                );
            return table.ExecuteQuery(query);
        }

        public static void Log(Microsoft.Bot.Builder.Dialogs.IDialogContext context, string origin, string message, string Scenario, int CurrentQuestion)
        {
            var replyD = context.MakeMessage();
            LogWithID(replyD.ChannelId, replyD.Conversation.Id, origin, message, Scenario, CurrentQuestion);
        }
        public static void LogWithID(string channelId, string conversationId, string origin, string message, int CurrentQuestion)
        {
            LogWithID(channelId, conversationId, origin, message, Global.ScenarioName, CurrentQuestion);
        }
        public static void LogWithID(string channelId, string conversationId, string origin, string message, string Scenario, int CurrentQuestion)
        {
            if (Global.tableLog != null)
            {
                ConversationLog CL = new ConversationLog();
                CL.ConversationID = channelId + "." + conversationId;
                CL.Origin = origin;
                CL.Text = message;
                CL.CurrentQuestion = CurrentQuestion;
                CL.Scenario = Scenario;
                CL.Save(Global.tableLog);
            }
        }
    }
}

