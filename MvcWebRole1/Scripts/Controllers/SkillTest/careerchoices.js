var careerchoices = new Array();

function countCareersSelected() {
    var cnt = 0;
    for (var i = 0; i < careerchoices.length; i++) {
        if (careerchoices[i].value == 1) {
            cnt++;
        }
    }
    return cnt;
}
function getCareersAsCommaDelimitedString() {
    
    var cnt = 0;
    var result = '';
    for (var i = 0; i < careerchoices.length; i++) {
        if (careerchoices[i].value == 1) {
            if (cnt++ > 0) {
                result += ',' + careerchoices[i].program + "|" + careerchoices[i].name.replace(/\,/g, '%2C');
            }
            else {
                result += careerchoices[i].program + "|" + careerchoices[i].name.replace(/\,/g, '%2C');
            }
        }
    }
    
    return result;
}
function showCareerChoices(matches) {
    
    matches = matches.sort(sortbyrelevancedesc);
    
    $('#top10careers').html('');
        
    var container = document.getElementById('top10careers');
    var column = document.createElement('div');
    column.setAttribute('class','column');

    for (var i = 0; i < matches.length && i<10; i++) {
        if(i==5) {
            container.appendChild(column);
            column = document.createElement('div');
            column.setAttribute('class','column');
        }
        
        var element = document.createElement('div');
        element.setAttribute('name', matches[i].profession.DisplayName);
        element.setAttribute('value', '0');
        element.setAttribute('program', matches[i].profession.ProgramId);
        element.setAttribute('vmprodid', matches[i].profession.VMProdId);
        element.innerHTML = matches[i].profession.DisplayName;

        column.appendChild(element);
        


    }

    container.appendChild(column);

    $('#top10careers div div').click(function () {
        careerChoiceClicked(this);
    });
}

function careerChoiceClicked(e) {
    if ($(e).attr('value') == '0') {
        $(e).attr('value', '1');
        $(e).addClass('selected');
        setCareerChoice($(e).attr('name'), 1, $(e).attr('program'), $(e).attr('vmprodid'));
    }
    else {
        $(e).attr('value', '0');
        $(e).removeClass('selected');
        setCareerChoice($(e).attr('name'), 0, $(e).attr('program'), $(e).attr('vmprodid'));
    }
}

function setCareerChoice(name, value, program, vmprodid) {
    
    var topccvmprodid = getCookie('topcareerchoicevmprodid');
    if (topccvmprodid == null || topccvmprodid == '') {
        setCookie('topcareerchoicevmprodid', vmprodid, 365);
    }

    setCookie('careerchoice_' + formatProgrammatic(name), value, 365);

    for (var i = 0; i < careerchoices.length; i++) {
        if (careerchoices[i].name == name) {
            careerchoices[i].value = value;
            return;
        }
    }

    careerchoices.push({ name: name, value: value, program: program, priority: careerchoices.length, vmprodid: vmprodid });
}

function getCareerChoiceByProgram(program) {

    //show career choices
    var temp = '';
    for (var i = 0; i < careerchoices.length; i++) {
        temp += careerchoices[i].program + ': ' + careerchoices[i].name + ' | ' + careerchoices[i].value + '\n';
    }
    //debugalert(temp);

    for (var i = 0; i < careerchoices.length; i++) {
        //assert(careerchoices[i].program == program, "careerchoices[i].program==program condition failed!  \n\n(where careerchoices[i].program= " + careerchoices[i].program + "; program=" + program + ";");
        if (careerchoices[i].program == program) {
            //debugalert('Found career choice for ' + program);
            return careerchoices[i];
        }
    }

    return null;
}

function getTopCareerChoice() {
    careerchoices.sort(sortbypriority);
    for (var i = 0; i < careerchoices.length; i++) {
        if (careerchoices[i].value == 1) {
            return careerchoices[i];
        }
    }
}