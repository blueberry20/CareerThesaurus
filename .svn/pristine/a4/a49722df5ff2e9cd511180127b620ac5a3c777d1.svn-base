using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text.RegularExpressions;

namespace SkillCowResponsive.Classes.Helpers
{
    public class Password
    {
        const string letters = "ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz123456789";
        //const string letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        public static string TempPassword()
        {
            char[] chars = new char[6];

            Random rnd = RandomHelper.Instance;

            chars[0] = letters[rnd.Next(0, letters.Length)];

            for (int i = 1; i < 6; i++)
            {
                char nextChar = letters[rnd.Next(0, letters.Length)];
                if (Math.Abs(chars[i - 1] - nextChar) == 1 || chars.Contains(nextChar))
                {
                    i--;
                }
                else
                {
                    chars[i] = nextChar;
                }
            }

            string password = new String(chars);
            if (checkPassword(password))
            {
                return password;
            }
            else
            {
                return TempPassword();
            }

        }
        public static bool checkPassword(string password)
        {
            //Regex duplicates = new Regex(@"^(?:([A-Za-z0-9])(?!.*\1))*$");
            Regex format = new Regex(@"^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{6,}$");
            //return duplicates.IsMatch(password) && format.IsMatch(password);
            return format.IsMatch(password);
        }
    }
}