var customformfields = false;

function downloadSingleSchoolForm(clientid, formid, custom) {

    
    customformfields = custom;

    $('#formcontainer').html('');

    var requiredfields = new Array();

    
    if (clientid.substring(0, 2) == 'SC') {
        //For direct clients create a static list of require fields
        requiredfields = [
                    { "type": "text", "label": "First Name", "name": "firstname", "value": "", "required": "true" },
                    { "type": "text", "label": "Last Name", "name": "lastname", "value": "", "required": "true" },
                    { "type": "text", "label": "Address", "name": "address1", "value": "", "required": "true" },
                    { "type": "text", "label": "City", "name": "city", "value": "", "required": "true" },
                    { "type": "dropdown", "label": "State", "name": "state", "value": "", "required": "true" },
                    { "type": "text", "label": "Zip Code", "name": "zip", "value": "", "required": "true" },
                    { "type": "text", "label": "Phone Number", "name": "phone", "value": "", "required": "true" },
                    { "type": "text", "label": "E-mail Address", "name": "email", "value": "", "required": "true" },
                    { "type": "dropdown", "label": "Level of Education", "name": "educationlevel", "value": "", "required": "true" },
                    { "type": "dropdown", "label": "Military Affiliation", "name": "military", "value": "", "required": "true" },
                    { "type": "dropdown", "label": "GED or HS Grad Year", "name": "gradyear", "value": "", "required": "true" }
                    ];


        
        processFormFields(null, requiredfields);
    }
    else {

        $.ajax({
            url: appserverurl + "/SchoolForm/GetFormJson",
            type: "GET",
            data: {
                clientid: clientid,
                formid: formid
            }
        }).done(function (response) {
            
            if (response.result == 'ok') {

                for (var i = 0; i < response.fields.length; i++) {

                    var f = response.fields[i];

                    
                    if (!customformfields) {
                        if (isRequiredField(f)) {
                            requiredfields.push(f);
                        }
                    }
                    else {
                        if (f.required == 'true' && f.name!='rate_position') {
                            requiredfields.push(f);
                        }
                    }

                }

                processFormFields(response, requiredfields);
            }
            else {
            }
        }).fail(function (xhr, ajaxOptions, thrownError) {
            debugalert(thrownError);
        });

    }

    
}

function processFormFields(response, requiredfields) {
    //create the form
    try {
        createUnifiedForm(requiredfields);
    }
    catch (e) {
        alert('Error in createUnifiedForm: ' + e.message);
    }

    try {
        
        createUnifiedEventHandlers(response, requiredfields);
    }
    catch (e) {
        alert('Error in createUnifiedEventHandlers: ' + e.message);
    }

    try {
        createUnifiedFormValidation();
    }
    catch (e) {
        alert('Error in createUnifiedFormValidation: ' + e.message);
    }

    try {
        createUnifiedFormCookieSetter();
    }
    catch (e) {
        alert('Error in createUnifiedFormCookieSetter: ' + e.message);
    }
}

function isRequiredField(f) {
    if ($.inArray(f.name, requiredfields) >= 0) {
        return true;
    }
    return false;
}



