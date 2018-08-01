
function resettest() {

    if (!confirm('Are you sure you want to reset all questions and start over?')) {
        return;
    }

    try
    {
        $('.question').removeClass('answeredtrue');
        $('.question').removeClass('answeredfalse');
        $('input[type="radio"]').prop('checked', false);
        $('.answerbutton').removeClass('selected');
        $('.tab').removeClass('answered');

        $('#test').css('min-height', 300);
        $('#progressmessage').html('Begin by answering the question above');
        $('#progressbar').css('width', 0);
        $('#progresspanel').show();

        $('#refinementcanvas').hide();
        $('.insertholder').hide();
        $('.congratsholder').hide();

        $('#resultsarrow').animate({ "bottom": 0 }, 500);
        $('#resultsarrowspacer').animate({ "height": 0 }, 500);

        $('.tiebreaker').hide();

        questionindex = 0;
        prevquestionindex = -1;

        for (var i = 0; i < questionstatus.length; i++) {
            if (questionstatus[i].type == "standard") {
                questionstatus[i].answered = 0;
            }
            else {
                questionstatus[i].shown = 0;
                questionstatus[i].answered = 0;
            }
        }

        for (var i = 0; i < questions.length; i++) {
            var q = questions[i];
            setCookie(q.Dimension + q.RowKey, '', 365);
        }

        document.location = appserverurl + '/skilltest';

        $('.resultattribute').hide();

        $('.questionholder').css('opacity', '0');
        showquestion(0);

        dimensions = new Array();
        showsummary();
        showallprofessions();
    }
    catch (ex) {
        alert(ex.message);
    }
    
}