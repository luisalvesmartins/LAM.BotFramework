## Activities

### Common properties
This properties are available to almost all activities:

Node Name - User input will be stored in this variable name

Question - Prompt to be displayed

Type - Type of Activity, see list below

Language Detection - If 'Yes' the framework will detect the language of the user input and will change accordingly.

Bypass question if var is filled - If the variable stated in 'Node Name' is filled then this question is bypassed

All node names are referenced as #!name!#. Case Insensitive


### AdaptiveCard

Shows an AdaptiveCard and waits for user input. The return variable is read from the variable name written in "Options"

### AdaptiveCardShow

Shows an AdaptiveCard 

### API

Calls a URL or a method.
Return must be a Dictionary<string,string> with the variables to integrate to the bot state.
1. URL:
   Example:
   ```javascript
   __http://address/api/GroupActions?Key=#!KEY!#&action=CONNECT&personGroupId=#!ID!#&faceId=123__
   ```

2. METHOD CALL
Notation:
```javascript
{
	"AssemblyName" : "Assemblyname",
	"TypeName" : "Namespace.ClassName",
	"Method" : "name of method",
	"parameters":[
		"#!SUBSCRIPTIONKEY!#",
		"CONNECT",
		...
		]
}
```

### Attachment

Enables upload of attachments. There must always be a METHOD CALL in the options box

### Choice

The options are split by comma.

### ChoiceAction

The buttons are show based on the connector text to other activities

### Expression

Expression to be calculated. There must be two connectors: "Yes" and "No"

### Message

Displays the message

### MessageEnd

Displays the message and ends the dialog

### Search

Enable Azure Search calls (to be documented)

### SUB

Handles process to the chosen SUB

### EndSub

Exits the SUB - useful only when there is no activity to perform at the end of the sub. Example: option to return to main menu.

### LUIS

Enable LUIS calls (to be documented)

### QnAMaker

Enable QnAMaker calls (to be documented)

### Text

Prompts the user for text

### ResetAllVars

Cleans all state