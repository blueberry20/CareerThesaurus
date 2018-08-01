var dimensions = new Array();

function resettest() {
    $('.question').removeClass('answeredtrue');
    $('.question').removeClass('answeredfalse');
    $('input[type="radio"]').prop('checked', false);

    dimensions = new Array();
    showsummary();
    showallprofessions();
}

function registerinput(ctl) {
    processinput($(ctl).attr('dimension'), $(ctl).val());

    var inputs = new Array();
    for (var i = 0; i < dimensions.length; i++) {
        inputs.push({ dimension: dimensions[i].name, value: dimensions[i].value, percentage: 1 });
    }

    try {
        matchprofessions(inputs);
    }
    catch (ex) {
        alert(ex.message);
    }
}

function processinput(dimension, value) {
    if (!dimensionexists(dimension))
        registerdimension(dimension, value);
    else {
        registervalue(dimension, value);
    }
}

function dimensionexists(dimension) {
    for (var i = 0; i < dimensions.length; i++) {
        if (dimensions[i].name == dimension)
            return true;
    }
    return false;
}
function getdimension(dimension) {
    try {
        for (var i = 0; i < dimensions.length; i++) {
            if (dimensions[i].name == dimension)
                return dimensions[i];
        }
    }
    catch (ex) {
        alert('Dimension not found: ' + dimension);
    }
}
function registerdimension(dimension, value) {
    dimensions.push({ name: dimension, value: value });
}
function registervalue(dimension, value) {
    getdimension(dimension).value = value;
}

