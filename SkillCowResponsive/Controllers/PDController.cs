using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using SkillCowResponsive.Classes.Cloud.TableStorage.PDEntries;
using SkillCowResponsive.Classes;
using System.IO;

namespace SkillCowResponsive.Controllers
{
    public class PDController : Controller
    {
        //
        // GET: /PD/
        [HttpGet]
        public ActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public ActionResult Index(FormCollection collection)
        {
            string email = collection["email"];
            PDEntriesClient pdec = new PDEntriesClient();
            pdec.AddNewItem(new PDEntries { AgencyName = collection["agencyname"], Address = collection["agencyaddress"], City = collection["agencycity"], State = collection["state"], Zip = collection["zip"], FullName = collection["name"], Title = collection["title"], Email = collection["email"], Phone = collection["phone"] });
            EmailManager emailManager = new EmailManager();
            string str = "<p>Agency name: " + collection["agencyname"] + "</p><p>Title: " + collection["title"] + "</p><p>Full name: " + collection["name"] + "</p><p>Address: " + collection["agencyaddress"] + "</p><p>City: " + collection["agencycity"] + "</p><p>State: " + collection["state"] + "</p><p>Zip: " + collection["zip"] + "</p><p>Email: " + collection["email"] + "</p><p>Phone: " + collection["phone"] + "</p>";
            emailManager.SendMail("no-reply@careerthesaurus.com", "Admin", "mike@peopli.com", "PD registrations", str);
            return RedirectToAction("Thankyou", "PD");
        }
        public ActionResult Thankyou()
        {
            return View();
        }
        public ActionResult _xyz()
        {
            return View();
        }
        public void DeletePDTable()
        {
            PDEntriesClient pdc = new PDEntriesClient();
            //pdc.DeleteTable();
        }

        class matchedwords
        {
            public string Word { get; set; }
            public List<char> remainingChars { get; set; }
            public List<matchedwords> MatchedWords { get; set; }
        }

        public List<string> goodWords = new List<string>();
        public void Temp()
        {
            string str = "poultry outwits ants";
            //string str = "good";
            List<char> charArray = str.Replace(" ", "").ToCharArray().ToList();
            string md5 = "4624d200580677270a54ccff86b9610e";
            List<char> charArrayDist = str.Replace(" ", "").ToCharArray().Distinct().ToList();
            var words = new Dictionary<string, string>();
            string filename = @"c:\wordlist";

            int cnt = 0;

            using (StreamReader sr = new StreamReader(filename))
            {
                string line;
                do
                {
                    line = sr.ReadLine();
                    if (line != null)
                    {
                        line = line.Replace("\'", "");
                        List<char> lineChars = line.ToCharArray().ToList();
                        if (lineChars.All(x => charArrayDist.Contains(x) && charArrayDist.FindAll(y => y == x).Count >= lineChars.FindAll(y => y == x).Count) && line.Length > 1)
                        {
                            goodWords.Add(line);
                        }
                    }
                } while (line != null);
            }
            List<matchedwords> Matches = getwords(charArray, goodWords.Distinct().ToList());
            List<string> phrases = new List<string>(getstrings("", Matches));
            
            string st = "";
        }
        private List<matchedwords> getwords(List<char> chars, List<string> words)
        {
            List<matchedwords> result = new List<matchedwords>();
            foreach (string word in words)
            {
                List<char> wordChars = word.ToCharArray().ToList();
                List<char> leftover = new List<char>(chars);
                if (wordChars.All(x => leftover.Contains(x)))
                {
                    foreach (char Char in wordChars)
                    {
                        leftover.RemoveAt(leftover.FindIndex(x => x == Char));
                    }
                    List<string> possibleWords = new List<string>(words.Where(x => x.Length <= leftover.Count && x.All(y => leftover.Contains(y))));
                    result.Add(new matchedwords { Word = word, remainingChars = leftover, MatchedWords = leftover.Count == 0 || leftover.Count == 1 ? null : getwords(leftover, possibleWords) });
                }
            }
            return result;
        }
        private List<string> getstrings(string phrase, List<matchedwords> mm)
        {
            List<string> results = new List<string>();
            foreach (matchedwords m in mm)
            {
                List<string> a = getstrings(phrase, m.MatchedWords);
                foreach (string aa in a)
                {
                    results.Add(phrase + " " + m.Word + " " + aa);
                }

            }
            return results;
        }
    }
}
