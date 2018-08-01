using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Threading;
using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.ServiceRuntime;
using Microsoft.WindowsAzure.StorageClient;

namespace WorkerRole1
{
    public class WorkerRole : RoleEntryPoint
    {

#if DEBUG
        int THREADS_PER_TOPIC = 1;
        int TOPICS = 1;
#else
        int THREADS_PER_TOPIC = 8;
        int TOPICS = 3;
#endif

        List<WorkerAgent> agents = new List<WorkerAgent>();

        public override bool OnStart()
        {
            // Set the maximum number of concurrent connections 
            ServicePointManager.DefaultConnectionLimit = 100;

            return base.OnStart();
        }

        public override void Run()
        {
            // For information on handling configuration changes
            // see the MSDN topic at http://go.microsoft.com/fwlink/?LinkId=166357.

            string instanceId = RoleEnvironment.CurrentRoleInstance.Id;
            int instanceIndex = 0;
            if (int.TryParse(instanceId.Substring(instanceId.LastIndexOf(".") + 1), out instanceIndex)) // On cloud.
            {
                int.TryParse(instanceId.Substring(instanceId.LastIndexOf("_") + 1), out instanceIndex); // On compute emulator.
            }

            for (int i = 0; i < THREADS_PER_TOPIC * TOPICS; i++)
            {
                int topicnumber = 0;
#if DEBUG
                topicnumber = 1;
#else
                topicnumber = (i - (i % THREADS_PER_TOPIC)) / THREADS_PER_TOPIC + 1;
#endif

                agents.Add(WorkerAgent.Start(instanceIndex, i % THREADS_PER_TOPIC + 1, topicnumber));
            }

            int seconds = 0;
            long recordsincurrentminute = 0;
            long lastminutestotal = 0;

            while (true)
            {
                //long messagesProcessed = 0;
                //foreach(WorkerAgent wa in agents)
                //{

                //messagesProcessed += Interlocked.Read(ref wa.MessagesProcessed);
                //}

                Thread.Sleep(10000);

                //seconds++;

                //if (seconds % 60 == 0)
                //{
                //recordsincurrentminute = messagesProcessed - lastminutestotal;

                //Trace.WriteLine(recordsincurrentminute);

                //lastminutestotal = messagesProcessed;

                //}
            }
        }
    }
}
