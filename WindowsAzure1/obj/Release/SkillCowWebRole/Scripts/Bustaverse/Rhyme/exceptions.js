﻿var exceptions = [
    { code: "amber", phonetic: "ba" },
    { word: "coyote", phoneme: "ti" },
    { word: "ballet", phoneme: "ey" },
    { word: "sherbet", phoneme: "ey" },
    { word: "chalet", phoneme: "ey" },
    { word: "fillet", phoneme: "ey" },
    { word: "chevrolet", phoneme: "ey" },
    { word: "valet", phoneme: "ey" },
    { word: "rely", phoneme: "lay" },
    { word: "ally", phoneme: "lay" },
    { word: "sly", phoneme: "lay" },
    { word: "fly", phoneme: "lay" },
    { word: "ply", phoneme: "lay" },
    { word: "comply", phoneme: "lay" },
    { word: "immply", phoneme: "lay" },
    { word: "apply", phoneme: "lay" },
    { word: "july", phoneme: "lay" },
    { word: "risque", phoneme: "key" },
    { word: "archive", phoneme: "ayf" },
    { word: "arrive", phoneme: "ayf" },
    { word: "dive", phoneme: "ayf" },
    { word: "nosedive", phoneme: "ayf" },
    { word: "jive", phoneme: "ayf" },
    { word: "alive", phoneme: "ayf" },
    { word: "revive", phoneme: "ayf" },
    { word: "hive", phoneme: "ayf" },
    { word: "five", phoneme: "ayf" },
    { word: "drive", phoneme: "ayf" },
    { word: "contrive", phoneme: "ayf" },
    { word: "beehive", phoneme: "ayf" },
    { word: "thrive", phoneme: "ayf" },
    { word: "strive", phoneme: "ayf" },
    { word: "survive", phoneme: "ayf" },
    { word: "deprive", phoneme: "ayf" },
    { word: "connive", phoneme: "ayf" },
    { word: "waive", phoneme: "eyf" },
    { word: "argue", phoneme: "yu" },
    { word: "again", phoneme: "en" },
    { word: "born-again", phoneme: "en" },
    { word: "bornagain", phoneme: "en" },
    { word: "mountain", phoneme: "in" },
    { word: "sovereign", phoneme: "in" },
    { word: "foreign", phoneme: "in" },
    { word: "curtain", phoneme: "in" },
    { word: "britain", phoneme: "in" },
    { word: "fountain", phoneme: "in" },
    { word: "villain", phoneme: "in" },
    { word: "bargain", phoneme: "in" },
    { word: "arouse", phoneme: "aus" },
    { word: "age", phoneme: "eydzh" },
    { word: "engage", phoneme: "eydzh" },
    { word: "teenage", phoneme: "eydzh" },
    { word: "stage", phoneme: "eydzh" },
    { word: "upstage", phoneme: "eydzh" },
    { word: "offstage", phoneme: "eydzh" },
    { word: "backstage", phoneme: "eydzh" },
    { word: "espionage", phoneme: "adzh" },
    { word: "entourage", phoneme: "adzh" },
    { word: "barrage", phoneme: "adzh" },
    { word: "fuselage", phoneme: "adzh" },
    { word: "garage", phoneme: "adzh" },
    { word: "homage", phoneme: "adzh" },
    { word: "sabotage", phoneme: "adzh" },
    { word: "montage", phoneme: "adzh" },
    { word: "fry", phoneme: "ray" },
    { word: "stir-fry", phoneme: "ray" },
    { word: "dry", phoneme: "ray" },
    { word: "drip-dry", phoneme: "ray" },
    { word: "blow-dry", phoneme: "ray" },
    { word: "sun-dry", phoneme: "ray" },
    { word: "sundry", phoneme: "ray" },
    { word: "cry", phoneme: "ray" },
    { word: "outcry", phoneme: "ray" },
    { word: "spry", phoneme: "ray" },
    { word: "try", phoneme: "ray" },
    { word: "wry", phoneme: "ray" },
    { word: "pry", phoneme: "ray" },
    { word: "awry", phoneme: "ray" },

    { word: "table", phoneme: "eybl" },
    { word: "cable", phoneme: "eybl" },
    { word: "stable", phoneme: "eybl" },
    { word: "turntable", phoneme: "eybl" },
    { word: "able", phoneme: "eybl" },
    { word: "unable", phoneme: "eybl" },
    { word: "gable", phoneme: "eybl" },
    { word: "gabel", phoneme: "eybl" },
    { word: "enable", phoneme: "eybl" },
    { word: "disable", phoneme: "eybl" },
    { word: "unstable", phoneme: "eybl" },

    { word: "karate", phoneme: "ey" },
    { word: "considerate", phoneme: "it" },
    { word: "corporate", phoneme: "it" },
    { word: "chocolate", phoneme: "it" },
    { word: "postgraduate", phoneme: "it" },
    { word: "pirate", phoneme: "it" },
    { word: "doctorate", phoneme: "it" },
    { word: "conglomerate", phoneme: "it" },
    { word: "certificate", phoneme: "it" },
    { word: "accurate", phoneme: "it" },
    { word: "inconsiderate", phoneme: "it" },
    { word: "predicate", phoneme: "it" },
    { word: "delegate", phoneme: "it,eyt" },
    { word: "doctorate", phoneme: "it" },
    { word: "delicate", phoneme: "it" },
    { word: "indelicate", phoneme: "it" },
    { word: "estimate", phoneme: "it,eyt" },
    { word: "surrogate", phoneme: "it" },
    { word: "indeterminate", phoneme: "it" },

    { word: "ultimate", phoneme: "it" },
    { word: "legitimate", phoneme: "it" },
    { word: "template", phoneme: "it" },
    { word: "affectionate", phoneme: "it" },
    { word: "ornate", phoneme: "it" },
    { word: "disproportionate", phoneme: "it" },
    { word: "dispassionate", phoneme: "it" },

    { word: "disparate", phoneme: "it" },

    { word: "climate", phoneme: "it" },
    { word: "triplicate", phoneme: "it,eyt" },

    { word: "guesstimate", phoneme: "it" },
    { word: "disparate", phoneme: "it" },
    { word: "disparate", phoneme: "it" },
    { word: "disparate", phoneme: "it" },
    { word: "sleight", phoneme: "ayt" },

    { word: "shy", phoneme: "shay" },

    { word: "crayon", syllables: 1, phonetic: "yan" },


    //acronyms
    { code: "asap", phonetic: "pi" },
    { code: "a.s.a.p.", phonetic: "pi" },

    { code: "bbq", phonetic: "kyu" },
    { code: "b.b.q.", phonetic: "kyu" },

    { code: "atm", phonetic: "em" },
    { code: "m&m", phonetic: "em" },
    { code: "am", phonetic: "em" },

    { code: "lol", syllables: 3, phonetic: "el" },
    { code: "lmao", syllables: 4,  phonetic: "you" },
    { code: "lmfao", syllables: 5, phonetic: "you" },
    { code: "rofl", syllables: 4, phonetic: "el" },
    { code: "roflmao", syllables: 7, phonetic: "you" },
    { code: "roflmfao", syllables: 7, phonetic: "you" },

];
