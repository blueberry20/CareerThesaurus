var professions = null;
function document_ready() {
    $('.topnav .traitselector').addClass('active');
    $('input[type="radio"]').click(function () { registerinput(this); });
    getBlobData('skillcow', 'professions', 'allwithattributes.js');
}