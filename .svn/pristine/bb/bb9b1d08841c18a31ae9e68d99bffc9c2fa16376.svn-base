var dimensions = new Array();
var questionstatus = new Array();
var professions = null;

var tempquestions = null;
var questions = new Array();

var prevquestionindex = -1;
var questionindex = 0;

var summaryshown = false;

var revisinganswers = false;


function document_ready() {
    $('.topnav .skilltest').addClass('active');
    getBlobData('skillcow', 'professions', 'allwithattributes.js');
    //getBlobData('skillcow', 'tests', 'skillcowtestshort.js');
    getBlobData('skillcow', 'tests', 'ultrashorttest.js');

    
    //if (getCookie('cbncampaign') == "13564694") {
    //    showInTestVMSchoolsForCareer(604);
    //}
}

function loadtestquestions() {

    for (var i = 0; i < tempquestions.length; i++) {
        var q = tempquestions[i];

        $('#test').append('<div id="q' + q.RowKey + '" class="questionholder" tiebreakerfor="' + q.TiebreakerFor + '">' +
            '<div id="div' + q.RowKey + '" class="question" style="height: 300px;">' +
            '<h1 class="questiontitle">' + (q.TiebreakerFor == '' ? 'Question ' + parseInt(i + 1) : 'Please clarify...') + '</h1>' +
            '<p class="text">' +
            q.Text.replace(/requre/gi, 'require') +
            '</p>' +
            '<p class="answers">' +
            '<input id="a1' + q.RowKey + '" type="button" class="answerbutton" dimension="' + q.Dimension + '" answervalue="' + q.Value1 + '" value="' + q.Answer1 + '" onclick="answertrue(\'' + q.RowKey + '\');"/> ' +
            '<input id="a2' + q.RowKey + '" type="button" class="answerbutton" dimension="' + q.Dimension + '" answervalue="' + q.Value2 + '" value="' + q.Answer2 + '" onclick="answerfalse(\'' + q.RowKey + '\');"/> ' +
            '</p>' +
            '</div>' +
            '</div>');

        questions.push(q);

        if (q.TiebreakerFor == '') {
            $('#questionindex').append('<div id="idx' + q.RowKey + '" index="' + i + '" class="tab">' + (i + 1) + '</div>');
            questionstatus.push({ type: "standard", shown: 1, answered: 0, index: i });
        }
        else {
            $('#questionindex').append('<div id="idx' + q.RowKey + '" index="' + i + '" class="tab tiebreaker tb' + q.Dimension + '" style="display: none;">*</div>');
            questionstatus.push({ type: "tiebreaker", shown: 0, answered: 0, dimension: q.Dimension, index: i });
        }


    }

    loadImportantThings();

    for (var i = 0; i < tempquestions.length; i++) {
        var q = tempquestions[i];

        //set from cookies
        var storedanswer = getCookie(q.Dimension + q.RowKey);
        if (storedanswer != null && storedanswer != '') {
            
            if (storedanswer == q.Value1) {
                answertrue(q.RowKey, true);
            }
            else if (storedanswer == q.Value2) {
                answerfalse(q.RowKey, true);
            }
        }
    }

    

    $('#questionindex .tab').click(function () { showquestion($(this).attr('index')); });


    $('#congrats').appendTo($('#test'));
    $('#tellusaboutyourself').appendTo($('#test'));
    $('#registertoviewresults').appendTo($('#test'));

    var cbncampaignid = "13564694";
    if (getCookie("cbncampaign") != null && getCookie("cbncampaign") != '') {
        cbncampaignid = getCookie("cbncampaign");
    }


    var gradyearoptions = '';
    var d = new Date();
    var curyear = d.getFullYear();
    var curmonth = d.getMonth() + 1;

    for (var y = curyear + 4; y > curyear - 50; y--) {
        if (y > curyear) {
            gradyearoptions += '<option value="' + y + '" >Will graduate in ' + y + '</option>';
        }
        else if (y == curyear && curmonth < 6) {
            gradyearoptions += '<option value="' + y + '" >Graduating in ' + y + '</option>';
        }
        else {
            gradyearoptions += '<option value="' + y + '" >' + y + '</option>';
        }


    }

    
    
    showprogress(getansweredcount(), getshowncount());

    if (document.location.href.indexOf('AboutYourself') !== -1) {
        $('.questionholder').hide();
        $('.congratsholder').hide();
        $('#tellusaboutyourself').show();
        $('#zip').val(getCookie('zip'))
        $('#firstname').focus();
    }
    else {
        if (questions.length > 0) {
            //Find next unanswered question

            for (var i = 0; i < questionstatus.length; i++) {
                if (questionstatus[i].shown == 1 && questionstatus[i].answered == 0) {

                    showquestion(i);

                    if (professions != null) {
                        showsummary();
                        if (recordsubmitted) {
                            //showresultannotations('loadtestquestions');
                        }
                    }
                    return;
                }
            }

            testComplete(false);

            

        }
    }

    if (professions != null) {
        showsummary();
    }
}

function loadultrashorttestquestions() {

    if (getCookie('teststarttime') == null) {
        var d = new Date();
        setCookie('teststarttime', d.getTime());
    }

    for (var i = 0; i < tempquestions.length; i++) {
        var q = tempquestions[i];

        $('#test').append('<div id="q' + q.RowKey + '" class="questionholder" tiebreakerfor="' + q.TiebreakerFor + '">' +
            '<div id="div' + q.RowKey + '" class="question" style="height: 300px;">' +
            '<h1 class="questiontitle">' + (q.TiebreakerFor == '' ? 'Question ' + parseInt(i + 1) : 'Please clarify...') + '</h1>' +
            '<p class="text">' +
            q.Text.replace(/requre/g, 'require') +
            '</p>' +
            '<p class="answers">' +
            '<input id="a1' + q.RowKey + '" type="button" class="answerbutton" dimension="' + q.Dimension + '" answervalue="' + q.Value1 + '" value="' + q.Answer1 + '" onclick="answertrue(\'' + q.RowKey + '\');"/> ' +
            '<input id="a2' + q.RowKey + '" type="button" class="answerbutton" dimension="' + q.Dimension + '" answervalue="' + q.Value2 + '" value="' + q.Answer2 + '" onclick="answerfalse(\'' + q.RowKey + '\');"/> ' +
            '</p>' +
            '</div>' +
            '</div>');

        questions.push(q);

        $('#questionindex').append('<div id="idx' + q.RowKey + '" index="' + i + '" class="tab">' + (i + 1) + '</div>');
        questionstatus.push({ type: "standard", shown: 1, answered: 0, index: i });
        

    }

    for (var i = 0; i < tempquestions.length; i++) {
        var q = tempquestions[i];

        //set from cookies
        var storedanswer = getCookie(q.Dimension + q.RowKey);
        if (storedanswer != null && storedanswer != '') {

            if (storedanswer == q.Value1) {
                answertrue(q.RowKey, true);
            }
            else if (storedanswer == q.Value2) {
                answerfalse(q.RowKey, true);
            }
        }
    }



    $('#questionindex .tab').click(function () { showquestion($(this).attr('index')); });


    $('#congrats').appendTo($('#test'));
    $('#tellusaboutyourself').appendTo($('#test'));
    $('#registertoviewresults').appendTo($('#test'));

    var cbncampaignid = "13564694";
    if (getCookie("cbncampaign") != null && getCookie("cbncampaign") != '') {
        cbncampaignid = getCookie("cbncampaign");
    }


    var gradyearoptions = '';
    var d = new Date();
    var curyear = d.getFullYear();
    var curmonth = d.getMonth() + 1;

    for (var y = curyear + 4; y > curyear - 50; y--) {
        if (y > curyear) {
            gradyearoptions += '<option value="' + y + '" >Will graduate in ' + y + '</option>';
        }
        else if (y == curyear && curmonth < 6) {
            gradyearoptions += '<option value="' + y + '" >Graduating in ' + y + '</option>';
        }
        else {
            gradyearoptions += '<option value="' + y + '" >' + y + '</option>';
        }


    }

    loadImportantThings();

    showprogress(getansweredcount(), getshowncount());

    if (document.location.href.indexOf('AboutYourself') !== -1) {
        $('.questionholder').hide();
        $('.congratsholder').hide();
        $('#tellusaboutyourself').show();
        $('#zip').val(getCookie('zip'))
        $('#firstname').focus();
    }
    else {
        if (questions.length > 0) {
            //Find next unanswered question

            for (var i = 0; i < questionstatus.length; i++) {
                if (questionstatus[i].shown == 1 && questionstatus[i].answered == 0) {

                    showquestion(i);

                    if (professions != null) {
                        showsummary();
                        
                        if (recordsubmitted) {
                            //showresultannotations('loadultrashorttestquestions');
                        }
                    }
                    return;
                }
            }

            testComplete(false);



        }
    }

    if (professions != null) {
        showsummary();
    }
}