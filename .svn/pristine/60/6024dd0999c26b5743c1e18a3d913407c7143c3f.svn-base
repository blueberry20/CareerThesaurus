var importantthings = new Array();
var allthings;
var MAX_IMPORTANT_THINGS = 3;

function loadImportantThings() {
    
    allthings = [
        {name: "Beauty", caption: "Beauty & Visual Perfection", sortkey: Math.random()},
        {name: "Helping", caption: "Helping Others", sortkey: Math.random()},
        {name: "Adventure", caption: "Risk & Adventure", sortkey: Math.random()},
        {name: "Safety", caption: "Safety of Others", sortkey: Math.random()},
        {name: "Technology", caption: "Technology", sortkey: Math.random()},

        {name: "People", caption: "Working with People", sortkey: Math.random()},
        {name: "Science", caption: "Science & Precision", sortkey: Math.random()},
        {name: "Easy", caption: "Minimal Involvement", sortkey: Math.random()},
        {name: "Duty", caption: "Sense of Duty", sortkey: Math.random()},
        //{name: "Growth", caption: "Growth potential", sortkey: Math.random()},

        {name: "Creativity", caption: "Creativity", sortkey: Math.random()},
        {name: "Admiration", caption: "Admiration by Others", sortkey: Math.random()},
        {name: "Competition", caption: "High Competition", sortkey: Math.random()},
        {name: "Animals", caption: "Nature & Animals", sortkey: Math.random()},
        {name: "Politics", caption: "Politics, Tactics & Strategy", sortkey: Math.random()}
    ];

    for (var i = 0; i < allthings.length; i++) {
        $('#importantthings').append('<div><div id="importantthing_' + allthings[i].name + '" name="' + allthings[i].name + '" value="0">' + allthings[i].caption + '</div></div>');
    }

    for (var i = 0; i < allthings.length; i++) {
        var c = getCookie('importantthing_' + allthings[i].name);
        if(c!=null && c=="1") {
            importantThingClicked($('#importantthing_' + allthings[i].name), true);
        }
    }

    $('.importantthings div div').click(function () {
        importantThingClicked(this);
    });

    if (importantthings.length > 0) {
        $('#refinementcanvas').show();
        moveInsert('importantthingscanvas', 'refinementcanvas');
    }
}

function importantThingClicked(e, restoringstate) {
    if ($(e).attr('value') == '0') {
        var selected = countSelectedImportantThings();
        if (selected >= MAX_IMPORTANT_THINGS) {
            alert("Please select up to 3 most important things to you");
            return;
        }
        $(e).attr('value', '1');
        $(e).addClass('selected');
        setimportantthing($(e).attr('name'), 1);
    }
    else {
        $(e).attr('value', '0');
        $(e).removeClass('selected');
        setimportantthing($(e).attr('name'), 0);
    }

    if(!restoringstate){
        showsummary();
    }
}

function countSelectedImportantThings() {
    var cnt = 0;
    for (var i = 0; i < importantthings.length; i++) {
        if (importantthings[i].value == 1) {
            cnt++;
        }
    }
    return cnt;
}
function setimportantthing(name, value) {
    
    setCookie('importantthing_' + name, value, 365);

    for (var i = 0; i < importantthings.length; i++) {
        if (importantthings[i].name == name) {
            importantthings[i].value = value;
            return;
        }
    }

    importantthings.push({ name: name, value: value });

    saveImportantThingsAsJson();
}

function flashImportantThings(times) {

    var sorted = allthings.sort(sortbysortkey);

    for (var i = 0; i <= (times!=null ? times : 5); i++) {

        setTimeout(function (index1, n1) {
            //$('#importantthing_' + n1).animate({ "background-color": "#00aaff" }, 500);
            //$('#importantthing_' + n1).css("background-color", "#00aaff");

            $('#importantthing_' + n1).addClass('flashed');

            setTimeout(function (index2, n2) {
                //$('#importantthing_' + n2).animate({ "background-color": "#eeeeee" }, 500);
                //alert($('#importantthing_' + n2));
                //$('#importantthing_' + n2).hide();
                //$('#importantthing_' + n2).css("backgrund-color", "");

                $('#importantthing_' + n1).removeClass('flashed');
            }, 400, index1, n1);

        }, (100 * i), i, sorted[i].name);

    }
}

function saveImportantThingsAsJson() {
    
    var results = '{';
    var things = '';
    var cnt = 0;

    for (var i = 0; i < importantthings.length; i++) {
        var thing = importantthings[i];
        if (thing.value == 1 || thing.value == "1") {
            if (cnt > 0) {
                things += ', {"name":"' + thing.name + '"}';
            }
            else {
                things += '{"name":"' + thing.name + '"}';
            }
            cnt++;
        }
    }

    if (things != '') {
        results += '"importantthings":[' + things + ']';
    }

    results += '}';

    setCookie('importantthings', results, 365);

    try {
        saveImportantThingsAsJson2();
    }
    catch (ex) {

    }
}

function saveImportantThingsAsJson2() {

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