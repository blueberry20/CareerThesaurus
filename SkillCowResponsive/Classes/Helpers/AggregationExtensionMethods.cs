using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SkillCowResponsive.Classes.Helpers
{
    public static class AggregationExtensionMethods
    {
        public static Dictionary<string, int> CountBy<T>(this IEnumerable<T> list, Func<T, string> groupKeySelector)
        {
            return CountBy(list, null, groupKeySelector);
        }

        public static Dictionary<string, int> CountBy<T>(this IEnumerable<T> list, Func<T, bool> filterSelector, Func<T, string> groupKeySelector)
        {
            Dictionary<string, int> results = new Dictionary<string, int>();

            foreach (T item in list)
            {
                if (filterSelector==null || filterSelector(item))
                {
                    string groupKey = groupKeySelector(item);

                    if (!results.ContainsKey(groupKey))
                        results.Add(groupKey, 1);
                    else
                        results[groupKey]++;
                    
                }
            }

            return results;
        }
        public static Dictionary<string, double> SumBy<T>(this IEnumerable<T> list, Func<T, string> groupKeySelector, Func<T, double> valueSelector)
        {
            return SumBy(list, null, groupKeySelector, valueSelector);
        }
        public static Dictionary<string, double> SumBy<T>(this IEnumerable<T> list, Func<T, bool> filterSelector, Func<T, string> groupKeySelector, Func<T, double> valueSelector)
        {
            Dictionary<string, double> results = new Dictionary<string, double>();


            foreach (T item in list)
            {
                if (filterSelector == null || filterSelector(item))
                {
                    string groupKey = groupKeySelector(item);

                    if (!results.ContainsKey(groupKey))
                        results.Add(groupKey, valueSelector(item));
                    else
                        results[groupKey] += valueSelector(item);
                }
            }

            return results;
        }
    }
}