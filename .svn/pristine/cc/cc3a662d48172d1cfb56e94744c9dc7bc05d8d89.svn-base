
var freezetimer;

function findRhyme(word) {

    var count = 0;

    word = $.trim(word.toLowerCase().replace(/(\.|\,|\:|\;|\(|\)|\+|\=|\?|\!|\/|~|\"|\$|[0-9]|\[|\])/g, ' '));

    for (var i = 0; i < exceptions.length; i++) {
        if (word == exceptions[i].word) {
            return { word: word, ruletype: "word", rule: exceptions[i].word, phoneme: exceptions[i].phoneme, translation: exceptions[i].phoneme, trace : '' };
        }
    }

    //for (var i = 0; i < rhymeendings.length; i++) {
        //if (endsWith(word, rhymeendings[i].code)) {
        //    return { word: word, ruletype: "ending", rule: rhymeendings[i].code, phoneme: rhymeendings[i].phoneme, translation: rhymeendings[i].phoneme, trace: '' };
        //}
    //}

    var tokens = word.split(' ');
    var lastword = tokens[tokens.length - 1];

    //if (lastword == null || lastword == '') {
    //    alert('problem');
    //}

    //freezetimer = setTimeout(function (word) {
    //    alert(word + ' is taking more than 3 seconds');
    //}, 3000, word);
    var autorhyme = autoPhoneme(lastword);
    //clearTimeout(freezetimer);


    //return { word: word, ruletype: "auto", rule: "", phoneme: "", translation: '', trace: '' }; 
    return { word: word, ruletype: "auto", rule: "", phoneme: "", translation: autorhyme.ending, trace: autorhyme.trace }; 
}
