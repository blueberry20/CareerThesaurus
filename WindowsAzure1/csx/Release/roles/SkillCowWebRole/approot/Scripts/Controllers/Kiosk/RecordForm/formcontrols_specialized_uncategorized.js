//other specialized control rendering
function createRecordLogoSection(imageurl) {
    var div = document.createElement('div');
    div.setAttribute('class', 'logocontainer');
    var img = document.createElement('img');
    img.setAttribute('src', imageurl);
    div.appendChild(img);
    return div;
}
function createRecordTextareaSection() {
    var div = document.createElement('div');
    div.setAttribute('class', 'textareacontainer');
    return div;
}
function createRecordCheckboxSection() {
    var div = document.createElement('div');
    div.setAttribute('class', 'checkboxcontainer');
    return div;
}
function createRecordFieldgroupSection(cssclass) {
    var div = document.createElement('div');
    div.setAttribute('class', 'fieldgroupcontainer ' + cssclass);
    return div;
}
function createRecordTextarea(f) {
    var element = document.createElement('textarea');
    element.setAttribute('name', f.name);
    element.setAttribute('value', f.value);
    return element;
}
function createRecordCheckbox(f) {
    var element = document.createElement('input');
    element.setAttribute('type', 'checkbox');
    element.setAttribute('name', f.name);
    element.setAttribute('value', f.value);
    if (f.selected == 'true')
        element.setAttribute('checked', '');
    return element;
}
function createRecordRadiobutton(f) {
    var element = document.createElement('input');
    element.setAttribute('type', 'radio');
    element.setAttribute('name', f.name);
    element.setAttribute('value', f.value);
    if (f.selected == 'true')
        element.setAttribute('checked', '');
    return element;
}


function createRecordHiddenInput(name, value) {
    var element = document.createElement('hidden');
    element.setAttribute('name', name);
    element.setAttribute('value', value);

    setCookie(name, value, 7);

    return element;
}

function createRecordHiddenField(f) {
    
    if (recordFieldAlreadyAdded(f.name)) {
        return;
    }
    addedrecordfieldnames.push(f.name);

    return createRecordInput(f);
}

function createRecordCheckboxField(f) {
    
    if (recordFieldAlreadyAdded(f.name)) {
        return;
    }
    addedrecordfieldnames.push(f.name);

    var section = createRecordCheckboxSection();
    section.appendChild(createRecordLabel(f));
    section.appendChild(createRecordControlContainer(createRecordCheckbox(f)));
    return section;
}
function createRecordTextareaField(f) {

    if (recordFieldAlreadyAdded(f.name)) {
        return;
    }
    addedrecordfieldnames.push(f.name);

    var section = createRecordTextareaSection();
    section.appendChild(createRecordLabel(f));
    section.appendChild(createRecordControlContainer(createRecordTextarea(f)));
    return section;
}
function createRecordFieldgroupField(f) {

    if (recordFieldAlreadyAdded(f.name)) {
        return;
    }
    addedrecordfieldnames.push(f.name);

    var section = createRecordFieldgroupSection(f.cssclass);
    section.appendChild(createRecordLabel(f));

    var cc = createRecordControlContainer();

    for (var i = 0; i < f.options.length; i++) {
        if (f.options[i].type == 'radio') {
            cc.appendChild(createRecordRadiobutton(f.options[i]));
            cc.appendChild(createRecordElement('span', f.options[i].label));
        }
        else if (f.options[i].type == 'dropdown') {
            cc.appendChild(createRecordDropdown(f.options[i], 'onchange=record' + f.options[i].name + '_eventhandler()'));
        }
    }

    section.appendChild(cc);
    return section;
}

