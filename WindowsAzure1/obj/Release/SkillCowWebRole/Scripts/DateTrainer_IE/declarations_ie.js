var theplayer = null;

var loopplayer = null;
var loopaudio = null;
var panplayer = null;
var panaudio = null;

var VIDEOS_TO_LOAD = 0;
var EXTRA_VIDEOS_TO_LOAD = 0;
var TOTAL_VIDEO_PLAYERS_LOADED = 0;

var QUEUED_VIDEOS = 0;
var READY_VIDEOS = 0;

var firstquestionplayed = false;
var playingFileArrayIndex = -1;
var playingFileIndex = '';
var playingFileControlId = '';
var answerpressed = false;
var answerplaying = false;
var clipplaying = false;
var answerFileIndex = '';
var answerFileArrayIndex = -1;
var loop1timer, loop2timer, transitionToLoopTimer, nextQuestionTimer;

var clips = new Array();

var zindex = 10000;

var curindex = 0;
var currentlanguage = '';
var videoquality = '';

var videosInPlayer = new Array();
