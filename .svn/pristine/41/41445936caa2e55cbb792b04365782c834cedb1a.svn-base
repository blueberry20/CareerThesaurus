function getgeolocation() {
    var locationrequestresult = getCookie("locationrequestresult");
    if (locationrequestresult != null && locationrequestresult=="success") {
        return;
    }

    if (navigator.geolocation) {
        var options = {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 2000
        };

        try {
            navigator.geolocation.getCurrentPosition(showPosition, geoPositionError, null);
        }
        catch (e) {
            alert(e.message);
        }
    }
    else {
    }
}

function showPosition(position) {
    var c = position.coords;
    setCookie("lat", c.latitude, 365); 
    setCookie("lon", c.longitude, 365); 
    setCookie("locationrequestresult", "success", 365); 
}

function geoPositionError() {
    setCookie("locationrequestresult", "error", 365); 
}