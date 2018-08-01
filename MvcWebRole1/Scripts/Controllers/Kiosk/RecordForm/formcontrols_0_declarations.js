var requiredfields = [
    "zip",
    "firstname",
    "lastname",
    "email",
    "address1",
    "phone",
    "military",
    "gpa"
    ];

var states = [
{ "value": "AL", "label": "Alabama" },
{ "value": "AK", "label": "Alaska" },
{ "value": "AZ", "label": "Arizona" },
{ "value": "AR", "label": "Arkansas" },
{ "value": "CA", "label": "California" },
{ "value": "CO", "label": "Colorado" },
{ "value": "CT", "label": "Connecticut" },
{ "value": "DE", "label": "Delaware" },
{ "value": "DC", "label": "District of Columbia" },
{ "value": "FL", "label": "Florida" },
{ "value": "GA", "label": "Georgia" },
{ "value": "HI", "label": "Hawaii" },
{ "value": "ID", "label": "Idaho" },
{ "value": "IL", "label": "Illinois" },
{ "value": "IN", "label": "Indiana" },
{ "value": "IA", "label": "Iowa" },
{ "value": "KS", "label": "Kansas" },
{ "value": "KY", "label": "Kentucky" },
{ "value": "LA", "label": "Louisiana" },
{ "value": "ME", "label": "Maine" },
{ "value": "MD", "label": "Maryland" },
{ "value": "MA", "label": "Massachusetts" },
{ "value": "MI", "label": "Michigan" },
{ "value": "MN", "label": "Minnesota" },
{ "value": "MS", "label": "Mississippi" },
{ "value": "MO", "label": "Missouri" },
{ "value": "MT", "label": "Montana" },
{ "value": "NE", "label": "Nebraska" },
{ "value": "NV", "label": "Nevada" },
{ "value": "NH", "label": "New Hampshire" },
{ "value": "NJ", "label": "New Jersey" },
{ "value": "NM", "label": "New Mexico" },
{ "value": "NY", "label": "New York" },
{ "value": "NC", "label": "North Carolina" },
{ "value": "ND", "label": "North Dakota" },
{ "value": "OH", "label": "Ohio" },
{ "value": "OK", "label": "Oklahoma" },
{ "value": "OR", "label": "Oregon" },
{ "value": "PA", "label": "Pennsylvania" },
{ "value": "RI", "label": "Rhode Island" },
{ "value": "SC", "label": "South Carolina" },
{ "value": "SD", "label": "South Dakota" },
{ "value": "TN", "label": "Tennessee" },
{ "value": "TX", "label": "Texas" },
{ "value": "UT", "label": "Utah" },
{ "value": "VT", "label": "Vermont" },
{ "value": "VA", "label": "Virginia" },
{ "value": "WA", "label": "Washington" },
{ "value": "WV", "label": "West Virginia" },
{ "value": "WI", "label": "Wisconsin" },
{ "value": "WY", "label": "Wyoming" },
{ "value": "OT", "label": "other" }
];

var levelsofeducation = [
{ "value": "None", "label": "None" },
{ "value": "INHS", "label": "Still In High School" },
{ "value": "GED", "label": "GED" },
{ "value": "HS", "label": "High School Diploma" },
{ "value": "CRT", "label": "Certificate" },
{ "value": "SC", "label": "Some College" },
{ "value": "AS", "label": "Associates Degree" },
{ "value": "BS", "label": "Bachelor's Degree" },
{ "value": "MS", "label": "Master's Degree" },
{ "value": "DOC", "label": "Doctoral Degree" }
];


var militaryoptions = [
{"value": "None", "label": "Not affiliated with the Military" },
{"value": "AD", "label": "Active Duty (AD)" },
{"value": "SR", "label": "Selective Reserve (SR)" },
{"value": "GD", "label": "Guard" },
{"value": "SP", "label": "Spouse / Dependant" },
{"value": "VT", "label": "Veteran" },
{"value": "CV", "label": "Civilian" },
{"value": "RT", "label": "Retiree" },
{"value": "IA", "label": "Inactive" }
];

var salutationoptions = [
{ "value": "MR", "label": "Mr." },
{ "value": "MS", "label": "Ms." },
{ "value": "MRS", "label": "Mrs." }
];

var schoolforms = new Array();
var totalschoolforms = 0;
var customform = null;
var addedrecordfieldnames = new Array();

function recordFieldAlreadyAdded(name) {
    for (var i = 0; i < addedrecordfieldnames.length; i++) {
        if ($.trim(addedrecordfieldnames[i].toLowerCase()) == $.trim(name.toLowerCase())) {
            return true;
        }

    }
    return false;
}

