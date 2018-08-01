var recordcookiesettercode = '';

function createRecordFormCookieSetter() {

    var code = '';

    code += 'function setRecordFormCookies() {\n';

    code += recordcookiesettercode;
    
    code += '}\n';
        
    var headID = document.getElementsByTagName("head")[0];
    var newScript = document.createElement('script');
    newScript.type = 'text/javascript';
    newScript.innerHTML = code;

    headID.appendChild(newScript);
}

function createRecordCookieSetterForField(f) {

    switch (f.type) {
        case 'dropdown':
            //cookiesettercode += 'setCookie(\'' + f.name + '\', $("#form_' + f.name + '").attr(\'code\'),365);\n';
            recordcookiesettercode += 'setCookie(\'' + f.name + '_label\', $("#recordform_' + f.name + '").html(),365);\n';
            break;
        case 'text':
            //cookiesettercode += 'alert("text #recordform_' + f.name + '" + ": " + $("#recordform_' + f.name + '").html());\n';
            recordcookiesettercode += 'setCookie(\'' + f.name + '\', $("#recordform_' + f.name + '").html(),365);\n';
            break;
        default:
            //cookiesettercode += 'alert("default #recordform_' + f.name + '" + ": " + $("#recordform_' + f.name + '").val());\n';
            recordcookiesettercode += 'setCookie(\'' + f.name + '\', $("#recordform_' + f.name + '").val(),365);\n';
            break;
    }
    
}