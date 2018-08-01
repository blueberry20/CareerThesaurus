function matchprofessions(inputs) {
    var matchedprofessions = new Array();

    for (var i = 0; i < professions.length; i++) {
        var relevance = matchprofession(professions[i], inputs);
        if (relevance > 0.5) {
            matchedprofessions.push({ profession: professions[i], relevance: relevance });
        }
    }

    if (matchedprofessions.length > 0) {
        matchedprofessions.sort(sortbyrelevancedesc);
        showmatchedprofessions(matchedprofessions);
    }
}

function findinput(inputs, dimension) {
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].dimension == dimension)
            return inputs[i];
    }
    return null;
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


    if (p.Evidence != "") {
        var input = findinput(inputs, 'Evidence');
        if (input != null) {
            if (input.percentage == 0)
                points += 0.5;
            else if (p.Evidence == input.value)
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
            else if (p.Compensation == input.compensation)
                points += input.percentage;
        }
    }
    else {
        points += 0.5;
    }

    
    return parseFloat(points) / 9;
    
}