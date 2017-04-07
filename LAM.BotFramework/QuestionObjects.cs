using System.Collections.Generic;

namespace LAM.BotFramework
{
    public class NextQuestion
    {
        public string intent;
        public int q;
    }
    public class StackItem
    {
        public string sub { get; set; }
        public int nextQ { get; set; }
    }

    public class AttachmentCard
    {
        public string type;
        public string title;
        public string subtitle;
        public string text;
        public string imageURL;
        public AttachmentAction action;
    }
    public class AttachmentHero
    {
        public string type;
        public string title;
        public string subtitle;
        public string text;
        public string imageURL;
        public List<AttachmentAction> action;
    }
    public class AttachmentAction
    {
        public string type;
        public string title;
        public string value;
    }


    public class OptionsSearch
    {
        public string ServiceName { get; set; }
        public string Key { get; set; }
        public string Index { get; set; }
        public string FieldQ { get; set; }
        public string FieldA { get; set; }
        public string MaxResults { get; set; }
        public string QSearch { get; set; } //If exists will use the content of this variable for Search
    }

    public class OptionsQnAMaker
    {
        public string KBId { get; set; }
        public string Key { get; set; }
        public string MinScore { get; set; }
        public string QSearch { get; set; }
        public string NotFoundMessage { get; set; }
    }


}
