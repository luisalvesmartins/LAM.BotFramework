using LAM.BotFramework.Entities;
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace LAM.BotFramework.ServiceConnectors
{
    public class REST
    {
        /// <summary>
        /// Transfer Full State
        /// </summary>
        /// <param name="URL"></param>
        /// <param name="postData"></param>
        /// <returns></returns>
        public static async Task<BotProps> Post(string URL, BotProps postData)
        {
            Uri U = new Uri(URL);
            string s = U.PathAndQuery;
            HttpClient client = new HttpClient();
            client.BaseAddress = U;
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            HttpResponseMessage response = await client.PostAsJsonAsync(U.AbsolutePath, postData);
            response.EnsureSuccessStatusCode();

            BotProps BP = await response.Content.ReadAsAsync<BotProps>();
            return BP;
        }
        /// <summary>
        /// Rest Call, should receive a Dictionary<string,string>
        /// </summary>
        /// <param name="URL"></param>
        /// <returns></returns>
        public static async Task<string> Get(string URL)
        {
            HttpClient client = new HttpClient();
            return await client.GetStringAsync(URL);
        }
    }
}