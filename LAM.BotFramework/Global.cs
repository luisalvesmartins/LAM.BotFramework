using LAM.BotFramework.Entities;
using LAM.BotFramework.Helpers;
using LAM.BotFramework.ServiceConnectors;
using Microsoft.Azure;
using Microsoft.WindowsAzure.Storage.Table;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LAM.BotFramework
{
    public static partial class Global
    {
        public static CloudTable tableLog;
        public static CloudTable tableScenario;
        public static ADMAuthentication admAuth =null;
        public static bool TranslationEnabled = false;
        public static string ScenarioName = "";
        public static string PragmaOpen = "#!";
        public static string PragmaClose = "!#";
        public static string DebugServicesURL;

        public async static Task Initialization()
        {
            string storageConnectionString = "LAMBF.StorageConnectionString";
            string scenarioTableName = CloudConfigurationManager.GetSetting("LAMBF.ScenarioTableName");
            string scenarioName = CloudConfigurationManager.GetSetting("LAMBF.ScenarioName");
            string conversationLogTableName = CloudConfigurationManager.GetSetting("LAMBF.LogTableName");
            await Initialization(storageConnectionString, scenarioTableName, scenarioName, conversationLogTableName);
        }
        public async static Task Initialization(string storageConnectionString, string scenarioTableName, string scenarioName, string conversationLogTableName)
        {
            try
            {
                Global.DebugServicesURL = CloudConfigurationManager.GetSetting("LAMBF.DebugServicesURL");

                ScenarioName = scenarioName;

                CloudTableClient tableClient = CloudStorage.GetTableClient(storageConnectionString);

                // Run these initlializations in parallel
                await ConversationLog.GetTableReference(tableClient, conversationLogTableName).CreateIfNotExistsAsync();
                await Scenario.GetTableReference(tableClient, scenarioTableName).CreateIfNotExistsAsync();

                tableLog = ConversationLog.GetTableReference(tableClient, conversationLogTableName);
                tableScenario = Scenario.GetTableReference(tableClient, scenarioTableName);

                //INIT TRANSLATOR
                string TranslateKey = CloudConfigurationManager.GetSetting("LAMBF.TranslatorKey");
                if (!string.IsNullOrEmpty(TranslateKey))
                {
                    Global.admAuth = new ADMAuthentication(TranslateKey);
                    Global.TranslationEnabled = true;
                }
            }
            catch (Exception e)
            {
            }

        }
    }
}
