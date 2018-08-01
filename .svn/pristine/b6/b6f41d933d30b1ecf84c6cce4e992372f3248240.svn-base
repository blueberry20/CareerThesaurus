//make sure parameters are not empty strings
function submitRecord(firstname, lastname, email, phone, callback) {
    var data = {
        firstname: firstname,
        lastname: lastname,
        email: email,
        phone: phone,
        city: getCookie('ipcity'),
        state: getCookie('ipstate'),
        zip: getCookie('ipzip'),
        ip: getCookie('ip')
    }
    $.ajax({
        url: '/request/SubmitRecord',
        dataType: 'json',
        type: 'POST',
        data: data
    }).success(function (response) {
        // we are not displaying result anywhere, so there is no point to do anthing here. but in case you will need it, its here
        if (callback)
            callback();
    }).error(function (response) {
        if (callback)
            callback();
    });
}
// use this function as start, just pass full name, email and phone, it will check to make sure they are good and submit record to cbn
function validateInputAndSubmit(name, email, phone, callback) {
    var nameArray = name.trim().split(' ');
    if (nameArray.length >= 2 && validateEmail(email) && validatePhone(phone)) {
        submitRecord(nameArray[0], nameArray[nameArray.length - 1], email, phone.replace(/(\s|\.|\-|\(|\))/g, ''), callback);
    }
}