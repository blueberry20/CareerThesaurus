function submitfrmtellus() {

    if ($.trim($('#frmtellusfirstname').val()) == '') {

        alert('Please enter your FIRST NAME');
        $('#frmtellusfirstname').focus();
        return;
    }
    if ($.trim($('#frmtelluszip').val()) == '') {
        alert('Please enter your ZIP');
        $('#frmtelluszip').focus();
        return;
    }
    var reg = /^\d+$/;
    var enteredzip = $.trim($('#frmtelluszip').val());
    if (!(reg.test(enteredzip) && enteredzip.length == 5)) {
        alert('Invalid ZIP code');
        $('#frmtelluszip').focus();
        return;
    }

    if ($.trim($('#frmtellusphone').val()) == '') {
        alert('Please type your Primary Phone Number \n\n** cell phone is preferred');
        $('#frmtellusphone').focus();
        return;
    }
    var enteredNumber = $.trim($('#frmtellusphone').val());
    var formattedNumber = formatPhoneNumber(enteredNumber.replace(/(\s|\.|\-|\(|\))/g, ''));
    if (formattedNumber == "") {
        alert('Invalid phone number');
        $('#frmtellusphone').focus();
        return;
    }
    else {
        $('#frmtellusphone').val(formattedNumber);
    }

    if ($.trim($('#frmtellusemail').val()) == '') {
        alert('Please enter your email');
        $('#frmtellusemail').focus();
        return;
    }

    if (!validateEmail($.trim($('#frmtellusemail').val()))) {
        alert('Invalid email: ' + $('#regemail').val());
        $('#frmtellusemail').focus();
        return;
    }

    setCookie('zip', $('#frmtelluszip').val(), 365);
    setCookie('firstname', $('#frmtellusfirstname').val(), 365);
    setCookie('phone', $('#frmtellusphone').val(), 365);
    setCookie('email', $('#frmtellusemail').val(), 365);

    $('#frmtellus').submit();

    
    generatecallbackscript();
}
function submitfrmregistertoview() {

    if ($.trim($('#registertoviewfirstname').val()) == '') {
        alert('Please enter your FIRST NAME');
        $('#registertoviewfirstname').focus();
        return;
    }
    if ($.trim($('#registertoviewzip').val()) == '') {
        alert('Please enter your ZIP');
        $('#registertoviewzip').focus();
        return;
    }
    var reg = /^\d+$/;
    var enteredzip = $.trim($('#registertoviewzip').val());
    if (!(reg.test(enteredzip) && enteredzip.length == 5)) {
        alert('Invalid ZIP code');
        $('#registertoviewzip').focus();
        return;
    }


    if ($.trim($('#registertoviewphone').val()) == '') {
        alert('Please type your Primary Phone Number \n\n** cell phone is preferred');
        $('#registertoviewphone').focus();
        return;
    }
    var enteredNumber = $.trim($('#registertoviewphone').val());
    var formattedNumber = formatPhoneNumber(enteredNumber.replace(/(\s|\.|\-|\(|\))/g, ''));
    if (formattedNumber == "") {
        alert('Invalid phone number');
        $('#registertoviewphone').focus();
        return;
    }
    else {
        $('#registertoviewphone').val(formattedNumber);
    }

    if ($.trim($('#registertoviewemail').val()) == '') {
        alert('Please enter your email');
        $('#registertoviewemail').focus();
        return;
    }

    if (!validateEmail($.trim($('#registertoviewemail').val()))) {
        alert('Invalid email: ' + $('#registertoviewemail').val());
        $('#registertoviewemail').focus();
        return;
    }

    if ($('#registertoviewgradyear').val() == "") {
        alert('Please select your High School graduation year');
        $('#registertoviewgradyear').focus();
        return;
    }

    if ($('#registertoviewintent').val() == "") {
        alert('Please select your intention on SkillCow.com');
        $('#registertoviewintent').focus();
        return;
    }
    
    setCookie('zip', $('#registertoviewzip').val(), 365);
    setCookie('firstname', $('#registertoviewfirstname').val(), 365);
    setCookie('phone', $('#registertoviewphone').val(), 365);
    setCookie('email', $('#registertoviewemail').val(), 365);
    setCookie('gradyear', $('#registertoviewgradyear').val(), 365);
    setCookie('eduintent', $('#registertoviewintent').val(), 365);

    $('#frmregistertoview').submit();

    
    $('#registertoviewresults').hide();

    showresultannotations('submitfrmregistertoview');
    $('#congrats').show();
    $('#test').css('min-height', 100);

    generatecallbackscript();
}