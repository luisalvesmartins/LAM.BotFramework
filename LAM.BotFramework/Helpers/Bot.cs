using Microsoft.Bot.Connector;
using System;
using System.Collections.Generic;

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
            Activity isTypingReply = activity.CreateReply();
            isTypingReply.Type = ActivityTypes.Typing;
            await connector.Conversations.ReplyToActivityAsync(isTypingReply);
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