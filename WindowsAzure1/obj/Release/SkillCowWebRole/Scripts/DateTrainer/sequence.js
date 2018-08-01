//Called by init.waitforyoutubeapi() when API becomes available, after loadExtras();
function cueResourcesForFirstQuestion() {
    //Prepare all players 
    if (curindex < data.questions.length - 1) {
        curindex++;
        var q = data.questions[curindex];

        loadVideoForFile('Q' + q.number, curindex);
        loadButtons("Q", curindex);
    }
    else {
        theend();
    }
}

function playCurrentQuestion() {
    firstquestionplayed = true;
    $('#controls').animate({ "opacity": 0 }, 100);
    $('#overlay').animate({ "opacity": 0 }, 1000);

    playQuestion(curindex);
}
function playQuestion(qindex) {
    var q = data.questions[qindex];
    try {

        //find file
        var file = findFile('Q' + q.number);

        playingFileIndex = file.index;
        playingFileControlId = getControlIdForIndex(file.index);
                
        var fileArrayIndex = getFileArrayIndex('Q' + q.number);

        playingFileArrayIndex = fileArrayIndex;

        var player = findVideoPlayerForIndex(file.index);
        player.playVideo();
    }
    catch (e) {
        log(e.message)
    }
}
function cancelLoop() {
    try {
        clearTimeout(loop1timer);
        clearTimeout(loop2timer);
        clearTimeout(transitionToLoopTimer);
        clearTimeout(nextQuestionTimer);

        loopvideo.pauseVideo();
        loopaudio.pause();
    }
    catch (e) { }
}
function playAnswer(findex) {
    hideButtons();
    var file = findFile(findex);
    var fileArrayIndex = getFileArrayIndex(findex);
    transition = 0;
    answerFileIndex = findex;
    answerFileArrayIndex = fileArrayIndex;
    answerpressed = true;

    playingFileControlId = getControlIdForIndex(file.index);

    $('#' + playingFileControlId + 'holder').show();
        
    var player = findVideoPlayerForIndex(file.index);
    player.playVideo();
}


var transition = 0;
var transitioncount = 0;
function transitiontofiller() {

    if (answerplaying) {
        return;
    }

    try {
        transition = 1;

        loopplayer.seekTo(0);
        loopplayer.playVideo();

    }
    catch (e) {
        log('ERROR ' + e.message);
    }
}

function theend() {
    $('#controls').hide();
    $('#theend').show();
}