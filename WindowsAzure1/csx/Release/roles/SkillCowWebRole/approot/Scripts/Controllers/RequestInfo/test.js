function loadtestquestions() {

    for(var i=0; i<questions.length; i++) 
    {
        var q = questions[i];

        
        answered.push(0);
        
        //set from cookies
        var storedanswer = getCookie(q.Dimension + q.RowKey);
        if (storedanswer != null && storedanswer != '') {
            if (storedanswer == q.Value1) {
                processinput(q.Dimension, q.RowKey, q.Value1);
            }
            else if (storedanswer == q.Value2) {
                processinput(q.Dimension, q.RowKey, q.Value2);
            }
        }
    }
    
    
    showsummary();
    

    
}

function getquestionindex(id) {
    for (var i = 0; i < questions.length; i++) {
        if (questions[i].RowKey == id) {
            return i;
        }
    }
    return -1;
}

function processinput(dimension, question, answer, restoringstate) {

    
    if (!dimensionexists(dimension))
        registerdimension(dimension);

    if (!questionexists(dimension, question))
        registerquestion(dimension, question);

    registeranswer(dimension, question, answer);

    

    var qindex = getquestionindex(question);

    

    var revisedanswer = false;
    if (answered[qindex] == 1) {
        revisedanswer = true;
    }
    else {
        answered[qindex] = 1;
    }

    

    var answeredcnt = 0;
    for (var i = 0; i < answered.length; i++) {
        if (answered[i] > 0) {
            answeredcnt++;
        }
    }
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