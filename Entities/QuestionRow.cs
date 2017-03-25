using Newtonsoft.Json;

namespace LAM.BotFramework.Entities
{
    /// <summary>
    /// Main Object for question structure
    /// Revised LAM 22.03
    /// </summary>
    public class QuestionRow
    {
        [JsonProperty("q")]
        public string QuestionText { get; set; }
        [JsonProperty("type")]
        public string QuestionType { get; set; } //Text, Message, MessageEnd, LUIS, QnAMaker, Integer
        [JsonProperty("max")]
        public string Max { get; set; } //Max for Integer/Numbers
        [JsonProperty("options")]
        public string Options { get; set; } //JSON format or....
        [JsonProperty("nextq")]
        public string NextQ { get; set; } //{intent:'Yes', nextq:'6'},{intent:'No', nextq:'7'}
        [JsonProperty("node")]
        public string NodeName { get; set; } //Node Name = Variable Name
        [JsonProperty("sub")]
        public string Sub { get; set; }  //subroutine that the node belogs to
        [JsonProperty("langdet")]
        public string LangDet { get; set; } //allow language detection on this node
        [JsonProperty("bypass")]
        public string BypassNode { get; set; } //bypass this node if variable with NodeName already exists
    }
}