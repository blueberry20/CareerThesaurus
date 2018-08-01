function showallprofessions(branchname) {

    var verticals = groupprofessionsbycareervertical(professions);
    verticals.sort(sortbynameasc);

    $('#professioncontent').html('');

    var container = document.getElementById('professioncontent');

    var title1 = document.createElement('b');
    title1.setAttribute('style', 'font-size: 12pt');
    title1.innerHTML = 'Explore other careers in ' + branchname;
    container.appendChild(title1);

    container.appendChild(document.createElement('br'));

    for (var v = 0; v < verticals.length; v++) {
        var title2 = document.createElement('b');
        title2.innerHTML = '<br />' + verticals[v].name;
        container.appendChild(title2);

        var tblresults = document.createElement('table');

        verticals[v].professions.sort(sortbyprofessionasc);

        for (var i = 0; i < verticals[v].professions.length; i++) {
            var tr = document.createElement('tr');

            var td1 = document.createElement('td');
            var td2 = document.createElement('td');
            td2.setAttribute('align', 'right');

            td1.innerHTML = '<a href="javascript:professionclicked(\'' + verticals[v].professions[i].urlparam + '\')">' + verticals[v].professions[i].displayname + '</a>';
            //td1.innerHTML = '<a href="javascript:professionclicked(\'' + verticals[v].professions[i].RowKey + '\',\'' + verticals[v].professions[i].Profession + '\',\'' + verticals[v].professions[i].Branch + '\',' + verticals[v].professions[i].ProgramId + ')">' + verticals[v].professions[i].DisplayName + ', ' + verticals[v].professions[i].ProgramId + '</a>';
            td2.innerHTML = '';

            tr.appendChild(td1);
            tr.appendChild(td2);

            tblresults.appendChild(tr);
        }

        container.appendChild(tblresults);
    }
}

function groupprofessionsbycareervertical() {
    var verticals = createverticalsfromprofessions(professions);
    for (var i = 0; i < professions.length; i++) {
        getvertical(verticals, professions[i].program).professions.push(professions[i]);
    }
    return verticals;
}

function createverticalsfromprofessions(professions) {
    var verticals = new Array();
    for (var i = 0; i < professions.length; i++) {
        if (getvertical(verticals, professions[i].program) == null) {
            verticals.push({ name: professions[i].program, professions: new Array() });
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

