using LAM.BotFramework.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Http;

namespace LAM.BotFramework.Controllers
{
    /// <summary>
    /// LOG Scenario Statistics
    /// REVISED LAM 13.03
    /// </summary>
    public class LogApiController : ApiController
    {
        /// <summary>
        /// Retrieves the statistics for the Scenario, beware it's memory intensive
        /// </summary>
        /// <param name="Scenario"></param>
        /// <param name="DateStart"></param>
        /// <param name="DateFinish"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("api/LAM/LoadScenario")]
        public List<KeyValuePair<int, int>> LoadScenario(string Scenario, string DateStart, string DateFinish)
        {
            IEnumerable<ConversationLog> CL = ConversationLog.LoadScenario(Global.tableLog, Scenario);

            int[] A = new int[500];
            foreach (ConversationLog item in CL)
            {
                if ((item.Origin == "USER") && (item.CurrentQuestion > -1))
                    A[item.CurrentQuestion]++;
            }
            List<KeyValuePair<int, int>> LII = new List<KeyValuePair<int, int>>();
            for (int i = 0; i < A.Length; i++)
            {
                if (A[i] != 0)
                    LII.Add(new KeyValuePair<int, int>(i, A[i]));
            }
            return LII;
        }

        /// <summary>
        /// Returns the most recent Scenario definition
        /// </summary>
        /// <param name="Scenario"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("api/LAM/LoadDefinition")]
        public string LoadDefinition(string ScenarioName)
        {
            return Scenario.LoadRecentScenario(ScenarioName);
        }

        /// <summary>
        /// Saves the Scenario
        /// </summary>
        /// <param name="JSON"></param>
        /// <returns></returns>
        [AcceptVerbs("POST")]
        [Route("api/LAM/SaveDefinition")]
        public string SaveDefinition([FromBody]PostScenario JSON)
        {
            if (JSON != null)
            {
                Scenario S = new Scenario();

                S.Definition = JSON.Definition;
                S.Version = JSON.Version;
                Task T = S.SaveAsync(JSON.Scenario);
            }
            return "";
        }
    }
    public class PostScenario
    {
        public string Definition { get; set; }
        public string Version { get; set; }
        public string Scenario { get; set; }
    }
}
