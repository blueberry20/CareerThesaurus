var findSchoolsForTopCareersexecuted = false;
var schoolformsdownloaded = false;
var schoolsearchtimerstart;
var schoolsearchresponses = new Array();
var stopdownloadingschoolresults = false;

var MAX_SCHOOLS_TO_SHOW = 4;

var selectedschools = new Array();
var schoolforms = new Array();
var totalschoolforms = 0;


function findSchoolsForTopCareers() {

    findSchoolsForTopCareersexecuted = true;

    var ds = new Date();
    schoolsearchtimerstart = ds.getTime();

    downloadSchoolsByDegree();
}

function downloadSchoolsByDegree() {

    var zip = getCookie('zip');
    var degrees = getCareersAsCommaDelimitedString();
    var f = 'gradyear=' + getCookie('gradyear') + ',education_level=' + getCookie('education_level') + ',educationlevel=' + getCookie('education_level');
    var edulevel = getCookie('education_level');

    if (zip == null || zip == '' || degrees == '')
        return;

    var degreetokens = degrees.split(',');

    downloadSchoolsForDegree(degreetokens, 0, zip, f, edulevel);
}

function downloadSchoolsForDegree(degreetokens, pass, zip, f, edulevel) {

    degree = degreetokens[pass];
    
    //Check this variable if the next button is already pressed
    if (stopdownloadingschoolresults != true) {
        $.ajax({
            url: appserverurl + "/Schools/GetSchoolsWithForms",
            type: "POST",
            data: {
                zip: zip,
                degrees: degree,
                f: f,
                edulevel: edulevel,
                medium: 'web'
            }
        }).done(function (response) {
            if (stopdownloadingschoolresults != true) {
                if (response.result == 'ok') {
                    var resultid = response.resultid;
                    setCookie('schoolsearchresultid', resultid, 365);
                    schoolsearchresponses.push(response);

                    schoolformsdownloaded = true;
                    selectSchoolsForLeads(response);
                    totalschoolforms = selectedschools.length;

                    var de = new Date();
                    var elapsedtime = de.getTime() - schoolsearchtimerstart;

                    var recordformsubmitted = getCookie('recordformnextpressed');
                    if (recordformsubmitted == null || recordformsubmitted != '1') {
                        var customdata = '{"searchresultid":"' + resultid + '","elapsedtime":' + elapsedtime + ',"count":' + totalschoolforms + ',"status":"shown","reason":""}';
                        uxevent('schoolresults', customdata);
                    }
                    else {
                        var customdata = '{"searchresultid":"' + resultid + '","elapsedtime":' + elapsedtime + ',"count":' + totalschoolforms + ',"status":"skipped","reason":"Form already submitted.  VM Listings shown instead of schools."}';
                        uxevent('schoolresults', customdata);
                    }

                    //$('#downloadstatus').html('Downloaded: ' + response.resultsets[0].schools.length + ' valid: ' + totalschoolforms);
                }
                if (pass < degreetokens.length - 1) {
                    var nextpass = pass + 1;

                    //debugalert('Download next degree on pass: ' + nextpass);

                    downloadSchoolsForDegree(degreetokens, nextpass, zip, f, edulevel);
                }
                else {
                    //debugalert('No more degrees to download after pass: ' + pass);
                    finalizeDownloadedSchoolResutls();
                }
            }
        }).fail(function () {
            if (pass < degreetokens.length - 2) {

                var nextpass = pass + 1;
                //debugalert('Failed! Next pass: ' + nextpass);
                downloadSchoolsForDegree(degreetokens, nextpass, zip, f, edulevel);
            }
            else {
                finalizeDownloadedSchoolResutls();
            }
        });
    }
}

function finalizeDownloadedSchoolResutls() {

    stopdownloadingschoolresults = true;
    
    for (var i = 0; i < schoolsearchresponses.length; i++) {
        
        var response = schoolsearchresponses[i];

        if (response.resultsets.length > 0) {
            selectSchoolsForLeads(response);
            schoolformsdownloaded = true;
        }
    }

    totalschoolforms = selectedschools.length;

    if (totalschoolforms > 0) {
        for (var i = 0; i < selectedschools.length; i++) {
            downloadSingleSchoolForm(selectedschools[i].program, selectedschools[i].clientid, selectedschools[i].formid, selectedschools[i].campuskey, selectedschools[i].programkey);
        }

        //debugalert(totalschoolforms + ' forms downloaded');
        showAvailableSchoolsAsCapsules();
    }

    

}

function selectSchoolsForLeads(response) {

    careerchoices.sort(sortbypriority);

    var passes = 0;
    while (selectedschools.length < MAX_SCHOOLS_TO_SHOW && passes++ < (MAX_SCHOOLS_TO_SHOW - 1)) {
        for (var i = 0; i < careerchoices.length; i++) {
            var choice = careerchoices[i];

            if (choice.value == 1) {

                var rs = selectResultSet(response, choice.program);

                assert(rs != null, "1. rs is null");

                if (rs == null) {
                    //setCareerChoice(choice.name, 0, choice.program);
                    continue;
                }
                                
                var campusschools = selectSchoolsByCampusType(rs.schools, 'campus', 999999);
                var onlineschools = selectSchoolsByCampusType(rs.schools, 'online', 999999);
                
                campusschools = campusschools.sort(sortbydistance);

                if (campusschools.length > 0 && selectedschools.length < MAX_SCHOOLS_TO_SHOW) {
                    for (var j = 0; j < campusschools.length; j++) {
                        var formname = $.trim(campusschools[j].formname.toLowerCase().replace('university', ''));

                        if (!formAlreadySelected(formname, selectedschools)) {
                            selectedschools.push(campusschools[j]);
                            break;
                        }
                    }
                }

                if (onlineschools.length > 0 && selectedschools.length < MAX_SCHOOLS_TO_SHOW) {
                    for (var j = 0; j < onlineschools.length; j++) {
                        var formname = $.trim(onlineschools[j].formname.toLowerCase().replace('university', ''));
                        if (!formAlreadySelected(formname, selectedschools)) {
                            selectedschools.push(onlineschools[j]);
                            break;
                        }
                    }

                }

                if (selectedschools.length >= MAX_SCHOOLS_TO_SHOW) {
                    break;
                }
            }
        }
    }

    //$('#downloadstatus').html('Valid schools: ' + selectedschools.length);

    return;
}
function selectResultSet(response, program) {
    for (var i = 0; i < response.resultsets.length; i++) {
        var rs = response.resultsets[i];
        if (rs.degree == program) {
            return rs;
        }
    }
    return rs;
}
function sortbypriority(a, b) {
    if (a.priority < b.priority)
        return -1;
    if (a.priority > b.priority)
        return 1;
    return 0;
}
function sortbydistance(a, b) {
    if (parseInt(a.distance) < parseInt(b.distance))
        return -1;
    if (parseInt(a.distance) > parseInt(b.distance))
        return 1;
    return 0;
}

function formAlreadySelected(formname, selectedforms) {
    for (var i = 0; i < selectedforms.length; i++) {
        var selectedformname = $.trim(selectedforms[i].formname.toLowerCase().replace('university', ''));
        if (selectedformname == formname) {
            return true;
        }
    }
    return false;
}

function selectSchoolsByCampusType(schools, type, maxdistance) {
    var results = new Array();
    for (var i = 0; i < schools.length; i++) {
        if (schools[i].campustype.toLowerCase() == type && parseInt(schools[i].distance) <= maxdistance) {
            results.push(schools[i]);
        }
    }
    return results;
}


