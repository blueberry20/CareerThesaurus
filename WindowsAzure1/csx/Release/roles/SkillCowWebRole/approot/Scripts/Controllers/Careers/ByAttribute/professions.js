function exportsitemap() {

    professions.sort(sortbynameasc);
    
    $('#professioncontent').html('');

    var container = document.getElementById('professioncontent');
    

    var tblresults = document.createElement('table');

    for (var i = 0; i < professions.length; i++) {

        var tr = document.createElement('tr');

        var td1 = document.createElement('td');
        td1.innerHTML = '<a href="http://www.skillcow.com/career/' + professions[i].UrlParam + '">http://www.skillcow.com/career/' + professions[i].UrlParam + '</a>';
        tr.appendChild(td1);

        tblresults.appendChild(tr);
    }

    container.appendChild(tblresults);
}

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

function showmatchedprofessions(matches) {

    var verticals = groupmatchesbycareervertical(matches);
    verticals.sort(sortbynameasc);

    $('#professioncontent').html('');

    var container = document.getElementById('professioncontent');

    var title1 = document.createElement('b');
    title1.setAttribute('style', 'font-size: 12pt');
    title1.innerHTML = matches.length + ' cool careers await!<br/><br/>';
    container.appendChild(title1);

    for (var v = 0; v < verticals.length; v++) {
        if (verticals[v].name != '') {
            var title2 = document.createElement('b');
            title2.innerHTML = verticals[v].name;
            container.appendChild(title2);

            var tblresults = document.createElement('table');

            for (var i = 0; i < verticals[v].matches.length; i++) {
                var tr = document.createElement('tr');

                var td1 = document.createElement('td');
                var td2 = document.createElement('td');
                td2.setAttribute('align', 'right');

                td1.innerHTML = '<a href="javascript:professionclicked(\'' + verticals[v].matches[i].profession.UrlParam + '\')">' + verticals[v].matches[i].profession.DisplayName + '</a>';
                //td1.innerHTML = '<a href="javascript:professionclicked(\'' + verticals[v].matches[i].profession.RowKey + '\',\'' + verticals[v].matches[i].profession.Profession + '\',\'' + verticals[v].matches[i].profession.Branch + '\',' + verticals[v].matches[i].profession.ProgramId + ')">' + verticals[v].matches[i].profession.DisplayName + '</a>';
                td2.innerHTML = (parseFloat(verticals[v].matches[i].relevance) * 100).toFixed(2) + '%';

                tr.appendChild(td1);
                tr.appendChild(td2);

                tblresults.appendChild(tr);
            }

            container.appendChild(tblresults);
        }
    }
}


function groupprofessionsbycareervertical(list) {
    var verticals = createverticalsfromprofessions(list);
    for (var i = 0; i < list.length; i++) {

        getvertical(verticals, list[i].CareerVertical).professions.push(list[i]);
    }

    return verticals;
    
}

function createverticalsfromprofessions(list) {
    var verticals = new Array();
    for (var i = 0; i < list.length; i++) {
        if (getvertical(verticals, list[i].CareerVertical) == null) {
            verticals.push({ name: list[i].CareerVertical, professions: new Array() });
        }
    }
    return verticals;
}

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

function professionclicked(urlparam) {
    document.location = '/career/' + urlparam;
}



