var recordcontrolvalidationcode = '';

function createRecordFormValidation() {

    var code = '';

    code += 'function validateRecordForm() {\n' +
    'var ctlname, ctllabel, ctl;\n';
    
    code += 'return true;\n\n';

    //code += 'try{';

    code += recordcontrolvalidationcode;

    //code += '}catch(e){alert(e.message);}';

    code += 'return true;\n';
    code += '}\n';



    var headID = document.getElementsByTagName("head")[0];
    var newScript = document.createElement('script');
    newScript.type = 'text/javascript';
    newScript.innerHTML = code;

    headID.appendChild(newScript);
}

function createRecordValidationForField(f) {

    switch (f.type) {
        case 'dropdown':
            if (f.required == true) {
                recordcontrolvalidationcode += 'ctlname = "' + f.name + '";\n' +
                    'ctllabel = "' + f.label + '";\n' +
                    'if($("#recordform_"+ctlname).attr(\'code\')=="") { alert(overrideLabel(ctlname, ctllabel) + " is required"); return false; } \n';
            }
            break;
        case 'text':
            if (f.required == true) {
                recordcontrolvalidationcode += 'ctlname = "' + f.name + '";\n' +
                    'ctllabel = "' + f.label + '";\n' +
                    'ctl = $("#recordform_"+ctlname);\n' +
                    'if(ctl.html()=="") { alert(overrideLabel(ctlname, ctllabel) + " is required"); ctl.focus(); return false; } \n' +
                    'var formatvalidationfailed = false;\n' +
                    'try{if(!record' + f.name + '_eventhandler()) { formatvalidationfailed = true; }}catch(e){}\n' +
                    'if(formatvalidationfailed) {return false;}\n';
            }
            break;
        default:
            if (f.required == true) {
                recordcontrolvalidationcode += 'ctlname = "' + f.name + '";\n' +
                    'ctllabel = "' + f.label + '";\n' +
                    'ctl = $("#recordform_"+ctlname);\n' +
                    'if(ctl.val()=="") { alert(overrideLabel(ctlname, ctllabel) + " is required"); ctl.focus(); return false; } \n' +
                    'var formatvalidationfailed = false;\n' +
                    'try{if(!record' + f.name + '_eventhandler()) { formatvalidationfailed = true; }}catch(e){}\n' +
                    'if(formatvalidationfailed) {return false;}\n';
            }
            break;
    }
}