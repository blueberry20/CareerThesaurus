function onPlayerStateChange(event) {

    try {
        if (event.data == YT.PlayerState.ENDED) {
            if (event.target.id == 1) {
                if (!answerplaying) {
                    restartLoop();
                }
            }
        }

        if (event.data == YT.PlayerState.CUED) {
            if (!firstquestionplayed) {
                playCurrentQuestion();
            }
        }

        if (event.data == YT.PlayerState.PLAYING) {
            if (clipplaying) {
                return;
            }

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
        
    var duration = event.target.getDuration() * 1000;

    transitionToLoopTimer = setTimeout(function () {
        clipplaying = false;
        transitiontofiller();
    }, duration);

    /*
    setTimeout(function () {
        $('#overlay').animate({ "opacity": 1 }, 1000);
        setTimeout(function () {
            $('#overlay').animate({ "opacity": 0 }, 1000);
        }, 2000);
    }, duration - 2000);
    */
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

    zindex += 2;

    setTimeout(function () {
        answerplaying = true;
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
    }
    else {
        if (answerFile.color == 'yellow') {
            setTimeout(function () {
                answerplaying = false;
                clipplaying = false;
                transitiontofiller();
            }, duration - 1500);

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
        }
    }
}

function onLoopStartedPlayingEvent(event) {

    try {
        setTimeout(function () {
            showButtons();
        }, 1000);

        var duration = event.target.getDuration() * 1000;

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

    //Do not restart the loop if answer just started playing
    if (answerplaying) {
        return;
    }
    
    var duration = 0;

    theplayer.seekTo(0);
    duration = theplayer.getDuration() * 1000;

    var timeout = duration - 1000;

    loop1timer = setTimeout(function () {
        restartLoop();
    }, timeout);
}

