function createControlSection() {
    var div = document.createElement('div');
    div.setAttribute('class', 'controlcontainer');
    return div;
}

function createInput(f, attributes) {

    var element = document.createElement('input');
    element.setAttribute('type', f.type);
    element.setAttribute('name', f.name);
    element.setAttribute('id', 'form_' + f.name);

    var existingValue = getCookie(f.name);

    if (existingValue != null && isCookieValue(existingValue)) {
        element.setAttribute('value', existingValue);
        element.setAttribute('style', 'font-weight: 400; color: rgba(255,255,255,1);');
    }
    else {
        //element.setAttribute('value', 'Your ' + f.label);
        //element.setAttribute('style', 'font-weight: 100; color: rgba(255,255,255,0.5);');
    }

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
function createTextInput(f, attributes) {

    var element;

    if (ismobile) {
        var element = document.createElement('input');
        element.setAttribute('type', 'text');
        element.setAttribute('name', f.name);
        element.setAttribute('id', 'form_' + f.name);
    }
    else {
        var element = document.createElement('div');
        element.setAttribute('name', f.name);
        element.setAttribute('id', 'form_' + f.name);
        element.setAttribute('class', 'touchscreeninput');

        var kbtype = '';
        switch (f.name) {
            case 'email':
                kbtype = 'email';
                break;
            case 'phone':
                kbtype = 'phone';
                break;
            case 'zip':
            case 'gpa':
                kbtype = 'numeric';
                break;
            default:
                kbtype = 'standard';
                break;
        }
        element.setAttribute('keyboardtype', kbtype);
        element.setAttribute('prompt', f.label);
    }


    var existingValue = getCookie(f.name);

    if (existingValue != null && isCookieValue(existingValue)) {
        element.setAttribute('style', 'font-weight: 400; color: rgba(255,255,255,1); outline: none;');
        element.setAttribute('value', existingValue);

        if (!ismobile) {
            element.innerHTML = existingValue;
        }
    }
    
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
    if (control) {
        div.appendChild(control);
    }
    return div;
}

function createLabel(field) {
    var label = document.createElement('div');
    label.setAttribute('class', 'label');
    label.innerHTML = overrideLabel(field.name, field.label) + (field.required != null && $.trim(field.required).toLowerCase() == 'true' ? ' <span style="color: white;">*</span>' : '');
    return label;
}

function overrideLabel(fieldname, fieldlabel) {
    if (fieldname == 'military') {
        return 'Military';
    }
    else if (fieldname == 'gradyear') {
        return 'H.S. Grad. Year';
    }
    else if (fieldname == 'phone') {
        return 'Phone Number';
    }
    else if (fieldname == 'zip') {
        return 'Zip Code';
    }
    else if (fieldname == 'address1') {
        return 'Street Address';
    }
    else {
        return fieldlabel;
    }
}

