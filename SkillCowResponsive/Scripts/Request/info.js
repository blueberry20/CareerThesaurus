﻿function getCityAndState(zip, callback) {
    $.ajax({
        url: "http://ZiptasticAPI.com/" + zip,
        cache: false,
        dataType: "json",
        type: "GET",
        success: function (result) {
            setCookie('formcity', result.city.toLowerCase(), 7);
            setCookie('formstate', result.state, 7);
            setCookie('formzip', zip, 7);
            searchZipcode = zip;
            searchState = result.state;
            searchCity = result.city.toLowerCase();
            if (callback)
                callback(searchCity, searchState, searchZipcode);
        }, error: function (error) {
            console.log(error);
            if (callback)
                callback();
        }
    });
}

function getSchoolFormId() {
    $.ajax({
        url: appserverurl + '/Jobs/getschoolformid',
        type: 'POST',
        dataType: 'json',
        data: {
            filter: searchFilter,
            value: searchValue,
            zipcode: searchZipcode
        }
    }).success(function (response) {
        //console.log(response);
        if (response.results.searchresults) {
            var capsules = response.results.searchresults.capsule;
            school = true;
            if (capsules instanceof Array) {
                form_id = capsules[0].id;
                $('.description').text(capsules[0].client_frontendname);
            }
            else {
                form_id = capsules.id;
                $('.description').text(capsules.client_frontendname);
            }

            getForm(form_id);
        }
    }).error(function (response) {
        console.log(response);
    });
}

function getJobFormId() {
    $.ajax({
        url: appserverurl + '/Jobs/getjobformid',
        type: 'POST',
        dataType: 'json',
        data: {
            zipcode: searchZipcode,
            titlename: titleName
        }
    }).success(function (response) {
        //console.log(response);
        if (response.results.root) {
            var listings = response.results.root.tab.type == 'local' ? response.results.root.tab.listings.listing : null;
            //for (var i = 0; i < capsules.length; i++) {
            //    getForm(capsules[i].id);
            //}
            if (listings) {
                form_id = listings[0].form_id;
                $('.description').text(listings[0].client_name);
                //getForm(form_id);
            }
        }
    }).error(function (response) {
        console.log(response);
    });
}

function showNextSchool(school, contactInfo) {
    $('.description').text(school.client_frontendname);
    $('#infoWrapper, #header2').remove();
    $('#contactInfo').html('');
    $('#submitFormBtn').closest('.row').remove();
    $('.disclaimer').closest('.row').remove();
    $('#other-schools-wrapper').remove();
   // $('#formWrapper').removeClass('col-lg-8').addClass('col-lg-12');
    $('#LeadiDscript').remove();
    $('#LeadiDscript_campaign').remove();
    getForm(searchCity, searchState, searchZipcode, school, contactInfo);
}

function getForm(formCity, formState, formZip, nextSchool, contactInfo) {
    if (nextSchool) {
        programForForm = nextSchool;
        var formID = nextSchool.id;
    } else {
        var programs = localStorage.programs;
        programForForm = JSON.parse(programs);
        var formID = getCookie('formid');
    }    
    var otherSchools = [];
    if (localStorage.otherSchools && !nextSchool) {
        otherSchools = JSON.parse(localStorage.otherSchools);
        for (var i = 0; i < otherSchools.length; i++) {
            if (otherSchools[i].id != formID) {
                $('#other-schools').append('<div class="cells col-lg-12"><div class="schoolLink" data-programs=\'' + JSON.stringify(otherSchools[i]).replace(/\s/g, ' ').replace(/\'/g, '').replace(/\#text/g, 'text') + '\' formid="' + otherSchools[i].id + '" client_frontendname="' + otherSchools[i].client_frontendname + '"><div class="check-mark col-lg-4"><input type="checkbox" id="school_' + i + '" class="more-schools" value=""><label for="school_' + i + '"><img src="' + otherSchools[i].image + '"/></label></div></div>');
            }
        }
        if (otherSchools.length == 1) {
            $('#other-schools-wrapper').remove();
           // $('#formWrapper').removeClass('col-lg-8').addClass('col-lg-12');
        }
        $('.more-schools').click(function () {
            if ($('.more-schools').is(':checked')) {
                $('#submitFormBtn').text('Next');
            } else {
                $('#submitFormBtn').text('Submit');
            }
        });
    }
    if (school && !nextSchool) {
        if (programForForm.id != formID) {
            console.log('error');
        }
    } else {
        if (programForForm.form_id != formID) {
            console.log('error');
        }
    }
    standardFields(formID, formCity, formState, formZip, contactInfo);
    $.ajax({
        url: appserverurl + '/Request/getform',
        type: 'POST',
        dataType: 'json',
        data: {
            id: formID
        }
    }).success(function (response) {
        //console.log(response);
        if (!response.results.error) {
            generateContent(response, programForForm);
        }
    }).error(function (response) {
        console.log(response);
    });
}

function enhancedLabel(label, name) {
    if (label == null)
        label = "";
    switch (label.toLowerCase()) {
        case "country":
            return "Which country do you live in?";
        case "education level":
        case "level of education":
            return "What is your education level?";
        case "best time to contact":
            return "What is the best time to reach you?";
        case "location":
        case "preferred location":
            return "What location do you prefer?";
        case "position":
            return "What position do you prefer?";
        case "program":
        case "program of interest":
            return "What program are you interested in?";
        case "program category":
            return "What program category are you interested in?";
        case "campus":
        case "campus location":
            return "What campus do you prefer?";
        case "gpa":
            return "What is your GPA?";
        case "h.s. grad year":
        case "ged or hs grad year":
            return "What year did you graduate High School?";
        case "startdate":
        case "start date":
        case "enrollment startdate":
            return "When do you prefer to start?";
        case "military":
        case "military affiliation":
            return "Are you affiliated with the military or a military veteran?";
        case "us citizen":
            return "Are you US citizen?";
        case "age:":
        case "age":
            return "How old are you?";
        default:
            return label;
    }
}

function applyFilters() {
    if (filters instanceof Array) {
        var filter = [].concat(filters);
    } else {
        var filter = new Array();
        filter.push(filters);
    }
    for (var i = 0; i < filter.length; i++) {
        if (filter[i].rule instanceof Array) {
            var rules = [].concat(filter[i].rule);
        } else {
            var rules = new Array();
            rules.push(filter[i].rule);
        }
        for (var r = 0; r < rules.length; r++) {
            if (rules[r].line instanceof Array) {
                var lines = [].concat(rules[r].line);
            } else {
                var lines = new Array();
                lines.push(rules[r].line);
            }
            var verify = [];
            for (var l = 0; l < lines.length; l++) {
                var equal = true;
                if (lines[l].indexOf('!=') != -1) {
                    equal = false;
                    lines[l] = lines[l].replace('!', '');
                }
                var conditions = lines[l].split('=');
                var parent = $('[name="' + conditions[0] + '"]').closest('.wrapper');
                if (conditions[0] == 'program_type') {
                    var value = $('[name="program_key"]').find('[value="' + $('[name="program_key"]').val() + '"]').attr('program_type');
                } else {
                    var value = $('[name="' + conditions[0] + '"]').val();
                }
                if (typeof value === 'undefined' || ($(parent).css('display') == 'none' && typeof $(parent).attr('rule') != 'undefined')) {
                    verify = [];
                    break;
                }
                var reg = conditions[1].split('||').filter(function (e) { return e }).join('|').replace(/\./g, '\.').replace(/\*/g, '[.]*');
                reg = reg == '' ? '^$' : reg;
                var regex = new RegExp('^(' + reg + ')$');
                //console.log(regex);
                if (regex.test(value)) {
                    rule = equal ? true : false;
                } else {
                    rule = equal ? false : true;
                }
                //console.log(conditions[0] + ' - ' + value + ' - ' + equal + ' - ' + regex.test(value) + ' - ' + rule);
                verify.push(rule);
            }
            if (verify.length > 0 && verify.every(Boolean))
                return true;
        }
    }
    return false;
}

function submitForm() {
    var submit = true;
    if (!validateForm()) {
        //not valid
        return;
    }
    if (applyFilters()) {
        //filtered
        submit = false;
    }
    if ($('[name="campus_key"]').val() == null && $('[name="program_key"]').val() == null)
        return;

    var ctJsonArray = [];
    $('[name]').each(function (index, element) {
        var parent = $(element).closest('.wrapper');
        if ($(element).hasClass('required') && $(element).attr('type') != 'hidden') {
            if ($(parent).css('display') == 'none' && typeof $(parent).attr('rule') == 'undefined') {
                ctJsonArray.push('"' + $(element).attr('name') + '":"' + $(element).val() + '"');
                //console.log(index + ' - ' + $(element).attr('name') + ' - ' + $(element).val());
            } else if ($(parent).css('display') != 'none') {
                ctJsonArray.push('"' + $(element).attr('name') + '":"' + $(element).val() + '"');
                //console.log(index + ' - ' + $(element).attr('name') + ' - ' + $(element).val());
            }
        } else if ($(element).attr('type') == 'hidden' || $(element).attr('name') == 'tcpa_consent') {
            if ($(element).attr('name') == 'tcpa_disclosure') {
                var text = $('[for="leadid_tcpa_disclosure"]').text();
                text = text.replace(/\s/g, ' ').replace(/[^a-zA-Z0-9\.\,\"\'\?\!\/\:\;\s]/g, '').replace(/\"/g, '\\"');
                ctJsonArray.push('"' + $(element).attr('name') + '":"' + text + '"');
            } else {
                ctJsonArray.push('"' + $(element).attr('name') + '":"' + $(element).val() + '"');
            }
            //console.log(index + ' - ' + $(element).attr('name') + ' - ' + $(element).val());
        }
    });
    var json = '{"submit":' + submit + ',' + ctJsonArray.join(',') + '}';
    var action = school ? 'School' : 'Job';

    //============================================================================================================================================================
    //return;
    //============================================================================================================================================================

    $.ajax({
        url: appserverurl + "/Request/Submit" + action,
        type: 'POST',
        data: $.parseJSON(json)
    }).done(function (response) {
        $('.more-schools').each(function (index, element) {
            if ($(element).prop('checked') && !moreThenOneSchool) {
                moreSchools.push($(element).closest('.schoolLink').data('programs'));
            }
        });

        if (moreSchools.length != 0) {
            moreThenOneSchool = true;
            var contactInfo = { firstname: $('[name="firstname"]').val(), lastname: $('[name="lastname"]').val(), address1: $('[name="address1"]').val(), city: $('[name="city"]').val(), state: $('[name="state"]').val(), zipcode: $('[name="zip"]').val(), phone: $('[name="phone"]').val(), email: $('[name="email"]').val() };
            var nextSchool = moreSchools[0];
            moreSchools.shift();
            showNextSchool(nextSchool, contactInfo);
        } else {
            moreThenOneSchool = false;
            window.location = '/Request/ThankYou';
        }
    }).fail(function (error) {
        console.log(error);
    });
}

function validateForm() {
    var error = false;
    $('.required:visible').each(function () {
        switch ($(this).attr('validation')) {
            case 'name':
                if (validateName(this.value)) {
                    $(this).parent().removeClass('has-error');
                } else {
                    $(this).parent().addClass('has-error');
                    error = true;
                }
                break;
            case 'email':
                if (validateEmail(this.value)) {
                    $(this).parent().removeClass('has-error');
                } else {
                    $(this).parent().addClass('has-error');
                    error = true;
                }
                break;
            case 'address':
                if (validateAddress(this.value)) {
                    $(this).parent().removeClass('has-error');
                } else {
                    $(this).parent().addClass('has-error');
                    error = true;
                }
                break;
            case 'phone':
                if (validatePhone(this.value)) {
                    $(this).parent().removeClass('has-error');
                } else {
                    $(this).parent().addClass('has-error');
                    error = true;
                }
                break;
            case 'zip':
                if (validateZip(this.value)) {
                    $(this).parent().removeClass('has-error');
                } else {
                    $(this).parent().addClass('has-error');
                    error = true;
                }
                break;
            case 'text':
                if (validateText(this.value)) {
                    $(this).parent().removeClass('has-error');
                } else {
                    $(this).parent().addClass('has-error');
                    error = true;
                }
                break;
            default:
                if ($(this).prop('type') == 'checkbox') {
                    if ($(this).prop('checked')) {
                        $(this).closest('form-group').removeClass('has-error');
                    } else {
                        $(this).closest('form-group').addClass('has-error');
                        error = true;
                    }
                } else {
                    if ($(this).val() == null || $(this).val() == 'null') {
                        $(this).closest('form-group').addClass('has-error');
                        error = true;
                    } else {
                        $(this).closest('form-group').removeClass('has-error');
                    }
                }
        }
    });
    if (error) {
        $('html,body').animate({
            scrollTop: $(".has-error").offset().top - 50
        });
        return false;
    }

    //return false;
    //==================

    return true;
}

function validateEmail(email) {
    if (email) {
        var reg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return reg.test(email);
    }
    return false;
}

function validateZip(zip) {
    var reg = new RegExp(/^\d{5}(?:[-\s]\d{4})?$/);
    return reg.test(zip);
}

function validateAddress(addressstring) {
    if (!addressstring)
        return false;
    var x = $.trim(addressstring).toLowerCase();

    //1- there is at least one SPACE in the field
    var hasspace = x.indexOf(" ") > 0;

    //2- address does not have @@
    var noatsign = x.indexOf("@") < 0;

    //3- address is not a state - like NY||NC||AL
    //5- address doesnt contain "NA||na||N/A"
    var longerthantwoletters = x.length > 3;

    //6- address doesnt contain "unknown"
    var notunknown = x.indexOf("unknown") < 0;

    //7- address doesnt contain exclusively numbers
    var onlynumbers = /^\d+$/.test(x.replace(/\s/g, ''));

    if (hasspace && noatsign && longerthantwoletters && notunknown && !onlynumbers) {
        return true;
    }
    else {
        return false;
    }

}

function validateName(name) {
    if (name)
        if (name.length > 0)
            return true;
    return false;
}

function validateText(text) {
    if (text)
        if (text.length > 0)
            return true;
    return false;
}

function validatePhone(phone) {
    if (phone) {
        var formattedNumber = formatPhoneNumber(phone.replace(/(\s|\.|\-|\(|\))/g, ''));
        if (formattedNumber == "") {
            return false;
        }
        return true;
    }
    return false;
}
function formatPhoneNumber(str) {
    var raw_number = str.replace(/([^0-9]|\.|\-|\(\))/g, '');
    var regex1 = /^1?([2-9]..)([2-9]..)(....)$/;
    if (!regex1.test(raw_number)) {
        return "";
    } else {
        return raw_number.replace(regex1, '$1$2$3');
    }
}

function campusChange(value) {
    $('[name="program_key"]').html('');
    var careerId = degreetaxonomy[degreetaxonomy.map(function (e) { return e[searchFilter + 'id']; }).indexOf(searchValue)].careerid.toString();
    if (programGroups.length > 1 || programGroups[0] != '') {
        for (var i = 0; i < programGroups.length; i++) {
            $('[name="program_key"]').append('<optgroup label="' + programGroups[i] + '"></optgroup>')
        }
        var el = 'optgroup[label="';
    } else {
        var el = 'select[name="program_key';
    }
    if (school) {
        var programs = programForForm.programs.map(function (x) { return decodeURIComponent(x.id) });
    } else {
        var programs = programForForm.program_values.map(function (x) { return decodeURIComponent(x.item.value) });
    }
    for (var i = 0; i < programKeys.length; i++) {
        if (programKeys[i].campus == value || programKeys[i].campus == '' || $('[name="campus_key"]').attr('type') == 'hidden') {
            if ((programs.indexOf(programKeys[i].value) != -1 && school)) {
                //if (programKeys[i].careerid.toString().indexOf(careerId.toString()) != -1 && school) {
                $(el + programKeys[i].group + '"]').append('<option value="' + programKeys[i].value + '" program_type="' + programKeys[i].program_type + '">' + programKeys[i].label + '</option>');
            } else if (!school && programs.indexOf(programKeys[i].label) != -1) {
                $(el + programKeys[i].group + '"]').append('<option value="' + programKeys[i].value + '" program_type="' + programKeys[i].program_type + '">' + programKeys[i].label + '</option>');
            }
        }
    }
    $('optgroup:empty').remove();
}

function zipcodeInput(value, programForForm) {
    searchState = getCookie('formstate');
    if (school) {
        var campuskey = programForForm.campuskey.map(function (x) { return decodeURIComponent(x.id) });
    } else {
        var campuskey = programForForm.campus_key.map(function (x) { return decodeURIComponent(x) });
    }
    $('[name="campus_key"]').html('');
    for (var i = 0; i < campusKeys.length; i++) {
        if ((campusKeys[i].geotargeting.indexOf(value) != -1 || campusKeys[i].geotargeting.indexOf(searchState) != -1 || campusKeys[i].geotargeting == '') && campuskey.indexOf(campusKeys[i].value) != -1 && school) {
            $('[name="campus_key"]').append('<option value="' + campusKeys[i].value + '">' + campusKeys[i].label + '</option>');
        } else if (!school && campuskey.indexOf(campusKeys[i].value) != -1) {
            $('[name="campus_key"]').append('<option value="' + campusKeys[i].value + '">' + campusKeys[i].label + '</option>');
        }
    }
    $('select[name=campus_key]').trigger('onchange');
}

function toggleRules(name) {
    $('[rule*="' + name + '"]').each(function () {
        var trule = $(this).attr('rule').split('=');
        if ($('[name="' + trule[0] + '"]')[0].outerHTML.indexOf('radio') != -1) {
            var rads = document.getElementsByName(trule[0]);
            var value;
            for (var i = 0; i < rads.length; i++) {
                if (rads[i].checked) {
                    value = rads[i].value;
                }
            }
            var display = trule[1].split('||').indexOf(value) != -1 && $('[name="' + trule[0] + '"]').closest('.wrapper').css('display') != 'none' ? '' : 'none';
            //var display = trule[1].split('||').indexOf(value) != -1 && $('[name="' + trule[0] + '"]').closest('.wrapper').hasClass('hiddenWrapper') ? true : false;
        } else {
            var display = trule[1].split('||').indexOf($('[name="' + trule[0] + '"]').val()) != -1 && $('[name="' + trule[0] + '"]').closest('.wrapper').css('display') != 'none' ? '' : 'none';
            //var display = trule[1].split('||').indexOf($('[name="' + trule[0] + '"]').val()) != -1 && $('[name="' + trule[0] + '"]').closest('.wrapper').hasClass('hiddenWrapper') ? true : false;
        }
        $(this).prev().css('display', display);
        if (display != '') {
            $(this).prev().removeClass('visibleSpan');
        } else {
            $(this).prev().addClass('visibleSpan');
        }
        $(this).css('display', display).children().trigger('onchange');
    });
    $('.visibleSpan').each(function (index) {
        $(this).find('.number').text(index + 1);
    });
}

function standardFields(formID, formCity, formState, formZip, contactInfo) {
    $('#contactInfo').append('<div class="wrapper hiddenWrapper"><div class="form-group row"><input type="hidden" class="hidden" name="form_id" value="' + formID + '"></div></div>');
    $('#contactInfo').append('<div class="wrapper hiddenWrapper"><div class="form-group row"><input type="hidden" class="hidden" name="program" value="' + 0 + '"></div></div>');
    $('#contactInfo').append('<div class="wrapper"><div class="form-group row"><label class="shortLabel col-lg-3 col-md-4" for="salutation">Salutation</label><div class="shortField col-lg-9 col-md-8"><select class="form-control required" id="salutation" name="salutation">' +
        '<option value="MR">MR.</option><option value="MS">MS.</option><option value="MRS">MRS.</option></select></div></div></div>');
    $('#contactInfo').append('<div class="wrapper"><div class="form-group row"><label class="shortLabel col-lg-3 col-md-4" for="firstname" >First Name</label><div class="shortField col-lg-9 col-md-8"><input type="text" class=" form-control required" validation="name" name="firstname" id="firstname" value=""></div></div></div>');
    $('#contactInfo').append('<div class="wrapper"><div class="form-group row"><label class="shortLabel col-lg-3 col-md-4" for="lastname" >Last Name</label><div class="shortField col-lg-9 col-md-8"><input type="text" class=" form-control required" validation="name" name="lastname" id="lastname" value=""></div></div></div>');
    $('#contactInfo').append('<div class="wrapper"><div class="form-group row"><label class="shortLabel col-lg-3 col-md-4" for="address1" >Address</label><div class="shortField col-lg-9 col-md-8"><input type="text" class=" form-control required" validation="address" name="address1" id="address1" value=""></div></div></div>');
    $('#contactInfo').append('<div class="wrapper"><div class="form-group row"><label class="shortLabel col-lg-3 col-md-4" for="address2" >Address 2</label><div class="shortField col-lg-9 col-md-8"><input type="text" class="form-control" validation="address" name="address2" id="address2" value=""></div></div></div>');
    $('#contactInfo').append('<div class="wrapper hiddenWrapper"><div class="form-group row"><label class="shortLabel col-lg-3 col-md-4" for="city" >City</label><div class="shortField col-lg-9 col-md-8"><input type="text" class="form-control required" validation="text" name="city" id="city" value="" disabled></div></div></div>');
    $('#contactInfo').append('<div class="wrapper hiddenWrapper"><div class="form-group row"><label class="shortLabel col-lg-3 col-md-4" for="state" >State</label><div class="shortField col-lg-9 col-md-8"><select class="required form-control" id="state" name="state" disabled>' +
        '<option value="AL">Alabama</option><option value="AK">Alaska</option><option value="AZ">Arizona</option><option value="AR">Arkansas</option>' +
        '<option value="CA">California</option><option value="CO">Colorado</option><option value="CT">Connecticut</option><option value="DE">Delaware</option>' +
        '<option value="DC">District of Columbia</option><option value="FL">Florida</option><option value="GA">Georgia</option><option value="HI">Hawaii</option>' +
        '<option value="ID">Idaho</option><option value="IL">Illinois</option><option value="IN">Indiana</option><option value="IA">Iowa</option><option value="KS">Kansas</option>' +
        '<option value="KY">Kentucky</option><option value="LA">Louisiana</option><option value="ME">Maine</option><option value="MD">Maryland</option><option value="MA">Massachusetts</option>' +
        '<option value="MI">Michigan</option><option value="MN">Minnesota</option><option value="MS">Mississippi</option><option value="MO">Missouri</option><option value="MT">Montana</option>' +
        '<option value="NE">Nebraska</option><option value="NV">Nevada</option><option value="NH">New Hampshire</option><option value="NJ">New Jersey</option><option value="NM">New Mexico</option>' +
        '<option value="NY">New York</option><option value="NC">North Carolina</option><option value="ND">North Dakota</option><option value="OH">Ohio</option><option value="OK">Oklahoma</option>' +
        '<option value="OR">Oregon</option><option value="PA">Pennsylvania</option><option value="RI">Rhode Island</option><option value="SC">South Carolina</option>' +
        '<option value="SD">South Dakota</option><option value="TN">Tennessee</option><option value="TX">Texas</option><option value="UT">Utah</option><option value="VT">Vermont</option>' +
        '<option value="VA">Virginia</option><option value="WA">Washington</option><option value="WV">West Virginia</option><option value="WI">Wisconsin</option><option value="WY">Wyoming</option>' +
        '<option value="OT">other</option></select></div></div></div>');
    $('#contactInfo').append('<div class="wrapper hiddenWrapper"><div class="form-group row"><label class="shortLabel col-lg-3 col-md-4" for="zip" >Zip</label><div class="shortField col-lg-9 col-md-8"><input type="text" class=" form-control required" validation="zip" name="zip" id="zip" value="" oninput="zipcodeInput(this.value)" disabled></div></div></div>');

    $('#contactInfo').append('<div id="locationInfo" class="col-lg-9 col-lg-offset-3 col-md-8 col-md-offset-4">' + formCity + ' ' + formState + ' ' + searchZipcode + '</div>');

    $('#contactInfo').append('<div class="wrapper"><div class="form-group row"><label class="shortLabel col-lg-3 col-md-4" for="phone" >Phone (mobile preferred)</label><div class="shortField col-lg-9 col-md-8"><input type="text" class=" form-control required" validation="phone" name="phone" id="phone" value=""></div></div></div>');
    $('#contactInfo').append('<div class="wrapper"><div class="form-group row"><label class="shortLabel col-lg-3 col-md-4" for="phone2" >Alt Phone</label><div class="shortField col-lg-9 col-md-8"><input type="text" class=" form-control" validation="phone" name="phone2" id="phone2" value=""></div></div></div>');
    $('#contactInfo').append('<div class="wrapper"><div class="form-group row"><label class="shortLabel col-lg-3 col-md-4" for="email" >Email</label><div class="shortField col-lg-9 col-md-8"><input type="text" class=" form-control required" validation="email" name="email" id="email" value=""></div></div></div>');
    $('.form').append('<h2 id="header2">Please answer the following</h2>');
    $('.form').append('<div id="infoWrapper" class="row"><div id="additionalInfo" class="row"></div></div>');
    if (!formCity || !formState || !searchZipcode) {
        $('#locationInfo').hide();
        $('[name="city"]').closest('.wrapper').removeClass('hiddenWrapper');
        $('[name="state"]').closest('.wrapper').removeClass('hiddenWrapper');
        $('[name="zip"]').closest('.wrapper').removeClass('hiddenWrapper');
    }
    $('[name="city"]').val(formCity);
    $('[name="state"]').val(formState);
    $('[name="zip"]').val(searchZipcode);
    if (contactInfo) {
        $('[name="firstname"]').val(contactInfo.firstname);
        $('[name="lastname"]').val(contactInfo.lastname);
        $('[name="address1"]').val(contactInfo.address1);
        $('[name="phone"]').val(contactInfo.phone);
        $('[name="email"]').val(contactInfo.email);
        $('#contactInfo, #contact-info-header').hide();
        $('#header2').text('This school needs some additional info');
    }
}

function generateContent(response, programForForm) {
    filters = response.results.form.filters ? response.results.form.filters.filter : null;
    var formComponentsArray = [];
    var formfields = response.results.form.formfields.input;
    var imageUrl = response.results.form.image.src;
    $('.logo').html('<img src="' + imageUrl + '"/>');
    for (var i = 0; i < formfields.length; i++) {
        var currentField = formfields[i];
        var group = currentField.fieldgroup ? currentField.fieldgroup.label : i;
        if (currentField.hiding) {
            var rule = currentField.hiding.conditions.rule != 'adrep_id!=' ? 'rule="' + currentField.hiding.conditions.rule + '"' : ''
        } else {
            var rule = '';
        }
        if (currentField.type == 'hidden') {
            var label = '';
            var html = '<input type="hidden" class="hidden" name="' + currentField.name + '" value="' + currentField.value + '">';

        } else if (currentField.type == 'text') {
            var required = currentField.required == 'true' ? 'required' : '';
            var label = currentField.label == null ? '' : '<label class="questionLabel" for="' + currentField.name + '">' + enhancedLabel(currentField.label, currentField.name) + '</label>';
            var value = currentField.value == null ? '' : currentField.value;
            var html = '<div><input type="text" class=" form-control ' + required + '" name="' + currentField.name + '" id="' + currentField.name + '" validation="' + currentField.validation + '" value="' + value + '"></div>';
        } else if (currentField.type == 'dropdown') {
            var required = currentField.required == 'true' ? 'required' : '';
            var label = currentField.label == null ? '' : '<label class="questionLabel" for="' + currentField.name + '">' + enhancedLabel(currentField.label, currentField.name) + '</label>';
            var value = currentField.value == null ? '' : currentField.value;
            var html = '<div><select class="form-control ' + required + '" id="' + currentField.name + '" name="' + currentField.name + '">';
            var options = currentField.optionlist ? currentField.optionlist.option : [];
            if (Object.prototype.toString.call(options) === '[object Array]') {
                for (var o = 0; o < options.length; o++) {
                    var currentOption = options[o];
                    var dataCampus = currentOption.campus ? 'data-campus="' + currentOption.campus + '"' : '';
                    var dataGeotargeting = currentOption.geotargeting ? 'data-geotargeting="' + currentOption.geotargeting + '"' : '';
                    var dataGroup = currentOption.group ? 'data-group="' + currentOption.group + '"' : '';
                    var dataType = currentOption.type ? 'data-type="' + currentOption.type + '"' : '';
                    var dataCareerId = currentOption.career ? 'data-careerid="' + currentOption.career.id + '"' : '';
                    if (currentOption.career) {
                        var dataCareerId = Object.prototype.toString.call(currentOption.career) === '[object Array]' ? 'data-careerid="' + currentOption.career.map(function (e) { return e.id; }).join(',') + '"' : 'data-careerid="' + currentOption.career.id + '"';
                    } else {
                        var dataCareerId = '';
                    }
                    html += '<option value="' + currentOption.value + '" ' + dataCampus + ' ' + dataGeotargeting + ' ' + dataGroup + ' ' + dataCareerId + ' ' + dataType + '>' + currentOption.label + '</option>';
                }
            } else {
                var currentOption = options;
                var dataCampus = currentOption.campus ? 'data-campus="' + currentOption.campus + '"' : '';
                var dataGeotargeting = currentOption.geotargeting ? 'data-geotargeting="' + currentOption.geotargeting + '"' : '';
                var dataGroup = currentOption.group ? 'data-group="' + currentOption.group + '"' : '';
                var dataType = currentOption.type ? 'data-type="' + currentOption.type + '"' : '';
                var dataCareerId = currentOption.career ? 'data-careerid="' + currentOption.career.id + '"' : '';
                if (currentOption.career) {
                    var dataCareerId = Object.prototype.toString.call(currentOption.career) === '[object Array]' ? 'data-careerid="' + currentOption.career.map(function (e) { return e.id; }).join(',') + '"' : 'data-careerid="' + currentOption.career.id + '"';
                } else {
                    var dataCareerId = '';
                }
                html += '<option value="' + currentOption.value + '" ' + dataCampus + ' ' + dataGeotargeting + ' ' + dataGroup + ' ' + dataCareerId + ' ' + dataType + '>' + currentOption.label + '</option>';
            }
            html += '</select></div>';
        } else if (currentField.type == 'textarea') {
            var required = currentField.required == 'true' ? 'required' : '';
            var label = '<label class="questionLabel" for="' + currentField.name + '" >' + enhancedLabel(currentField.label, currentField.name) + '</label>';
            var html = '<div><textarea class="form-control ' + required + '" rows="3" id="' + currentField.name + '" name="' + currentField.name + '"></textarea></div>';
        } else if (currentField.type == 'checkbox') {
            var required = currentField.required == 'true' ? 'required' : '';
            var label = '';
            var html = '<div class="checkbox"><label><input type="checkbox" class="' + required + '" name="' + currentField.name + '" value="' + currentField.value + '"> ' + enhancedLabel(currentField.label, currentField.name) + '</label></div>';
        } else if (currentField.type == 'radio') {
            var required = currentField.required == 'true' ? 'required' : '';
            var label = '';
            var html = '<div class="radio"><label><input type="radio" class="' + required + '" name="' + currentField.name + '" id="' + currentField.name + i + '" value="' + currentField.value + '"> ' + enhancedLabel(currentField.label, currentField.name) + '</label></div>';
        } else if (currentField.type == 'codeblock') {
            var label = '';
            var regex = new RegExp(/(<input(.)*?>|<label(.)*?<\/label>)/g);
            var html = currentField['#cdata-section'].match(regex);
            html = html.join('');
        } else {
            //alert('unknown element - ' + currentField.type);
            console.log(currentField.type);
            console.log(response);
        }
        if (formComponentsArray.map(function (e) { return e.group; }).indexOf(group) == -1) {
            formComponentsArray.push({ group: group, rule: rule, label: [label], html: [html] });
        } else {
            formComponentsArray[formComponentsArray.map(function (e) { return e.group; }).indexOf(group)].label.push(label);
            formComponentsArray[formComponentsArray.map(function (e) { return e.group; }).indexOf(group)].html.push(html);
        }
    }
    appendHtml(formComponentsArray);
    //$('.hidden').closest('.wrapper').addClass('hiddenWrapper');
    //if ($('.wrapper').is(':hidden')) {
    //    $(this).addClass('hiddenWrapper');
    //}
    //var hiddenFields = $('.hiddenWrapper').length;

}

function appendHtml(formComponentsArray) {
    var reg = new RegExp('name\=\"(firstname|lastname|address1|address2|city|state|zip|phone|phone2|email|salutation)');
    for (var i = 0; i < formComponentsArray.length; i++) {
        var elementHtml = '<span class="q visibleSpan col-lg-3 col-md-4 col-sm-2 col-xs-2"><span class="number"></span></span><div class="wrapper col-lg-9 col-md-8 col-sm-10 col-xs-10"' + formComponentsArray[i].rule + ' >';
        elementHtml += formComponentsArray[i].group.length > 1 ? '<label class="outsider">' + enhancedLabel(formComponentsArray[i].group) + '</label>' : '';
        elementHtml += '<div class="form-group">';
        for (var j = 0; j < formComponentsArray[i].label.length; j++) {
            elementHtml += formComponentsArray[i].label[j] + formComponentsArray[i].html[j];
        }
        elementHtml += '</div></div>';
        if (!reg.test(elementHtml)) {
            $('#additionalInfo').append(elementHtml);
        }
    }
    //education level select need fix =========================================================================================
    if ($('[name="educationlevel"]').length == 0)
        $('#additionalInfo').append('<div class="wrapper hiddenWrapper"><div class="form-group row"><input type="hidden" name="educationlevel" value="' + (getCookie('education_level') ? getCookie('education_level') : 'HS') + '"></div></div>');
    if ($('[name="gradyear"]').length == 0) {
        var d = new Date();
        $('#additionalInfo').append('<div class="wrapper hiddenWrapper"><div class="form-group row"><input type="hidden" name="gradyear" value="' + (getCookie('gradyear') ? getCookie('gradyear') : d.getFullYear() - 2) + '"></div></div>');
    }
    //education level select need fix =========================================================================================
    $('[type="hidden"]').each(function () {
        $(this).closest('.wrapper').css('display', 'none').prev().removeClass('visibleSpan');
    });

    $('[type="radio"]').each(function (index) {
        $(this).prop('checked', true);
    });

    //$('<hr>').insertAfter('#additionalInfo .wrapper');

    //disclaimer
    //if (school == true) { //school
    //    $('form').append('<div class="row nomargin"><div class="disclaimer col-lg-9 col-lg-offset-3 col-md-8 col-md-offset-4 col-sm-10 col-sm-offset-2">Yes, I would like ' + $('.description').text() + ' to contact me via email and/or phone, including my wireless phone number, regarding available training programs using automated technology. You are not required to provide consent to receive services from ' + $('.description').text() +'. </div></div>');
    //}
    //else { //job
    //    $('form').append('<div class="row nomargin"><div class="disclaimer col-lg-9 col-lg-offset-3 col-md-8 col-md-offset-4 col-sm-10 col-sm-offset-2">By submitting my information, I am providing express consent to be contacted by CareerThesaurus.com and ' + $('.description').text() + ' via email, phone and text, including my wireless phone number, regarding job openings, career services and educational opportunities using automated technology. You are not required to provide consent to receive services from CareerThesaurus.com. I also understand that CareerThesaurus.com Privacy Policy governs the collection of this information.</div></div>');
    //}

    //$('form').append('<div id="other-schools-wrapper"><h2>Other schools</h2><p>These schools are competing to have you as a student as well! Select the schools you like, and your information will be submitted to them also.</p><div id="other-schools"></div></div><div class="row"><div id="buttonWrapper" class="col-lg-12"><button type="submit" id="submitFormBtn" class="btn btn-default">' + (moreSchools.length != 0 ? 'Next' : 'Submit') + '</button></div></div>');

    $('#submitFormBtn').text(moreSchools.length != 0 ? 'Next' : 'Submit');

    $('[name="campus_key"]').children().each(function (index) {
        var geotargetingAttr = $(this).data('geotargeting') ? $(this).data('geotargeting').toString() : '';
        geotargetingAttr = geotargetingAttr.indexOf('USA') == -1 ? geotargetingAttr : '';
        var valueAttr = $(this).attr('value');
        var labelAttr = $(this).text();
        campusKeys.push({ geotargeting: geotargetingAttr, value: valueAttr, label: labelAttr });
    }).remove();
    setTimeout(function () {
        zipcodeInput(searchZipcode, programForForm);
    }, 500);
    //$('[name="zip"]').val(searchZipcode).attr('oninput', 'zipcodeInput(this.value)').trigger('oninput');
    $('[name="program_key"]').children().each(function (index) {
        var campusAttr = $(this).data('campus') ? $(this).data('campus') : '';
        var valueAttr = $(this).attr('value');
        var labelAttr = $(this).text();
        var groupAttr = $(this).data('group') ? $(this).data('group') : '';
        var typeAttr = $(this).data('type') ? $(this).data('type') : '';
        var careeridAttr = $(this).data('careerid') ? $(this).data('careerid') : '';
        programKeys.push({ campus: campusAttr, value: valueAttr, label: labelAttr, group: groupAttr, careerid: careeridAttr, program_type: typeAttr });
        if (programGroups.indexOf(groupAttr) == -1) {
            programGroups.push(groupAttr);
        }
    }).remove();
    $('[name="campus_key"]').attr('onchange', 'campusChange(this.value)').trigger('onchange');
    setTimeout(function () {
        $('[rule]').each(function () {
            var elementRule = $(this).attr('rule').split('=');
            var ruleArray = elementRule[1].split('||');
            if (ruleArray.indexOf($('[name="' + elementRule[0] + '"]').val()) == -1) {
                $(this).css('display', 'none');
                //$(this).addClass('hiddenWrapper');
                $(this).prev().css('display', 'none').removeClass('visibleSpan');
            }
            $('[name="' + elementRule[0] + '"]').attr('onchange', 'toggleRules(this.name)').trigger('onchange');
        });
    }, 500);


    $('.hidden').parent().css('margin', '0').parent().css('margin-bottom', '0');
    $('.radio').parent().addClass('radioWrapper');
    //if ($('.wrapper').is("[rule]")) {
    //    alert('ff');
    //    $(this).addClass('hiddenWrapper');
    //}

    var attr = $(this).attr('rule');
    // For some browsers, `attr` is undefined; for others,
    // `attr` is false.  Check for both.
    //if (typeof attr !== typeof undefined && attr !== false) {
    //    $(this).addClass('hiddenWrapper');
    //}

    $('.visibleSpan').each(function (index) {
        $(this).find('.number').text(index + 1);
        // $('<hr class="col-lg-12">').insertAfter($(this).next('.wrapper')); //.after('<hr>');
    });
    //disclaimer
    if (school == true) { //school
        //$('#submitFormBtn').closest('.row').before('<div class="row nomargin"><div class="disclaimer col-lg-9 col-lg-offset-3 col-md-8 col-md-offset-4 col-sm-10 col-sm-offset-2">Yes, I would like ' + $('.description').text() + ' to contact me via email and/or phone, including my wireless phone number, regarding available training programs using automated technology. You are not required to provide consent to receive services from ' + $('.description').text() + '. </div></div>');

        $('.disclaimer').text('Yes, I would like ' + $('.description').text() + ' to contact me via email and/or phone, including my wireless phone number, regarding available training programs using automated technology. You are not required to provide consent to receive services from ' + $('.description').text() + '.');

    }
    else { //job
        //$('#submitFormBtn').closest('.row').before('<div class="row nomargin"><div class="disclaimer col-lg-9 col-lg-offset-3 col-md-8 col-md-offset-4 col-sm-10 col-sm-offset-2">By submitting my information, I am providing express consent to be contacted by CareerThesaurus.com and ' + $('.description').text() + ' via email, phone and text, including my wireless phone number, regarding job openings, career services and educational opportunities using automated technology. You are not required to provide consent to receive services from CareerThesaurus.com. I also understand that CareerThesaurus.com Privacy Policy governs the collection of this information.</div></div>');
           
        $('.disclaimer').text('By submitting my information, I am providing express consent to be contacted by CareerThesaurus.com and ' + $('.description').text() + ' via email, phone and text, including my wireless phone number, regarding job openings, career services and educational opportunities using automated technology. You are not required to provide consent to receive services from CareerThesaurus.com. I also understand that CareerThesaurus.com Privacy Policy governs the collection of this information.');

    }
    //if (!$('#leadid_tcpa_disclosure').length) {

    //} else {
    //    $('[name="leadid"]').closest('.wrapper').css('display', '').addClass('col-lg-offset-3 col-md-offset-4 col-sm-offset-2 col-xs-offset-2');
    //    $('[name="leadid"]').parent().children().wrapAll('<div class="checkbox" />');
    //}
    //$('.visibleSpan').next('.wrapper').after('<hr class="col-lg-12">');

    //$('.required').closest('.form-group').find('.shortLabel').append('<span class="star"> *</span>');
    //$('.required').closest('.wrapper').find('.outsider').append('<span class="star"> *</span>');
    //$('.required').closest('.form-group').find('.questionLabel').append('<span class="star"> *</span>');
    if (!document.getElementById('LeadiDscript')) {
        var leadidscript = document.createElement('script');
        leadidscript.setAttribute('id', 'LeadiDscript');
        leadidscript.setAttribute('type', 'text/javascript');
        leadidscript.innerHTML = "(function () { var s = document.createElement('script'); s.id = 'LeadiDscript_campaign'; s.type = 'text/javascript'; s.async = true; s.src = (document.location.protocol + '//d1tprjo2w7krrh.cloudfront.net/campaign/503244f4-8230-4f22-8bb3-50380a1c4317.js?f=reset'); var LeadiDscript = document.getElementById('LeadiDscript'); LeadiDscript.parentNode.insertBefore(s, LeadiDscript); })();";
        document.getElementById('formWrapper').appendChild(leadidscript);
    }
}