function sortbyrelevanceasc(a, b) {
    if (a.relevance < b.relevance)
        return -1;
    if (a.relevance > b.relevance)
        return 1;
    return 0;
}
function sortbyrelevancedesc(a, b) {
    if (a.relevance < b.relevance)
        return 1;
    if (a.relevance > b.relevance)
        return -1;
    return 0;
}
function sortbynameasc(a, b) {
    if (a.name < b.name)
        return -1;
    if (a.name > b.name)
        return 1;
    return 0;
}
function sortbyprofessionasc(a, b) {
    if (a.Profession < b.Profession)
        return -1;
    if (a.Profession > b.Profession)
        return 1;
    return 0;
}
function compareasc(a, b) {
    if (a < b)
        return -1;
    if (a > b)
        return 1;
    return 0;
}
function sortbysortkey(a, b) {
    if (a.sortkey < b.sortkey)
        return -1;
    if (a.sortkey > b.sortkey)
        return 1;
    return 0;
}

function sortbypriority(a, b) {
    if (a.priority < b.priority)
        return -1;
    if (a.priority > b.priority)
        return 1;
    return 0;
}