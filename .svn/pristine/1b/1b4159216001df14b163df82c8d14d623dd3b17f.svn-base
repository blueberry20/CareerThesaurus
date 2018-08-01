var trace = false;
function autoPhoneme(word) {

    var original = word;

    var result = { word: word, ending1: '', ending2: '', ending: '', changed: false, trace: '' };

    var prev = '';
    var broken = false;

    if (traceword == word) {
        trace = true;
    }
    else {
        trace = false;
    }

    tracestring = '';
    trace = true;


    var cnt = 0;
    var pass = 0;
    while (true) {
        
        if (result.word == '') {
            break
        }

        if (cnt++ > 10) {
            alert('yo');
            broken = true;
            break;
        }
        
        var ending = result.ending1 + result.ending2;
        if (!isIncompleteEnding(ending, original)) {
            //alert("Done with " + cnt + " iterations!");
            break;
        }

        

        if (result.word == prev) {
            broken = true;
            break;
        }

        

        //tracestep('Starting at the top', '', result, original);

        prev = result.word;

        //if (pass++ == 0) {
            //result = processAutoPhonemeArray('Autoending', autophonemeednings, result, original);
            if (result.changed) {
                continue;
            }
        //}

        

        result = processAutoPhonemeArray('Quad', quadphthongs, result, original);
        if (result.changed) {
            continue;
        }
        
        result = processAutoPhonemeArray('Triphthong', triphthongs, result, original);
        if (result.changed) {
            continue;
        }
        
        result = processAutoPhonemeArray('Dyphthong', dyphthongs, result, original);
        if (result.changed) {
            continue;
        }
        
        result = processAutoPhonemeArray('Diagraph', diagraphs, result, original);
        if (result.changed) {
            continue;
        }
        
        result = processAutoPhonemeArray('Consonant', consonants, result, original);
        if (result.changed) {
            continue;
        }

        result = processAutoPhonemeArray('Vowel', vowels, result, original);
        if (result.changed) {
            continue;
        }

        
    }


    if (broken) {
        tracestep('<span style="color: red">BROKEN</span>');
        result.ending = result.ending1 + result.ending2;
        result.trace = tracestring;
        return result;
    }
    else {
        result.ending = result.ending1 + result.ending2;
        result.trace = tracestring;
        return result;
    }

}

function isIncompleteEnding(text, fullword) {
    if (text.length == 0)
        return true;

    if (isVowel(text[0], fullword)) {
        if (countSyllables(text).count < 2) {
            return true;
        }
    }
    else if (isConsonant(text[0], fullword)) {
        if (countSyllables(text).count < 1) {
            return true;
        }
    }

    return false;
}

function getHighlightByLabel(label) {
    switch (label) {
        case 'Autoending':
            return 'rgba(0,255,0,0.3)';
        case 'Consonant':
            return 'rgba(128,64,0,0.3)';
        case 'Vowel':
            return 'rgba(0,128,255,0.3)';
        case 'Exception':
            return 'rgba(255,0,0,0.5)';
    }
}
function processAutoPhonemeArray(label, array, result, originalword) {
    
    result.changed = false;

    var phoneme = '';

    var soloelementexists = false;
    for (var i = 0; i < array.length; i++) {
        if (array[i].solo != null) {
            soloelementexists = true;
        }
    }

    try {
        for (var i = 0; i < array.length; i++) {

            if (soloelementexists && !array[i].solo) {
                continue;
            }

            if (soloelementexists) {
                //tracestep('processing solo element: ' + array[i].code);
            }

            if (endsWith(result.word, array[i].code)) {

                tracestep('Ends with '  + label + ' '  + array[i].code);
                
                if (label == 'Autoending') {
                    tracestep('<span style="background-color: ' + getHighlightByLabel(label) + '">' + label + ' ' + array[i].code + '[' + array[i].phonetic + ']</span>');
                }

                if (result.ending2 == '') {
                    
                    if (array[i].phonetic == null) {
                        tracestep(array[i].code + ' has a null phonetic');
                    }
                    
                    var translated = translatePhonetic(result.word, array[i].phonetic);
                    
                    result.ending2 = translated;
                    result.word = result.word.substring(0, result.word.length - array[i].code.length);
                    result.changed = true;
                }
                else if (result.ending1 == '' && isIncompleteEnding(result.ending2, originalword)) {
                    var exception = processExceptions(array[i], '', result.ending1 + result.ending2);
                    if (array[i].phonetic == null) {
                        tracestep(array[i].code + ' has a null phonetic');
                    }
                    if (exception != array[i].phonetic) {
                        tracestep('<span style="background-color: rgba(255,0,0,0.3)">(!) ' + array[i].code + ' sounds like ' + exception + ' not ' + array[i].phonetic + '</span>');
                    }

                    var glottal = false;
                    if (array[i].code.length == 1 && exception == result.ending2[0]) {
                        glottal = true;
                    }

                    if (!glottal) {
                        result.ending1 = exception;
                        result.word = result.word.substring(0, result.word.length - array[i].code.length);
                        result.changed = true;
                        tracestep(exception + ' + ' + result.ending2 + ' = ' + exception + result.ending2);
                    }
                    else {
                        result.word = result.word.substring(0, result.word.length - array[i].code.length);
                        tracestep('Dropped double ' + exception );
                    }
                }
                else if (isIncompleteEnding(result.ending1 + result.ending2, originalword)) {
                    var phonetic = processExceptions(array[i], '', result.ending1 + result.ending2);
                    if (array[i].phonetic == null) {
                        tracestep(array[i].code + ' has a null phonetic');
                    }
                    
                    if (phonetic != array[i].phonetic) {
                        tracestep('> Phonetic exception applied for \'' + array[i].code + '\' changed \'' + array[i].phonetic + '\' to \'' + phonetic + '\'', label, result, originalword);
                    }

                    var glottal = false;
                    if (array[i].code.length == 1 && phonetic == result.ending1[0]) {
                        glottal = true;
                    }

                    if (!glottal) {
                        result.ending1 = phonetic + result.ending1;
                        result.word = result.word.substring(0, result.word.length - array[i].code.length);
                        result.changed = true;
                        tracestep('Ending was incomplete, augmented the ending by adding \'' + array[i].code + '(' + array[i].phonetic + ')' + '\'', label, result, originalword);
                    }
                    else {
                        result.word = result.word.substring(0, result.word.length - array[i].code.length);
                        result.changed = true;
                        tracestep('Glottal ' + phonetic + ' skipped', label, result, originalword);
                    }

                }

                if (result.word.length > 0) {
                    if (!isConsonant(result.word[result.word.length - 1], result.word) && !isVowel(result.word[result.word.length - 1], result.word)) {
                        result.word = result.word.substring(0, result.word.length - 1);
                        result.changed = true;
                    }
                }

                break;
            }
        }

    }
    catch (ex) {
        alert('processAutoPhonemeArray():\n\n' + ex.message);
    }
    return result;
}

var tracestring='';
function tracestep(message, label, result, originalword) {
    
    if (trace) {
        if (false && label != null && result != null && originalword != null) {
            tracestring += message + '\n\n' + result.word + (result.ending1 + result.ending2 != '' ? '[' : '') + result.ending1 + (result.ending1 != '' ? '|' : '') + result.ending2 + (result.ending1 + result.ending2 != '' ? ']' : '') + '\n\n' + originalword + "; ";
        }
        else {
            tracestring += message + "; ";
        }
    }
}

function processExceptions(item, prestring, poststring) {

    try {
        for (var i = 0; i < phoneticexceptions.length; i++) {
            exception = phoneticexceptions[i];
            if (exception.code == item.code) {
                
                if (exception.followedby != '') {
                    var testfailed = false;
                    for (var j = 0; j < exception.followedby.length; j++) {

                        if (j < poststring.length) {
                            switch (exception.followedby[j]) {
                                case 'V':
                                    if (!isVowel(poststring[j], poststring)) {
                                        testfailed = true;
                                    }
                                    break;
                                case 'C':
                                    if (!isConsonant(poststring[j], poststring)) {
                                        testfailed = true;
                                    }
                                    break;
                                default:
                                    if (poststring[j] != exception.followedby[j]) {
                                        testfailed = true;
                                    }
                                    break;
                            }
                        }
                        else {
                            testfailed = true;
                            break;
                        }
                        if (testfailed) {
                            break;
                        }
                    }
                    if (!testfailed) {
                        return exception.phonetic;
                    }
                }
            }
        }
    }
    catch (ex) {
        alert('processExceptions():\n\n' + ex.message);
    }
    return item.phonetic;
}

//Phonetic encoding options:
//V = case insensitive vowel
//C = case insensitive consonant
//^ = upper case vowel which identifies an open syllable vowel
var autophonemeednings = [

    
//5 letter codes
    { code: "angue", phonetic: "enk" },
    { code: "aught", phonetic: "ot" },

    { code: "blood", phonetic: "lat" },
    { code: "break", syllables: 1, phonetic: "breyk" },

    { code: "eague", phonetic: "ik" },
    { code: "eight", phonetic: "eyt" },

    { code: "ongue", phonetic: "ank" },
    { code: "orgue", phonetic: "ork" },
    { code: "ought", syllables: 1, phonetic: "ot" },

    { code: "reast", phonetic: "est" },
    { code: "rouse", phonetic: "us" },

    { code: "ssion", phonetic: "shan" },

    { code: "watch", phonetic: "och" },
    { code: "where", syllables: 1, phonetic: "uer" },

    { code: "Vsion", phonetic: "zhin" },
    { code: "Csion", phonetic: "shan" },

//4 letter codes
    {code: "adge", phonetic: "adzh" },
    { code: "ague", phonetic: "eyk" },
    { code: "aist", phonetic: "eyst" },
    { code: "ance", phonetic: "ens" },
    { code: "aque", phonetic: "eyk" },
    { code: "atch", phonetic: "aech" },

    { code: "bove", syllables: 1, phonetic: "baf" },

    { code: "cher", phonetic: "cha" },
    { code: "cial", phonetic: "sho" },
    { code: "cian", phonetic: "shan" },
    { code: "cier", phonetic: "sia" },
    { code: "cion", phonetic: "shan" },
    { code: "cove", syllables: 1, phonetic: "ouv" },
    { code: "cult", phonetic: "kalt" },

    { code: "eafy", phonetic: "fi" },
    { code: "east", phonetic: "ist" },
    { code: "eave", phonetic: "if" },
    { code: "eefy", phonetic: "fi" },
    { code: "edge", phonetic: "edzh" },
    { code: "eign", phonetic: "eyn" },
    { code: "ence", phonetic: "ens" },

    { code: "fogy", syllables: 1, phonetic: "gi" },
    { code: "fier", phonetic: "ya" },

    { code: "gage", phonetic: "eydzh" },
    { code: "gger", phonetic: "ga" },

    { code: "gual", syllables: 1, phonetic: "guo" },

    { code: "hymn", syllables: 1, phonetic: "him" },

    { code: "iate", phonetic: "ieyt" },
    { code: "iest", phonetic: "ist" },
    { code: "ieve", phonetic: "if" },
    { code: "ight", phonetic: "ayt" },
    { code: "igue", phonetic: "ik" },
    { code: "ique", phonetic: "ik" },
    { code: "isfy", phonetic: "fay" },

    { code: "less", phonetic: "les" },
    { code: "line", phonetic: "ayn" },

    { code: "mber", phonetic: "ma" },
    { code: "ment", phonetic: "mant" },
    { code: "most", phonetic: "oust" },

    { code: "ness", phonetic: "nis" },

    { code: "oard", phonetic: "ort" },
    { code: "oast", phonetic: "oust" },
    { code: "ogue", phonetic: "ouk" },
    { code: "onto", syllables: 1, phonetic: "antu" },
    { code: "oofy", phonetic: "fi" },
    { code: "ophy", phonetic: "afi" },
    { code: "otch", phonetic: "och" },
    { code: "ouse", phonetic: "aus" },
    { code: "ound", syllables: 1, phonetic: "aunt" },
    { code: "ount", syllables: 1, phonetic: "aunt" },

    { code: "pher", phonetic: "fa" },

    { code: "qual", syllables: 1, phonetic: "kuo" },
    { code: "quer", phonetic: "ka" },

    { code: "rage", phonetic: "eydzh" },

    { code: "sian", phonetic: "shan" },

    
    { code: "some", phonetic: "sam" },
    { code: "sher", phonetic: "sha" },

    { code: "ther", phonetic: "tha" },
    { code: "tion", phonetic: "shan" },
    { code: "tian", phonetic: "shan" },
    { code: "tial", phonetic: "sho" },
    { code: "tove", syllables: 1, phonetic: "ouv" },

    { code: "ucky", phonetic: "ki" },
    { code: "udge", phonetic: "adzh" },
    { code: "ungy", syllables: 2, phonetic: "dzhi" },

    { code: "year", phonetic: "ye" },

    { code: "Cger", phonetic: "ger" },
    { code: "Cier", phonetic: "ia" },
    { code: "Vble", phonetic: "bo" },
    { code: "Vger", phonetic: "jer" },
    { code: "Vnge", syllables: 2, phonetic: "Vndzh" },



//3 letter codes
    {code: "ack", phonetic: "aek" },
    { code: "age", phonetic: "idzh" },
    { code: "ain", phonetic: "eyn" },
    { code: "air", syllables: 1, phonetic: "ayr" },
    { code: "all", phonetic: "ol" },
    { code: "ant", phonetic: "int" },
    { code: "and", phonetic: "aent" },
    { code: "ard", phonetic: "art" },
    { code: "ark", syllables: 1, phonetic: "ark" },
    { code: "ass", phonetic: "aes" },
    { code: "ast", phonetic: "aest" },
    { code: "ate", phonetic: "eyt" },

    { code: "ber", phonetic: "ba" },
    { code: "bey", syllables: 1, phonetic: "bey" },
    { code: "ble", phonetic: "bo" },

    { code: "cal", phonetic: "ko" },
    { code: "can", syllables: 1, phonetic: "kin" },
    { code: "cer", phonetic: "sa" },
    { code: "chy", syllables: 1, phonetic: "chi" },

    { code: "ded", phonetic: "ded" },
    { code: "der", phonetic: "da" },
    { code: "dgy", syllables: 2, phonetic: "dzhi" },
    { code: "dom", phonetic: "dam" },

    { code: "ead", syllables: 1, phonetic: "aet" },
    { code: "eer", phonetic: "ia" },
    { code: "ent", phonetic: "ent" },
    { code: "est", phonetic: "est" },

    { code: "fer", phonetic: "fa" },
    { code: "ful", phonetic: "ful" },

    { code: "gen", phonetic: "dzhin" },
    { code: "gey", syllables: 2, phonetic: "dzhi" },

    { code: "ial", phonetic: "io" },
    { code: "ide", phonetic: "ayt" },
    { code: "ied", phonetic: "ayt2" },
    { code: "ign", syllables: 1, phonetic: "ayn" },
    { code: "igh", syllables: 1, phonetic: "ay" },
    { code: "ine", phonetic: "in" },
    { code: "ing", phonetic: "in" },
    { code: "ish", phonetic: "ish" },
    { code: "ism", phonetic: "ism" },
    { code: "ist", phonetic: "ist" },
    { code: "ive", phonetic: "if" },
    { code: "ize", phonetic: "ays" },

    { code: "jer", phonetic: "dzha" },
    { code: "ker", phonetic: "ka" },

    { code: "lay", phonetic: "ley" },

    { code: "led", phonetic: "lt" },
    { code: "ler", phonetic: "la" },
    { code: "let", phonetic: "let" },


    { code: "man", phonetic: "man" },
    { code: "mer", phonetic: "ma" },


    { code: "nal", phonetic: "no" },
    { code: "ner", phonetic: "na" },
    { code: "new", syllables: 1, phonetic: "nu" },

    { code: "ock", phonetic: "ak" },
    { code: "ode", syllables: 1, phonetic: "out" },
    { code: "oft", syllables: 1, phonetic: "oft" },
    { code: "one", phonetic: "oun" },
    { code: "ong", syllables: 1, phonetic: "ang" },
    { code: "ood", phonetic: "ut" },
    { code: "ord", syllables: 1, phonetic: "ort" },
    { code: "ore", syllables: 1, phonetic: "or" },
    { code: "ork", syllables: 1, phonetic: "ork" },
    { code: "orn", syllables: 1, phonetic: "orn" },

    { code: "ous", phonetic: "as" },
    { code: "oud", syllables: 1, phonetic: "aut" },
    { code: "out", phonetic: "aut" },

    { code: "per", phonetic: "pa" },
    { code: "phy", syllables: 1, phonetic: "fi" },

    { code: "rer", phonetic: "ra" },
    { code: "rgy", syllables: 2, phonetic: "dzhi" },

    { code: "ser", phonetic: "sa" },
    { code: "sia", syllables: 1, phonetic: "zha" },
    { code: "shy", syllables: 1, phonetic: "shi" },

    { code: "tal", phonetic: "to" },
    { code: "ted", phonetic: "it" },
    { code: "ter", phonetic: "ta" },
    { code: "thy", syllables: 1, phonetic: "thi" },
    { code: "tor", phonetic: "ta" },

    { code: "ual", syllables: 1, phonetic: "uo" },
    { code: "ude", phonetic: "ut" },
    { code: "uer", phonetic: "ua" },
    { code: "ung", phonetic: "ank" },
    { code: "ure", phonetic: "chor" },

    { code: "ven", phonetic: "ven" },
    { code: "ver", phonetic: "va" },
    { code: "vey", syllables: 1, phonetic: "vey" },

    { code: "war", syllables: 1, phonetic: "uo" },
    { code: "wer", phonetic: "ua" },

    { code: "xia", syllables: 1, phonetic: "ksia" },

    { code: "yer", phonetic: "ya" },
    { code: "yon", syllables: 1, phonetic: "yin" },
    { code: "yze", phonetic: "ays" },

    { code: "zer", phonetic: "za" },

    { code: "Cel", syllables: 1, phonetic: "Co" },
    { code: "Cey", syllables: 1, phonetic: "Ci" },
    { code: "Cfy", phonetic: "fi" },
    { code: "Cgy", syllables: 2, phonetic: "gi" },
    { code: "Cia", syllables: 2, phonetic: "Cia" },
    { code: "Vce", syllables: 1, phonetic: "^s" },
    { code: "Vgy", syllables: 2, phonetic: "dzhi" },

    { code: "aCC", syllables: 1, phonetic: "aCC" },
    { code: "oCC", syllables: 1, phonetic: "oCC" },
    { code: "VCe", syllables: 1, phonetic: "^C" },
    { code: "VCy", syllables: 1, phonetic: "VCi" },




//2 letter codes
    {code: "ac", syllables: 1, phonetic: "aek" },
    { code: "ag", syllables: 1, phonetic: "aeg" },
    { code: "ah", syllables: 1, phonetic: "a" },
    { code: "al", phonetic: "o" },
    { code: "ay", syllables: 1, phonetic: "aey" },

    { code: "ca", syllables: 1, phonetic: "ka" },
    { code: "cy", phonetic: "see" },

    { code: "er", phonetic: "a" },
    { code: "et", syllables: 1, phonetic: "it" },
    { code: "ey", syllables: 1, phonetic: "i" },

    { code: "fy", phonetic: "fay" },

    { code: "ic", phonetic: "ik" },
    { code: "iy", syllables: 1, phonetic: "iy" },

    { code: "le", phonetic: "l" },
    { code: "ly", phonetic: "li" },

    { code: "my", syllables: 1, phonetic: "mi" },

    { code: "oy", syllables: 1, phonetic: "oy" },

    { code: "ry", phonetic: "ri" },

    { code: "se", phonetic: "s" },

    { code: "ty", phonetic: "ti" },

    { code: "um", phonetic: "am" },
    { code: "uy", syllables: 1, phonetic: "ay" },

    { code: "xy", phonetic: "ksi" },

    { code: "Ca", syllables: 1, phonetic: "Ca" },
    { code: "Co", syllables: 1, phonetic: "C^" },
    { code: "Cy", syllables: 1, phonetic: "Ci" },
    { code: "Vs", syllables: 1, phonetic: "^s" },
];

var phoneticexceptions = [
    { code: "o", followedby: "CV", phonetic: "ou" },
    { code: "o", followedby: "CC", phonetic: "o" },
    { code: "d", followedby : "V", phonetic: "d" }
];

var traceword = '';

var yrules = [
    { code: "|y", type: "Consonant", phonetic: "y" },
    { code: "|by", type: "Diphthong", phonetic: "ay" },
    { code: "|by|", type: "Diphthong", phonetic: "ay" },

    { code: "dyn", type: "Diphthong", phonetic: "ay" },
    { code: "yal", type: "Consonant", phonetic: "y" },
    { code: "yee", type: "Consonant", phonetic: "y" },
    { code: "yke", type: "Diphthong", phonetic: "ay" },
    { code: "yte", type: "Diphthong", phonetic: "ay" },
    
    { code: "ay", type: "Consonant", phonetic: "y" },
    { code: "oy", type: "Consonant", phonetic: "y" },
    { code: "uy", type: "Consonant", phonetic: "y" },
    { code: "ye", type: "Diphthong", phonetic: "ay" },
    { code: "yo", type: "Vowel", phonetic: "i" },

    { code: "CCey", type: "Vowel", phonetic: "i" },
    { code: "VCey", type: "Vowel", phonetic: "i" },
    { code: "Cey", type: "Consonant", phonetic: "y" },
    { code: "cyC", type: "Diphthong", phonetic: "ay" },
    { code: "ryC", type: "Diphthong", phonetic: "ay" },
    { code: "CyC", type: "Vowel", phonetic: "i" },
    { code: "VyC", type: "Consonant", phonetic: "y" },
    { code: "Vys", type: "Consonant", phonetic: "y" },
    { code: "VyV", type: "Consonant", phonetic: "y" },

    { code: "Cy", type: "Vowel", phonetic: "i" },
    { code: "Vy", type: "Vowel", phonetic: "i" },

];
