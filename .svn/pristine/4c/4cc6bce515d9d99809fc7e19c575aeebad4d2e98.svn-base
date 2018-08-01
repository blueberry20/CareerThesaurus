using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SkillCowResponsive.Classes.Helpers
{
    public class ShortGuidGenerator
    {
        const string letters = "abcdefghijklmnopqrstuvwxyz0123456789";
        public static string NewGuid()
        {
            string timestamp = DateTime.UtcNow.Ticks.ToString();

            char[] chars = new char[24];

            int letterTotalCount = 24 - timestamp.Length;

            int timestampIndex = 0;
            int letterIncludedCount = 0;

            Random rnd = RandomHelper.Instance;

            for (int i = 0; i < 24; i++)
            {
                int useLetter = 0;
                if (letterIncludedCount < letterTotalCount)
                    useLetter = rnd.Next(0, 3);

                if (useLetter == 1)
                {
                    chars[i] = letters[rnd.Next(0, 36)];
                    letterIncludedCount++;
                }
                else
                {
                    chars[i] = timestamp[timestampIndex++];
                }
                if (timestampIndex == timestamp.Length)
                {
                    //all timestamp digits were used, fill any remaining character slots with random letters
                    for (int j = i + 1; j < 24; j++)
                    {
                        chars[j] = letters[rnd.Next(0, 36)];
                    }
                    break;
                }
            }

            string guid = new String(chars);
            return guid;
        }
    }
}