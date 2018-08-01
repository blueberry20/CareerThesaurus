﻿function createUnifiedForm(unified) {

    $('#formcontainer').html('');
    addedfieldnames = new Array();
    cookiesettercode = '';
    controlvalidationcode = '';

    var formholder = document.getElementById('formcontainer');
    addedfieldnames = new Array();

    var thankscontentdiv = document.createElement('div');
    thankscontentdiv.id = 'thanksdiv';
    var formcontentdiv = document.createElement('div');
    formcontentdiv.id = 'formdiv';


    var submitted = getCookie("school_submitted");
    if (submitted != null && submitted.indexOf(_school_clientid) >= 0) {

        $('#btnsubmitform').hide();
        $('.formauthcontrols').hide();

        thankscontentdiv.innerHTML = '<div><img src="/content/images/kiosk/importantthings/check.png"/><h1 style="margin: 0px;">Info Requested.</h1><br /><p style="font-size: 12pt;">You will be contacted by a school representative shortly.  Please pick up your phone when you see an unfamiliar number.</p></div>';
        formholder.appendChild(thankscontentdiv);
    }
    else {
        

        $('#btnsubmitform').show();
        $('.formauthcontrols').show();

        //Create and hide thanks content for later
        thankscontentdiv.innerHTML = '<div><img src="/content/images/kiosk/importantthings/check.png"/><h1 style="margin: 0px;">Info Requested.</h1><br /><p style="font-size: 12pt;">You will be contacted by a school representative shortly.  Please pick up your phone when you see an unfamiliar number.</p></div>';
        thankscontentdiv.setAttribute('style', 'display: none;');
        formholder.appendChild(thankscontentdiv);

        customform = document.createElement('form');

        try {
            customform.id = 'customform';
            customform.setAttribute('method', 'POST');
            
            addedfieldnames = new Array();

            customform.appendChild(createHiddenInput("client_id", _school_clientid));
            customform.appendChild(createHiddenInput("client_rowkey", _school_clientrowkey));
            customform.appendChild(createHiddenInput("form_id", _school_formid));
            customform.appendChild(createHiddenInput("program", getCookie('careerofinterest')));

            customform.appendChild(createDropdownField({ name: "salutation", label: "Salutation", type: "dropdown", required: true, selectedvalue: "mr" }));

            customform.appendChild(createTextField({ name: "firstname", label: "First Name", type: "text", required: true }));
            customform.appendChild(createTextField({ name: "lastname", label: "Last Name", type: "text", required: true }));

            customform.appendChild(createTextField({ name: "phone", label: "Phone", type: "text", required: true }));
            customform.appendChild(createTextField({ name: "email", label: "Email", type: "text", required: true }));

            customform.appendChild(createTextField({ name: "address1", label: "Address", type: "text", required: true }));
            customform.appendChild(createTextField({ name: "city", label: "City", type: "text", required: true }));
            customform.appendChild(createDropdownField({ name: "state", label: "State", type: "dropdown", required: true }));
            customform.appendChild(createTextField({ name: "zip", label: "Zip Code", type: "text", required: true }));

            customform.appendChild(createDropdownField({ name: "gradyear", label: "H.S. Grad. Year", type: "dropdown", required: true }));

            var gradyear = getCookie("gradyear");
            var igradyear;
            var dobyear = null;
            if (gradyear != null && gradyear != "undefined") {
                igradyear = parseInt(gradyear);
                if (!isNaN(igradyear)) {
                    dobyear = igradyear - 18;
                }
            }


            customform.appendChild(createDropdownField({ name: "dobyear", label: "Year of Birth", type: "dropdown", required: true, selectedvalue: dobyear }));
            customform.appendChild(createDropdownField({ name: "education_level", label: "Education Level", type: "dropdown", required: true }));
            customform.appendChild(createTextField({ name: "gpa", label: "GPA", type: "text", required: true }));

            customform.appendChild(createDropdownField({ name: "military", label: "Millitary", type: "dropdown", required: true }));


            for (var i = 0; i < unified.length; i++) {
                var f = unified[i];
                switch (f.type) {
                    case 'hidden':
                        try {
                            customform.appendChild(createHiddenField(f));
                        }
                        catch (e) { }
                        break;
                    case 'text':
                        try {
                            customform.appendChild(createTextField(f));
                        }
                        catch (e) { }
                        break;
                    case 'checkbox':
                        if (f.name == 'military') {
                            try {
                                customform.appendChild(createDropdownField(f));
                            }
                            catch (e) { }
                        }
                        else {
                            try {
                                customform.appendChild(createCheckboxField(f));
                            }
                            catch (e) { }
                        }
                        break;
                    case 'textarea':
                        try {
                            customform.appendChild(createTextareaField(f));
                        }
                        catch (e) { }
                        break;
                    case 'dropdown':
                        try {
                            customform.appendChild(createDropdownField(f));
                        }
                        catch (e) { }
                        break;
                    case 'fieldgroup':
                        try {
                            customform.appendChild(createFieldgroupField(f));
                        }
                        catch (e) { }
                        break;
                    default: break;
                }
            }

            customform.appendChild(createHiddenInput("campus_key", ''));
            customform.appendChild(createDropdownField({ name: "program_key", label: "Program of Interest", type: "dropdown", required: true, selectedvalue: '' }));

            customform.appendChild(createHiddenInput("client_id", _school_clientid));

            //LEAD ID STUFF
            var leadidinput = document.createElement('input');
            leadidinput.setAttribute('style', 'display: none;');
            leadidinput.setAttribute('type', 'hidden');
            leadidinput.setAttribute('id', 'leadid_token');
            leadidinput.setAttribute('name', 'leadid');
            customform.appendChild(leadidinput);

            var leadidscript = document.createElement('script');
            leadidinput.setAttribute('style', 'display: none;');
            leadidscript.setAttribute('id', 'LeadiDscript');
            leadidscript.setAttribute('type', 'text/javascript');
            leadidscript.innerHTML = "(function () { var s = document.createElement('script'); s.setAttribute('style', 'display: none;'); s.id = 'LeadiDscript_campaign'; s.type = 'text/javascript'; s.async = true; s.src = (document.location.protocol + '//d1tprjo2w7krrh.cloudfront.net/campaign/503244f4-8230-4f22-8bb3-50380a1c4317.js?f=reset'); var LeadiDscript = document.getElementById('LeadiDscript'); LeadiDscript.parentNode.insertBefore(s, LeadiDscript); })();";
            customform.appendChild(leadidscript);
            
            formcontentdiv.appendChild(customform);
            formholder.appendChild(formcontentdiv);

            var form = document.forms['customform'];
            for (var i = 0; i < form.elements.length; i++) {
                if (form.elements[i].name != null && form.elements[i].name != "") {
                    //alert(form.elements[i].name);
                }
            }

            $('.formdropdown').click(function () {
                playSound(sfxspeechon);
                showSelectionVerticallyCentered(this, $(this).attr('id') + 'options');
            });

            //set up Option click
            $('.selectorcontrols ul li input').click(function () {
                playSound(sfxspeechoff);
                var controlid = $(this).attr('controlid');
                $('#' + controlid).html($(this).attr('value'));
                $('#' + controlid).attr('code', $(this).attr('code'));

                var code = $(this).attr('code');
                if ($(this).attr('name') == 'program_key') {
                    if (code != null && code != '') {
                        var campusprogramtokens = code.split('!');
                        if (campusprogramtokens.length == 2) {
                            setCookie('campus_key', campusprogramtokens[0], 7);
                            var programtokens = campusprogramtokens[1].split('.');
                            if (programtokens.length == 2) {
                                setCookie('correct_program_key', programtokens[0], 7);
                                setCookie('program_rowkey', programtokens[1], 7);
                            }
                            else {
                                setCookie('correct_program_key', campusprogramtokens[1], 7);
                            }

                        }
                    }
                }
                else {
                    setCookie($(this).attr('name'), code, 7);
                }

                $('#' + controlid + "options").css('display', 'none');
                $('#' + controlid).removeClass('shadow20');
            });

            $('#formcontainer div[keyboardtype="email"]').press(function () { showKeyboardForEmail(this); });
            $('#formcontainer div[keyboardtype="standard"]').press(function () { showKeyboardForStandard(this); });
            $('#formcontainer div[keyboardtype="phone"]').press(function () { showKeyboardForPhone(this); });
            $('#formcontainer div[keyboardtype="numeric"]').press(function () {
                switch ($(this).attr('name')) {
                    case 'zip':
                        showKeyboardForNumeric(this, false, false, 5);
                        break;
                    case 'gpa':
                        showKeyboardForNumeric(this, true, false, 0);
                        break;
                    default:
                        showKeyboardForNumeric(this);
                        break;
                }
            });

        }
        catch (e) {
            alert(e.message);
        }

        try {
            $('textarea').jtextarea();
        }
        catch (e) {
        }
    }
    
}
