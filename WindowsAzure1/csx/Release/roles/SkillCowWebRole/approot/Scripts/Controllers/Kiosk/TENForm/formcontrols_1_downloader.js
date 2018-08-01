function downloadSingleFeaturedJobForm(clientid, formid) {
    
    $('#formcontainer').html('');

    $.ajax({
        url: appserverurl + "/TENForm/GetFormJson",
        type: "GET",
        data: {
            clientid: clientid,
            formid: formid
        }
    }).done(function (response) {

        if (response.result == 'ok') {

            renderFormFields_FJ(response);
            createEventHandlers_FJ(response);

            /*
            var requiredfields = new Array();

            for (var i = 0; i < response.fields.length; i++) {
                var f = response.fields[i];
                if (isRequiredField_FJ(f)) {
                    requiredfields.push(f);
                }
            }

            //create the form
            try {
                createUnifiedForm_FJ(requiredfields);
            }
            catch (e) {
                alert('Error in createUnifiedForm' + e.message);
            }

            try {
                createUnifiedEventHandlers_FJ(response, requiredfields);
            }
            catch (e) {
                alert('Error in createUnifiedEventHandlers' + e.message);
            }

            try {
                createUnifiedFormValidation_FJ();
            }
            catch (e) {
                alert('Error in createUnifiedFormValidation' + e.message);
            }

            try {
                createUnifiedFormCookieSetter_FJ();
            }
            catch (e) {
                alert('Error in createUnifiedFormCookieSetter' + e.message);
            }
            */
        }
        else {
        }
    }).fail(function () {
    });
}

function isRequiredField_FJ(f) {
    if ($.inArray(f.name, featuredjobrequiredfields) >= 0) {
        return true;
    }
    return false;
}



