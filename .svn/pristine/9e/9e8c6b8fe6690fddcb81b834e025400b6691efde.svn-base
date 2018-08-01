

//For matches
function groupmatchesbybranch(matches) {
    var branches = createbranchesfrommatches(matches);
    for (var i = 0; i < matches.length; i++) {
        getbranch(branches, matches[i].profession.Branch).matches.push(matches[i]);
    }
    return branches;
}

function createbranchesfrommatches(matches) {
    var branches = new Array();
    for (var i = 0; i < matches.length; i++) {
        if (getbranch(branches, matches[i].profession.Branch) == null) {
            branches.push({ name: matches[i].profession.Branch, matches: new Array() });
        }
    }
    return branches;
}

function getbranch(branches, name) {
    for (var i = 0; i < branches.length; i++) {
        if (branches[i].name == name)
            return branches[i];
    }
    return null;
}

