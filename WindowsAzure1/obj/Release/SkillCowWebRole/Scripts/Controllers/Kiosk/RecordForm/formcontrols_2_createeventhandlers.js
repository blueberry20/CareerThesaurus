function createRecordFormEventHandlers(requiredfields) {

    var code = '';

    for (var i = 0; i < requiredfields.length; i++) {

        var ce = requiredfields[i];

        code += 'function record' + ce.name + '_eventhandler() {\n';
        code += 'return true;\n\n';

        switch (ce.name) {
            case "zip":
                code += 'var controlvalue = $("#recordform_' + ce.name + '").val();\n';
                code += 'if(!validateZip(controlvalue)) { alert("Invalid zip"); $("#recordform_' + ce.name + '").focus(); return false; }\n';
                break;
            case "phone":
                code += 'var controlvalue = $("#recordform_' + ce.name + '").val();\n' +
                        'if(!validatePhone(controlvalue)) { alert("Invalid phone number"); $("#recordform_' + ce.name + '").select(); $("#recordform_' + ce.name + '").focus(); return false; }\n$("#recordform_' + ce.name + '").val(formatPhoneNumber(controlvalue));\n';
                break;
            case "email":
                code += '\tvar controlvalue = $("#recordform_' + ce.name + '").val();\n';
                code += '\tif(!validateEmail(controlvalue)) {\n\t\talert("Invalid email address"); $("#recordform_' + ce.name + '").select();\n$("#recordform_' + ce.name + '").focus();\nreturn false;\n}\n';
                break;
            default: break;
        }

        code += 'return true;}\n\n';
        
    }

    //alert(code);

    var headID = document.getElementsByTagName("head")[0];
    var newScript = document.createElement('script');
    newScript.type = 'text/javascript';
    newScript.innerHTML = code;

    headID.appendChild(newScript);
}
