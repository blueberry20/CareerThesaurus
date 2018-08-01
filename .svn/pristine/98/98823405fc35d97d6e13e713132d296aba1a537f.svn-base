function findAccentedSyllable(word) {
    var count = 0;
    word = $.trim(word.toLowerCase().replace(/(\.|\,|\:|\;|\(|\)|\+|\=|\?|\!|\/|~|\"|\$|[0-9]|\[|\])/g, ' '));
    var mask = '';
    var result = processComplexes(word);
    return { word: word, direction: -1, index: 0 };
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
    for (var i = 0; i < complexes.length; i++) {
        while (word.indexOf(complexes[i].code) >= 0) {
            word = word.replace(complexes[i].code, "___");
            count += complexes[i].syllables;
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

        for (var i = 0; i < endings.length; i++) {
            while (endsWith(word, endings[i].code)) {
                //alert(word);
                word = word.substring(0, word.length - endings[i].code.length);
                //alert(word);
                removedending = true;
                count += endings[i].syllables;
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

function isVowel(c) {
    var vowels = "aeiou";
    if (vowels.indexOf(c) >= 0) {
        return true;
    }
    else {
        return false;
    }
}

var complexes = [
        { code: "business", syllables: 2 },
        { code: "argue", syllables: 2 },
        { code: "segue", syllables: 2 },
        { code: "bbq", syllables: 3 }
    ];

var endings = [

        { code: "guity", syllables: 3 },
        { code: "cally", syllables: 1 },
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

var vowels = [
        { code: "a", syllables: 1 },
        { code: "e", syllables: 1 },
        { code: "i", syllables: 1 },
        { code: "o", syllables: 1 },
        { code: "u", syllables: 1 }
    ];
var dyphthongs = [
        { code: "aa", syllables: 1 },
        { code: "ae", syllables: 1 },
        { code: "ai", syllables: 1 },
        { code: "ao", syllables: 1 },
        { code: "au", syllables: 1 },
        { code: "aw", syllables: 1 },

        { code: "ea", syllables: 1 },
        { code: "ee", syllables: 1 },
        { code: "ei", syllables: 1 },
        { code: "eu", syllables: 1 },

        { code: "ie", syllables: 1 },

        { code: "oa", syllables: 1 },
        { code: "oe", syllables: 1 },
        { code: "oi", syllables: 1 },
        { code: "oo", syllables: 1 },
        { code: "ou", syllables: 1 },

        { code: "uo", syllables: 1 },
        { code: "ue", syllables: 1 },
        { code: "uu", syllables: 1 },
        { code: "ui", syllables: 1 }

    ];

var triphthongs = [
        { code: "que", syllables: 1 },
        { code: "qua", syllables: 1 },
        { code: "qui", syllables: 1 },
        { code: "quo", syllables: 1 },
        { code: "gue", syllables: 1 },
        { code: "gua", syllables: 1 },
        { code: "gui", syllables: 1 },
        { code: "guo", syllables: 1 },
        { code: "eou", syllables: 1 },
        { code: "iou", syllables: 1 },
        { code: "eau", syllables: 1 }
    ];

var quadphthongs = [
        { code: "tion", syllables: 1 },
        { code: "sion", syllables: 1 },
        { code: "quai", syllables: 1 }

    ];