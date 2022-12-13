function GetGameStorage(gameStorageName) {

    var gameStorageStr = localStorage.getItem(gameStorageName);
    var gameStorageObj = gameStorageStr ? jQuery.parseJSON(gameStorageStr) : undefined;

    // save game storeage to local storage, it does not exist
    if (gameStorageObj == undefined) {  // 1st time ?
        gameStorageObj = new Object();
        gameStorageObj.version = 1.0;
        gameStorageObj.sessions = new Array();
        gameStorageStr = JSON.stringify(gameStorageObj);
        localStorage.setItem(gameStorageName, gameStorageStr);
    }
    return gameStorageObj;
}


var gameTimer;
var audioBeep = new Audio('images/beep.wav');
var audioGameOver = new Audio('images/gameover.wav')


$(document).ready(function () {

    // Timer countdown to a game start
    $.fn.StartGameTimer = function (TimeInMinutes, Callback) {
        var Start = new Date().getTime();
        var end = new Date().getTime();
        var time = end - Start;
        var timeDiv = this;

        StopGameTimer();
        gameTimer = setInterval(function () {
            if (time > ((TimeInMinutes * 60) * 1000)) { // time to return to parent , game over?
                StopGameTimer()
                audioGameOver.play();
                Callback();
            }
            else {
                end = new Date().getTime();
                time = end - Start;
            }

            var timeDiff = (((TimeInMinutes * 60) * 1000) - time) / 1000;    // in seconds
            var minutes = Math.floor(timeDiff / 60);
            var seconds = (timeDiff % 60).toFixed(0);
            if (minutes < 0)
                minutes = 0;
            if (seconds < 0)
                seconds = 0;
            if (seconds == 60)
                seconds = 59;
            seconds = Math.abs(seconds);

            minutes = pad(minutes, 2);
            seconds = pad(seconds, 2);

            var timeLeft = minutes + ':' + seconds;
            timeDiv.text(timeLeft);
            if (parseInt(minutes) == 0) {
                if (parseInt(seconds) <= 5)
                    audioBeep.play();
            }
        }, 1000);  // 1 second intervals

        return gameTimer;
    }


    // * arcade like point display, increments the value by 1 real fast with sound..

    $.fn.ShowDynamicValue = function (FinalValue, Callback) {

        var startValue = 0;
        var $div = $(this);
        $div.text(startValue);

        var valTimer = setInterval(function () {
            if (startValue >= FinalValue) {
                clearInterval(valTimer);
                Callback();
                return false;
            }
            $div.text('+' + startValue);
            startValue++;
            
        }, 100);
    }
});

function StopGameTimer() {
    clearInterval(gameTimer);
}

function pad(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
}