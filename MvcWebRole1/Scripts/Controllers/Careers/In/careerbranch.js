

function branch_mouseover(e) {
    $('.activated').stop();
    $('.activated').animate({ 'width': '270', 'left': '0', 'top': '0', 'opacity': 1 }, 300);
    $('.activated').removeClass('activated');

    var img = $(e).children('img');

    img.animate({ 'width': '300', 'left': '-15', 'top': '-15', 'opacity': 0.1 }, 500);
    img.addClass('activated');

    $(e).siblings('.details').css('opacity', 1);
}

function branch_mouseout(e) {
    var img = $(e).children('img');
    //img.css('opacity', '1');
    img.animate({ 'width': '270', 'left': '0', 'top': '0', 'opacity': 1 }, 300);
}

function branch_click(e) {
    var urlparam = $(e).attr('urlparam');

    document.location = '/careers/' + urlparam;
}