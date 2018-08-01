function renderSchools(response) {
    
    $('#campus_statesindex').html('');
    $('#campus_stateholder').html('');
    $('#campus_cityholder').html('');
    $('#campus_statesindexholder').show();

    $('#online_schoolindex').html('');

    $('#campusschoolcount').html('loading');
    $('#onlineschoolcount').html('loading');
    
    $('#campus_prompt').hide();
    $('#campus_preloader').show();

    $('#online_prompt').hide();
    $('#online_preloader').show();


    $('#campus_prompt').show();
    $('#online_prompt').show();
    $('#campus_preloader').hide();
    $('#online_preloader').hide();

    var grouped = groupschools(response.items);
    var campuscount = countcampusprograms(grouped);
    var onlinecount = countonlineprograms(grouped);

    $('#campusschoolcount').html(campuscount + ' programs');
    $('#onlineschoolcount').html(onlinecount + ' programs');

    renderCampusResults(grouped);
    renderOnlineResults(grouped);

}

function renderCampusResults(grouped) {

    var states = grouped.campus;
    if(states.length==0)
        return;

    renderStateIndex(states);
}
function renderOnlineResults(grouped) {
    
    var schools = grouped.online;
    if (schools.length == 0)
        return;

    renderOnlineSchools(schools);
}

function renderStateIndex(states) {

    $('#campus_indexprompt').show();

    states.sort(sortbynameasc);
    var itemspercol = Math.max(Math.ceil(states.length / 4), 1);
    var cnt = 0;
    var column = '';
    for (var i = 0; i < states.length; i++) {
        if (column == '') {
            column = '<div class="indexcolumn"><ul>';
        }
        column += '<li><a statecode="' + states[i].id + '" onclick="selectstate(this);">' + states[i].name + ' (' + countprogramsinstate(states[i]) + ')</a></li>';
        if (++cnt == itemspercol) {
            cnt = 0;
            $('#campus_statesindex').append(column + '</ul></div>');
            column = '';
        }
        
        renderState(states[i]);
    }
    if(column!='')
        $('#campus_statesindex').append(column + '</ul></div>');
}

function renderState(state) {

    

    var statehtml = '<div id="state' + state.id + '" class="statediv" style="display: none; ">' +
                    '<h1 style="margin: 0;" >' + state.name + ' <sup><a style="font-size: 10pt; font-weight: normal;" onclick="choosedifferentstate()">Choose a different state</a></sup></h1>';

    var itemspercol = Math.max(Math.ceil(state.cities.length / 4), 1);
    var cnt = 0;
    var column = '';
    for (var i = 0; i < state.cities.length; i++) {
        if (column == '') {
            column = '<div class="indexcolumn"><ul>';
        }
        column += '<li><a statecode="' + state.id + '" citycode="' + state.cities[i].id.replace(/ /g) + '" onclick="selectcity(this);">' + state.cities[i].id + ' (' + countprogramsincity(state.cities[i]) + ')</a></li>';
        if (++cnt == itemspercol) {
            cnt = 0;
            statehtml += column + '</ul></div>';
            column = '';
        }
        
        renderCity(state, state.cities[i]);
    }
    if (column != '')
        statehtml += column + '</ul></div>';

    
    $('#campus_stateholder').append(statehtml + '</div>');
}

function renderCity(state, city) {
    
    var cityhtml = '<div id="' + state.id + city.id.replace(/ /g) + '" class="citydiv" style="display: none; ">' +
                    '<h1 style="margin: 0;" >Schools in ' + city.id + ', ' + state.id + ' <sup><a style="font-size: 10pt; font-weight: normal;" onclick="choosedifferentcity(\'' + state.id + '\')">Choose a different city</a></sup></h1>';

    

    var itemspercol = Math.max(Math.ceil(city.schools.length / 4), 1);
    var cnt = 0;
    var column = '';
    for (var i = 0; i < city.schools.length; i++) {
        cityhtml += getschoolhtml(city.schools[i]);
    }

    $('#campus_cityholder').append(cityhtml + '</div>');
}

function getschoolhtml(school) {
    var programshtml = getprogramshtml(school.programgroups);

    var cbncampaignid = "13564694";
    if (getCookie("cbncampaign") != null && getCookie("cbncampaign") != '') {
        cbncampaignid = getCookie("cbncampaign");
    }

    var zip = '';
    if (getCookie('zip') != null) {
        zip = getCookie('zip');
    }


    var submitted = false;
    if (getCookie('recordsubmitted') != null) {
        submitted = true;
    }

    return '<div class="schoolresult">' +
                '<img align="left" src="' + school.form.imageurl + '" />' +
                '<div class="info">' +
                '<h1>' + school.form.formname + '</h1>' +
                '<div class="address">' + school.form.address + '</div>' +
                '</br><div class="description">' + school.form.formdescription.replace(/�\?�/g, ' -').replace(/�\?\?/g,'\'').replace(/\?�/g, '</br></br>') + '</div>' +
                '<div class="distance">' + school.form.distance + ' miles away</div>' +
                '<div class="campustype">' + school.form.campustype + '</div>' +
                '<div class="programs">' + programshtml + '</div>' +
                (submitted?'':'<input type="button" class="submitinfo" value="Request Info" onclick="showSchoolRegistrationOverlay(\'' + school.form.imageurl + '\',\'' + school.form.formname + '\')"/>') +
                '</div>' +
                '</div>';
}



function getprogramshtml(programgroups) {
    
    var programshtml = '';

    for (var j = 0; j < programgroups.length; j++) {
        var grouphtml = '';
        var uniqueprograms = new Array();
        for (var k = 0; k < programgroups[j].programs.length; k++) {
            var program = programgroups[j].programs[k];
            var addeditem = getarrayprogramname(uniqueprograms, program.programname);
            if (addeditem == null) {
                grouphtml += '<li>' + program.programname + '</li>';
                uniqueprograms.push(program.programname);
            }
        }

        programshtml += '</br><b>' + programgroups[j].id + '</b><ul>' + grouphtml + '</ul>';
    }
    return programshtml;
}
function getarrayprogramname(array, name) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] == name)
            return array[i];
    }
    return null;
}

function renderOnlineSchools(schools) {

    for (var i = 0; i < schools.length; i++) {
        try {
            var html = getschoolhtml(schools[i]);
            $('#online_schoolindex').append(html);
        }
        catch (ex) {
            alert(ex.message);
        }
    }
}

