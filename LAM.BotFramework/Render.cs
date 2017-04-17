using LAM.BotFramework.ServiceConnectors;
using Microsoft.Azure.Search.Models;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LAM.BotFramework
{
    public class Render
    {
        //SEARCH
        public static async Task Search(IDialogContext context, OptionsSearch OS, DocumentSearchResult<object> searchResults)
        {
            int nResults = 0;
            SearchResult<object> searchResult;


            int i = 0;
            int Total = 0;
            while (i < searchResults.Results.Count)
            {
                if (searchResults.Results[i].Score > 0.25)
                    Total++;
                i++;
            }
            string sMsg = "Found ";
            if (Total > 1)
                sMsg += Total + " entries ";
            else
            {
                if (Total == 0)
                    sMsg += " no entries ";
                else
                    sMsg += "one entry ";
            }
            //sMsg += "with score > 0.25";
            if (Total > int.Parse(OS.MaxResults))
                sMsg += " Showing the first " + OS.MaxResults + ".";
            await context.PostAsync(sMsg);


            var replyMessage0 = context.MakeMessage();
            List<Attachment> LA = new List<Attachment>();
            if (searchResults.Results.Count > 0)
            {
                var item = searchResults.Results[0].Highlights;
                var s = item["content"];
                foreach (var item2 in s)
                {
                    string item3 = item2.Replace("<em>", "**").Replace("</em>", "**");
                    Attachment A1 = new HeroCard()
                    {
                        Text = item3
                        //Buttons = new List<CardAction>() { CA }
                    }
                    .ToAttachment();
                    LA.Add(A1);
                }
                replyMessage0.Attachments = LA;
                await context.PostAsync(replyMessage0);
            }

            LA = new List<Attachment>();
            var replyMessage = context.MakeMessage();
            while (nResults < int.Parse(OS.MaxResults) && nResults < searchResults.Results.Count)
            {
                searchResult = searchResults.Results[nResults];
                if (searchResult.Score > 0.25)
                {

                    Dictionary<string, object> LC = JsonConvert.DeserializeObject<Dictionary<string, object>>(searchResult.Document.ToString());

                    CardAction CA = new CardAction(ActionTypes.ImBack, searchResult.Score.ToString(), null, "value");
                    //replyMessage.Text = "**" + LC[OS.FieldQ] + "**";
                    int mT = LC[OS.FieldA].ToString().Length;
                    int mC = LC[OS.FieldQ].ToString().Length;
                    if (mT > 200)
                        mT = 200;
                    if (mC > 200)
                        mC = 200;
                    Attachment A = new HeroCard()
                    {
                        Text = "**" + LC[OS.FieldA].ToString().Substring(0, mT) + "**",
                        Subtitle = LC[OS.FieldQ].ToString().Substring(0, mC),
                        //Buttons = new List<CardAction>() { CA }
                    }
                    .ToAttachment();
                    //LA.Add(A);
                    //await context.PostAsync("Score:" + searchResult.Score);

                }
                nResults++;
            }
            if (LA.Count > 0)
            {
                replyMessage.Attachments = LA;
                await context.PostAsync(replyMessage);
            }
        }
        
        //QnAMaker
        public static async Task QnAMaker(IDialogContext context, string NotFoundMessage, QnAMaker.QnAMakerResult R, double MinimumScore)
        {
            if (R.Score >= MinimumScore)
            {
                await context.PostAsync(R.Answer); // + "(" + R.Score.ToString() + ")"
            }
            else
            {
                string NFM = "Could not find an answer to your question.";
                if (!string.IsNullOrEmpty(NotFoundMessage))
                {
                    NFM = NotFoundMessage;
                }
                await context.PostAsync(NFM);
            }
        }
    }

}
