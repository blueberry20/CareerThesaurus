using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.IO;
using System.Text;
using SkillCow.Classes;

namespace SkillCow.Controllers
{
    public class IndeedKeywordsController : ControllerBase
    {
        //
        // GET: /IndeedKeywords/

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult GeneratePhrases()
        {
            Dictionary<string, string[]> phrases = new Dictionary<string, string[]>();
            List<string> titleslist = new List<string>();
            Dictionary<string, int> keywords = new Dictionary<string, int>();

            string[] excludedKeywords = new string[] { "now", "needed", "time", "part", "ii", "jobs", "need", "up", "th", "us", "macy", "at", "no", "end", "nyc" };
            using (StreamReader sr = new StreamReader(@"c:\chaindate\skillcow\indeed_top_keywords.csv"))
            {
                string line = sr.ReadLine();
                while (line != null)
                {
                    if (line != null)
                    {
                        List<string> tokens = ParseCSV(line);

                        if (tokens.Count > 0)
                        {
                            if (!excludedKeywords.Contains(tokens[0]))
                            {
                                keywords.Add(tokens[0], int.Parse(tokens[1]));
                            }
                        }
                    }
                    line = sr.ReadLine();
                }
            }

            using (StreamReader sr = new StreamReader(@"c:\chaindate\skillcow\indeed_job_titles.csv"))
            {
                string line = sr.ReadLine();
                while (line != null)
                {
                    if (line != null)
                    {
                        List<string> tokens = ParseCSV(line);

                        if (tokens.Count > 0)
                        {
                            titleslist.Add(tokens[0]);
                            phrases.Add(tokens[0], GeneratePhrases(tokens[0], keywords));
                        }
                    }
                    line = sr.ReadLine();
                }
            }

            

            Dictionary<string, int> uniquephrases = new Dictionary<string, int>();
            foreach (KeyValuePair<string, string[]> kv in phrases)
            {
                for (int i = 0; i < kv.Value.Length; i++)
                {
                    if (!uniquephrases.ContainsKey(kv.Value[i]))
                    {
                        uniquephrases.Add(kv.Value[i], RankPhrase(kv.Value[i], titleslist));
                    }
                }
            }
            
            ViewBag.Phrases = uniquephrases.OrderByDescending(kv=>kv.Value);
            ViewBag.Keywords = keywords;
            
            //Markup titles
            EnrichTitlesWithKeywordMarkup(ref titleslist, ref keywords);
            ViewBag.Titles = titleslist;
            
            return View();
        }

        public static List<string> ParseCSV(string line)
        {
            int q = 0;

            StringBuilder sb = new StringBuilder();
            List<string> values = new List<string>();

            foreach (char c in line)
            {
                if (c == '\"')
                {
                    q++;
                }
                if (c == ',' && q % 2 == 0)
                {
                    values.Add(sb.ToString().Replace("\"", ""));
                    sb = new StringBuilder();
                }
                else
                {
                    sb.Append(c);
                }


            }
            values.Add(sb.ToString().Replace("\"", ""));

            return values;
        }

        private void EnrichTitlesWithKeywordMarkup(ref List<string> titles, ref Dictionary<string, int> keywords)
        {
            for (int i = 0; i < titles.Count; i++)
            {
                titles[i] = EnrichTitleWithKeywordMarkup(titles[i].ToLower(), ref keywords);
            }
        }
        private string EnrichTitleWithKeywordMarkup(string title, ref Dictionary<string, int> keywords)
        {
            string legalwordseparators = "()[]/-?!.,& ";

            string retval = "";
            foreach (KeyValuePair<string, int> kv in keywords)
            {
                if (kv.Value >= 250)
                {
                    if (kv.Key == "teacher")
                    {
                        Console.Write("Analyze this");
                    }
                    int startpos = title.IndexOf(kv.Key);

                    if (startpos >= 0)
                    {
                        bool notstandalone = false;

                        //Check that this is a stand along word
                        //Break if its surrounded by characters other than ()/- and space
                        if (startpos > 0 && !legalwordseparators.Contains(title[startpos - 1]))
                        {
                            notstandalone = true;
                        }
                        if (startpos + kv.Key.Length < title.Length && !legalwordseparators.Contains(title[startpos + kv.Key.Length]))
                        {
                            notstandalone = true;
                        }

                        if (!notstandalone)
                        {
                            title = title.Replace(kv.Key, "<span>" + kv.Key + "<sup>" + kv.Value + "</sup></span>");
                        }
                    }
                }
            }
            return title;
        }

        private string[] GeneratePhrases(string title, Dictionary<string, int> rankedkeywords)
        {
            title = title.Replace(" / ", " | ").Replace(" - ", " | ").Replace(",", " | ");

            List<string> phrases = new List<string>();

            string[] tokens = title.Split('|');
            foreach (string token in tokens)
            {
                string[] words = token.Trim().Split(' ');

                List<RankedString> rankedwords = new List<RankedString>();
                foreach (string word in words)
                {
                    if (rankedkeywords.ContainsKey(word.Trim().ToLower()))
                    {
                        rankedwords.Add(new RankedString { Text = word.Trim(), Rank = rankedkeywords[word.Trim().ToLower()] });
                    }
                    else
                    {
                        rankedwords.Add(new RankedString { Text = word.Trim(), Rank = 0 });
                    }
                }

                phrases.AddRange(GetConsecutiveKeywordPhrases(rankedwords, 250));
                phrases.AddRange(GetKeywordPhrasesWithNeigbors(rankedwords, 250, "*k"));
                phrases.AddRange(GetKeywordPhrasesWithNeigbors(rankedwords, 250, "k*"));
                phrases.AddRange(GetKeywordPhrasesWithNeigbors(rankedwords, 250, "**k"));
                phrases.AddRange(GetKeywordPhrasesWithNeigbors(rankedwords, 250, "k**"));
                phrases.AddRange(GetKeywordPhrasesWithNeigbors(rankedwords, 250, "*k*"));
                phrases.AddRange(GetKeywordPhrasesWithNeigbors(rankedwords, 250, "**k*"));
                phrases.AddRange(GetKeywordPhrasesWithNeigbors(rankedwords, 250, "**k**"));
                phrases.AddRange(GetKeywordPhrasesWithNeigbors(rankedwords, 250, "*k**"));
            }

            //Make unique list
            List<string> unique = new List<string>();
            foreach (string phrase in phrases)
            {
                if (!unique.Contains(phrase))
                {
                    unique.Add(phrase);
                }
            }

            

            return unique.ToArray();
        }

        private string[] GetConsecutiveKeywordPhrases(List<RankedString> words, int minrank)
        {   
            List<string> phrases = new List<string>();

            bool constructing = false;
            StringBuilder sb = new StringBuilder();
            foreach (RankedString word in words)
            {
                if (word.Rank >= minrank)
                {
                    constructing = true;
                }
                else
                {
                    constructing = false;
                    if (sb.Length > 0)
                    {
                        //Only multiple word phrases here
                        if (sb.ToString().Trim().Contains(" ")) 
                        {
                            phrases.Add(sb.ToString().Trim());
                        }
                        sb.Clear();
                    }
                }
                if (constructing)
                {
                    sb.Append(word.Text.Trim() + " ");
                }
            }

            if (sb.Length > 0)
            {
                if (sb.ToString().Trim().Contains(" "))
                {
                    phrases.Add(sb.ToString().Trim());
                }
            }
            return phrases.ToArray();
        }

        private string[] GetKeywordPhrasesWithNeigbors(List<RankedString> words, int minrank, string mask)
        {
            List<string> phrases = new List<string>();

            int preceedingwordstarget = mask.IndexOf("k");
            int trailingwordstarget = mask.Length - mask.IndexOf("k") - 1;
            int preceedingwords = 0;
            int trailingwords = 0;

            int firstkeywordindex = -1;

            bool heavykeywordprocesed = false;

            //Find the position of the first heavy keyword
            for (int i = 0; i < words.Count; i++)
            {
                RankedString word = words[i];
                if (word.Rank >= minrank)
                {
                    firstkeywordindex = i;
                    break;
                }
            }
            
            if(firstkeywordindex==-1)
            {
                return phrases.ToArray();
            }

            bool constructing = false;
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < words.Count; i++)
            {
                RankedString word = words[i];

                bool processingpreceeding = false;
                if (!heavykeywordprocesed && preceedingwordstarget > 0 && preceedingwords < preceedingwordstarget)
                {
                    if (i >= firstkeywordindex - preceedingwordstarget)
                    {
                        constructing = true;
                        processingpreceeding = true;
                    }
                }

                if (word.Rank >= minrank)
                {
                    constructing = true;
                    heavykeywordprocesed = true;
                }

                if (!processingpreceeding && heavykeywordprocesed && (trailingwordstarget == 0 || trailingwordstarget == trailingwords))
                {
                    if (word.Rank < minrank)
                    {
                        constructing = false;
                        if (sb.Length > 0)
                        {
                            //Only multiple word phrases here
                            if (sb.ToString().Trim().Contains(" "))
                            {
                                phrases.Add(sb.ToString().Trim());
                            }
                            sb.Clear();
                        }
                    }
                }

                if (constructing)
                {
                    if (!word.Text.Trim().StartsWith("(") && !word.Text.Trim().EndsWith(")"))
                    {
                        sb.Append(word.Text.Trim() + " ");

                        if (word.Rank < minrank)
                        {
                            if (heavykeywordprocesed)
                            {
                                trailingwords++;
                            }
                            else
                            {
                                preceedingwords++;
                            }
                        }
                    }
                }
            }

            if (sb.Length > 0)
            {
                if (sb.ToString().Trim().Contains(" "))
                {
                    phrases.Add(sb.ToString().Trim());
                }
            }
            return phrases.ToArray();
        }

        private int RankPhrase(string phrase, List<string> titles)
        {
            int cnt = 0;
            foreach (string title in titles)
            {
                if (title.Contains(phrase))
                {
                    cnt++;
                }
            }
            return cnt;
        }
    }
}
