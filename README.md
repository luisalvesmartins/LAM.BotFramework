# LAM.BotFramework

A Data Driven Framework for Microsoft Bot Framework

The Bot flow is defined by a data structure.
The flow definition is stored in Azure Table Storage. This enables version control and change of the flow without editing code.

The data is stored in JSON and has this format:
```javascript
public class QuestionRow
    {
        [JsonProperty("q")]
        public string QuestionText { get; set; } //The text to be displayed
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
```

To use the Framework you will need to:
1. Initialize the Framework:
 
   In **Global.asax.cs**, in **Application_Start()** add this lines:
```javascript
    Task T = LAM.BotFramework.Global.Initialization();
    T.Wait();
```
2. Define variables in Web.Config
   
   For table naming, Azure Table Name rules apply:
```javascript
    <add key="LAMBF.StorageConnectionString" value="<YourAzureConnectionString>" />
    <add key="LAMBF.ScenarioTableName" value="<YourScenarioTableName>" />
    <add key="LAMBF.ScenarioName" value="<YourScenarioName>" />
    <add key="LAMBF.LogTableName" value="<YourLogTableName>" />
```
3. Call the Framework dialog
4. In the *Post* method in the *MessagesController*, call the dialog:
```javascript
    await Conversation.SendAsync(activity, () => new MainDialog());
```
As alternative, you can call the Framework from inside your dialog with:
```javascript
   Question Q = new Question(context);
   await Q.Initialize(JSon);
```

Please check the LAM.BotFramework.Admin project for utilities and blank template.