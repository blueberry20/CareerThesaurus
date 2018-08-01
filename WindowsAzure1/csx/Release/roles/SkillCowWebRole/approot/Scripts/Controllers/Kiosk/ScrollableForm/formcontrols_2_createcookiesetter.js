var cookiesettercode = '';

function createUnifiedFormCookieSetter() {

    var code = '';

    code += 'function setFormCookies() {\n';
        
    code += cookiesettercode;
    
    code += 'setCookie(\'leadid\', $("#leadid_token").val(),365);\n';

    code += '}\n';
        
    var headID = document.getElementsByTagName("head")[0];
    var newScript = document.createElement('script');
    newScript.type = 'text/javascript';
    newScript.innerHTML = code;

    headID.appendChild(newScript);
}

function createCookieSetterForField(f) {

    var valuereadfunction = ismobile ? "val()" : "html()";

    switch (f.type) {
        case 'dropdown':
            valuereadfunction = ismobile ? "val()" : "attr('code')";
            if (f.name != "program_key") {
                cookiesettercode += 'setCookie(\'' + f.name + '\', $("#form_' + f.name + '").' + valuereadfunction + ',365);\n';
                if (!ismobile) {
                    cookiesettercode += 'setCookie(\'' + f.name + '_label\', $("#form_' + f.name + '").html(),365);\n';
                }
            }
            break;
        case 'text':
            if (f.name != "program_key") {
                cookiesettercode += 'setCookie(\'' + f.name + '\', $("#form_' + f.name + '").' + valuereadfunction + ',365);\n';
                //cookiesettercode += 'setCookie(\'' + f.name + '_label\', $("#form_' + f.name + '").html(),365);\n';
            }
            break;
        default:
            if (f.name != "program_key") {
                cookiesettercode += 'setCookie(\'' + f.name + '\', $("#form_' + f.name + '").val(),365);\n';

            }
            break;
    }
    
}