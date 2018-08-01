using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace SkillCowResponsive.Classes.Factory
{
    public class ControllerFactory : DefaultControllerFactory
    {
        public override IController CreateController(RequestContext requestContext, string controllerName)
        {
            if (requestContext == null)
            {
                throw new ArgumentNullException("requestContext");
            }

            if (String.IsNullOrEmpty(controllerName))
            {
                throw new ArgumentException("MissingControllerName");
            }

            var controllerType = GetControllerType(requestContext, controllerName);
            
            if (controllerType == null)
            {
                var catchAllRoute = string.Join("/", requestContext.RouteData.Values.Values);
                controllerName = "CatchAll";
                controllerType = GetControllerType(requestContext, controllerName);
                requestContext.RouteData.Values["Controller"] = controllerName;
                requestContext.RouteData.Values["action"] = "ChoosePage";
                requestContext.RouteData.Values["catchAllRoute"] = catchAllRoute;
            }
            else if (controllerType.Name.ToLower().Contains("skillcow"))
            {
                var catchAllRoute = string.Join("/", requestContext.RouteData.Values.Values);
                controllerName = "SkillCow";
                controllerType = GetControllerType(requestContext, controllerName);
                requestContext.RouteData.Values["Controller"] = controllerName;
                requestContext.RouteData.Values["action"] = "Index";
                requestContext.RouteData.Values["catchAllRoute"] = catchAllRoute;
            }
            IController controller = GetControllerInstance(requestContext, controllerType);
            return controller;
        }
    }
}