/*BUTTON BACKGROUND PRELOADING*/
var imgbtnp1 = new Image();
imgbtnp1.src = '/Content/Images/DateTrainer/Buttons/red.png';
var imgbtnp2 = new Image();
imgbtnp2.src = '/Content/Images/DateTrainer/Buttons/yellow.png';
var imgbtnp3 = new Image();
imgbtnp3.src = '/Content/Images/DateTrainer/Buttons/green.png';

function loadButtons(prefix, qindex) {

    var q = data.questions[qindex];
    for (var i = 1; i <= 3; i++) {
        var f = findFile(prefix + q.number + "_A" + i);
        var b = $('#button' + i);

        b.removeClass('button_red');
        b.removeClass('button_yellow');
        b.removeClass('button_green');
        b.addClass('button_' + f.color);

        b.attr('fileindex', f.index);

        var span = $('#button' + i + ' span');
        span.html(f.button);
    }
}


function answerbutton_mouseover(e) {
    //show highlight
    $('.highlight').stop();
    $('.highlight').animate({ 'opacity': 0 }, 300);

    var hl = $(e).children('div');
    hl.stop();
    hl.animate({ 'opacity': 1 }, 300);

}

function answerbutton_mouseout(e) {
    var hl = $(e).children('div');
    hl.stop();
    hl.animate({ 'opacity': 0 }, 300);
}

function answerbutton_mousedown(e) {
    var hl = $(e).children('div');
    hl.stop();
    hl.css('opacity', 0);
    var indextoplay = $(e).attr('fileindex');
    playAnswer(indextoplay);
}

function showButtons(nextQuestion) {
    
    if ($('#answerscanvas').css('display') != 'none') {
        return;
    }
    
    if (nextQuestion != null && nextQuestion != '') {
        var qidx = getQuestionIndexFromNumber(parseInt(nextQuestion[1]));
        
        loadButtons(nextQuestion[0], qidx);
    }

    $('#answerscanvas').show();
    $('#answerscanvas').animate({ 'opacity': 1 }, 0);
}
function hideButtons() {
    $('#answerscanvas').animate({ 'opacity': 0 }, 1000);
    setTimeout(function () {
        $('#answerscanvas').hide();
    }, 1000);
}