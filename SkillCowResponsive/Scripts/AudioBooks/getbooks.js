// its ok to run this function for multiple roles on same page, just pass another role name, dont forget to have div with same id <div id='ROLENAME'></div>


function getBooksForRole(role) {
    role = role.toLowerCase().replace(" ", "-").trim(); // role name as file and later to have id of html element cannot have spaces so sapces replaced with '-'
    getBlobData("audiobooks", "byrole", role + ".js");
}

function $audiobooks_ready(audioBooks, container, resourceid, directoryPath) {
    var books = audioBooks.value;
    // books is array of books, loop thru it

    // resourceid = is name of the role so if need to add html to div tag have same id name $(resourceid).html(html); resourceid same as role name but ' ' replaced with '-';

    // if need to sort books by rank uncomment next line, 1 is higher rank then 2
     books.sort(sortByRank);

    var html = '';
        for (var i = 0; i < books.length; i++) {
            // fields: (all fields are strings)
            // books[i].ASIN  =  ASIN number (no idea if we will need it), eg. "B00KMD4DBW"
            // books[i].AudioLength = length of the book, eg. "8 hours and 21 min."
            // books[i].Author = author of the book, eg. "Kevin D. Johnson"
            // books[i].BuyUrl = url should be place in href, replace placeholder [YOUR-PID] with affiliate code declaired as global variable in _Layout "audioBooksId".
            //                   use it like this: var href = books[i].BuyUrl.replace('[YOUR-PID]', audioBooksId); then href is full url can be placed to <a>
            var href = books[i].BuyUrl.replace('[YOUR-PID]', audioBooksId);
            // books[i].LargeImageUrl = url to image 95x95 px
            // books[i].ThumbNailUrl = url to image same as large but 60x60 px
            // books[i].Name = full name of the book
            // books[i].Narrator = name of the person
            // books[i].OurPrice = price of book, eg. '18.03'
            // books[i].Publisher = publishers name, eg. 'Johnson Media Inc.'
            // books[i].Rank = Mike's rank, can be used to sort books
            // books[i].ReleaseDate = eg. '30-May-14'
            // books[i].RetailPrice = eg. '25.75'
            // books[i].SKU = dont know if we will use it, eg. 'BK_ACX0_019092'
            // books[i].SampleUrl = url to sample it link to mp3 file
            // books[i].LongDescription = description of book, contain html tags
            // books[i].ShortDescription = description of book, may contain html tags
            // create html here for all books
            html += '<div class="bookInfo"><a href="' + href + '" data-bookname="' + books[i].Name + '" onclick="reportClickToGA(this);"><img src="' + (books[i].LargeImageUrl == "" ? "/Content/images/audible.jpg" : books[i].LargeImageUrl) + '" /><span>' + books[i].Name + '</span></a></div>';
        }

        if (books.length > 4) {
            html += '<div class="viewAllAudioBooks" onclick="showAllBooks(this);">View All AudioBooks <i class="fa fa-plus"></i></div><div class="hideAudioBooks" onclick="hideAudioBooks(this);">Hide AudioBooks <i class="fa fa-minus"></i></div>';
        }

        if (books.length == 0) {
            html = '';
        }

        // append html to div with role name as id
        $('#' + resourceid).html(html);
        
        checkForNoBooks(resourceid);

}

function checkForNoBooks(containingElement) {
    //console.log($('#' + containingElement).attr('id') + $('#' + containingElement).find('.bookInfo').length);
    if ($('#' + containingElement).find('.bookInfo').length == 0) {
        $('#' + containingElement).closest('.booksDiv').hide();
    }
}

function sortByRank(a, b) {
    if (a.Rank < b.Rank) return -1; if (a.Rank > b.Rank) return 1; return 0;
}

function reportClickToGA(element) {
    if (ga) ga('send', 'event', 'AudioBook', window.location.href, $(element).data('bookname'));
}