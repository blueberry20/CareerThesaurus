var dimensions = new Array();
var questionstatus = new Array();
var professions = null;

var prevquestionindex = -1;
var questionindex = 0;

var summaryshown = false;

var revisinganswers = false;

function document_ready() {
    getBlobData('skillcow', 'professions', 'allwithattributes.js');
    $('#btnimportantthings').press(function () { showImportantThings(); });
}

function questionsAreReady() {
    loadultrashorttestquestions();
}

function $allwithattributes_ready(data, container) {
    professions = data.items;
}

function loadultrashorttestquestions() {

    //preload important things
    setTimeout(preloadImportantThings, 1100);
    
    for (var i = 0; i < tempquestions.length; i++) {
        var q = tempquestions[i];

        addQuestion(i, q);

        questions.push(q);
        questionstatus.push({ type: "standard", shown: 1, answered: 0, index: i });
    }

    $('#_questions_scrollablecontent').css('width', (_sizing_q_panel_width * 10) + 'px');

    if (ismobile) {
        $('#_questions_viewport').css('height', (document.documentElement.clientHeight-75-80) + 'px');
    }
    
    $("#_questions_viewport").niceScroll("#_questions_scrollablecontent", { cursorcolor: "rgba(0,0,0,0)" });
    $("#_questions_viewport").show();

    //$(document).niceScroll("#_questions_scrollablecontent", { cursorcolor: "rgba(0,0,0,0)" });
    $('#_questions_scrollablecontent').animate({ 'margin-left': '0px', 'opacity': 1 }, 1000);
        
    for (var i = 0; i < tempquestions.length; i++) {
        var q = tempquestions[i];

        //set from cookies
        var storedanswer = getCookie(q.Dimension + q.RowKey);
        //alert(q.Dimension + q.RowKey + ' = ' + storedanswer);
        if (storedanswer != null && storedanswer != '') {

            if (storedanswer == q.Value1) {
                answertrue(q.RowKey, true);
            }
            else if (storedanswer == q.Value2) {
                answerfalse(q.RowKey, true);
            }
        }
    }

    showprogress(getansweredcount(), getshowncount());

    //Check if all questions are answered
    for (var i = 0; i < questionstatus.length; i++) {
        if (questionstatus[i].shown == 1 && questionstatus[i].answered == 0) {
            return;
        }
    }

    //no unanswered questions remain
    testComplete(false, true);
}

function addQuestion(sequence, q) {

    $('#_questions_scrollablecontent').append('<div id="panel' + sequence + '" style="position: relative; display: inline-block; margin: 0; border: thin none yellow; width:' + _sizing_q_panel_width + 'px; height: ' + _sizing_scrollable_content_height + 'px; text-align: center;">' +
        '<div id="div' + q.RowKey + '" style="position: absolute; top: 0px; left: ' + _sizing_q_div_left + 'px; width:' + _sizing_q_div_width + 'px; height:' + _sizing_q_div_height + 'px; border: thin solid black; font-size: 10pt; color: #333; padding: 0px; text-align: left;" class="diagonalwhitegradient questioncontainer">' +
        '    <div style="position: absolute; top: -60px; left: 0px; font-family: Times New Roman; font-size: 220pt; color: rgba(0,0,0,0.05);">' +
        '        Q' +
        '    </div>' +
        '    <div style="position: absolute; top: ' + _sizing_q_header_top + 'px; left: ' + _sizing_q_header_left + 'px; font-size: ' + _sizing_q_header_font_size + '; color: #ee5500; font-weight: bold;">' +
        headerForDimension(q.Dimension) +
        '    </div>' +
        '    <div style="position: absolute; top: ' + _sizing_q_text_top + 'px; left: ' + _sizing_q_text_left + 'px; font-size: ' + _sizing_q_text_font_size + '; color: #333; width: ' + _sizing_q_text_width + 'px; ">' +
        q.Text.replace(/requre/gi,'require') +
        '    </div>' +

        (!ismobile ? '    <div id="q' + sequence + 'a1info" style="position: absolute; top: ' + _sizing_q_a_annot_top + 'px; left: ' + _sizing_q_a_annot_left + 'px; font-size: ' + _sizing_q_a_annot_font_size + '; color: #333; width: ' + _sizing_q_a_annot_width + 'px; text-align: center; opacity: 0;"><br /></div>' : '') +
        (!ismobile ? '    <div id="q' + sequence + 'a2info" style="position: absolute; top: ' + _sizing_q_a_annot_top + 'px; left: ' + _sizing_q_a_annot_left + 'px; font-size: ' + _sizing_q_a_annot_font_size + '; color: #333; width: ' + _sizing_q_a_annot_width + 'px; text-align: center; opacity: 0;"><br /></div>' : '') +

        (!ismobile ? '    <' + _button_tag_start + ' id="i1' + q.RowKey + '" qsequence="' + sequence + '" type="button" class="infobutton" style="position: absolute; bottom: 120px; left: 20px; padding: ' + (ismobile ? '15px' : '0') + ' 0 0 0; font-size: 36pt; width: 100px; height: ' + (ismobile ? '85px' : '100px') + '; border-radius: 50px 50px; text-align: center; outline: none;" value="?"' + (ismobile ? '>?</div>' : '/>') : '') +
        (!ismobile ? '    <' + _button_tag_start + ' id="i2' + q.RowKey + '" qsequence="' + sequence + '" type="button" class="infobutton" style="position: absolute; bottom: 120px; right: 20px; padding: ' + (ismobile ? '15px' : '0') + ' 0 0 0; font-size: 36pt; width: 100px; height: ' + (ismobile ? '85px' : '100px') + ';  border-radius: 50px 50px; text-align: center; outline: none;" value="?"' + (ismobile ? '>?</div>' : '/>') : '') + 

        '    ' +
        '    <' + _button_tag_start + ' id="a1' + q.RowKey + '" rowkey="' + q.RowKey + '" type="button" class="answerbutton" qsequence="' + sequence + '" dimension="' + q.Dimension + '" answervalue="' + q.Value1 + '" style="position: absolute; bottom: ' + (ismobile ? 0 : '-2px') + '; left: 0px; padding: 30px; font-size: 20pt; width: ' + (ismobile ? 259 + 'px' : '360px') + '; text-align: center; outline: none" value="' + q.Answer1 + '"' + (ismobile ? '>' + q.Answer1 + '</div>' : '/>') +
        '    <' + _button_tag_start + ' id="a2' + q.RowKey + '" rowkey="' + q.RowKey + '" type="button" class="answerbutton" qsequence="' + sequence + '" dimension="' + q.Dimension + '" answervalue="' + q.Value2 + '" style="position: absolute; bottom: ' + (ismobile ? 0 : '-2px') + '; right: 0px; padding: 30px; font-size: 20pt; width: ' + (ismobile ? 259 + 'px' : '360px') + '; text-align: center; outline: none" value="' + q.Answer2 + '"' + (ismobile ? '>' + q.Answer2 + '</div>' : '/>') + 
        //'    <div id="a1' + q.RowKey + '" rowkey="' + q.RowKey + '" class="button answerbutton" qsequence="' + sequence + '" dimension="' + q.Dimension + '" answervalue="' + q.Value1 + '" style="position: absolute; bottom: 0px; left: 0px; padding: 30px; font-size: 20pt; width: 360px;" >' + q.Answer1 + '</div>' +
        //'    <div id="a2' + q.RowKey + '" rowkey="' + q.RowKey + '" class="button answerbutton" qsequence="' + sequence + '" dimension="' + q.Dimension + '" answervalue="' + q.Value2 + '" style="position: absolute; bottom: 0px; right: 0px; padding: 30px; font-size: 20pt; width: 360px;" >' + q.Answer2 + '</div>' +
        '</div>' +
        //'<div class="whitereflection" style="position: absolute; top: 733px; left: 211px; width: 1520px; height: 40px;"></div>' +
        '</div>');

    $('#_' + q.Dimension.toLowerCase() + '_' + q.Value1.toLowerCase()).appendTo('#q' + sequence + 'a1info');
    $('#_' + q.Dimension.toLowerCase() + '_' + q.Value2.toLowerCase()).appendTo('#q' + sequence + 'a2info');

    $('#a1' + q.RowKey).press(function () { answertrue($(this).attr('rowkey')); });
    $('#a2' + q.RowKey).press(function () { answerfalse($(this).attr('rowkey')); });

    $('#i1' + q.RowKey).press(function () { $('#q' + $(this).attr('qsequence') + 'a1info').animate({ 'opacity': 1 }, 1000); $('#q' + $(this).attr('qsequence') + 'a2info').animate({ 'opacity': 0 }, 1000); });
    $('#i2' + q.RowKey).press(function () { $('#q' + $(this).attr('qsequence') + 'a2info').animate({ 'opacity': 1 }, 1000); $('#q' + $(this).attr('qsequence') + 'a1info').animate({ 'opacity': 0 }, 1000); });

    
}

function headerForDimension(d) {
    switch (d.toLowerCase()) {
        case 'attitude':
            return 'What is your social attitude';
        case 'information':
            return 'Gathering new information';
        case 'processing':
            return 'How you process new information';
        case 'action':
            return 'Process and Result orientation';
        case 'endurance':
            return 'Stationary endurance';
        case 'presence':
            return 'Your presence at your ideal job';
        case 'concentration':
            return 'Focus and Concentration';
        case 'patterns':
            return 'Working patterns';
        case 'compensation':
            return 'Your Financial Sensitivity';
        default:
            return '';
    }
}