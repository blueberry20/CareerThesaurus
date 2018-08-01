var startbuttonpressedstate;

function document_ready() {

    $('.topnav .home').addClass('active');
    
    $('.puzzlepiece').click(function () {
        animatePuzzlePiece(this);
        document.location = '/skilltest';
    });
    
    setTimeout(function () {
        animatePuzzle();
    }, 1000);

    startbuttonpressedstate = new Image();
    startbuttonpressedstate.src = '/content/images/start-button-pressed.png';

    $('#startbutton').click(function () {
        starttest();
    });
    
    if($('#zip')!=null) {
        if (getCookie('zip') != null && getCookie('zip') != 'undefined') {
            $('#zip').val(getCookie('zip'));
        }
    }

    if (getCookie('homepagesearchkeyword') != null && getCookie('homepagesearchkeyword') != 'undefined') {
        $('#keyword').val(getCookie('homepagesearchkeyword'));
    }
    

    $('#keyword').bind('keypress', function (e) {
        if (e.keyCode == 13) {
            searchjobs();
        }
    });
    $('#zip').bind('keypress', function (e) {
        if (e.keyCode == 13) {
            searchjobs();
        }
    });

    findjobs();
}

function animatePuzzlePiece(img) {
    $('.puzzlepiece').stop();
    $('.puzzlepiece').css('opacity', 0.3);
    $(img).css('opacity', 1);
    $(img).rotate({ angle: 0, animateTo: 360 })
    setTimeout(function () { $('.puzzlepiece').css('opacity', 1); },1000);
}

function waitandpeekcow() {
    setTimeout(function () {
        peekcow();
    }, 1000);
}

function starttest() {
    document.location = appserverurl + '/skilltest';
}

