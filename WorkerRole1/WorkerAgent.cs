using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using System.Threading;
using System.Net;

using Microsoft.ServiceBus;
using Microsoft.ServiceBus.Messaging;
using Microsoft.WindowsAzure.ServiceRuntime;

using SkillCow.Classes.Helpers;
using SkillCow.Classes.DeferredProcesses;


namespace WorkerRole1
{
    public class WorkerAgent
    {
        TokenProvider tP;
        Uri uri;

        string issuer = "owner";
        string key = "QXHUF26cTC0b3tNIAyj7uYxY3AeLbIOv/YxdBjwxhcE=";

        MessagingFactory factory = null;
        //MessageSender topic = null;
        MessageBroker messageBroker = null;
                
        string hubmessagingtopic;
        private Thread agentthread;

        public long MessagesProcessed = 0;

        int instanceNumber = 0;
        int threadNumber = 0;
        int messageTopicNumber = 0;

        public override string ToString()
        {
            return "Agent for topic " + messageTopicNumber;
        }

        public static WorkerAgent Start(int instanceNumber, int threadNumber, int messageTopicNumber)
        {
            WorkerAgent instance = new WorkerAgent(instanceNumber, threadNumber, messageTopicNumber);

            return instance;
        }

        private WorkerAgent(int instanceNumber, int threadNumber, int messageTopicNumber)
        {
            this.instanceNumber = instanceNumber;
            this.threadNumber = threadNumber;
            this.messageTopicNumber = messageTopicNumber;

            ThreadStart ts = new ThreadStart(Run);
            agentthread = new Thread(ts);
            agentthread.Start();
        }

        private void Run()
        {
            hubmessagingtopic = "skillcow"; // RoleEnvironment.GetConfigurationSettingValue("servicebustopic" + messageTopicNumber);

            // TokenProvider and URI of our service namespace
            tP = TokenProvider.CreateSharedSecretTokenProvider(issuer, key);
            uri = ServiceBusEnvironment.CreateServiceUri("sb", "chaindateservicebus", string.Empty);

            // Create NamespaceManager for the "HowToSample" service namespace
            NamespaceManager namespaceManager = new NamespaceManager(uri, tP);

            while (true)
            {
                try
                {
                    //Wait for topic to become available
                    if (namespaceManager.TopicExists(hubmessagingtopic))
                    {
                        // Create a new "AllMessages" subscription on our "TestTopic"  
                        if (!namespaceManager.SubscriptionExists(hubmessagingtopic, "allmessages"))
                            namespaceManager.CreateSubscription(hubmessagingtopic, "allmessages");
                        break;
                    }
                    Thread.Sleep(1000);
                }
                catch
                {
                }
            }
            
            // URI address and token for our "HowToSample" namespace
            tP = TokenProvider.CreateSharedSecretTokenProvider(issuer, key);
            uri = ServiceBusEnvironment.CreateServiceUri("sb", "chaindateservicebus", string.Empty);

            // Retrieve MessageReceiver for the "AllMessages" subscription 
            factory = MessagingFactory.Create(uri, tP);
            MessageReceiver messageReceiver =
               factory.CreateMessageReceiver(hubmessagingtopic + "/subscriptions/AllMessages");


            //For resending messages
            //topic = factory.CreateMessageSender(hubmessagingtopic);
            messageBroker = new MessageBroker(messageTopicNumber);

            Random random = RandomHelper.Instance;

            // Continuously process messages received from the "HighMessages" subscription 
            while (true)
            {
                BrokeredMessage message = null;
                while (true) //Keep reconnecting
                {
                    try
                    {

                        message = messageReceiver.Receive();

                        break;
                    }
                    catch
                    {
                        tP = TokenProvider.CreateSharedSecretTokenProvider(issuer, key);
                        uri = ServiceBusEnvironment.CreateServiceUri("sb", "chaindateservicebus", string.Empty);

                        factory = MessagingFactory.Create(uri, tP);
                        messageReceiver = factory.CreateMessageReceiver(hubmessagingtopic + "/subscriptions/AllMessages");
                    }
                }

                if (message != null)
                {
                    try
                    {
                        string msgtype = message.GetBody<string>();

                        Interlocked.Increment(ref MessagesProcessed);

                        switch (msgtype)
                        {
                            case "deferred":
                                DeferredProcessExitCode deferredProcessExitCode = DeferredProcess.CreateAndExecute(messageBroker, message, instanceNumber, threadNumber);
                                break;
                            default:
                                break;
                        }

                        try
                        {
                            message.Complete();
                        }
                        catch
                        {
                        }
                    }
                    catch (Exception ex)
                    {
                        // Indicate a problem, unlock message in subscription
                        message.Abandon();
                    }
                    finally
                    {
                    }
                }
            }

        }

        
    }
}
