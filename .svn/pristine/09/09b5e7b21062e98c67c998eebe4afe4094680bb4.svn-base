using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using SkillCow.Classes.Cloud.TableStorage;

namespace SkillCow.Controllers
{
    public class _xyz_agentsController : ControllerBase
    {
        //
        // GET: /_xyz_agents/

        public ActionResult Index()
        {
            AgentClient ac = new AgentClient();
            return View(ac.GetAll().Execute());
        }

        //
        // GET: /_xyz_agents/Details/5

        public ActionResult Details(string id)
        {
            AgentClient ac = new AgentClient();
            Agent model = ac.GetByRowKey(id);
            return View(model);
        }

        //
        // GET: /_xyz_agents/Create

        public ActionResult Create()
        {
            return View(new Agent());
        } 

        //
        // POST: /_xyz_agents/Create

        [HttpPost]
        public ActionResult Create(Agent model)
        {

            try
            {
                AgentClient ac = new AgentClient();

                
                ac.AddNewItem(model);

                return RedirectToAction("Index");
            }
            catch
            {
                return View(model);
            }
        }
        
        //
        // GET: /_xyz_agents/Edit/5

        public ActionResult Edit(string id)
        {
            AgentClient ac = new AgentClient();
            Agent model = ac.GetByRowKey(id);
            return View(model);
        }

        //
        // POST: /_xyz_agents/Edit/5

        [HttpPost]
        public ActionResult Edit(Agent model)
        {
            try
            {
                AgentClient ac = new AgentClient();
                ac.Update(model);
 
                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        
        
    }
}
