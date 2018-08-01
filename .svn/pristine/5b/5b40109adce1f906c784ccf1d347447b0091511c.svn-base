var youtubeapiready = false;

$(document).ready(function () {

    log('document ready');

    
    $('.answerbutton').mouseover(function () { answerbutton_mouseover(this); });
    $('.answerbutton').mouseout(function () { answerbutton_mouseout(this); });
    $('.answerbutton').mousedown(function () { answerbutton_mousedown(this); });

    initializeClipArray();

    //CREATE YoutTube API Script
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var youtubeapiscripttag = document.getElementsByTagName('script')[0];
    youtubeapiscripttag.parentNode.insertBefore(tag, youtubeapiscripttag);

    //And wait for Player to initialize
    waitforyoutubeapi();
});

function initializeClipArray() {
    for (var i = 0; i < data.files.length; i++) {
        clips.push({ video: null, audio: null, audiourl: '', videourl: '', videoindex: '' });
    }
}

function onYouTubeIframeAPIReady() {
    youtubeapiready = true;
}

function waitforyoutubeapi() {
    if (youtubeapiready) {
        //Call WIREUP functions
        log('youtube ready');
        loadExtras();
        createPlayers();
    }
    else {
        setTimeout(waitforyoutubeapi, 100);
    }
}
