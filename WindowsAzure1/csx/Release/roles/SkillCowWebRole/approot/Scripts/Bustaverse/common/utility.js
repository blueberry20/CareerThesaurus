function endsWith(str, suffix) {

    if (str.length < suffix.length) {
        return false;
    }

    if (suffix.indexOf('C') >= 0 || suffix.indexOf('V') >= 0) {
        
        //tracestep('About to match ending of ' + str + ' to code ' + suffix);

        var encodingtried = false;
        var encodingfailed = false;
        var lettermatchfailed = false;

        var l = str.length-1;
        for (var j = suffix.length - 1; j >= 0; j--) {

            var code = suffix[j];
            var letter = str[l - (suffix.length - 1 - j)];
            var isv = isVowel(letter, str, 'endswith');
            var isc = isConsonant(letter, str, 'endswith');

            if (code == 'C') {
                encodingtried = true;
                if (isv) {
                    //tracestep('> Endmatching: j=' + j + '; code=' + code + '; letter=' + letter + '; isc=' + isc + '; isv=' + isv + '; match FAILED code is C but letter is ' + letter);
                    encodingfailed = true;
                    break;
                }
                else {
                    //tracestep('> Endmatching: j=' + j + '; code=' + code + '; letter=' + letter + '; isc=' + isc + '; isv=' + isv + '; match SUCCESS code is C = ' + letter);
                    
                }
            }
            else if (code == 'V') {
                encodingtried = true;
                if (isc) {
                    //tracestep('> Endmatching: j=' + j + '; code=' + code + '; letter=' + letter + '; isc=' + isc + '; isv=' + isv + '; match FAILED code is V but letter is ' + letter);
                    encodingfailed = true;
                    break;
                }
                else {
                    //tracestep('> Endmatching: j=' + j + '; code=' + code + '; letter=' + letter + '; isc=' + isc + '; isv=' + isv + '; match SUCCESS code is V = ' + letter);
                    
                }
            }
            else {
                if (letter != code) {
                    //tracestep('> Endmatching: j=' + j + '; code=' + code + '; letter=' + letter + '; isc=' + isc + '; isv=' + isv + '; match FAILED ' + code + '!=' + letter);
                    lettermatchfailed = true;
                    break;
                }
                else {
                    //tracestep('> Endmatching: j=' + j + '; code=' + code + '; letter=' + letter + '; isc=' + isc + '; isv=' + isv + '; match SUCCESS ' + code + ' ==' + letter);
                    
                }
            }
        }

        return (!encodingtried || (encodingtried && !encodingfailed)) && !lettermatchfailed;
    }
    else {
        
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
    }
}
function translatePhonetic(str, suffix) {
    
    if (suffix.indexOf('C') >= 0 || suffix.indexOf('V') >= 0) {
    
        var retval = '';
            
        var encodingtried = false;
        var encodingfailed = false;
        var lettermatchfailed = false;

        var l = str.length - 1;
        var offset = 0;
        var done = false;

        for (var j = suffix.length - 1; j >= 0; j--) {

            var code = suffix[j];

            while(true) {

                if (l - (suffix.length - 1 - j - offset) < 0) {
                    done = true;
                    break;
                }

                var letter = str[l - (suffix.length - 1 - j) - offset];

                var isv = isVowel(letter, str);
                var isc = isConsonant(letter, str);

                if (code == 'C' && isc) {

                    tracestep(letter + (retval.length > 0 ? " + " + retval + " = " + letter + retval : ""));
                    retval = letter + retval;

                    break;
                }
                else if (code == 'V' && isv) {

                    var thevowel = getVowel(letter);
                    tracestep(thevowel.phonetic + (retval.length > 0 ? " + " + retval + " = " + thevowel.phonetic + retval : ""));
                    retval = thevowel.phonetic + retval;
                    
                    break;
                }
                else if (code == '^' && isv) {

                    var thevowel = getVowel(letter.toUpperCase());
                    tracestep(thevowel.phonetic + (retval.length > 0 ? " + " + retval + " = " + thevowel.phonetic + retval : ""));
                    retval = thevowel.phonetic + retval;
                    
                    break;
                }
                else {
                    if (code == 'C' || code == 'V' || code=='^') {
                        offset++;
                    }
                    else {
                        if (isv) {
                            var thevowel = getVowel(letter);
                            tracestep(thevowel.phonetic + (retval.length > 0 ? " + " + retval + " = " + thevowel.phonetic + retval : ""));
                            retval = thevowel.phonetic + retval;
                        }
                        else if (isc) {
                            tracestep(letter + (retval.length > 0 ? " + " + retval + " = " + letter + retval : ""));
                            retval = suffix[j] + retval;
                        }
                        break;
                    }
                }
            }
            if (done) {
                tracestep('ok');
                break;
            }
        }

        return retval;
    }
    else {
        return suffix;
    }

}

function isVowel(c, context, caller) {
    if (c == null) {
        return false;
    }
    if (context == null) {
        alert('missing context in isVowel');
    }
    if (c == 'y') {
        return isYaVowelIn(context);
    }
    else {
        var letters = "aeiou";
        if (letters.indexOf(c.toLowerCase()) >= 0) {
            return true;
        }
        else {
            return false;
        }
    }
}
function isConsonant(c, context) {
    if (c == null) {
        return false;
    }
    if (context == null) {
        alert('missing context in isConsonant');
    }
    if (c == 'y') {
        return isYaConsonantIn(context);
    }
    else {
        var letters = "bcdfghjklmnpqrstvwxz";
        if (letters.indexOf(c.toLowerCase()) >= 0) {
            return true;
        }
        else {
            return false;
        }
    }
    return false;
}

function isYaVowelIn(context) {
    for (var i = 0; i < yrules.length; i++) {
        var regexpstring = yrules[i].code.replace(/C/g, '[bcdfghjklmnpqrstvwxz]').replace(/V/g, '[aeiou]').replace(/\|/g, '\\b');
        var regex = RegExp(regexpstring,'g');
        if (regex.test(context)) {
            return yrules[i].type != 'Consonant';
        }
    }
    return false;
}
function isYaConsonantIn(context) {
    for (var i = 0; i < yrules.length; i++) {
        var regexpstring = yrules[i].code.replace(/C/g, '[bcdfghjklmnpqrstvwxz]').replace(/V/g, '[aeiou]').replace(/\|/g, '\\b');
        var regex = RegExp(regexpstring, 'g');
        if (regex.test(context)) {
            return yrules[i].type == 'Consonant';
        }
    }
    return false;
}
