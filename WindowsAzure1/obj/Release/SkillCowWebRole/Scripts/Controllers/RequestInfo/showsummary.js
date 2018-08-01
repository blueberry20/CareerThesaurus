function showsummary() {
    
    var resultdimensions = getresults();
    var inputs = new Array();

    try
    {
        for (var i = 0; i < resultdimensions.length; i++) {
            var bestresult = selectbestdimensionresult(resultdimensions[i].values);
            if (bestresult != null) {
                inputs.push({ dimension: resultdimensions[i].dimension, value: bestresult.value, percentage: bestresult.percentage });
            }
            else {
                inputs.push({ dimension: resultdimensions[i].dimension, value: '', percentage: 0 });
            }
        }
    }
    catch (ex)
    {
        
    }

    
    
    matchprofessions(inputs);

    summaryshown = true;
}