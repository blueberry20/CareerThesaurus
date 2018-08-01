function showsummary() {

    var resultdimensions = getresults();
    var inputs = new Array();

    $('#summarycontent').html('');

    var container = document.getElementById('summarycontent');

    var title1 = document.createElement('b');
    title1.innerHTML = 'Results';
    container.appendChild(title1);

    var tblresults = document.createElement('table');

    for (var i = 0; i < resultdimensions.length; i++) {
        var tr = document.createElement('tr');

        var td1 = document.createElement('td');
        var td2 = document.createElement('td');
        var td3 = document.createElement('td');

        var bestresult = selectbestdimensionresult(resultdimensions[i].values);
        if (bestresult != null) {
            inputs.push({ dimension: resultdimensions[i].dimension, value: bestresult.value, percentage: bestresult.percentage });
        }
        else {
            inputs.push({ dimension: resultdimensions[i].dimension, value: '', percentage: 0 });
        }
        td1.innerHTML = resultdimensions[i].dimension;

        if (bestresult != null) {
            td2.innerHTML = bestresult.value;
            td3.innerHTML = (parseFloat(bestresult.percentage) * 100).toFixed(2) + '%';
        }
        else {
            td2.innerHTML = '';
            td3.innerHTML = '';
        }

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);

        tblresults.appendChild(tr);
    }

    container.appendChild(tblresults);

    var title2 = document.createElement('b');
    title2.innerHTML = 'Breakdown';
    container.appendChild(title2);

    var tbl = document.createElement('table');

    for (var i = 0; i < resultdimensions.length; i++) {
        for (var j = 0; j < resultdimensions[i].values.length; j++) {

            var tr = document.createElement('tr');
            var td1 = document.createElement('td');
            var td2 = document.createElement('td');
            var td3 = document.createElement('td');

            td1.innerHTML = resultdimensions[i].dimension;
            td2.innerHTML = resultdimensions[i].values[j].value;
            td3.innerHTML = (parseFloat(resultdimensions[i].values[j].percentage) * 100).toFixed(2) + '%';

            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);

            tbl.appendChild(tr);
        }
    }

    container.appendChild(tbl);

    matchprofessions(inputs);
}