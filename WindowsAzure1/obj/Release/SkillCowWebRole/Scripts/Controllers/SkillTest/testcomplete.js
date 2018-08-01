var top3careerspicked = false;

function testComplete(answerrevised) {

    if (getCookie('teststarttime') != null && getCookie('testcomplete')==null) {
    
        var ts = parseFloat(getCookie('teststarttime'));
        var d = new Date();

        var elapsed = d.getTime() - ts;

        setCookie('testcomplete', 1);
        setCookie('testelapsedtime', elapsed);

        uxevent('testcomplete', '');
    }

    //Show refinements
    $('#questionindex').hide();
    $('#test').css('width', 647);
    $('#refinementcanvas').css('width', 629);
    $('.intestfacebookbar').css('width', 627);
    $('#annotations').css('width', 647);
    $('#intestvmlistings').css('left','20px');

    $('.intestfacebookbar').show();
    $('#refinementcanvas').show();
    $('#importantthingscanvas h2').hide();
    $('#importantthingscanvas h3').show();
    $('#importantthingscanvas .answerbutton').hide();

    //$('#startoverbutton').hide();
    $('#progresspanel').hide();
    
    //STEP 1. Ask filter questions, grad year and edu level
    var filterquestionsformcomplete = getCookie('education_level') != null && getCookie('gradyear') != null;
    if (!filterquestionsformcomplete) {
        $('.questionholder').hide();
        $('#filterquestionsform').show();

        moveInsert('filterquestionsform', 'test');
        return;
    }

    var sgradyear = getCookie('gradyear');
    var igradyear = parseInt(sgradyear);
    var gradyearpass = false;
    if (!isNaN(igradyear)) {
        var d = new Date();
        if (igradyear < d.getFullYear() || (d.getMonth() > 4 && igradyear <= d.getFullYear())) {
            gradyearpass = true;
        }
    }

    var careersSelected = countCareersSelected();
    if (careersSelected > 0) {
        $('#top10careerscanvas').hide();
    }

    $('.questionholder').hide();

    //if (!thanksflag && (!(recordsubmitted && extendedrecordcomplete) || !gradyearpass || careersSelected == 0)) {
    if (!recordsubmitted) {
        //debugalert('Get TOP CAREER PICKS');

        //STEP 2.  Get TOP CAREER PICKS
        var min_careers = 1;
        
        if (careersSelected < min_careers) {
            if (careersSelected > 0) {
                alert('Select at least ' + (min_careers - careersSelected) + ' more careers of your choice');
            }
            $('.questionholder').hide();
            $('#top10careerscanvas').show();

            moveInsert('top10careerscanvas', 'test');
            return;
        }
        $('#top10careerscanvas').hide();

        saveCareerChoicesAsCookies();
        uxevent('careersselected','');

        //Search for schools in the background
        if (!findSchoolsForTopCareersexecuted) {
            try{
                findSchoolsForTopCareers();
            }
            catch (e) {
                debugalert(e.message);
            }
        }

        //STEP 3.  Display RECORD form
        var basicrecordcomplete = getCookie('zip') != null && getCookie('firstname') != null && getCookie('lastname') != null && getCookie('phone') != null && getCookie('email') != null;
        if (!basicrecordcomplete) {
            $('.intestfacebookbar').hide();
            $('#refinementcanvas').hide();
            
            $('.questionholder').hide();
            //$('#recordformzip').val(getCookie('zip'));
            $('#recordformfirstname').val(getCookie('firstname'));
            $('#recordformlastname').val(getCookie('lastname'));
            $('#recordformphone').val(getCookie('phone'));
            $('#recordformemail').val(getCookie('email'));
            $('#basicrecordform').show();
            
            moveInsert('basicrecordform', 'test');
            $('#test').css('min-height', 400);

            try{
                $('#recordformbirthyear').val((igradyear-18));
            }
            catch(e)
            {
            }

            $('#recordformsalutation').focus();

            return;
        }
        $('#basicrecordform').hide();
        
        if (gradyearpass && !extendedrecordcomplete && schoolformsdownloaded == true && totalschoolforms > 0) {
            
            debugalert('Displaying schools');

            //Show CBN schools form
            $('.intestfacebookbar').hide();
            $('#refinementcanvas').hide();
            $('.questionholder').hide();
            $('#customformcontainer').show();
            moveInsert('customformcontainer', 'test');
            return;
        }
        else {

            debugalert('No schools, Displaying VM listings');

            extendedrecordcomplete = true;
            setCookie('extendedrecordcomplete', 1, 365);

            showresultannotations('testComplete1');
            showVMListings();
        }
        
        
        $('#customformcontainer').hide();
        $('.intestfacebookbar').show();
        $('#refinementcanvas').show();
            
    }
    else {

        showresultannotations('testComplete2');

        showThanks();

        showVMListings();
    }
}

function showThanks() {

    var cthanks = getCookie('thanks');
    if (cthanks != null && cthanks == 1) {
        return;
    }

    if (!revisinganswers) {
        $('#refinementcanvas').hide();
        $('.questionholder').hide();
        $('#thankyoucanvas').show();
        moveInsert('thankyoucanvas', 'test');
        $('#test').css('min-height', 60);
    }

    setCookie('thanks',1,365);
}

function showVMListings() {
    var topcareerchoice = getTopCareerChoice();
    if (topcareerchoice != null) {
        $('#vmcareername').html(topcareerchoice.name);

        for (var i = 0; i < careerchoices.length; i++) {
            var cc = careerchoices[i];
            if (i == 0) {
                $('#vmcareerlinks').append('<a href="javascript:showVMSchoolsForCareer(' + cc.vmprodid + ', \'' + cc.name + '\');">' + cc.name + '</a>');
            }
            else {
                $('#vmcareerlinks').append(' | <a href="javascript:showVMSchoolsForCareer(' + cc.vmprodid + ', \'' + cc.name + '\');">' + cc.name + '</a>');
            }

        }

        //Show VM listings
        //vm_loadListings({
        //    prodId: topcareerchoice.vmprodid, //type insurance
        //    aid: 12368, //affiliate 12368
        //    cid: getCookie('vmcampaign'), //campaign 7587
        //    adSource: ''
        //});

        $('.intestfacebookbar').hide();
        $('#refinementcanvas').hide();
        $('.questionholder').hide();
        $('#vmschoolscontainer').show();
        moveInsert('vmschoolscontainer', 'test');

        $('#questionindex').hide();

        $('#test').css('width', 647);
        //$('#annotations').hide();

        return;
    }
    else {
        
        showresultannotations('showVMListings');

        showThanks();
    }
}




