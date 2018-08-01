function getVowel(code) {
    for(var i=0; i<vowels.length; i++) {
        if(vowels[i].code==code) {
            return vowels[i];
        }
    }
    return null;
}
var vowels = [
    { code: "a", syllables: 1, phonetic: "a", opensyllable : "aey" },
    { code: "e", syllables: 1, phonetic: "e", opensyllable: "i" },
    { code: "i", syllables: 1, phonetic: "i", opensyllable: "ai" },
    { code: "o", syllables: 1, phonetic: "a", opensyllable: "ou" },
    { code: "u", syllables: 1, phonetic: "a", opensyllable: "u" },
    { code: "y", syllables: 1, phonetic: "i", opensyllable: "ai" },

    { code: "A", syllables: 1, phonetic: "aey" },
    { code: "E", syllables: 1, phonetic: "i" },
    { code: "I", syllables: 1, phonetic: "ai" },
    { code: "O", syllables: 1, phonetic: "ou" },
    { code: "U", syllables: 1, phonetic: "u" },
    { code: "Y", syllables: 1, phonetic: "ai" }
    ];

var consonants = [
    { code: "b", syllables: 1, phonetic: "b" },
    { code: "c", syllables: 1, phonetic: "k" },
    { code: "d", syllables: 1, phonetic: "t" },
    { code: "f", syllables: 1, phonetic: "f" },
    { code: "g", syllables: 1, phonetic: "g" },
    { code: "h", syllables: 1, phonetic: "h" },
    { code: "j", syllables: 1, phonetic: "j" },
    { code: "k", syllables: 1, phonetic: "k" },
    { code: "l", syllables: 1, phonetic: "l" },
    { code: "m", syllables: 1, phonetic: "m" },
    { code: "n", syllables: 1, phonetic: "n" },
    { code: "p", syllables: 1, phonetic: "p" },
    { code: "q", syllables: 1, phonetic: "q" },
    { code: "r", syllables: 1, phonetic: "r" },
    { code: "s", syllables: 1, phonetic: "s" },
    { code: "t", syllables: 1, phonetic: "t" },
    { code: "v", syllables: 1, phonetic: "v" },
    { code: "w", syllables: 1, phonetic: "w" },
    { code: "x", syllables: 1, phonetic: "x" },
    { code: "y", syllables: 1, phonetic: "y" },
    { code: "z", syllables: 1, phonetic: "z" }
];

var blends = [
    { code: "spr", syllables: 1, phonetic: "spr" },
    { code: "str", syllables: 1, phonetic: "str" },
    { code: "que", syllables: 1, phonetic: "k" },
    { code: "qua", syllables: 1, phonetic: "kua" },
    { code: "quo", syllables: 1, phonetic: "kuo" },
    { code: "qui", syllables: 1, phonetic: "ki" },
    { code: "bl", syllables: 1, phonetic: "bl" },
    { code: "cl", syllables: 1, phonetic: "kl" },
    { code: "fl", syllables: 1, phonetic: "fl" },
    { code: "gl", syllables: 1, phonetic: "gl" },
    { code: "pl", syllables: 1, phonetic: "pl" },
    { code: "br", syllables: 1, phonetic: "br" },
    { code: "cr", syllables: 1, phonetic: "kr" },
    { code: "dr", syllables: 1, phonetic: "dr" },
    { code: "fr", syllables: 1, phonetic: "fr" },
    { code: "gr", syllables: 1, phonetic: "gr" },
    { code: "pr", syllables: 1, phonetic: "pr" },
    { code: "tr", syllables: 1, phonetic: "tr" },
    { code: "sk", syllables: 1, phonetic: "sk" },
    { code: "sl", syllables: 1, phonetic: "sl" },
    { code: "sp", syllables: 1, phonetic: "sp" },
    { code: "st", syllables: 1, phonetic: "st" },
    { code: "sw", syllables: 1, phonetic: "su" }
];

var diagraphs = [
    { code: "ch", syllables: 1, phonetic: "ch" },
    { code: "dh", syllables: 1, phonetic: "d" },
    { code: "fh", syllables: 1, phonetic: "f" },
    { code: "gh", syllables: 1, phonetic: "g" },
    { code: "kh", syllables: 1, phonetic: "k" },
    { code: "lh", syllables: 1, phonetic: "l" },
    { code: "mh", syllables: 1, phonetic: "m" },
    { code: "nh", syllables: 1, phonetic: "n" },
    { code: "ph", syllables: 1, phonetic: "p" },
    { code: "rh", syllables: 1, phonetic: "r" },
    { code: "sh", syllables: 1, phonetic: "sh" },
    { code: "th", syllables: 1, phonetic: "th" },
    { code: "vh", syllables: 1, phonetic: "v" },
    { code: "wh", syllables: 1, phonetic: "u" },
    { code: "xh", syllables: 1, phonetic: "ks" },
    { code: "yh", syllables: 1, phonetic: "y" },
    { code: "zh", syllables: 1, phonetic: "zh" }
];

var dyphthongs = [
        { code: "aa", syllables: 1, phonetic: "a" },
        { code: "ae", syllables: 1, phonetic: "ae" },
        { code: "ai", syllables: 1, phonetic: "ey" },
        { code: "ao", syllables: 1, phonetic: "eyo" },
        { code: "au", syllables: 1, phonetic: "o" },
        { code: "aw", syllables: 1, phonetic: "o" },
        { code: "ea", syllables: 1, phonetic: "i" },
        { code: "ee", syllables: 1, phonetic: "i" },
        { code: "ei", syllables: 1, phonetic: "ey" },
        { code: "eu", syllables: 1, phonetic: "u" },
        { code: "ie", syllables: 1, phonetic: "i" },
        { code: "oa", syllables: 1, phonetic: "ou" },
        { code: "oe", syllables: 1, phonetic: "oae" },
        { code: "oi", syllables: 1, phonetic: "oy" },
        { code: "oo", syllables: 1, phonetic: "u" },
        { code: "ou", syllables: 1, phonetic: "u" },
        { code: "ue", syllables: 1, phonetic: "ue" },
        { code: "uu", syllables: 1, phonetic: "yu" },
        { code: "ui", syllables: 1, phonetic: "ui" }
    ];

var triphthongs = [
        { code: "eau", syllables: 1, phonetic: "yu" },
        { code: "eou", syllables: 1, phonetic: "eu" },
        { code: "gue", syllables: 1, phonetic: "ge" },
        { code: "gua", syllables: 1, phonetic: "ga" },
        { code: "gui", syllables: 1, phonetic: "gi" },
        { code: "guo", syllables: 1, phonetic: "guo" },
        { code: "iou", syllables: 1, phonetic: "iu" },
        { code: "que", syllables: 1, phonetic: "k" },
        { code: "qua", syllables: 1, phonetic: "kua" },
        { code: "qui", syllables: 1, phonetic: "kui" },
        { code: "quee", syllables: 1, phonetic: "kui" },
        { code: "quo", syllables: 1, phonetic: "kuou" },

        
    ];

var quadphthongs = [
        { code: "tion", syllables: 1, phonetic: "shan" },
        { code: "sion", syllables: 1, phonetic: "shan" },
        { code: "quai", syllables: 1, phonetic: "kuey" }

    ];

