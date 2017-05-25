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
            if (Global.TranslationEnabled)
            {
                try
                {
                    // Create a header with the access_token property of the returned token
                    return Global.admAuth.GetAccessToken();
                }
                catch (Exception e)
                {
                    string log = e.Source;
                    return "";
                }
            }
            else
                return "";
        }
        public static string Detect(string textToDetect)
        {
            if (!Global.TranslationEnabled)
                return "";

            string languageDetected = "";
            //Keep appId parameter blank as we are sending access token in authorization header.
            string uri = "https://api.microsofttranslator.com/v2/Http.svc/Detect?text=" + System.Web.HttpUtility.UrlEncode(textToDetect);
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
            catch(Exception e)
            {
                return "Error calling the translator service:" + e.Message;
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
            if (!Global.TranslationEnabled || languageFrom == languageTo)
                return textToTranslate;
            string authToken = GetToken();
            if (authToken == "")
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
    }
}