function submitCustomForm() {

    if (!_school_form_authorized) {
        alert('Please check the Authorization Box <div style="position: relative; border: 2px solid #fff; width: 40px; height: 40px; display: inline-block; margin-top: 5px; "><img id="authorizationcheckboxcheck" style="position: absolute; left: -9px; top: -23px; width: 60px; height: 60px; opacity: 0.2" src="/content/images/kiosk/importantthings/check.png"/></div> before continuing');
        return;
    }

    if (!validateCustomForm()) {
        return;
    }

    setFormCookies_FJ();
    
    
    //alert('about to save career choices');
    //saveCareerChoicesAsCookies();

    //return;

    
    //saveOptins();

    var json = cookiesAsJsonObjectString();
    //alert(json);

    //return;

    $('#btnsubmitform').hide();
    $('#formdiv').css('opacity',0.5);

    $.ajax({
        url: appserverurl + "/KioskSubmission/SchoolLead",
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
                submitted = _school_clientid;
            }
            else {
                submitted += "," + _school_clientid;
            }
            setCookie("school_submitted", submitted, 7);
            $(".x_school" + _school_clientid).show();
        }
        else {
            $('#btnsubmitform').show();
            $('.formauthcontrols').show();
        }
    }).fail(function () {
        $('#btnsubmitform').show();
        $('.formauthcontrols').show();
        $('#formdiv').css('opacity', 1);
    });
    
}
