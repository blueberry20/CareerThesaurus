using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Twilio;

namespace SkillCowResponsive.Classes.Helpers
{
    public class Telephony
    {
        public void SendSMS(string number, string text)
        {

            if (number.Length != 12)
            {
                throw new Exception("Number must be formatted like this: +19175551212");
            }

            // Use your account SID and authentication token instead
            // of the placeholders shown here.
            string accountSID = "AC83c411cb030e7d110630044dafbc5d4a";
            string authToken = "bd5c06eec0eb4a93625eb44791b1e096";

            // Create an instance of the Twilio client.
            TwilioRestClient client;
            client = new TwilioRestClient(accountSID, authToken);

            // Send an SMS message.
            SMSMessage result = client.SendSmsMessage("+18048843269", number, text);

            if (result.RestException != null)
            {
                //an exception occurred making the REST call
                string message = result.RestException.Message;
            }
        }
    }
}