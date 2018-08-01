function createPlayerForIE() {

    log('createPlayerForIE');
    theplayer = new YT.Player("video", { height: '100%', width: '100%', playerVars: { controls: 0, showinfo: 0, modestbranding: 0, rel: 0, disablekb: 1 }, events: { 'onReady': onPlayerReady, 'onStateChange': onPlayerStateChange} });
        
    
}

function findVideoIndexForFile(fileIndex) {
    for (var i = 0; i < videosInPlayer.length; i++) {
        if (videosInPlayer[i].fileIndex == fileIndex) {
            return videosInPlayer[i].videoIndex;
        }
    }
    return -1;
}
function addVideoIndexForFile(fileIndex) {
    var existing = findVideoIndexForFile(fileIndex);
    if (existing >= 0) {
        return;
    }
    videosInPlayer.push({videoIndex:videosInPlayer.length, fileIndex:fileIndex});
}

function isAppLoaded() {
}

function onPlayerReady(event) {

    log('player ready');
    if (!firstquestionplayed) {
        log('cueing videos...');

        try {
            var playlist = new Array();

            //Cue all videos
            for (var i = 0; i < data.files.length; i++) {
                var f = data.files[i];
                
                QUEUED_VIDEOS++;
                var videoId = f.youtubeurl.replace('http://youtu.be/', '');

                if (videoId != null && videoId != '') {
                    playlist.push(videoId);
                    addVideoIndexForFile(f.index);
                }
            }

            theplayer.cuePlaylist(playlist, 0, 0, videoquality);
        }
        catch (e) {
            alert(e.message);
        }

        cueResourcesForFirstQuestion();
    }
}

