var importantthings = new Array();

function restoreCheckedState(e) {
    $(e).attr('value', '1');
    $('#importantthing_check_' + $(e).attr('name')).animate({ opacity: 0.8 }, 500);
    setimportantthing($(e).attr('name'), $(e).attr('caption'), 1, true);
}

function importantThingClicked(e, restoringstate) {

    if ($(e).attr('value') == '0') {
        $(e).attr('value', '1');
        $('#importantthing_check_' + $(e).attr('name')).animate({opacity:0.8},0);
        setimportantthing($(e).attr('name'), $(e).attr('caption'), 1, restoringstate);
        
    }
    else {
        $(e).attr('value', '0');
        $('#importantthing_check_' + $(e).attr('name')).animate({ opacity: 0 }, 0);
        setimportantthing($(e).attr('name'), $(e).attr('caption'), 0, restoringstate);
    }
        
    listSelectedThings();
}

function listSelectedThings() {

    $('#selectedthings').html('');

    var cnt = 0;
    for (var i = 0; i < importantthings.length; i++) {
        if (importantthings[i].value === 1) {
            cnt++;
            if ($('#selectedthings').html() === '') {
                $('#selectedthings').append(importantthings[i].caption);
            }
            else {
                $('#selectedthings').append(' + ' + importantthings[i].caption);
            }
        }
    }

    if(cnt===0)
    {
        $('#selectedthingsheader').html('');
        $('#btnresults').hide();
    }
    else if (cnt === 1) {
        $('#selectedthingsheader').html('You selected ' + cnt + ' thing');
        $('#btnresults').show();
    }
    else  {
        $('#selectedthingsheader').html('You selected ' + cnt + ' things');
        $('#btnresults').show();
    }
}

function setimportantthing(name, caption, value, restoringstate) {

    if (!restoringstate) {
        
        setCookie('importantthing_' + name, value, 365);
    }

    for (var i = 0; i < importantthings.length; i++) {
        if (importantthings[i].name == name) {
            importantthings[i].value = value;
            return;
        }
    }

    importantthings.push({ name: name, caption: caption.replace(/\&/g, ''), value: value });

    saveImportantThingsAsJson();
}


function saveImportantThingsAsJson() {

    var results = '{';
    var things = '';
    var thingsasproperties = '';
    var cnt = 0;

    for (var i = 0; i < importantthings.length; i++) {
        var thing = importantthings[i];
        if (thing.value == 1 || thing.value == "1") {
            if (cnt > 0) {
                things += ', {"name":"' + thing.name + '"}';
                thingsasproperties += ', "' + thing.name + '":"' + thing.name + '"';
            }
            else {
                things += '{"name":"' + thing.name + '"}';
                thingsasproperties += '"' + thing.name + '":"' + thing.name + '"';
            }
            cnt++;
        }
    }

    if (things != '') {
        results += '"importantthings":[' + things + '], ' + thingsasproperties;
    }

    results += '}';

    setCookie('importantthings2', results, 365);
}