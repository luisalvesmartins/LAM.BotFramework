using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LAM.BotFramework.Helpers
{ 
    /// <summary>
    /// Bots
    /// ImTyping - I'm Typeing message
    /// GetHeroCard - Hero Card
    /// GetThumbnailCard - Thumbnail Cards
    /// REVISED LAM 13.03
    /// </summary>
    public static class Bot
    {
        public static async void ImTyping(Activity activity)
        {
            //Best practice: I'm typing
            var connector = new ConnectorClient(new Uri(activity.ServiceUrl));
            if (activity.ChannelId != "cortana")
            {
                Activity isTypingReply = activity.CreateReply();
                isTypingReply.Type = ActivityTypes.Typing;
                await connector.Conversations.ReplyToActivityAsync(isTypingReply);
            }
        }

        public static async Task ReplyToActivityAsync(ConnectorClient connector, Activity reply)
        {
            if (string.IsNullOrEmpty(reply.Speak))
                reply.Speak = reply.Text;
            await connector.Conversations.ReplyToActivityAsync(reply);
        }
        public static void ReplyToActivity(ConnectorClient connector, Activity reply)
        {
            if (string.IsNullOrEmpty(reply.Speak))
                reply.Speak = reply.Text;
            connector.Conversations.ReplyToActivity(reply);
        }
        public static async Task PostAsync(IDialogContext context, string message)
        {
            IMessageActivity messageActivity = context.MakeMessage();
            messageActivity.Text = message;
            messageActivity.Speak = message;
            await context.PostAsync(messageActivity);
        }

        public static Attachment GetHeroCard(string title, string subtitle, string text, List<CardImage> cardImage, List<CardAction> cardAction)
        {
            var heroCard = new HeroCard
            {
                Title = title,
                Subtitle = subtitle,
                Text = text,
                Images = cardImage,
                Buttons = cardAction
            };

            return heroCard.ToAttachment();
        }

        public static Attachment GetThumbnailCard(string title, string subtitle, string text, CardImage cardImage, CardAction cardAction)
        {
            var heroCard = new ThumbnailCard
            {
                Title = title,
                Subtitle = subtitle,
                Text = text,
                Images = new List<CardImage>() { cardImage },
                Buttons = new List<CardAction>() { cardAction },
            };
            return heroCard.ToAttachment();
        }

    }
}