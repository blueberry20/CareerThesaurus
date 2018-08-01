var seedtitle = '';
var itemshoulddisplay;
var parentcontainerid;
var seeddescription = '';
var expandprofessiongroups = false;

var excludeditems = new Array();

var additionallinks;
var additionallinksfunctions = new Array();

function renderData(containerid, title, params) {

    //try {
        parentcontainerid = containerid;

        seedtitle = params.seedprofession;

        itemshoulddisplay = params.itemshoulddisplay;
        itemClickPredicate = params.onitemclick;

        if (title != '') {
            $('#' + containerid).append('<div><h1 style="margin: 0">' + title + '</h1></div>');
        }

        if (params.showdescription) {
            var desc = getdescription(params.code);
            if (desc != '') {
                $('#' + containerid).append('<p id="descriptioncontainer" style="margin-top:0">' + desc + '</p>');
                seeddescription = desc;
            }
        }

        if (params.expandgroups) {
            expandprofessiongroups = params.expandgroups;
        }

        if (params.excludeditems != null) {
            excludeditems = params.excludeditems;
        }

        if (params.additionallinks != null) {
            additionallinks = params.additionallinks;
        }

        $('#' + containerid).append('<div style="position: absolute; top: 10px; right: 10px;"><input id="searchbox" type="text" onkeyup="applyFilter($(\'#searchbox\').val());" placeholder="Keyword search"/></div>');
        $('#' + containerid).append('<div style="position: absolute; top: 50px; right: 10px;"><h1>Progress: ' + (parseFloat(approvals.length)/professions.length * 100).toFixed(0) + '% (' + approvals.length + ' of ' + professions.length + ')</h1></div>');

        $('#' + containerid).append('<div id="attributecontainer" style="width: 100%; margin-bottom: 20px;"><div id="dimensionscontainer" style="display: inline-block;"></div></div>');

        var attributelinks = '<div class="dimension attitude"><div class="label">Attitude:</div><span dimension="attitude" onclick="toggledimension(this);">Extravert</span><span dimension="attitude" onclick="toggledimension(this);">Introvert</span></div>';
        attributelinks += '<div class="dimension information"><div class="label">Information:</div><span dimension="information" onclick="toggledimension(this);">Imagination</span><span dimension="information" onclick="toggledimension(this);">Facts</span></div>';
        attributelinks += '<div class="dimension processing"><div class="label">Processing:</div><span dimension="processing" onclick="toggledimension(this);">Rational</span><span dimension="processing" onclick="toggledimension(this);">Emotional</span></div>';
        attributelinks += '<div class="dimension action"><div class="label">Action:</div><span dimension="action" onclick="toggledimension(this);">Result</span><span dimension="action" onclick="toggledimension(this);">Process</span></div>';
        attributelinks += '<div class="dimension endurance"><div class="label">Endurance:</div><span dimension="endurance" onclick="toggledimension(this);">Mobile</span><span dimension="endurance" onclick="toggledimension(this);">Stationary</span></div>';
        attributelinks += '<div class="dimension presence"><div class="label">Presence:</div><span dimension="presence" onclick="toggledimension(this);">Present</span><span dimension="presence" onclick="toggledimension(this);">Remote</span></div>';
        attributelinks += '<div class="dimension concentration"><div class="label">Concentration:</div><span dimension="concentration" onclick="toggledimension(this);">Focused</span><span dimension="concentration" onclick="toggledimension(this);">Relaxed</span></div>';
        attributelinks += '<div class="dimension patterns"><div class="label">Patterns:</div><span dimension="patterns" onclick="toggledimension(this);">Discover</span><span dimension="patterns" onclick="toggledimension(this);">Routine</span></div>';
        attributelinks += '<div class="dimension compensation"><div class="label">Compensation:</div><span dimension="compensation" onclick="toggledimension(this);">Fixed</span><span dimension="compensation" onclick="toggledimension(this);">Variable</span></div>';
        $('#dimensionscontainer').append(attributelinks);

        var thingslinks = '<div class="importantthings" style="display: inline-block; margin-left: 20px;">';
        thingslinks += '<span onclick="toggleimportantthing(this);" dimension="beauty" value="1">Beauty & Visual Perfection</span>';
        thingslinks += '<span onclick="toggleimportantthing(this);" dimension="helping" value="1">Helping Others</span>';
        thingslinks += '<span onclick="toggleimportantthing(this);" dimension="adventure" value="1">Risk & Adventure</span><br>';
        thingslinks += '<span onclick="toggleimportantthing(this);" dimension="safety" value="1">Safety of Others</span>';
        thingslinks += '<span onclick="toggleimportantthing(this);" dimension="people" value="1">Working with People</span>';
        thingslinks += '<span onclick="toggleimportantthing(this);" dimension="science" value="1">Scientific Methods & Precision</span><br>';
        thingslinks += '<span onclick="toggleimportantthing(this);" dimension="easy" value="1">Low Involvement</span>';
        thingslinks += '<span onclick="toggleimportantthing(this);" dimension="duty" value="1">Sense of Duty</span>';
        thingslinks += '<span onclick="toggleimportantthing(this);" dimension="admiration" value="1">Being in a Spot Light</span><br>';
        thingslinks += '<span onclick="toggleimportantthing(this);" dimension="creativity" value="1">Creativity</span>';
        thingslinks += '<span onclick="toggleimportantthing(this);" dimension="competition" value="1">Competitiveness</span>';
        thingslinks += '<span onclick="toggleimportantthing(this);" dimension="animals" value="1">Nature & Animals</span><br>';
        thingslinks += '<span onclick="toggleimportantthing(this);" dimension="politics" value="1">Politics & Strategy</span>';
        thingslinks += '<span onclick="toggleimportantthing(this);" dimension="technology" value="1">Technology & Gadgets</span>';
        thingslinks += '<span onclick="toggleimportantthing(this);" dimension="machinery" value="1">Machinery</span><br>';
        thingslinks += '<span onclick="toggleimportantthing(this);" dimension="handlabor" value="1">Hand Labor</span>';
        thingslinks += '<span onclick="toggleimportantthing(this);" dimension="heavyequipment" value="1">Heavy Equipment</span>';
        thingslinks += '<span onclick="toggleimportantthing(this);" dimension="strength" value="1">Using Body Strength</span><br>';
        thingslinks += '<span onclick="toggleimportantthing(this);" dimension="drafting" value="1">Drafting & Sketching</span>';
        thingslinks += '<span onclick="toggleimportantthing(this);" dimension="coordinating" value="1">Coordinating Groups</span>';
        thingslinks += '<span onclick="toggleimportantthing(this);" dimension="quickthinking" value="1">Quick Reaction</span><br>';
        thingslinks += '<span onclick="toggleimportantthing(this);" dimension="numbers" value="1">Working with Numbers</span>';
        thingslinks += '<span onclick="toggleimportantthing(this);" dimension="critical" value="1">Giving Critical Advice</span>';
        thingslinks += '<span onclick="toggleimportantthing(this);" dimension="smart" value="1">Being Super Smart</span><br>';
        thingslinks += '<span onclick="toggleimportantthing(this);" dimension="salesy" value="1">Salesiness</span>';
        thingslinks += '</div>';

        $('#attributecontainer').append(thingslinks);

        var groupinglinks1 = '<div style="text-align: right; background-color: #eee; padding: 3px;">Sort order: <a href="javascript:setinternalsortorder(\'keywordmatches\');">Keywords</a> | <a href="javascript:setinternalsortorder(\'predecessors\');">Predecessors</a> | <a href="javascript:setinternalsortorder(\'similars\');">Similars</a> | <a href="javascript:setinternalsortorder(\'progressions\');">Progressions</a> | <a href="javascript:setinternalsortorder(\'total\');">Total Count</a></div>';
        $('#' + containerid).append(groupinglinks1);

        var groupinglinks2 = '<div style="text-align: right; background-color: #eee; padding: 3px;">Group by: <a href="javascript:groupbyrelateditems();">No grouping</a> | <a href="javascript:groupbymajor();">Major</a>	| <a href="javascript:groupbyminor();">Minor</a> | <a href="javascript:groupbyminedulevel();">Edu level</a> | <a href="javascript:groupbyexplevel();">Exp. level</a> | <a href="javascript:groupbytraining();">Training</a> | <a href="javascript:groupbysalary();">Avg. Salary</a></div>';
        $('#' + containerid).append(groupinglinks2);

        $('#' + containerid).append('<br><div style="text-align: right">All Groups <span id="allgrouptoggle" style="color:blue; cursor:pointer" onclick="toggleallgroups(this)">[+]</span></div>');
        $('#' + containerid).append('<br><div id="columns" class="columns" style=""></div>');

        selectAttributes();

    
        if (params.defaultgroupmethod) {
            params.defaultgroupmethod();
        }
        else {
            groupbyrelateditems();
        }
    //}
    //catch (ex) {
    //    alert(ex.message);
    //}

}

function selectAttributes() {
    var templateprofession = null;
    if (seedtitle != null && seedtitle.length > 0) {
        templateprofession = findbytitle(professions, seedtitle);

    }
    if (templateprofession == null) {
        return;
    }
    var spans = $('.dimension > span');
    for (var i = 0; i < spans.length; i++) {
        var value = '';
        switch ($(spans[i]).attr('dimension')) {
            case 'attitude': value = templateprofession.attitude; break;
            case 'information': value = templateprofession.information; break;
            case 'processing': value = templateprofession.processing; break;
            case 'action': value = templateprofession.action; break;
            case 'endurance': value = templateprofession.endurance; break;
            case 'presence': value = templateprofession.presence; break;
            case 'concentration': value = templateprofession.concentration; break;
            case 'patterns': value = templateprofession.patterns; break;
            case 'compensation': value = templateprofession.compensation; break;
            default: break;
        }
        if (value == $(spans[i]).html()) {
            $(spans[i]).addClass('prompt');
        }
    }
}

var dimensions = { attitude: "", information: "", processing: "", action: "", endurance: "", presence: "", concentration: "", patterns: "", compensation: "" };
function toggledimension(e) {
    if ($(e).hasClass('active')) {
        $(e).removeClass('active')
        setDimensionValue($(e).attr('dimension'), '');
    }
    else {
        $('.' + $(e).attr('dimension') + ' > span').removeClass('active');
        $(e).addClass('active');
        setDimensionValue($(e).attr('dimension'), $(e).html());
    }
    applyFilter();
}
function setDimensionValue(dim, value) {
    switch (dim) {
        case 'attitude': dimensions.attitude = value; break;
        case 'information': dimensions.information = value; break;
        case 'processing': dimensions.processing = value; break;
        case 'action': dimensions.action = value; break;
        case 'endurance': dimensions.endurance = value; break;
        case 'presence': dimensions.presence = value; break;
        case 'concentration': dimensions.concentration = value; break;
        case 'patterns': dimensions.patterns = value; break;
        case 'compensation': dimensions.compensation = value; break;
        default: break;
    }
}

var importantthings = { beauty: "", helping: "", adventure: "", safety: "", people: "", science: "", easy: "", duty: "", admiration: "", creativity: "", competition: "", animals: "", politics: "", technology: "", machinery: "", gender: "", handlabor: "", heavyequipment: "", strength: "", drafting: "", coordinating: "", quickthinking: "", numbers: "", critical: "", smart: "", salesy: "" };
function toggleimportantthing(e) {
    if ($(e).hasClass('active')) {
        $(e).removeClass('active')
        setImportantThingValue($(e).attr('dimension'), '');
    }
    else {
        $(e).addClass('active');
        setImportantThingValue($(e).attr('dimension'), $(e).attr('value'));
    }
    applyFilter();
}
function setImportantThingValue(dim, value) {
    switch (dim) {
        case 'beauty': importantthings.beauty = value; break;
        case 'helping': importantthings.helping = value; break;
        case 'adventure': importantthings.adventure = value; break;
        case 'safety': importantthings.safety = value; break;
        case 'people': importantthings.people = value; break;
        case 'science': importantthings.science = value; break;
        case 'easy': importantthings.easy = value; break;
        case 'duty': importantthings.duty = value; break;
        case 'admiration': importantthings.admiration = value; break;
        case 'creativity': importantthings.creativity = value; break;
        case 'competition': importantthings.competition = value; break;
        case 'animals': importantthings.animals = value; break;
        case 'politics': importantthings.politics = value; break;
        case 'technology': importantthings.technology = value; break;
        case 'machinery': importantthings.machinery = value; break;
        case 'gender': importantthings.gender = value; break;
        case 'handlabor': importantthings.handlabor = value; break;
        case 'heavyequipment': importantthings.heavyequipment = value; break;
        case 'strength': importantthings.strength = value; break;
        case 'drafting': importantthings.drafting = value; break;
        case 'coordinating': importantthings.coordinating = value; break;
        case 'quickthinking': importantthings.quickthinking = value; break;
        case 'numbers': importantthings.numbers = value; break;
        case 'critical': importantthings.critical = value; break;
        case 'smart': importantthings.smart = value; break;
        case 'salesy': importantthings.salesy = value; break;

        default: break;
    }
}


//Sorting functions
function sortbymajor(a, b) { if (a.major < b.major) return -1; if (a.major > b.major) return 1; return 0; } function sortbyminor(a, b) { if (a.minor < b.minor) return -1; if (a.minor > b.minor) return 1; return 0; } function sortbycategory(a, b) { if (a.category < b.category) return -1; if (a.category > b.category) return 1; return 0; } function sortbyocccode(a, b) { if (a.occcode < b.occcode) return -1; if (a.occcode > b.occcode) return 1; return 0; } function sortbytitle(a, b) { if (a.title < b.title) return -1; if (a.title > b.title) return 1; return 0; } function sortbyedulevel(a, b) { if (a.edulevel < b.edulevel) return -1; if (a.edulevel > b.edulevel) return 1; return 0; } function sortbyminedulevel(a, b) { if (a.edulevel < b.edulevel) return -1; if (a.edulevel > b.edulevel) return 1; return 0; } function sortbyexplevel(a, b) { if (a.explevel < b.explevel) return -1; if (a.explevel > b.explevel) return 1; return 0; } function sortbytraining(a, b) { if (a.training < b.training) return -1; if (a.training > b.training) return 1; return 0; } function sortbyattitude(a, b) { if (a.attitude < b.attitude) return -1; if (a.attitude > b.attitude) return 1; return 0; } function sortbyinformation(a, b) { if (a.information < b.information) return -1; if (a.information > b.information) return 1; return 0; } function sortbyprocessing(a, b) { if (a.processing < b.processing) return -1; if (a.processing > b.processing) return 1; return 0; } function sortbyaction(a, b) { if (a.action < b.action) return -1; if (a.action > b.action) return 1; return 0; } function sortbyendurance(a, b) { if (a.endurance < b.endurance) return -1; if (a.endurance > b.endurance) return 1; return 0; } function sortbypresence(a, b) { if (a.presence < b.presence) return -1; if (a.presence > b.presence) return 1; return 0; } function sortbyconcentration(a, b) { if (a.concentration < b.concentration) return -1; if (a.concentration > b.concentration) return 1; return 0; } function sortbypatterns(a, b) { if (a.patterns < b.patterns) return -1; if (a.patterns > b.patterns) return 1; return 0; } function sortbycompensation(a, b) { if (a.compensation < b.compensation) return -1; if (a.compensation > b.compensation) return 1; return 0; } function sortbybeauty(a, b) { if (a.beauty < b.beauty) return -1; if (a.beauty > b.beauty) return 1; return 0; } function sortbyhelping(a, b) { if (a.helping < b.helping) return -1; if (a.helping > b.helping) return 1; return 0; } function sortbyadventure(a, b) { if (a.adventure < b.adventure) return -1; if (a.adventure > b.adventure) return 1; return 0; } function sortbysafety(a, b) { if (a.safety < b.safety) return -1; if (a.safety > b.safety) return 1; return 0; } function sortbypeople(a, b) { if (a.people < b.people) return -1; if (a.people > b.people) return 1; return 0; } function sortbyscience(a, b) { if (a.science < b.science) return -1; if (a.science > b.science) return 1; return 0; } function sortbyeasy(a, b) { if (a.easy < b.easy) return -1; if (a.easy > b.easy) return 1; return 0; } function sortbyduty(a, b) { if (a.duty < b.duty) return -1; if (a.duty > b.duty) return 1; return 0; } function sortbyadmiration(a, b) { if (a.admiration < b.admiration) return -1; if (a.admiration > b.admiration) return 1; return 0; } function sortbycreativity(a, b) { if (a.creativity < b.creativity) return -1; if (a.creativity > b.creativity) return 1; return 0; } function sortbycompetition(a, b) { if (a.competition < b.competition) return -1; if (a.competition > b.competition) return 1; return 0; } function sortbyanimals(a, b) { if (a.animals < b.animals) return -1; if (a.animals > b.animals) return 1; return 0; } function sortbypolitics(a, b) { if (a.politics < b.politics) return -1; if (a.politics > b.politics) return 1; return 0; } function sortbytechnology(a, b) { if (a.technology < b.technology) return -1; if (a.technology > b.technology) return 1; return 0; } function sortbymachinery(a, b) { if (a.machinery < b.machinery) return -1; if (a.machinery > b.machinery) return 1; return 0; } function sortbygender(a, b) { if (a.gender < b.gender) return -1; if (a.gender > b.gender) return 1; return 0; } function sortbyhandlabor(a, b) { if (a.handlabor < b.handlabor) return -1; if (a.handlabor > b.handlabor) return 1; return 0; } function sortbyheavyequipment(a, b) { if (a.heavyequipment < b.heavyequipment) return -1; if (a.heavyequipment > b.heavyequipment) return 1; return 0; } function sortbystrength(a, b) { if (a.strength < b.strength) return -1; if (a.strength > b.strength) return 1; return 0; } function sortbydrafting(a, b) { if (a.drafting < b.drafting) return -1; if (a.drafting > b.drafting) return 1; return 0; } function sortbycoordinating(a, b) { if (a.coordinating < b.coordinating) return -1; if (a.coordinating > b.coordinating) return 1; return 0; } function sortbyquickthinking(a, b) { if (a.quickthinking < b.quickthinking) return -1; if (a.quickthinking > b.quickthinking) return 1; return 0; } function sortbynumbers(a, b) { if (a.numbers < b.numbers) return -1; if (a.numbers > b.numbers) return 1; return 0; } function sortbycritical(a, b) { if (a.critical < b.critical) return -1; if (a.critical > b.critical) return 1; return 0; } function sortbysmart(a, b) { if (a.smart < b.smart) return -1; if (a.smart > b.smart) return 1; return 0; } function sortbysalesy(a, b) { if (a.salesy < b.salesy) return -1; if (a.salesy > b.salesy) return 1; return 0; }

function groupbymajor() {
    currentgrouping = 'major';
    $('#columns').html('');
    professions.sort(sortbymajor);
    var prevval = '';
    var id = '';
    for (var i = 0; i < professions.length; i++) {
        if (prevval != professions[i].major) {
            id = guid();
            groupHeaderFor('major', professions[i].major, id);
            prevval = professions[i].major;
            renderEnrichedItems(id, function (x) { return x.major; }, professions[i].major);
        }
    }
    hideEmptyGroups();
}
function groupbyminor() { currentgrouping = 'minor'; $('#columns').html(''); professions.sort(sortbyminor); var prevval = ''; var id = ''; for (var i = 0; i < professions.length; i++) { if (prevval != professions[i].minor) { id = guid(); groupHeaderFor('minor', professions[i].minor, id); prevval = professions[i].minor; renderEnrichedItems(id, function (x) { return x.minor; }, professions[i].minor); } } hideEmptyGroups(); }
function groupbyminedulevel() { currentgrouping = 'minedulevel'; $('#columns').html(''); professions.sort(sortbyminedulevel); var prevval = ''; var id = ''; for (var i = 0; i < professions.length; i++) { if (prevval != professions[i].minedulevel) { id = guid(); groupHeaderFor('minedulevel', professions[i].minedulevel, id); prevval = professions[i].minedulevel; renderEnrichedItems(id, function (x) { return x.minedulevel; }, professions[i].minedulevel); } } hideEmptyGroups(); }
function groupbyexplevel() { currentgrouping = 'explevel'; $('#columns').html(''); professions.sort(sortbyexplevel); var prevval = ''; var id = ''; for (var i = 0; i < professions.length; i++) { if (prevval != professions[i].explevel) { id = guid(); groupHeaderFor('explevel', professions[i].explevel, id); prevval = professions[i].explevel; renderEnrichedItems(id, function (x) { return x.explevel; }, professions[i].explevel); } } hideEmptyGroups(); }
function groupbytraining() { currentgrouping = 'training'; $('#columns').html(''); professions.sort(sortbytraining); var prevval = ''; var id = ''; for (var i = 0; i < professions.length; i++) { if (prevval != professions[i].training) { id = guid(); groupHeaderFor('training', professions[i].training, id); prevval = professions[i].training; renderEnrichedItems(id, function (x) { return x.training; }, professions[i].training); } } hideEmptyGroups(); }

function renderEnrichedItems(containerid, predicate, groupvalue) {
    var subset = new Array();
    for (var j = 0; j < getEnrichedItems().length; j++) {
        if (predicate(getEnrichedItems()[j]).toLowerCase() == groupvalue.toLowerCase()) {
            subset.push(getEnrichedItems()[j]);
        }
    }
    sortEnrichedItems(subset);
    for (var j = 0; j < subset.length; j++) {
        itemFor(subset[j], containerid);
    }
}


function groupbyattitude() { $('#columns').html(''); professions.sort(sortbyattitude); var prevval = ''; var id = ''; for (var i = 0; i < professions.length; i++) { if (prevval != professions[i].attitude) { id = guid(); groupHeaderFor('attitude', professions[i].attitude, id); prevval = professions[i].attitude; } itemFor('attitude', professions[i], id); } } function groupbyinformation() { $('#columns').html(''); professions.sort(sortbyinformation); var prevval = ''; var id = ''; for (var i = 0; i < professions.length; i++) { if (prevval != professions[i].information) { id = guid(); groupHeaderFor('information', professions[i].information, id); prevval = professions[i].information; } itemFor('information', professions[i], id); } } function groupbyprocessing() { $('#columns').html(''); professions.sort(sortbyprocessing); var prevval = ''; var id = ''; for (var i = 0; i < professions.length; i++) { if (prevval != professions[i].processing) { id = guid(); groupHeaderFor('processing', professions[i].processing, id); prevval = professions[i].processing; } itemFor('processing', professions[i], id); } } function groupbyaction() { $('#columns').html(''); professions.sort(sortbyaction); var prevval = ''; var id = ''; for (var i = 0; i < professions.length; i++) { if (prevval != professions[i].action) { id = guid(); groupHeaderFor('action', professions[i].action, id); prevval = professions[i].action; } itemFor('action', professions[i], id); } } function groupbyendurance() { $('#columns').html(''); professions.sort(sortbyendurance); var prevval = ''; var id = ''; for (var i = 0; i < professions.length; i++) { if (prevval != professions[i].endurance) { id = guid(); groupHeaderFor('endurance', professions[i].endurance, id); prevval = professions[i].endurance; } itemFor('endurance', professions[i], id); } } function groupbypresence() { $('#columns').html(''); professions.sort(sortbypresence); var prevval = ''; var id = ''; for (var i = 0; i < professions.length; i++) { if (prevval != professions[i].presence) { id = guid(); groupHeaderFor('presence', professions[i].presence, id); prevval = professions[i].presence; } itemFor('presence', professions[i], id); } } function groupbyconcentration() { $('#columns').html(''); professions.sort(sortbyconcentration); var prevval = ''; var id = ''; for (var i = 0; i < professions.length; i++) { if (prevval != professions[i].concentration) { id = guid(); groupHeaderFor('concentration', professions[i].concentration, id); prevval = professions[i].concentration; } itemFor('concentration', professions[i], id); } } function groupbypatterns() { $('#columns').html(''); professions.sort(sortbypatterns); var prevval = ''; var id = ''; for (var i = 0; i < professions.length; i++) { if (prevval != professions[i].patterns) { id = guid(); groupHeaderFor('patterns', professions[i].patterns, id); prevval = professions[i].patterns; } itemFor('patterns', professions[i], id); } } function groupbycompensation() { $('#columns').html(''); professions.sort(sortbycompensation); var prevval = ''; var id = ''; for (var i = 0; i < professions.length; i++) { if (prevval != professions[i].compensation) { id = guid(); groupHeaderFor('compensation', professions[i].compensation, id); prevval = professions[i].compensation; } itemFor('compensation', professions[i], id); } } function groupbybeauty() { $('#columns').html(''); professions.sort(sortbybeauty); var prevval = ''; var id = ''; for (var i = 0; i < professions.length; i++) { if (prevval != professions[i].beauty) { id = guid(); groupHeaderFor('beauty', professions[i].beauty, id); prevval = professions[i].beauty; } itemFor('beauty', professions[i], id); } } function groupbyhelping() { $('#columns').html(''); professions.sort(sortbyhelping); var prevval = ''; var id = ''; for (var i = 0; i < professions.length; i++) { if (prevval != professions[i].helping) { id = guid(); groupHeaderFor('helping', professions[i].helping, id); prevval = professions[i].helping; } itemFor('helping', professions[i], id); } } function groupbyadventure() { $('#columns').html(''); professions.sort(sortbyadventure); var prevval = ''; var id = ''; for (var i = 0; i < professions.length; i++) { if (prevval != professions[i].adventure) { id = guid(); groupHeaderFor('adventure', professions[i].adventure, id); prevval = professions[i].adventure; } itemFor('adventure', professions[i], id); } } function groupbysafety() { $('#columns').html(''); professions.sort(sortbysafety); var prevval = ''; var id = ''; for (var i = 0; i < professions.length; i++) { if (prevval != professions[i].safety) { id = guid(); groupHeaderFor('safety', professions[i].safety, id); prevval = professions[i].safety; } itemFor('safety', professions[i], id); } } function groupbypeople() { $('#columns').html(''); professions.sort(sortbypeople); var prevval = ''; var id = ''; for (var i = 0; i < professions.length; i++) { if (prevval != professions[i].people) { id = guid(); groupHeaderFor('people', professions[i].people, id); prevval = professions[i].people; } itemFor('people', professions[i], id); } } function groupbyscience() { $('#columns').html(''); professions.sort(sortbyscience); var prevval = ''; var id = ''; for (var i = 0; i < professions.length; i++) { if (prevval != professions[i].science) { id = guid(); groupHeaderFor('science', professions[i].science, id); prevval = professions[i].science; } itemFor('science', professions[i], id); } } function groupbyeasy() { $('#columns').html(''); professions.sort(sortbyeasy); var prevval = ''; var id = ''; for (var i = 0; i < professions.length; i++) { if (prevval != professions[i].easy) { id = guid(); groupHeaderFor('easy', professions[i].easy, id); prevval = professions[i].easy; } itemFor('easy', professions[i], id); } } function groupbyduty() { $('#columns').html(''); professions.sort(sortbyduty); var prevval = ''; var id = ''; for (var i = 0; i < professions.length; i++) { if (prevval != professions[i].duty) { id = guid(); groupHeaderFor('duty', professions[i].duty, id); prevval = professions[i].duty; } itemFor('duty', professions[i], id); } } function groupbyadmiration() { $('#columns').html(''); professions.sort(sortbyadmiration); var prevval = ''; var id = ''; for (var i = 0; i < professions.length; i++) { if (prevval != professions[i].admiration) { id = guid(); groupHeaderFor('admiration', professions[i].admiration, id); prevval = professions[i].admiration; } itemFor('admiration', professions[i], id); } } function groupbycreativity() { $('#columns').html(''); professions.sort(sortbycreativity); var prevval = ''; var id = ''; for (var i = 0; i < professions.length; i++) { if (prevval != professions[i].creativity) { id = guid(); groupHeaderFor('creativity', professions[i].creativity, id); prevval = professions[i].creativity; } itemFor('creativity', professions[i], id); } } function groupbycompetition() { $('#columns').html(''); professions.sort(sortbycompetition); var prevval = ''; var id = ''; for (var i = 0; i < professions.length; i++) { if (prevval != professions[i].competition) { id = guid(); groupHeaderFor('competition', professions[i].competition, id); prevval = professions[i].competition; } itemFor('competition', professions[i], id); } } function groupbyanimals() { $('#columns').html(''); professions.sort(sortbyanimals); var prevval = ''; var id = ''; for (var i = 0; i < professions.length; i++) { if (prevval != professions[i].animals) { id = guid(); groupHeaderFor('animals', professions[i].animals, id); prevval = professions[i].animals; } itemFor('animals', professions[i], id); } } function groupbypolitics() { $('#columns').html(''); professions.sort(sortbypolitics); var prevval = ''; var id = ''; for (var i = 0; i < professions.length; i++) { if (prevval != professions[i].politics) { id = guid(); groupHeaderFor('politics', professions[i].politics, id); prevval = professions[i].politics; } itemFor('politics', professions[i], id); } } function groupbytechnology() { $('#columns').html(''); professions.sort(sortbytechnology); var prevval = ''; var id = ''; for (var i = 0; i < professions.length; i++) { if (prevval != professions[i].technology) { id = guid(); groupHeaderFor('technology', professions[i].technology, id); prevval = professions[i].technology; } itemFor('technology', professions[i], id); } } function groupbymachinery() { $('#columns').html(''); professions.sort(sortbymachinery); var prevval = ''; var id = ''; for (var i = 0; i < professions.length; i++) { if (prevval != professions[i].machinery) { id = guid(); groupHeaderFor('machinery', professions[i].machinery, id); prevval = professions[i].machinery; } itemFor('machinery', professions[i], id); } } function groupbygender() { $('#columns').html(''); professions.sort(sortbygender); var prevval = ''; var id = ''; for (var i = 0; i < professions.length; i++) { if (prevval != professions[i].gender) { id = guid(); groupHeaderFor('gender', professions[i].gender, id); prevval = professions[i].gender; } itemFor('gender', professions[i], id); } } function groupbyhandlabor() { $('#columns').html(''); professions.sort(sortbyhandlabor); var prevval = ''; var id = ''; for (var i = 0; i < professions.length; i++) { if (prevval != professions[i].handlabor) { id = guid(); groupHeaderFor('handlabor', professions[i].handlabor, id); prevval = professions[i].handlabor; } itemFor('handlabor', professions[i], id); } } function groupbyheavyequipment() { $('#columns').html(''); professions.sort(sortbyheavyequipment); var prevval = ''; var id = ''; for (var i = 0; i < professions.length; i++) { if (prevval != professions[i].heavyequipment) { id = guid(); groupHeaderFor('heavyequipment', professions[i].heavyequipment, id); prevval = professions[i].heavyequipment; } itemFor('heavyequipment', professions[i], id); } } function groupbystrength() { $('#columns').html(''); professions.sort(sortbystrength); var prevval = ''; var id = ''; for (var i = 0; i < professions.length; i++) { if (prevval != professions[i].strength) { id = guid(); groupHeaderFor('strength', professions[i].strength, id); prevval = professions[i].strength; } itemFor('strength', professions[i], id); } } function groupbydrafting() { $('#columns').html(''); professions.sort(sortbydrafting); var prevval = ''; var id = ''; for (var i = 0; i < professions.length; i++) { if (prevval != professions[i].drafting) { id = guid(); groupHeaderFor('drafting', professions[i].drafting, id); prevval = professions[i].drafting; } itemFor('drafting', professions[i], id); } } function groupbycoordinating() { $('#columns').html(''); professions.sort(sortbycoordinating); var prevval = ''; var id = ''; for (var i = 0; i < professions.length; i++) { if (prevval != professions[i].coordinating) { id = guid(); groupHeaderFor('coordinating', professions[i].coordinating, id); prevval = professions[i].coordinating; } itemFor('coordinating', professions[i], id); } } function groupbyquickthinking() { $('#columns').html(''); professions.sort(sortbyquickthinking); var prevval = ''; var id = ''; for (var i = 0; i < professions.length; i++) { if (prevval != professions[i].quickthinking) { id = guid(); groupHeaderFor('quickthinking', professions[i].quickthinking, id); prevval = professions[i].quickthinking; } itemFor('quickthinking', professions[i], id); } } function groupbynumbers() { $('#columns').html(''); professions.sort(sortbynumbers); var prevval = ''; var id = ''; for (var i = 0; i < professions.length; i++) { if (prevval != professions[i].numbers) { id = guid(); groupHeaderFor('numbers', professions[i].numbers, id); prevval = professions[i].numbers; } itemFor('numbers', professions[i], id); } } function groupbycritical() { $('#columns').html(''); professions.sort(sortbycritical); var prevval = ''; var id = ''; for (var i = 0; i < professions.length; i++) { if (prevval != professions[i].critical) { id = guid(); groupHeaderFor('critical', professions[i].critical, id); prevval = professions[i].critical; } itemFor('critical', professions[i], id); } } function groupbysmart() { $('#columns').html(''); professions.sort(sortbysmart); var prevval = ''; var id = ''; for (var i = 0; i < professions.length; i++) { if (prevval != professions[i].smart) { id = guid(); groupHeaderFor('smart', professions[i].smart, id); prevval = professions[i].smart; } itemFor('smart', professions[i], id); } } function groupbysalesy() { $('#columns').html(''); professions.sort(sortbysalesy); var prevval = ''; var id = ''; for (var i = 0; i < professions.length; i++) { if (prevval != professions[i].salesy) { id = guid(); groupHeaderFor('salesy', professions[i].salesy, id); prevval = professions[i].salesy; } itemFor('salesy', professions[i], id); } }

var enriched = new Array();
function getEnrichedItems() {
    if (enriched.length == 0) {
        for (var i = 0; i < professions.length; i++) {
            enriched.push({ code: professions[i].code,
                title: professions[i].title,
                major: professions[i].major,
                minor: professions[i].minor,
                minedulevel: professions[i].minedulevel,
                explevel: professions[i].explevel,
                training: professions[i].training,
                salary: parseFloat(professions[i].salary),
                predecessors: countPredecessors(professions[i].title),
                similars: countSimilars(professions[i].title),
                progressions: countProgressions(professions[i].title),
                keywordmatches: matchDescriptionKeywords(seeddescription, getdescription(professions[i].code)),
                attitude: professions[i].attitude,
                information: professions[i].information,
                processing: professions[i].processing,
                action: professions[i].action,
                endurance: professions[i].endurance,
                presence: professions[i].presence,
                concentration: professions[i].concentration,
                patterns: professions[i].patterns,
                compensation: professions[i].compensation,
                beauty: professions[i].beauty,
                helping: professions[i].helping,
                adventure: professions[i].adventure,
                safety: professions[i].safety,
                people: professions[i].people,
                science: professions[i].science,
                easy: professions[i].easy,
                duty: professions[i].duty,
                admiration: professions[i].admiration,
                creativity: professions[i].creativity,
                competition: professions[i].competition,
                animals: professions[i].animals,
                politics: professions[i].politics,
                technology: professions[i].technology,
                machinery: professions[i].machinery,
                gender: professions[i].gender,
                handlabor: professions[i].handlabor,
                heavyequipment: professions[i].heavyequipment,
                strength: professions[i].strength,
                drafting: professions[i].drafting,
                coordinating: professions[i].coordinating,
                quickthinking: professions[i].quickthinking,
                numbers: professions[i].numbers,
                critical: professions[i].critical,
                smart: professions[i].smart,
                salesy: professions[i].salesy

            });
        }
    }
    return enriched;
}
function sortEnrichedItems(items) {
    switch (internalsortorder) {
        case 'predecessors':
            items.sort(sortbypredecessors);
            break;
        case 'similars':
            items.sort(sortbysimilars);
            break;
        case 'progressions':
            items.sort(sortbyprogressions);
            break;
        case 'total':
            items.sort(sortbyrelateditemscount);
            break;
        default:
            items.sort(sortbykeywordmatches);

            break;
    }
}
function groupbyrelateditems() {

    try {
        currentgrouping = '';

        $('#columns').html('');

        sortEnrichedItems(getEnrichedItems());

        var prevval = '-';
        var id = '';

        for (var i = 0; i < getEnrichedItems().length; i++) {
            var groupname = '';
            if (prevval != groupname) {
                id = guid();
                groupHeaderFor('relateditems', groupname, id);
                prevval = groupname;
            }
            itemFor(getEnrichedItems()[i], id);
        }
    }
    catch (ex) {
        alert(ex.message);
    }
}


function sortbykeywordmatches(a, b) { if (parseInt(a.keywordmatches) > parseInt(b.keywordmatches)) return -1; if (parseInt(a.keywordmatches) < parseInt(b.keywordmatches)) return 1; return 0; }
function sortbypredecessors(a, b) { if (parseInt(a.predecessors) > parseInt(b.predecessors)) return -1; if (parseInt(a.predecessors) < parseInt(b.predecessors)) return 1; return 0; }
function sortbysimilars(a, b) { if (parseInt(a.similars) > parseInt(b.similars)) return -1; if (parseInt(a.similars) < parseInt(b.similars)) return 1; return 0; }
function sortbyprogressions(a, b) { if (parseInt(a.progressions) > parseInt(b.progressions)) return -1; if (parseInt(a.progressions) < parseInt(b.progressions)) return 1; return 0; }
function sortbyrelateditemscount(a, b) { if (parseInt(a.predecessors + a.similars + a.progressions) > parseInt(b.predecessors + b.similars + b.progressions)) return -1; if (parseInt(a.predecessors + a.similars + a.progressions) < parseInt(b.predecessors + b.similars + b.progressions)) return 1; return 0; }
function countPredecessors(title) {
    var cnt = 0;
    for (var i = 0; i < progressions.length; i++) {
        if (progressions[i].status != 'x' && progressions[i].manual != 'x') {
            if (progressions[i].nextlevel.toLowerCase() == title.toLowerCase()) {
                cnt++;
            }
        }
    }
    return cnt;
}
function countSimilars(title) {
    var cnt = 0;
    for (var i = 0; i < similars.length; i++) {
        if (similars[i].status != 'x' && similars[i].manual != 'x') {
            if (similars[i].profession.toLowerCase() == title.toLowerCase()) {
                cnt++;
            }
        }
    }
    return cnt;
}
function countProgressions(title) {
    var cnt = 0;
    for (var i = 0; i < progressions.length; i++) {
        if (progressions[i].status != 'x' && progressions[i].manual != 'x') {
            if (progressions[i].profession.toLowerCase() == title.toLowerCase()) {
                cnt++;
            }
        }
    }
    return cnt;
}




function sortbysalary(a, b) { if (parseInt(a.salary) < parseInt(b.salary)) return -1; if (parseInt(a.salary) > parseInt(b.salary)) return 1; return 0; }
function groupbysalary() {
    currentgrouping = 'salary';
    $('#columns').html('');
    professions.sort(sortbysalary);
    var prevval = '';
    var id = '';
    for (var i = 0; i < professions.length; i++) {
        var salarybucket = getSalaryBucket(professions[i].salary);
        if (prevval != salarybucket) {
            id = guid();
            groupHeaderFor('salary', salarybucket, id);
            prevval = salarybucket;
            renderEnrichedItems(id, function (x) { return getSalaryBucket(x.salary); }, salarybucket);
        }
    }
    hideEmptyGroups();
}

function getSalaryBucket(salary) {
    if (salary > 250000)
        return '250k+';
    else if (salary > 200000)
        return '200k - 250k';
    else if (salary > 150000)
        return '150k - 200k';
    else if (salary > 100000)
        return '100k - 150k';
    else if (salary > 90000)
        return '90k - 100k';
    else if (salary > 80000)
        return '80k - 90k';
    else if (salary > 70000)
        return '70k - 80k';
    else if (salary > 60000)
        return '60k - 70k';
    else if (salary > 50000)
        return '50k - 60k';
    else if (salary > 40000)
        return '40k - 50k';
    else if (salary > 30000)
        return '30k - 40k';
    else
        return 'Under 30k';
}

function toggleallgroups(toggle) {
    if ($(toggle).html() == '[+]') {
        $('.groupcontent').show();
        $('.grouptoggle').html('[-]');
        $(toggle).html('[-]');
    }
    else {
        $('.groupcontent').hide();
        $('.grouptoggle').html('[+]');
        $(toggle).html('[+]');
    }
}
function togglegroup(toggle) {
    if ($(toggle).html() == '[+]') {
        $('#p' + $(toggle).attr('group')).show();
        $(toggle).html('[-]');
    }
    else {
        $('#p' + $(toggle).attr('group')).hide();
        $(toggle).html('[+]');
    }
}
function groupHeaderFor(grouping, value, id) {
    if (currentgrouping == '') {
        $('#columns').append('<div class="group" id="g' + id + '"><b>' + value + '</b><p id="p' + id + '"></p></div>');
    }
    else {
        $('#columns').append('<div class="group" id="g' + id + '"><b>' + value + '</b><span class="grouptoggle" id="toggle' + id + '" group="' + id + '" onclick="togglegroup(this)" style="cursor: pointer; color: blue;">[+]</span><p class="groupcontent" id="p' + id + '" style="display: ' + (expandprofessiongroups==false?'none':'') + ';"></p></div>');
    }
}

var itemClickPredicate = null;
function itemFor(item, id) {
    if (filtervalue != '') {
        var score = 0;
        if (item.title.toLowerCase().indexOf(filtervalue) >= 0) {
            score++;
        }
        var desc = findbycode(descriptions, item.code);
        if (desc != null) {
            if (desc.description.toLowerCase().indexOf(filtervalue) >= 0) {
                score++;
            }
        }
        if (score == 0) {
            return;
        }
    }

    if (isItemExcluded(item.title)) {
        return;
    }

    //match selected dimensions
    if (dimensions.attitude != '' && (!(item.attitude == '' || item.attitude == dimensions.attitude))) { return; }
    if (dimensions.information != '' && (!(item.information == '' || item.information == dimensions.information))) { return; }
    if (dimensions.processing != '' && (!(item.processing == '' || item.processing == dimensions.processing))) { return; }
    if (dimensions.action != '' && (!(item.action == '' || item.action == dimensions.action))) { return; }
    if (dimensions.endurance != '' && (!(item.endurance == '' || item.endurance == dimensions.endurance))) { return; }
    if (dimensions.presence != '' && (!(item.presence == '' || item.presence == dimensions.presence))) { return; }
    if (dimensions.concentration != '' && (!(item.concentration == '' || item.concentration == dimensions.concentration))) { return; }
    if (dimensions.patterns != '' && (!(item.patterns == '' || item.patterns == dimensions.patterns))) { return; }
    if (dimensions.compensation != '' && (!(item.compensation == '' || item.compensation == dimensions.compensation))) { return; }

    if (importantthings.beauty != '' && item.beauty == '') { return; }
    if (importantthings.helping != '' && item.helping == '') { return; }
    if (importantthings.adventure != '' && item.adventure == '') { return; }
    if (importantthings.safety != '' && item.safety == '') { return; }
    if (importantthings.people != '' && item.people == '') { return; }
    if (importantthings.science != '' && item.science == '') { return; }
    if (importantthings.easy != '' && item.easy == '') { return; }
    if (importantthings.duty != '' && item.duty == '') { return; }
    if (importantthings.admiration != '' && item.admiration == '') { return; }
    if (importantthings.creativity != '' && item.creativity == '') { return; }
    if (importantthings.competition != '' && item.competition == '') { return; }
    if (importantthings.animals != '' && item.animals == '') { return; }
    if (importantthings.politics != '' && item.politics == '') { return; }
    if (importantthings.technology != '' && item.technology == '') { return; }
    if (importantthings.machinery != '' && item.machinery == '') { return; }
    if (importantthings.gender != '' && item.gender == '') { return; }
    if (importantthings.handlabor != '' && item.handlabor == '') { return; }
    if (importantthings.heavyequipment != '' && item.heavyequipment == '') { return; }
    if (importantthings.strength != '' && item.strength == '') { return; }
    if (importantthings.drafting != '' && item.drafting == '') { return; }
    if (importantthings.coordinating != '' && item.coordinating == '') { return; }
    if (importantthings.quickthinking != '' && item.quickthinking == '') { return; }
    if (importantthings.numbers != '' && item.numbers == '') { return; }
    if (importantthings.critical != '' && item.critical == '') { return; }
    if (importantthings.smart != '' && item.smart == '') { return; }
    if (importantthings.salesy != '' && item.salesy == '') { return; }



    if (!itemshoulddisplay(item)) {
        return;
    }

    var itemapproved = isapproved(item.title);
    var approvedicon = '<img style="height: 20px; margin-top: -5px" src="/content/images/kiosk/check.png">';


    var itemguid = guid();

    var additionallinkshtml = '';
    if (additionallinks != null) {
        for (var i = 0; i < additionallinks.length; i++) {
            additionallinkshtml += '<a style="color:red" href="javascript:additionallinks['+i+'].onclick(\'' + item.title.replace(/\'/g, '\\\'') + '\', \'' + filtervalue + '\',\'' + itemguid + '\');">' +
            additionallinks[i].linktext + '</a>';
            if (i < additionallinks.length - 1) {
                additionallinkshtml += ' | ';
            }
        }
        additionallinkshtml = '<span id="' + itemguid + 'links">' + additionallinkshtml + '</span>';
    }

    var itemclickhtml = '';
    if (itemClickPredicate != null) {
        itemclickhtml += 'javascript:itemClickPredicate(\'' + item.title.replace(/\'/g, '\\\'') + '\', \'' + filtervalue + '\',\'' + itemguid + '\');';
    }

    $('#p' + id).append('<div style="' + (itemapproved ? 'color: rgb(0,128,0); font-weight: bold; background-color: rgba(0,255,0,0.1)' : '') + '"><div class="count">' + item.predecessors + '</div><div class="count">' + item.similars + '</div><div class="count">' + item.progressions + '</div> <span><a id="' + itemguid + '" href="' + itemclickhtml + '" onmouseover="showpopupdescription(event, \'' + item.code + '\')" onmouseout="hidepopupdescription(event)" style="' + (seedtitle == item.title ? 'font-weight:bold; color:red;' : '') + '" >' + item.title.replace(new RegExp(filtervalue, "i"), '<span style="background-color: yellow">' + filtervalue + '</span>') + '</a> ' + getdata(item.title) + '</span> ' + (itemapproved ? approvedicon : '') + ' ' + (item.keywordmatches > 0 ? '<span style="background-color:rgb(255,255,0); padding: 0 5px 0 5px;">' + item.keywordmatches + '</span>' : '') + ' ' + additionallinkshtml + '</div>');
    if (seedtitle == item.title) {
        $('#g' + id).css('background-color', 'rgba(0,255,0,0.1)');
        $('#g' + id).prependTo('#columns');
        $('#p' + id).show();
        $('#toggle' + id).html('[-]');
    }
}

function isItemExcluded(title) {
   
    for (var i = 0; i < excludeditems.length; i++) {
        if (excludeditems[i] == title) {
            return true;
        }
    }
    return false;
}

function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
             .toString(16)
             .substring(1);
};

function guid() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
         s4() + '-' + s4() + s4() + s4();
}

var internalsortorder = '';
var currentgrouping = '';
function setinternalsortorder(order) {
    internalsortorder = order;
    rerenderData();
}
function rerenderData() {
    switch (currentgrouping) {
        case 'major':
            groupbymajor();
            break;
        case 'minor':
            groupbyminor();
            break;
        case 'minedulevel':
            groupbyminedulevel();
            break;
        case 'explevel':
            groupbyexplevel();
            break;
        case 'training':
            groupbytraining();
            break;
        case 'salary':
            groupbysalary();
            break;
        default:
            groupbyrelateditems();
            break;
    }
}

function hideEmptyGroups() {
    var groups = $('.group');
    for (var i = 0; i < groups.length; i++) {
        if ($(groups[i]).find("p").html().length == 0) {
            $(groups[i]).hide();
        }
    }
}

function findbytitle(list, name) {
    for (var i = 0; i < list.length; i++) {
        if ($.trim(list[i].title).toLowerCase() == $.trim(name).toLowerCase())
            return list[i];
    }
    return null;
}

var filtervalue = '';
function applyFilter() {
    filtervalue = $('#searchbox').val().toLowerCase();
    rerenderData();
    $('#allgrouptoggle').html('[+]');
    toggleallgroups($('#allgrouptoggle'));
}


//Popup description
var popupdescriptioncreated = false;
var displayedcode = '';
function showpopupdescription(event, code) {
    if (!popupdescriptioncreated) {

        $('#' + parentcontainerid).append('<div id="popupdescription" style="position: fixed; z-index: 99999; background-color: rgba(255,255,220,1);" class="popup">Hello!</div>');
        popupdescriptioncreated = true;
    }
    if (displayedcode != code) {
        //process code
        var desc = findbycode(descriptions, code);
        if (desc != null) {

            $('#popupdescription').html(desc.description);
            var matchedwords = matchDescriptionKeywords(seeddescription, desc.description, 'popupdescription', 'descriptioncontainer');
        }
        displayedcode = code;
    }

    var x = event.clientX;
    var y = event.clientY;

    $('#popupdescription').css('width', document.documentElement.clientWidth * 0.75);
    $('#popupdescription').css('left', Math.min(Math.max(x - $('#popupdescription').outerWidth() / 2, 40), document.documentElement.clientWidth - $('#popupdescription').outerWidth() - 40));
    $('#popupdescription').css('top', y - $('#popupdescription').outerHeight() - 20);
    $('#popupdescription').show();
}
function hidepopupdescription(event) {
    $('#descriptioncontainer').html(seeddescription);
    $('#popupdescription').hide();
    event.preventDefault();
}

function matchDescriptionKeywords(desc1, desc2, previewcontainerid1, previewcontainerid2) {
    var matchcount = 0;
    var seedtokens = desc1.split(' ');

    for (var i = 0; i < seedtokens.length; i++) {
        var kw = seedtokens[i].replace(/(\(|\)|\.|\;|\,|\?|\!\bthe\b|\ba\b|\bof\b|\bas\b|\bto\b|\band\b|\bare\b|\bis\b|\bhave\b|\bgot\b|\bget\b|\byou\b|\bour\b|\byour\b|\bbe\b|\bby\b|\bcan\b|\bmay\b|\bwill\b|\bin\b|\bwhile\b|\bwhen\b|\bwhy\b|\bwith\b|\bor\b|\balso\b|\binto\b|\ban\b|\bthen\b|\bthan\b|\bany\b|\bjob\b|\bfor\b|\ball\b|\bthis\b|\bsuch\b|\bwho\b|\bmust\b|\bboth\b|\bwant\b|\bthat\b|\bnew\b|\byork\b|\bexperience\b|\blooking\b|\bwork\b|\bjoin\b|\bseeking\b|\byears\b|\btheir\b|\bnot\b|\bcall\b|\brequired\b|\employer\b|\bour\b|\bits\b|\bllp\b|\bwhich\b|\baren't\b|\binc\b|\btop\b|\bgpa\b|\bfrom\b|\babout\b|\bplease\b|\bsees\b|\bhas\b|\bposition\b|\bseeks\b|\bbecome\b|\bper\b|\bfull\b|\bout\b|\bwe\b|\bthrough\b|\bhow\b|\bbased\b|\bskills\b|\bprovide\b|\bdescription\b|\bon\b|\brole\b|\bother\b|\bability\b|\bensure\b|\bstrong\b|\bproviding\b|\bsupporting\b|\bassigned\b|\bworking\b|\bincluding\b|\bcommitted\b|\bapply\b|\bnow\b|\benjoy\b|\bup\b|\bno\b|\bavailable\b|\bat\b|\bwww\b|\bcom\b|\bvisit\b|\bmore\b|\blearn\b|\bresponsible\b|\includes\b|\excludes\b)/gi, '');
        if (kw.length >= 2) {
            var wholekw = '\\b' + kw + '\\b';
            
            if ((new RegExp(wholekw)).test(desc2)) {
                if (previewcontainerid1 != null) {
                    $('#' + previewcontainerid1).html($('#' + previewcontainerid1).html().replace(new RegExp(wholekw, "ig"), '<span style="background-color: yellow;">' + kw + '</span>'));
                }
                if (previewcontainerid2 != null) {
                    $('#' + previewcontainerid2).html($('#' + previewcontainerid2).html().replace(new RegExp(wholekw, "ig"), '<span style="background-color: yellow;">' + kw + '</span>'));
                }
                matchcount++;
            }
        }
    }
    return matchcount;
}