function submitCustomForm() {

    if (!_school_form_authorized) {
        alert('Please check the Authorization Box <div style="position: relative; border: 2px solid #fff; width: 40px; height: 40px; display: inline-block; margin-top: 5px; "><img id="authorizationcheckboxcheck" style="position: absolute; left: -9px; top: -23px; width: 60px; height: 60px; opacity: 0.2" src="/content/images/kiosk/importantthings/check.png"/></div> before continuing');
        return;
    }

    try {
        debugalert('Validating form');
        if (!validateCustomForm()) {
            debugalert('Validation failed');
            return;
        }
        debugalert('Validation ok');
    }
    catch (e) {
        debugalert('Error validating form: ' + e.errormessage);
    }

    try {
        debugalert('Setting form cookies');
        setFormCookies();
        debugalert('ok');
    }
    catch (e) {
        debugalert('Error setting form cookies: ' + e.errormessage);
    }

    //alert('about to save career choices');
    //saveCareerChoicesAsCookies();

    //return;

    //saveOptins();

    try {
        debugalert('Cookies as json');
        var json = cookiesAsJsonObjectString();
        debugalert('ok');
    }
    catch (e) {
        debugalert('Error cookiesAsJsonObjectString(): ' + e.errormessage);
    }
    //alert(json);

    //return;

    $('#btnsubmitform').hide();
    $('#formdiv').css('opacity',0.5);

    try {
        debugalert('submitting form');

        var submissionaction = 'SchoolLead';
        if (_school_listingtype == 'scjob') {
            submissionaction = 'JobLead';
        }

        $.ajax({
            url: appserverurl + "/KioskSubmission/" + submissionaction,
            type: "POST",
            data: $.parseJSON(json)
        }).done(function (response) {
            if (response.result == 'ok') {
                playSound(sfxinfobar);
                $('#formdiv').hide();
                $('.formauthcontrols').hide();
                $('#thanksdiv').show();

                var submitted = getCookie("school_submitted");
                if (submitted == null || submitted == "") {
                    submitted = _school_submittedkey;
                }
                else {
                    submitted += "," + _school_submittedkey;
                }
                setCookie("school_submitted", submitted, 7);
                debugalert('submitted list: ' + getCookie("school_submitted"));
                $(".x_school" + _school_submittedkey).show();
            }
            else {
                $('#btnsubmitform').show();
                $('.formauthcontrols').show();
            }
        }).fail(function (xhr, ajaxOptions, thrownError) {
            debugalert('Error submitting form: ' + thrownError);
            $('#btnsubmitform').show();
            $('.formauthcontrols').show();
            $('#formdiv').css('opacity', 1);
        });
    }
    catch (e) {
        debugalert('Error submitting form: ' + e.errormessage);
    }
}
