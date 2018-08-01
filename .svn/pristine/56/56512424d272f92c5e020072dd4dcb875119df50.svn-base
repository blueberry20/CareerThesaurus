function createRecordTouchScreenDropdown(f) {

    var dropdowncontainer = document.createElement('div');

    var dropdown = document.createElement('div');
    dropdown.setAttribute('name', f.name);
    dropdown.setAttribute('id', 'recordform_' + f.name);
    dropdown.setAttribute('class', 'formdropdown');
    
    var cvalue = getCookie(f.name);
    var clabel = getCookie(f.name + '_label');
    
    var hasvalue = false;
    var valuesuppressed = (f.selectedvalue != null && f.selectedvalue == '');

    

    if (!valuesuppressed && isCookieValue(cvalue) && isCookieValue(clabel)) {
        dropdown.setAttribute('code', cvalue);
        //dropdown.setAttribute('style', 'border: thin solid rgba(255,255,255,0.2);');
        dropdown.innerHTML = clabel !=null && clabel != 'undefined' && clabel != 'null' ? clabel : cvalue;
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
    optionscontainer.setAttribute('id', 'recordform_' + f.name + 'options');
    optionscontainer.setAttribute('style', 'position: fixed; right: 0px; top: 0px; height: 100%; width: 674px; background-color: rgba(0,0,0,0.9); display: none; z-index: 99999;');
    optionscontainer.setAttribute('class', 'selectorcontrols');

    var header = document.createElement('h1');
    header.setAttribute('id', 'recordform_' + f.name + 'options_header');
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
        
        button.setAttribute('name', f.name);
        button.setAttribute('code', o.value);
        button.setAttribute('value', o.label);

        li.appendChild(button);
        ul.appendChild(li);


        if (!hasvalue && f.selectedvalue != null && f.selectedvalue != '') {
            if (f.selectedvalue.toString().toLowerCase() == o.value.toString().toLowerCase()) {
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


    
    return dropdowncontainer;

}



function createRecordDropdownField(f) {

    if (recordFieldAlreadyAdded(f.name)) {
        return;
    }
    addedrecordfieldnames.push(f.name);

    var section = createRecordControlSection();
    section.appendChild(createRecordLabel(f));
    section.appendChild(createRecordControlContainer(createRecordTouchScreenDropdown(f)));

    //create cookie setter
    createRecordCookieSetterForField(f);
    createRecordValidationForField(f);
    return section;
}



function createRecordOptionGroups(options) {
    var groups = new Array();

    for (var i = 0; i < options.length; i++) {
        var o = options[i];
        var group = getRecordParentGroup(o, groups);

        group.items.push(o);
            
    }
        
    return groups;
}
function getRecordParentGroup(option, groups) {

    if (option.group2!=null && option.group2 != "") {
        var group1 = getOrCreateRecordGroupByName(option.group1, groups);
        return getOrCreateRecordGroupByName(option.group2, group1.groups);
    }

    return getOrCreateRecordGroupByName(option.group1, groups);
}
function getOrCreateRecordGroupByName(groupname, groups) {
        
    for (var i = 0; i < groups.length; i++) {
        if ((groupname != null && groups[i].name == groupname) || (groupname == null && groups[i].name == "")) {
            return groups[i];
        }
    }
                
    var newGroup = { name: (groupname!=null?groupname:""), groups: new Array(), items: new Array() };
        
    groups.push(newGroup);
        
    return newGroup;
}


function showRecordSelectionVerticallyCentered(control, selectionlist, onitemselected) {

    $('.selectorcontrols').css('display', 'none');
    $('#' + selectionlist).css('display', 'table');

    try {
        $('#recordform_options_header').html('Make your selection');
    }
    catch (e) {
        alert(e.message);
    }


    $('#' + selectionlist + ' ._viewport').niceScroll('#' + selectionlist + ' ._viewport ._scrollablecontent', { cursorcolor: "rgba(255,255,255,0.3)", cursorborder: "1px none #fff" });
    $('#' + selectionlist + ' ._viewport ._scrollablecontent .selectionlist').css('margin-top', 10);
    $('#' + selectionlist + ' ._viewport ._scrollablecontent .selectionlist').animate({ 'margin-top': 0 }, 700);

    //set up Option click
    $('#' + selectionlist + ' ul li input').click(function () {

        $(control).html($(this).attr('value'));
        $(control).attr('code', $(this).attr('code'));

        if (onitemselected != null) {
            onitemselected(this);
        }

        $('#' + selectionlist).css('display', 'none');
        $(control).removeClass('shadow20');
    });
}
