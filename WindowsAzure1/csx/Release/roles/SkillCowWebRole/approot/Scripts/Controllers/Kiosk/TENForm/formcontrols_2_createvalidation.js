var controlvalidationcode = '';

function createUnifiedFormValidation_FJ() {

    var code = '';

    code += 'function validateCustomForm() {\n' +
    'var ctlname, ctllabel, ctl;\n';
    //code += 'return true;\n\n';

    code += 'try{';

    code += controlvalidationcode;
    
    code += '}catch(e){alert(e.message);}';

    code += 'return true;\n';
    code += '}\n';

    

    var headID = document.getElementsByTagName("head")[0];
    var newScript = document.createElement('script');
    newScript.type = 'text/javascript';
    newScript.innerHTML = code;

    headID.appendChild(newScript);
}

function createValidationForField_FJ(f) {
    
    switch (f.type) {
        case 'dropdown':
            if (f.required == true) {
                controlvalidationcode += 'ctlname = "' + f.name + '";\n' +
                    'ctllabel = "' + f.label + '";\n' +
                    'if($("#form_"+ctlname).attr(\'code\')=="") { alert(overrideLabel(ctlname, ctllabel) + " is required"); return false; } \n';
            }
            break;
        case 'text':
            if (f.required == true) {
                controlvalidationcode += 'ctlname = "' + f.name + '";\n' +
                    'ctllabel = "' + f.label + '";\n' +
                    'ctl = $("#form_"+ctlname);\n' +
                    'if(ctl.html()=="") { alert(overrideLabel(ctlname, ctllabel) + " is required"); return false; } \n';
            }
            break;
        default:
            if (f.required == true) {
                controlvalidationcode += 'ctlname = "' + f.name + '";\n' +
                    'ctllabel = "' + f.label + '";\n' +
                    'ctl = $("#form_"+ctlname);\n' +
                    'if(ctl.val()=="") { alert(overrideLabel(ctlname, ctllabel) + " is required"); ctl.focus(); return false; } \n' +
                    'var formatvalidationfailed = false;\n' +
                    'try{if(!' + f.name + '_eventhandler()) { formatvalidationfailed = true; }}catch(e){}\n' +
                    'if(formatvalidationfailed) {return false;}\n';
            }
            break;
    }
}