using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SkillCowResponsive.Models
{
    public class StudentReportEntry
    {
        public string email { get; set; }
        public bool emailconfirmed { get; set; }
        public string firstname { get; set; }
        public string lastname { get; set; }
        public string counselorname { get; set; }
        public string counseloremail { get; set; }
        public int interests { get; set; }
        public int traits { get; set; }
        public int likecareers { get; set; }
        public int dislikecareers { get; set; }
    }
}