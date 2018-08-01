var cowclicks = 0;
function triggercow() {
    $('.pagecontent').stop();
    $('#sillycow');
    if (++cowclicks % 2 != 0) {
        entercow();

        
        setTimeout(function () {
            $('#cowline').show();

            var line = "Excuuse moo-ah... Did you know that the grass is greener on the other side...";
            delivertheline($('#cowline'), line, 10);

            var linerendertime = gettextrendertimebychar(line, 10);

            setTimeout(function () {
                $('#cowlinecontrols').show();
            }, linerendertime + 500);

        }, 1000);

        
    }
    else {
        exitcow();
    }
}
function peekcow() {
    $('#sillycow').animate({ 'left': '-300' }, 500);
    setTimeout(function () {
        $('#sillycow').animate({ 'left': '-380' }, 500);
    }, 1000);
    
}
function entercow() {
    $('#sillycow').animate({ 'left': '-20' }, 500);
    $('#sillycow').attr('title', 'go away cow');

    if (!isie8) {
        $('.pagecontent').animate({ 'opacity': 0 }, 500);
    }
    else {
        $('.pagecontent').hide();
    }
    

}
function exitcow() {
    $('#sillycow').animate({ 'left': '-380' }, 500);
    $('#sillycow').attr('title', 'tickle tickle...');

    if (!isie8) {
        $('.pagecontent').animate({ 'opacity': 1 }, 500);
    }
    else {
        $('.pagecontent').show();
    }
    $('#cowline').hide();
    $('#cowlinecontrols').hide();

}



function delivertheline(control, text, interval) {

    if (interval == null)
        interval = 100;
    control.html('');
    var charindex = 0;
    writenextchar(control, text, charindex, interval);
}

function writenextchar(control, text, charindex, interval) {
    //var prevwidth = parseInt(holder.css('width'));
    control.html(control.html() + text[charindex]);

    //if (prevwidth < parseInt(holder.css('width'))) {
        //holder.css('left', (500 - parseInt(holder.css('width')) / 2) + 'px');
    //}

    var lastchar = text[charindex];

    var nextchardelay = interval;
    switch (lastchar) {
        case ".":
            nextchardelay = 200;
            break;
        case ")":
            nextchardelay = 200;
            break;
        case "(":
            nextchardelay = 200;
            break;
        case "!":
            nextchardelay = 200;
            break;
        case "?":
            nextchardelay = 500;
            break;
        case ";":
            nextchardelay = 300;
            break;
        case ",":
            nextchardelay = 300;
            break;
        default:
            break;
    }

    if (charindex < text.length - 1) {
        setTimeout(function () {
            writenextchar(control, text, charindex + 1, interval);
        }, nextchardelay);
    }
}

function gettextrendertimebychar(text, interval) {
    var totaldelay = 0;

    var lastchar = "";
    for (var i = 0; i < text.length; i++) {
        var nextchardelay = interval;
        switch (lastchar) {
            case ".":
                nextchardelay = 200;
                break;
            case ")":
                nextchardelay = 200;
                break;
            case "(":
                nextchardelay = 200;
                break;
            case "!":
                nextchardelay = 200;
                break;
            case "?":
                nextchardelay = 200;
                break;
            case ";":
                nextchardelay = 300;
                break;
            case ",":
                nextchardelay = 300;
                break;
            default:
                break;
        }
        lastchar = text[i];
        totaldelay += nextchardelay;
    }

    return totaldelay + interval;
}