var tagkeywords = new Array();
var spawnedkeywords = new Array();

function registerKeywords(desc, exclude) {

    var text = desc.replace(/(<b>|<\/b>|&amp;|\*|\.|\,|\:|\;|\-|\(|\)|\+|\=|\?|\!|\/|~|\"|\'|\$|[0-9])/g, ' ').replace(/\s\s/g, ' ');

    
    var words = text.split(' ');

    for (var i = 0; i < words.length; i++) {
        
        var excluded = false;
        for (var j = 0; j < exclude.length; j++) {
            
            if ($.trim(exclude[j]).toLowerCase() == $.trim(words[i]).toLowerCase() || $.trim(exclude[j]).toLowerCase() + 's' == $.trim(words[i]).toLowerCase()) {
                excluded = true;
                break;
            }
        }
        
        if (!excluded) {
            registerKeyword($.trim(words[i]).toLowerCase());
        }
    }
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

function registerKeyword(v) {

    var kw = v.replace(/[^A-Za-z]/g, ' ');
    kw = v.replace(/\s\s/g, ' ');
    kw = v.replace(/(\bthe\b|\ba\b|\bof\b|\bas\b|\bto\b|\band\b|\bare\b|\bis\b|\bhave\b|\bgot\b|\bget\b|\byou\b|\bour\b|\byour\b|\bbe\b|\bby\b|\bcan\b|\bmay\b|\bwill\b|\bin\b|\bwhile\b|\bwhen\b|\bwhy\b|\bwith\b|\bor\b|\balso\b|\binto\b|\ban\b|\bthen\b|\bthan\b|\bany\b|\bjob\b|\bfor\b|\ball\b|\bthis\b|\bsuch\b|\bwho\b|\bmust\b|\bboth\b|\bwant\b|\bthat\b|\bnew\b|\byork\b|\bexperience\b|\blooking\b|\bwork\b|\bjoin\b|\bseeking\b|\byears\b|\btheir\b|\bnot\b|\bcall\b|\brequired\b|\employer\b|\bour\b|\bits\b|\bllp\b|\bwhich\b|\baren't\b|\binc\b|\btop\b|\bgpa\b|\bfrom\b|\babout\b|\bplease\b|\bsees\b|\bhas\b|\bposition\b|\bseeks\b|\bbecome\b|\bper\b|\bfull\b|\bout\b|\bwe\b|\bthrough\b|\bhow\b|\bbased\b|\bskills\b|\bprovide\b|\bdescription\b|\bon\b|\brole\b|\bother\b|\bability\b|\bensure\b|\bstrong\b|\bproviding\b|\bsupporting\b|\bassigned\b|\bworking\b|\bincluding\b|\bcommitted\b|\bapply\b|\bnow\b|\benjoy\b|\bup\b|\bno\b|\bavailable\b|\bat\b|\bwww\b|\bcom\b|\bvisit\b|\bmore\b|\blearn\b|\bresponsible\b)/gi, '');

    

    if (kw.length < 3) {
        return;
    }

    
    for (var i = 0; i < tagkeywords.length; i++) {
        if (tagkeywords[i].keyword.toLowerCase() === kw.toLowerCase()) {
            tagkeywords[i].count++;
            return;
        }
    }
    tagkeywords.push({ keyword: kw, count: 1, keywordtype: 1, unicodestring: toUnicode(kw) });

    
}

function registerSpawned(v, exclude) {

    var text = v.toLowerCase().replace(/\–/g, '-');
    var dashtokens = text.split('-');
    for (var dt = 0; dt < dashtokens.length; dt++) {
        var commatokens = $.trim(dashtokens[dt]).split(',');
        for (var ct = 0; ct < commatokens.length; ct++) {

            var ctoken = $.trim(commatokens[ct].replace(/(\(Multiple\sPositions\)|\bF\/T\b|\bFT\b|\(TP\)|\(Tp\)|\(Per Diem\)|\(per diem\)|\(Licensed\))/gi, ''));

            var spacetokens = ctoken.split(' ');
            for (var st = 0; st < spacetokens.length; st++) {

                var stoken = $.trim(spacetokens[st].replace(/(\[|\]|\(|\))/g,''));

                if (stoken.length >= 3) {
                    var excluded = false;
                    for (var j = 0; j < exclude.length; j++) {
                        if ($.trim(exclude[j]).toLowerCase() == stoken || $.trim(exclude[j]).toLowerCase()+'s' == stoken) {
                            excluded = true;
                            break;
                        }
                    }
                    if (!excluded) {
                        registerSpawnedTokenAsType0(stoken);
                    }
                }
            }

        }
    }
}
function registerSpawnedTokenAsType0(v) {
    var kw = $.trim(v);
    kw = v.replace(/([^A-Za-z]|\bthe\b|\ba\b|\bof\b|\bas\b|\bto\b|\band\b|\bare\b|\bis\b|\bhave\b|\bgot\b|\bget\b|\byou\b|\bour\b|\byour\b|\bbe\b|\bby\b|\bcan\b|\bmay\b|\bwill\b|\bin\b|\bwhile\b|\bwhen\b|\bwhy\b|\bwith\b|\bor\b|\balso\b|\binto\b|\ban\b|\bthen\b|\bthan\b|\bany\b|\bjob\b|\bfor\b|\ball\b|\bthis\b|\bsuch\b|\bwho\b|\bmust\b|\bboth\b|\bwant\b|\bthat\b|\bnew\b|\byork\b|\bexperience\b|\blooking\b|\bwork\b|\bjoin\b|\bseeking\b|\byears\b|\btheir\b|\bnot\b|\bcall\b|\brequired\b|\employer\b|\bour\b|\bits\b|\bllp\b|\bwhich\b|\baren't\b|\binc\b|\btop\b|\bgpa\b|\bfrom\b|\babout\b|\bplease\b|\bsees\b|\bhas\b|\bposition\b|\bseeks\b|\bbecome\b|\bper\b|\bfull\b|\bout\b|\bwe\b|\bthrough\b|\bhow\b|\bbased\b|\bskills\b|\bprovide\b|\bdescription\b|\bon\b|\brole\b|\bother\b|\bability\b|\bensure\b|\bstrong\b|\bproviding\b|\bsupporting\b|\bassigned\b|\bworking\b|\bincluding\b|\bcommitted\b|\bapply\b|\bnow\b|\benjoy\b|\bup\b|\bno\b|\bavailable\b|\bat\b|\bwww\b|\bcom\b|\bvisit\b|\bmore\b|\blearn\b|\bresponsible\b)/gi, '');
    
    for (var i = 0; i < tagkeywords.length; i++) {
        if (tagkeywords[i].keyword.toLowerCase() === kw.toLowerCase()) {
            tagkeywords[i].count++;
            return;
        }
    }

    tagkeywords.push({ keyword: kw, count: 1, keywordtype: 0, unicodestring: toUnicode(kw) });
}

function registerSpawnedToken(v) {
    var kw = v;
    for (var i = 0; i < spawnedkeywords.length; i++) {
        if (spawnedkeywords[i].keyword == kw) {
            spawnedkeywords[i].count++;
            return;
        }
    }
    spawnedkeywords.push({ keyword: kw, count: 1 });
}


function displaytags(currentq) {

    var sorted = tagkeywords; //.sort(sortbykeyword);
    
    //find highest score
    var highestscore = 0;
    for (var i = 0; i < sorted.length; i++) {
        if (highestscore < sorted[i].count) {
            highestscore = sorted[i].count;
        }
    }

    

    //Display all tags that have a count > 1 first
    for (var i = 0; i < sorted.length; i++) {
        var relevance = parseFloat(sorted[i].count) / highestscore;
        if (sorted[i].keyword.toLowerCase() != currentq.toLowerCase()) {
            //if (sorted[i].count > 1) {
            $('#keywordtags').append('<div style="display: inline-block; margin: 1px 5px 1px 0; background-color: rgba(255, 221, 119, ' + relevance + ')"><a style="color:' + (sorted[i].keywordtype == 1 ? '#000' : '#000') + '; text-transform:capitalize; font-size: ' + Math.max(10, parseInt(relevance * 24)) + 'pt" href="/jobs/search?q=' + currentq.replace(/\s/g, '+') + '+' + sorted[i].keyword + '">' + sorted[i].keyword + '</a></div>');
            //}
        }
    }
    //$('#keywordtags').append('<br><br>');
    //var sorted = tagkeywords.sort(sortbykeyword);
    //Display all remaining tags where count = 1
    //for (var i = 0; i < sorted.length; i++) {
    //    if (sorted[i].keyword.toLowerCase() != currentq.toLowerCase()) {
    //        if (sorted[i].count == 1) {
    //            $('#keywordtags').append('<div style="display: inline-block; margin: 1px 5px 1px 0;"><a style="color:' + (sorted[i].keywordtype == 1 ? '#000000' : '#555555') + '; text-transform:capitalize; font-size: ' + Math.max(10, parseInt(sorted[i].count / highestscore * 30)) + 'pt" href="/jobs/search?q=' + currentq.replace(/\s/g, '+') + '+' + sorted[i].keyword + '">' + sorted[i].keyword + '</a></div>');
    //        }
    //    }
    //}


    var sorted = tagkeywords.sort(sortbycount);
    var bestcomplement = '';
    for (var i = 0; i < sorted.length; i++) {
        if (sorted[i].count > 1) {
            if (bestcomplement == '' && sorted[i].keyword.toLowerCase().indexOf(currentq.toLowerCase()) == -1) {
                bestcomplement = sorted[i].keyword;
            }
        }
    }

    if (bestcomplement != '') {
        if ($('.bestcomplementtag') != null) {
            $('.bestcomplementtag').html(bestcomplement);
        }
    }

}

function displaykiosktags(scrollable, viewport) {

    var sorted = tagkeywords.sort(sortbycount);

    //var currentqterms = currentq.split(' ');

    var totaltagswidth = 0;

    for (var i = 0; i < sorted.length; i++) {
        //var issearchterm = false;
        //for (var j=0; j < currentqterms.length; j++) {
            //if ($.trim(sorted[i].keyword.toLowerCase()) == $.trim(currentqterms[j].toLowerCase())) {
                //issearchterm = true;
                //break;
            //}
        //}
        if (sorted[i].count>1) {
            $('#' + scrollable).append('<div id="' + scrollable + i + '" style="display: inline-block; margin: 1px 20px 10px 0; color:#fff; text-transform:capitalize; font-size: ' + (Math.min(8 + parseFloat(sorted[i].count), 24)) + 'pt">' + sorted[i].keyword + '</div>');
            $('#' + scrollable + i).press(function () {
                addtag(this);
            });
        }
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

        $('#' + scrollable).css('width', totaltagswidth);

        $("#" + viewport).niceScroll("#" + scrollable, { cursorcolor: "rgba(0,0,0,0)" });
        $("#" + viewport).getNiceScroll().resize();


        $('#' + scrollable).animate({ 'margin-left': '0px', 'opacity': 1 }, 2000);
    }, 500);

}

function displayspawns() {
    return;
    var sorted = spawnedkeywords.sort(sortbykeyword);
    for (var i = 0; i < sorted.length; i++) {
        $('#spawnedkeywords').append('<div style="display: inline-block; margin: 1px 5px 1px 0;"><a style="color:#0055ff; font-size: ' + (Math.min(8 + parseFloat(sorted[i].count), 20)) + 'pt; " href="/jobs/search?q=' + htmlEncode(sorted[i].keyword.replace(/\&/g, '').replace(/\+/g, '').replace(/(\-|\/)/g, ' ').replace(/(\\b-\b|\(|\)|\,)/g, '').replace(/\#/g, '').replace(/\s/g, '+').replace(/\+\+/g, '+').replace(/\+\-\+/g, '+').replace(/\+\–\+/g, '+')) + '">' + sorted[i].keyword + '</a></div>');
    }
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