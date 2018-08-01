function loadExtras() {

    //add filler loop1
    var f = findFile("Loop1");
    var arrayIndex = getFileArrayIndex("Loop1");
    
    $('#extras').append('<div id="' + f.index + 'holder" style="position: absolute; opacity: 0; left: -2px; top: 0px; width: 100%; height: 100%;"><div id="' + f.index + '"></div></div>');
    loopplayer = new YT.Player(f.index, { height: '100%', width: '100%', playerVars: { controls: 0, showinfo: 0, modestbranding: 0, rel: 0, disablekb: 1 }, events: { 'onReady': onPlayerReady, 'onStateChange': onPlayerStateChange} });
    looparrayindex = arrayIndex;
    
    //add pan
    f = findFile("Pan");
    arrayIndex = getFileArrayIndex("Pan");
    $('#extras').append('<div id="' + f.index + 'holder" style="position: absolute; opacity: 0; left: -2px; top: 0px; width: 100%; height: 100%;"><div id="' + f.index + '"></div></div>');
    panplayer = new YT.Player(f.index, { height: '100%', width: '100%', playerVars: { controls: 0, showinfo: 0, modestbranding: 0, rel: 0, disablekb: 1 }, events: { 'onReady': onPlayerReady, 'onStateChange': onPlayerStateChange} });
    
    log('loadextras()');

    EXTRA_VIDEOS_TO_LOAD = 2;
}

function createPlayers() {
    $('#frames').append('<div id="Qholder" class="videoholder"><div id="Q"></div></div>');
    $('#frames').append('<div id="QA1holder" class="videoholder"><div id="QA1"></div></div>');
    $('#frames').append('<div id="QA2holder" class="videoholder"><div id="QA2"></div></div>');
    $('#frames').append('<div id="QA3holder" class="videoholder"><div id="QA3"></div></div>');
    $('#frames').append('<div id="FA1holder" class="videoholder"><div id="FA1"></div></div>');
    $('#frames').append('<div id="FA2holder" class="videoholder"><div id="FA2"></div></div>');
    $('#frames').append('<div id="FA3holder" class="videoholder"><div id="FA3"></div></div>');

    createVideoPlayers();
}

var videoPlayers = new Array();
function createVideoPlayers() {
    
    VIDEOS_TO_LOAD += 7;
    
    try {
        var q = new YT.Player("Q", { height: '100%', width: '100%', playerVars: { controls: 0, showinfo: 0, modestbranding: 0, rel: 0, disablekb: 1 }, events: { 'onReady': onPlayerReady, 'onStateChange': onPlayerStateChange} });
        var qa1 = new YT.Player("QA1", { height: '100%', width: '100%', playerVars: { controls: 0, showinfo: 0, modestbranding: 0, rel: 0, disablekb: 1 }, events: { 'onReady': onPlayerReady, 'onStateChange': onPlayerStateChange} });
        var qa2 = new YT.Player("QA2", { height: '100%', width: '100%', playerVars: { controls: 0, showinfo: 0, modestbranding: 0, rel: 0, disablekb: 1 }, events: { 'onReady': onPlayerReady, 'onStateChange': onPlayerStateChange} });
        var qa3 = new YT.Player("QA3", { height: '100%', width: '100%', playerVars: { controls: 0, showinfo: 0, modestbranding: 0, rel: 0, disablekb: 1 }, events: { 'onReady': onPlayerReady, 'onStateChange': onPlayerStateChange} });
        var fa1 = new YT.Player("FA1", { height: '100%', width: '100%', playerVars: { controls: 0, showinfo: 0, modestbranding: 0, rel: 0, disablekb: 1 }, events: { 'onReady': onPlayerReady, 'onStateChange': onPlayerStateChange} });
        var fa2 = new YT.Player("FA2", { height: '100%', width: '100%', playerVars: { controls: 0, showinfo: 0, modestbranding: 0, rel: 0, disablekb: 1 }, events: { 'onReady': onPlayerReady, 'onStateChange': onPlayerStateChange} });
        var fa3 = new YT.Player("FA3", { height: '100%', width: '100%', playerVars: { controls: 0, showinfo: 0, modestbranding: 0, rel: 0, disablekb: 1 }, events: { 'onReady': onPlayerReady, 'onStateChange': onPlayerStateChange} });

        videoPlayers.push({ id: "Q", player: q });
        videoPlayers.push({ id: "QA1", player: qa1 });
        videoPlayers.push({ id: "QA2", player: qa2 });
        videoPlayers.push({ id: "QA3", player: qa3 });
        videoPlayers.push({ id: "FA1", player: fa1 });
        videoPlayers.push({ id: "FA2", player: fa2 });
        videoPlayers.push({ id: "FA3", player: fa3 });

        log('createVideoPlayers() ok');

    }
    catch (e) {
        alert("Error: " + e.message);    
    }
    log('createVideoPlayers()');
}
function findVideoPlayerForIndex(index) {
    var id = getControlIdForIndex(index);
    for (var i = 0; i < videoPlayers.length; i++) {
        if (videoPlayers[i].id == id) {
            return videoPlayers[i].player;
        }
    }
}

/* DELETE IF EVERYTHING WORKS
function loadFrames(qindex) {
    var q = data.questions[qindex];
    for (var i = 0; i < data.files.length; i++) {
        var f = data.files[i];
        if (f.number == q.number && f.youtubeurl != "-") {
            $('#frames').append('<div id="' + f.index + 'holder" style="position: absolute; opacity: 0; left: 0px; top: 0px; width: 100%; height: 100%;"><div id="' + f.index + '"></div></div>');
        }
    }
}
*/
/*
function loadAudioPlayers(qindex) {
    var q = data.questions[qindex];
    for (var i = 0; i < data.files.length; i++) {
        var f = data.files[i];
        if (f.number == q.number) {
            if (f.index[0] == 'F' && f.index.length == 2) {
                var f = getYellowAnswerFileForQuestion(qindex);
                var url = 'http://chaindate.blob.core.windows.net/datetrainer/audio/mpov_' + f.index + '_reaction' + currentlanguage + '.mp3';

                clips[i].audio = createAudioPlayer(url);
                clips[i].audiourl = url;
            }
            else {
                var url = 'http://chaindate.blob.core.windows.net/datetrainer/audio/mpov_' + f.index.replace(/_R/g, '_reaction') + currentlanguage + '.mp3';
                clips[i].audio = createAudioPlayer(url);
                clips[i].audiourl = url;
            }
            log('loadAudioPlayers()');
        }
    }
}
*/
function createAudioPlayer(url) {
    var audio = new Audio();
    audio.autoplay = false;
    audio.src = url;
    return audio;
}
function isAppLoaded() {
}

function onPlayerReady(event) {

    TOTAL_VIDEO_PLAYERS_LOADED++;
    
    log('TOTAL_VIDEO_PLAYERS_LOADED=' + TOTAL_VIDEO_PLAYERS_LOADED + '; VIDEOS_TO_LOAD=' + VIDEOS_TO_LOAD + '; EXTRA_VIDEOS_TO_LOAD=' + EXTRA_VIDEOS_TO_LOAD);

    
    if (TOTAL_VIDEO_PLAYERS_LOADED >= (VIDEOS_TO_LOAD + EXTRA_VIDEOS_TO_LOAD)) {
        //SEQUENCING
        log('all players are ready');
            

        if (!firstquestionplayed) {

            cueExtras();
            cueResourcesForFirstQuestion();
        }
    }
}

function cueExtras() {

    //add filler loop1
    var f = findFile("Loop1");

    

    try {
        loopplayer.cueVideoById(f.youtubeurl.replace('http://youtu.be/', ''), 0, videoquality);
        log('loop player cued');
    }
    catch (e) {
        
        log(e.message);
    }

    //add pan
    var f = findFile("Pan");
    panplayer.cueVideoById(f.youtubeurl.replace('http://youtu.be/', ''), 0, videoquality);

    QUEUED_VIDEOS += 2;

    log('cued extras');
}

/*
function cueVideoForQuestionSet(qindex) {
    var q = data.questions[qindex];
    for (var i = 0; i < data.files.length; i++) {
        var f = data.files[i];
        if (f.number == q.number && f.youtubeurl != "-") {
            QUEUED_VIDEOS++;

            var player = findVideoPlayerForIndex(f.index);
            var videoId = f.youtubeurl.replace('http://youtu.be/', '');

            player.cueVideoById(videoId, 0, videoquality);

            clips[i].videourl = f.youtubeurl;
            clips[i].videoindex = f.index;
        }
    }
}
*/

function loadVideoForFile(fileindex, qindex) {

    QUEUED_VIDEOS++;
        
    try {
        var f = findFile(fileindex);

        var player = findVideoPlayerForIndex(fileindex);
        var videoId = f.youtubeurl.replace('http://youtu.be/', '');

        log('loadVideoForFile ' + fileindex + ' url: ' + f.youtubeurl);
        player.cueVideoById(videoId, 0, videoquality);

    }
    catch (e) {
        alert('THIS IS IT: ' + fileindex + ' '  + e.message);
    }
}
