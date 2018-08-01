using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.IO;
using System.Text;

namespace SkillCow.Controllers
{
    public class CoverageProfession
    {
        public CoverageProfession(List<string> tokens)
        {
            Profession = tokens[0]; 	
            CareerVertical	 = tokens[1];
            Discipline	 = tokens[2];
            Branch	 = tokens[3];
            Program = tokens[4];
            ProgramId = tokens[15];

            if (tokens.Count > 33)
            {
                NewProgramId = tokens[33];
            }

            OriginalProgramResults = new List<CoverageProgramResult>();
            OriginalProgramSuggestions = new List<CoverageProgramResult>();
            NewProgramResults = new List<CoverageProgramResult>();
            NewProgramSuggestions = new List<CoverageProgramResult>();
        }
        public string Profession 	{ get; set; }
        public string CareerVertical	{ get; set; }
        public string Discipline	{ get; set; }
        public string Branch	{ get; set; }
        public string Program{ get; set; }
        public string ProgramId { get; set; }
        public string NewProgramId { get; set; }

        public List<CoverageProgramResult> OriginalProgramResults { get; set; }
        public List<CoverageProgramResult> OriginalProgramSuggestions { get; set; }

        public List<CoverageProgramResult> NewProgramResults { get; set; }
        public List<CoverageProgramResult> NewProgramSuggestions { get; set; }
    }
    public class CoverageProgramResult
    {
        public CoverageProgramResult(List<string> tokens)
        {
            ParentId = tokens[0];
            ParentName = tokens[1];
            ProgramId = tokens[2];
            ProgramName = tokens[3];
            ClientId = tokens[4];
            ClientSetId = tokens[5];
            FormId = tokens[6];
            Payout = tokens[7];
            FormName = tokens[8];
            FrontEndName = tokens[9];
            City = tokens[10];
            State = tokens[11];
            Distance = tokens[12];
            CampusId = tokens[13];
            CampusType = tokens[14];
            CampusName = tokens[15];
            CampusProximity = tokens[16];
            CompositeCampusKey = tokens[17];
            StudyProgramId = tokens[18];
            StudyProgramType = tokens[19];
            DegreeLevel = tokens[20];
            StudyProgramIsPrimary = tokens[21];
            StudyProgramTypeName = tokens[22];
            StudyProgramName = tokens[23];
        }
        public string ParentId { get; set; }
        public string ParentName { get; set; }
        public string ProgramId { get; set; }
        public string ProgramName { get; set; }
        public string ClientId { get; set; }
        public string ClientSetId { get; set; }
        public string FormId { get; set; }
        public string Payout { get; set; }
        public string FormName { get; set; }
        public string FrontEndName { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Distance { get; set; }
        public string CampusId { get; set; }
        public string CampusType { get; set; }
        public string CampusName { get; set; }
        public string CampusProximity { get; set; }
        public string CompositeCampusKey { get; set; }
        public string StudyProgramId { get; set; }
        public string StudyProgramType { get; set; }
        public string DegreeLevel { get; set; }
        public string StudyProgramIsPrimary { get; set; }
        public string StudyProgramTypeName { get; set; }
        public string StudyProgramName { get; set; }
    }
    public class CoverageController : ControllerBase
    {
        //
        // GET: /Coverage/
        

        public ActionResult Undergrad()
        {
            //Load coverage file
            List<CoverageProgramResult> coverage = new List<CoverageProgramResult>();
            using (StreamReader sr = new StreamReader(@"c:\chaindate\skillcow\coverage.csv"))
            {
                string line = sr.ReadLine(); //Skip header
                line = sr.ReadLine();
                while (line != null)
                {
                    List<string> tokens = ParseCSV(line);
                    CoverageProgramResult result = new CoverageProgramResult(tokens);
                    if (result.DegreeLevel == "Undergrad")
                    {
                        coverage.Add(result);
                    }
                    line = sr.ReadLine();
                }
            }
            ViewBag.Coverage = coverage;

            //Load professions
            List<CoverageProfession> professions = new List<CoverageProfession>();
            using (StreamReader sr = new StreamReader(@"c:\chaindate\Professions.csv"))
            {
                string line = sr.ReadLine(); //Skip header
                line = sr.ReadLine();
                while (line != null)
                {
                    List<string> tokens = ParseCSV(line);
                    CoverageProfession p = new CoverageProfession(tokens);

                    
                    
                    /*
                    CoverageProgramResult oneresult = p.OriginalProgramResults.FirstOrDefault();
                    
                    if (oneresult != null)
                    {
                        p.OriginalProgramSuggestions = new List<CoverageProgramResult>(coverage.Where(x => x.ParentId==oneresult.ParentId && x.ProgramId != p.ProgramId));
                    }
                     * */

                    //p.NewProgramResults = new List<CoverageProgramResult>(coverage.Where(x => x.ProgramId == p.NewProgramId));

                    /*
                    oneresult = p.NewProgramResults.FirstOrDefault();
                    if (oneresult != null)
                    {
                        p.NewProgramSuggestions = new List<CoverageProgramResult>(coverage.Where(x => x.ParentId == oneresult.ParentId && x.ProgramId != p.NewProgramId));
                    }
                    */

                    professions.Add(p);
                    line = sr.ReadLine();
                }
            }

            ViewBag.Controller = this;

            return View(professions);
        }

        public string ResolveProgramId(CoverageProfession p, Dictionary<string, string> idmap)
        {
            if (idmap.ContainsKey(p.Profession))
            {
                return idmap[p.Profession];
            }
            else
            {
                return p.ProgramId;
            }
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
    }
}
