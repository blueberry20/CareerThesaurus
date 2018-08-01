﻿var seedtitle = '';
var itemshoulddisplay;
var parentcontainerid;
var seeddescription = '';
var expandprofessiongroups = false;

var excludeditems = new Array();

var additionallinks;
var additionallinksfunctions = new Array();

var callbackpredicate = null;
var htmlforitem = null;
var defaultgroupmethod = null;

var professionsFound = 0;
var professionsFoundArray = [];
var interestsStar = [];
var fieldIds = {};

var sortBy = 'salary';
//var importantthings = { beauty: 0, helping: 0, adventure: 0, safety: 0, people: 0, science: 0, duty: 0, admiration: 0, creativity: 0, competition: 0, animals: 0, politics: 0, technology: 0, machinery: 0, gender: "", handlabor: 0, strength: 0, drafting: 0, coordinating: 0, numbers: 0, critical: 0, salesy: 0 };
//var importantthings = { beauty: 1, helping: 1, adventure: 1, safety: 1, people: 1, science: 1, duty: 1, admiration: 1, creativity: 1, competition: 1, animals: 1, politics: 1, technology: 1, machinery: 1, gender: "", handlabor: 1, strength: 1, drafting: 1, coordinating: 1, numbers: 1, critical: 1, salesy: 1 };
//var toShow = { beauty: 0, helping: 0, adventure: 0, safety: 0, people: 0, science: 0, duty: 0, admiration: 0, creativity: 0, competition: 0, animals: 0, politics: 0, technology: 0, machinery: 0, handlabor: 0, strength: 0, drafting: 0, coordinating: 0, numbers: 0, critical: 0, salesy: 0 };
//var importantthingstoggle = false;

function renderData(containerid, title, params) {

    //try {
    parentcontainerid = containerid;

    seedtitle = params.seedprofession;

    itemshoulddisplay = params.itemshoulddisplay;
    itemClickPredicate = params.onitemclick;
    callbackpredicate = params.callback;
    htmlforitem = params.htmlforitem;

    defaultgroupmethod = params.defaultgroupmethod;

    if (title != '') {
        //$('#' + containerid).append('<div><h1 style="margin: 0">' + title + '</h1></div>');
    }

    if (params.expandgroups) {
        expandprofessiongroups = params.expandgroups;
    }

    if (params.excludeditems != null) {
        excludeditems = params.excludeditems;
    }

    if (params.additionallinks != null) {
        additionallinks = params.additionallinks;
    }


    //3. Add career results
    var groupinglinks2 = '<div id="mainWrapper" class="step col-lg-5 col-md-5 col-sm-5 col-xs-12">' +                                
                                '<div class="mobile row blueButtonsWrapper">' +
                                    '<button id="setImpThingsBtn" class="btn setBtn col-md-6 col-sm-6 col-xs-6"><span class="text">Select interests</span><div id="selectedInterests"></div></button>' +
                                    //mobile searchbox
                                     '<input id="searchbox" class="col-sm-6 col-xs-6" type="text" onkeyup="applyFilter(this.value);" placeholder="Search careers e.g. Nurse, Astronomer"/>' +
                                '</div>' +
                                '<div class="row">' +
                                    '<div class="row coloredSocialIcons text-right">' +
                                        '<ul class="social-icons">' +
                                            '<li class="share twitter"><a href="http://twitter.com/intent/tweet?text=What career fits your personality? Find out at:&url=http://CareerThesaurus.com/careertest" target="_blank"><i class="fa fa-twitter"></i></a></li>' +
                                            '<li class="share facebook"><a href="https://www.facebook.com/dialog/feed?app_id=153111284881428&link=http://CareerThesaurus.com/CareerTest&redirect_uri=https://facebook.com&name=What career fits your personality? &action=%5B%7B"name"%3a"What%20career%20fits%20your%20personality"%3F%20Find%20out%20at:"link"%3A"http://CareerThesaurus.com%2F"%7D%5D" target="_blank"><i class="fa fa-facebook"></i></a></li>' +
                                            '<li class="share gplus"><a href="https://plus.google.com/share?url=CareerThesaurus.com/CareerTest" target="_blank"><i class="fa fa-google-plus"></i></a></li>' +
                                        '</ul>' +
                                    '</div>'+
                                    '<div id="numberMatched" class=""></div>' +
                                '</div>' +
                                //'</div>' +

                                //end of mobile 3 buttons
                            //'<div id="professionsList" class="row">' +
                            //    //'<img id="matchingCareersHeading" class="desktop" src= "~/../../Content/images/matchingcareers2.png" alt="Matching Careers Heading"/>' +
                            //    '<h2 class="desktoph2">Matching Careers</h2>' +
                            // '</div>' +
                             //Desktop and mobile. search box. Group by btn is hidden in mobile.
                                    //desktop searchbox

                               //'<div class="row sortedInfo mobile">Careers displayed are sorted by <span id="sortBy">salary</span></div>' +
                                                     
                            '<div class="row extraPadding">' +
                                //sort by
                                '<div class="mobileBtn dropdown pull-right sortBtn">' +
                                    '<button class="dropdown-toggle" data-toggle="dropdown">Sort by<span class="caret"></span></button>' +
                                    '<span class="dropdown-arrow"></span>' +
                                    '<ul id="sortbyMobile" class="dropdown-menu groupby sortby">' +
                                        '<li class="activeLi"><a href="javascript:sortParam(\'salary\');">Salary</a></li>' +
                                        '<li><a href="javascript:sortParam(\'popularity\');">Popularity</a></li>' +
                                        //'<li><a href="javascript:sortParam(\'rank\');">Relevance</a></li>' +
                                    '</ul>' +
                                '</div>' +
                                '<div id="groupbyDropdown" class="mobileBtn dropdown pull-right">' +
                                    '<button class="dropdown-toggle" data-toggle="dropdown">Group by<span class="caret"></span></button>' +
                                    '<span class="dropdown-arrow"></span>' +
                                    '<ul id="groupbyMobile" class="dropdown-menu groupby">' +
                                        '<li class="activeLi"><a href="javascript:groupParam(\'\'); ">No grouping</a></li>' +
                                        '<li><a href="javascript:groupParam(\'field\');">Field</a></li>' +
                                        //'<li><a href="javascript:groupParam(\'major\');">Major</a></li>' +
                                        //'<li><a href="javascript:groupParam(\'minor\');">Minor</a></li>' +
                                        '<li><a href="javascript:groupParam(\'minedulevel\');">Education level</a></li>' +
                                        //'<li><a href="javascript:groupbyexplevel();">Experience level</a></li>' +
                                        //'<li><a href="javascript:groupParam(\'training\');">Training</a></li>' +
                                        '<li><a href="javascript:groupParam(\'salary\');">Average salary</a></li>' +
                                    '</ul>' +
                                '</div><h2 class="mobileh2">Matching Careers</h2></div>';

    $('#' + containerid).append(groupinglinks2);

    //$('#numberMatched').text(professionsFound == 0 ? 'No professions found' : professionsFound + ' professions found');

    $('.groupby li').click(function () {
        $('.activeLi').removeClass('activeLi');
        $(this).addClass('activeLi');
    });

    //open personal traits overlay
    $('#setTraitsBtn').click(function () {
        $('#dimensionscontainer').show();
        $('#dimensionscontainer').css('min-height', document.documentElement.clientHeight - 50);
        $('.importantthings, #mainWrapper, footer').hide();
        // $('#traitsDiv').niceScroll({ cursoropacitymin: 0.9, zindex: 10000, cursorborder: "1px solid #fff" });
        $('.closeIcon').css('display', 'block');
        $('.numberMatched').text(professionsFound == 0 ? 'No careers found' : professionsFound + ' careers found');
    });

    //open interests overlay
    $('#setImpThingsBtn').click(function () {
        $('.importantthings').show();
        $('.importantthings').css('min-height', document.documentElement.clientHeight - 50);
        $('#dimensionscontainer, #mainWrapper, footer').hide();
        $('.closeIcon').css('display', 'block');
        $('.numberMatched').text(professionsFound == 0 ? 'No careers found' : professionsFound + ' careers found');
        //$('#importantThingsDiv').niceScroll({ cursoropacitymin: 0.9, zindex: 10000, cursorborder: "1px solid #fff" });
    });

    var btnNext = profileType == "student" ? "<a class='blueBorderBtn' href='/Studentportal'>Go to Student Portal</a>" : "";

    $('#mainWrapper').append('<div id="columns" class="columns row"></div></div></div>').append(btnNext).append('<div class="adsenseCenter"><script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script><h6 class="advertisement">Advertisement</h6><ins class="adsbygoogle adslot_2" style="display:block" data-ad-client="ca-pub-3486420009474810" data-ad-slot="6576327288" data-ad-format="auto"></ins><script>(adsbygoogle = window.adsbygoogle || []).push({});</script></div>');

    selectAttributes();

    interestsStar = getCookie('interests') ? JSON.parse(getCookie('interests')) : [];
    if (document.URL.toLowerCase().indexOf('byinterest') != -1) {
        for (var i = 0; i < interestsStar.length; i++) {
            importantthings[interestsStar[i]] = 1;
        }
    }
    $('#mainWrapper').append('<div class="loadingDiv"><img id="loading-image" src="/Content/images/loader.gif" alt="Loading..." /><p>Loading results...</p></div>');
    setTimeout(function () {
        renderProfessions();
    }, 100);


    //2. Add Interests
    var thingslinks = '';
    thingslinks += '<div class="importantthings step collapsingWrapper col-lg-4 col-md-4 col-sm-4"><h2 class="desktop">Pick Interests</h2><div id="importantThingsDiv" class="collapsableDiv row"><div class="textWrapper"><h3>Create your own mix of interests and view matching careers.</h3><div class="mobile closeIcon menuIcon">Done</div><h4 class="mobile numberMatched">(46 Careers Matched)</h4></div><div id="impThingsWrapper"></div></div><div class="row buttonsBelow"><p class="starMessage"><span id="redStar">*</span> denotes your saved interests. To change them go to <a href="/StudentPortal">Student Portal</a></p><div class="clearBtn" onclick="clearImportantThings();">Clear Selection</div></div>' +
                        ($(window).width() > 767 ? '<div class="adsenseHide"><h6 class="advertisement">Advertisement</h6><ins class="adsbygoogle adslot_1" style="display:block" data-ad-client="ca-pub-3486420009474810" data-ad-slot="6576327288" data-ad-format="auto"></ins>' +
                        '<script>(adsbygoogle = window.adsbygoogle || []).push({});</script></div>' : '') +
                        '</div>';
    if (document.URL.toLowerCase().indexOf('byinterest') != -1) {
        $('#main').append(thingslinks);
    }


    for (var i = 0; i < importantthingdefinitions.length; i++) {
        var regex = new RegExp(importantthingdefinitions[i].name);
        $('#impThingsWrapper').append('<span class="impThingsSpan ' + (regex.test(interestsStar) ? 'previouslyChosen' : '')  + (importantthings[importantthingdefinitions[i].name] == 1 ? ' active' : '') + '" data-hover="' + importantthingdefinitions[i].caption + '" onclick="toggleimportantthing(this);" onmouseout="changecolor(this);" onmouseover="changecoloragain(this);" dimension="' + importantthingdefinitions[i].name + '" value="1">' + importantthingdefinitions[i].caption + '</span>');
    }


    if ($('#impThingsWrapper .active').length != 0) {
        $('.clearBtn').show();
    }
    else {
        $('.clearBtn').hide();
    }

    if (localStorage.interestsSelected && localStorage.interestsSelected == "true") {
        $('#setImpThingsBtn .text').text("Change interests");
    }

    //saveAllInterests();
    $('.cl-effect-2 a').click(function (event) {
        event.preventDefault();
    })

    //}
    //catch (ex) {
    //    alert(ex.message);
    //}

    if ($('.previouslyChosen').length > 0) {
        $('.starMessage').show();
    }

    //sidebar
    $('#main').append('<div id="thirdColumn" class="col-lg-3 col-md-3 col-sm-3"><div class="searchboxWrapper"><input id="searchbox" class="desktopSearchbox" type="text" onkeyup="applyFilter(this.value);" placeholder="Search careers e.g. Nurse, Astronomer"/></div>' +
        '<div class="sendCareerResults">' +
            '<form id="emailForm">' +
                    '<h3>Want these career results to be emailed to you?</h3>' +
                    '<div class="form-group row">' +
                        '<label class="shortLabel" for="name">Your Name</label>' +
                        '<div class="shortField">' +
                            '<input type="text" class=" form-control required" name="name" id="name" value="">' +
                        '</div>' +
                        //'<p id="nameError" class="errorMsg">Please enter a valid name</p>' +
                    '</div>' +
                    '<div class="form-group row">' +
                        '<label class="shortLabel" for="email">Your E-mail</label>' +
                        '<div class="shortField">' +
                            '<input type="email" class=" form-control required" name="email" id="email" value="">' +
                        '</div>' +
                        //'<p id="emailError" class="errorMsg">Please enter a valid email' +
                    '</div>' +
                    '<div class="row checkboxRow"><input id="termsCheckbox" type="checkbox"><p>I agree to <a id="openTerms">terms and conditions</a></p></div>' +
                    '<div class="text-center">' +
                        '<button type="button" id="joinNewsletterBtn" class="btn btn-default tryMatchingBtn">Ok</button>' +
                    '</div>' +
                    '<p class="errorMsg"></p>' +
                    '<p class="noInterestsError">Please select up to 3 interests</p>' +
                    '<p id="checkboxError">Please select checkbox</p>' +
                '</form>' +
                '<div id="resultsEmailed">Career results have been emailed to you</div>' +
    '</div>' +
    '<div class="row extraMargin">' +
    //sort by
        '<div class="row"><div class="desktopBtn dropdown pull-right sortBtn">' +
            '<button class="dropdown-toggle" data-toggle="dropdown">Sort by Relevance<span class="caret"></span></button>' +
            '<span class="dropdown-arrow"></span>' +
            '<ul class="dropdown-menu groupby">' +
                '<li><a href="javascript:sortParam(\'salary\');">Sort By Salary</a></li>' +
                '<li><a href="javascript:sortParam(\'popularity\');">Sort By Popularity</a></li>' +
            '</ul>' +
        '</div></div>' +
    //group by dropdown
        //group by dropdown
        '<div class="row"><div class="desktopBtn dropdown pull-right groupBtn">' +
            '<button class="dropdown-toggle" data-toggle="dropdown">No Grouping<span class="caret"></span></button>' +
            '<span class="dropdown-arrow"></span>' +
            '<ul class="dropdown-menu groupby">' +
                '<li><a href="javascript:groupParam(\'\', \'\'); ">No grouping</a></li>' +
                '<li><a href="javascript:groupParam(\'field\', \'field\');">Group By Field</a></li>' +
                //'<li><a href="javascript:groupParam(\'major\', \'major\');">Group By Major</a></li>' +
                //'<li><a href="javascript:groupParam(\'minor\', \'minor\');">Group By Minor</a></li>' +
                '<li><a href="javascript:groupParam(\'minedulevel\', \'education\');">Group By Education</a></li>' +
                //'<li><a href="javascript:groupbyexplevel();">Experience level</a></li>' +
                //'<li><a href="javascript:groupParam(\'training\', \'training\');">Group By Training</a></li>' +
                '<li><a href="javascript:groupParam(\'salary\', \'salary\');">Group By Avg Salary</a></li>' +
            '</ul>' +
        '</div></div>' +
        '</div><div class="row sortedInfo">Careers displayed are sorted by <span id="sortBy">salary</span></div><div class="row tryMatchingDiv"><div><img class="matchingIcon" src="/Content/images/crazywomanhex3.png" alt="Person Icon" /></div><p>Switch to matching careers by personality!</p><a href="/Careers/ByPersonality" class="tryMatchingBtn">Go!</a></div>' +
        ($(window).width() > 767 ? '<div class="row adsenseHide adsenseRight"><h6 class="advertisement">Advertisement</h6><ins class="adsbygoogle adslot_3" style="display:block" data-ad-client="ca-pub-3486420009474810" data-ad-slot="6576327288" data-ad-format="auto"></ins>' +
        '<script>(adsbygoogle = window.adsbygoogle || []).push({});</script></div>' : '') +
        '</div></div>');

    $(window).resize(function () {
        if ($(window).width() <= 768) {
            $('.sendCareerResults').insertAfter('#columns');
        }
        else {
            $('.sendCareerResults').insertBefore('.row.extraMargin');
        }
    });

    if ($(window).width() <= 768) {
        $('.sendCareerResults').insertAfter('#columns');
    } else {
        $('.sendCareerResults').insertBefore('.row.extraMargin');
    }

    $('.closeIcon').click(function () {
        $('.collapsingWrapper').hide();
        $('#mainWrapper, footer').show();
        $('.closeIcon').css('display', 'none');
        //var countInterests = parseInt($('#impThingsWrapper .active').length);
        //$('#interestsSelected').html(countInterests);
        //if (countInterests == 0) {
        //    $('#interestsSelected').hide();
        //}
        //else {
        //    $('#interestsSelected').show();
        //}
        showSelectedInterests();
        applyFilter(filtervalue);
    });

    $('#openTerms').click(function () {
        window.open('http://careerthesaurus.com/about/terms', 'winname', "directories=0,titlebar=0,toolbar=0,location=0,status=0,menubar=0,scrollbars=no,resizable=no,width=400,height=350");
    });

    $('#joinNewsletterBtn').click(function () {
        var importantthingsCount = 0;
        for (var property in importantthings) {
            if (importantthings.hasOwnProperty(property)) {
                if (importantthings[property] != '') {
                    importantthingsCount++;
                }
            }
        }
        if (validateName($('#name').val()) && validateEmail($('#email').val()) && importantthingsCount != 0 && $('#termsCheckbox').is(':checked')) {
            var data = importantthings;
            data.name = $('#name').val();
            data.email = $('#email').val();
            $.ajax({
                url: '/careers/EmailMeMyInterestResults',
                type: 'post',
                data: data
            }).success(function (response) {
                // setCookie('resultsEmailed', 'yes', 365);
                // setCookie('locked', null, -1);
                $('#emailMyResultsLink').css('display', 'none !important');
                $('#emailForm').hide();
                $('#resultsEmailed').show();
                //hide form
                console.log(response);
            }).error(function (error) {
                // 500 error server error
            });
        }
        else {
            if (!validateName($('#name').val()) && validateEmail($('#email').val())) {
                $('.errorMsg').text('Please enter a valid name');
                //$('#nameError').show();
            } else if (!validateEmail($('#email').val()) && validateName($('#name').val())) {
                $('.errorMsg').text('Please enter a valid email');
               // $('#emailError').show();
            }
            else if (!validateEmail($('#email').val()) && !validateName($('#name').val())) {
                 $('.errorMsg').text('Please enter a valid name and email');
               // $('#nameEmailError').show();
            }
            else {
                $('.errorMsg').text('');
            }

            if (importantthingsCount == 0) {
                $('.noInterestsError').show();
            } else {
                $('.noInterestsError').hide();
            }

            if (!$('#termsCheckbox').is(':checked')) {
                $('#checkboxError').show();
            } else {
                $('#checkboxError').hide();
            }

        }
    });

    function validateEmail(email) {
        if (email) {
            var reg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return reg.test(email);
        }
        return false;
    }

    function validateName(name) {
        if (name)
            if (name.length > 0)
                return true;
        return false;
    }

    for (var property in dimensions) {
        if (dimensions.hasOwnProperty(property)) {
            if (dimensions[property] != "") {
                $('.taketestJumbotron').hide();
            }
        }
    }
}

function showSelectedInterests() {
    var selectedInterests = importantthingdefinitions.filter(function (x) { return importantthings[x.name] == 1; }).map(function (x) { return x.caption; });
    var displayInterests = '';
    for (var i = 0; i < selectedInterests.length; i++) {
        displayInterests += selectedInterests[i] +", ";
    }
    $('#selectedInterests').html(displayInterests.replace(/,\s*$/, ""));
}

function renderProfessions() {
    if (defaultgroupmethod) {
        defaultgroupmethod();
    }
    else {
        groupbyrelateditems();
    }

    if (callbackpredicate) {
        callbackpredicate();
    }
    $('.loadingDiv').remove();
}

function saveInterest(interest, rating) {
    var url = document.URL;
    if (user != null && user != '' && profileType == 'student' && url.toLocaleLowerCase().indexOf('byinterest') != -1) {
        $.post('SaveInterest', { user: user, interest: interest, rating: rating });
    }
}
function saveAllInterests() {
    for (var property in importantthings) {
        if (importantthings.hasOwnProperty(property)) {
            saveInterest(property, importantthings[property]);
        }
    }
}

var sort_by;

(function () {
    // utility functions
    var default_cmp = function (a, b) {
        if (a == b) return 0;
        return a < b ? -1 : 1;
    },
        getCmpFunc = function (primer, reverse) {
            var dfc = default_cmp, // closer in scope
                cmp = default_cmp;
            if (primer) {
                cmp = function (a, b) {
                    return dfc(primer(a), primer(b));
                };
            }
            if (reverse) {
                return function (a, b) {
                    return -1 * cmp(a, b);
                };
            }
            return cmp;
        };

    // actual implementation
    sort_by = function () {
        var fields = [],
            n_fields = arguments.length,
            field, name, reverse, cmp;

        // preprocess sorting options
        for (var i = 0; i < n_fields; i++) {
            field = arguments[i];
            if (typeof field === 'string') {
                name = field;
                cmp = default_cmp;
            }
            else {
                name = field.name;
                cmp = getCmpFunc(field.primer, field.reverse);
            }
            fields.push({
                name: name,
                cmp: cmp
            });
        }

        // final comparison function
        return function (A, B) {
            var a, b, name, result;
            for (var i = 0; i < n_fields; i++) {
                result = 0;
                field = fields[i];
                name = field.name;

                result = field.cmp(A[name], B[name]);
                if (result !== 0) break;
            }
            return result;
        }
    }
}());


function sortParam(value) {
    //salary, popularity, rank
    importantthingstoggle = true;
    sortBy = value;
    // $('#sortByP').text(sortBy);
    $('.sortBtn .dropdown-toggle').html('Sort by ' + value + '<span class="caret"></span>');
    rerenderData();
}

function groupParam(group, groupselection) {
    currentgrouping = group;
    //importantthingstoggle = true;
    $('.groupBtn .dropdown-toggle').html('Group by ' + groupselection + '<span class="caret"></span>');
    rerenderData();
}

function selectAttributes() {
    var templateprofession = null;
    if (seedtitle != null && seedtitle.length > 0) {
        templateprofession = findbytitle(professions, seedtitle);

    }
    if (templateprofession == null) {
        return;
    }
    var spans = $('.dimension > span');
    for (var i = 0; i < spans.length; i++) {
        var value = '';
        switch ($(spans[i]).attr('dimension')) {
            case 'attitude': value = templateprofession.attitude; break;
            case 'information': value = templateprofession.information; break;
            case 'processing': value = templateprofession.processing; break;
            case 'action': value = templateprofession.action; break;
            case 'endurance': value = templateprofession.endurance; break;
            case 'presence': value = templateprofession.presence; break;
            case 'concentration': value = templateprofession.concentration; break;
            case 'patterns': value = templateprofession.patterns; break;
            case 'compensation': value = templateprofession.compensation; break;
            default: break;
        }
        if (value == $(spans[i]).html()) {
            $(spans[i]).addClass('prompt');
        }
    }
}


function toggledimension(e) {
    //clear active
    if ($(e).hasClass('active')) {
        $(e).removeClass('active notActive');
        $(e).siblings().removeClass('active notActive');
        setDimensionValue($(e).attr('dimension'), '');
    }
    else { //not pressed and not active
        $('.' + $(e).attr('dimension') + ' > span');
        $(e).removeClass('notActive').addClass('active');
        $(e).siblings().removeClass('active').addClass('notActive');
        setDimensionValue($(e).attr('dimension'), $(e).data('value'));
    }
    //importantthings = { beauty: 1, helping: 1, adventure: 1, safety: 1, people: 1, science: 1, duty: 1, admiration: 1, creativity: 1, competition: 1, animals: 1, politics: 1, technology: 1, machinery: 1, gender: "", handlabor: 1, strength: 1, drafting: 1, coordinating: 1, numbers: 1, critical: 1, salesy: 1 };
    setTimeout(function () {
        applyFilter(filtervalue);
    }, 0);

    animateResults();
}

function setDimensionValue(dim, value) {
    if (value == null) {
        value = '';
    }

    switch (dim) {
        case 'attitude': dimensions.attitude = value; break;
        case 'information': dimensions.information = value; break;
        case 'processing': dimensions.processing = value; break;
        case 'action': dimensions.action = value; break;
        case 'endurance': dimensions.endurance = value; break;
        case 'presence': dimensions.presence = value; break;
        case 'concentration': dimensions.concentration = value; break;
        case 'patterns': dimensions.patterns = value; break;
        case 'compensation': dimensions.compensation = value; break;
        default: break;
    }
}

//var importantthings = { beauty: "", helping: "", adventure: "", safety: "", people: "", science: "", easy: "", duty: "", admiration: "", creativity: "", competition: "", animals: "", politics: "", technology: "", machinery: "", gender: "", handlabor: "", heavyequipment: "", strength: "", drafting: "", coordinating: "", quickthinking: "", numbers: "", critical: "", smart: "", salesy: "" };

//mouseout
function changecolor(e) {
    if ($(window).width() > 768) {
        if ($(e).hasClass('active')) {
            $(e).css('background-color', 'rgb(143,214,228)');
        }
        else { //mobile
            $(e).css('background-color', '#fff');
        }
    }
    else { //mobile
        //if ($(e).hasClass('active')) {
        //    $(e).css({ 'background-color': 'rgb(143,214,228)', color: '#000' });
        //}
        //else {
        //    $(e).css({'background-color': '#000', color: 'rgb(143,214,228)'});
        //}
    }
}

//mousein
function changecoloragain(e) {
    if ($(window).width() > 768) { //desktop
        if ($(e).hasClass('active')) {
            $(e).css('background-color', '#fff');
        }
        else {
            $(e).css('background-color', 'rgb(143,214,228)');
        }
    }
    else { //mobile
        //if ($(e).hasClass('active')) {
        //    $(e).css({ 'background-color': '#000', color: 'rgb(143,214,228)' });
        //}
        //else {
        //    $(e).css({'background-color': 'rgb(143,214,228)', color: '#000'});
        //}
    }
}

function toggleimportantthing(e) {
    if ($(e).hasClass('active')) {
        $(e).removeClass('active')
        setImportantThingValue($(e).attr('dimension'), 0);
        //saveInterest($(e).attr('dimension'), 0);
    }
    else {
        $(e).addClass('active');
        setImportantThingValue($(e).attr('dimension'), 1);
        //saveInterest($(e).attr('dimension'), 1);
    }
    //var importantthingsCount = 0;
    //for (var property in importantthings) {
    //    if (importantthings.hasOwnProperty(property)) {
    //        if (importantthings[property] != '') {
    //            importantthingsCount++;
    //        }
    //    }
    //}
    //$('#interestsSelected').text('(' + importantthingsCount + ')');
    //importantthingstoggle = true;

   // animateResults();
   // refreshContent();

    if ($('#impThingsWrapper .active').length != 0) {
        $('.clearBtn').show();
    }
    else {
        $('.clearBtn').hide();
    }

    if ($(window).width() > 768) {
        setTimeout(function () {
            applyFilter(filtervalue);
        }, 0);
    } else { //dont reload careers on mobile until overlay is closed
        updateCareerCount();
    }
}

function setImportantThingValue(dim, value) {
    switch (dim) {
        case 'beauty': importantthings.beauty = value; break;
        case 'helping': importantthings.helping = value; break;
        case 'adventure': importantthings.adventure = value; break;
        case 'safety': importantthings.safety = value; break;
        case 'people': importantthings.people = value; break;
        case 'science': importantthings.science = value; break;
            //case 'easy': importantthings.easy = value; break;
        case 'duty': importantthings.duty = value; break;
        case 'admiration': importantthings.admiration = value; break;
        case 'creativity': importantthings.creativity = value; break;
        case 'competition': importantthings.competition = value; break;
        case 'animals': importantthings.animals = value; break;
        case 'politics': importantthings.politics = value; break;
        case 'technology': importantthings.technology = value; break;
        case 'machinery': importantthings.machinery = value; break;
        case 'gender': importantthings.gender = value; break;
        case 'handlabor': importantthings.handlabor = value; break;
            //case 'heavyequipment': importantthings.heavyequipment = value; break;
        case 'strength': importantthings.strength = value; break;
        case 'drafting': importantthings.drafting = value; break;
        case 'coordinating': importantthings.coordinating = value; break;
            //case 'quickthinking': importantthings.quickthinking = value; break;
        case 'numbers': importantthings.numbers = value; break;
        case 'critical': importantthings.critical = value; break;
            //case 'smart': importantthings.smart = value; break;
        case 'salesy': importantthings.salesy = value; break;

        default: break;
    }
}

function clearImportantThings() {
    if ($(window).width() > 767) { //desktop
        $('.impThingsSpan').removeClass('active').css('background-color', '#fff');
    }
    else { //mobile
        $('.impThingsSpan').removeClass('active'); //.css({'background-color': '#000', color: 'rgb(143,214,228)'});
    }
    importantthings = { beauty: 0, helping: 0, adventure: 0, safety: 0, people: 0, science: 0, duty: 0, admiration: 0, creativity: 0, competition: 0, animals: 0, politics: 0, technology: 0, machinery: 0, gender: "", handlabor: 0, strength: 0, drafting: 0, coordinating: 0, numbers: 0, critical: 0, salesy: 0 };
    localStorage.removeItem("interestsList");
    saveAllInterests();
    applyFilter('');
    //rerenderData();
}


//Sorting functions
function sortbymajor(a, b) { if (a.major < b.major) return -1; if (a.major > b.major) return 1; return 0; } function sortbyminor(a, b) { if (a.minor < b.minor) return -1; if (a.minor > b.minor) return 1; return 0; } function sortbycategory(a, b) { if (a.category < b.category) return -1; if (a.category > b.category) return 1; return 0; } function sortbyocccode(a, b) { if (a.occcode < b.occcode) return -1; if (a.occcode > b.occcode) return 1; return 0; } function sortbytitle(a, b) { if (a.title < b.title) return -1; if (a.title > b.title) return 1; return 0; } function sortbyedulevel(a, b) { if (a.edulevel < b.edulevel) return -1; if (a.edulevel > b.edulevel) return 1; return 0; } function sortbyminedulevel(a, b) { if (a.edulevel < b.edulevel) return -1; if (a.edulevel > b.edulevel) return 1; return 0; } function sortbyexplevel(a, b) { if (a.explevel < b.explevel) return -1; if (a.explevel > b.explevel) return 1; return 0; } function sortbytraining(a, b) { if (a.training < b.training) return -1; if (a.training > b.training) return 1; return 0; } function sortbyattitude(a, b) { if (a.attitude < b.attitude) return -1; if (a.attitude > b.attitude) return 1; return 0; } function sortbyinformation(a, b) { if (a.information < b.information) return -1; if (a.information > b.information) return 1; return 0; } function sortbyprocessing(a, b) { if (a.processing < b.processing) return -1; if (a.processing > b.processing) return 1; return 0; } function sortbyaction(a, b) { if (a.action < b.action) return -1; if (a.action > b.action) return 1; return 0; } function sortbyendurance(a, b) { if (a.endurance < b.endurance) return -1; if (a.endurance > b.endurance) return 1; return 0; } function sortbypresence(a, b) { if (a.presence < b.presence) return -1; if (a.presence > b.presence) return 1; return 0; } function sortbyconcentration(a, b) { if (a.concentration < b.concentration) return -1; if (a.concentration > b.concentration) return 1; return 0; } function sortbypatterns(a, b) { if (a.patterns < b.patterns) return -1; if (a.patterns > b.patterns) return 1; return 0; } function sortbycompensation(a, b) { if (a.compensation < b.compensation) return -1; if (a.compensation > b.compensation) return 1; return 0; } function sortbybeauty(a, b) { if (a.beauty < b.beauty) return -1; if (a.beauty > b.beauty) return 1; return 0; } function sortbyhelping(a, b) { if (a.helping < b.helping) return -1; if (a.helping > b.helping) return 1; return 0; } function sortbyadventure(a, b) { if (a.adventure < b.adventure) return -1; if (a.adventure > b.adventure) return 1; return 0; } function sortbysafety(a, b) { if (a.safety < b.safety) return -1; if (a.safety > b.safety) return 1; return 0; } function sortbypeople(a, b) { if (a.people < b.people) return -1; if (a.people > b.people) return 1; return 0; } function sortbyscience(a, b) { if (a.science < b.science) return -1; if (a.science > b.science) return 1; return 0; } function sortbyeasy(a, b) { if (a.easy < b.easy) return -1; if (a.easy > b.easy) return 1; return 0; } function sortbyduty(a, b) { if (a.duty < b.duty) return -1; if (a.duty > b.duty) return 1; return 0; } function sortbyadmiration(a, b) { if (a.admiration < b.admiration) return -1; if (a.admiration > b.admiration) return 1; return 0; } function sortbycreativity(a, b) { if (a.creativity < b.creativity) return -1; if (a.creativity > b.creativity) return 1; return 0; } function sortbycompetition(a, b) { if (a.competition < b.competition) return -1; if (a.competition > b.competition) return 1; return 0; } function sortbyanimals(a, b) { if (a.animals < b.animals) return -1; if (a.animals > b.animals) return 1; return 0; } function sortbypolitics(a, b) { if (a.politics < b.politics) return -1; if (a.politics > b.politics) return 1; return 0; } function sortbytechnology(a, b) { if (a.technology < b.technology) return -1; if (a.technology > b.technology) return 1; return 0; } function sortbymachinery(a, b) { if (a.machinery < b.machinery) return -1; if (a.machinery > b.machinery) return 1; return 0; } function sortbygender(a, b) { if (a.gender < b.gender) return -1; if (a.gender > b.gender) return 1; return 0; } function sortbyhandlabor(a, b) { if (a.handlabor < b.handlabor) return -1; if (a.handlabor > b.handlabor) return 1; return 0; } function sortbyheavyequipment(a, b) { if (a.heavyequipment < b.heavyequipment) return -1; if (a.heavyequipment > b.heavyequipment) return 1; return 0; } function sortbystrength(a, b) { if (a.strength < b.strength) return -1; if (a.strength > b.strength) return 1; return 0; } function sortbydrafting(a, b) { if (a.drafting < b.drafting) return -1; if (a.drafting > b.drafting) return 1; return 0; } function sortbycoordinating(a, b) { if (a.coordinating < b.coordinating) return -1; if (a.coordinating > b.coordinating) return 1; return 0; } function sortbyquickthinking(a, b) { if (a.quickthinking < b.quickthinking) return -1; if (a.quickthinking > b.quickthinking) return 1; return 0; } function sortbynumbers(a, b) { if (a.numbers < b.numbers) return -1; if (a.numbers > b.numbers) return 1; return 0; } function sortbycritical(a, b) { if (a.critical < b.critical) return -1; if (a.critical > b.critical) return 1; return 0; } function sortbysmart(a, b) { if (a.smart < b.smart) return -1; if (a.smart > b.smart) return 1; return 0; } function sortbysalesy(a, b) { if (a.salesy < b.salesy) return -1; if (a.salesy > b.salesy) return 1; return 0; }

function groupbymajor() {
    professionsFound = 0;
    currentgrouping = 'major';
    $('#columns').html('');
    professions.sort(sort_by('major', { name: sortBy, primer: null, reverse: false }));
    var prevval = null;
    var id = '';
    for (var i = 0; i < professions.length; i++) {
        if (prevval != professions[i].major) {
            id = guid();
            groupHeaderFor('major', ctMajor[professions[i].major], id);
            prevval = professions[i].major;
            renderEnrichedItems(id, function (x) { return x.major; }, professions[i].major);
        }
    }
    hideEmptyGroups();
}
function groupbyminor() { professionsFound = 0; currentgrouping = 'minor'; $('#columns').html(''); professions.sort(sort_by('minor', { name: sortBy, primer: null, reverse: false })); var prevval = null; var id = ''; for (var i = 0; i < professions.length; i++) { if (prevval != professions[i].minor) { id = guid(); groupHeaderFor('minor', ctMinor[professions[i].minor], id); prevval = professions[i].minor; renderEnrichedItems(id, function (x) { return x.minor; }, professions[i].minor); } } hideEmptyGroups(); }
function groupbyminedulevel() { professionsFound = 0; currentgrouping = 'minedulevel'; $('#columns').html(''); professions.sort(sort_by('minedulevel', { name: sortBy, primer: parseInt, reverse: false })); var prevval = null; var id = ''; for (var i = 0; i < professions.length; i++) { if (prevval != professions[i].minedulevel) { id = guid(); groupHeaderFor('minedulevel', ctEduLevel[professions[i].minedulevel], id); prevval = professions[i].minedulevel; renderEnrichedItems(id, function (x) { return x.minedulevel; }, professions[i].minedulevel); } } hideEmptyGroups(); }
function groupbyexplevel() { professionsFound = 0; currentgrouping = 'explevel'; $('#columns').html(''); professions.sort(sort_by('explevel', { name: sortBy, primer: null, reverse: false })); var prevval = ''; var id = ''; for (var i = 0; i < professions.length; i++) { if (prevval != professions[i].explevel) { id = guid(); groupHeaderFor('explevel', professions[i].explevel, id); prevval = professions[i].explevel; renderEnrichedItems(id, function (x) { return x.explevel; }, professions[i].explevel); } } hideEmptyGroups(); }
function groupbytraining() { professionsFound = 0; currentgrouping = 'training'; $('#columns').html(''); professions.sort(sort_by('training', { name: sortBy, primer: null, reverse: false })); var prevval = null; var id = ''; for (var i = 0; i < professions.length; i++) { if (prevval != professions[i].training) { id = guid(); groupHeaderFor('training', ctTraining[professions[i].training], id); prevval = professions[i].training; renderEnrichedItems(id, function (x) { return x.training; }, professions[i].training); } } hideEmptyGroups(); }

function renderEnrichedItems(containerid, predicate, groupvalue) {
    professionsFoundArray = [];
    var subset = new Array();
    for (var j = 0; j < getEnrichedItems().length; j++) {
        if (predicate(getEnrichedItems()[j]) == groupvalue) {
            //if (predicate(getEnrichedItems()[j]).toLowerCase() == groupvalue.toLowerCase()) {
            subset.push(getEnrichedItems()[j]);
        }
    }
    //sortEnrichedItems(subset);
    for (var j = 0; j < subset.length; j++) {
        itemFor(subset[j], containerid);
    }
    //=====================
    renderhtml(containerid);
}


function groupbyattitude() { $('#columns').html(''); professions.sort(sortbyattitude); var prevval = ''; var id = ''; for (var i = 0; i < professions.length; i++) { if (prevval != professions[i].attitude) { id = guid(); groupHeaderFor('attitude', professions[i].attitude, id); prevval = professions[i].attitude; } itemFor('attitude', professions[i], id); } } function groupbyinformation() { $('#columns').html(''); professions.sort(sortbyinformation); var prevval = ''; var id = ''; for (var i = 0; i < professions.length; i++) { if (prevval != professions[i].information) { id = guid(); groupHeaderFor('information', professions[i].information, id); prevval = professions[i].information; } itemFor('information', professions[i], id); } } function groupbyprocessing() { $('#columns').html(''); professions.sort(sortbyprocessing); var prevval = ''; var id = ''; for (var i = 0; i < professions.length; i++) { if (prevval != professions[i].processing) { id = guid(); groupHeaderFor('processing', professions[i].processing, id); prevval = professions[i].processing; } itemFor('processing', professions[i], id); } } function groupbyaction() { $('#columns').html(''); professions.sort(sortbyaction); var prevval = ''; var id = ''; for (var i = 0; i < professions.length; i++) { if (prevval != professions[i].action) { id = guid(); groupHeaderFor('action', professions[i].action, id); prevval = professions[i].action; } itemFor('action', professions[i], id); } } function groupbyendurance() { $('#columns').html(''); professions.sort(sortbyendurance); var prevval = ''; var id = ''; for (var i = 0; i < professions.length; i++) { if (prevval != professions[i].endurance) { id = guid(); groupHeaderFor('endurance', professions[i].endurance, id); prevval = professions[i].endurance; } itemFor('endurance', professions[i], id); } } function groupbypresence() { $('#columns').html(''); professions.sort(sortbypresence); var prevval = ''; var id = ''; for (var i = 0; i < professions.length; i++) { if (prevval != professions[i].presence) { id = guid(); groupHeaderFor('presence', professions[i].presence, id); prevval = professions[i].presence; } itemFor('presence', professions[i], id); } } function groupbyconcentration() { $('#columns').html(''); professions.sort(sortbyconcentration); var prevval = ''; var id = ''; for (var i = 0; i < professions.length; i++) { if (prevval != professions[i].concentration) { id = guid(); groupHeaderFor('concentration', professions[i].concentration, id); prevval = professions[i].concentration; } itemFor('concentration', professions[i], id); } } function groupbypatterns() { $('#columns').html(''); professions.sort(sortbypatterns); var prevval = ''; var id = ''; for (var i = 0; i < professions.length; i++) { if (prevval != professions[i].patterns) { id = guid(); groupHeaderFor('patterns', professions[i].patterns, id); prevval = professions[i].patterns; } itemFor('patterns', professions[i], id); } } function groupbycompensation() { $('#columns').html(''); professions.sort(sortbycompensation); var prevval = ''; var id = ''; for (var i = 0; i < professions.length; i++) { if (prevval != professions[i].compensation) { id = guid(); groupHeaderFor('compensation', professions[i].compensation, id); prevval = professions[i].compensation; } itemFor('compensation', professions[i], id); } } function groupbybeauty() { $('#columns').html(''); professions.sort(sortbybeauty); var prevval = ''; var id = ''; for (var i = 0; i < professions.length; i++) { if (prevval != professions[i].beauty) { id = guid(); groupHeaderFor('beauty', professions[i].beauty, id); prevval = professions[i].beauty; } itemFor('beauty', professions[i], id); } } function groupbyhelping() { $('#columns').html(''); professions.sort(sortbyhelping); var prevval = ''; var id = ''; for (var i = 0; i < professions.length; i++) { if (prevval != professions[i].helping) { id = guid(); groupHeaderFor('helping', professions[i].helping, id); prevval = professions[i].helping; } itemFor('helping', professions[i], id); } } function groupbyadventure() { $('#columns').html(''); professions.sort(sortbyadventure); var prevval = ''; var id = ''; for (var i = 0; i < professions.length; i++) { if (prevval != professions[i].adventure) { id = guid(); groupHeaderFor('adventure', professions[i].adventure, id); prevval = professions[i].adventure; } itemFor('adventure', professions[i], id); } } function groupbysafety() { $('#columns').html(''); professions.sort(sortbysafety); var prevval = ''; var id = ''; for (var i = 0; i < professions.length; i++) { if (prevval != professions[i].safety) { id = guid(); groupHeaderFor('safety', professions[i].safety, id); prevval = professions[i].safety; } itemFor('safety', professions[i], id); } } function groupbypeople() { $('#columns').html(''); professions.sort(sortbypeople); var prevval = ''; var id = ''; for (var i = 0; i < professions.length; i++) { if (prevval != professions[i].people) { id = guid(); groupHeaderFor('people', professions[i].people, id); prevval = professions[i].people; } itemFor('people', professions[i], id); } } function groupbyscience() { $('#columns').html(''); professions.sort(sortbyscience); var prevval = ''; var id = ''; for (var i = 0; i < professions.length; i++) { if (prevval != professions[i].science) { id = guid(); groupHeaderFor('science', professions[i].science, id); prevval = professions[i].science; } itemFor('science', professions[i], id); } } function groupbyeasy() { $('#columns').html(''); professions.sort(sortbyeasy); var prevval = ''; var id = ''; for (var i = 0; i < professions.length; i++) { if (prevval != professions[i].easy) { id = guid(); groupHeaderFor('easy', professions[i].easy, id); prevval = professions[i].easy; } itemFor('easy', professions[i], id); } } function groupbyduty() { $('#columns').html(''); professions.sort(sortbyduty); var prevval = ''; var id = ''; for (var i = 0; i < professions.length; i++) { if (prevval != professions[i].duty) { id = guid(); groupHeaderFor('duty', professions[i].duty, id); prevval = professions[i].duty; } itemFor('duty', professions[i], id); } } function groupbyadmiration() { $('#columns').html(''); professions.sort(sortbyadmiration); var prevval = ''; var id = ''; for (var i = 0; i < professions.length; i++) { if (prevval != professions[i].admiration) { id = guid(); groupHeaderFor('admiration', professions[i].admiration, id); prevval = professions[i].admiration; } itemFor('admiration', professions[i], id); } } function groupbycreativity() { $('#columns').html(''); professions.sort(sortbycreativity); var prevval = ''; var id = ''; for (var i = 0; i < professions.length; i++) { if (prevval != professions[i].creativity) { id = guid(); groupHeaderFor('creativity', professions[i].creativity, id); prevval = professions[i].creativity; } itemFor('creativity', professions[i], id); } } function groupbycompetition() { $('#columns').html(''); professions.sort(sortbycompetition); var prevval = ''; var id = ''; for (var i = 0; i < professions.length; i++) { if (prevval != professions[i].competition) { id = guid(); groupHeaderFor('competition', professions[i].competition, id); prevval = professions[i].competition; } itemFor('competition', professions[i], id); } } function groupbyanimals() { $('#columns').html(''); professions.sort(sortbyanimals); var prevval = ''; var id = ''; for (var i = 0; i < professions.length; i++) { if (prevval != professions[i].animals) { id = guid(); groupHeaderFor('animals', professions[i].animals, id); prevval = professions[i].animals; } itemFor('animals', professions[i], id); } } function groupbypolitics() { $('#columns').html(''); professions.sort(sortbypolitics); var prevval = ''; var id = ''; for (var i = 0; i < professions.length; i++) { if (prevval != professions[i].politics) { id = guid(); groupHeaderFor('politics', professions[i].politics, id); prevval = professions[i].politics; } itemFor('politics', professions[i], id); } } function groupbytechnology() { $('#columns').html(''); professions.sort(sortbytechnology); var prevval = ''; var id = ''; for (var i = 0; i < professions.length; i++) { if (prevval != professions[i].technology) { id = guid(); groupHeaderFor('technology', professions[i].technology, id); prevval = professions[i].technology; } itemFor('technology', professions[i], id); } } function groupbymachinery() { $('#columns').html(''); professions.sort(sortbymachinery); var prevval = ''; var id = ''; for (var i = 0; i < professions.length; i++) { if (prevval != professions[i].machinery) { id = guid(); groupHeaderFor('machinery', professions[i].machinery, id); prevval = professions[i].machinery; } itemFor('machinery', professions[i], id); } } function groupbygender() { $('#columns').html(''); professions.sort(sortbygender); var prevval = ''; var id = ''; for (var i = 0; i < professions.length; i++) { if (prevval != professions[i].gender) { id = guid(); groupHeaderFor('gender', professions[i].gender, id); prevval = professions[i].gender; } itemFor('gender', professions[i], id); } } function groupbyhandlabor() { $('#columns').html(''); professions.sort(sortbyhandlabor); var prevval = ''; var id = ''; for (var i = 0; i < professions.length; i++) { if (prevval != professions[i].handlabor) { id = guid(); groupHeaderFor('handlabor', professions[i].handlabor, id); prevval = professions[i].handlabor; } itemFor('handlabor', professions[i], id); } } function groupbyheavyequipment() { $('#columns').html(''); professions.sort(sortbyheavyequipment); var prevval = ''; var id = ''; for (var i = 0; i < professions.length; i++) { if (prevval != professions[i].heavyequipment) { id = guid(); groupHeaderFor('heavyequipment', professions[i].heavyequipment, id); prevval = professions[i].heavyequipment; } itemFor('heavyequipment', professions[i], id); } } function groupbystrength() { $('#columns').html(''); professions.sort(sortbystrength); var prevval = ''; var id = ''; for (var i = 0; i < professions.length; i++) { if (prevval != professions[i].strength) { id = guid(); groupHeaderFor('strength', professions[i].strength, id); prevval = professions[i].strength; } itemFor('strength', professions[i], id); } } function groupbydrafting() { $('#columns').html(''); professions.sort(sortbydrafting); var prevval = ''; var id = ''; for (var i = 0; i < professions.length; i++) { if (prevval != professions[i].drafting) { id = guid(); groupHeaderFor('drafting', professions[i].drafting, id); prevval = professions[i].drafting; } itemFor('drafting', professions[i], id); } } function groupbycoordinating() { $('#columns').html(''); professions.sort(sortbycoordinating); var prevval = ''; var id = ''; for (var i = 0; i < professions.length; i++) { if (prevval != professions[i].coordinating) { id = guid(); groupHeaderFor('coordinating', professions[i].coordinating, id); prevval = professions[i].coordinating; } itemFor('coordinating', professions[i], id); } } function groupbyquickthinking() { $('#columns').html(''); professions.sort(sortbyquickthinking); var prevval = ''; var id = ''; for (var i = 0; i < professions.length; i++) { if (prevval != professions[i].quickthinking) { id = guid(); groupHeaderFor('quickthinking', professions[i].quickthinking, id); prevval = professions[i].quickthinking; } itemFor('quickthinking', professions[i], id); } } function groupbynumbers() { $('#columns').html(''); professions.sort(sortbynumbers); var prevval = ''; var id = ''; for (var i = 0; i < professions.length; i++) { if (prevval != professions[i].numbers) { id = guid(); groupHeaderFor('numbers', professions[i].numbers, id); prevval = professions[i].numbers; } itemFor('numbers', professions[i], id); } } function groupbycritical() { $('#columns').html(''); professions.sort(sortbycritical); var prevval = ''; var id = ''; for (var i = 0; i < professions.length; i++) { if (prevval != professions[i].critical) { id = guid(); groupHeaderFor('critical', professions[i].critical, id); prevval = professions[i].critical; } itemFor('critical', professions[i], id); } } function groupbysmart() { $('#columns').html(''); professions.sort(sortbysmart); var prevval = ''; var id = ''; for (var i = 0; i < professions.length; i++) { if (prevval != professions[i].smart) { id = guid(); groupHeaderFor('smart', professions[i].smart, id); prevval = professions[i].smart; } itemFor('smart', professions[i], id); } } function groupbysalesy() { $('#columns').html(''); professions.sort(sortbysalesy); var prevval = ''; var id = ''; for (var i = 0; i < professions.length; i++) { if (prevval != professions[i].salesy) { id = guid(); groupHeaderFor('salesy', professions[i].salesy, id); prevval = professions[i].salesy; } itemFor('salesy', professions[i], id); } }

var enriched = new Array();
function getEnrichedItems() {
    if (enriched.length == 0) {
        for (var i = 0; i < professions.length; i++) {
            enriched.push({
                code: professions[i].code,
                title: professions[i].title,
                major: professions[i].major,
                minor: professions[i].minor,
                minedulevel: professions[i].minedulevel,
                explevel: professions[i].explevel,
                training: professions[i].training,
                salary: parseFloat(professions[i].salary),
                rank: 0,
                index: i,
                jobs: professions[i].jobs ? professions[i].jobs : null,
                field: professions[i].field,
                fld: professions[i].fld,
                popularity: professions[i].popularity,
                predecessors: countPredecessors(professions[i].title),
                similars: countSimilars(professions[i].title),
                progressions: countProgressions(professions[i].title),
                aka: professionsinfo[professionsinfo.map(function (e) { return e.code; }).indexOf(professions[i].code)].alttitles,
                akaTitle: '',
                keywordmatches: 0, //matchDescriptionKeywords(seeddescription, getdescription(professions[i].code)),
                attitude: professions[i].attitude,
                information: professions[i].information,
                processing: professions[i].processing,
                action: professions[i].action,
                endurance: professions[i].endurance,
                presence: professions[i].presence,
                concentration: professions[i].concentration,
                patterns: professions[i].patterns,
                compensation: professions[i].compensation,
                beauty: professions[i].beauty,
                helping: professions[i].helping,
                adventure: professions[i].adventure,
                safety: professions[i].safety,
                people: professions[i].people,
                science: professions[i].science,
                easy: '',//professions[i].easy,
                duty: professions[i].duty,
                admiration: professions[i].admiration,
                creativity: professions[i].creativity,
                competition: professions[i].competition,
                animals: professions[i].animals,
                politics: professions[i].politics,
                technology: professions[i].technology,
                machinery: professions[i].machinery,
                gender: professions[i].gender,
                handlabor: professions[i].handlabor,
                heavyequipment: '',//professions[i].heavyequipment,
                strength: professions[i].strength,
                drafting: professions[i].drafting,
                coordinating: professions[i].coordinating,
                quickthinking: '',//professions[i].quickthinking,
                numbers: professions[i].numbers,
                critical: professions[i].critical,
                smart: '',//professions[i].smart,
                salesy: professions[i].salesy

            });
        }
    }
    return enriched;
}
function sortEnrichedItems(items) {
    switch (internalsortorder) {
        case 'predecessors':
            items.sort(sortbypredecessors);
            break;
        case 'similars':
            items.sort(sortbysimilars);
            break;
        case 'progressions':
            items.sort(sortbyprogressions);
            break;
        case 'total':
            items.sort(sortbyrelateditemscount);
            break;
        default:
            items.sort(sortbykeywordmatches);

            break;
    }
}

function groupbyrelateditems() {

    //try {
    professionsFoundArray = [];
    currentgrouping = '';
    professionsFound = 0;
    $('#columns').html('');

    //sortEnrichedItems(getEnrichedItems());

    var prevval = '-';
    var id = '';
    for (var i = 0; i < getEnrichedItems().length; i++) {
        var groupname = '';
        if (prevval != groupname) {
            id = guid();
            groupHeaderFor('relateditems', groupname, id);
            prevval = groupname;
        }
        itemFor(getEnrichedItems()[i], id);
    }
    renderhtml(id);
    if (professionsFound == 0) {
        $('.columns').html('').append('<p class="noresults">No matching careers for current selection</p>');
    } else {
        $('.noresults').remove();
        $('#numberMatched').text(professionsFound == 0 ? 'No careers found' : professionsFound + ' careers found');
        if (professionsFound == 742) {
            $('#numberMatched').show().text('Your Career Results');
        } else if (professionsFound == 0) {
            $('#numberMatched').hide();
        }
        else {
            $('#numberMatched').show();
        }
    }
    //}
    //catch (ex) {
    //    alert(ex.message);
    //}
}
function sortbyrank(a, b) { if (a.rank > b.rank) return -1; if (a.rank < b.rank) return 1; return 0; }
function sortbypopularity(a, b) { if (a.popularity > b.popularity) return -1; if (a.popularity < b.popularity) return 1; return 0; }
function sortbykeywordmatches(a, b) { if (parseInt(a.keywordmatches) > parseInt(b.keywordmatches)) return -1; if (parseInt(a.keywordmatches) < parseInt(b.keywordmatches)) return 1; return 0; }
function sortbypredecessors(a, b) { if (parseInt(a.predecessors) > parseInt(b.predecessors)) return -1; if (parseInt(a.predecessors) < parseInt(b.predecessors)) return 1; return 0; }
function sortbysimilars(a, b) { if (parseInt(a.similars) > parseInt(b.similars)) return -1; if (parseInt(a.similars) < parseInt(b.similars)) return 1; return 0; }
function sortbyprogressions(a, b) { if (parseInt(a.progressions) > parseInt(b.progressions)) return -1; if (parseInt(a.progressions) < parseInt(b.progressions)) return 1; return 0; }
function sortbyrelateditemscount(a, b) { if (parseInt(a.predecessors + a.similars + a.progressions) > parseInt(b.predecessors + b.similars + b.progressions)) return -1; if (parseInt(a.predecessors + a.similars + a.progressions) < parseInt(b.predecessors + b.similars + b.progressions)) return 1; return 0; }
function countPredecessors(title) {
    return 0;
    var cnt = 0;
    for (var i = 0; i < progressions.length; i++) {
        if (progressions[i].status != 'x' && progressions[i].manual != 'x') {
            if (progressions[i].nextlevel.toLowerCase() == title.toLowerCase()) {
                cnt++;
            }
        }
    }
    return cnt;
}
function countSimilars(title) {
    return 0;
    var cnt = 0;
    for (var i = 0; i < similars.length; i++) {
        if (similars[i].status != 'x' && similars[i].manual != 'x') {
            if (similars[i].profession.toLowerCase() == title.toLowerCase()) {
                cnt++;
            }
        }
    }
    return cnt;
}
function countProgressions(title) {
    return 0;
    var cnt = 0;
    for (var i = 0; i < progressions.length; i++) {
        if (progressions[i].status != 'x' && progressions[i].manual != 'x') {
            if (progressions[i].profession.toLowerCase() == title.toLowerCase()) {
                cnt++;
            }
        }
    }
    return cnt;
}




function sortbysalary(a, b) { if (parseInt(a.salary) > parseInt(b.salary)) return -1; if (parseInt(a.salary) < parseInt(b.salary)) return 1; return 0; }
function groupbysalary() {
    currentgrouping = 'salary';
    $('#columns').html('');
    professions.sort(sort_by('salary', { name: sortBy, primer: null, reverse: false }));
    var prevval = '';
    var id = '';
    for (var i = 0; i < professions.length; i++) {
        var salarybucket = getSalaryBucket(professions[i].salary);
        if (prevval != salarybucket) {
            id = guid();
            groupHeaderFor('salary', salarybucket, id);
            prevval = salarybucket;
            renderEnrichedItems(id, function (x) { return getSalaryBucket(x.salary); }, salarybucket);
        }
    }
    hideEmptyGroups();
}
function groupbyfield() {
    currentgrouping = 'field';
    $('#columns').html('');
    var interests = [];
    for (var property in importantthings) {
        if (importantthings.hasOwnProperty(property) && importantthings[property] == 1) {
            interests.push(property);
        }
    }
    var filteredCareers = getEnrichedItems().filter(function (x) {
        return interests.map(function (y) { return x[y] == 1; }).every(Boolean);
    });
    var fields = filteredCareers.map(function (x) { return x.fld; }).reduce(function (a, b) { return a.concat(b); }).filter(unique);
    fields.sort(function (a, b) { return a - b; });
    fieldIds = {};
    for (var i = 0; i < fields.length; i++) {
        var id = guid();
        groupHeaderFor(currentgrouping, ctFld[fields[i]], id);
        fieldIds[fields[i]] = id;
    }
    professionsFoundArray = [];
    for (var c = 0; c < filteredCareers.length; c++) {
        itemFor(filteredCareers[c], null);
    }
    renderhtml(null);
    professionsFound = filteredCareers.length;
    hideEmptyGroups();
}
function unique(value, index, self) {
    return self.indexOf(value) === index;
}
function getSalaryBucket(salary) {
    if (salary > 250000)
        return '250k+';
    else if (salary > 200000)
        return '200k - 250k';
    else if (salary > 150000)
        return '150k - 200k';
    else if (salary > 100000)
        return '100k - 150k';
    else if (salary > 90000)
        return '90k - 100k';
    else if (salary > 80000)
        return '80k - 90k';
    else if (salary > 70000)
        return '70k - 80k';
    else if (salary > 60000)
        return '60k - 70k';
    else if (salary > 50000)
        return '50k - 60k';
    else if (salary > 40000)
        return '40k - 50k';
    else if (salary > 30000)
        return '30k - 40k';
    else
        return 'Under 30k';
}

function toggleallgroups(toggle) {
    if ($(toggle).html() == '[+]') {
        $('.groupcontent').show();
        $('.grouptoggle').html('[-]');
        $(toggle).html('[-]');
    }
    else {
        $('.groupcontent').hide();
        $('.grouptoggle').html('[+]');
        $(toggle).html('[+]');
    }
}
function togglegroup(toggle) {
    if ($(toggle).html() == '[+]') {
        $('#p' + $(toggle).attr('group')).show();
        $(toggle).html('[-]');
        refreshContent(true);
    }
    else {
        $('#p' + $(toggle).attr('group')).hide();
        $(toggle).html('[+]');
    }
}
function groupHeaderFor(grouping, value, id) {
    if (currentgrouping == '') {
        $('#columns').append('<div class="group" id="g' + id + '"><p id="p' + id + '"></p></div>');
    }
    else {
        $('#columns').append('<div class="group"  id="g' + id + '"><b onclick="togglegroup(this.children)">' + value + '<span class="grouptoggle" id="toggle' + id + '" group="' + id + '">[+]</span></b><p class="groupcontent" id="p' + id + '" style="display: ' + (expandprofessiongroups == false ? 'none' : '') + ';"></p></div>');
    }
}



var itemClickPredicate = null;
function itemFor(item, id) {
    var rank = 0;
    var akaTitle = '';
    if (filtervalue != '') {
        var score = 0;
        var reg = new RegExp(filtervalue, 'i');
        if (reg.test(item.title)) {
            score++;
        } else {
            if (reg.test(item.aka)) {
                for (var aka = 0; aka < item.aka.length; aka++) {
                    if (reg.test(item.aka[aka])) {
                        akaTitle = item.aka[aka];
                        score++;
                        break; //stop possibility to add multiple alt titles
                    }
                }
            }
        }
        //if (item.title.toLowerCase().indexOf(filtervalue) >= 0) {
        //    score++;
        //}
        //var desc = findbycode(descriptions, item.code);
        //if (desc != null) {
        //    if (desc.description.toLowerCase().indexOf(filtervalue) >= 0) {
        //        score++;
        //    }
        //}
        if (score == 0) {
            return;
        }
    }

    if (isItemExcluded(item.title)) {
        return;
    }

    //match selected dimensions
    //if (dimensions.attitude != '' && (!(item.attitude == '' || item.attitude == dimensions.attitude))) { return; } else if (dimensions.attitude != '' && item.attitude == dimensions.attitude) { rank++; }
    //if (dimensions.information != '' && (!(item.information == '' || item.information == dimensions.information))) { return; } else if (dimensions.information != '' && item.information == dimensions.information) { rank++; }
    //if (dimensions.processing != '' && (!(item.processing == '' || item.processing == dimensions.processing))) { return; } else if (dimensions.processing != '' && item.processing == dimensions.processing) { rank++; }
    //if (dimensions.action != '' && (!(item.action == '' || item.action == dimensions.action))) { return; } else if (dimensions.action != '' && item.action == dimensions.action) { rank++; }
    //if (dimensions.endurance != '' && (!(item.endurance == '' || item.endurance == dimensions.endurance))) { return; } else if (dimensions.endurance != '' && item.endurance == dimensions.endurance) { rank++; }
    //if (dimensions.presence != '' && (!(item.presence == '' || item.presence == dimensions.presence))) { return; } else if (dimensions.presence != '' && item.presence == dimensions.presence) { rank++; }
    //if (dimensions.concentration != '' && (!(item.concentration == '' || item.concentration == dimensions.concentration))) { return; } else if (dimensions.concentration != '' && item.concentration == dimensions.concentration) { rank++; }
    //if (dimensions.patterns != '' && (!(item.patterns == '' || item.patterns == dimensions.patterns))) { return; } else if (dimensions.patterns != '' && item.patterns == dimensions.patterns) { rank++; }
    //if (dimensions.compensation != '' && (!(item.compensation == '' || item.compensation == dimensions.compensation))) { return; } else if (dimensions.compensation != '' && item.compensation == dimensions.compensation) { rank++; }

    if (importantthings.beauty != 0 && item.beauty == 0) { return; }
    if (importantthings.helping != 0 && item.helping == 0) { return; }
    if (importantthings.adventure != 0 && item.adventure == 0) { return; }
    if (importantthings.safety != 0 && item.safety == 0) { return; }
    if (importantthings.people != 0 && item.people == 0) { return; }
    if (importantthings.science != 0 && item.science == 0) { return; }
    //if (importantthings.easy != 0 && item.easy == 0) { return; }
    if (importantthings.duty != 0 && item.duty == 0) { return; }
    if (importantthings.admiration != 0 && item.admiration == 0) { return; }
    if (importantthings.creativity != 0 && item.creativity == 0) { return; }
    if (importantthings.competition != 0 && item.competition == 0) { return; }
    if (importantthings.animals != 0 && item.animals == 0) { return; }
    if (importantthings.politics != 0 && item.politics == 0) { return; }
    if (importantthings.technology != 0 && item.technology == 0) { return; }
    if (importantthings.machinery != 0 && item.machinery == 0) { return; }
    //if (importantthings.gender != 0 && item.gender == 0) { return; }
    if (importantthings.handlabor != 0 && item.handlabor == 0) { return; }
    //if (importantthings.heavyequipment != 0 && item.heavyequipment == 0) { return; }
    if (importantthings.strength != 0 && item.strength == 0) { return; }
    if (importantthings.drafting != 0 && item.drafting == 0) { return; }
    if (importantthings.coordinating != 0 && item.coordinating == 0) { return; }
    //if (importantthings.quickthinking != 0 && item.quickthinking == 0) { return; }
    if (importantthings.numbers != 0 && item.numbers == 0) { return; }
    if (importantthings.critical != 0 && item.critical == 0) { return; }
    //if (importantthings.smart != 0 && item.smart == 0) { return; }
    if (importantthings.salesy != 0 && item.salesy == 0) { return; }

    //if (importantthings.beauty == 0 && item.beauty == 1) { return; }
    //if (importantthings.helping == 0 && item.helping == 1) { return; }
    //if (importantthings.adventure == 0 && item.adventure == 1) { return; }
    //if (importantthings.safety == 0 && item.safety == 1) { return; }
    //if (importantthings.people == 0 && item.people == 1) { return; }
    //if (importantthings.science == 0 && item.science == 1) { return; }
    ////if (importantthings.easy != 0 && item.easy == 0) { return; } 
    //if (importantthings.duty == 0 && item.duty == 1) { return; }
    //if (importantthings.admiration == 0 && item.admiration == 1) { return; }
    //if (importantthings.creativity == 0 && item.creativity == 1) { return; }
    //if (importantthings.competition == 0 && item.competition == 1) { return; }
    //if (importantthings.animals == 0 && item.animals == 1) { return; }
    //if (importantthings.politics == 0 && item.politics == 1) { return; }
    //if (importantthings.technology == 0 && item.technology == 1) { return; }
    //if (importantthings.machinery == 0 && item.machinery == 1) { return; }
    ////if (importantthings.gender != 0 && item.gender == 0) { return; }
    //if (importantthings.handlabor == 0 && item.handlabor == 1) { return; }
    ////if (importantthings.heavyequipment != 0 && item.heavyequipment == 0) { return; }
    //if (importantthings.strength == 0 && item.strength == 1) { return; }
    //if (importantthings.drafting == 0 && item.drafting == 1) { return; }
    //if (importantthings.coordinating == 0 && item.coordinating == 1) { return; }
    ////if (importantthings.quickthinking != 0 && item.quickthinking == 0) { return; }
    //if (importantthings.numbers == 0 && item.numbers == 1) { return; }
    //if (importantthings.critical == 0 && item.critical == 1) { return; }
    ////if (importantthings.smart != 0 && item.smart == 0) { return; }
    //if (importantthings.salesy == 0 && item.salesy == 1) { return; }

    //if (item.beauty == 1) { toShow.beauty = 1; }
    //if (item.helping == 1) { toShow.helping = 1; }
    //if (item.adventure == 1) { toShow.adventure = 1; }
    //if (item.safety == 1) { toShow.safety = 1; }
    //if (item.people == 1) { toShow.people = 1; }
    //if (item.science == 1) { toShow.science = 1; }
    ////if (importantthings.easy != 0 && item.easy == 0) { return; }
    //if (item.duty == 1) { toShow.duty = 1; }
    //if (item.admiration == 1) { toShow.admiration = 1; }
    //if (item.creativity == 1) { toShow.creativity = 1; }
    //if (item.competition == 1) { toShow.competition = 1; }
    //if (item.animals == 1) { toShow.animals = 1; }
    //if (item.politics == 1) { toShow.politics = 1; }
    //if (item.technology == 1) { toShow.technology = 1; }
    //if (item.machinery == 1) { toShow.machinery = 1; }
    ////if (item.gender == 1) { toShow.gender = true; }
    //if (item.handlabor == 1) { toShow.handlabor = 1; }
    ////if (importantthings.heavyequipment != 0 && item.heavyequipment == 0) { return; }
    //if (item.strength == 1) { toShow.strength = 1; }
    //if (item.drafting == 1) { toShow.drafting = 1; }
    //if (item.coordinating == 1) { toShow.coordinating = 1; }
    ////if (importantthings.quickthinking != 0 && item.quickthinking == 0) { return; }
    //if (item.numbers == 1) { toShow.numbers = 1; }
    //if (item.critical == 1) { toShow.critical = 1; }
    ////if (importantthings.smart != 0 && item.smart == 0) { return; }
    //if (item.salesy == 1) { toShow.salesy = 1; }

    if (!itemshoulddisplay(item)) {
        return;
    }
    item.rank = rank;
    item.akaTitle = akaTitle;
    item.otherInterests = importantthingdefinitions.filter(function (x) { return importantthings[x.name] == 0 && item[x.name] == 1 }).map(function (x) { return x.caption; });
    professionsFoundArray.push(item);
    //$('#p' + id).append(htmlforitem(item.title, item.title.replace(new RegExp(filtervalue, "i"), '<span style="background-color: yellow">' + filtervalue + '</span>'), item.salary,  akaTitle != '' ? (' (aka ' + akaTitle.replace(new RegExp(filtervalue, "i"), '<span style="background-color: yellow">' + filtervalue + '</span>') + ')') : ''));
    professionsFound++;   
}

function renderhtml(id) {
    switch (sortBy) {
        case 'salary':
            professionsFoundArray.sort(sortbysalary);
            break;
        case 'popularity':
            professionsFoundArray.sort(sortbypopularity);
            break;
        case 'relevance':
            professionsFoundArray.sort(sortbyrank);
            break;
    }
    for (var i = 0; i < professionsFoundArray.length; i++) {
        var item = professionsFoundArray[i];
        var onclick = 'data-index="' + i + '" onclick="saveCareerIndex(this)"';
        //var onclick = '';
        var ratedHtml = "";

        if (profileType == 'student') {
            if (ratedCareers.length == 0) {
                ratedHtml = '<span class="yesNoIcon">Not Rated</span>';
            }
            else {
                var index = ratedCareers.map(function (x) { return x.dolcode; }).indexOf(item.code);
                if (index == -1) {
                    ratedHtml = '<span class="yesNoIcon">Not Rated</span>';
                }
                else {
                    var rating = ratedCareers[index].rating;
                    if (rating == '1') {
                        ratedHtml = '<span class="yesNoIcon yesIcon">Rated Yes</span>';
                    }
                    else {
                        ratedHtml = '<span class="yesNoIcon noIcon">Rated No</span>';
                    }
                }

            }
        }
        if (id) {
            $('#p' + id).append(htmlforitem(item.title, item.title.replace(new RegExp(filtervalue, "i"), '<span style="background-color: rgb(239, 51, 51);">' + filtervalue + '</span>'), item.salary, onclick, item.akaTitle != '' ? (' (aka ' + item.akaTitle.replace(new RegExp(filtervalue, "i"), '<span style="background-color: rgb(239, 51, 51);">' + filtervalue + '</span>') + ')') : '', item.code, ratedHtml, item.field, item.index, item.jobs));
        } else {
            for (var d = 0; d < item.fld.length; d++) {
                $('#p' + fieldIds[item.fld[d]]).append(htmlforitem(item.title, item.title.replace(new RegExp(filtervalue, "i"), '<span style="background-color: rgb(239, 51, 51);">' + filtervalue + '</span>'), item.salary, onclick, item.akaTitle != '' ? (' (aka ' + item.akaTitle.replace(new RegExp(filtervalue, "i"), '<span style="background-color: rgb(239, 51, 51);">' + filtervalue + '</span>') + ')') : '', item.code, ratedHtml, item.field, item.index, item.jobs));
            }
        }
    }
    var careersList = professionsFoundArray.map(function (x) { return x.title.replace(/[^a-zA-Z0-9]+/g, '-'); });
    saveCareerList(careersList);

    
    //========================================================
    getJobs(professionsFoundArray);
    refreshContent();
    //========================================================
}

function saveCareerIndex(element) {
    var akaTitle = $(element).find('.professionAKA').text();
    if (akaTitle != '' && akaTitle != null) {
        localStorage.akaTitle = akaTitle.substring(6, akaTitle.length - 1);
    }
    var index = $(element).data('index');
    setCookie('careerIndex', index, 1);
}

function saveCareerList(careersTitles) {
    sessionStorage.careerList = JSON.stringify(careersTitles);
}
function isItemExcluded(title) {

    for (var i = 0; i < excludeditems.length; i++) {
        if (excludeditems[i] == title) {
            return true;
        }
    }
    return false;
}

function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
             .toString(16)
             .substring(1);
};

function guid() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
         s4() + '-' + s4() + s4() + s4();
}

var internalsortorder = '';
var currentgrouping = '';
function setinternalsortorder(order) {
    internalsortorder = order;
    rerenderData();
}
function rerenderData() {
    //toShow = { beauty: 0, helping: 0, adventure: 0, safety: 0, people: 0, science: 0, duty: 0, admiration: 0, creativity: 0, competition: 0, animals: 0, politics: 0, technology: 0, machinery: 0, handlabor: 0, strength: 0, drafting: 0, coordinating: 0, numbers: 0, critical: 0, salesy: 0 };
    professionsFoundArray = [];
    switch (currentgrouping) {
        case 'field':
            groupbyfield();
            importantthingstoggle = false;
            break;
        case 'major':
            groupbymajor();
            //importantthingstoggle = false;
            break;
        case 'minor':
            groupbyminor();
            //importantthingstoggle = false;
            break;
        case 'minedulevel':
            groupbyminedulevel();
            //importantthingstoggle = false;
            break;
            //case 'explevel':
            //    groupbyexplevel();
            //    break;
        case 'training':
            groupbytraining();
            //importantthingstoggle = false;
            break;
        case 'salary':
            groupbysalary();
            //importantthingstoggle = false;
            break;
        default:
            groupbyrelateditems();
            //importantthingstoggle = false;
            break;
    }
}

function hideEmptyGroups() {
    var groups = $('.group');
    for (var i = 0; i < groups.length; i++) {
        if ($(groups[i]).find("p").html().length == 0) {
            $(groups[i]).hide();
        }
    }
    if (professionsFound == 0 && $('.noresults').length == 0 && $('.group').filter(function () { return $(this).css('display') == 'block' }).length == 0) {
        $('.columns').html('').append('<p class="noresults">No matching careers</p>');
    } else if (professionsFound != 0) {
        $('.noresults').remove();
    }
}

function findbytitle(list, name) {
    for (var i = 0; i < list.length; i++) {
        if ($.trim(list[i].title).toLowerCase() == $.trim(name).toLowerCase())
            return list[i];
    }
    return null;
}

var filtervalue = '';
function applyFilter(value) {
    //if (value || value == '') {
    //    importantthingstoggle = true;
    //}
    //filtervalue = $('#searchbox').val().toLowerCase();
    if (value != "" && value.length < 3)
        return;
    filtervalue = value;
    rerenderData();
    $('#allgrouptoggle').html('[+]');
    toggleallgroups($('#allgrouptoggle'));
    $('.numberMatched').text(professionsFound == 0 ? 'No careers found' : professionsFound + ' careers found');
    $('#numberMatched').text(professionsFound == 0 ? 'No careers found' : professionsFound + ' careers found');
    if ($('.numberMatched').text().indexOf('No careers found') > -1) {
        $('.numberMatched').css('color', 'red');
    }
    else {
        $('.numberMatched').css('color', '#FF7D5C');
    }

    //if ($('#numberMatched').text().indexOf('No careers found') > -1) {
    //    $('#numberMatched').hide();
    //}
    //else {
    //    $('#numberMatched').show();
    //}

    if (professionsFound == 742) {
        $('#numberMatched').show().text('Your career results');
    } else if (professionsFound == 0) {
        $('#numberMatched').hide();
    }
    else {
        $('#numberMatched').show();
    }
}

function updateCareerCount() {
    var mr = matchResults();
    if (mr == 0) {
        $('.numberMatched').text('No careers found').css('color', 'red');
    }
    else {
        $('.numberMatched').text(mr + ' careers found').css('color', '#FF7D5C');
    }
}


//Popup description
var popupdescriptioncreated = false;
var displayedcode = '';
function showpopupdescription(event, code) {
    if (!popupdescriptioncreated) {

        $('#' + parentcontainerid).append('<div id="popupdescription" style="position: fixed; z-index: 99999; background-color:rgb(255,255,220); background-color: rgba(255,255,220,1);" class="popup">Hello!</div>');
        popupdescriptioncreated = true;
    }
    if (displayedcode != code) {
        //process code
        var desc = findbycode(descriptions, code);
        if (desc != null) {

            $('#popupdescription').html(desc.description);
            var matchedwords = matchDescriptionKeywords(seeddescription, desc.description, 'popupdescription', 'descriptioncontainer');
        }
        displayedcode = code;
    }

    var x = event.clientX;
    var y = event.clientY;

    $('#popupdescription').css('width', document.documentElement.clientWidth * 0.75);
    $('#popupdescription').css('left', Math.min(Math.max(x - $('#popupdescription').outerWidth() / 2, 40), document.documentElement.clientWidth - $('#popupdescription').outerWidth() - 40));
    $('#popupdescription').css('top', y - $('#popupdescription').outerHeight() - 20);
    $('#popupdescription').show();
}
function hidepopupdescription(event) {
    $('#descriptioncontainer').html(seeddescription);
    $('#popupdescription').hide();
    event.preventDefault();
}

function matchDescriptionKeywords(desc1, desc2, previewcontainerid1, previewcontainerid2) {
    return 0;
    var matchcount = 0;
    var seedtokens = desc1.split(' ');

    for (var i = 0; i < seedtokens.length; i++) {
        var kw = seedtokens[i].replace(/(\(|\)|\.|\;|\,|\?|\!\bthe\b|\ba\b|\bof\b|\bas\b|\bto\b|\band\b|\bare\b|\bis\b|\bhave\b|\bgot\b|\bget\b|\byou\b|\bour\b|\byour\b|\bbe\b|\bby\b|\bcan\b|\bmay\b|\bwill\b|\bin\b|\bwhile\b|\bwhen\b|\bwhy\b|\bwith\b|\bor\b|\balso\b|\binto\b|\ban\b|\bthen\b|\bthan\b|\bany\b|\bjob\b|\bfor\b|\ball\b|\bthis\b|\bsuch\b|\bwho\b|\bmust\b|\bboth\b|\bwant\b|\bthat\b|\bnew\b|\byork\b|\bexperience\b|\blooking\b|\bwork\b|\bjoin\b|\bseeking\b|\byears\b|\btheir\b|\bnot\b|\bcall\b|\brequired\b|\employer\b|\bour\b|\bits\b|\bllp\b|\bwhich\b|\baren't\b|\binc\b|\btop\b|\bgpa\b|\bfrom\b|\babout\b|\bplease\b|\bsees\b|\bhas\b|\bposition\b|\bseeks\b|\bbecome\b|\bper\b|\bfull\b|\bout\b|\bwe\b|\bthrough\b|\bhow\b|\bbased\b|\bskills\b|\bprovide\b|\bdescription\b|\bon\b|\brole\b|\bother\b|\bability\b|\bensure\b|\bstrong\b|\bproviding\b|\bsupporting\b|\bassigned\b|\bworking\b|\bincluding\b|\bcommitted\b|\bapply\b|\bnow\b|\benjoy\b|\bup\b|\bno\b|\bavailable\b|\bat\b|\bwww\b|\bcom\b|\bvisit\b|\bmore\b|\blearn\b|\bresponsible\b|\includes\b|\excludes\b)/gi, '');
        if (kw.length >= 2) {
            var wholekw = '\\b' + kw + '\\b';

            if ((new RegExp(wholekw)).test(desc2)) {
                if (previewcontainerid1 != null) {
                    $('#' + previewcontainerid1).html($('#' + previewcontainerid1).html().replace(new RegExp(wholekw, "ig"), '<span style="background-color: rgb(239, 51, 51);">' + kw + '</span>'));
                }
                if (previewcontainerid2 != null) {
                    $('#' + previewcontainerid2).html($('#' + previewcontainerid2).html().replace(new RegExp(wholekw, "ig"), '<span style="background-color: rgb(239, 51, 51);">' + kw + '</span>'));
                }
                matchcount++;
            }
        }
    }
    return matchcount;
}
