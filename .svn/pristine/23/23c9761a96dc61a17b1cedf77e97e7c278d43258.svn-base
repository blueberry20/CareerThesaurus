function setNavigation() {
    var dimensions = ["attitude", "endurance", "action", "concentration", "information", "processing", "presence", "patterns", "compensation"];
    var currentQuestion = getCookie('currentQuestion');
    var answered = 0;
    for (var i = 1; i < 10; i++) {
        if (getCookie(dimensions[i - 1]) != null) {
            $('#question_' + i + ', #mobile_question_' + i).addClass('btn-success');
            answered++;
        } else {
            // nextQuestion = nextQuestion == null && currentQuestion != i ? i : nextQuestion;
        }
    }
    for (var i = 10; i < 12; i++) {
        if (getCookie('question' + i) != null) {
            $('#question_' + i + ', #mobile_question_' + i).addClass('btn-success');
            answered++;
        }
    }

    $('#question_' + currentQuestion + ', #mobile_question_' + currentQuestion).removeClass('btn-default btn-success').addClass('btn-primary');
    $('#percentageProgress').html(answered == 0 ? '0%' : (answered / 0.10).toFixed(0) + '%');
}
function nextQuestion() {
    var dimensions = ["attitude", "endurance", "action", "concentration", "information", "processing", "presence", "patterns", "compensation"];
    for (var i = 0; i < dimensions.length; i++) {
        if (!getCookie(dimensions[i])) {
            window.location = '/CareerTest/TakeTest';
            return;
        }
    }
    if (!getCookie('question10')) {
        window.location = '/TakeTest/Interests';
        return;
    }
    if (!getCookie('educationSelected')) {
        window.location = '/TakeTest/question';
        return;
    }
    //if (!getCookie('color')) {
    //    window.location = '/TakeTest/Color';
    //    return;
    //}
    //if (!getCookie('shape')) {
    //    window.location = '/TakeTest/Shape';
    //    return;
    //}
    //if (!getCookie('sport')) {
    //    window.location = '/TakeTest/Sport';
    //    return;
    //}
    //if (!getCookie('school')) {
    //    window.location = '/TakeTest/School';
    //    return;
    //}
    window.location = '/TakeTest/EmailResults';
}