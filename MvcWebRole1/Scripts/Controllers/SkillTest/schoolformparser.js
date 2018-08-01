var requiredfields = [
    "zip",
    "firstname",
    "lastname",
    "email",
    "address1",
    "phone",
    
    "gpa"
    ];

var states = [
{ "value": "", "label": "" },
{ "value": "AL", "label": "Alabama" },
{ "value": "AK", "label": "Alaska" },
{ "value": "AZ", "label": "Arizona" },
{ "value": "AR", "label": "Arkansas" },
{ "value": "CA", "label": "California" },
{ "value": "CO", "label": "Colorado" },
{ "value": "CT", "label": "Connecticut" },
{ "value": "DE", "label": "Delaware" },
{ "value": "DC", "label": "District of Columbia" },
{ "value": "FL", "label": "Florida" },
{ "value": "GA", "label": "Georgia" },
{ "value": "HI", "label": "Hawaii" },
{ "value": "ID", "label": "Idaho" },
{ "value": "IL", "label": "Illinois" },
{ "value": "IN", "label": "Indiana" },
{ "value": "IA", "label": "Iowa" },
{ "value": "KS", "label": "Kansas" },
{ "value": "KY", "label": "Kentucky" },
{ "value": "LA", "label": "Louisiana" },
{ "value": "ME", "label": "Maine" },
{ "value": "MD", "label": "Maryland" },
{ "value": "MA", "label": "Massachusetts" },
{ "value": "MI", "label": "Michigan" },
{ "value": "MN", "label": "Minnesota" },
{ "value": "MS", "label": "Mississippi" },
{ "value": "MO", "label": "Missouri" },
{ "value": "MT", "label": "Montana" },
{ "value": "NE", "label": "Nebraska" },
{ "value": "NV", "label": "Nevada" },
{ "value": "NH", "label": "New Hampshire" },
{ "value": "NJ", "label": "New Jersey" },
{ "value": "NM", "label": "New Mexico" },
{ "value": "NY", "label": "New York" },
{ "value": "NC", "label": "North Carolina" },
{ "value": "ND", "label": "North Dakota" },
{ "value": "OH", "label": "Ohio" },
{ "value": "OK", "label": "Oklahoma" },
{ "value": "OR", "label": "Oregon" },
{ "value": "PA", "label": "Pennsylvania" },
{ "value": "RI", "label": "Rhode Island" },
{ "value": "SC", "label": "South Carolina" },
{ "value": "SD", "label": "South Dakota" },
{ "value": "TN", "label": "Tennessee" },
{ "value": "TX", "label": "Texas" },
{ "value": "UT", "label": "Utah" },
{ "value": "VT", "label": "Vermont" },
{ "value": "VA", "label": "Virginia" },
{ "value": "WA", "label": "Washington" },
{ "value": "WV", "label": "West Virginia" },
{ "value": "WI", "label": "Wisconsin" },
{ "value": "WY", "label": "Wyoming" },
{ "value": "OT", "label": "other" }
];

var levelsofeducation = [
{ "value": "", "label": "" },
{ "value": "None", "label": "None" },
{ "value": "INHS", "label": "Still In High School" },
{ "value": "GED", "label": "GED" },
{ "value": "HS", "label": "High School Diploma" },
{ "value": "CRT", "label": "Certificate" },
{ "value": "SC", "label": "Some College" },
{ "value": "AS", "label": "Associates Degree" },
{ "value": "BS", "label": "Bachelor's Degree" },
{ "value": "MS", "label": "Master's Degree" },
{ "value": "DOC", "label": "Doctoral Degree" }
];


var militaryoptions = [
{"value": "", "label": "" },
{"value": "None", "label": "Not affiliated with the Military" },
{"value": "AD", "label": "Active Duty (AD)" },
{"value": "SR", "label": "Selective Reserve (SR)" },
{"value": "GD", "label": "Guard" },
{"value": "SP", "label": "Spouse / Dependant" },
{"value": "VT", "label": "Veteran" },
{"value": "CV", "label": "Civilian" },
{"value": "RT", "label": "Retiree" },
{"value": "IA", "label": "Inactive" }
];


function submitCustomForm() {

    //debugalert('about to validate form');
    try {
        if (!validateCustomForm()) {
            debugalert('validateCustomForm() returned false');
            return;
        }
    }
    catch (ex) {
        debugalert(ex.message);
    }

    //debugalert('about to save form as cookies');
    setFormCookies();

    //debugalert('about to save career choices');
    saveCareerChoicesAsCookies();

    //debugalert('about to save optins');
    saveOptins();

    //debugalert('about to submit form');
    $('#customform').submit();
}
function skipSchool() {

    setCookie("extendedrecordcomplete", 1, 365);

    uxevent('nothanks', '');

    setTimeout(function () {
        document.location = '/skilltest';
    }, 200);
    
}
function showAvailableSchoolsAsCapsules() {

    debugalert('showAvailableSchoolsAsCapsules()');

    var tbl = document.getElementById('schoolcapsulestable');
    
    for (var i = 0; i < selectedschools.length; i++) {

        try {

            /*
            debugalert(
            'CAPSULE:\n' +
            'Form name: ' + selectedschools[i].formname + '\n' +
            'Campus type: ' + selectedschools[i].campustype.toLowerCase() + '\n' +
            'Program: ' + selectedschools[i].program
            );
            */

            var tr = document.createElement('tr');
            var td = document.createElement('td');
            td.setAttribute('rowspan', '2');

            var imgholder = document.createElement('div');
            imgholder.setAttribute('class', 'informlogo');
            var img = document.createElement('img');
            img.setAttribute('class', 'schoollogo');
            img.setAttribute('src', selectedschools[i].image);
            imgholder.appendChild(img);
            td.appendChild(imgholder);

            if (selectedschools[i].campustype.toLowerCase() == 'online') {
                var onlineindicator = document.createElement('div');
                onlineindicator.setAttribute('class', 'campustype');
                onlineindicator.innerHTML = 'Online';
                td.appendChild(onlineindicator);
            }
            tr.appendChild(td);

            td = document.createElement('td');
            td.setAttribute('class', 'careertitle');
            var cc = getCareerChoiceByProgram(selectedschools[i].program);
            if (cc != null) {
                td.innerHTML = cc.name + ' training';
            }
            tr.appendChild(td);
            tbl.appendChild(tr);

            //second row
            tr = document.createElement('tr');
            td = document.createElement('td');
            td.setAttribute('class', 'checkboxholder');
            td.innerHTML = '<input id="cb' + selectedschools[i].formid + '" type="checkbox" ' + (islockedmode ? 'checked' : '') + ' class="optincheckbox"/>Yes, I would like ' + selectedschools[i].formname + ' to contact me by phone and or email regarding available training programs';
            tr.appendChild(td);

            tr.appendChild(td);
            tbl.appendChild(tr);

            
            

        }
        catch (ex) {
            debugalert(ex.message);
        }
    }

}
function showAvailableSchools() {
    var tbl = document.getElementById('availableschoolstable');

    //Career titles
    var tr = document.createElement('tr');
    for (var i = 0; i < selectedschools.length; i++) {
        var td = document.createElement('td');
        td.setAttribute('class', 'careertitle');
        var cc = getCareerChoiceByProgram(selectedschools[i].program);
        if (cc != null) {
            td.innerHTML = cc.name;
        }
        tr.appendChild(td);
    }
    tbl.appendChild(tr);

    //Online indicators
    tr = document.createElement('tr');
    for (var i = 0; i < selectedschools.length; i++) {
        var td = document.createElement('td');
        if (selectedschools[i].campustype.toLowerCase() == 'online') {
            td.innerHTML = '<div class="campustype">Online training available</div>';
        }
        tr.appendChild(td);
    }
    tbl.appendChild(tr);

    //Optin checkboxes
    tr = document.createElement('tr');
    for (var i = 0; i < selectedschools.length; i++) {
        var td = document.createElement('td');
        td.setAttribute('align', 'center');
        td.innerHTML = '<input id="cb' + selectedschools[i].formid + '" type="checkbox" checked class="optincheckbox"/> get free info';
        tr.appendChild(td);
    }
    tbl.appendChild(tr);

    //spacer row
    tr = document.createElement('tr');
    var spacerrowtd = document.createElement('td');
    spacerrowtd.setAttribute('colspan', '3');
    spacerrowtd.innerHTML = '&nbsp;';
    tr.appendChild(spacerrowtd);
    tbl.appendChild(tr);

    //School logos
    tr = document.createElement('tr');
    for (var i = 0; i < selectedschools.length; i++) {
        var td = document.createElement('td');
        td.setAttribute('valign', 'middle');

        var imgholder = document.createElement('div');
        imgholder.setAttribute('class', 'informlogo');

        var img = document.createElement('img');
        img.setAttribute('class', 'schoollogo');
        img.setAttribute('src', selectedschools[i].image);
        
        imgholder.appendChild(img);

        td.appendChild(imgholder);

        tr.appendChild(td);
    }
    tbl.appendChild(tr);


    var titletext = 'Please fill out the form below';
    $('.careertitle').attr('title', titletext);
    $('.campustype').attr('title', titletext);
    $('.optincheckbox').attr('title', titletext);
    $('.schoollogo').attr('title', titletext);
}

function saveOptins() {
    var schoolvariables = '';
    for (var i = 0; i < selectedschools.length; i++) {
        if ($('#cb' + selectedschools[i].formid).is(':checked')) {
            if (schoolvariables != '') {
                schoolvariables += '^';
            }
            schoolvariables += selectedschools[i].program + "!" + selectedschools[i].clientid + "!" + selectedschools[i].formid + "!" + selectedschools[i].campuskey + "!" + selectedschools[i].programkey;
        }
    }
    if (schoolvariables != '') {
        //alert('saving school variables: ' + schoolvariables);
        setCookie("schoolvariables", schoolvariables, 365);
    }
}

function saveCareerChoicesAsCookies() {
    
    var cnt = 0;
    for (var i = 0; i < careerchoices.length; i++) {
        var cc = careerchoices[i];
        if (cc.value == 1) {
            cnt++;
        }
    }
    setCookie('careerchoicescount', cnt, 365);
    for (var i = 0; i < careerchoices.length; i++) {
        var cc = careerchoices[i];
        if (cc.value == 1) {
            var ccstring = cc.priority + '|' + cc.program + '|' + cc.name;
            setCookie('careerchoice'+i, ccstring, 365);
        }
    }
}


function downloadSingleSchoolForm(professionid, clientid, formid, campuskey, programkey) {

    //alert('Downloading form ' + formid);
    $.ajax({
        url: appserverurl + "/SchoolForm/GetFormJson",
        type: "GET",
        data: {
            clientid: clientid,
            formid: formid
        }
    }).done(function (response) {
        if (response.result == 'ok') {
            //alert('form downloaded');
            schoolforms.push(response);
            if (schoolforms.length >= selectedschools.length) {
                //alert('all forms downloaded');
                compileUnifiedSetOfFields();
            }
        }
        else {
            //alert("School form Response.result=" + response.result + " " + response.errormessage);
        }
    }).fail(function () {
        //alert("ajax GET to " + appserverurl + "/SchoolForm/GetFormJson" + " failed");
    });
}
function showAllFields() {
    
    var unified = new Array();
    for (var j = 0; j < schoolforms.length; j++) {
        for (var i = 0; i < schoolforms[j].fields.length; i++) {
            var f = schoolforms[j].fields[i];
            f.clientid = schoolforms[j].clientid;
            f.formid = schoolforms[j].formid;
            unified.push(f);
        }
    }
    

    var table = document.createElement('table');
    var tr = document.createElement('tr')
    var headers = 'client,form,name,required,value'.split(',');
    for (var h = 0; h < headers.length; h++) {
        var th = document.createElement('td');
        th.innerHTML = '<b>' + headers[h]  + '</b>';
        tr.appendChild(th);
    }
    table.appendChild(tr);
    
    var td;
    for (var i = 0; i < unified.length; i++) {

        var f = unified[i];

        //alert(f.name);

        tr = document.createElement('tr');

        td = document.createElement('td');
        td.innerHTML = f.clientid;
        tr.appendChild(td);

        td = document.createElement('td');
        td.innerHTML = f.formid;
        tr.appendChild(td);

        td = document.createElement('td');
        td.innerHTML = f.name;
        tr.appendChild(td);

        td = document.createElement('td');
        td.innerHTML = f.required!=null && f.required=='true' ? 'true' : '';
        tr.appendChild(td);

        td = document.createElement('td');
        var val = getCookie(f.name);
        td.innerHTML = val !=null ? val : '';
        tr.appendChild(td);
        
        table.appendChild(tr);
    }

    document.getElementById('allfields').appendChild(table);

    
}
function compileUnifiedSetOfFields() {
    var unified = new Array();

    //alert('inside compileUnifiedSetOfFields()');

    try {

        for (var j = 0; j < schoolforms.length; j++) {
            //alert(schoolforms[j].fields);
            for (var i = 0; i < schoolforms[j].fields.length; i++) {
                var f = schoolforms[j].fields[i];
                //alert(f.name);
                if (isRequiredField(f)) {
                    //alert('Required field ' + f.name);
                    if (!fieldHasValue(f)) {
                        if (!fieldAdded(f, unified)) {
                            unified.push(f);
                        }
                    }
                }
                else {
                    //alert(f.name + ' is not required');
                }
            }
        }
    }
    catch (e) {
        //alert('Oops, sorry an error has occured');
    }

    //create the form
    //alert('about to create unified form');
    createUnifiedForm(unified);

    //alert('about to create unified form validation');
    createUnifiedFormValidation(unified);

    //alert('about to create unified form cookie setter');
    createUnifiedFormCookieSetter(unified);
}

function isRequiredField(f) {
    if ($.inArray(f.name, requiredfields) >= 0) {
        return true;
    }
    return false;
}

function fieldHasValue(f) {
    //alert('In array ' + f.name + ' ' + $.inArray(f.name,"zip,firstname,lastname,phone,email".split(',')))
    if ($.inArray(f.name, "zip,firstname,lastname,phone,email".split(','))>=0) {
        return true;
    }
    return false;
}
function fieldAdded(f, unified) {
    if (f.name.substring(0, 10).toLowerCase() == 'extrafield')
        return false;
    for (var i = 0; i < unified.length; i++) {
        if (f.name == unified[i].name) {
            return true;
        }
    }
    return false;
}

function downloadForm() {
    $.ajax({
        url: appserverurl + "/SchoolForm/GetFormJson",
        type: "GET",
        data: {
            formid: "@(ViewBag.FormId)"
        }
    }).done(function (response) {
        if (response.result == 'ok') {
            createFormFromJson(response);
            createEventHandlers(response);
            createFormValidation(response);

            if($('#zip'))
                $('#zip').val(getCookie('zip'));

            if ($('#firstname'))
                $('#firstname').val(getCookie('firstname'));

            if ($('#phone'))
                $('#phone').val(getCookie('phone'));

            if ($('#email'))
                $('#email').val(getCookie('email'));

            if ($('#educationlevel'))
                $('#educationlevel').val(getCookie('educationlevel'));

        }
        else {
            alert("Error");
        }
    }).fail(function () {
        alert("Error");
    });
}

function createFormValidation(json) {

    try {
        var code = '';

        code += 'function validateCustomForm() {\n' +
        'var ctlname, ctllabel, ctl;\n';
    

        for (var i = 0; i < json.fields.length; i++) {
            var f = json.fields[i];
            switch (f.type) {
                case 'textarea':
                    break;
                default:
                    if (f.required == 'true') {
                        code += 'ctlname = "' + f.name + '";\n' +
                    'ctllabel = "' + f.label + '";\n' +
                    'ctl = $("#"+ctlname);\n' +
                    'if(ctl.val()=="") { alert(ctllabel + " is required"); ctl.focus(); return false; } \n';
                    }
                    break;
            }
        }
        code += 'return true;\n';
        code += '}\n';

        //$('#codepreview').append(code);

        var headID = document.getElementsByTagName("head")[0];
        var newScript = document.createElement('script');
        newScript.type = 'text/javascript';
        newScript.innerHTML = code;

        headID.appendChild(newScript);

        
    }
    catch (e) {
        alert('Error in createFormValidation: ' + e.message);
    }
}

function createUnifiedFormValidation(unified) {

    var code = '';

    code += 'function validateCustomForm() {\n' +
    'var ctlname, ctllabel, ctl;\n';

    for (var i = 0; i < unified.length; i++) {

        var f = unified[i];

        switch (f.type) {
            case 'textarea':
                break;
            default:
                if (f.required == 'true') {
                    code += 'ctlname = "' + f.name + '";\n' +
                    'ctllabel = "' + f.label + '";\n' +
                    'ctl = $("#"+ctlname);\n' +
                    'if(ctl.val()=="") { alert(ctllabel + " is required"); ctl.focus(); return false; } \n';
                }

                if (f.name == "address1") {
                    code += 'ctlname = "' + f.name + '";\n' +
                    'ctllabel = "' + f.label + '";\n' +
                    'ctl = $("#"+ctlname);\n' +
                    'if(!validateAddress(ctl.val())) { alert("Please enter a valid address"); ctl.focus(); return false; } \n';
                }
                break;
        }
    }
    code += 'debugalert("Validation OK");\n';
    code += 'return true;\n';
    code += '}\n';

    //$('#codepreview').append(code);

    var headID = document.getElementsByTagName("head")[0];
    var newScript = document.createElement('script');
    newScript.type = 'text/javascript';
    newScript.innerHTML = code;

    headID.appendChild(newScript);
}
function createUnifiedFormCookieSetter(unified) {

    var code = '';

    code += 'function setFormCookies() {\n';

    for (var i = 0; i < unified.length; i++) {
        var f = unified[i];
        code += 'setCookie(\'' + f.name + '\',$("#' + f.name + '").val(),365);\n';
    }
    code += '}\n';

    //$('#codepreview').append(code);

    var headID = document.getElementsByTagName("head")[0];
    var newScript = document.createElement('script');
    newScript.type = 'text/javascript';
    newScript.innerHTML = code;

    headID.appendChild(newScript);
}


function createEventHandlers(json) {

    var declarations = '';
    var code = '';
    var eventBinders = '';

        
    for (var i = 0; i < json.controlevents.length; i++) {
        var ce = json.controlevents[i];

        code += 'function ' + ce.control + '_eventhandler() {\n' +
        'var controlvalue = $("#' + ce.control + '").val();\n\n';

        //Validation events first
        for (var j = 0; j < ce.events.length; j++) {
            if (ce.events[j].type == "validation") {
                switch (ce.events[j].validation) {
                    case "zip":
                        code += 'if(!validateZip(controlvalue)) { alert("Invalid zip"); $("#' + ce.control + '").focus(); return; }\n';
                        break;
                    case "phone":
                        code += 'if(!validatePhone(controlvalue)) { alert("Invalid phone number"); $("#' + ce.control + '").focus(); return; }\n$("#' + ce.control + '").val(formatPhoneNumber(controlvalue));\n';
                        break;
                    case "email":
                        code += 'if(!validateEmail(controlvalue)) { alert("Invalid email address"); $("#' + ce.control + '").focus(); return; }\n';
                        break;
                    default: break;
                }
            }
        }

        //Hiding events second
        for (var j = 0; j < ce.events.length; j++) {
            if (ce.events[j].type == "hiding") {
                var e = ce.events[j];

                declarations += 'var $' + e.valueVariable + ' = ' + (e.oper == 'in' ? '[' + e.value + ']' : '"' + e.value + '"') + ';\n';

                if (e.oper == 'in') {
                    code += 'if(controlvalue=="" || $.inArray(controlvalue, $' + e.valueVariable + ')>=0) {\n' +
                    '$(".' + e.cssclass + '").' + e.actionIfTrue + '();\n' +
                    '}else{\n' +
                    (e.actionIfFalse !='' ? '$(".' + e.cssclass + '").' + e.actionIfFalse + '();\n' : '') +
                    '}\n\n';
                }
                else {
                    code += 'if(controlvalue=="" || controlvalue' + e.oper + '$' + e.valueVariable + ') {\n' +
                    /*'alert("' + e.actionIfTrue + ' .' + e.cssclass + '");\n' +*/
                    '$(".' + e.cssclass + '").' + e.actionIfTrue + '();\n' +
                    '}else{\n' +
                    /*'alert("' + e.actionIfFalse + ' .' + e.cssclass + '");\n' +*/
                    (e.actionIfFalse !='' ? '$(".' + e.cssclass + '").' + e.actionIfFalse + '();\n' : '') +
                '}\n\n';
                }
            }
        }

        code += '}\n';
    }
        
    //$('#declarations').append(declarations);
    //$('#codepreview').append(code);
                
    var headID = document.getElementsByTagName("head")[0];
    var newScript = document.createElement('script');
    newScript.type = 'text/javascript';
    newScript.innerHTML = declarations + code;
        
    headID.appendChild(newScript);
}

function createUnifiedEventHandlers(json) {

    var declarations = '';
    var code = '';
    var eventBinders = '';
    
    for (var i = 0; i < json.controlevents.length; i++) {
        var ce = json.controlevents[i];

        code += 'function ' + ce.control + '_eventhandler() {\n' +
        'var controlvalue = $("#' + ce.control + '").val();\n\n';

        //Validation events first
        for (var j = 0; j < ce.events.length; j++) {
            if (ce.events[j].type == "validation") {
                switch (ce.events[j].validation) {
                    case "zip":
                        code += 'if(!validateZip(controlvalue)) { alert("Invalid zip"); $("#' + ce.control + '").focus(); return; }\n';
                        break;
                    case "phone":
                        code += 'if(!validatePhone(controlvalue)) { alert("Invalid phone number"); $("#' + ce.control + '").focus(); return; }\n$("#' + ce.control + '").val(formatPhoneNumber(controlvalue));\n';
                        break;
                    case "email":
                        code += 'if(!validateEmail(controlvalue)) { alert("Invalid email address"); $("#' + ce.control + '").focus(); return; }\n';
                        break;
                    default: break;
                }
            }
        }

        //Hiding events second
        for (var j = 0; j < ce.events.length; j++) {
            if (ce.events[j].type == "hiding") {
                var e = ce.events[j];

                declarations += 'var $' + e.valueVariable + ' = ' + (e.oper == 'in' ? '[' + e.value + ']' : '"' + e.value + '"') + ';\n';

                if (e.oper == 'in') {
                    code += 'if(controlvalue=="" || $.inArray(controlvalue, $' + e.valueVariable + ')>=0) {\n' +
                    '$(".' + e.cssclass + '").' + e.actionIfTrue + '();\n' +
                    '}else{\n' +
                    (e.actionIfFalse != '' ? '$(".' + e.cssclass + '").' + e.actionIfFalse + '();\n' : '') +
                    '}\n\n';
                }
                else {
                    code += 'if(controlvalue=="" || controlvalue' + e.oper + '$' + e.valueVariable + ') {\n' +
                    /*'alert("' + e.actionIfTrue + ' .' + e.cssclass + '");\n' +*/
                    '$(".' + e.cssclass + '").' + e.actionIfTrue + '();\n' +
                    '}else{\n' +
                    /*'alert("' + e.actionIfFalse + ' .' + e.cssclass + '");\n' +*/
                    (e.actionIfFalse != '' ? '$(".' + e.cssclass + '").' + e.actionIfFalse + '();\n' : '') +
                '}\n\n';
                }
            }
        }

        code += '}\n';
    }

    //$('#declarations').append(declarations);
    //$('#codepreview').append(code);

    var headID = document.getElementsByTagName("head")[0];
    var newScript = document.createElement('script');
    newScript.type = 'text/javascript';
    newScript.innerHTML = declarations + code;

    headID.appendChild(newScript);
}

function createUnifiedForm(unified) {

    var formholder = document.getElementById('customformfields');
    var container = document.createElement('form');

    try {
        container.id = 'customform';
        container.setAttribute('method', 'POST');
        container.setAttribute('action', '/DirectSubmission');

        var cbncampaignid = "13564694";
        if (getCookie("cbncampaign") != null && getCookie("cbncampaign") != '') {
            cbncampaignid = getCookie("cbncampaign");
        }

        container.appendChild(createHiddenInput("sourceform", "endoftest"));
        container.appendChild(createHiddenInput("campaign_id", cbncampaignid));

        for (var i = 0; i < unified.length; i++) {
            var f = unified[i];
            switch (f.type) {
                case 'hidden':
                    container.appendChild(createHiddenField(f));
                    break;
                case 'text':
                    container.appendChild(createTextField(f));
                    break;
                case 'checkbox':
                    container.appendChild(createCheckboxField(f));
                    break;
                case 'textarea':
                    container.appendChild(createTextareaField(f));
                    break;
                case 'dropdown':
                    container.appendChild(createDropdownField(f));
                    break;
                case 'fieldgroup':
                    container.appendChild(createFieldgroupField(f));
                    break;
                default: break;
            }
        }

        formholder.appendChild(container);
    }
    catch (e) {
        //alert('Oops, an error has occured');
    }

    try {
        $('textarea').jtextarea();
    }
    catch (e) {
    }

    //alert('unified form created');
}

function createHiddenInput(name, value) {
    var element = document.createElement('hidden');
    element.setAttribute('name', name);
    element.setAttribute('value', value);
    return element;
}

function createHiddenField(f) {
    return createInput(f);
}

function createTextField(f) {
    var section = createControlSection();
    section.appendChild(createLabel(f));
    section.appendChild(createControlContainer(createInput(f, 'onchange=' + f.name + '_eventhandler()')));
    return section;
}
function createCheckboxField(f) {
    var section = createCheckboxSection();
    section.appendChild(createLabel(f));
    section.appendChild(createControlContainer(createCheckbox(f)));
    return section;
}
function createTextareaField(f) {
    var section = createTextareaSection();
    section.appendChild(createLabel(f));
    section.appendChild(createControlContainer(createTextarea(f)));
    return section;
}
function createFieldgroupField(f) {
    var section = createFieldgroupSection(f.cssclass);
    section.appendChild(createLabel(f));
        
    var cc = createControlContainer();

    for (var i = 0; i < f.options.length; i++) {
        if (f.options[i].type == 'radio') {
            cc.appendChild(createRadiobutton(f.options[i]));
            cc.appendChild(createElement('span', f.options[i].label));
        }
        else if (f.options[i].type == 'dropdown') {
            cc.appendChild(createDropdown(f.options[i], 'onchange=' + f.options[i].name + '_eventhandler()'));
        }
    }

    section.appendChild(cc);
    return section;
}
function createDropdownField(f) {
    var section = createControlSection();
    section.appendChild(createLabel(f));
    section.appendChild(createControlContainer(createDropdown(f, 'onchange=' + f.name + '_eventhandler()')));
    return section;
}

function createDropdown(f, attributes) {

    var element = document.createElement('select');
    element.setAttribute('name', f.name);
    element.setAttribute('id', f.name);

    if (attributes) {
        var tokens = attributes.split(',');
        for (var i = 0; i < tokens.length; i++) {
            var kv = tokens[i].split('=');
            if (kv.length > 1) {
                for (var j = 0; j < kv.length; j++) {
                    element.setAttribute(kv[0], kv[1]);
                }
            }
        }
    }

    if (f.name == 'educationlevel') {
        for (var i = 0; i < levelsofeducation.length; i++) {
            var o = levelsofeducation[i];
            var option = document.createElement('option');
            option.setAttribute('value', o.value);
            option.innerHTML = o.label;
            element.appendChild(option);
        }
    }
    else if (f.name == 'military') {
        for (var i = 0; i < militaryoptions.length; i++) {
            var o = militaryoptions[i];
            var option = document.createElement('option');
            option.setAttribute('value', o.value);
            option.innerHTML = o.label;
            element.appendChild(option);
        }
    }
    else if (f.name == 'state') {
        for (var i = 0; i < states.length; i++) {
            var o = states[i];
            var option = document.createElement('option');
            option.setAttribute('value', o.value);
            //option.setAttribute('class', o.cssclass);
            //option.setAttribute('style', o.style);
            option.innerHTML = o.label;
            element.appendChild(option);
        }
    }
    else {
        var optgroups = createOptionGroups(f.options);
        var optionContainer;
        for (var g1 = 0; g1 < optgroups.length; g1++) {
            var group1 = optgroups[g1];
            var group1optgroup;
            optionContainer = element;
            if (group1.name != "") {
                group1optgroup = document.createElement('optgroup');
                group1optgroup.setAttribute('label', group1.name);
                optionContainer = group1optgroup;
            }

            if (group1.items.length > 0) {

                for (var i = 0; i < group1.items.length; i++) {

                    var o = group1.items[i];
                    var option = document.createElement('option');
                    option.setAttribute('value', o.value.replace('None Military', 'Non-Military'));
                    option.setAttribute('class', o.cssclass);
                    //option.setAttribute('style', o.style);
                    option.innerHTML = o.label;
                    optionContainer.appendChild(option);

                }
            }


            for (var g2 = 0; g2 < group1.groups.length; g2++) {
                var group2 = group1.groups[g2];
                var group2optgroup = document.createElement('optgroup');
                group2optgroup.setAttribute('label', group2.name);
                for (var i = 0; i < group2.items.length; i++) {
                    var o = group2.items[i];
                    var option = document.createElement('option');
                    option.setAttribute('value', o.value.replace('None Military', 'Non-Military'));
                    option.setAttribute('class', o.cssclass);
                    //option.setAttribute('style', o.style);
                    option.innerHTML = o.label;
                    group2optgroup.appendChild(option);
                }
                optionContainer.appendChild(group2optgroup);
            }

            if (group1optgroup != null) {
                element.appendChild(group1optgroup);
            }
        }
    }
    
                
    return element;
}

function createOptionGroups(options) {
    var groups = new Array();

    for (var i = 0; i < options.length; i++) {
        var o = options[i];
        var group = getParentGroup(o, groups);

        group.items.push(o);
            
    }
        
    return groups;
}
function getParentGroup(option, groups) {

    if (option.group2!=null && option.group2 != "") {
        var group1 = getOrCreateGroupByName(option.group1, groups);
        return getOrCreateGroupByName(option.group2, group1.groups);
    }
        
    return getOrCreateGroupByName(option.group1, groups);
}
function getOrCreateGroupByName(groupname, groups) {
        
    for (var i = 0; i < groups.length; i++) {
        if ((groupname != null && groups[i].name == groupname) || (groupname == null && groups[i].name == "")) {
            return groups[i];
        }
    }
                
    var newGroup = { name: (groupname!=null?groupname:""), groups: new Array(), items: new Array() };
        
    groups.push(newGroup);
        
    return newGroup;
}

//common
function createLogoSection(imageurl) {
    var div = document.createElement('div');
    div.setAttribute('class', 'logocontainer');
    var img = document.createElement('img');
    img.setAttribute('src', imageurl);
    div.appendChild(img);
    return div;
}
function createTextareaSection() {
    var div = document.createElement('div');
    div.setAttribute('class', 'textareacontainer');
    return div;
}
function createCheckboxSection() {
    var div = document.createElement('div');
    div.setAttribute('class', 'checkboxcontainer');
    return div;
}
function createFieldgroupSection(cssclass) {
    var div = document.createElement('div');
    div.setAttribute('class', 'fieldgroupcontainer ' + cssclass);
    return div;
}
function createControlSection() {
    var div = document.createElement('div');
    div.setAttribute('class', 'controlcontainer');
    return div;
}
function createInput(f, attributes) {
    var element = document.createElement('input');
    element.setAttribute('type', f.type);
    element.setAttribute('name', f.name);
    element.setAttribute('id', f.name);
    element.setAttribute('style', "width: 327px;");

    if(f.value!="text")
        element.setAttribute('value', f.value);

    if (attributes) {
        var tokens = attributes.split(',');
        for (var i = 0; i < tokens.length; i++) {
            var kv = tokens[i].split('=');
            if (kv.length > 1) {
                for (var j = 0; j < kv.length; j++) {
                    element.setAttribute(kv[0], kv[1]);
                }
            }
        }
    }

    return element;
}
function createTextarea(f) {
    var element = document.createElement('textarea');
    element.setAttribute('name', f.name);
    element.setAttribute('value', f.value);
    return element;
}
function createCheckbox(f) {
    var element = document.createElement('input');
    element.setAttribute('type', 'checkbox');
    element.setAttribute('name', f.name);
    element.setAttribute('value', f.value);
    if(f.selected=='true')
        element.setAttribute('checked', '');
    return element;
}
function createRadiobutton(f) {
    var element = document.createElement('input');
    element.setAttribute('type', 'radio');
    element.setAttribute('name', f.name);
    element.setAttribute('value', f.value);
    if (f.selected == 'true')
        element.setAttribute('checked', '');
    return element;
}
function createLabel(field) {
    var label = document.createElement('div');
    label.setAttribute('class', 'label');

    if (field.name == 'military') {
        label.innerHTML = 'Military' + (field.required != null && $.trim(field.required).toLowerCase() == 'true' ? ' <span style="color: red;">*</span>' : '');
    }
    else if (field.name == 'gradyear') {
        label.innerHTML = 'H.S. Grad. Year' + (field.required != null && $.trim(field.required).toLowerCase() == 'true' ? ' <span style="color: red;">*</span>' : '');
    }
    else {
        label.innerHTML = field.label + (field.required != null && $.trim(field.required).toLowerCase() == 'true' ? ' <span style="color: red;">*</span>' : '');
    }
    

    return label;
}
function createElement(type, text, attributes) {
    var span = document.createElement(type);
    if (attributes) {
        var tokens = attributes.split(',');
        for (var i = 0; i < tokens.length; i++) {
            var kv = tokens[i].split('=');
            if (kv.length > 1) {
                for (var j = 0; j < kv.length; j++) {
                    span.setAttribute(kv[0], kv[1]);
                }
            }
        }
    }
    span.innerHTML = text;
    return span;
}
function createControlContainer(control) {
    var div = document.createElement('div');
    div.setAttribute('class', 'control');
    if(control){
        div.appendChild(control);
    }
    return div;
}
