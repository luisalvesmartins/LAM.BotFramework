using System;
using System.Threading.Tasks;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;
using LAM.BotFramework.Entities;

namespace LAM.BotFramework.Dialogs
{
    /// <summary>
    /// Main Dialog
    /// </summary>
    [Serializable]
    public class MainDialog : IDialog<object>
    {
        public Task StartAsync(IDialogContext context)
        {
            context.Wait(MessageReceivedAsync);
            return Task.CompletedTask;
        }

        public async Task MessageReceivedAsync(IDialogContext context, IAwaitable<IMessageActivity> argument)
        {
            string JSon = Scenario.LoadRecentScenario(Global.ScenarioName);
            if (string.IsNullOrEmpty(JSon))
            {
                var reply = context.MakeMessage();
                reply.Text = "No scenario definition:" + Global.ScenarioName;
                await context.PostAsync(reply);
            }
            else
            {
                Question Q = new Question(context);
                await Q.Initialize(JSon);
            }
        }
    }
}

