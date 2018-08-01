var uniqueprofessions = new Array();
function reconcileProfessions() {
    try {

        for (var i = 0; i < similars.length; i++) {
            if (!valueexists(similars[i].similar)) {
                registervalue(similars[i].similar);
            }
        }
        alert(uniqueprofessions.length);
        var cnt = 0;
        $('#comparisons').append('<b>NEW professions - Data missing for</b>');
        var cnt = 0;
        for (var i = 0; i < uniqueprofessions.length; i++) {
            cnt++;
            if (!professionExists(uniqueprofessions[i])) {
                $('#comparisons').append('<div><span style="color: red"><b>' + cnt + ' ' + uniqueprofessions[i] + '</b></span></div>');
            }
            else {
                $('#comparisons').append('<div><span>' + cnt + ' ' + uniqueprofessions[i] + '</span></div>');
            }
        }
    }
    catch (ex) {
        alert(ex.message);
    }
}
function professionExists(title) {
    for (var i = 0; i < professions.length; i++) {
        if (professions[i].title.toLowerCase() == title.toLowerCase())
            return true;
    }
    return false;
}
function valueexists(value) {
    for (var i = 0; i < uniqueprofessions.length; i++) {
        if (uniqueprofessions[i] == value)
            return true;
    }
    return false;
}
function registervalue(value) {
    uniqueprofessions.push(value);
}