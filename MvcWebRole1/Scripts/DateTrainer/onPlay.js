function onPlayerStateChange(event) {

    try {

        if (event.data == YT.PlayerState.ENDED) {

            if (event.target.id == 1) {
                if (!answerplaying) {
                    log('>>> Loop ended, restarting');
                    restartLoop();
                }
            }

            log('>>> CLIP ENDED id ' + event.target.id);
        }



        if (event.data == YT.PlayerState.CUED) {

        
            log('>>> CLIP CUED id ' + event.target.id);
            READY_VIDEOS++;
            if (READY_VIDEOS >= QUEUED_VIDEOS) {
                if (!firstquestionplayed) {
                    playCurrentQuestion();
                }
            }
        }

        if (event.data == YT.PlayerState.PLAYING) {

            log('>>> CLIP PLAYING id ' + event.target.id);

            if (clipplaying)
                return;

            if (transition < 1) {
                clipplaying = true;

                if (answerpressed) {
                    onAnswerClipStart(event);
                }
                else {
                    onQuestionClipStart(event);
                }
            }
            else {
                onLoopClipStart(event);
            }

        }
    }
    catch (e) {
        log('Error in onPlayerStateChange(): ' + e.message);
    }
}

/* QUESTION */
function onQuestionClipStart(event) {
    
    playingFileIndex = data.files[playingFileArrayIndex].index;

    log('+ showing ' + playingFileControlId + 'holder');

    $('#' + playingFileControlId + 'holder').css('z-index', zindex++);
    $('#' + playingFileControlId + 'holder').show();
    $('#' + playingFileControlId + 'holder').animate({ "opacity": 1 }, 1000);
            
    var duration = event.target.getDuration() * 1000;

    transitionToLoopTimer = setTimeout(function () {
        clipplaying = false;
        transitiontofiller();
    }, duration - 2500);
    
    cueOpportunity('question', '', playingFileIndex, curindex);

    setTimeout(function (id) {
        log('- hiding ' + id + 'holder');
        $('#' + id + 'holder').hide();
        $('#' + id + 'holder').css('opacity', 0);
    }, duration, playingFileControlId);
}

/* LOOP */
function onLoopClipStart(event) {
    onLoopStartedPlayingEvent(event);
}

/* ANSWER */
function onAnswerClipStart(event) {

    
    answerpressed = false;
    
    //transition from filler
    var answerFile = findFile(answerFileIndex);
    
    cancelLoop();

    log('+ showing ' + playingFileControlId + 'holder');

    $('#Loop1holder').css('z-index', (zindex + 1));
    $('#' + playingFileControlId + 'holder').css('z-index', zindex);
    zindex += 2;

    $('#' + playingFileControlId + 'holder').show();
    $('#Loop1holder').animate({ "opacity": 0 }, 1000);

    setTimeout(function () {
        answerplaying = true;
        
        $('#Loop1holder').hide();    
    
        loopvideo.pauseVideo();
        loopvideo.seekTo(0);

        loopaudio.pause();

        transition = 0;
        

    }, 2000);

    playingFileIndex = answerFileIndex;
    playingFileArrayIndex = answerFileArrayIndex;
    
    var duration = event.target.getDuration() * 1000;
    
    
    var nextQuestion = '';


    if (answerFile.color == 'green') {
        nextQuestion = 'Q' + parseInt(answerFile.number + 1);
    }
    else if (answerFile.color == 'yellow') {
        nextQuestion = 'F' + answerFile.number;
    }
    else {
        nextQuestion = '';
    }
        

    if (nextQuestion == '') {
        //RED ANSWER, THE END
        setTimeout(function () {
            theend();
        }, duration - 2000);

        cueOpportunity('answer', 'red', playingFileIndex, curindex);
    }
    else {
        if (answerFile.color == 'yellow') {
            setTimeout(function (playingFileIndex, curindex) {
                answerplaying = false;
                clipplaying = false;
                transitiontofiller();

                setTimeout(function (playingFileIndex, curindex) {
                    cueOpportunity('answer', 'yellow', playingFileIndex, curindex);
                }, 1000, playingFileIndex, curindex);

            }, duration - 2000, playingFileIndex, curindex);

            setTimeout(function (nextQuestion) {
                showButtons(nextQuestion);
            }, duration - 1000, nextQuestion);
                        
        }

        else {
            //SHOW NEXT QUESTION
            
            setTimeout(function () {
                log('play next question');
                answerplaying = false;
                clipplaying = false;

                curindex++;
                loadButtons("Q", curindex);

                playCurrentQuestion();
            }, duration - 2000);

            cueOpportunity('answer', 'green', playingFileIndex, curindex);
        }
    }

    //Hide it
    setTimeout(function (id) {
        log('- hiding ' + id + 'holder');
        $('#' + id + 'holder').hide();
    }, duration - 1000, playingFileControlId);


}

function onLoopStartedPlayingEvent(event) {


    try {
        //Cross fade
        $('#Loop1holder').css('z-index', zindex++);
        $('#Loop1holder').show();
        $('#Loop1holder').animate({ "opacity": 1 }, 1000);
        
        setTimeout(function () {
            showButtons();
        }, 1000);

        var duration = event.target.getDuration() * 1000;

        if (isIE == true) {
            //ANY ADJUSTMENTS TO TIMEOUT FOR IE?
        }

        var timeout = duration - 1000;

        loop1timer = setTimeout(function () {
            clipplaying = false;
            restartLoop();
        }, timeout);
    }
    catch (e) {
        log('Error in onLoopClipStart' + e.message);
    }

}


function restartLoop() {

    if (answerplaying) {
        return;
    }
    
    var duration = 0;

    try { 
        loopplayer.seekTo(0);
        duration = loopplayer.getDuration() * 1000;
        //loopplayer.playVideo();
    }
    catch (e) {    }

    try { 
        //loopaudio.load();
        //loopaudio.play();
    }
    catch (e) {    }

    var timeout = duration - 1000;

    loop1timer = setTimeout(function () {
        restartLoop();
    }, timeout);
}

function cueOpportunity(cliptype, color, fileindex, qindex) {
    
    //log('<br>-- PLAYING: ' + cliptype + ' ' + color + ' ' + fileindex + ' ' + qindex);

    //wait a little for the transition to finish then load
    setTimeout(function () {
        switch (cliptype) {
            case 'question':
                //Load 3 answers
                var q = data.questions[qindex];
                for (var i = 1; i <= 3; i++) {
                    loadVideoForFile('Q' + q.number + '_A' + i, qindex);
                }
                break;
            case 'answer':
                if (color == 'green' && curindex < data.questions.length - 1) {
                    var q = data.questions[qindex + 1];
                    loadVideoForFile('Q' + q.number, qindex + 1);
                }
                else if (color == 'yellow') {
                    var q = data.questions[qindex];
                    for (var i = 1; i <= 3; i++) {
                        loadVideoForFile('F' + q.number + '_A' + i, qindex);
                    }
                }

                break;


        }
    }, 1200);
}