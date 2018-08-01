function createUnifiedEventHandlers_FJ(json, requiredfields) {
    _trace('createUnifiedEventHandlers_FJ()');

    var declarations = '';
    var code = '';
    var eventBinders = '';

    for (var i = 0; i < json.controlevents.length; i++) {
        var ce = json.controlevents[i];

        var isrequired = false;
        for (var j = 0; j < requiredfields.length; j++) {
            if (ce.control === requiredfields[j].name) {
                isrequired = true;
                break;
            }
        }


        if (isrequired) {


            code += 'function ' + ce.control + '_eventhandler() {\n' +
            'var controlvalue = $("#form_' + ce.control + '").val();\n\n';
            code += 'return true;\n\n';
            
            //Validation events first
            for (var j = 0; j < ce.events.length; j++) {
                if (ce.events[j].type == "validation") {
                    switch (ce.events[j].validation) {
                        case "zip":
                            code += 'if(!validateZip(controlvalue)) { alert("Invalid zip"); $("#form_' + ce.control + '").focus(); return false; }\n';
                            break;
                        case "phone":
                            code += 'if(!validatePhone(controlvalue)) { alert("Invalid phone number"); $("#form_' + ce.control + '").select(); $("#form_' + ce.control + '").focus(); return false; }\n$("#form_' + ce.control + '").val(formatPhoneNumber(controlvalue));\n';
                            break;
                        case "email":
                            code += 'if(!validateEmail(controlvalue)) { alert("Invalid email address"); $("#form_' + ce.control + '").select(); $("#form_' + ce.control + '").focus(); return false; }\n';
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

            code += 'return true;}\n';
        }
    }

    //$('#declarations').append(declarations);
    //$('#codepreview').append(code);

    var headID = document.getElementsByTagName("head")[0];
    var newScript = document.createElement('script');
    newScript.type = 'text/javascript';
    newScript.innerHTML = declarations + code;

    headID.appendChild(newScript);
}
