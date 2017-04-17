using System;
using System.IO;
using System.Net;
using System.Runtime.Serialization;

namespace LAM.BotFramework.ServiceConnectors
{
    public class Translator
    {
        const string TranslatorServiceURL = "http://api.microsofttranslator.com/v2/Http.svc/Translate?text=";
        public static string GetToken()
        {
            try
            {
                // Create a header with the access_token property of the returned token
                AdmAccessToken admToken = Global.admAuth.GetAccessToken();
                return "Bearer " + admToken.access_token;
            }
            catch (Exception e)
            {
                string log = e.Source;
                return "";
            }
        }
        public static string Detect(string textToDetect)
        {
            string languageDetected = "";
            //Keep appId parameter blank as we are sending access token in authorization header.
            string uri = "http://api.microsofttranslator.com/v2/Http.svc/Detect?text=" + System.Web.HttpUtility.UrlEncode(textToDetect);
            HttpWebRequest httpWebRequest = (HttpWebRequest)WebRequest.Create(uri);
            httpWebRequest.Headers.Add("Authorization", GetToken());
            WebResponse response = null;
            try
            {
                response = httpWebRequest.GetResponse();
                using (Stream stream = response.GetResponseStream())
                {
                    System.Runtime.Serialization.DataContractSerializer dcs = new System.Runtime.Serialization.DataContractSerializer(Type.GetType("System.String"));
                    languageDetected = (string)dcs.ReadObject(stream);
                }
            }
            catch
            {
                throw;
            }
            finally
            {
                if (response != null)
                {
                    response.Close();
                    response = null;
                }
            }
            return languageDetected;
        }
        public static string Translate( string textToTranslate, string languageFrom, string languageTo)
        {
            string authToken = GetToken();
            if (authToken == "" || languageFrom==languageTo)
            {
                return textToTranslate;
            }
            else
            {
                string translation = "";
                //Keep appId parameter blank as we are sending access token in authorization header.
                string uri = TranslatorServiceURL + System.Uri.EscapeDataString(textToTranslate) + "&from=" + languageFrom + "&to=" + languageTo;
                HttpWebRequest httpWebRequest = (HttpWebRequest)WebRequest.Create(uri);
                httpWebRequest.Headers.Add("Authorization", authToken);
                WebResponse response = null;
                try
                {
                    response = httpWebRequest.GetResponse();
                    using (Stream stream = response.GetResponseStream())
                    {
                        DataContractSerializer dcs = new DataContractSerializer(Type.GetType("System.String"));
                        translation = (string)dcs.ReadObject(stream);
                    }
                }
                catch (Exception e)
                {
                    return "TRANSLATOR SERVICE ERROR:" + e.Message;
                }
                finally
                {
                    if (response != null)
                    {
                        response.Close();
                        response = null;
                    }
                }
                return translation;
            }
        }
        private static void ProcessWebException(WebException e)
        {
            Console.WriteLine("{0}", e.ToString());
            // Obtain detailed error information
            string strResponse = string.Empty;
            using (HttpWebResponse response = (HttpWebResponse)e.Response)
            {
                using (Stream responseStream = response.GetResponseStream())
                {
                    using (StreamReader sr = new StreamReader(responseStream, System.Text.Encoding.ASCII))
                    {
                        strResponse = sr.ReadToEnd();
                    }
                }
            }
            Console.WriteLine("Http status code={0}, error message={1}", e.Status, strResponse);
        }



    }
}