using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SkillCow.Classes.Helpers
{
    public class GeoDistanceCalculator
    {
        const double d2r = 0.0174532925199433;

        //calculate haversine distance for linear distance
        public double haversine_km(double lat1, double long1, double lat2, double long2)
        {
            if ((lat1 + long1 == 0) || (lat2 + long2 == 0))
                return 0;

            double dlong = (long2 - long1) * d2r;
            double dlat = (lat2 - lat1) * d2r;
            double a = Math.Pow(Math.Sin(dlat / 2.0), 2) + Math.Cos(lat1 * d2r) * Math.Cos(lat2 * d2r) * Math.Pow(Math.Sin(dlong / 2.0), 2);
            double c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
            double d = 6367 * c;

            return d;
        }

        public double haversine_mi(double lat1, double long1, double lat2, double long2)
        {
            if((lat1+long1==0) || (lat2+long2==0))
                return 0;

            double dlong = (long2 - long1) * d2r;
            double dlat = (lat2 - lat1) * d2r;
            double a = Math.Pow(Math.Sin(dlat / 2.0), 2) + Math.Cos(lat1 * d2r) * Math.Cos(lat2 * d2r) * Math.Pow(Math.Sin(dlong / 2.0), 2);
            double c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
            double d = 3956 * c; 

            return d;
        }
    }
}