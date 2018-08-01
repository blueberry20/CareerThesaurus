function findFile(fileIndex) {
    for (var i = 0; i < data.files.length; i++) {
        var f = data.files[i];
        if (f.index == fileIndex) {
            return f;
        }
    }
    return null;
}
function getFileArrayIndex(fileIndex) {
    for (var i = 0; i < data.files.length; i++) {
        var f = data.files[i];
        if (f.index == fileIndex) {

            return i;
        }
    }
    return -1;
}
function getQuestionIndexFromNumber(qnumber) {
    for (var i = 0; i < data.questions.length; i++) {
        var q = data.questions[i];
        if (q.number == qnumber) {
            return i;
        }
    }
    return -1;
}

function getYellowAnswerFileForQuestion(qindex) {
    var q = data.questions[qindex];
    for (var i = 0; i < data.files.length; i++) {
        var f = data.files[i];
        if (f.number == q.number && f.color == 'yellow') {
            return f;
        }
    }
    return null;
}

function getFileArrayIndicesForQuestionIndex(qindex) {
    var indices = new Array();
    var q = data.questions[qindex];
    for (var i = 0; i < data.files.length; i++) {
        var f = data.files[i];
        if (f.number == q.number) {
            indices.push(i);
        }
    }
    return indices;
}

function getControlIdForIndex(index) {
    var id = "";
    if (index.length == 2) {
        id = "Q";
    }
    else {
        var digit;
        for (var i = 1; i <= 3; i++) {
            if (index.indexOf("A" + i) >= 0) {
                digit = i;
                break;
            }
        }
        id = index[0] + "A" + digit;
    }
    return id;
}