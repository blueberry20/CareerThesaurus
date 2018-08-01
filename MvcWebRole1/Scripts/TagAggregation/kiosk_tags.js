function normalizeRank(keywords) {
    //find max
    //find min

    var max=0, min=99999;
    for(var i=0;i<keywords.length; i++) {
        max = keywords[i].count > max ? keywords[i].count : max;
        min = keywords[i].count < min ? keywords[i].count : min;
    }

    for (var i = 0; i < keywords.length; i++) {
        if (max - min == 0) {
            keywords[i].rank = 1;
        }
        else {
            keywords[i].rank = (keywords[i].count - min) / (max - min);
        }
    }
    
    return keywords;
}
function rankWords(desc, exclude, keywords, kwtype) {
    
    if (keywords == null) {
        keywords = new Array();
    }

    var text = desc.replace(/(<b>|<\/b>|<br\/>|&amp;|\*|\.|\,|\:|\;|\-|\(|\)|\+|\=|\?|\!|\/|~|\"|\'|\$|[0-9]|\[|\])/g, ' ').replace(/\s\s/g, ' ');
    var words = text.split(' ');

    for (var i = 0; i < words.length; i++) {
        var excluded = false;

        if (exclude != null) {
            for (var j = 0; j < exclude.length; j++) {
                var tokens = $.trim(exclude[j]).toLowerCase().split(' ');
                for(var k=0; k<tokens.length; k++)
                {
                    if ($.trim(tokens[k]).toLowerCase() == $.trim(words[i]).toLowerCase() || $.trim(tokens[k]).toLowerCase() + 's' == $.trim(words[i]).toLowerCase()) {
                        excluded = true;
                        break;
                    }
                }
            }
        }

        if (!excluded) {
            registerKeyword($.trim(words[i]), keywords, kwtype);
        }
    }

    
    return keywords;
    
}

function rankPhrase(phrase, exclude, keywords, source) {

    
    if (keywords == null) {
        keywords = new Array();
    }

    var text = $.trim(phrase);  

          

    var excluded = false;
    if (exclude != null) {
        for (var j = 0; j < exclude.length; j++) {
            if ($.trim(exclude[j]).toLowerCase() == $.trim(text).toLowerCase()) {
                excluded = true;
                break;
            }
        }
    }
        
    if (!excluded) {  
        registerPhrase($.trim(text), keywords);
    }

    return keywords;
}


function toUnicode(theString) {
    var unicodeString = '';
    for (var i = 0; i < theString.length; i++) {
        var theUnicode = theString.charCodeAt(i).toString(16).toUpperCase();
        while (theUnicode.length < 4) {
            theUnicode = '0' + theUnicode;
        }
        theUnicode = '\\u' + theUnicode;
        unicodeString += theUnicode;
    }
    return unicodeString;
}

function registerKeyword(v, keywords, kwtype) {

    var kw = v.replace(/(\bthe\b|\ba\b|\bof\b|\bas\b|\bto\b|\band\b|\bare\b|\bis\b|\bhave\b|\bgot\b|\bget\b|\byou\b|\bour\b|\byour\b|\bbe\b|\bby\b|\bcan\b|\bmay\b|\bwill\b|\bin\b|\bwhile\b|\bwhen\b|\bwhy\b|\bwith\b|\bor\b|\balso\b|\binto\b|\ban\b|\bthen\b|\bthan\b|\bany\b|\bjob\b|\bfor\b|\ball\b|\bthis\b|\bsuch\b|\bwho\b|\bmust\b|\bboth\b|\bwant\b|\bthat\b|\bnew\b|\byork\b|\bexperience\b|\blooking\b|\bwork\b|\bjoin\b|\bseeking\b|\byears\b|\btheir\b|\bnot\b|\bcall\b|\brequired\b|\employer\b|\bour\b|\bits\b|\bllp\b|\bwhich\b|\baren't\b|\binc\b|\btop\b|\bgpa\b|\bfrom\b|\babout\b|\bplease\b|\bsees\b|\bhas\b|\bposition\b|\bseeks\b|\bbecome\b|\bper\b|\bfull\b|\bout\b|\bwe\b|\bthrough\b|\bhow\b|\bbased\b|\bskills\b|\bprovide\b|\bdescription\b|\bon\b|\brole\b|\bother\b|\bability\b|\bensure\b|\bstrong\b|\bproviding\b|\bsupporting\b|\bassigned\b|\bworking\b|\bincluding\b|\bcommitted\b|\bapply\b|\bnow\b|\benjoy\b|\bup\b|\bno\b|\bavailable\b|\bat\b|\bwww\b|\bcom\b|\bvisit\b|\bmore\b|\blearn\b|\bresponsible\b)/gi, '');

    if (kw.length < 2) {
        return;
    }
    for (var i = 0; i < keywords.length; i++) {
        if (keywords[i].keyword.toLowerCase() === kw.toLowerCase()) {
            keywords[i].count++;
            return;
        }
    }
    keywords.push({ keyword: kw, count: 1, rank: 0, keywordtype: (kwtype == null ? 'standard' : kwtype), unicodestring: toUnicode(kw) });
}

function registerPhrase(v, keywords) {

    var kw = v;

    if (kw.length < 3) {
        return;
    }
    for (var i = 0; i < keywords.length; i++) {
        if (keywords[i].keyword.toLowerCase() === kw.toLowerCase()) {
            keywords[i].count++;
            return;
        }
    }
    keywords.push({ keyword: kw, count: 1, rank: 0, keywordtype: 1, unicodestring: toUnicode(kw) });
}

function displaykiosktags(scrollable, viewport, keywords, mincount, effect, animatedelay, animateduration, addtagfunction) {

    var sorted = keywords.sort(sortbycount);

    var totaltagswidth = 0;

    var cnt = 0;
    for (var i = 0; i < sorted.length; i++) {
        if (sorted[i].count > mincount) {

            var color = '#fff'; // (cnt % 2 == 0 ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.6)');
            cnt++;

            $('#' + scrollable).append('<' + (ismobile ? 'div' : 'input') + ' type="button" id="' + scrollable + i + '" class="clickabletag" style="font-size: ' + parseInt((ismobile ? 10 : 14) + ((ismobile ? 16 : 24) * sorted[i].rank)) + 'pt; color:' + (sorted[i].keywordtype == 'intitle' ? 'rgba(255,230,0,1)' : color) + '; outline:none;" keywordtype="' + sorted[i].keywordtype + '" value="' + $.trim(sorted[i].keyword) + '"' + (ismobile ? '>' + $.trim(sorted[i].keyword) + '</div>' : '/>'));
            $('#' + scrollable + i).click(function () {
                addtagfunction(this);
            });
        }
    }

    switch (effect) {
        case 'fadein':
            $('#' + scrollable).animate({ 'margin-left': '0px'}, 0);
            break;
        default:
            break;
    }

    setTimeout(function () {
        

        $("#" + viewport).show();

        for (var i = 0; i < sorted.length; i++) {
            var tag = $('#' + scrollable + i);
            if (tag != null) {
                var width = $('#' + scrollable + i).width();
                if (width > 0) {
                    totaltagswidth += $('#' + scrollable + i).width() + 40;
                }
            }
        }

        $("#" + viewport).css('width', document.documentElement.clientWidth - (ismobile? 280 : 300));
        $('#' + scrollable).css('width', totaltagswidth);

        $("#" + viewport).niceScroll("#" + scrollable, { cursorcolor: "rgba(255,255,255,0.3)", cursorborder: "1px none #fff"  });
        $("#" + viewport).getNiceScroll().resize();


        $('#' + scrollable).animate({ 'margin-left': '0px', 'opacity': 1 }, animateduration);
    }, animatedelay);

}

function sortbycount(a, b) {
    if (a.count > b.count)
        return -1;
    if (a.count < b.count)
        return 1;
    return 0;
}
function sortbykeyword(a, b) {
    if (a.keyword.toLowerCase() < b.keyword.toLowerCase())
        return -1;
    if (a.keyword.toLowerCase() > b.keyword.toLowerCase())
        return 1;
    return 0;
}