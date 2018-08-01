using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.ServiceBus.Messaging;
using System.Reflection;
using System.Text;
using SkillCowResponsive.Classes.Helpers;

namespace SkillCowResponsive.Classes.DeferredProcesses
{
    public enum DeferredProcessExitCode
    {
        Success = 1,
        NothingToDo = 0,
        Error = -1
    }
    public abstract class DeferredProcess
    {
        public int BlobsSaved { get; set; }
        public int ItemsCreated { get; set; }
        public int ItemsUpdated { get; set; }

        public int TotalItemCount { get; set; }
        public int ErrorCount { get; set; }

        public string ID { get; set; }
        protected string Tag { get; set; }
        protected string Line { get; set; }
        protected string ErrorDescription { get; set; }


        public int RangeFrom { get; set; }
        public int RangeTo { get; set; }

        //WorkItemEventClient eventClient = null;

        protected virtual int MaxItemsPerWorkItem { get { throw new Exception("MaxItemsPerWorkItem property is NOT implemented in the derived class"); } }
        protected virtual string ProcessPartition { get { throw new Exception("ProcessPartition property is NOT implemented in the derived class"); } }
        protected virtual bool AllowStatusLogging()
        {
            return true;
        }

        public void SaveStatus(int totalItemCount, int errorCount, double elapsedTime)
        {
            if (AllowStatusLogging())
            {
                //WorkItemStatusClient processStatusClient = new WorkItemStatusClient(this.GetType().Name);
                //processStatusClient.SaveStatus(ProcessPartition, ID, totalItemCount, errorCount, elapsedTime, statusCode, Tag);
            }
        }
        public static DeferredProcess Reconstruct(BrokeredMessage message)
        {
            DeferredProcess newprocess = null;
            try
            {
                Type deferredType = Assembly.GetAssembly(typeof(DeferredProcess)).GetType(message.Properties["Class"].ToString());
                if (deferredType == null)
                {
                    return null;
                }

                newprocess = (DeferredProcess)Activator.CreateInstance(deferredType);
                newprocess.ID = message.Properties["ID"] != null ? message.Properties["ID"].ToString() : "";
                foreach (PropertyInfo pi in deferredType.GetProperties())
                {
                    if (pi.Name != "ID")
                    {
                        Type declaringType = pi.PropertyType;

                        try
                        {
                            switch (declaringType.Name)
                            {
                                case "Double":
                                    pi.SetValue(newprocess, double.Parse(message.Properties[pi.Name].ToString()), null);
                                    break;
                                case "Float":
                                    pi.SetValue(newprocess, float.Parse(message.Properties[pi.Name].ToString()), null);
                                    break;
                                case "Int64":
                                    pi.SetValue(newprocess, Int64.Parse(message.Properties[pi.Name].ToString()), null);
                                    break;
                                case "Int32":
                                    pi.SetValue(newprocess, Int32.Parse(message.Properties[pi.Name].ToString()), null);
                                    break;
                                case "DateTime":
                                    pi.SetValue(newprocess, DateTime.Parse(message.Properties[pi.Name].ToString()), null);
                                    break;
                                case "Boolean":
                                    pi.SetValue(newprocess, Boolean.Parse(message.Properties[pi.Name].ToString()), null);
                                    break;
                                default:
                                    pi.SetValue(newprocess, message.Properties[pi.Name], null);
                                    break;
                            }
                        }
                        catch
                        {
                            //Ignore the property setting error
                        }
                    }
                }

                return newprocess;
            }
            catch
            {
                return null;
            }
        }



        public static DeferredProcessExitCode ReconstructAndExecute(MessageBroker messageBroker, BrokeredMessage message, int instanceNumber, int threadNumber)
        {
            DeferredProcessExitCode retval = DeferredProcessExitCode.NothingToDo;
            DeferredProcess newprocess = null;
            try
            {
                Type deferredType = Assembly.GetAssembly(typeof(DeferredProcess)).GetType(message.Properties["Class"].ToString());
                if (deferredType == null)
                {
                    return DeferredProcessExitCode.NothingToDo;
                }

                newprocess = (DeferredProcess)Activator.CreateInstance(deferredType);

                newprocess.ID = message.Properties["ID"] != null ? message.Properties["ID"].ToString() : "";

                foreach (PropertyInfo pi in deferredType.GetProperties())
                {
                    Type declaringType = pi.PropertyType;

                    try
                    {
                        switch (declaringType.Name)
                        {
                            case "Double":
                                pi.SetValue(newprocess, double.Parse(message.Properties[pi.Name].ToString()), null);
                                break;
                            case "Float":
                                pi.SetValue(newprocess, float.Parse(message.Properties[pi.Name].ToString()), null);
                                break;
                            case "Int64":
                                pi.SetValue(newprocess, Int64.Parse(message.Properties[pi.Name].ToString()), null);
                                break;
                            case "Int32":
                                pi.SetValue(newprocess, Int32.Parse(message.Properties[pi.Name].ToString()), null);
                                break;
                            case "DateTime":
                                pi.SetValue(newprocess, DateTime.Parse(message.Properties[pi.Name].ToString()), null);
                                break;
                            case "Boolean":
                                pi.SetValue(newprocess, Boolean.Parse(message.Properties[pi.Name].ToString()), null);
                                break;
                            default:
                                pi.SetValue(newprocess, message.Properties[pi.Name], null);
                                break;
                        }
                    }
                    catch
                    {
                        //Ignore the property setting error
                    }
                }

                //Time the execution
                long ts = DateTime.UtcNow.Ticks;
                retval = newprocess.Execute(messageBroker);
                double milliseconds = (new TimeSpan(DateTime.UtcNow.Ticks - ts)).TotalMilliseconds;
            }
            catch
            {
                retval = DeferredProcessExitCode.Error;
            }
            finally
            {
                newprocess = null;
            }
            return retval;
        }

        //protected void LogEvent(string shortDescription, string details, WorkItemEventType eventType)
        //{
        //    if (eventClient == null)
        //    {
        //        eventClient = new WorkItemEventClient(this.GetType().Name);
        //    }
        //    eventClient.AddNewItem(new WorkItemEvent { Type = eventType.ToString(), ShortDescription = shortDescription, Details = details, PartitionKey = ID, RowKey = ShortGuidGenerator.NewGuid(), ClassName = this.GetType().Name });
        //}


        public virtual DeferredProcessExitCode Execute(MessageBroker messageBroker)
        {
            throw new NotImplementedException();
        }

        public DeferredProcessExitCode Run()
        {
            return Run(null, true, this.GetType().Name);
        }
        public DeferredProcessExitCode Run(MessageBroker msgbroker)
        {
            return Run(msgbroker, false, this.GetType().Name);
        }
        public DeferredProcessExitCode Run(MessageBroker msgbroker, string msgheader)
        {
            return Run(msgbroker, false, this.GetType().Name + " " + msgheader);
        }
        public DeferredProcessExitCode Run(MessageBroker messageBroker, bool runImmediately, string msgheader)
        {
            if (runImmediately || messageBroker == null)
            {
                try
                {
                    DeferredProcessExitCode exitcode = this.Execute(messageBroker);

                    //CloudLogger.Instance.Info(this.GetType().Name, "Run", "Execute", exitcode.ToString(), this.ToJSON());

                    return exitcode;
                }
                catch
                {
                    return DeferredProcessExitCode.Error;
                }
            }
            else
            {
                try
                {
                    ID = messageBroker.SendDeferredProcessAsMessage(this, msgheader);
                    return DeferredProcessExitCode.Success;
                }
                catch
                {
                    return DeferredProcessExitCode.Error;
                }
            }
        }


    }
}