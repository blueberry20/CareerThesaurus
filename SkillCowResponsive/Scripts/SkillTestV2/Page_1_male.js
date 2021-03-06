﻿var parameters = {
	dimension: 'attitude',
	gender: 'male',
	text: 'In the workplace, do you consider yourself an <span onmouseover="highlightPerson(\'Extrovert\')" onmouseout="removeHighlight(\'Extrovert\')" onclick="selectPerson(\'Extrovert\', true);">extrovert <span class="highlitedText">(very social)</span></span> or an <span onmouseover="highlightPerson(\'Introvert\')" onmouseout="removeHighlight(\'Introvert\')" onclick="selectPerson(\'Introvert\', true);">introvert (like to <span class="highlitedText">spend time alone</span>)</span>?',
	leftPersonTag: 'Extrovert',
	leftTooltip: "I'm an Extrovert and I like to be a center of attention",
	leftTooltipX: 900,
	leftTooltipY: 695,
	rightPersonTag: 'Introvert',
	rightTooltip: "I'm an Introvert",
	rightTooltipX: 1383,
	rightTooltipY: 935,
	left_1_PersonTag: 'left_1',
	left_1_Tooltip: "I'm an Extrovert",
	left_1_TooltipX: 816,
	left_1_TooltipY: 700,
	right_1_PersonTag: 'right_1',
	right_1_Tooltip: "I'm an Introvert, but I like to socialize",
	right_1_TooltipX: 1185,
	right_1_TooltipY: 695,
	center_1_PersonTag: 'center_1',
	center_1_Tooltip: "I'm an Extrovert",
	center_1_TooltipX: 1004,
	center_1_TooltipY: 696,	
	leftMap: [889,709,877,726,886,750,889,770,883,783,858,797,853,798,847,812,835,826,837,850,828,869,834,883,835,907,841,914,855,915,846,930,856,935,857,947,858,956,850,984,857,1007,853,1053,857,1064,855,1102,858,1128,861,1145,860,1204,866,1285,894,1294,908,1292,894,1280,886,1268,883,1237,886,1215,888,1198,894,1180,896,1157,899,1113,906,1075,909,1057,920,1023,925,1063,926,1097,930,1123,928,1183,928,1232,924,1271,928,1282,952,1286,973,1285,955,1274,950,1253,951,1216,951,1178,954,1157,954,1121,957,1095,960,1063,960,1021,963,1005,962,990,966,963,962,949,964,946,961,933,964,923,956,909,953,893,955,882,957,868,962,882,971,882,975,891,986,896,1009,864,1007,851,1011,833,1011,816,1011,802,1012,796,1001,786,999,787,1000,798,1001,804,1002,829,998,830,978,862,962,818,955,810,956,798,944,790,936,784,927,779,921,768,917,766,922,760,925,738,922,727,924,724,917,712,905,708,898,704],
	rightMap: [1362, 955, 1361, 976, 1357, 984, 1361, 992, 1363, 1006, 1367, 1016, 1364, 1028, 1356, 1038, 1351, 1039, 1332, 1045, 1306, 1047, 1282, 1082, 1278, 1090, 1256, 1101, 1244, 1123, 1232, 1129, 1227, 1131, 1215, 1152, 1198, 1158, 1176, 1171, 1175, 1178, 1180, 1192, 1200, 1195, 1212, 1217, 1219, 1220, 1202, 1236, 1213, 1254, 1231, 1260, 1246, 1264, 1245, 1294, 1242, 1328, 1242, 1358, 1244, 1379, 1251, 1408, 1262, 1410, 1262, 1421, 1253, 1431, 1237, 1447, 1248, 1447, 1271, 1430, 1271, 1418, 1271, 1411, 1282, 1411, 1280, 1398, 1283, 1350, 1288, 1311, 1285, 1300, 1305, 1299, 1327, 1293, 1338, 1288, 1345, 1282, 1341, 1299, 1358, 1287, 1368, 1262, 1370, 1250, 1363, 1247, 1362, 1245, 1379, 1234, 1399, 1232, 1426, 1239, 1446, 1259, 1458, 1271, 1459, 1241, 1457, 1219, 1453, 1203, 1473, 1185, 1467, 1104, 1455, 1088, 1453, 1080, 1457, 1071, 1439, 1066, 1427, 1052, 1417, 1047, 1405, 1042, 1400, 1030, 1396, 1028, 1395, 1015, 1400, 1009, 1404, 991, 1410, 981, 1405, 977, 1408, 954, 1389, 943, 1369, 949],
	leftMap_1: [826, 710, 816, 714, 803, 715, 794, 727, 797, 742, 802, 757, 801, 772, 797, 780, 779, 788, 761, 792, 752, 812, 749, 829, 735, 842, 736, 864, 732, 885, 740, 898, 747, 930, 760, 958, 762, 1006, 763, 1043, 767, 1082, 763, 1111, 762, 1152, 763, 1190, 752, 1241, 762, 1245, 748, 1272, 770, 1259, 784, 1246, 791, 1170, 798, 1123, 804, 1097, 808, 1035, 816, 1067, 814, 1084, 819, 1119, 817, 1134, 818, 1167, 820, 1210, 812, 1224, 819, 1227, 820, 1240, 872, 1239, 844, 1228, 852, 1223, 846, 1206, 850, 1202, 845, 1190, 845, 1133, 846, 1090, 851, 1030, 852, 1009, 854, 965, 855, 940, 851, 931, 843, 883, 846, 829, 836, 802, 837, 795, 824, 779, 826, 767, 830, 759, 834, 740, 835, 735, 834, 723, 835, 715],
	rightMap_1: [1195, 705, 1186, 707, 1178, 707, 1168, 715, 1161, 738, 1162, 764, 1165, 779, 1158, 780, 1158, 790, 1138, 794, 1131, 813, 1128, 836, 1118, 869, 1110, 879, 1109, 889, 1109, 900, 1111, 927, 1116, 951, 1109, 971, 1110, 985, 1108, 1010, 1114, 1034, 1112, 1084, 1114, 1138, 1120, 1189, 1127, 1238, 1131, 1267, 1131, 1287, 1107, 1296, 1152, 1300, 1160, 1292, 1149, 1232, 1147, 1185, 1151, 1143, 1153, 1117, 1164, 1156, 1166, 1182, 1171, 1227, 1175, 1267, 1177, 1291, 1158, 1298, 1151, 1304, 1196, 1303, 1194, 1226, 1181, 1215, 1180, 1189, 1175, 1169, 1194, 1161, 1197, 1134, 1201, 1077, 1203, 1029, 1206, 990, 1205, 955, 1204, 927, 1208, 922, 1214, 920, 1211, 899, 1216, 893, 1215, 853, 1214, 839, 1207, 804, 1207, 798, 1199, 797, 1188, 792, 1187, 781, 1183, 781, 1185, 767, 1191, 762, 1202, 756, 1210, 746, 1212, 734, 1207, 721],
	centerMap_1: [1004, 706, 992, 708, 986, 714, 987, 744, 993, 765, 990, 771, 977, 778, 961, 781, 954, 798, 947, 828, 943, 855, 944, 881, 952, 885, 951, 921, 952, 941, 950, 963, 954, 992, 957, 1031, 963, 1068, 967, 1108, 971, 1152, 976, 1200, 976, 1253, 961, 1263, 977, 1267, 994, 1264, 999, 1253, 994, 1211, 993, 1154, 994, 1103, 996, 1069, 999, 1045, 1002, 1025, 1008, 1073, 1010, 1113, 1014, 1154, 1019, 1192, 1025, 1263, 1012, 1274, 1045, 1272, 1049, 1258, 1046, 1201, 1044, 1174, 1036, 1165, 1035, 1103, 1035, 1074, 1036, 1042, 1039, 1001, 1042, 953, 1048, 929, 1048, 895, 1055, 873, 1050, 844, 1039, 824, 1046, 806, 1053, 788, 1032, 783, 1020, 772, 1010, 769, 1017, 752, 1024, 740, 1022, 714]
}

// additional resizing
function constractorQuestion_1() {
    var url = imagePath + 1 + '/' + gender + '_';
    $('.characters').append('<img class="left_1 img" id="' + parameters.left_1_PersonTag + '" data-tooltip="' + parameters.left_1_Tooltip + '" data-positionx="' + parameters.left_1_TooltipX + '" data-positiony="' + parameters.left_1_TooltipY + '" src="' + url + 'left_1.png" />').
                     append('<img class="right_1 img" id="' + parameters.right_1_PersonTag + '" data-tooltip="' + parameters.right_1_Tooltip + '" data-positionx="' + parameters.right_1_TooltipX + '" data-positiony="' + parameters.right_1_TooltipY + '" src="' + url + 'right_1.png" />');
    if (gender == 'male') {
        $('.characters').append('<img class="center_1 img" id="' + parameters.center_1_PersonTag + '" data-tooltip="' + parameters.center_1_Tooltip + '" data-positionx="' + parameters.center_1_TooltipX + '" data-positiony="' + parameters.center_1_TooltipY + '" src="' + url + 'center_1.png" />');
    }
}

function resizeMappingQuestion_1() {
    $('#leftMap_1, #rightMap_1, #centerMap_1').remove();
    var left_1 = [],
        right_1 = [],
        center_1 = [];

    if (($('#background').width() !== 1920) || ($('#background').height() !== 1920)) {
        var scallingRatio = $('#background').width() / 1920;
        for (var i = 0; i < parameters.leftMap_1.length; i++) {
            if (i % 2 == 0) {
                left_1.push(parameters.leftMap_1[i] * scallingRatio);
            } else {
                left_1.push(parameters.leftMap_1[i] * scallingRatio);
            }
        }
        for (var i = 0; i < parameters.rightMap_1.length; i++) {
            if (i % 2 == 0) {
                right_1.push(parameters.rightMap_1[i] * scallingRatio);
            } else {
                right_1.push(parameters.rightMap_1[i] * scallingRatio);
            }
        }
        if (gender == 'male') {
            for (var i = 0; i < parameters.centerMap_1.length; i++) {
                if (i % 2 == 0) {
                    center_1.push(parameters.centerMap_1[i] * scallingRatio);
                } else {
                    center_1.push(parameters.centerMap_1[i] * scallingRatio);
                }
            }
        }
    } else {
        left_1 = parameters.leftMap_1;
        right_1 = parameters.rightMap_1;
        if (gender == 'male') {
            center_1 = parameters.centerMap_1;
        }
    }
    $('map').append('<area id="leftMap_1" href="#" shape="poly" coords="' + left_1.join() + '" alt="' + parameters.left_1_PersonTag + '" onfocus="navigator.systemLanguage  != null ? blur() : null" onmouseover="highlightPerson(this.alt)" onmouseout="removeHighlight(this.alt)" onclick="selectPerson(this.alt, true)"/>').
             append('<area id="rightMap_1" href="#" shape="poly" coords="' + right_1.join() + '" alt="' + parameters.right_1_PersonTag + '" onfocus="navigator.systemLanguage  != null ? blur() : null" onmouseover="highlightPerson(this.alt)" onmouseout="removeHighlight(this.alt)" onclick="selectPerson(this.alt, true)"/>');
    if (gender == 'male') {
        $('map').append('<area id="centerMap_1" href="#" shape="poly" coords="' + center_1.join() + '" alt="' + parameters.center_1_PersonTag + '" onfocus="navigator.systemLanguage  != null ? blur() : null" onmouseover="highlightPerson(this.alt)" onmouseout="removeHighlight(this.alt)" onclick="selectPerson(this.alt, true)"/>');
    }
}

