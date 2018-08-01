using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Threading;

namespace SkillCow.Classes.Helpers
{
    public static class RandomHelper
    {
        private static int seedCounter = new Random(DateTime.Now.Millisecond).Next();

        [ThreadStatic]
        private static Random rnd;
        //private static object padlock = new object();

        public static Random Instance
        {
            get
            {
                if (rnd == null)
                {
                    //lock (padlock)
                    //{
                        //if (rnd == null)
                        //{
                            int seed = Interlocked.Increment(ref seedCounter);
                            rnd = new Random(seed);
                        //}
                    //}
                }
                return rnd;
            }
        }
    } 
}