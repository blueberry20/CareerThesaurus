var controlvalidationcode = '';

function createUnifiedFormValidation() {

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

function createValidationForField(f) {

    var valuereadfunction = ismobile ? "val()" : "html()";

    //Validation events first
    if (f.required == true) {
        //controlvalidationcode += 'alert("Checking value of ' + f.name + ' by $(#form_' + f.name + ').val() = " + $("#form_' + f.name + '").val());\n';
        //controlvalidationcode += 'alert("Checking value of ' + f.name + ' by $(#form_' + f.name + ').html() = " + $("#form_' + f.name + '").html());\n';
        switch (f.name) {
            case "zip":
                controlvalidationcode += 'if(!validateZip($("#form_' + f.name + '").' + valuereadfunction + ')) { alert("Invalid zip"); $("#form_' + f.name + '").select(); $("#form_' + f.name + '").focus(); return false; }\n';
                break;
            case "phone":
                controlvalidationcode += 'if(!validatePhone($("#form_' + f.name + '").' + valuereadfunction + ')) { alert("Invalid phone number"); $("#form_' + f.name + '").select(); $("#form_' + f.name + '").focus(); return false; }\n$("#form_' + f.name + '").val(formatPhoneNumber($("#form_' + f.name + '").' + valuereadfunction + '));\n';
                break;
            case "email":
                controlvalidationcode += 'if(!validateEmail($("#form_' + f.name + '").' + valuereadfunction + ')) { alert("Invalid email address"); $("#form_' + f.name + '").select(); $("#form_' + f.name + '").focus(); return false; }\n';
                break;
            case "address1":
                controlvalidationcode += 'if(!validateAddress($("#form_' + f.name + '").' + valuereadfunction + ')) { alert("Invalid address"); $("#form_' + f.name + '").select(); $("#form_' + f.name + '").focus(); return false; }\n';
                break;
            default: break;
        }
        
    }

    switch (f.type) {
        case 'dropdown':
            valuereadfunction = ismobile ? "val()" : "attr('code')";
            if (f.required == true) {
                controlvalidationcode += 'ctlname = "' + f.name + '";\n' +
                    'ctllabel = "' + f.label + '";\n' +
                    'if($("#form_"+ctlname).' + valuereadfunction + '=="") { alert(overrideLabel(ctlname, ctllabel) + " is required"); return false; } \n';
            }
            break;
        case 'text':
            if (f.required == true) {
                controlvalidationcode += 'ctlname = "' + f.name + '";\n' +
                    'ctllabel = "' + f.label + '";\n' +
                    'ctl = $("#form_"+ctlname);\n' +
                    'if(ctl.' + valuereadfunction + '=="") { alert(overrideLabel(ctlname, ctllabel) + " is required"); ctl.select(); ctl.focus(); return false; } \n' +
                    'try{' + f.name + '_eventhandler();}catch(e){}\n';
            }
            break;
        default:
            if (f.required == true) {
                controlvalidationcode += 'ctlname = "' + f.name + '";\n' +
                    'ctllabel = "' + f.label + '";\n' +
                    'ctl = $("#form_"+ctlname);\n' +
                    'if(ctl.val()=="") { alert(overrideLabel(ctlname, ctllabel) + " is required"); ctl.focus(); return false; } \n' +
                    'try{' + f.name + '_eventhandler();}catch(e){}\n';
            }
            break;
    }
            
    

}