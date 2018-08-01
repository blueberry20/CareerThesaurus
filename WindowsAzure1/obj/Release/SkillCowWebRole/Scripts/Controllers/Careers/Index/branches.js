function $branches_ready(data) {
    for (var i = 0; i < data.items.length; i++) {
        $('#branches').append('<div class="branchholder"><div class="details"><h1>' + data.items[i].branch + '</h1></div><div class="imageholder" urlparam="' + data.items[i].urlparam + '"><img class="branchimage" src="/content/images/careerassessment/covers/bybranch/' + data.items[i].id + '.jpg"/></div><div class="footer">' + data.items[i].count + ' careers</div></div>');
    }

    $('.details').each(function () {
        $(this).css('top', 140 - parseInt($(this).css('height')) / 2);
        $(this).css('opacity', 1);
    });

    $('.imageholder img').css('opacity', 0.3);
    //$('.imageholder .details').css('opacity', 1);

    $('.imageholder').mouseover(function () { branch_mouseover(this); });
    $('.imageholder').mouseout(function () { branch_mouseout(this); });
    $('.imageholder').click(function () { branch_click(this); });
}

function getBranchesFromBlob() {
    var headID = document.getElementsByTagName("head")[0];
    var newScript = document.createElement('script');
    newScript.type = 'text/javascript';
    newScript.src = 'https://chaindate.blob.core.windows.net/skillcow/professions/branches.js';
    headID.appendChild(newScript);
}

function branch_mouseover(e) {
    $('.activated').stop();
    $('.activated').animate({ 'width': '270', 'left': '0', 'top': '0', 'opacity': 0.3 }, 300);
    $('.activated').removeClass('activated');

    var img = $(e).children('img');

    img.animate({ 'width': '300', 'left': '-15', 'top': '-15', 'opacity': 1 }, 500);
    img.addClass('activated');

    //$(e).siblings('.details').css('opacity', 1);
}

function branch_mouseout(e) {
    var img = $(e).children('img');
    //img.css('opacity', '1');
    img.animate({ 'width': '270', 'left': '0', 'top': '0', 'opacity': 0.3 }, 300);
}

function branch_click(e) {
    var urlparam = $(e).attr('urlparam');

    document.location = '/careers/in/' + urlparam;
}