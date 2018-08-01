function showquestion(index) {

    $('#test').css('min-height', 300);

    $('.questionholder').hide();
    $('.congratsholder').hide();
    $('.insertholder').hide();
    $('.custominsertholder').hide();

    if (!recordsubmitted) {
        $('#progresspanel').show();
    }

    $('#q' + questions[index].RowKey).show();
    $('#div' + questions[index].RowKey).show();
    $('#q' + questions[index].RowKey).css('opacity', 1);
    $('#div' + questions[index].RowKey).css('opacity', 1);
    
    $('#questionindex .tab').removeClass('current');
    $('#idx' + questions[index].RowKey).addClass('current');

    $("html, body").animate({ scrollTop: 0 }, "fast");

    prevquestionindex = questionindex;
    questionindex = index;
    
    if (importantthings.length > 0) {
        $('#refinementcanvas').show();
        $('#importantthingscanvas').show();
        $('#importantthingscanvas h2').hide();
        $('#importantthingscanvas h3').show();
        $('#importantthingscanvas .answerbutton').hide();
        
        moveInsert('importantthingscanvas', 'refinementcanvas');
    }
    else {
        $('#importantthingscanvas').hide();
    }
}

function answertrue(id, restoringstate) {
    testButtonClicked($('#a1' + id), id, restoringstate); 
}
function answerfalse(id, restoringstate) {
    testButtonClicked($('#a2' + id), id, restoringstate);
}

function testButtonClicked(button, id, restoringstate) {


    $('#div' + id).removeClass('answeredfalse');
    $('#div' + id).addClass('answeredtrue');
    $('#idx' + id).addClass('answered');
    $('#div' + id + ' .answerbutton').removeClass('selected');

    button.addClass('selected');

    var dimension = button.attr('dimension');

    var answerrevised = processinput(dimension, id, button.attr('answervalue'), restoringstate);
    if (answerrevised) {
        revisinganswers = true;
    }

    //Find if this Dimension has been answered Ambiguously, and display a tiebreaker question
    var inputs = getinputs();
    var input = findinput(inputs, dimension);
    if (input.value == '') {
        var tbindex = gettiebreakerindex(dimension);
        $('.tb' + dimension).show();
        questionstatus[tbindex].shown = 1;
        getshowncount();
    }
 
 

    //NOT RESTORING STATE
    if (!restoringstate) {
        saveTestResults();
        showsummary();
        if (recordsubmitted) {
            //showresultannotations('buttonclicked');
        }

        var interrupt = ontestProgressChange(getansweredcount(), getshowncount());
        if (interrupt) {
            return;
        }

        nextQuestion(answerrevised);
    }
    
}

function nextQuestion(answerrevised) {
    
    //Find next unanswered question
    for (var i = 0; i < questionstatus.length; i++) {
        if (questionstatus[i].shown == 1 && questionstatus[i].answered == 0) {
            showquestion(i);
            return;
        }
    }

    testComplete(answerrevised);
}

function ontestProgressChange(answered, totalquestions) {
    
    showprogress(answered, totalquestions);

    var zip = getCookie('zip');

    if (zip == null || zip == '') {
        $('.questionholder').hide();
        $('#zipcodeupfront').show();
        moveInsert('zipcodeupfront', 'test');
        $('#zipcodeupfrontvalue').focus();
        return true;
    }

    if(answered>=1 && importantthings.length == 0) {
        if (importantthings.length == 0) {
            debugalert('showing important things');
            //$('#progressmessage').html("Personalize your results by selecting the Tags above");
            $('.questionholder').hide();
            
            $('#importantthingscanvas').show();
            $('#importantthingscanvas h2').show();
            $('#importantthingscanvas h3').hide();
            moveInsert('importantthingscanvas', 'test');
            flashImportantThings(8);
            return true;
        }
            
    }
    return false;
}
function moveInsert(id, target) {
    
    if ($('#' + id).parent().attr('id') == target) {
        return;
    }
    $('#' + id).appendTo($('#' + target));
    $('#' + id).show();
}

function showprogress(answeredtestquestions, testquestions) {
    
    var answeredImportantThings = (importantthings.length > 0 ? 1 : 0);

    var totalsteps = testquestions + 1;
    var stepscompleted = answeredtestquestions + answeredImportantThings;

    $('#progressbar').css('width', 547 * (parseFloat(stepscompleted) / totalsteps) + 'px');
    //$('#progressmessage').html(stepscompleted + ' of ' + totalsteps);
    $('#progressmessage').html('');

}