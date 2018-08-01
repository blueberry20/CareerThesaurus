function showquestion(index) {

    setTimeout(function (index) {

        //$('.questioncontainer div').hide();
        $('#_questions_scrollablecontent').animate({ 'margin-left': '-' + _sizing_q_panel_width + 'px' }, 500, 'easeInOutQuint');

        setTimeout(function (index) {
            $('#_questions_scrollablecontent').stop();
            $('#_questions_scrollablecontent').animate({ 'margin-left': '0px' }, 0);
            $('#_questions_viewport').scrollLeft(_sizing_q_panel_width * index);
            //$('.questioncontainer div').show();

        }, 500, index);
    }, 300, index);
}

function answertrue(id, restoringstate) {
    

    var sequence = $('#a1' + id).attr('qsequence');
    $('#q' + sequence + 'a1info').css('opacity', 1);
    $('#q' + sequence + 'a2info').css('opacity', 0);
    buttonClicked($('#a1' + id), id, restoringstate);
    
}
function answerfalse(id, restoringstate) {
    

    var sequence = $('#a2' + id).attr('qsequence');
    
    $('#q' + sequence + 'a1info').css('opacity', 0);
    $('#q' + sequence + 'a2info').css('opacity', 1);
    buttonClicked($('#a2' + id), id, restoringstate);
    
}

function buttonClicked(button, id, restoringstate) {


    
    $('#div' + id + ' .answerbutton').removeClass('selectedanswer');

    button.addClass('selectedanswer');

    var dimension = button.attr('dimension');

    
    var answerrevised = processinput(dimension, id, button.attr('answervalue'), restoringstate);
    if (answerrevised) {
        revisinganswers = true;
    }

    
    //Find if this Dimension has been answered Ambiguously, and display a tiebreaker question
    /*
    var inputs = getinputs();
    var input = findinput(inputs, dimension);
    if (input.value == '') {
        var tbindex = gettiebreakerindex(dimension);
        $('.tb' + dimension).show();
        questionstatus[tbindex].shown = 1;
        getshowncount();
    }
    */

    

    //NOT RESTORING STATE
    if (!restoringstate) {


        try {
            saveTestResults();
        }
        catch (e) {
            alert(e.message);
        }
        //showsummary();

        
        //if (recordsubmitted) {
        //    showresultannotations();
        //}

        
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

    if (answeredtestquestions < testquestions) {
        $('#progress').html(answeredtestquestions + ' of ' + testquestions + ' questions answered');
    }
    else {
        $('#progress').html('All Questions Completed');
    }

}