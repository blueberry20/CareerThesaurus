function countSyllables(word) {

    var count = 0;

    word = $.trim(word.toLowerCase().replace(/(\.|\,|\:|\;|\(|\)|\+|\=|\?|\!|\/|~|\"|\$|[0-9]|\[|\])/g, ' '));

    var tokens = new Array();
    var spacetokens = word.split(' ');
    for (var i = 0; i < spacetokens.length; i++) {
        var hyphentokens = spacetokens[i].split('-');

        for (var j = 0; j < hyphentokens.length; j++) {
            tokens.push(hyphentokens[j]);

        }
    }
    
    var mask = '';
    for (var i = 0; i < tokens.length; i++) {
        var result = processComplexes(tokens[i]);
        count += result.count;

        result = processEds(result.word);
        count += result.count;

        result = processEndings(result.word);
        count += result.count;

        result = processYs(result.word);
        count += result.count;

        result = processQuadphthongs(result.word);
        count += result.count;

        result = processTriphthongs(result.word);
        count += result.count;

        result = processDyphthongs(result.word);
        count += result.count;

        result = processVowels(result.word);
        count += result.count;

        mask += result.word + ' ';
    }



    return { word: word, mask: $.trim(mask), count: count };
}

function processYs(word) {
    var count = 0;

    while (word.indexOf('y') >= 0) {
        var yindex = word.indexOf('y');
        if (yindex < word.length - 1) {
            if (!isVowel(word[yindex + 1], word)) {
                word = word.replace('y', "_");
                count += 1;
            }
            else {
                word = word.replace('y', "_");
            }
        }
        else {
            word = word.replace('y', "_");
        }
    }

    return { word: word, count: count };
}

function processComplexes(word) {
    var count = 0;
    for (var i = 0; i < syllablecomplexes.length; i++) {
        while (word.indexOf(syllablecomplexes[i].code) >= 0) {
            word = word.replace(syllablecomplexes[i].code, "___");
            count += syllablecomplexes[i].syllables;
        }
    }
    return { word: word, count: count };
}

function processQuadphthongs(word) {
    var count = 0;
    for (var i = 0; i < quadphthongs.length; i++) {
        while (word.indexOf(quadphthongs[i].code) >= 0) {
            word = word.replace(quadphthongs[i].code, "*");
            count += quadphthongs[i].syllables;
        }
    }
    return { word: word, count: count };
}
function processTriphthongs(word) {
    var count = 0;
    for (var i = 0; i < triphthongs.length; i++) {
        while (word.indexOf(triphthongs[i].code) >= 0) {
            word = word.replace(triphthongs[i].code, "*");
            count += triphthongs[i].syllables;
        }
    }
    return { word: word, count: count };
}
function processDyphthongs(word) {
    var count = 0;
    for (var i = 0; i < dyphthongs.length; i++) {
        while (word.indexOf(dyphthongs[i].code) >= 0) {
            word = word.replace(dyphthongs[i].code, "*");
            count += dyphthongs[i].syllables;
        }
    }
    return { word: word, count: count };
}
function processVowels(word) {
    var count = 0;
    for (var i = 0; i < vowels.length; i++) {
        while (word.indexOf(vowels[i].code) >= 0) {
            word = word.replace(vowels[i].code, "*");
            count += vowels[i].syllables;
        }
    }
    return { word: word, count: count };
}

function processEds(word) {

    var original = word;

    var count = 0;

    if (word.length >= 4 && endsWith(word, 'ed')) {
        var l = word.length - 1;
        if (word[l - 2] == 'd' || word[l - 2] == 't' ||
            (!isVowel(word[l - 2], word) &&
             !isVowel(word[l - 3], word) &&
             !(word[l - 3] == 'c' && word[l - 2] == 'h') &&
             !(word[l - 3] == 't' && word[l - 2] == 'h')
            )
        ) {
            word = word.substring(0, word.length - 2);
            count += 1;
        }
        else {
            word = word.substring(0, word.length - 2);
            count += 0;
        }
    }

    return { word: word, count: count };
}

function processEndings(word) {

    var original = word;

    var count = 0;

    var passes = 0;
    var removedending = false;

    while (passes == 0 || removedending) {
        removedending = false;

        for (var i = 0; i < syllableendings.length; i++) {
            while (endsWith(word, syllableendings[i].code)) {
                //alert(word);
                word = word.substring(0, word.length - syllableendings[i].code.length);
                //alert(word);
                removedending = true;
                count += syllableendings[i].syllables;
            }
        }

        //E at the end
        var l = word.length - 1;
        if (word.length >= 3 && word[l] == "e") {
            if (!isVowel(word[l - 1], word) && (isVowel(word[l - 2], word) || word[l - 2] == 'y')) {

                if (false && word.length >= 4 && (isVowel(word[l - 3], word) || word[l - 3] == 'y')) {
                    //alert(word);
                    //word = word.substring(0, word.length - 4);
                    //alert(word);
                }
                else {
                    word = word.substring(0, word.length - 3);
                }
                
                removedending = true;
                count += 1;
            }
        }

        
        passes++;
    }

    return { word: word, count: count };
}

var syllablecomplexes = [
        { code: "business", syllables: 2 },
        { code: "argue", syllables: 2 },
        { code: "segue", syllables: 2 },
        { code: "bbq", syllables: 3 }
    ];

var syllableendings = [

        { code: "guity", syllables: 3 },
        { code: "cally", syllables: 1 },
        { code: "cause", syllables: 1 },
        { code: "ledge", syllables: 1 },
        { code: "ieve", syllables: 1 },
        { code: "iate", syllables: 2 },
        { code: "ment", syllables: 1 },
        { code: "less", syllables: 1 },
        { code: "ness", syllables: 1 },
        { code: "sian", syllables: 1 },
        { code: "ence", syllables: 1 },
        { code: "tion", syllables: 1 },
        
        { code: "ing", syllables: 1 },
        { code: "ize", syllables: 1 },
        { code: "yze", syllables: 1 },
        { code: "que", syllables: 0 },
        { code: "gue", syllables: 0 },
        
        { code: "ial", syllables: 1 },
        { code: "ism", syllables: 1 },
        { code: "let", syllables: 1 },
        { code: "dom", syllables: 1 },
        { code: "ded", syllables: 1 },

        { code: "nce", syllables: 0 },
        { code: "ies", syllables: 1 },

        { code: "ion", syllables: 1 },
        { code: "ian", syllables: 1 },

        { code: "sce", syllables: 0 },

        { code: "che", syllables: 0 },
        { code: "chy", syllables: 1 },

        { code: "Cve", syllables: 1 },
        { code: "Vve", syllables: 0 },

        { code: "es", syllables: 0 },

        { code: "ue", syllables: 1 },

        { code: "by", syllables: 1 },
        { code: "cy", syllables: 1 },

        { code: "dy", syllables: 1 },
        { code: "fy", syllables: 1 },
        { code: "gy", syllables: 1 },
        { code: "hy", syllables: 1 },
        { code: "jy", syllables: 1 },
        { code: "ky", syllables: 1 },
        { code: "ly", syllables: 1 },
        { code: "my", syllables: 1 },
        { code: "ny", syllables: 1 },
        { code: "py", syllables: 1 },
        { code: "ry", syllables: 1 },
        { code: "sy", syllables: 1 },
        { code: "ty", syllables: 1 },
        
        { code: "vy", syllables: 1 },
        { code: "wy", syllables: 1 },
        { code: "xy", syllables: 1 },
        { code: "zy", syllables: 1 }

    ];
