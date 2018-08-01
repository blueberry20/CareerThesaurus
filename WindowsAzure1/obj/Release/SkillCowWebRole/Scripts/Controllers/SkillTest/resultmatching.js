function matchprofessions(inputs) {

    var matchedprofessions = new Array();

    try {
        
        for (var i = 0; i < professions.length; i++) {
            var relevance = matchprofession(professions[i], inputs);
            if (relevance > 0.5) {
                matchedprofessions.push({ profession: professions[i], relevance: relevance });
            }
        }
    }
    catch (ex) {
        
    }

    if (matchedprofessions.length > 0) {
        matchedprofessions.sort(sortbyrelevancedesc);

        if (getCookie('cbncampaign') == '13564694') {
            if (matchedprofessions.length > 0) {
                //alert('showInTestVMSchoolsForCareer() in matchprofessions()');
                //showInTestVMSchoolsForCareer(matchedprofessions[0].profession.VMProdId);
            }
        }

        showmatchedprofessionsuncategorized(matchedprofessions);
        showCareerChoices(matchedprofessions);

        savetopvmcategories(matchedprofessions);
    }
}


function matchprofession(p, inputs) {

    var points = 0;

    if (p.Attitude != "") {
        var input = findinput(inputs, 'Attitude');
        if (input != null) {
            if (input.percentage == 0)
                points += 0.5;
            else if (p.Attitude == input.value)
                points += input.percentage;
        }
    }
    else {
        points += 0.5;
    }

    if (p.Information != "") {
        var input = findinput(inputs, 'Information');
        if (input != null) {
            if (input.percentage == 0)
                points += 0.5;
            else if (p.Information == input.value)
                points += input.percentage;
        }
    }
    else {
        points += 0.5;
    }
    
    if (p.Processing != "") {
        var input = findinput(inputs, 'Processing');
        if (input != null) {
            if (input.percentage == 0)
                points += 0.5;
            else if (p.Processing == input.value)
                points += input.percentage;
        }
    }
    else {
        points += 0.5;
    }

    if (p.Action != "") {
        var input = findinput(inputs, 'Action');
        if (input != null) {
            if (input.percentage == 0)
                points += 0.5;
            else if (p.Action == input.value)
                points += input.percentage;
        }
    }
    else {
        points += 0.5;
    }

    if (p.Endurance != "") {
        var input = findinput(inputs, 'Endurance');
        if (input != null) {
            if (input.percentage == 0)
                points += 0.5;
            else if (p.Endurance == input.value)
                points += input.percentage;
        }
    }
    else {
        points += 0.5;
    }

    if (p.Presence != "") {
        var input = findinput(inputs, 'Presence');
        if (input != null) {
            if (input.percentage == 0)
                points += 0.5;
            else if (p.Presence == input.value)
                points += input.percentage;
        }
    }
    else {
        points += 0.5;
    }

    if (p.Concentration != "") {
        var input = findinput(inputs, 'Concentration');
        if (input != null) {
            if (input.percentage == 0)
                points += 0.5;
            else if (p.Concentration == input.value)
                points += input.percentage;
        }
    }
    else {
        points += 0.5;
    }

    if (p.Patterns != "") {
        var input = findinput(inputs, 'Patterns');
        if (input != null) {
            if (input.percentage == 0)
                points += 0.5;
            else if (p.Patterns == input.value)
                points += input.percentage;
        }
    }
    else {
        points += 0.5;
    }

    if (p.Compensation != "") {
        var input = findinput(inputs, 'Compensation');
        if (input != null) {
            if (input.percentage == 0)
                points += 0.5;
            else if (p.Compensation == input.value)
                points += input.percentage;
        }
    }
    else {
        points += 0.5;
    }

    var attributePoints = getadditionalattributescore(p);
    var attributeCount = countIncludedAttributes() * 2;

    if (attributePoints > 2) {
        //alert(attributePoints + ' from ' + attributeCount + ' attributes');
    }
    
    points += attributePoints;

    //9 dimensions + 15 attributes
    return parseFloat(points) / (9 + attributeCount);

}

function getadditionalattributescore(p) {
    var points = 0;
    var award = 2;
    var subtract = -1;
    for (var i = 0; i < importantthings.length; i++) {
        var t = importantthings[i];
        switch (t.name) {
            case 'Beauty':
                points += (t.value == 1 && p.Beauty == 1 ? award : (t.value == 1?subtract:0));
                break;
            case 'Helping':
                points += (t.value == 1 && p.Helping == 1 ? award : (t.value == 1?subtract:0));
                break;
            case 'Adventure':
                points += (t.value == 1 && p.Adventure == 1 ? award : (t.value == 1?subtract:0));
                break;
            case 'Safety':
                points += (t.value == 1 && p.Safety == 1 ? award : (t.value == 1?subtract:0));
                break;
            case 'People':
                points += (t.value == 1 && p.People == 1 ? award : (t.value == 1?subtract:0));
                break;

            case 'Science':
                points += (t.value == 1 && p.Science == 1 ? award : (t.value == 1?subtract:0));
                break;
            case 'Easy':
                points += (t.value == 1 && p.Easy == 1 ? award : (t.value == 1?subtract:0));
                break;
            case 'Duty':
                points += (t.value == 1 && p.Duty == 1 ? award : (t.value == 1?subtract:0));
                break;
            case 'Admiration':
                points += (t.value == 1 && p.Admiration == 1 ? award : (t.value == 1?subtract:0));
                break;
            case 'Creativity':
                points += (t.value == 1 && p.Creativity == 1 ? award : (t.value == 1?subtract:0));
                break;

            case 'Competition':
                points += (t.value == 1 && p.Competition == 1 ? award : (t.value == 1?subtract:0));
                break;
            case 'Animals':
                points += (t.value == 1 && p.Animals == 1 ? award : (t.value == 1?subtract:0));
                break;
            case 'Politics':
                points += (t.value == 1 && p.Politics == 1 ? award : (t.value == 1?subtract:0));
                break;
            case 'Technology':
                points += (t.value == 1 && p.Technology == 1 ? award : (t.value == 1?subtract:0));
                break;
            case 'Growth':
                points += (t.value == 1 && p.Growth == 1 ? award : (t.value == 1?subtract:0));
                break;
            default:
                break;
        }
    }
    return points;
}

function countIncludedAttributes() {
    var cnt = 0;
    for (var i = 0; i < importantthings.length; i++) {
        if (importantthings[i].value == 1) {
            cnt++;
        }
    }
    return cnt;
}

var uniquevmcategories = new Array();
function savetopvmcategories(matchedprofessions) {
    uniquevmcategories = new Array();
    var json = '';
    var cnt=0;
    for (var i = 0; i < matchedprofessions.length; i++) {
        var p = matchedprofessions[i].profession;
        if (p.VMProdId != null && p.VMProdId != "") {
            if (!vmcategoryregistered(p.VMProdId)) {
                if (cnt++ > 0) {
                    json += ',';
                }
                json += p.VMProdId;
                uniquevmcategories.push(p.VMProdId);
            }
        }
    }
    json += '';
    setCookie('topvmcategories', json, 7);
}
function vmcategoryregistered(id) {
    for (var i = 0; i < uniquevmcategories.length; i++) {
        if (uniquevmcategories[i] == id) {
            return true;
        }
    }
}