function showallprofessions() {

    
    var verticals = groupprofessionsbycareervertical(professions);
    verticals.sort(sortbynameasc);
        
    $('#professioncontent').html('');

    var container = document.getElementById('professioncontent');

    var title1 = document.createElement('b');
    title1.setAttribute('style', 'font-size: 12pt');
    
    title1.innerHTML = 'Profession categories';
    container.appendChild(title1);

    container.appendChild(document.createElement('br'));
    container.appendChild(document.createElement('br'));


    for (var v = 0; v < verticals.length; v++) {
        if (verticals[v].name != '') {
            var title2 = document.createElement('b');
            title2.innerHTML = verticals[v].name;
            container.appendChild(title2);

            var tblresults = document.createElement('table');

            verticals[v].professions.sort(sortbyprofessionasc);

            for (var i = 0; i < verticals[v].professions.length; i++) {



                var tr = document.createElement('tr');

                var td1 = document.createElement('td');
                var td2 = document.createElement('td');
                td2.setAttribute('align', 'right');

                td1.innerHTML = '<a href="javascript:professionclicked(\'' + verticals[v].professions[i].UrlParam + '\')">' + verticals[v].professions[i].DisplayName + '</a>';
                //td1.innerHTML = '<a href="javascript:professionclicked(\'' + verticals[v].professions[i].RowKey + '\',\'' + verticals[v].professions[i].Profession + '\',\'' + verticals[v].professions[i].Branch + '\',' + verticals[v].professions[i].ProgramId + ')">' + verticals[v].professions[i].DisplayName + ', ' + verticals[v].professions[i].ProgramId + '</a>';
                td2.innerHTML = '';

                tr.appendChild(td1);
                tr.appendChild(td2);

                tblresults.appendChild(tr);
            }

            container.appendChild(tblresults);
        }
    }
}

function togglecategory(id) {
    if($('#toggle'+id).html()=='+ more')
    {
        //expand
        $('.extrarows' + id).show();
        $('#toggle' + id).html('- hide');
    }
    else {
        //collapse
        $('.extrarows' + id).hide();
        $('#toggle' + id).html('+ more');
    }
}
function showmatchedprofessions(matches) {
    if (matches.length > 0) {
        $('#resultsarrow').animate({ "bottom": -110 }, 500);
        $('#resultsarrowspacer').animate({ "height": 100 }, 500);
    }

    var verticals = groupmatchesbycareervertical(matches);
    verticals.sort(sortbynameasc);

    $('#professioncontent').html('');

    var container = document.getElementById('professioncontent');

    var title1 = document.createElement('div');
    title1.setAttribute('style', 'font-size: 12pt; margin: 0 0 8px 0;');
    title1.innerHTML = 'We\'ve got ' + matches.length + ' careers for you!';
    container.appendChild(title1);

    if (getCookie('recordsubmitted') != '1') {
        return;
    }   

    for (var v = 0; v < verticals.length; v++) {
        if (verticals[v].name != '') {
            var categorydiv = document.createElement('div');
            categorydiv.setAttribute('class', 'resultcategory rounded5');

            if (verticals[v].matches.length > 3) {
                var categorytoggle = document.createElement('div');
                categorytoggle.id = 'toggle' + v;
                categorytoggle.setAttribute('class', 'categorytoggle');
                categorytoggle.setAttribute('onclick', 'togglecategory(' + v + ');');
                categorytoggle.innerHTML = '+ more';
                categorydiv.appendChild(categorytoggle);
            }

            var title2 = document.createElement('div');
            title2.setAttribute('style', 'color: #333; font-size: 10pt; font-weight: bold;');
            title2.innerHTML = verticals[v].name;
            categorydiv.appendChild(title2);

            var tblresults = document.createElement('table');
            tblresults.setAttribute('style', 'margin: 5px 0 0 0;');

            for (var i = 0; i < verticals[v].matches.length; i++) {
                var tr = document.createElement('tr');

                if (i > 2) {
                    tr.setAttribute('class', 'extrarows' + v);
                    tr.setAttribute('style', 'display: none;');
                }

                var td1 = document.createElement('td');
                var td2 = document.createElement('td');
                td2.setAttribute('align', 'right');

                td1.innerHTML = '<a href="javascript:professionclicked(\'' + verticals[v].matches[i].profession.UrlParam + '\')">' + verticals[v].matches[i].profession.DisplayName + '</a>';
                //td1.innerHTML = '<a href="javascript:professionclicked(\'' + verticals[v].matches[i].profession.RowKey + '\',\'' + verticals[v].matches[i].profession.Profession + '\',\'' + verticals[v].matches[i].profession.Branch + '\',' + verticals[v].matches[i].profession.ProgramId + ')">' + verticals[v].matches[i].profession.DisplayName + '</a>';
                //td2.innerHTML = (parseFloat(verticals[v].matches[i].relevance) * 100).toFixed(2) + '%';

                tr.appendChild(td1);
                tr.appendChild(td2);

                tblresults.appendChild(tr);
            }

            categorydiv.appendChild(tblresults);

            container.appendChild(categorydiv);
        }
    }
}

function showmatchedprofessionsuncategorized(matches) {

    if (matches.length > 0) {

        if (recordsubmitted) {
            $('#resultsarrow').animate({ "bottom": -110 }, 500);
            $('#resultsarrowspacer').animate({ "height": 100 }, 500);
        }

        setTimeout(function () {
            //$('#refinementcanvas').show('slow');

            if (importantthings.length == 0) {
                setTimeout(function () {
                    flashImportantThings();
                }, 0);
            }
        }, 1000);

        matches = matches.sort(sortbyrelevancedesc);

        saveTopRecommendations(matches);
    }

    
    
    $('#professioncontent').html('');

    var container = document.getElementById('professioncontent');

    var title1 = document.createElement('div');
    title1.setAttribute('style', 'font-size: 12pt; margin: 0 0 8px 0;');
    title1.innerHTML = 'We\'ve got ' + matches.length + ' careers for you!';

    container.appendChild(title1);

    if (getCookie('recordsubmitted') != '1') {
        return;
    }   


    var categorydiv = document.createElement('div');
    categorydiv.setAttribute('class', 'resultcategory rounded5');

    var tblresults = document.createElement('table');
    tblresults.setAttribute('cellpadding', '0');
    tblresults.setAttribute('cellspacing', '1');
    tblresults.setAttribute('style', 'margin: 5px 0 0 0;');

    for (var i = 0; i < matches.length; i++) {
        var tr = document.createElement('tr');

        var td1 = document.createElement('td');
        var td2 = document.createElement('td');
        td1.setAttribute('width', '1%');
        td1.innerHTML = '<div class="professionrank">'+(i+1)+'</div>';
        td2.innerHTML = '<a href="javascript:professionclicked(\'' + matches[i].profession.UrlParam + '\')">' + matches[i].profession.DisplayName + '</a>';

        tr.appendChild(td1);
        tr.appendChild(td2);

        tblresults.appendChild(tr);
    }

    categorydiv.appendChild(tblresults);

    container.appendChild(categorydiv);
    
}


function groupprofessionsbycareervertical() {
    var verticals = createverticalsfromprofessions(professions);
    for (var i = 0; i < professions.length; i++) {
        
        getvertical(verticals, professions[i].CareerVertical).professions.push(professions[i]);
    }
    return verticals;
}

function createverticalsfromprofessions(professions) {
    var verticals = new Array();
    for (var i = 0; i < professions.length; i++) {
        if (getvertical(verticals, professions[i].CareerVertical) == null) {
            verticals.push({ name: professions[i].CareerVertical, professions: new Array() });
        }
    }
    return verticals;
}

//For matches
function groupmatchesbycareervertical(matches) {
    var verticals = createverticalsfrommatches(matches);
    for (var i = 0; i < matches.length; i++) {
        getvertical(verticals, matches[i].profession.CareerVertical).matches.push(matches[i]);
    }
    return verticals;
}

function createverticalsfrommatches(matches) {
    var verticals = new Array();
    for (var i = 0; i < matches.length; i++) {
        if (getvertical(verticals, matches[i].profession.CareerVertical) == null) {
            verticals.push({ name: matches[i].profession.CareerVertical, matches: new Array() });
        }
    }
    return verticals;
}

function getvertical(verticals, name) {
    for (var i = 0; i < verticals.length; i++) {
        if (verticals[i].name == name)
            return verticals[i];
    }
    return null;
}

function hideprofessiondetails() {
    $('#careersummary').hide();
    $('#test').show();
}

function professionclicked(urlparam) {
    if (!recordsubmitted) {
        alert('Once you complete the test, we will match you with the perfect Career!');
        return;
    }
    document.location = '/career/' + urlparam;
}


function professionclicked_DEPRICATED(id, profession, branch, programid) {
    $('#test').hide();
    $('#careersummary').show();

    $('#branchname').html(branch);

    var article = '';
    switch (profession[0]) {
        case 'a':
        case 'e':
        case 'i':
        case 'o':
        case 'u':
        case 'A':
        case 'E':
        case 'I':
        case 'O':
        case 'U':
            article = 'an';
            break;
        default:
            article = 'a';
    }

    $('#careername').html(profession.replace(/Spec./g, 'Specialist').replace(/Mgr./g, 'Manager').replace(/Asst./g, 'Assistant'));
    $('#trainingheader').html($('#careername').html() + ' training options');

    $('#imgcover').prop('src', '/content/images/careerassessment/covers/bybranch/' + branch.replace(/\s/g, '').replace(/,/g, '') + '.jpg')

    $('#careerdescription').html('');
    getDescriptionsFromBlob(id);

    $("html, body").animate({ scrollTop: 0 }, "fast");

    findSchools(programid);    
}

function $details_ready(data, container) {
    
    $('#careerdescription').append(data.description + '<br/><br/>');

    var article = '';
    switch (data.profession[0]) {
        case 'a':
        case 'e':
        case 'i':
        case 'o':
        case 'u':
        case 'A':
        case 'E':
        case 'I':
        case 'O':
        case 'U':
            article = 'an';
            break;
        default:
            article = 'a';
    }

    if (data.duties != null && data.duties != '')
        $('#careerdescription').append('<b>Typical duties of ' + article + ' ' + data.profession + '</b><br/>' + data.duties + '<br/><br/>');

    if (data.wheretofind != null && data.wheretofind != '')
        $('#careerdescription').append('<b>Where ' + data.profession + ' jobs are found</b><br/>' + data.wheretofind + '<br/><br/>');

    if (data.salary != null && data.salary != '')
        $('#careerdescription').append('<b>Salary of ' + article + ' ' + data.profession + '</b><br/>' + data.salary + '<br/><br/>');

    if (data.demand != null && data.demand != '')
        $('#careerdescription').append('<b>Demand</b><br/>' + data.duties + '');
}

function getDescriptionsFromBlob(id) {
    $('.descriptionscript').remove();

    var headID = document.getElementsByTagName("head")[0];
    var newScript = document.createElement('script');
    newScript.setAttribute('class', 'descriptionscript');
    newScript.type = 'text/javascript';
    newScript.src = 'https://chaindate.blob.core.windows.net/' + id + '/data/details.js';
    headID.appendChild(newScript);
}

function saveTopRecommendations(matches) {

    var results = '{';
    var professions = '';

    for (var i = 0; i < matches.length && i<5; i++) {
        if (i < matches.length - 1 && i<4) {
            professions += '{"name":"' + matches[i].profession.DisplayName + '"},';
        }
        else {
            professions += '{"name":"' + matches[i].profession.DisplayName + '"}';
        }
    }


    if (professions != '') {
        results += '"professions":[' + professions + ']';
    }

    results += '}';
    
    setCookie('recommendations', results, 365);
}