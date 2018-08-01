using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Reflection;

namespace SkillCowResponsive.Classes.Helpers
{
    public class ExtensionMethodHelper
    {
        public static MethodInfo GetAsNoTrackingMethod(Type specializationType)
        {
            IEnumerable<MethodInfo> methods = GetMethodsByName(typeof(System.Data.Entity.DbExtensions), "AsNoTracking");

            MethodInfo method = null; 
            foreach (var methodInfo in methods)
            {
                foreach (ParameterInfo pi in methodInfo.GetParameters())
                {
                    var paramType = pi.ParameterType;
                    if (paramType.Name == "IQueryable")
                    {
                        // we are looking for  Func<TSource, bool>, the other has 3
                        method = methodInfo;
                        break;
                    }
                }
                if (method != null)
                    break;
            }

            return method; // method.MakeGenericMethod(specializationType);
        }
        public static MethodInfo GetWhereMethod(Type specializationType)
        {
            // The SingleOrDefault method lives on the Enumerable type in System.Linq
            var methods = GetMethodsByName(typeof(System.Linq.Enumerable), "Where");

            // 2 (There are 2 methods that are called Where)
            MethodInfo method = null;
            foreach (var methodInfo in methods)
            {
                foreach (ParameterInfo pi in methodInfo.GetParameters())
                {
                    var paramType = pi.ParameterType;
                    if (paramType.GetGenericArguments().Count() == 2)
                    {
                        // we are looking for  Func<TSource, bool>, the other has 3
                        method = methodInfo;
                        break;
                    }
                }
                if (method != null)
                    break;
            }

            // we need to specialize it 
            return method.MakeGenericMethod(specializationType);
        }
        public static MethodInfo GetSingleOrDefaultMethod(Type specializationType)
        {
            // The SingleOrDefault method lives on the Enumerable type in System.Linq
            var methods = GetMethodsByName(typeof(System.Linq.Enumerable), "SingleOrDefault");

            // 2 (There are 2 methods that are called Where)
            MethodInfo method = null;
            foreach (var methodInfo in methods)
            {
                foreach(ParameterInfo pi in methodInfo.GetParameters())
                {
                    var paramType = pi.ParameterType;
                    if (paramType.GetGenericArguments().Count() == 2)
                    {
                        // we are looking for  Func<TSource, bool>, the other has 3
                        method = methodInfo;
                        break;
                    }
                }
                if (method != null)
                    break;
            }

            // we need to specialize it 
            return method.MakeGenericMethod(specializationType);
        }
        private static IEnumerable<MethodInfo> GetMethodsByName(Type definingType, string methodName)
        {
            return definingType
                .GetMethods(BindingFlags.Static | BindingFlags.Public)
                .Where(mi => mi.Name == methodName);
        }


    }


}