var cookiesettercode_FJ = '';

function createUnifiedFormCookieSetter_FJ() {
    _trace('createUnifiedFormCookieSetter_FJ()');

    

    var code = '';
    code += 'function setFormCookies_FJ() {\n';
    code += cookiesettercode_FJ;
    code += '}\n';
        
    var headID = document.getElementsByTagName("head")[0];
    var newScript = document.createElement('script');
    newScript.type = 'text/javascript';
    newScript.ID = "createUnifiedFormCookieSetter_FJ_script";
    newScript.innerHTML = code;

    headID.appendChild(newScript);
}

function createCookieSetterForField_FJ(f) {

    switch (f.type) {
        case 'dropdown':
            if (f.name != "program_key") {
                cookiesettercode_FJ += 'setCookie(\'' + f.name + '\', $("#form_' + f.name + '").attr(\'code\'),365);\n';
                cookiesettercode_FJ += 'setCookie(\'' + f.name + '_label\', $("#form_' + f.name + '").html(),365);\n';
            }
            break;
        case 'text':
            if (f.name != "program_key") {
                cookiesettercode_FJ += 'setCookie(\'' + f.name + '\', $("#form_' + f.name + '").html(),365);\n';
                //cookiesettercode += 'setCookie(\'' + f.name + '_label\', $("#form_' + f.name + '").html(),365);\n';
            }
            break;
        default:
            if (f.name != "program_key") {
                cookiesettercode_FJ += 'setCookie(\'' + f.name + '\', $("#form_' + f.name + '").val(),365);\n';

            }
            break;
    }
    
}