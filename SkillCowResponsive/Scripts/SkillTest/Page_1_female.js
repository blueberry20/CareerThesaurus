﻿var parameters = {
	dimension: 'attitude',
	gender: 'female',
	text: 'In the workplace, do you consider yourself an <span onmouseover="highlightPerson(\'Extrovert\')" onmouseout="removeHighlight(\'Extrovert\')" onclick="selectPerson(\'Extrovert\', true);">extrovert <span class="highlitedText">(very social)</span></span> or an <span onmouseover="highlightPerson(\'Introvert\')" onmouseout="removeHighlight(\'Introvert\')" onclick="selectPerson(\'Introvert\', true);">introvert (like to <span class="highlitedText">spend time alone</span>)</span>?',
	leftPersonTag: 'Extrovert',
	leftTooltip: "I'm an Extrovert and I like to be a center of attention",
	leftTooltipX: 915,
	leftTooltipY: 714,
	rightPersonTag: 'Introvert',
	rightTooltip: "I'm an Introvert",
	rightTooltipX: 552,
	rightTooltipY: 958,
	left_1_PersonTag: 'left_1',
	left_1_Tooltip: "I'm an Extrovert",
	left_1_TooltipX: 710,
	left_1_TooltipY: 716,
	right_1_PersonTag: 'right_1',
	right_1_Tooltip: "I'm an Introvert but I like to socialize",
	right_1_TooltipX: 1075,
	right_1_TooltipY: 702,
	leftMap: [919, 724, 906, 726, 890, 747, 886, 760, 884, 776, 876, 794, 879, 800, 876, 802, 880, 810, 888, 810, 870, 822, 860, 864, 856, 881, 856, 901, 852, 906, 844, 895, 830, 876, 813, 845, 806, 838, 804, 837, 803, 842, 794, 834, 788, 836, 787, 843, 790, 849, 802, 851, 812, 850, 828, 893, 839, 914, 855, 926, 851, 953, 846, 991, 846, 1020, 850, 1046, 855, 1068, 865, 1106, 870, 1108, 879, 1136, 878, 1152, 879, 1262, 870, 1285, 856, 1296, 870, 1296, 879, 1281, 880, 1292, 888, 1276, 886, 1269, 884, 1261, 894, 1182, 891, 1147, 884, 1131, 891, 1105, 900, 1106, 908, 1134, 902, 1164, 902, 1204, 902, 1224, 902, 1268, 898, 1275, 900, 1290, 910, 1300, 920, 1304, 910, 1290, 907, 1274, 906, 1265, 916, 1197, 918, 1156, 914, 1136, 924, 1107, 932, 1107, 925, 1065, 925, 1026, 934, 972, 932, 953, 927, 934, 932, 932, 928, 913, 932, 899, 944, 884, 944, 898, 947, 914, 946, 926, 952, 929, 966, 921, 978, 899, 1000, 854, 1021, 848, 1024, 839, 1022, 836, 1020, 834, 1014, 835, 1008, 840, 998, 848, 963, 898, 966, 859, 965, 833, 958, 830, 968, 824, 970, 820, 970, 814, 966, 806, 952, 790, 948, 775, 947, 755, 942, 736, 931, 728],
	rightMap: [552, 968, 544, 972, 538, 976, 530, 984, 523, 991, 512, 996, 511, 1002, 510, 1008, 504, 1015, 508, 1024, 504, 1034, 505, 1046, 514, 1067, 523, 1067, 524, 1087, 518, 1099, 500, 1118, 482, 1132, 470, 1153, 464, 1172, 468, 1201, 460, 1224, 461, 1242, 471, 1266, 478, 1282, 483, 1281, 486, 1278, 490, 1288, 496, 1284, 502, 1292, 508, 1278, 517, 1268, 526, 1280, 525, 1288, 532, 1294, 530, 1300, 561, 1318, 584, 1319, 622, 1307, 644, 1294, 664, 1274, 664, 1310, 670, 1341, 675, 1365, 678, 1389, 677, 1406, 673, 1413, 680, 1431, 683, 1423, 691, 1440, 708, 1444, 709, 1439, 701, 1431, 713, 1432, 706, 1412, 700, 1404, 695, 1384, 696, 1358, 702, 1316, 710, 1287, 720, 1258, 724, 1225, 726, 1212, 719, 1200, 716, 1199, 710, 1204, 702, 1198, 682, 1199, 658, 1202, 630, 1208, 629, 1184, 626, 1162, 618, 1122, 620, 1112, 614, 1104, 611, 1102, 602, 1108, 584, 1116, 558, 1100, 551, 1091, 549, 1080, 553, 1066, 560, 1057, 564, 1049, 571, 1044, 573, 1038, 578, 1029, 578, 1022, 577, 1012, 574, 1003, 570, 994, 568, 985, 562, 982, 558, 971],
	leftMap_1: [693, 726, 682, 735, 674, 764, 673, 780, 683, 811, 682, 825, 692, 821, 688, 843, 685, 865, 690, 890, 703, 923, 704, 937, 695, 969, 686, 1012, 686, 1038, 697, 1070, 699, 1097, 696, 1126, 691, 1153, 681, 1169, 692, 1175, 703, 1182, 714, 1177, 711, 1200, 711, 1228, 717, 1262, 723, 1290, 718, 1297, 720, 1313, 726, 1305, 731, 1316, 743, 1318, 734, 1305, 728, 1292, 728, 1272, 735, 1227, 741, 1253, 740, 1280, 744, 1293, 747, 1286, 756, 1299, 769, 1299, 762, 1292, 755, 1286, 753, 1278, 749, 1275, 746, 1251, 752, 1226, 758, 1171, 759, 1162, 766, 1164, 779, 1149, 767, 1122, 756, 1097, 756, 1060, 758, 1023, 758, 987, 755, 954, 747, 927, 748, 904, 743, 883, 738, 872, 738, 866, 746, 850, 743, 840, 733, 834, 728, 826, 728, 814, 740, 812, 736, 800, 732, 796, 734, 785, 737, 779, 734, 760, 739, 758, 734, 753, 734, 740, 737, 728, 730, 725, 722, 723, 707, 730],
	rightMap_1: [1075, 712, 1058, 721, 1048, 740, 1047, 758, 1051, 775, 1063, 783, 1055, 787, 1048, 791, 1038, 804, 1036, 818, 1036, 856, 1037, 881, 1048, 929, 1039, 959, 1037, 999, 1034, 1044, 1035, 1092, 1035, 1125, 1032, 1167, 1038, 1176, 1052, 1176, 1057, 1222, 1058, 1270, 1054, 1283, 1042, 1300, 1062, 1289, 1066, 1275, 1064, 1267, 1065, 1238, 1072, 1202, 1073, 1180, 1080, 1178, 1079, 1210, 1082, 1245, 1085, 1276, 1073, 1300, 1087, 1293, 1092, 1279, 1088, 1262, 1089, 1243, 1097, 1208, 1103, 1188, 1104, 1176, 1113, 1170, 1108, 1129, 1109, 1092, 1108, 1062, 1107, 1017, 1109, 964, 1106, 941, 1098, 919, 1095, 900, 1100, 887, 1108, 857, 1110, 837, 1114, 831, 1119, 816, 1117, 805, 1105, 797, 1086, 782, 1101, 766, 1105, 744, 1098, 724, 1088, 714]
}

// additional resizing

function constractorQuestion_1() {
    var url = imagePath + 1 + '/' + gender + '_';
    $('.characters').append('<img class="left_1" id="left_1" data-tooltip="' + parameters.left_1_Tooltip + '" data-positionx="' + parameters.left_1_TooltipX + '" data-positiony="' + parameters.left_1_TooltipY + '" src="' + url + 'left_1.png" />').
                     append('<img class="right_1" id="right_1" data-tooltip="' + parameters.right_1_Tooltip + '" data-positionx="' + parameters.right_1_TooltipX + '" data-positiony="' + parameters.right_1_TooltipY + '" src="' + url + 'right_1.png" />');
    if (gender == 'male') {
        $('.characters').append('<img class="center_1" id="center_1" data-tooltip="' + parameters.center_1_Tooltip + '" data-positionx="' + parameters.center_1_TooltipX + '" data-positiony="' + parameters.center_1_TooltipY + '" src="' + url + 'center_1.png" />');
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
             append('<area id="rightMap_1" href="#" shape="poly" coords="' + right_1.join() + '" alt="' + parameters.right_1_PersonTag + '" onfocus="navigator.appName == "navigator.systemLanguage  != null ? blur() : null" onmouseover="highlightPerson(this.alt)" onmouseout="removeHighlight(this.alt)" onclick="selectPerson(this.alt, true)"/>');
    if (gender == 'male') {
        $('map').append('<area id="centerMap_1" href="#" shape="poly" coords="' + center_1.join() + '" alt="' + parameters.center_1_PersonTag + '" onfocus="navigator.systemLanguage  != null ? blur() : null" onmouseover="highlightPerson(this.alt)" onmouseout="removeHighlight(this.alt)" onclick="selectPerson(this.alt, true)"/>');
    }
}