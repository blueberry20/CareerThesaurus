function processinput(dimension, question, answer, restoringstate) {

    

    if (!dimensionexists(dimension))
        registerdimension(dimension);

    if (!questionexists(dimension, question))
        registerquestion(dimension, question);

    registeranswer(dimension, question, answer);

    var qindex = getquestionindex(question);

    var answerrevised = false;
    if (questionstatus[qindex].answered == 1) {
        answerrevised = true;
    }
    else {
        questionstatus[qindex].answered = 1;
    }

    if (!restoringstate) {
        setCookie(dimension + question, answer, 365);
    }

    return answerrevised;
}