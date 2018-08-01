using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.ServiceBus.Messaging;
using Microsoft.ServiceBus;
using Microsoft.WindowsAzure.ServiceRuntime;
using System.Reflection;
using SkillCow.Classes.Helpers;

namespace SkillCow.Classes.DeferredProcesses
{
    public class MessageBroker
    {
        static string issuer = "owner";
        static string key = "QXHUF26cTC0b3tNIAyj7uYxY3AeLbIOv/YxdBjwxhcE=";
        
        private TokenProvider tP = null;
        private Uri uri = null;

        private MessageSender topic = null;

        string hubmessagingtopic;

        public int MessageTopicNumber { get; set; }

        public MessageBroker(int messageTopicNumber)
        {
            hubmessagingtopic = "skillcow"; // RoleEnvironment.GetConfigurationSettingValue("servicebustopic" + messageTopicNumber);

            //Send a message to WireUp the hub
            tP = TokenProvider.CreateSharedSecretTokenProvider(issuer, key);

            // Retrieve URI of our service namespace (created via the portal)
            uri = ServiceBusEnvironment.CreateServiceUri("sb", "chaindateservicebus", string.Empty);

            while (true)
            {
                try
                {
                    // Create NamespaceManager for our service namespace
                    NamespaceManager namespaceManager = new NamespaceManager(uri, tP);

                    if (!namespaceManager.TopicExists(hubmessagingtopic))
                    {
                        // Configure Topic Settings
                        TopicDescription td = new TopicDescription(hubmessagingtopic);
                        td.MaxSizeInMegabytes = 1024;
                        td.DefaultMessageTimeToLive = new TimeSpan(0, 5, 0);
                        
                        // Create a new Topic with custom settings
                        namespaceManager.CreateTopic(td);
                    }
                    MessagingFactory factory = MessagingFactory.Create(uri, tP);
                    topic = factory.CreateMessageSender(hubmessagingtopic);
                    break;
                }
                catch
                {
                }
            }

            MessageTopicNumber = messageTopicNumber;
        }

        public static int RandomInstanceNumber
        {
            get
            {
#if DEBUG
                return 1;
#else
                return RandomHelper.Instance.Next(1, 4);
#endif
            }
        }

        public bool SendDeferredProcessAsMessage(DeferredProcess process)
        {
            BrokeredMessage message = new BrokeredMessage("deferred");
            
            Type deferredType = process.GetType();
            message.Properties["Class"] = deferredType.FullName;
            message.Properties["ID"] = ShortGuidGenerator.NewGuid();
            foreach (PropertyInfo pi in deferredType.GetProperties())
            {
                message.Properties[pi.Name] = pi.GetValue(process, null);
            }

            return SendMessage(message);
        }

        public bool SendMessage(BrokeredMessage message)
        {
            int trycount = 0;
            bool success = false;
            while (trycount++ < 10)
            {
                try
                {
                    topic.Send(message);
                    success = true;
                    break;
                }
                catch
                {
                    MessagingFactory factory = MessagingFactory.Create(uri, tP);
                    topic = factory.CreateMessageSender(hubmessagingtopic);
                }
            }

            message.Dispose();

            if (success)
                return true;
            else
                return false;
        }
    }
}