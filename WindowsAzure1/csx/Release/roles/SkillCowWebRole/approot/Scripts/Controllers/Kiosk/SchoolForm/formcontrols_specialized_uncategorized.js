//other specialized control rendering
function createLogoSection(imageurl) {
    var div = document.createElement('div');
    div.setAttribute('class', 'logocontainer');
    var img = document.createElement('img');
    img.setAttribute('src', imageurl);
    div.appendChild(img);
    return div;
}
function createTextareaSection() {
    var div = document.createElement('div');
    div.setAttribute('class', 'textareacontainer');
    return div;
}
function createCheckboxSection() {
    var div = document.createElement('div');
    div.setAttribute('class', 'checkboxcontainer');
    return div;
}
function createFieldgroupSection(cssclass) {
    var div = document.createElement('div');
    div.setAttribute('class', 'fieldgroupcontainer ' + cssclass);
    return div;
}
function createTextarea(f) {
    var element = document.createElement('textarea');
    element.setAttribute('name', f.name);
    element.setAttribute('value', f.value);
    return element;
}
function createCheckbox(f) {
    var element = document.createElement('input');
    element.setAttribute('type', 'checkbox');
    element.setAttribute('name', f.name);
    element.setAttribute('value', f.value);
    if (f.selected == 'true')
        element.setAttribute('checked', '');
    return element;
}
function createRadiobutton(f) {
    var element = document.createElement('input');
    element.setAttribute('type', 'radio');
    element.setAttribute('name', f.name);
    element.setAttribute('value', f.value);
    if (f.selected == 'true')
        element.setAttribute('checked', '');
    return element;
}


function createHiddenInput(name, value) {
    var element = document.createElement('hidden');
    element.setAttribute('name', name);
    element.setAttribute('value', value);

    setCookie(name, value, 7);

    return element;
}

function createHiddenField(f) {
    
    if (fieldAlreadyAdded(f.name)) {
        return;
    }
    addedfieldnames.push(f.name);

    return createInput(f);
}

function createCheckboxField(f) {
    
    if (fieldAlreadyAdded(f.name)) {
        return;
    }
    addedfieldnames.push(f.name);

    var section = createCheckboxSection();
    section.appendChild(createLabel(f));
    section.appendChild(createControlContainer(createCheckbox(f)));
    return section;
}
function createTextareaField(f) {

    if (fieldAlreadyAdded(f.name)) {
        return;
    }
    addedfieldnames.push(f.name);

    var section = createTextareaSection();
    section.appendChild(createLabel(f));
    section.appendChild(createControlContainer(createTextarea(f)));
    return section;
}
function createFieldgroupField(f) {

    if (fieldAlreadyAdded(f.name)) {
        return;
    }
    addedfieldnames.push(f.name);

    var section = createFieldgroupSection(f.cssclass);
    section.appendChild(createLabel(f));

    var cc = createControlContainer();

    for (var i = 0; i < f.options.length; i++) {
        if (f.options[i].type == 'radio') {
            cc.appendChild(createRadiobutton(f.options[i]));
            cc.appendChild(createElement('span', f.options[i].label));
        }
        else if (f.options[i].type == 'dropdown') {
            cc.appendChild(createDropdown(f.options[i], 'onchange=' + f.options[i].name + '_eventhandler()'));
        }
    }

    section.appendChild(cc);
    return section;
}

