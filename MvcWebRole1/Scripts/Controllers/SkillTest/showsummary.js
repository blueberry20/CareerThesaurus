
function showsummary() {
    
    var inputs = getinputs();
    var widgetattributes = new Array();

    $('#summarycontent').html('');

    var container = document.getElementById('summarycontent');

    var title1 = document.createElement('b');

    container.appendChild(title1);

    var tblresults = document.createElement('table');

    

    for (var i = 0; i < inputs.length; i++) {

        var input = inputs[i];
        
        //add widget attribute
        if (input.value != '') {
            widgetattributes.push({ name: widgetattributename(input.dimension, input.value), percent: input.percentage });
        }
        
        var tr = document.createElement('tr');

        var td1 = document.createElement('td');
        var td2 = document.createElement('td');
        var td3 = document.createElement('td');

        td1.innerHTML = input.dimension;

        if (input.value != '') {
            td2.innerHTML = input.value;
            td3.innerHTML = (parseFloat(input.percentage) * 100).toFixed(2) + '%';
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

    
    
    showwidgetattributes(widgetattributes);
    

    matchprofessions(inputs);

    

}

function saveTestResults() {

    var inputs = getinputs();

    var results = '{';

    var dimensions = '';
    for (var i = 0; i < inputs.length; i++) {
        var input = inputs[i];
        if (input.value != '') {
            if (i < inputs.length - 1) {
                dimensions += '{"' + input.dimension + '":"' + input.value + '"},';
            }
            else {
                dimensions += '{"' + input.dimension + '":"' + input.value + '"}';
            }
        }
    }

    if (dimensions != '') {
        results += '"dimesions":[' + dimensions + ']';
    }

    results += '}';

    setCookie('testresults', results, 365);

    saveTestResults2();
}

function saveTestResults2() {

    var inputs = getinputs();

    var results = '{';

    var dimensions = '';
    var dimensionsasproperties = '';

    for (var i = 0; i < inputs.length; i++) {
        var input = inputs[i];
        if (input.value != '') {
            if (i < inputs.length - 1) {
                dimensions += '{"' + input.dimension + '":"' + input.value + '"},';
                dimensionsasproperties += '"' + input.dimension + '":"' + input.value + '",';
            }
            else {
                dimensions += '{"' + input.dimension + '":"' + input.value + '"}';
                dimensionsasproperties += '"' + input.dimension + '":"' + input.value + '"';
            }
        }
    }

    if (dimensions != '') {
        results += '"dimesions":[' + dimensions + '],' + dimensionsasproperties;
    }

    results += '}';

    //debugalert('setting testresults2 value = ' + results);

    setCookie('testresults2', results, 365);
}

function showresultannotations(caller) {

    //debugalert('showresultannotations called by ' + caller);

    $('#progresspanel').hide();
    $('#refinementcanvas').hide();

    //debugalert('#test min-height: ' + $('#test').css('min-height'));

    $('#test').css('min-height','30px');
    $('#annotations').show();
    
    

    var inputs = getinputs();

    for (var i = 0; i < inputs.length; i++) {

        var input = inputs[i];

        //show result description
        if (input.value != '') {
            

            $('._' + input.dimension.replace(/ /g, '_').toLowerCase()).hide();
            $('#_' + input.dimension.replace(/ /g, '_').toLowerCase() + '_' + input.value.toLowerCase()).show();
        }
        else {
            $('._' + input.dimension.replace(/ /g, '_').toLowerCase()).hide();
        }
    }
}
