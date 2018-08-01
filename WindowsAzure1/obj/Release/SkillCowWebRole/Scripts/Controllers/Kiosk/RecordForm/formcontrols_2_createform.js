function createRecordForm(unified) {

    $('#recordformcontainer').html('');
    addedrecordfieldnames = new Array();
    recordcookiesettercode = '';
    controlvalidationcode = '';

    var formholder = document.getElementById('recordformcontainer');

    var thankscontentdiv = document.createElement('div');
    thankscontentdiv.id = 'recordthanksdiv';
    var formcontentdiv = document.createElement('div');
    formcontentdiv.id = 'recordformdiv';


    var whatsthis = '';
    
    switch(_record_request_type)
    {
        case 'indeedjob':
            whatsthis = 'Job';
            break;
        case 'udemycourse':
            whatsthis = 'Online Course';
            break;
    }


    var submitted = getCookie(_record_request_type + "_submitted");
    if (submitted != null && submitted.indexOf(_record_request_id) >= 0) {
        $('#btnsubmitrecordform').hide();
        thankscontentdiv.innerHTML = '<div><img src="/content/images/kiosk/importantthings/check.png"/><h1 style="margin: 0px;">Application link was emailed to you</h1><br /><p style="font-size: 12pt;">We sent you an email with a link to this ' + whatsthis + '. You may also get a follow-up call from a SkillCow representative.</p></div>';
        formholder.appendChild(thankscontentdiv);
    }
    else {


        $('#btnsubmitrecordform').show();

        //Create and hide thanks content for later
        thankscontentdiv.innerHTML = '<div><img src="/content/images/kiosk/importantthings/check.png"/><h1 style="margin: 0px;">Application link was emailed to you</h1><br /><p style="font-size: 12pt;">We sent you an email with a link to this ' + whatsthis + '.  You may also get a follow-up call from a SkillCow representative.</p></div>';
        thankscontentdiv.setAttribute('style', 'display: none;');
        formholder.appendChild(thankscontentdiv);

        var headerdiv = document.createElement('div');
        headerdiv.innerHTML = '<h1 style="margin: 0px;">Apply for this '+whatsthis+'</h1><br />';

        formcontentdiv.appendChild(headerdiv);

        customform = document.createElement('form');

        try {
            customform.id = 'recordform';
            customform.setAttribute('method', 'POST');
            
            addedfieldnames = new Array();

            customform.appendChild(createRecordHiddenInput("client_id", 20));
            
            for (var i = 0; i < unified.length; i++) {
                var f = unified[i];
                
                switch (f.type) {
                    case 'hidden':
                        try {
                            customform.appendChild(createRecordHiddenField(f));
                        }
                        catch (e) { }
                        break;
                    case 'text':
                        try {
                            customform.appendChild(createRecordTextField(f));
                        }
                        catch (e) {  }
                        break;
                    case 'checkbox':
                        if (f.name == 'military') {
                            try {
                                customform.appendChild(createRecordDropdownField(f));
                            }
                            catch (e) { }
                        }
                        else {
                            try {
                                customform.appendChild(createRecordCheckboxField(f));
                            }
                            catch (e) { }
                        }
                        break;
                    case 'textarea':
                        try {
                            customform.appendChild(createRecordTextareaField(f));
                        }
                        catch (e) { }
                        break;
                    case 'dropdown':
                        try {
                            
                            customform.appendChild(createRecordDropdownField(f));
                        }
                        catch (e) { }
                        break;
                    case 'fieldgroup':
                        try {
                            customform.appendChild(createRecordFieldgroupField(f));
                        }
                        catch (e) { }
                        break;
                    default: break;
                }
            }
                        
            formcontentdiv.appendChild(customform);
            formholder.appendChild(formcontentdiv);

            var form = document.forms['recordform'];
            for (var i = 0; i < form.elements.length; i++) {
                if (form.elements[i].name != null && form.elements[i].name != "") {
                    
                }
            }

            $('.formdropdown').click(function () {

                try {
                    showRecordSelectionVerticallyCentered(this,
                        $(this).attr('id') + 'options',
                        function (option) {
                            var code = $(option).attr('code');
                            if ($(option).attr('name') == 'program_key') {
                                if (code != null && code != '') {
                                    var tokens = code.split('!');
                                    if (tokens.length == 2) {
                                        setCookie('campus_key', tokens[0], 7);
                                        setCookie('program_key', tokens[1], 7);
                                    }
                                }
                            }
                            else {
                                setCookie($(option).attr('name'), code, 7);
                            }
                        }
                    );
                }
                catch (e) {
                    alert(e.message);
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

