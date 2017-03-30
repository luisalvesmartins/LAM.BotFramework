using Newtonsoft.Json;
using System;
using System.Net;

namespace LAM.BotFramework.ServiceConnectors
{
    /// <summary>
    /// QnAMaker Interface
    /// Could be using the .NET object instead of doing the REST call
    /// Something to update soon
    /// Revised LAM 13.03
    /// </summary>
    public class QnAMaker
    {
        const string QnAMakerURL = "https://westus.api.cognitive.microsoft.com/qnamaker/v1.0";
        public static QnAMakerResult Get(string knowledgebaseId, string qnamakerSubscriptionKey, string Query)
        {
            string responseString = string.Empty;
            QnAMakerResult response;

            try
            {
                //Build the URI
                Uri qnamakerUriBase = new Uri(QnAMakerURL);
                var builder = new UriBuilder($"{qnamakerUriBase}/knowledgebases/{knowledgebaseId}/generateAnswer");
                QQ q = new QQ();
                q.question = Query;
                var postBody = JsonConvert.SerializeObject(q);
                //var postBody = $"{{\"question\": \"{Query}\"}}";
                //Send the POST request
                using (WebClient client = new WebClient())
                {
                    //Add the subscription key header
                    client.Headers.Add("Ocp-Apim-Subscription-Key", qnamakerSubscriptionKey);
                    client.Headers.Add("Content-Type", "application/json");
                    client.Encoding = System.Text.Encoding.UTF8;
                    responseString = client.UploadString(builder.Uri, postBody);
                }
                //De-serialize the response
                response = JsonConvert.DeserializeObject<QnAMakerResult>(responseString);
            }
            catch (Exception EQ)
            {
                response = new QnAMakerResult();
                response.Score = 50;
                response.Answer = "Error:" + EQ.Message;
            }

            return response;
        }
        public class QQ
        {
            public string question { get; set; }
        }

        public class QnAMakerResult
        {
            /// <summary>
            /// The top answer found in the QnA Service.
            /// </summary>
            [JsonProperty(PropertyName = "answer")]
            public string Answer { get; set; }

            /// <summary>
            /// The score in range [0, 100] corresponding to the top answer found in the QnA    Service.
            /// </summary>
            [JsonProperty(PropertyName = "score")]
            public double Score { get; set; }
        }
    }
}