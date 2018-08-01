using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.ServiceBus.Messaging;
using Microsoft.ServiceBus;
using Microsoft.WindowsAzure.ServiceRuntime;
using System.Reflection;
using SkillCowResponsive.Classes.Helpers;

namespace SkillCowResponsive.Classes.DeferredProcesses
{
    public class MessageBroker
    {
        NamespaceManager namespaceManager;
        string connectionString = "Endpoint=sb://careerthesaurus.servicebus.windows.net/;SharedAccessKeyName=defaultsendpolicy;SharedAccessKey=b2JGJU8l2u4SMp3qAEtaB30iUY5P7Nt7ZwzKeJgMvTo=";
        string nameSpaceConnectionString = "Endpoint=sb://careerthesaurus.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=TSW6lTcK5le79l3DnlQVKFvHRygydFtio1j/3/5brt8=";

        QueueClient queClient = null;

#if DEBUG
        //string queueName = "debug";
        string queueName = "default";
#else
        //string queueName = "production";
        string queueName = "default";
#endif


        public MessageBroker()
        {
            namespaceManager = NamespaceManager.CreateFromConnectionString(nameSpaceConnectionString);

            MakeSureQueExists();

            queClient = QueueClient.CreateFromConnectionString(connectionString, queueName);
        }

        private void MakeSureQueExists()
        {
            if (!namespaceManager.QueueExists(queueName))
            {
                QueueDescription qd = new QueueDescription(queueName);
                qd.MaxSizeInMegabytes = 5120;
                qd.LockDuration = new TimeSpan(0, 5, 0);
                qd.MaxDeliveryCount = 2;
                qd.DefaultMessageTimeToLive = new TimeSpan(2, 0, 0, 0);

                namespaceManager.CreateQueue(qd);
            }
        }

        public string SendDeferredProcessAsMessage(DeferredProcess process, string msgheader)
        {
            BrokeredMessage message = new BrokeredMessage(msgheader);

            string id = ShortGuidGenerator.NewGuid();
            Type deferredType = process.GetType();
            message.Properties["Class"] = deferredType.FullName;
            message.Properties["ID"] = id;
            foreach (PropertyInfo pi in deferredType.GetProperties())
            {
                message.Properties[pi.Name] = pi.GetValue(process, null);
            }

            SendMessage(message);

            return id;
        }

        public bool SendMessage(BrokeredMessage message)
        {
            int trycount = 0;
            bool success = false;

            while (trycount++ < 3)
            {
                try
                {
                    queClient.Send(message);
                    success = true;
                    break;
                }
                catch
                {
                    MakeSureQueExists();
                    queClient = QueueClient.CreateFromConnectionString(connectionString, queueName);
                }
            }

            if (success)
                return true;
            else
                return false;
        }
    }
}