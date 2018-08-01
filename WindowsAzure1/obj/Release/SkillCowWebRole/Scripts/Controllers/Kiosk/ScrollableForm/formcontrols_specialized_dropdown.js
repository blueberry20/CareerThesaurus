function createTouchScreenDropdown(f) {

    var dropdowncontainer = document.createElement('div');

    var dropdown = document.createElement('div');
    dropdown.setAttribute('name', f.name);
    dropdown.setAttribute('id', 'form_' + f.name);
    dropdown.setAttribute('class', 'formdropdown');
    
    var cvalue = getCookie(f.name);
    var clabel = getCookie(f.name + '_label');

    var hasvalue = false;
    var valuesuppressed = (f.selectedvalue != null && f.selectedvalue == '');

    if (!valuesuppressed && isCookieValue(cvalue) && isCookieValue(clabel)) {
        dropdown.setAttribute('code', cvalue);
        //dropdown.setAttribute('style', 'border: thin solid rgba(255,255,255,0.2);');
        dropdown.innerHTML = clabel != 'undefined' && clabel != 'null' ? clabel : cvalue;
        hasvalue = true;
    }
    else {
        dropdown.setAttribute('code', '');
        var dropdownarrow = document.createElement('img');
        dropdownarrow.setAttribute('src', '/content/images/kiosk/icons/arrow_4.png');
        dropdownarrow.setAttribute('style', 'margin-left: 18px;');
        dropdown.appendChild(dropdownarrow);
    }

    dropdowncontainer.appendChild(dropdown);

    var optionscontainer = document.createElement('div');
    optionscontainer.setAttribute('id', 'form_' + f.name + 'options');
    optionscontainer.setAttribute('style', 'position: fixed; right: 0px; top: 0px; height: 100%; width: 674px; background-color: rgba(0,0,0,0.9); display: none; z-index: 99999;');
    optionscontainer.setAttribute('class', 'selectorcontrols');

    var header = document.createElement('h1');
    header.setAttribute('id', 'form_' + f.name + 'options_header');
    header.innerHTML = 'Please select your ' + f.label;
    header.setAttribute('style', 'position: absolute; top: 4px; margin-left: 74px;');
    optionscontainer.appendChild(header);

    var viewport = document.createElement('div');
    viewport.setAttribute('style', 'margin-left: 264px; top: 100px; height: 700px; overflow-y: scroll; ');
    viewport.setAttribute('class', '_viewport');
    
    var scrollable  = document.createElement('div');
    scrollable.setAttribute('style', 'overflow-x: hidden;');
    scrollable.setAttribute('class', '_scrollablecontent');
    
    var ul = document.createElement('ul');
    ul.setAttribute('class', 'selectionlist');
        
    var options;

    if (f.name == 'educationlevel' || f.name == 'education_level') {
        options = levelsofeducation;
    }
    else if (f.name == 'program_key') {
        options = programsfordropdown;
    }
    else if (f.name == 'military') {
        options = militaryoptions;
    }
    else if (f.name == 'state') {
        options = states;
    }
    else if (f.name == 'salutation') {
        options = salutationoptions;
    }
    else if (f.name == 'dobyear' || f.name == 'gradyear') {
        options = years;
    }

    
    //Populate with options
    for (var i = 0; i < options.length; i++) {
        var o = options[i];
        var li = document.createElement('li');

        var button = document.createElement('input');
        button.setAttribute('type', 'button');
        button.setAttribute('style', 'white-space: normal;');
        button.setAttribute('controlid', 'form_' + f.name);
        button.setAttribute('name', f.name);
        button.setAttribute('code', o.value);
        button.setAttribute('value', o.label);

        li.appendChild(button);
        ul.appendChild(li);


        if (!hasvalue && f.selectedvalue != null && f.selectedvalue != '') {

            if (f.selectedvalue.toString().toLowerCase() == o.value.toString().toLowerCase())
            {
                dropdown.setAttribute('code', o.value);
                dropdown.innerHTML = o.label;
                setCookie(f.name, f.selectedvalue, 7);
            }
        }
    }

    scrollable.appendChild(ul);
    viewport.appendChild(scrollable);

    var header = document.createElement('div');
    header.innerHtml = 'Please select';
    optionscontainer.appendChild(header);

    optionscontainer.appendChild(viewport);

    dropdowncontainer.appendChild(optionscontainer);


    addedfieldnames.push(f.name);

    return dropdowncontainer;

}



function createDropdownField(f) {

    if (fieldAlreadyAdded(f.name)) {
        return;
    }
    addedfieldnames.push(f.name);

    var section = createControlSection();
    section.appendChild(createLabel(f));

    if (ismobile) {
        section.appendChild(createControlContainer(createDropdown(f)));
    }
    else {
        section.appendChild(createControlContainer(createTouchScreenDropdown(f)));
    }

    //create cookie setter
    createCookieSetterForField(f);
    createValidationForField(f);

    return section;
}

function createDropdown(f, attributes) {

    var element = document.createElement('select');
    element.setAttribute('name', f.name);
    element.setAttribute('id', 'form_' + f.name);

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

    var options;

    if (f.name == 'educationlevel' || f.name == 'education_level') {
        options = levelsofeducation;
    }
    else if (f.name == 'program_key') {
        options = programsfordropdown;
    }
    else if (f.name == 'military') {
        options = militaryoptions;
    }
    else if (f.name == 'state') {
        options = states;
    }
    else if (f.name == 'salutation') {
        options = salutationoptions;
    }
    else if (f.name == 'dobyear' || f.name == 'gradyear') {
        options = years;
    }

    var cvalue = getCookie(f.name);
    var hasvalue = false;
    var valuesuppressed = (f.selectedvalue != null && f.selectedvalue == '');
        
    if (options != null) {
        for (var i = 0; i < options.length; i++) {
            var o = options[i];
            var option = document.createElement('option');
            option.setAttribute('value', o.value);
            option.innerHTML = o.label;

            if (!valuesuppressed && isCookieValue(cvalue) && o.value==cvalue) {
                option.setAttribute('selected', 'true');
            }

            element.appendChild(option);
        }
    }
    else {
        alert(f.name + ' options: ' + f.options);
        var optgroups = createOptionGroups(f.options);
        var optionContainer;
        for (var g1 = 0; g1 < optgroups.length; g1++) {
            var group1 = optgroups[g1];
            var group1optgroup;
            optionContainer = element;
            if (group1.name != "") {
                group1optgroup = document.createElement('optgroup');
                group1optgroup.setAttribute('label', group1.name);
                optionContainer = group1optgroup;
            }

            if (group1.items.length > 0) {

                for (var i = 0; i < group1.items.length; i++) {

                    var o = group1.items[i];
                    var option = document.createElement('option');
                    option.setAttribute('value', o.value.replace('None Military', 'Non-Military'));
                    option.setAttribute('class', o.cssclass);
                    //option.setAttribute('style', o.style);
                    option.innerHTML = o.label;
                    optionContainer.appendChild(option);

                }
            }
            
            for (var g2 = 0; g2 < group1.groups.length; g2++) {
                var group2 = group1.groups[g2];
                var group2optgroup = document.createElement('optgroup');
                group2optgroup.setAttribute('label', group2.name);
                for (var i = 0; i < group2.items.length; i++) {
                    var o = group2.items[i];
                    var option = document.createElement('option');
                    option.setAttribute('value', o.value.replace('None Military', 'Non-Military'));
                    option.setAttribute('class', o.cssclass);
                    //option.setAttribute('style', o.style);
                    option.innerHTML = o.label;
                    group2optgroup.appendChild(option);
                }
                optionContainer.appendChild(group2optgroup);
            }

            if (group1optgroup != null) {
                element.appendChild(group1optgroup);
            }
        }
    }
    
                
    return element;
}

function createOptionGroups(options) {
    var groups = new Array();

    for (var i = 0; i < options.length; i++) {
        var o = options[i];
        var group = getParentGroup(o, groups);

        group.items.push(o);
            
    }
        
    return groups;
}
function getParentGroup(option, groups) {

    if (option.group2!=null && option.group2 != "") {
        var group1 = getOrCreateGroupByName(option.group1, groups);
        return getOrCreateGroupByName(option.group2, group1.groups);
    }
        
    return getOrCreateGroupByName(option.group1, groups);
}
function getOrCreateGroupByName(groupname, groups) {
        
    for (var i = 0; i < groups.length; i++) {
        if ((groupname != null && groups[i].name == groupname) || (groupname == null && groups[i].name == "")) {
            return groups[i];
        }
    }
                
    var newGroup = { name: (groupname!=null?groupname:""), groups: new Array(), items: new Array() };
        
    groups.push(newGroup);
        
    return newGroup;
}


function showSelectionVerticallyCentered(control, selectionlist) {

    $('.selectorcontrols').css('display', 'none');
    $('#' + selectionlist).css('display', 'table');

    try {
        $('#form_options_header').html('Make your selection');
    }
    catch (e) {
        alert(e.message);
    }

    $('#' + selectionlist + ' ._viewport').niceScroll('#' + selectionlist + ' ._viewport ._scrollablecontent', { cursorcolor: "rgba(255,255,255,0.3)", cursorborder: "1px none #fff" });
    $('#' + selectionlist + ' ._viewport ._scrollablecontent .selectionlist').css('margin-top', 10);
    $('#' + selectionlist + ' ._viewport ._scrollablecontent .selectionlist').animate({ 'margin-top': 0 }, 700);
}
