function getquestionindex(id) {
    for (var i = 0; i < questions.length; i++) {
        if (questions[i].RowKey == id) {
            return i;
        }
    }
    return -1;
}

function gettiebreakerindex(dimension) {
    for (var i = 0; i < questionstatus.length; i++) {
        if (questionstatus[i].type == 'tiebreaker') {
            if (questionstatus[i].dimension == dimension) {
                return questionstatus[i].index;    
            }
        }
    }
    return -1;
}

function getansweredcount() {
    var answeredcnt = 0;
    for (var i = 0; i < questionstatus.length; i++) {
        if (questionstatus[i].answered > 0) {
            answeredcnt++;
        }
    }
    return answeredcnt;
}
function getshowncount() {
    var cnt = 0;
    for (var i = 0; i < questionstatus.length; i++) {
        if (questionstatus[i].shown > 0) {
            cnt++;
        }
    }
    return cnt;
}

function selectbestdimensionresult(values) {
    if (values.length == 0) {
        return null;
    }
    else if (values.length == 1) {
        return values[0];
    }
    else {
        if (values[0].percentage == values[1].percentage) {
            return null;
        }
        else if (values[0].percentage > values[1].percentage) {
            return values[0];
        }
        else {
            return values[1];
        }
    }

}

function dimensionexists(dimension) {
    for (var i = 0; i < dimensions.length; i++) {
        if (dimensions[i].name == dimension)
            return true;
    }
    return false;
}
function registerdimension(dimension) {
    dimensions.push({ name: dimension, questions: new Array() });
}
function questionexists(dimension, question) {
    for (var i = 0; i < dimensions.length; i++) {
        if (dimensions[i].name == dimension) {
            for (var j = 0; j < dimensions[i].questions.length; j++) {
                if (dimensions[i].questions[j].id == question)
                    return true;
            }
        }
    }
    return false;
}
function registerquestion(dimension, question) {

    for (var i = 0; i < dimensions.length; i++) {
        if (dimensions[i].name == dimension) {
            dimensions[i].questions.push({ id: question, answer: "" });
        }
    }
}

function registeranswer(dimension, question, answer) {
    for (var i = 0; i < dimensions.length; i++) {
        if (dimensions[i].name == dimension) {
            for (var j = 0; j < dimensions[i].questions.length; j++) {
                if (dimensions[i].questions[j].id == question) {
                    dimensions[i].questions[j].answer = answer;
                }
            }
        }
    }
    return false;
}

function getresults() {

    var results = new Array();
    for (var i = 0; i < dimensions.length; i++) {
        results.push({ dimension: dimensions[i].name, values: getdimensionresult(i) });
    }
    return results;
}

function getdimensionresult(i) {
    var results = new Array();

    //get unique values
    var uniques = getuniqueanswersfordimension(i);

    for (var j = 0; j < uniques.length; j++) {
        var v = uniques[j];
        var pct = getpercentageforanswer(i, v);
        results.push({ value: v, percentage: pct });
    }

    return results;
}

function getuniqueanswersfordimension(i) {
    var uniques = new Array();


    for (var j = 0; j < dimensions[i].questions.length; j++) {
        var exists = false;
        for (x = 0; x < uniques.length; x++) {
            if (uniques[x] == dimensions[i].questions[j].answer) {
                exists = true;
                break;
            }
        }
        if (!exists)
            uniques.push(dimensions[i].questions[j].answer);
    }
    return uniques;
}

function getpercentageforanswer(i, answer) {
    var cnt = 0;
    for (var j = 0; j < dimensions[i].questions.length; j++) {
        if (dimensions[i].questions[j].answer == answer) {
            cnt++;
        }
    }
    if (dimensions[i].questions.length > 0) {
        return parseFloat(cnt) / dimensions[i].questions.length;
    }
    else {
        return 0;
    }
}

function getinputs() {
    var resultdimensions = getresults();
    var inputs = new Array();
    
    for (var i = 0; i < resultdimensions.length; i++) {

        var bestresult = selectbestdimensionresult(resultdimensions[i].values);
        if (bestresult != null) {
            inputs.push({ dimension: resultdimensions[i].dimension, value: bestresult.value, percentage: bestresult.percentage });
        }
        else {
            inputs.push({ dimension: resultdimensions[i].dimension, value: '', percentage: 0 });
        }
    }
    return inputs;
}

function findinput(inputs, dimension) {
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].dimension == dimension)
            return inputs[i];
    }
    return null;
}