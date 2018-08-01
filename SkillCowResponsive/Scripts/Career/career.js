﻿

function $dolcode_ready(dolcode, container, resourceid, directoryPath) {
    //dolcode = {value: ""}
    dolcode = dolcode.value;
    $('.dol').text('DOL code: ' + dolcode);
    getBlobData("careers", "bydolcode/" + dolcode, "title.js");
    //getBlobData("careers", "bydolcode/" + dolcode, "category.js");
    getBlobData("careers", "bydolcode/" + dolcode, "occtitle.js");
    getBlobData("careers", "bydolcode/" + dolcode, "aka.js");
    getBlobData("careers", "bydolcode/" + dolcode, "description.js");
    getBlobData("careers", "bydolcode/" + dolcode, "duties.js");
    getBlobData("careers", "bydolcode/" + dolcode, "wheretofind.js");
    //getBlobData("careers", "bydolcode/" + dolcode, "salary.js");
    //getBlobData("careers", "bydolcode/" + dolcode, "demand.js");
    getBlobData("careers", "bydolcode/" + dolcode, "salaries.js");
    getBlobData("careers", "bydolcode/" + dolcode, "industries.js");
    getBlobData("careers", "bydolcode/" + dolcode, "forecast.js");
    getBlobData("careers", "bydolcode/" + dolcode, "progressions.js");
    getBlobData("careers", "bydolcode/" + dolcode, "similars.js");
    getBlobData("careers", "bydolcode/" + dolcode, "predecessors.js");
    getBlobData("careers", "bydolcode/" + dolcode, "program.js");
    //getBlobData("careers", "bymajor/" + dolcode.slice(0, 2), "tree.js");

    //add image
    if ($('#careerImage').find('.img-responsive').attr('src') == '') {
        $.loadImage('https://careerthesaurus.blob.core.windows.net/careerimages/' + dolcode + '/image').done(function (image) {           
            $('#careerImage').find('.img-responsive').attr('src', image.src);
        }).fail(function () {
            $('#careerImage').find('.img-responsive').attr('src', "/Content/images/careerPhotos/placeholder.jpg");
        });
    }
}


function $career_title_ready(title, container, resourceid, directoryPath) {
    // title = {value: ""}
    title = title.value;
    $('.title').text(title);
    $('#careerImage').find('.img-responsive').attr('alt', title);
    $('.facebook a').attr('href', 'https://www.facebook.com/dialog/feed?app_id=153111284881428&link=http://CareerThesaurus.com/CareerTest&redirect_uri=https://facebook.com&name=I got ' + title + '!&action=%5B%7B"name"%3a"What%20career%20fits%20your%20personality"%3F%20Find%20out%20at:"link"%3A"http://CareerThesaurus.com%2F"%7D%5D');

    //add audiobooks
    //match career title to a role
    var rolesMatched = "";
    $.each(careers, function (key, value) {
        if (value.title == title) {
            rolesMatched += value.roles + ",";          
        }      
    });
    var roles = rolesMatched.split(',');
    role = roles[0].toLowerCase().replace(" ", "-").trim();
    //load audiobooks by role

    $('#audioBooksSection').append('<h3>Top AudioBooks for ' + title + '</h3><div id="' + role + '">' + getBooksForRole(role) + '</div>');

}
function $career_aka_ready(aka, container, resourceid, directoryPath) {
    // aka = {value: ""}
    if (localStorage.akaTitle != null && localStorage.akaTitle != '') {
        var reg = new RegExp(localStorage.akaTitle, 'i');
        aka.value = aka.value.replace(reg, '<span style="background-color: yellow;">' + reg.exec(aka.value)[0] + '</span>');
        localStorage.removeItem('akaTitle');
        $('.aka').show().addClass('visible');
        $('.arrowUp').show();
    } else {
        $('.arrowDown').show();
    }
    $('.aka').html('a.k.a ' + aka.value);
}
function $career_description_ready(description, container, resourceid, directoryPath) {
    // description = {value: ""}
    $('.professionOverview').html(correctText(description.value));
}
function $career_duties_ready(duties, container, resourceid, directoryPath) {
    // duties = {value: ""}
    if (duties.value == 'information coming soon') {
        $('.duties').hide();
    }
    $('.duties').append('<p>' + correctText(duties.value) + '</p>');
}
function $career_salary_ready(salary, container, resourceid, directoryPath) {
    // salary = {value: ""}
    $('.salary').append('<p>' + correctText(salary.value) + '</p>');
}
function $career_wheretofind_ready(wheretofind, container, resourceid, directoryPath) {
    // wheretofind = {value: ""}
    if (wheretofind.value == 'information coming soon') {
        $('.wheretoFind').hide();
    }
    $('.wheretoFind').append('<p>' + correctText(wheretofind.value) + '</p>');
}
function $career_demand_ready(demand, container, resourceid, directoryPath) {
    // demand = {value: ""}
    $('.demand').append('<p>' + correctText(demand.value) + '</p>');
}
function $career_occtitle_ready(occtitle, container, resourceid, directoryPath) {
    // occtitle = {value: ""}
    occtitle = occtitle.value
    $('.occtitle').text(occtitle);
}
function $career_category_ready(category, container, resourceid, directoryPath) {
    // category = {major: "", minor: "", category: ""}
    $("#classification").append('<p>' + category.major + '</p><p>' + category.minor + '</p><p>' + category.category + '</p>');
}
function $career_salaries_ready(salaries, container, resourceid, directoryPath) {
    //salaries = [{state: "national", a_mean: "###", a_pct10: "", a_pct90: ""}, {state: "", a_mean: "###", a_pct10: "###", a_pct90: "###"}]
    userstate = userstate ? userstate : getCookie('state');
    var array = salaries.map(function (e) { return e.a_mean; });
    var maxSalary = Math.max.apply(Math, array.filter(function (val) { return !isNaN(val) })).toString();
    var minSalary = Math.min.apply(Math, array.filter(function (val) { return !isNaN(val) })).toString();
    var userStateIndex = salaries.map(function (e) { return e.state }).indexOf(userstate);
    var bestStateIndex = salaries.map(function (e) { return e.a_mean; }).indexOf(maxSalary);
    var worstStateIndex = salaries.map(function (e) { return e.a_mean; }).indexOf(minSalary);
    salaries[0].a_pct10 = salaries[worstStateIndex].a_mean;
    salaries[0].a_pct90 = salaries[bestStateIndex].a_mean;
    var userStateData = userStateIndex == -1 ? { a_mean: "*", a_pct10: "*", a_pct90: "*" } : { a_mean: salaries[userStateIndex].a_mean, a_pct10: salaries[userStateIndex].a_pct10, a_pct90: salaries[userStateIndex].a_pct90 };
    if (userstate == '*' || userStateData.a_mean == '*' || userStateData.a_pct10 == '*') {
        $('.yourState').hide();
    }
    var text = "<table class='table stateTable'><thead><tr><th>&nbsp;</th><th>Lowest</th><th>Average</th><th>Highest</th></tr></thead>" +
    "<tbody><tr><td class='titleCell'>National</td><td>" + formatSalary(salaries[0].a_pct10) + "</td><td>" + formatSalary(salaries[0].a_mean) + "</td><td>" + formatSalary(salaries[0].a_pct90) + "</td></tr>" +
    (userstate == '*' ? "" : "<tr><td class='titleCell'>Your state: " + userstate + "</td><td>" + formatSalary(userStateData.a_pct10) + "</td><td><span id='yourState'>" + formatSalary(userStateData.a_mean) + "</span></td><td>" + formatSalary(userStateData.a_pct90) + "</td></tr>") +
    "<tr><td class='titleCell'>State with highest average: " + salaries[bestStateIndex].state + "</td><td>" + formatSalary(salaries[bestStateIndex].a_pct10) + "</td><td><span class='highestCell'>" + formatSalary(salaries[bestStateIndex].a_mean) + "</span></td><td>" + formatSalary(salaries[bestStateIndex].a_pct90) + "</td></tr>" +
    "<tr><td class='titleCell'>State with lowest average: " + salaries[worstStateIndex].state + "</td><td>" + formatSalary(salaries[worstStateIndex].a_pct10) + "</td><td><span class='lowestCell'>" + formatSalary(salaries[worstStateIndex].a_mean) + "</span></td><td>" + formatSalary(salaries[worstStateIndex].a_pct90) + "</td></tr></tbody></table>";
    var placeholders = {
        nationalPct10: formatSalary(salaries[0].a_pct10), nationalPct90: formatSalary(salaries[0].a_pct90), userstate: userstate, userstatePct10: formatSalaryInText(userStateData.a_pct10), userstatePct90: formatSalaryInText(userStateData.a_pct90), userstateMean: formatSalary(userStateData.a_mean),
        beststate: salaries[bestStateIndex].state, beststateMean: formatSalary(salaries[bestStateIndex].a_mean), worststate: salaries[worstStateIndex].state, worststateMean: formatSalary(salaries[worstStateIndex].a_mean)
    };
    for (var property in placeholders) {
        if (placeholders.hasOwnProperty(property)) {
            $('.' + property).text(placeholders[property]);
        }
    }
    $('.stateInfo').append(text);
    if (userStateIndex == bestStateIndex) {
        $('#yourState').addClass('highestCell');
    } else if (userStateIndex == worstStateIndex) {
        $('#yourState').addClass('lowestCell');
    }

    $('.statSalary').html('<span class="emblem">$</span>' + Math.round(salaries[0].a_mean / 1000) + 'k');
}

function $career_industries_ready(industries, container, resourceid, directoryPath) {
    //industries =[{industry: "national", a_mean: ###, employed: ###, change: ""}, {industry: "", a_mean: ###, employed: ###, change: "###"}]
    var highestEmployed = industries.slice(1).sort(sortbyemployed);
    var highestSalary = industries.slice(1).sort(sortbysalary);
    var topIndustriesTable = "<table class='table stateTable'><thead><tr><th>&nbsp;</th><th>Ttl Empl.</th><th>% of Ttl Empl.</th><th>Avg Salary</th><th>Growth Frcast</th></tr></thead><tbody>";
    var topSalariesTable = "<table class='table stateTable'><thead><tr><th>&nbsp;</th><th>Ttl Empl.</th><th>% of Ttl Empl.</th><th>Avg Salary</th><th>Growth Frcast</th></tr></thead><tbody>";
    for (var i = 0; i < (industries.length > 5 ? 5 : industries.length - 1) ; i++) {
        topIndustriesTable += "<tr><td class='titleCell'>" + highestEmployed[i].industry + "</td><td>" + formatter(highestEmployed[i].employed) + "</td><td><span class=" + (i == 0  ? 'highestCell' : '') +">" + Math.round((highestEmployed[i].employed * 10000) / industries[0].employed) / 100 + "%</span></td><td>" + formatSalary(highestEmployed[i].a_mean) + "</td><td>" + formatForecast(highestEmployed[i].change) + "</td></tr>";
        topSalariesTable += "<tr><td class='titleCell'>" + highestSalary[i].industry + "</td><td>" + formatter(highestSalary[i].employed) + "</td><td>" + Math.round((highestSalary[i].employed * 10000) / industries[0].employed) / 100 + "%</td><td><span class=" + (i == 0 ? 'highestCell' : '') + ">" + formatSalary(highestSalary[i].a_mean) + "</span></td><td>" + formatForecast(highestSalary[i].change) + "</td></tr>";
    }
    topIndustriesTable += "</tbody></table>";
    topSalariesTable += "</tbody></table>";
    $(".highestEmployment").append(topIndustriesTable);
    $(".highestSalary").append(topSalariesTable);
    var statIcon;
    var increase;
    if (highestEmployed[0].change > 0) {
        statIcon = '<i class="fa fa-long-arrow-up emblem"></i>';
        increase = true;
    } else if (highestEmployed[0].change < 0) {
        statIcon = '<i class="fa fa-long-arrow-down emblem"></i>';
        increase = false;
    } else {
        statIcon = '';
    }

    $('.topEmployment').html(highestEmployed[0].industry);
    $('.industrySalary').html(formatSalary(highestEmployed[0].a_mean));
    $('.industryGrowth').addClass(increase == true ? 'increase' : 'decrease').html(statIcon + formatForecast(highestEmployed[0].change) + ' jobs (' +(((highestEmployed[0].change * 1000)  / highestEmployed[0].employed)*100).toFixed(1) + '%)');
    //console.log('highestEmployed[0].change :' + highestEmployed[0].change);
    //console.log('formatForecast(highestEmployed[0].change):' + formatForecast(highestEmployed[0].change));
    //console.log('highestEmployed[0].employed:' + highestEmployed[0].employed);
}
function $career_forecast_ready(forecast, container, resourceid, directoryPath) {
    //forecast = {current: ###, employed: ###, forecast: ###, replacements: ###}
    var statIcon;
    var increase;
    if (forecast.forecast > 1) {
        var forecastHtml = "Demand for this profession is expected to grow by " + forecast.forecast + "% through " + (year + 10) + ".";       
    } else if (forecast.forecast < -1) {
        var forecastHtml = "Demand for this profession is expected to decrease by " + Math.abs(forecast.forecast) + "% through " + (year + 10) + ".";        
    } else {
        var forecastHtml = "Demand for this profession is expected to show little to no change through the next decade.";      
    }
    if (forecast.forecast > 0) {
        statIcon = '<i class="fa fa-long-arrow-up emblem"></i>';
        increase = true;
    } else if (forecast.forecast < 0) {
        statIcon = '<i class="fa fa-long-arrow-down emblem"></i>';
        increase = false;
    } else {
        statIcon = '';
    }
    forecastHtml += " And will employ " + formatter(forecast.employed) + ". Overall job openings due to growth and replacements projected to be " + formatter(forecast.replacements) + ".";
    $('.currentlyEmployed').text(formatter(forecast.current));
    $('.forecast').text(forecastHtml);
    $('.statGrowth').addClass(increase == true ? 'increase' : 'decrease').html(statIcon + formatter(forecast.employed) + ' jobs (' + forecast.forecast + '%) <span id="projYear">(by ' + (year + 10) + ')</span>');
}
function $career_progressions_ready(progressions, container, resourceid, directoryPath) {
    //progressions = [{dolcode: "", title: ""}, {dolcode: "", title: ""}]
    if (progressions.length == 0) {
        $('.progressions p').text('This profession is at top of it\'s career path.');
        $('.careerTrack').hide();
        $('#advancements').append('<p>This profession is at top of it\'s career path.<p>');
    } else {
        progressions.sort(sortbysalary);
        // var list = '<table class="table progressionTable"><thead><tr><th></th><th>Average salary</th></tr></thead><tbody>';
        var list = '';
        for (var i = 0; i < progressions.length; i++) {
            //list += "<tr><td><a href='" + progressions[i].title.replace(/[^a-zA-Z0-9]+/g, '-') + "'>" + progressions[i].title + "</a></td><td>" + Math.round(progressions[i].a_mean / 1000) + "K</td></tr>";
            list += "<a class='career statCareer' href='/" + progressions[i].title.replace('\'s', '').replace(/[^a-zA-Z0-9]+/g, '-') + "'>" + progressions[i].title + "</a>";
        }
       // list += "</tbody></table>";
        $('.progressions').append(list);
        $('#advancementCareers').append(list);
    }
}
function $career_similars_ready(similars, container, resourceid, directoryPath) {
    //similars = [{dolcode: "", title: ""}, {dolcode: "", title: ""}]
    if (similars.length == 0) {
        $('.similars p').text('This career doesn\'t have similar careers.');
        $('.careerChange').hide();
        $('#similars').append('<p>This career doesn\'t have similar careers.</p>');
    } else {
        similars.sort(sortbysalary);
        //var list = '<table class="table progressionTable"><thead><tr><th></th><th>Average salary</th></tr></thead><tbody>';
        //for (var i = 0; i < similars.length; i++) {
        //    list += "<tr><td><a href='" + similars[i].title.replace(/[^a-zA-Z0-9]+/g, '-') + "'>" + similars[i].title + "</a></td><td>" + Math.round(similars[i].a_mean / 1000) + "K</td></tr>";
        //}
        //list += "</tbody></table>";
        var careerlist = '';
        for (var i = 0; i < similars.length; i++) {
            careerlist += "<a class='career statCareer' href='/" + similars[i].title.replace('\'s', '').replace(/[^a-zA-Z0-9]+/g, '-') + "'>" + similars[i].title + "</a>";
        }
        $('.similars').append(careerlist);
        $('#similarCareers').append(careerlist);
    }
}
function $career_predecessors_ready(predecessors, container, resourceid, directoryPath) {
    //similars = [{dolcode: "", title: ""}, {dolcode: "", title: ""}]
    if (predecessors.length == 0) {
        $('.predecessors p').text('This career doesn\'t have predecessor careers.');
        $('.careerPredecessor').hide();
        $('#predecessors').append('<p>This career doesn\'t have predecessor careers.</p>');
    } else {
        predecessors.sort(sortbysalary);
        //var list = '<table class="table progressionTable"><thead><tr><th></th><th>Average salary</th></tr></thead><tbody>';
        //for (var i = 0; i < similars.length; i++) {
        //    list += "<tr><td><a href='" + similars[i].title.replace(/[^a-zA-Z0-9]+/g, '-') + "'>" + similars[i].title + "</a></td><td>" + Math.round(similars[i].a_mean / 1000) + "K</td></tr>";
        //}
        //list += "</tbody></table>";
        var careerlist = '';
        //for (var i = 0; i < predecessors.length; i++) {
        //    careerlist += "<a class='career' href='/" + predecessors[i].title.replace('\'s', '').replace(/[^a-zA-Z0-9]+/g, '-') + "'>" + predecessors[i].title + "<span class='professionSalary'>" + Math.round(predecessors[i].a_mean / 1000) + "K per year</span><i class='fa fa-angle-right pull-right'></i></a>";
        //}
        for (var i = 0; i < predecessors.length; i++) {
            careerlist += "<a class='career statCareer' href='/" + predecessors[i].title.replace('\'s', '').replace(/[^a-zA-Z0-9]+/g, '-') + "'>" + predecessors[i].title + "</a>";
        }
        $('.predecessors').append(careerlist);
        $('#predecessorCareers').append(careerlist);
    }

    $(window).resize(function () {
        resizeColumns();
    });

    resizeColumns();

    function resizeColumns() {
        if ($(window).width() > 768 -18) {
            var tallestColumn = 0;
           // var tallestColumn = $('.kolonkaRow').height();
            //$('.kolonka').each(function (i, el) {
            //    $(el).height(tallestColumn);
            //});

            $('.kolonka').each(function (i, el) {
                if ($(el).height() > tallestColumn) {
                    tallestColumn = $(el).height();
                }
            });
            $('.kolonka').height(tallestColumn);
        }
        else {
            $('.kolonka').css('height', 'initial');
        }
    }
}
function $career_tree_ready(tree, container, resourceid, directoryPath) {
    //tree = {major: "", minors: [{minor: "", categories: [{category: "", careers : ["",""]},{category: "", careers : ["",""]}]},{minor: "", categories: [{category: "", careers : ["",""]},{category: "", careers : ["",""]}]}]}
    var majorTitle = tree.major;
    var minorTitle;
    var categoryTitle;
    var careerTitle;
    var careerTitles = [];
    var minors = tree.minors;
    for (var i = 0; i < minors.length; i++) {
        var minor = minors[i];
        for (var m = 0; m < minor.categories.length; m++) {
            var category = minor.categories[m];
            for (var c = 0; c < category.careers.length; c++) {
                var career = category.careers[c];
                if (career.dolcode == dolcode) {
                    careerTitle = career.career;
                    minorTitle = minor.minor;
                    categoryTitle = category.category;
                    careerTitles = [].concat(category.careers);
                }
            }
        }
    }
    $('.ctBreadcrumbs').append('<ol class="list-unstyled"><li class="headerLi"><a href="/Classification/' + majorTitle.trim().replace(/[^a-zA-Z0-9]+/g, '-') + '">' + majorTitle + '<i class="fa fa-angle-right pull-right"></i></a></li><li class="headerLi"><a href="/Classification/' + majorTitle.trim().replace(/[^a-zA-Z0-9]+/g, '-') + '/' + minorTitle.trim().replace(/[^a-zA-Z0-9]+/g, '-') + '">' + minorTitle + '<i class="fa fa-angle-right pull-right"></i></a></li><li class="headerLi"><p>' + categoryTitle + '</p></li></ol>');


    var html = '<div class="list-group">';
    for (var i = 0; i < careerTitles.length; i++) {
        if (careerTitles[i].dolcode != dolcode) {         
            var item = professions.filter(function (x) { return x.code == careerTitles[i].dolcode })[0];
            //console.log(item);
            html += '<a class="career" href="' + careerTitles[i].career.replace(/[^a-zA-Z0-9]+/g, '-') + '">' + careerTitles[i].career + '<span class="professionSalary">' + Math.round(item.salary/1000) + 'K per year</span><i class="fa fa-angle-right pull-right"></i></a>';
        }
    }
    if ($(window).width() < 767) {
        if (careerTitles.length == 1) {
            $('#careerOptions').append('<p>This is the only career in this category</p>');
        } else {
            $('#careerOptions h3').text('See also other careers in the same category');
        }
    } else {
        if (careerTitles.length == 1) html += '<p>There are no other careers in same category</p>';
    }
    html += '</div>';
    $('.ctBreadcrumbs ol').append('<li class="categoryCareerList">' + html + '</li>');

}
function $career_program_ready(forms, container, resourceid, directoryPath) {
    formsGlobal = forms;
    //getVantageMedia(forms.vm);
    quinStreet();
    getSchoolFormId(userzip, forms);
}
function sortbyemployed(a, b) {
    if (a.employed > b.employed) return -1; if (a.employed < b.employed) return 1; return 0;
}
function sortbysalary(a, b) {
    if (a.a_mean > b.a_mean) return -1; if (a.a_mean < b.a_mean) return 1; return 0;
}
function correctText(text) {
    return text.replace(/\|/g, "</p><p>");
}
function formatter(value) {
    if (value == '#' || value == '*') {
        return 'N/A';
    }
    return Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function formatSalaryInText(value) {
    if (value == '#') {
        return 'well over $187k';
    } else if (value == '*') {
        return 'N/A';
    }
    return "$" + Math.round(value / 1000) + 'k';
}
function formatSalary(value) {
    if (value == '#') {
        return 'N/A'
    } else if (value == '*') {
        return 'N/A';
    }
    return "$" + Math.round(value / 1000) + 'k';
}
function formatForecast(value) {
    if (isNaN(value)) {
        return value;
    } else {
        return formatter(parseFloat(value) * 1000);
    }
}

function getVantageMedia(vm) {
    //=============================================================================================================================
    if (getCookie('cbnvm') && getCookie('cbnvm') == '1') {
        $('#cbnSchools').hide();
        return;
    }
    //=============================================================================================================================
    $('#vantageList').html('');
    $.ajax({
        url: '/Jobs/getvantagemedia',
        type: 'POST',
        dataType: 'json',
        data: {
            zipCode: userzip,
            campaign: '23371',
            modality: '3',
            eduLevel: '1',
            gradYear: '',
            areaOfStudy: vm,
            subAreaOfStudy: '32',
            degreeLevel: '1',
            military: '',
            maxresults: '25'
        }
    }).success(function (response) {
        //console.log(response);
        // BrandName - name of the school
        // LogoUrl - url to image (all same size 125px x 60 px)
        // HeadLine - slogan with name of school
        // Description - array of 4 strings
        // DisplayUrl - url to college website
        // ActionUrl - url to form
        var schoolsArray = response.results.Results;
        if (schoolsArray.length > 1) {
            $('#vantageMedia').show();
            for (var i = 0; i < schoolsArray.length; i++) {
                var html = '<div class="cells col-lg-6 col-md-6 col-sm-4 col-xs-6"><a href="' + schoolsArray[i].Products[0].ActionUrl + '" target="_blank"><img class="img-responsive" src="' + schoolsArray[i].LogoUrl + '" /></a></div>';
                $('#vantageList').append(html);
            }
        } else if (schoolsArray.length == 1) {
            var html = '<div class="cells col-lg-12 col-md-12 col-sm-12 col-xs-12"><a href="' + schoolsArray[0].Products[0].ActionUrl + '" target="_blank"><img class="img-responsive" src="' + schoolsArray[0].LogoUrl + '" /></a></div>';
            $('#vantageList').append(html);
        } else {
            $('#vantageList').hide();
        }

    }).error(function (response) {
        console.log(response);
    });
}
function getSchoolFormId(zip, forms, secondary) {
    //=============================================================================================================================
    if (getCookie('cbnvm') && getCookie('cbnvm') == '1') {
        $('#cbnSchools').hide();
        return;
    }
    //=============================================================================================================================
    $('#cbnSchoolsList').html('');
    $.ajax({
        url: '/Jobs/getschoolformid',
        type: 'POST',
        dataType: 'json',
        data: {
            filter: 'degree',
            value: secondary ? forms.secondary.replace('|', ',') : forms.primary,
            zipcode: zip
        }
    }).success(function (response) {
        //console.log(response);
        // campus.#text - short information
        // campus.id - program id for form
        // campus.type - 'online' or 'campus'
        // city, state - location of school (can be null if type is online)
        // client_frontendname - name of the school
        // client_id - id for that school
        // distance - is distance from zip code entered to school
        // id - form id
        // image - url to school logo, usualy width is 125px (sometimes smaller), height varies
        // program - can be array or just one object
        // program.#text - description of program
        // program.id - id for it
        // program.is_primary - in array only one will be set to '1'
        // program.program_type - show what kind of degree, not just limited to BS or MS also uses other keywords
        // program.program_type_name - description of program_type abbreviation
        if (response.results && response.results.searchresults) {
            $('#vantageMedia').show();
            $('#cbnSchools').show();
            var capsules = response.results.searchresults.capsule;
            var schools = [];
            if (capsules instanceof Array) {
                for (var i = 0; i < capsules.length; i++) {
                    if (schools.map(function (s) { return s.id; }).indexOf(capsules[i].id) != -1 && schools[schools.map(function (s) { return s.id; }).indexOf(capsules[i].id)].client_id == capsules[i].client_id) {
                        schools[schools.map(function (s) { return s.id; }).indexOf(capsules[i].id)].campuskey.push(capsules[i].campus);
                        if (capsules[i].program instanceof Array) {
                            schools[schools.map(function (s) { return s.id; }).indexOf(capsules[i].id)].programs.concat(capsules[i].program);
                        } else {
                            schools[schools.map(function (s) { return s.id; }).indexOf(capsules[i].id)].programs.push(capsules[i].program);
                        }
                    } else {
                        if (capsules[i].program instanceof Array) {
                            schools.push({ client_id: capsules[i].client_id, id: capsules[i].id, campuskey: new Array(capsules[i].campus), client_frontendname: capsules[i].client_frontendname, image: capsules[i].image, programs: capsules[i].program });
                        } else {
                            schools.push({ client_id: capsules[i].client_id, id: capsules[i].id, campuskey: new Array(capsules[i].campus), client_frontendname: capsules[i].client_frontendname, image: capsules[i].image, programs: new Array(capsules[i].program) });
                        }
                    }
                }
                if (schools.length > 1) {
                    for (var i = 0; i < schools.length; i++) {
                        $('#cbnSchoolsList').append('<div class="cells col-lg-6 col-md-6 col-sm-4 col-xs-6"><div class="schoolLink" programs=\'' + JSON.stringify(schools[i]).replace(/\s/g, ' ').replace(/\'/g, '').replace(/\#text/g, 'text') + '\' formid="' + schools[i].id + '" client_frontendname="' + schools[i].client_frontendname + '"><img class="img-responsive" src="' + schools[i].image + '"/></div></div>');
                    }
                }
                else if (schools.length ==1 ) {//if one result
                    $('#cbnSchoolsList').append('<div class="cells col-lg-12 col-md-12 col-sm-12 col-xs-12"><div class="schoolLink" programs=\'' + JSON.stringify(schools[0]).replace(/\s/g, ' ').replace(/\#text/g, 'text').replace(/\'/g, '') + '\' formid="' + schools[0].id + '" client_frontendname="' + schools[0].client_frontendname + '"><img class="img-responsive" src="' + schools[0].image + '"/></div></div>');
                }
            } else { 
                if (capsules.program instanceof Array) {
                    schools.push({ client_id: capsules.client_id, id: capsules.id, campuskey: new Array(capsules.campus), client_frontendname: capsules.client_frontendname, image: capsules.image, programs: capsules.program });
                } else {
                    schools.push({ client_id: capsules.client_id, id: capsules.id, campuskey: new Array(capsules.campus), client_frontendname: capsules.client_frontendname, image: capsules.image, programs: new Array(capsules.program) });
                }
            }
            localStorage.otherSchools = JSON.stringify(schools);
            $('.schoolLink').click(function () {
                setCookie('formid', $(this).attr('formid'), 7);
                localStorage.programs = $(this).attr('programs');
                //setCookie('programs', $(this).attr('programs'), 7);
                setCookie('formname', $(this).attr('client_frontendname'), 7);
                setCookie('schoolorjobform', 'school', 7);
                var linkURL = appserverurl + '/Request/Info';
                window.open(linkURL, linkURL);
            });
        } else {
            $('#cbnSchools').hide();
            if (!secondary)
                getSchoolFormId(zip, forms, true);
        }
    }).error(function (response) {
        console.log(response);
    });
}

function getJobFormId(zip, title) {
    $('#cbnJobsList').html('');
    $('#cbnJobs').hide();
    return;
    $.ajax({
        url: '/Jobs/getjobformid',
        type: 'POST',
        dataType: 'json',
        data: {
            zipcode: zip,
            titlename: title
        }
    }).success(function (response) {
        //console.log(response);
        // campus_key, campus_value  - location (city and state or National) = cannot be used, because of multiple listing of same company with different locations
        // city, state, country - city, state and country for job, if national city and state is 'null' = cannot be used, because of multiple listing of same company with different locations
        // client_name - company name
        // client_id - id for company
        // form_id - form id
        // logo_image - url to image, usualy width is 125px (sometimes smaller), height varies
        // program_values.item.description2 - description about job
        // program_values.item.value - usualy job title, may have additional info like (sign-on bonus or benefits of this job)
        if (response.results.root) {
            $('#cbnJobs').show();
            var listings = response.results.root.tab.listings.listing;
            var jobs = [];
            if (listings instanceof Array) {
                for (var i = 0; i < listings.length; i++) {
                    if (jobs.map(function (l) { return l.form_id; }).indexOf(listings[i].form_id) != -1 && jobs[jobs.map(function (l) { return l.form_id; }).indexOf(listings[i].form_id)].client_id == listings[i].client_id) {
                        //$('#cbnJobsList').append('<div class="cells col-lg-6 col-md-6 col-sm-4 col-xs-6"><div class="jobLink" formid="' + listings[i].form_id + '" programs=\'{"id":"' + listings[i].form_id + '"}\' client_name="' + listings[i].client_name + '"><img src="' + listings[i].logo_image + '"/></div></div>');
                        //jobs.push({ client_id: listings[i].client_id, form_id: listings[i].form_id });
                        jobs[jobs.map(function (s) { return s.form_id; }).indexOf(listings[i].form_id)].campus_key.push(listings[i].campus_key);
                        if (listings[i].program_values instanceof Array) {
                            jobs[jobs.map(function (s) { return s.form_id; }).indexOf(listings[i].form_id)].program_values.concat(listings[i].program_values);
                        } else {
                            jobs[jobs.map(function (s) { return s.form_id; }).indexOf(listings[i].form_id)].program_values.push(listings[i].program_values);
                        }
                    } else {
                        if (listings[i].program_values instanceof Array) {
                            jobs.push({ client_id: listings[i].client_id, form_id: listings[i].form_id, campus_key: new Array(listings[i].campus_key), client_name: listings[i].client_name, logo_image: listings[i].logo_image, program_values: listings[i].program_values });
                        } else {
                            jobs.push({ client_id: listings[i].client_id, form_id: listings[i].form_id, campus_key: new Array(listings[i].campus_key), client_name: listings[i].client_name, logo_image: listings[i].logo_image, program_values: new Array(listings[i].program_values) });
                        }
                    }
                }
                for (var i = 0; i < jobs.length; i++) {
                    $('#cbnJobsList').append('<div class="cells col-lg-6 col-md-6 col-sm-4 col-xs-6"><div class="jobLink" formid="' + jobs[i].form_id + '" programs=\'' + JSON.stringify(jobs[i]).replace(/\s/g, ' ').replace(/\'/g, '').replace(/\#text/g, 'text') + '\' client_name="' + jobs[i].client_name + '"><img src="' + jobs[i].logo_image + '"/></div></div>');
                }
            } else {
                if (listings.program_values instanceof Array) {
                    jobs.push({ client_id: listings.client_id, id: listings.form_id, campus_key: new Array(listings.campus_key), client_name: listings.client_name, logo_image: listings.logo_image, program_values: listings.program_values });
                } else {
                    jobs.push({ client_id: listings.client_id, id: listings.form_id, campus_key: new Array(listings.campus_key), client_name: listings.client_name, logo_image: listings.logo_image, program_values: new Array(listings.program_values) });
                }
                $('#cbnJobsList').append('<div class="cells col-lg-6 col-md-6 col-sm-4 col-xs-6"><div class="jobLink" formid="' + jobs[0].form_id + '" programs=\'' + JSON.stringify(jobs[0]).replace(/\s/g, ' ').replace(/\'/g, '').replace(/\#text/g, 'text') + '\' client_name="' + jobs[0].client_name + '"><img src="' + jobs[0].logo_image + '"/></div></div>');
            }
            $('.jobLink').click(function () {
                setCookie('formid', $(this).attr('formid'), 7);
                setCookie('formname', $(this).attr('client_name'), 7);
                setCookie('programs', $(this).attr('programs'), 7);
                setCookie('schoolorjobform', 'job', 7);
                var linkURL = appserverurl + '/Request/Info';
                window.open(linkURL, linkURL);
            });
        } else {
            $('#cbnJobs').hide();
        }
    }).error(function (response) {
        console.log(response);
    });
}

function ipinfocallback() {
    userzip = getCookie('ipzip') == '*' ? '11215' : getCookie('ipzip');
    userstate = getCookie('ipstate') == '*' ? 'NY' : getCookie('ipstate');

}



function callback() {
    //getBlobData("careers", "dolcodes", prof + ".js");
    //getAjaxData();
}

function getAjaxData(forms) {
    //indeed jobs
    getJobs();
    //cbn jobs
    getJobFormId(userzip, prof.replace(/-/g, ' '));
    if (forms) {
        //vantage schools
        //getVantageMedia(forms.vm);
        //cbn schools
        getSchoolFormId(userzip, forms);

        quinStreet();
    }
}

function getCityAndState(zip, callback) {
    $.ajax({
        url: "http://ZiptasticAPI.com/" + zip,
        cache: false,
        dataType: "json",
        type: "GET",
        success: function (result) {
            setCookie('city', result.city.toLowerCase(), 7);
            setCookie('state', result.state, 7);
            setCookie('zip', zip, 7);
            userstate = result.state;
        }, error: function (error) {
            console.log(error);
            userstate = '*';
        }
    });
    if (callback)
        callback();
}

function linkNextAndPrevCareers() {   
    if (getCookie('careerIndex') && sessionStorage.careerList) {
        var careersList = JSON.parse(sessionStorage.careerList);
        var index = parseInt(getCookie('careerIndex'));
        if (careersList.length > 1 && careersList.indexOf(prof) != -1) {
            if (index == 0) {
                $('.navigateCareersRow').append('<div class="col-lg-4 col-lg-offset-4 col-md-4 col-md-offset-4 col-sm-4 col-sm-offset-4 col-xs-4 col-xs-offset-4"><a href="/StudentPortal" class="centerBtn">Go To Student Portal</a></div><div class="col-lg-4 col-md-4 col-sm-4 col-xs-4"><a href="/' + careersList[index + 1] + '" data-index="' + (index + 1) + '" id="nextCareerBtn" onclick="updateIndex(this)">Next Career</a></a>');
            } else if (index == careersList.length - 1) {
                $('.navigateCareersRow').append('<div class="col-lg-4 col-md-4 col-sm-4 col-xs-4"><a href="/' + careersList[index - 1] + '" data-index="' + (index - 1) + '" id="prevCareerBtn" onclick="updateIndex(this)">Previous Career</a></div><div class="col-lg-4 col-md-4 col-sm-4 col-xs-4"><a href="/StudentPortal" class="centerBtn">Go To Student Portal</a></div>');
            } else {
                $('.navigateCareersRow').append('<div class="col-lg-4 col-md-4 col-sm-4 col-xs-4"><a href="/' + careersList[index - 1] + '" data-index="' + (index - 1) + '" id="prevCareerBtn" onclick="updateIndex(this)">Previous Career</a></div><div class="col-lg-4 col-md-4 col-sm-4 col-xs-4"><a href="/StudentPortal" class="centerBtn">Go To Student Portal</a></div>');
                $('.navigateCareersRow').append('<div class="col-lg-4 col-md-4 col-sm-4 col-xs-4"><a href="/' + careersList[index + 1] + '" data-index="' + (index + 1) + '" id="nextCareerBtn" onclick="updateIndex(this)">Next Career</a></div>');
            }
        } else {
            $('.navigateCareersRow').append('<a href="/StudentPortal" id="backHomeBtn">Go To Student Portal</a>');
        }
    }
}

//function linkNextAndPrevCareers() {
//    if (getCookie('careerIndex') && sessionStorage.careerList) {
//        var careersList = JSON.parse(sessionStorage.careerList);
//        var index = parseInt(getCookie('careerIndex'));
//        if (careersList.length > 1 && careersList.indexOf(prof) != -1) {
//            if (index == 0) {
//                $('.navigateCareersRow').append('<div class="col-lg-4 col-lg-offset-4 col-md-4 col-md-offset-4 col-sm-4 col-sm-offset-4 col-xs-4 col-xs-offset-4"><a href="/StudentPortal" class="centerBtn">Go To Student Portal</a></div><div class="col-lg-4 col-md-4 col-sm-4 col-xs-4"><a href="' + appserverurl + '/Career/' + careersList[index + 1] + '" data-index="' + (index + 1) + '" id="nextCareerBtn" onclick="updateIndex(this)">Next Career</a></a>');
//            } else if (index == careersList.length - 1) {
//                $('.navigateCareersRow').append('<div class="col-lg-4 col-md-4 col-sm-4 col-xs-4"><a href="' + appserverurl + '/Career/' + careersList[index - 1] + '" data-index="' + (index - 1) + '" id="prevCareerBtn" onclick="updateIndex(this)">Previous Career</a></div><div class="col-lg-4 col-md-4 col-sm-4 col-xs-4"><a href="/StudentPortal" class="centerBtn">Go To Student Portal</a></div>');
//            } else {
//                $('.navigateCareersRow').append('<div class="col-lg-4 col-md-4 col-sm-4 col-xs-4"><a href="' + appserverurl + '/Career/' + careersList[index - 1] + '" data-index="' + (index - 1) + '" id="prevCareerBtn" onclick="updateIndex(this)">Previous Career</a></div><div class="col-lg-4 col-md-4 col-sm-4 col-xs-4"><a href="/StudentPortal" class="centerBtn">Go To Student Portal</a></div>');
//                $('.navigateCareersRow').append('<div class="col-lg-4 col-md-4 col-sm-4 col-xs-4"><a href="' + appserverurl + '/Career/' + careersList[index + 1] + '" data-index="' + (index + 1) + '" id="nextCareerBtn" onclick="updateIndex(this)">Next Career</a></div>');
//            }
//        } else {
//            $('.navigateCareersRow').append('<a href="' + appserverurl + '/StudentPortal" id="backHomeBtn">Go To Student Portal</a>');
//        }
//    }
//}

function updateIndex(element) {
    var index = $(element).data('index');
    setCookie('careerIndex', index, 1);
}

function saveCareerRating(element) {
    if (user != null && user != '' && profileType == 'student' && dolcode != null && dolcode != '') {
        $(element).addClass('chosenBtn').siblings().removeClass('chosenBtn');
        var rating = $(element).data('answer');
        $.post('/careers/SaveCareerRating', { user: user, career: dolcode, rating: rating });
    }
}

function openJobsPage() {
    var linkURL = '/jobs?q=' + prof.replace('\'s', '').replace(/-/g, '+') + '&loc=' + (userzip == '*' ? '10001' : userzip) + '&salary=&r=&jt=&sort=s';
    window.open(linkURL, linkURL);
}

function shareLinks() {
    var linkURL = document.URL;
    var shareMessage = 'Interesting career!';
    $('.share.twitter a').attr('href', 'https://twitter.com/intent/tweet?text=' + linkURL + '&url=' + 'http://CareerThesaurus.com/' + '&via=CareerThesaurus.com');
    $('.share.facebook a').attr('href', 'https://www.facebook.com/dialog/feed?app_id=153111284881428&link=' + linkURL + '&redirect_uri=https://facebook.com/&name=' + shareMessage + '&actions=%5B%7B"name"%3A"Find%20your%20career%20at%20Care­e­r­T­h­e­s­a­urus.com"%2C"link"%3A"http://CareerThesaurus.com%2F"%7D%5D');
    $('.share.linkedin a').attr('href', 'https://www.linkedin.com/shareArticle?summary=message+here&title=title&mini=true&url=' + linkURL + '&source=CareerThesaurus.com');
    $('.share.gplus a').attr('href', 'https://plus.google.com/share?url=' + linkURL.replace(/\,/g, '').replace(/\s/g, '_'));
}
/***********************AJAX*************************/

var counter = 0;
var loading = false;
var noMoreResults = false;

function getJobs() {

    $('#jobs').html('');
    $.ajax({
        url: "/Jobs/getindeedjobs",
        type: "POST",
        dataType: "json",
        data: {
            p: prof.replace(/-/g, ' '),
            l: userzip,
            c: '13564694',
            limit: 10,
            start: counter
        }
    }).success(function (response) {
        //console.log(response);
        if (response.results.results.length > 0) {
            var jobResults = response.results.results;
            for (var i = 0; i < (jobResults.length > 3 ? 3 : jobResults.length) ; i++) {
                //if (response.results.results[i].sponsored == true && response.results.results[i].expired == false) {
                counter++;
                var job = jobResults[i];
                //add this job to the page
                var template = $('#sidebarJob').clone().show();
                //template.find('.jobListing').attr('onclick', 'jobclick(this)');
                var timestamp = getTimestampFromIndeedTime(job.date);
                template.find('.positionName').html(job.jobtitle).closest('a').attr('href', job.url).attr('onmousedown', 'saveJobKeys(this); ' + job.onmousedown).data('jobkey', job.jobkey).data('jobtitle', job.jobtitle);
                template.find('.companyName').html(job.company);
                template.find('.locationName').html(job.formattedLocation);
                template.find('.jobDescription').html(job.snippet);
                template.find('.age').attr('timestamp', timestamp);
                template.find('.age').html(getElapsedTime(timestamp));
                template.appendTo('#jobs');

                template.attr('onclick', 'window.open("' + job.url + '", "_blank");').attr('onmousedown', 'saveJobKeys(this); ' + job.onmousedown).data('jobkey', job.jobkey).data('jobtitle', job.jobtitle);;
                //}
            }

            $('#jobs').append('<button class="btn btn-info" id="showMore" onclick="openJobsPage()">View more jobs</button>');

            setInterval(function () {
                var ageboxes = $('.age');
                for (var i = 0; i < ageboxes.length; i++) {
                    $(ageboxes[i]).html(getElapsedTime($(ageboxes[i]).attr('timestamp')));
                };
                //Blinking dots
                setTimeout(function () {
                    $('.blinking').css('background-color', 'black');
                }, 500);
            }, 1000);

            //if (jobResults.length > 3) {
            //    for (var i = 3; i < jobResults.length; i++) {
            //        //if (response.results.results[i].sponsored == true && response.results.results[i].expired == false) {
            //        counter++;
            //        var job = jobResults[i];
            //        //add this job to the page
            //        var template = $('#sidebarJob').clone().show();
            //        template.find('.positionName').html(job.jobtitle).attr('href', job.url).data('jobkey', job.jobkey).attr('onmousedown', job.onmousedown);
            //        template.find('.companyName').html(job.company);
            //        template.find('.locationName').html(job.formattedLocation);
            //        template.find('.jobDescription').html(job.snippet);
            //        template.appendTo('#sidebarJobHolderShowMore');
            //        //}
            //    }
            //} else {
            //    $('#showMore').hide();
            //}
        } else {
            $('#jobs').html('<div id="noResultsError">We don\'t have any positions available in your area for this profession.</div>');
            $('#showMore').hide();
        }

    }).error(function (error) {
        $('#jobs').html('<div id="noResultsError">We don\'t have any positions available in your area for this profession.</div>');
        $('#showMore').hide();
        console.log(error);
    });
}

function isNumber(evt, val) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode == 13 && val.length == 5) {
        $('#locationBtn').click();
        return true;
    }
    if ((charCode > 31 && (charCode < 48 || charCode > 57))) {
        return false;
    }
    return true;
}

function saveJobKeys(element) {
    if (ga) ga('send', 'event', 'Indeed', 'Career', $(element).data('jobtitle'));
}

function quinStreet(retry) {
    var json = {
        widgets: [
            {
                webSiteName: "careerthesaurus.com",
                webPageUri: "/",
                affiliateKey: "86686344",
                tag: "204473485",
                widgetInstanceKey: "24264210",
                id: 'qs-listings',
                zip: getCookie('zipcode'),
                areaOfInterest: "BUSINESS",
                clientModel: "CLICK",
                baseHref: '//hqx-qmp.quinstreet.com/hqxapi/qsctredirect/',
                jswrap: 'n',
                applyFallback: true,
                errorCallback: errorCallback,
                template: encodeURIComponent('${(listingType      = \'\'), \'\'}' +
                    '{{if isClickOnlyListing() }}' +
                        '${(listingType      = \'ClickOnlyListing\'), \'\'}' +
                    '{{/if}}' +
                    '{{if isLeadOnlyListing() }}' +
                        '${(listingType      = \'LeadOnlyListing\'), \'\'}' +
                    '{{/if}}' +
                    '{{if isMergedListing() }}' +
                        '${(listingType      = \'HybridListing\'), \'\'}' +
                    '{{/if}}' +
                    '<div class="cells col-lg-6 col-md-6 col-sm-4 col-xs-6">' +
                        '<a target="_blank" href="${getClickLinkHref()}&listingType=${listingType}" rel="nofollow">' +
                            '<img class="schoolImage img-responsive" src="${getLogoPath(\'small\', true)}" onerror="loadError(this);"/>' +
                        '</a>' +
                    '</div>')
            }
        ],
        clientData:
        {
            userAgent: navigator.userAgent,
            browserIp: getCookie('ip') ? getCookie('ip') : ip,
            requestUri: absoluteURI
        },
        publisherData: {
            abandonmentBehavior: "none",
            interstitialBehavior: "none"
        }
    }
    if (getCookie('educationSelected')) {
        json.widgets[0].educationLevel = eduLevel();
    }
    $.ajax({
        url: '/Sandbox/getQuinStreet',
        type: "POST",
        data: { json: JSON.stringify(json) }
    }).done(function (response) {
        var html;
        if (response.result == 'ok') {
            for (var property in response.results) {
                if (response.results.hasOwnProperty(property)) {
                    html = response.results[property].renderedListing;
                }
            }
            $('#vantageMedia').show();
            $('#vantageList').append(decodeURIComponent(html));
        } else {
            $('#vantageMedia').hide();
        }
    }).fail(function (xhr, ajaxOptions, thrownError) {
        console.log(xhr);
        console.log(ajaxOptions);
        console.log(thrownError);
        //if (retry < 3) {
        //    retry++;
        //    quinStreet(retry);
        //} else {
        //    window.location = "/TakeTest/EmailResults";
        //}
    });
}
function errorCallback() {
    //window.location = "/TakeTest/EmailResults";
    return;
}
function loadError(el) {
    var url = $(el).attr('src');
    if (url.indexOf('http:') == -1) {
        url = 'http:' + url;
    }
    $.ajax({
        url: '/SandBox/getBlockedImage',
        type: 'POST',
        data: {
            url: url
        }
    }).done(function (response) {
        //console.log(response);
        if (response.results) {
            $('<img class="schoolImage" src="data:image/gif;base64,' + response.results + '" />').insertBefore(el);
        }
    }).error(function (error) {
        console.log(error);
    });
}
function eduLevel() {
    var edu = getCookie('educationSelected');
    switch (edu) {
        case 'ged':
            return 'GED';
        case 'highschool':
        case 'certificate':
            return 'High School Diploma';
        case 'college':
            return 'Some college 35-59 credits';
        case 'associates':
            return 'Associate\'s Degree';
        case 'bachelors':
            return 'Bachelor\'s Degree';
        case 'masters':
            return 'Master\'s Degree';
        case 'doctoral':
            return 'Doctoral Degree';
        case 'stillhighschool':
        case 'none':
            return 'None';
        default:
            return 'High School Diploma';
    }
}