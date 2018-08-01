function document_ready() {

    $('.topnav .browse').addClass('active');

    getBranchesFromBlob();

    setTimeout(function () {
        peekcow();
    }, 1000);

}

