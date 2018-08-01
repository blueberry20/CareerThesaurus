function createRecordTextField(f) {

    try {
        if (recordFieldAlreadyAdded(f.name)) {
            
            return;
        }
        addedrecordfieldnames.push(f.name);

        var section = createRecordControlSection();

        section.appendChild(createRecordLabel(f));

        var ti = createRecordTextInput(f, '');
        section.appendChild(createRecordControlContainer(ti));

        //create cookie setter
        createRecordCookieSetterForField(f);
        createRecordValidationForField(f);
        return section;
    }
    catch (e) {
        
        return null;
    }
}
