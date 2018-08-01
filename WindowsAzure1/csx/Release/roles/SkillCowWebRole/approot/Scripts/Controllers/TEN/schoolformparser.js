var requiredfields = [
    "zip",
    "firstname",
    "lastname",
    "email",
    "address1",
    "phone",
    "military",
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

