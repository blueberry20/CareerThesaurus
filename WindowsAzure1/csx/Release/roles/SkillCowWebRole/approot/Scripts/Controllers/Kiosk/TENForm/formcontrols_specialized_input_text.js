﻿function createTextField(f) {

    if (fieldAlreadyAdded(f.name)) {
        return;
    }
    addedfieldnames.push(f.name);
    
    var section = createControlSection();

    section.appendChild(createLabel(f));

    var ti = createTextInput(f, '');
    section.appendChild(createControlContainer(ti));

    //create cookie setter
    createCookieSetterForField_FJ(f);
    createValidationForField_FJ(f);

    return section;
}