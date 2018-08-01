function submitRecordForm() {

    debugalert('Checking RECORD FORM authorization');
    if (!validateRecordForm()) {
        return;
    }

    //alert('Zip before setting record form ' + getCookie('zip'));
    setRecordFormCookies();
    //alert('Zip AFTER setting record form ' + getCookie('zip'));

    var json = cookiesAsJsonObjectString();
    
    var data;

    try {
        
        data = $.parseJSON(json);

        //alert(json);
        
        $('#btnsubmitrecordform').hide();
        $('#recordformdiv').css('opacity', 0.5);

        $.ajax({
            url: appserverurl + "/KioskSubmission/RequestRecord",
            type: "POST",
            data: $.parseJSON(json)
        }).done(function (response) {
            if (response.result == 'ok') {
                playSound(sfxinfobar);
                $('#recordformdiv').hide();
                $('#recordthanksdiv').show();

                var submitted = getCookie(_record_request_type + "_submitted");
                if (submitted == null || submitted == "") {
                    submitted = _record_request_id;
                }
                else {
                    submitted += "," + _record_request_id;
                }
                setCookie(_record_request_type + "_submitted", submitted, 7);
                $(".x_" + _record_request_type + _record_request_id).show();

                setCookie("recordsubmitted", "1", 7);
            }
            else {
                $('#btnsubmitrecordform').show();
            }
        }).fail(function () {
            $('#btnsubmitrecordform').show();
            $('#recordformdiv').css('opacity', 1);
        });


        
    }
    catch (e) {
        alert('Error parsing data ' + e.message);
    }

    
    
}
