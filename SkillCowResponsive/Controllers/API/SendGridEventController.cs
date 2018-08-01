using Newtonsoft.Json.Linq;
using SkillCowResponsive.Classes.Cloud.TableStorage.SendGridEvent;
using SkillCowResponsive.Classes.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace SkillCowResponsive.Controllers.API
{
    public class SendGridEventController : ApiController
    {
        [HttpPost]
        public HttpResponseMessage Report()
        {
            SendGridEventClient sgec = new SendGridEventClient();
            string str = Request.Content.ReadAsStringAsync().Result;
            if (JToken.Parse(str).Type == JTokenType.Array)
            {
                dynamic stuff = JArray.Parse(str);
                foreach (dynamic item in stuff)
                {
                    if (item["event"] != null && item["email"] != null) 
                    {
                        string eventType = item["event"];
                        string email = item["email"];
                        email = email.ToLower();
                        SendGridEvent eventItem = sgec.GetByPartitionAndRowKey(SendGridEventClient.GetPartitionKeyForEmail(email), email);
                        if (eventItem != null)
                        {
                            switch (eventType)
                            {
                                case "click":
                                    eventItem.Clicked++;
                                    break;
                                case "open":
                                    eventItem.Opened++;
                                    break;
                                case "dropped":
                                    eventItem.Delivered = false;
                                    break;
                                case "bounce":
                                    eventItem.Delivered = false;
                                    break;
                                case "delivered":
                                    eventItem.Delivered = true;
                                    break;
                                case "unsubscribe":
                                    eventItem.Unsubscribed = true;
                                    break;
                                case "spam":
                                    eventItem.Spam = true;
                                    break;
                                default:
                                    continue;
                            }
                            eventItem.LastUpdated = EasternTimeConverter.Convert(DateTime.UtcNow);
                            sgec.Update(eventItem);
                        }
                        else
                        {
                            eventItem = new SendGridEvent { PartitionKey = SendGridEventClient.GetPartitionKeyForEmail(email), RowKey = email, Email = email, Delivered = true, Clicked = 0, Opened = 0 };
                            switch (eventType)
                            {
                                case "click":
                                    eventItem.Clicked = 1;
                                    break;
                                case "open":
                                    eventItem.Opened = 1;
                                    break;
                                case "dropped":
                                    eventItem.Delivered = false;
                                    break;
                                case "bounce":
                                    eventItem.Delivered = false;
                                    break;
                                case "delivered":
                                    break;
                                case "unsubscribe":
                                    eventItem.Unsubscribed = true;
                                    break;
                                case "spam":
                                    eventItem.Spam = true;
                                    break;
                                default:
                                    continue;
                            }
                            sgec.AddNewItem(eventItem);
                        }
                    }
                }
            }
            return new HttpResponseMessage { StatusCode = HttpStatusCode.OK };
        }
    }
}
