using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text.RegularExpressions;

namespace SkillCowResponsive.Classes.Helpers
{
    public class PinCodeGenerator
    {
        const string letters = "ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz123456789";
        //const string letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        public static string NewPin()
        {
            char[] chars = new char[5];

            Random rnd = RandomHelper.Instance;

            chars[0] = letters[rnd.Next(0, letters.Length)];

            for (int i = 1; i < 5; i++)
            {
                char nextChar = letters[rnd.Next(0, letters.Length)];
                if (Math.Abs(chars[i - 1] - nextChar) == 1 || chars.Contains(nextChar)) {
                    i--;
                } else {
                    chars[i] = nextChar;
                }               
            }

            string pin = new String(chars);
            if (checkPinCode(pin))
            {
                return pin;
            }
            else
            {
                return NewPin();
            }
            
        }
        public static bool checkPinCode(string pin)
        {
            Regex duplicates = new Regex(@"^(?:([A-Za-z0-9])(?!.*\1))*$");
            Regex format = new Regex(@"^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{5,}$");
            bool temp1 = duplicates.IsMatch(pin);
            bool temp2 = format.IsMatch(pin);
            return duplicates.IsMatch(pin) && format.IsMatch(pin);
        }
    }
}