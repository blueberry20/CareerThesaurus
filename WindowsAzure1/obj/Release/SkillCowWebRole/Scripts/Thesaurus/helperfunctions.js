var approvals = new Array();

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function degreeCode(degree) {
    switch (degree) {
        case 'Bachelor\'s degree':
            return 'BS';
        case 'High school diploma or equivalent':
            return 'HS';


        default:
            return degree;
    }
}
function findbycode(list, code) {
    for (var i = 0; i < list.length; i++) {
        if (list[i].code == code)
            return list[i];
    }
    return null;
}
function findone(list, name) {
    for (var i = 0; i < list.length; i++) {
        if ($.trim(list[i].profession).toLowerCase() == $.trim(name).toLowerCase())
            return list[i];
    }
    return null;
}
function findall(list, name) {
    var results = new Array();
    for (var i = 0; i < list.length; i++) {
        if (list[i].title == name)
            results.push(list[i]);
    }
    return results;
}

function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
             .toString(16)
             .substring(1);
};

function guid() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
         s4() + '-' + s4() + s4() + s4();
}

function isapproved(title) {
    for (var i = 0; i < approvals.length; i++) {
        if (approvals[i].title == title) {
            return true;
        }
    }
    return false;
}