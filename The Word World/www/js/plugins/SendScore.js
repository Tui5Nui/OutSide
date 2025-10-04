var playerName = $gameActors.actor(1).name();
var score = $gameVariables.value(1);
var stage = $gameVariables.value(2);

var url = "https://script.google.com/macros/s/AKfycbzhxVnk6_EUZT-KYJ_na4sRZav46WKfxGLcu45DqRgF2JGTdfD5AJJ5yixIySsaK4wd/exec"; // URL จาก Apps Script

var data = {
  "name": playerName,
  "score": score,
  "stage": stage
};

var xhr = new XMLHttpRequest();
xhr.open("POST", url);
xhr.setRequestHeader("Content-Type", "application/json");
xhr.send(JSON.stringify(data));
