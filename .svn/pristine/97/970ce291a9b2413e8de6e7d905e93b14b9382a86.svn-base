// -------------------------------------------------------- constracting page -----------------------------
function constractor(question) {
    var url = imagePath + question + '/' + gender + '_';
    //mobile
    if (isDeviceMobile && !isiPad) {
        $('.imageDiv').append('<img id="background" class="img" src="' + url + 'bg.jpg" />');
        displaySize();
        $('#hintModal').remove();
        $('#mobileLeft').attr("value", parameters.leftPersonTag).text(parameters.leftPersonTag);
        $('#mobileRight').attr("value", parameters.rightPersonTag).text(parameters.rightPersonTag);
        //displaySize();

        $('.headersText').append('<h1 class="mobileText"></h1>');
        //break question text into spans
        var words = parameters.text.replace(/\<[^>]+\>/g, '').split(' ');
        for (var i = 0; i < words.length; i++) {
            $('.mobileText').append('<span class="word">' + words[i] + '</span>');
        }

        $('.mobileWrapper').show();
        $('#navigationWrapper').hide();

       // $('.progress-bar').attr('aria-valuenow', answered).css({ 'width': answered / 0.09 + '%' }).text(answered + ' out of 9');

        answered = 0;
        for (var i = 1; i < 10; i++) {
            if (getCookie(dimensions[i - 1]) != null) {
                $('#question_' + i + ', #mobile_question_' + i).addClass('btn-success');
                answered++;
            } else {
                nextQuestion = nextQuestion == null && currentQuestion != i ? i : nextQuestion;
            }
        }
        for (var i = 10; i < 11; i++) {
            if (getCookie('question' + i) != null) {
                $('#question_' + i, '#mobile_question_' + i).addClass('btn-success');
                answered++;
            }
        }
        $('#question_' + question + ', #mobile_question_' + question).removeClass('btn-default btn-success').addClass('btn-primary');

        if (getCookie(parameters.dimension) != null) {
            changeAnswer = true;
            selectPerson(getCookie(parameters.dimension));
        }
        preloadImages(currentQuestion);
    } else { //desktop and ipad
        if (document.getElementById("blank") === null || document.getElementById("blank") === 'undefined') {
            $('.imageDiv').append('<img id="blank" class="img" src="' + '/Content/images/skilltest/blank.png' + '" usemap="#mapping" />');
        }
        if (document.getElementById("background") === null || document.getElementById("background") === 'undefined') {
            $('.imageDiv').append('<img id="background" class="img" src="' + url + 'bg.jpg" />');
        }
        $('.characters').append('<img class="leftPerson img" id="' + parameters.leftPersonTag + '" data-tooltip="' + parameters.leftTooltip + '" data-positionx="' + parameters.leftTooltipX + '" data-positiony="' + parameters.leftTooltipY + '" src="' + url + 'left.png" />').
                         append('<img class="rightPerson img" id="' + parameters.rightPersonTag + '" data-tooltip="' + parameters.rightTooltip + '" data-positionx="' + parameters.rightTooltipX + '" data-positiony="' + parameters.rightTooltipY + '" src="' + url + 'right.png" />');
        if (question == 1) {
            constractorQuestion_1();
        }
        $('.headersText').append('<h1 id="questionText" class="text">' + parameters.text + '<span class="glyphicon glyphicon-remove"></span></h1>');//.append('<div id="hintText"><h2>' + hint + '</h2></div>');
        $('#testMenuIcon').hide();
        $('#questionText').css('position', 'relative');
        $('.glyphicon-remove').click(function () {
            $('#questionText').hide();
        });      
        displaySize();

        delay = 0000;
        animateDelay = 1000;
        if (getCookie(parameters.dimension) != null) {
            delay = 0;
            animateDelay = 0;
        }

        setTimeout(function () {
            $('.mobileWrapper').hide();
            $('#background').css({ opacity: 1 });
            $('.characters .img').css({ opacity: 0 });
            $('body').css({ "background-color": "black" });
            resizeMapping(question);
            $('.characters .img').animate({ opacity: 1 }, { duration: animateDelay, easing: 'easeOutExpo' }).animate({ opacity: 0 }, { duration: animateDelay, easing: 'easeOutExpo' });

            $('#navigationWrapper').show();

            answered = 0;
            for (var i = 1; i < 10; i++) {
                if (getCookie(dimensions[i - 1]) != null) {
                    $('#question_' + i + ', #mobile_question_' + i).addClass('btn-success');
                    answered++;
                } else {
                    nextQuestion = nextQuestion == null && currentQuestion != i ? i : nextQuestion;
                }
            }
            for (var i = 10; i < 15; i++) {
                if (getCookie('question' + i) != null) {
                    $('#question_' + i, '#mobile_question_' + i).addClass('btn-success');
                    answered++;
                }
            }
            $('.questionNumber').text(question);
            $('#question_' + question + ', #mobile_question_' + question).removeClass('btn-default btn-success').addClass('btn-primary');
            $('#percentageProgress').html(answered == 0 ? '0%' : (answered / 0.10).toFixed(0) + '%');
            if (getCookie(parameters.dimension) != null) {
                if (question == 1) { 
                    selectPerson(getCookie('question1'));
                } else {
                    selectPerson(getCookie(parameters.dimension));
                }
            }

        }, delay);
        if (question == 1 && !showedBefore) {
            setTimeout(function () {
                if ($("#continue").hasClass('disabled')) {
                    $('#hintModal').modal();
                }
            }, 0);
        }
        showedBefore = true;
        preloadImages(currentQuestion);
       // $('.progress-bar').attr('aria-valuenow', answered).css({ 'width': answered / 0.09 + '%' }).text(answered + ' out of 9');
        
    }
} // END constractor

// ------------------------------------------------------ display resize adjustment -----------------------------------
function displaySize() {
    if (isiPad) {
        if (Math.abs(window.orientation) === 90) {
            winWidth = screen.height;
            winHeight = screen.width - 97;
            //landscape
        } else {
            //portrait
            winWidth = document.documentElement.clientWidth;
            winHeight = document.documentElement.clientHeight;
        }
    } else {
        winWidth = document.documentElement.clientWidth;
        winHeight = document.documentElement.clientHeight;
    }
    if (winHeight > winWidth) {
        $(".img").width(winHeight).height(winHeight).css({ 'left': Math.floor((winWidth - winHeight) / 2), 'right': Math.floor((winWidth - winHeight) / 2), 'top': 0, 'bottom': 0 });
    } else {
        $(".img").width(winWidth).height(winWidth).css({ 'top': Math.floor((winHeight - winWidth) / 2), 'bottom': Math.floor((winHeight - winWidth) / 2), 'left': 0, 'right': 0 });
    }
} // END display size

// ----------------------------------------------------- resize maping settings -------------------------------------
function resizeMapping(question) {
    var left = [],
        right = [];
    $('#leftMap, #rightMap').remove();
    if (($('#background').width() !== 1920) || ($('#background').height() !== 1920)) {
        var scallingRatio = $('#background').width() / 1920;
        for (var i = 0; i < parameters.leftMap.length; i++) {
            if (i % 2 == 0) {
                left.push(parameters.leftMap[i] * scallingRatio);
            } else {
                left.push(parameters.leftMap[i] * scallingRatio);
            }
        }
        for (var i = 0; i < parameters.rightMap.length; i++) {
            if (i % 2 == 0) {
                right.push(parameters.rightMap[i] * scallingRatio);
            } else {
                right.push(parameters.rightMap[i] * scallingRatio);
            }
        }
    } else {
        left = parameters.leftMap;
        right = parameters.rightMap;
    }
    $('map').append('<area id="leftMap" href="#" shape="poly" coords="' + left.join() + '" alt="' + parameters.leftPersonTag + '" onfocus="navigator.systemLanguage  != null ? blur() : null" onmouseover="highlightPerson(this.alt)" onmouseout="removeHighlight(this.alt)" onclick="selectPerson(this.alt, true)" />').
             append('<area id="rightMap" href="#" shape="poly" coords="' + right.join() + '" alt="' + parameters.rightPersonTag + '" onfocus="navigator.systemLanguage != null ? blur() : null" onmouseover="highlightPerson(this.alt)" onmouseout="removeHighlight(this.alt)" onclick="selectPerson(this.alt, true)" />');

    if (question == 1) {
        resizeMappingQuestion_1();
    }
} // END resize mapping

// ================================================= adjust tooltip coordinates based on screen size =======================
function tooltipMapping(x, y) {
    if (winHeight > winWidth) {
        var scalling = winHeight / 1920,
            positionX = parseInt(x) * scalling + ((winWidth - winHeight) / 2),
            positionY = parseInt(y) * scalling;
    } else {
        var scalling = winWidth / 1920,
            positionX = parseInt(x) * scalling,
            positionY = parseInt(y) * scalling + ((winHeight - winWidth) / 2);
    }
    return [positionX, positionY];
} // END tooltip mapping

// ------------------------------------------------------ hover over effects -------------------------------------
function highlightPerson(personTag) {
    if (isiPad) {
        return;
    }
    $('.img:animated').finish();
    $('#background').css({ opacity: 0.8 }).addClass('gray');
    if (!($('.characters').children().hasClass('selectedPerson'))) {
        $('#' + personTag).css({ opacity: 1 });
    } else {
        $('.selectedPerson, #' + personTag).css({ opacity: 1 });
    }
    //show hover tooltip
    if (!($('#' + personTag).hasClass('selectedPerson'))) {
        var content = $('#' + personTag).data('tooltip'),
            positionXY = tooltipMapping($('#' + personTag).data('positionx'), $('#' + personTag).data('positiony'));
        $('#hover-content').text(content);
        $('.hover-tooltip').css({ left: parseInt(positionXY[0] - ($('.hover-tooltip').innerWidth() / 2)), top: parseInt(positionXY[1] - ($('.hover-tooltip').innerHeight())) }).show();
    }
} // END highlight person

function removeHighlight(personTag) {
    if (!($('.characters').children().hasClass('selectedPerson'))) {
        $('#' + personTag).css({ opacity: 0 });
        $('#background').css({ opacity: 1 }).removeClass('gray');
    } else {
        $('.selectedPerson').siblings().css({ opacity: 0 });
    }
    //hide hover tooltip
    $('.hover-tooltip').hide();
} // END remove highlight

// ---------------------------------------------- highlight answer and save answer to cookie -----------------------------
function selectPerson(personTag, save) {
    if (isDeviceMobile && !isiPad) {
        $('button[value="' + personTag + '"]').addClass('activeBtn').parent().siblings().children().removeClass('activeBtn');
        if (!changeAnswer) {
            if (nextQuestion) {
                $('#moveToQuestion').val(nextQuestion);
                $('#navigationForm').submit();
            }
        } else {
            changeAnswer = false;
        }        
    }
    else if (isDeviceMobile && isiPad) {
        $('#background').css({ opacity: 0.8 }).addClass('gray');
        $('#' + personTag).addClass('selectedPerson').css({ opacity: 1 }).siblings().removeClass('selectedPerson').css({ opacity: 0 });
        //  $('img, map, area').blur();
        //show selected tooltip
        //  $('.hover-tooltip').hide();
        var content = $('#' + personTag).data('tooltip'),
            positionXY = tooltipMapping($('#' + personTag).data('positionx'), $('#' + personTag).data('positiony'));
        $('#selected-content').text(content);
        $('.selected-tooltip').css({ left: parseInt(positionXY[0] - ($('.selected-tooltip').innerWidth() / 2)), top: parseInt(positionXY[1] - ($('.selected-tooltip').innerHeight())) }).show();
        //var right = $('#continue').offset().right;
        // $("#continue").css('right', (winWidth / 2) - 130 + 'px');
        $('#continue').show();
    }
    else { //desktop
        $('#background').css({ opacity: 0.8 }).addClass('gray');
        $('#' + personTag).addClass('selectedPerson').css({ opacity: 1 }).siblings().removeClass('selectedPerson').css({ opacity: 0 });
        $('.img, map, area').blur();
        //show selected tooltip
        $('.hover-tooltip').hide();
        var content = $('#' + personTag).data('tooltip'),
            positionXY = tooltipMapping($('#' + personTag).data('positionx'), $('#' + personTag).data('positiony'));
        $('#selected-content').text(content);
        $('.selected-tooltip').css({ left: parseInt(positionXY[0] - ($('.selected-tooltip').innerWidth() / 2)), top: parseInt(positionXY[1] - ($('.selected-tooltip').innerHeight())) }).show();
        //var right = $('#continue').offset().right;
        //$("#continue").css({ right: right }).animate({ "right": (winWidth / 2) - 130 + 'px' }, "fast");
        $('#continue').show();
    }
    if (getCookie(parameters.dimension) == null) {
        answered++;
        $('.progress-bar').attr('aria-valuenow', answered).css({ 'width': answered / 0.09 + '%' }).text(answered + ' out of 9');
    }
    if (currentQuestion == 1) {
        setCookie('question1', personTag, 365);
        if (personTag == 'left_1' || personTag == 'Extrovert' || personTag == 'center_1') {
            setCookie(parameters.dimension, 'Extrovert', 365);
            if (save) {
                saveDimension(parameters.dimension, 'Extrovert', personTag);
                if (ga) ga('send', 'event', 'Dimensions', parameters.dimension, 'Extrovert');
            }
        } else if (personTag == 'Introvert' || personTag == 'right_1') {
            setCookie(parameters.dimension, 'Introvert', 365);
            if (save) {
                saveDimension(parameters.dimension, 'Introvert', personTag);
                if (ga) ga('send', 'event', 'Dimensions', parameters.dimension, 'Introvert');
            }
        }
    } else {
        setCookie(parameters.dimension, personTag, 365);
        if (save) {
            saveDimension(parameters.dimension, personTag);
            if (ga) ga('send', 'event', 'Dimensions', parameters.dimension, personTag);
        }
    }
    if (answered >= 9) {
        var hrefURL = profileType == 'student' ? '/StudentPortal' : '/Careers/ByPersonality';
        $('#continue').css({ 'color': '#fff', 'border-color': '#fff' }).attr({ href: '/TakeTest/Interests' });
        //$('#resultsBtn').css('display', 'block');
        if (isDeviceMobile && !isiPad) {
            $('.resultBtnMobile').show();
        }
       // window.location.href = '/TakeTest/Interests';
    }
    $('#continue').removeClass('disabled');
} //END select person

function continueBtnPosition() {
    if (!$("#continue").hasClass('disabled')) {
        //if (isDeviceMobile && !isiPad) {
        //    $('#continue').css({ 'display': 'inline-block', 'position': 'relative', 'right': '0', 'width': '100%', 'background-color': 'rgb(66, 212, 170)' });
        //} else {
        //     $("#continue").css({ right: winWidth / 2 - 130 + 'px', width: '260px', 'position': 'fixed', 'background-color': '#38D5A3' });          
        //}
        $('#continue').show();
    }
}

function saveDimension(dimension, value, misc) {
    if (user != null && user != '' && profileType == 'student') {
        $.post('CareerTest/SaveDimension', { user: user, dimension: dimension, value: value, misc: (misc ? misc : '') });
    }
}

function openProfessions() {
    if (isDeviceMobile && !isiPad) {
        $('#skillTestModal').hide();
    }
    $('#professionsOverlay').show();
    $('.closeIcon').click(function () {
        $('#professionsOverlay').hide();
        if (isDeviceMobile && !isiPad) {
            $('#skillTestModal').show();
        }
    })
}

function clearProfessions() {
    $('#pickProfessionBtn').html('Pick One <i class="fa fa-angle-right pull-right"></i>')
}

function resizeQuestionText() {
    $('#questionText').css('width', 'initial').animate({ padding: '10px', 'font-size': '30px', 'background-color': 'rgba(0,0,0,0.7)' }, 'slow');
}

//-------------------------------------------------------------- working with cookies ---------------------------------
function getCookie(c_name) {
    var i, x, y, ARRcookies = document.cookie.split(";");
    for (i = 0; i < ARRcookies.length; i++) {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");
        if (x == c_name) {
            return unescape(y);
        }
    }
} //END getting cookies

function setCookie(c_name, value, exdays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value;
    c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
    document.cookie = c_name + "=" + c_value + "; path=/"; //------------------------------------- added path=/ ---------------------------
} // END setting cookies

//--------------------------------------------------------preload next images----------------------------------
function preloadImages(currentQuestion) {
    if (currentQuestion < 9) {
        var nextQuestion = currentQuestion + 1,
            url = imagePath + nextQuestion + '/' + gender + '_';
        for (var i = 0; i < 3; i++) {
            images[i] = new Image();
        }
        images[0].src = url + 'bg.jpg';
        if (!isDeviceMobile || isiPad) {
            images[1].src = url + 'left.png';
            images[2].src = url + 'right.png';
        }
    }
} // END preload images