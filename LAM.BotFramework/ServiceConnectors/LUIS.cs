using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web;

namespace LAM.BotFramework.ServiceConnectors
{
    public class LUIS
    {
        const string LUISURLv2 = "https://api.projectoxford.ai/luis/v2.0/apps/";
        public static async Task<string> getLUISresultAsync(string URL, string Query)
        {
            string response=await REST.GetAsync(LUISURLv2 + URL + "&q=" + Query,false);
            return response;
        }
    }


    public class LUISresultv2
    {
        public string query { get; set; }
        public LUISintents topScoringIntent { get; set; }
        public LUISentities[] entities { get; set; }
        public object[] actions;
    }
    public class LUISintents
    {
        public string intent;
        public double score;
    }
    public class LUISentities
    {
        public string entity;
        public string type;
        public int startIndex;
        public int endIndex;
        public double score;
    }
}