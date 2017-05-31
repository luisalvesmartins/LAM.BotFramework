using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LAM.BotFramework.Entities
{
    public class APILocal
    {
        public string AssemblyName { get; set; }
        public string TypeName { get; set; }
        public string Method { get; set; }
        public string[] Parameters { get; set; }
    }
}
