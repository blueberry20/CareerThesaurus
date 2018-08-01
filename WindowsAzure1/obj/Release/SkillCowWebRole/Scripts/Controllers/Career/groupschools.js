function groupschools(forms) {
    var results = onlineorcampus(forms);
    return results;
}

function onlineorcampus(forms) {
    return {
        online: onlineschools(forms),
        campus: campusschools(forms)
    }
}

function onlineschools(forms) {

    var schools = new Array();

    try {
        for (var i = 0; i < forms.length; i++) {
            if (forms[i].campustype == 'online') {

                var school = getarrayitem(schools, forms[i].schoolid);
                if (school == null) {
                    school = { id: forms[i].schoolid, name: forms[i].formname, form: forms[i], programgroups: new Array() };
                    schools.push(school);
                }

                var programgroup = getarrayitem(school.programgroups, forms[i].programgroup);
                if (programgroup == null) {
                    programgroup = { id: forms[i].programgroup, programs: new Array() };
                    school.programgroups.push(programgroup);
                }



                
                programgroup.programs.push(forms[i]);
            }
        }
    }
    catch (ex) {
        alert('Online schools grouping error: ' + ex.message);
    }

    return schools;
}

function countcampusprograms(grouped) {
    var cnt=0;
    var states = grouped.campus;

    for (var i = 0; i < states.length; i++) {
        cnt += countprogramsinstate(states[i]);
    }
    return cnt;
}

function countonlineprograms(grouped) {
    var cnt = 0;
    var schools = grouped.online;

    for (var k = 0; k < schools.length; k++) {
        for (var l = 0; l < schools[k].programgroups.length; l++) {
            cnt = cnt + schools[k].programgroups[l].programs.length;
        }
    }
    return cnt;
}

function countprogramsinstate(state) {
    var cnt = 0;
    for (var j = 0; j < state.cities.length; j++) {
        cnt += countprogramsincity(state.cities[j]);
    }
    return cnt;
}
function countprogramsincity(city) {
    var cnt = 0;
    for (var k = 0; k < city.schools.length; k++) {
        cnt += countprogramsinschool(city.schools[k]);
    }
    return cnt;
}
function countprogramsinschool(school) {
    var cnt = 0;
    for (var l = 0; l < school.programgroups.length; l++) {
        cnt = cnt + school.programgroups[l].programs.length;
    }
    return cnt;
}

function campusschools(forms) {
    var states = new Array();

    try {
        for (var i = 0; i < forms.length; i++) {
            if (forms[i].campustype == 'campus') {
                var state = getarrayitem(states, forms[i].state);
                var statename = MapStateName(forms[i].state.toLowerCase());
                if (statename != null) {
                    if (state == null) {
                        state = { id: forms[i].state, name: MapStateName(forms[i].state.toLowerCase()), cities: new Array() };
                        states.push(state);
                    }

                    var city = getarrayitem(state.cities, forms[i].city);
                    if (city == null) {
                        city = { id: forms[i].city, schools: new Array() };
                        state.cities.push(city);
                    }

                    var school = getarrayitem(city.schools, forms[i].schoolid);
                    if (school == null) {
                        school = { id: forms[i].schoolid, name: forms[i].formname, form: forms[i], programgroups: new Array() };
                        city.schools.push(school);
                    }

                    var programgroup = getarrayitem(school.programgroups, forms[i].programgroup);
                    if (programgroup == null) {
                        programgroup = { id: forms[i].programgroup, programs: new Array() };
                        school.programgroups.push(programgroup);
                    }

                    programgroup.programs.push(forms[i]);
                }
            }
        }
    }
    catch (ex) {
        alert('Campus schools grouping error: ' + ex.message);
    }
    return states;
}

function getarrayitem(array, id) {
    for (var i = 0; i < array.length; i++) {
        if (array[i].id == id)
            return array[i];
    }
    return null;
}

function switchschoolresulttab(tab) {
    $('.schoolresulttab').removeClass('activetab');
    $(tab).addClass('activetab');

    $('.schoolresulttabcontent').hide();
    $('#' + $(tab).attr('rel')).show();
}

function selectstate(link) {
    $('#campus_statesindexholder').hide();
    $('#state' + $(link).attr('statecode')).show();
}
function choosedifferentstate() {
    $('.statediv').hide();
    $('#campus_statesindexholder').show();
}

function selectcity(link) {
    $('#state' + $(link).attr('statecode')).hide();
    $('#' + $(link).attr('statecode') + $(link).attr('citycode')).show();
}
function choosedifferentcity(state) {
    $('.citydiv').hide();
    $('#state' + state).show();
}
