using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SkillCowResponsive.Classes.Encryption
{
    public class ClientSession
    {
        public static string GetClientSessionKey(string clienttype, string username, string clientid, string clientrowkey)
        {
            string sessionkeycontent = clienttype + "|" + username + "|" + clientid + "|" + clientrowkey;
            SimpleAES simpleaes = new SimpleAES();
            return simpleaes.EncryptToString(sessionkeycontent);
        }
    }
}