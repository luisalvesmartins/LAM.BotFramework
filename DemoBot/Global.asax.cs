using System.Threading.Tasks;
using System.Web.Http;

namespace DemoBot
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            #region LAM.BotFramework
            Task T = LAM.BotFramework.Global.Initialization();
            T.Wait();
            #endregion

            GlobalConfiguration.Configure(WebApiConfig.Register);
        }
    }
}
