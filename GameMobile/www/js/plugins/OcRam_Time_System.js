//-----------------------------------------------------------------------------
// OcRam plugins - OcRam_Core.js        (will be embedded in all of my plugins)
//=============================================================================
/* DO NOT COPY, RESELL OR CLAIM ANY PIECE OF THIS SOFTWARE AS YOUR OWN!     *
 * Copyright(c) 2020, Marko Paakkunainen // mmp_81 (at) hotmail.com         */
"use strict"; var ShaderTilemap = ShaderTilemap || false; var Imported = Imported || {}; var Yanfly = Yanfly || {}; // In case there's no Yanfly plugins in use
if (!Imported.OcRam_Core) { // OcRam_Core has only the functionality which are used widely in all OcRam plugins...
    Game_Interpreter.prototype.event = function () { /* Get Game_Event in event editor like: this.event(); */ return ($gameMap) ? $gameMap.event(this._eventId) : null; };
    Game_Map.prototype.getEventsByName = function (event_name) { /* Get Game_Map events by name */ return this._events.filter(function (ev) { return ev.event().name == event_name; }); };
    Game_Event.prototype.getComments = function () { /* Returns all comments + commandIndex from Game_Event as Array */ if (this._erased || this._pageIndex < 0) return []; var comments = []; var i = 0; this.list().forEach(function (p) { if (p.code == 108) { p.commandIndex = i; comments.push(p); } i++; }); return comments; };
    Game_Event.prototype.getStringComments = function () { /* Returns all comments from Game_Event as String Array */ if (this._erased || this._pageIndex < 0) return []; var comments = []; this.list().filter(function (c) { return c.code == 108; }).forEach(function (p) { p.parameters.forEach(function (s) { comments.push(s); }); }); return comments; };
    ImageManager.loadOcRamBitmap = function (filename, hue) {  /* Load bitmap from ./img/ocram folder */ return this.loadBitmap('img/ocram/', filename, hue, false); };
    Imported.OcRam_Core = true; var OcRam_Core = OcRam_Core || function () { /* OcRam core class */ this.initialize.apply(this, arguments); };
    OcRam_Core.prototype.initialize = function () { /* Initialize OcRam core */ this.name = "OcRam_Core"; this.version = "1.05"; this.twh = [48, 48]; this.twh50 = [24, 24]; this.radian = Math.PI / 180; this._isIndoors = false; this._screenTWidth = Graphics.width / 48; this._screenTHeight = Graphics.height / 48; this.plugins = []; this._menuCalled = false; this.Scene_Map_callMenu = Scene_Map.prototype.callMenu; this.Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded; };
    OcRam_Core.prototype.debug = function () { /* Debug core? console.log("OcRam_Core", arguments); */ };
    OcRam_Core.prototype.getBoolean = function (s) { /* Get 'safe' boolean */ if (!s) return false; s = s.toString().toLowerCase(); return (s == "true" && s != "0") ? true : false; };
    OcRam_Core.prototype.getArray = function (a, b) { /* Get plugin param array */ return a ? eval(a) : b || []; };
    OcRam_Core.prototype.getFloat = function (n) { /* Get float */ return isNaN(n - parseFloat(n)) ? 0 : parseFloat(n); };
    OcRam_Core.prototype.regulateRGBG = function (obj) { /* Regulate RGBG value (used in tints) */ obj.Red = parseInt(obj.Red).clamp(-255, 255); obj.Green = parseInt(obj.Green).clamp(-255, 255); obj.Blue = parseInt(obj.Blue).clamp(-255, 255); obj.Gray = parseInt(obj.Gray).clamp(-255, 255); return obj; };
    OcRam_Core.prototype.regulateHexRGBA = function (p) { /* Regulate HEX RGBA value */ if (p.substr(0, 1) !== "#") p = "#" + p; if (p.length == 7) p = p + "ff"; return /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(p)[0] || "#ffffffff"; }
    OcRam_Core.prototype.getJSON = function (s) { /* Get 'safe' JSON */ try { return JSON.parse(s); } catch (ex) { return null; } };
    OcRam_Core.prototype.getJSONArray = function (a) { /* Get 'safe' JSON Array */ var tmp = []; if (a) { OcRam.getArray(a, []).forEach(function (s) { tmp.push(OcRam.getJSON(s)); }); } return tmp; };
    OcRam_Core.prototype.followers = function () { /* Only a shortcut to $gamePlayer._followers.visibleFollowers(); */ return $gamePlayer ? $gamePlayer._followers.visibleFollowers() : []; };
    OcRam_Core.prototype.setIndoorsFlag = function () { /* Set indoors flag - Each plugin will call this when needed */ if (DataManager.isEventTest()) return; if ($dataMap.meta["indoors"] !== undefined) { this.debug("Indoors meta tag found in MAP note field!", $dataMap.meta); this._isIndoors = true; } else { if ($dataTilesets[$dataMap.tilesetId].meta["indoors"] !== undefined) { this.debug("Indoors meta tag found in TILESET note field!", $dataTilesets[$dataMap.tilesetId].meta); this._isIndoors = true; } else { this.debug("Indoors meta tag was NOT found!", undefined); this._isIndoors = false; } } };
    OcRam_Core.prototype.isIndoors = function () { /* Get indoors flag */ return this._isIndoors; };
    OcRam_Core.prototype.runCE = function (pCE_Id) { /* Run common event */ if ($gameTemp.isCommonEventReserved()) { var tmpId = pCE_Id; var tc = this; setTimeout(function () { tc.runCE(tmpId); }, 17); } else { $gameTemp.reserveCommonEvent(pCE_Id); } };
    OcRam_Core.prototype.extendMethod = function (c, b, cb) { /* Extend/override any method */ c[b] = function () { return cb.apply(this, arguments); }; };
    OcRam_Core.prototype.extendProto = function (c, b, cb) { /* Extend/override any proto */ c.prototype[b] = function () { return cb.apply(this, arguments); }; };
    OcRam_Core.prototype.addPlugin = function (name, version) { /* Initialize new OcRam plugin */ this[name] = {}; var new_plugin = this[name]; Imported["OcRam_" + name] = true; this.plugins.push(name); this[name]._menuCalled = false; new_plugin.name = name; new_plugin.version = version; new_plugin.parameters = PluginManager.parameters("OcRam_" + new_plugin.name); if (this.getBoolean(new_plugin.parameters["Debug mode"])) { new_plugin.debug = function () { var args = [].slice.call(arguments); args.unshift("OcRam_" + new_plugin.name + " (v" + new_plugin.version + ")", ":"); console.log.apply(console, args); }; console.log("OcRam_" + new_plugin.name + " (v" + new_plugin.version + ")", "Debug mode:", "Enabled"); console.log("OcRam_" + new_plugin.name + " (v" + new_plugin.version + ")", "Parameters:", new_plugin.parameters); } else { new_plugin.debug = function () { }; } var oc = this; new_plugin.extend = function (c, b, cb) { var cb_name = c.name + "_" + b; if (c[b]) { this[cb_name] = c[b]; oc.extendMethod(c, b, cb); } else { this[cb_name] = c.prototype[b]; oc.extendProto(c, b, cb); } }; }; var OcRam = new OcRam_Core(); // Create new OcRam_Core! (Below aliases)
    Scene_Map.prototype.callMenu = function () { /* Menu called? */ OcRam.Scene_Map_callMenu.call(this); OcRam.debug("Menu called:", true); OcRam._menuCalled = true; OcRam.plugins.forEach(function (p) { OcRam[p]._menuCalled = true; }); };
    Scene_Map.prototype.onMapLoaded = function () { /* Set and get tile dimensions and indoors flag */ OcRam.Scene_Map_onMapLoaded.call(this); if (!OcRam._menuCalled) { OcRam.twh = [$gameMap.tileWidth(), $gameMap.tileHeight()]; OcRam.twh50 = [OcRam.twh[0] * 0.5, OcRam.twh[1] * 0.5]; OcRam._screenTWidth = Graphics.width / OcRam.twh[0]; OcRam._screenTHeight = Graphics.height / OcRam.twh[1]; OcRam.debug("Tile w/h:", OcRam.twh); OcRam.setIndoorsFlag(); OcRam.menuCalled = false; } };
    CanvasRenderingContext2D.prototype.line = function (x1, y1, x2, y2) { /* Draw line to canvas context */ this.beginPath(); this.moveTo(x1, y1); this.lineTo(x2, y2); this.stroke(); };
    Game_Map.prototype.adjustX_OC = function (x) { /* Optimized core adjustX */ if (this.isLoopHorizontal()) { if (x < this._displayX - (this.width() - this.screenTileX()) * 0.5) { return x - this._displayX + $dataMap.width; } else { return x - this._displayX; } } else { return x - this._displayX; } };
    Game_Map.prototype.adjustY_OC = function (y) { /* Optimized core adjustY */ if (this.isLoopVertical()) { if (y < this._displayY - (this.height() - this.screenTileY()) * 0.5) { return y - this._displayY + $dataMap.height; } else { return y - this._displayY; } } else { return y - this._displayY; } };
    Game_CharacterBase.prototype.screenX_OC = function () { /* Optimized core screenX */ return Math.round($gameMap.adjustX_OC(this._realX) * OcRam.twh[0] + OcRam.twh50[0]); };
    Game_CharacterBase.prototype.screenY_OC = function () { /* Optimized core screenY */ return Math.round($gameMap.adjustY_OC(this._realY) * OcRam.twh[1] + OcRam.twh50[0] - this.shiftY() - this.jumpHeight()); };
} if (parseFloat(OcRam.version) < 1.05) alert("OcRam core v1.05 is required!");

//-----------------------------------------------------------------------------
// OcRam plugins - OcRam_Time_System.js
//=============================================================================

"use strict"; if (!Imported || !Imported.OcRam_Core) alert('OcRam_Core.js ' +
    'is required!'); OcRam.addPlugin("Time_System", "2.11");

/*:
 * @plugindesc v2.11 Time System for RPG Maker MV projects.
 * PLUGIN NAME MUST BE OcRam_Time_System.js
 * @author OcRam
 *
 * @param Variables and switches
 * @desc This parameter is just for grouping
 *
 * @param Time interval variable Id
 * @parent Variables and switches
 * @type variable
 * @desc Variable Id where value effects the time speed in game.
 * How many milliseconds (IRL) is one minute of game time?
 * Default: 1
 * @default 1
 *
 * @param Time enabled switch Id
 * @parent Variables and switches
 * @type switch
 * @desc Off = Time is stopped, On = Time is going on
 * @default 1
 *
 * @param Season variable Id
 * @parent Variables and switches
 * @type variable
 * @desc Variable Id where value represents current season
 * (Spring=1, Summer=2, Autumn=3, Winter=4) handled by plugin
 * @default 2
 *
 * @param Day phase variable Id
 * @parent Variables and switches
 * @type variable
 * @desc Variable Id where value represents current day phase
 * (Night=1, Dawn=2, Day=3, Dusk=4) handled by plugin
 * @default 3
 *
 * @param Year variable Id
 * @parent Variables and switches
 * @type variable
 * @desc This variable keeps track in years.
 * @default 4
 *
 * @param Month variable Id
 * @parent Variables and switches
 * @type variable
 * @desc This variable keeps track in months.
 * @default 5
 *
 * @param Day variable Id
 * @parent Variables and switches
 * @type variable
 * @desc This variable keeps track in days.
 * @default 6
 *
 * @param Hour variable Id
 * @parent Variables and switches
 * @type variable
 * @desc This variable keeps track in hours.
 * @default 7
 *
 * @param Minute variable Id
 * @parent Variables and switches
 * @type variable
 * @desc This variable keeps track in minutes.
 * @default 8
 * 
 * @param Weekday variable Id
 * @parent Variables and switches
 * @type variable
 * @desc Weekdays: 0 = Mon, 1 = Tue, 2 = Wed, 3 = Thu, 4 = Fri, 5 = Sat, 6 = Sun
 * @default 9
 * 
 * @param Show clock in menu
 * @type boolean
 * @desc Display clock in menu?
 * @default true
 * 
 * @param Time format
 * @parent Show clock in menu
 * @type select
 * @option 24h clock
 * @value 0
 * @option 12h clock (AM/PM)
 * @value 1
 * @desc Time format
 * @default 0
 *
 * @param Season captions
 * @parent Show clock in menu
 * @type text[]
 * @desc Captions for the seasons.
 * @default ["Spring","Summer","Autumn","Winter"]
 * 
 * @param Month captions
 * @parent Show clock in menu
 * @type text[]
 * @desc Captions for the months. (Must have same amount of captions as 'short' version)
 * @default ["January","February","March","April","May","June","July","August","September","October","November","December"]
 * 
 * @param Month captions (short)
 * @parent Show clock in menu
 * @type text[]
 * @desc Captions for the short name months. (Must have same amount of captions as 'long' version)
 * @default ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
 * 
 * @param Weekday captions
 * @parent Show clock in menu
 * @type text[]
 * @desc Captions for the weekdays. (Must have same amount of captions as 'short' version)
 * @default ["Monday","Tuesday","Wednesday","Thrusday","Friday","Saturday","Sunday"]
 * 
 * @param Weekday captions (short)
 * @parent Show clock in menu
 * @type text[]
 * @desc Captions for the short name weekdays. (Must have same amount of captions as 'long' version)
 * @default ["Mon","Tue","Wed","Thr","Fri","Sat","Sun"]
 * 
 * @param Show clock in map
 * @type boolean
 * @desc Display clock in map?
 * @default true
 * 
 * @param Clock align in map
 * @parent Show clock in map
 * @type select
 * @option Bottom-Left
 * @value 1
 * @option Bottom-Center
 * @value 2
 * @option Bottom-Right
 * @value 3
 * @option Top-Left
 * @value 7
 * @option Top-Center
 * @value 8
 * @option Top-Right
 * @value 9
 * @desc What is the position of the clock in map window?
 * @default 9
 * 
 * @param Clock type in map
 * @parent Show clock in map
 * @type select
 * @option Plain text (just time)
 * @value 0
 * @option Analog
 * @value 1
 * @option Digital
 * @value 2
 * @desc What type of clock should be used?
 * @default 0
 * 
 * @param Clock padding in map
 * @parent Show clock in map
 * @type number
 * @desc What is the padding of the clock in pixels?
 * @default 8
 * 
 * @param Clock center X
 * @parent Show clock in map
 * @type number
 * @desc What is the center of clock in X-axis?
 * @default 172
 *
 * @param Clock center Y
 * @parent Show clock in map
 * @type number
 * @desc What is the center of clock in Y-axis?
 * @default 48
 * 
 * @param Minute hand length
 * @parent Show clock in map
 * @type number
 * @desc What is the length of the minute hand in pixels?
 * @default 40
 * 
 * @param Hour hand length
 * @parent Show clock in map
 * @type number
 * @desc What is the length of the hour hand in pixels?
 * @default 25
 * 
 * @param Digital clock width
 * @parent Show clock in map
 * @type number
 * @desc What is the width of the digital clock (if used)?
 * @default 70
 * 
 * @param Digital font face
 * @parent Show clock in map
 * @type text
 * @desc What is the font face of the digital clock (if used)?
 * @default GameFont
 * 
 * @param Digital font size
 * @parent Show clock in map
 * @type number
 * @desc What is the font size of the digital clock (if used)?
 * @default 24
 * 
 * @param Digital blink
 * @parent Show clock in map
 * @type boolean
 * @desc Blink digital clock time seperator (if used)?
 * @default true
 * 
 * @param Clock elements
 * @parent Show clock in map
 * @type struct<ClockElement>[]
 * @desc Clock elements in map clock
 * @default ["{\"X\":\"5\",\"Y\":\"0\",\"Width\":\"120\",\"Align\":\"0\",\"FontFace\":\"GameFont\",\"FontSize\":\"18\",\"Type\":\"0\"}","{\"X\":\"7\",\"Y\":\"28\",\"Width\":\"90\",\"Align\":\"0\",\"FontFace\":\"GameFont\",\"FontSize\":\"18\",\"Type\":\"9\"}","{\"X\":\"7\",\"Y\":\"48\",\"Width\":\"90\",\"Align\":\"0\",\"FontFace\":\"GameFont\",\"FontSize\":\"18\",\"Type\":\"7\"}","{\"X\":\"90\",\"Y\":\"40\",\"Width\":\"32\",\"Align\":\"0\",\"FontFace\":\"GameFont\",\"FontSize\":\"18\",\"Type\":\"16\"}"]
 * 
 * @param Phases (start and tint)
 * @desc This parameter is just for grouping
 *
 * @param Night phase start
 * @parent Phases (start and tint)
 * @type number
 * @desc When does night phase start? (It will end when dawn phase starts)
 * @default 22
 *
 * @param Dawn phase start
 * @parent Phases (start and tint)
 * @type number
 * @desc When does dawn phase start? (It will end when day phase starts)
 * @default 6
 *
 * @param Day phase start
 * @parent Phases (start and tint)
 * @type number
 * @desc When does day phase start? (It will end when dusk phase starts)
 * @default 10
 *
 * @param Dusk phase start
 * @parent Phases (start and tint)
 * @type number
 * @desc When does dusk phase start? (It will end when night phase starts)
 * @default 18
 *
 * @param Night tint color
 * @parent Phases (start and tint)
 * @type struct<RGBG>
 * @desc Night auto tint color.
 * @default {"Red":"-96","Green":"-96","Blue":"-32","Gray":"48"}
 *
 * @param Dawn tint color
 * @parent Phases (start and tint)
 * @type struct<RGBG>
 * @desc Dawn auto tint color.
 * @default {"Red":"68","Green":"-32","Blue":"-32","Gray":"0"}
 *
 * @param Day tint color
 * @parent Phases (start and tint)
 * @type struct<RGBG>
 * @desc Day auto tint color.
 * @default {"Red":"0","Green":"0","Blue":"0","Gray":"0"}
 *
 * @param Dusk tint color
 * @parent Phases (start and tint)
 * @type struct<RGBG>
 * @desc Dusk auto tint color.
 * @default {"Red":"68","Green":"-32","Blue":"-32","Gray":"0"}
 *
 * @param Other parameters
 * @desc This parameter is just for grouping
 * 
 * @param Start date and time
 * @parent Other parameters
 * @type text
 * @desc Start date and time for new game?
 * year/month/day hour(24h):minute (ie. 1000/12/30 23:59)
 * @default 1000/1/1 12:00
 *
 * @param Season change CE
 * @parent Other parameters
 * @type common_event
 * @desc Run run this event + built-in features when season changes
 * 0 = Not in use (use only built-in features)
 * @default 0
 * 
 * @param Day phase CE
 * @parent Other parameters
 * @type common_event
 * @desc Common event to trigger on dayphases
 * 0 = Not in use (use built-in features)
 * @default 0
 * 
 * @param Use only CE on day phases
 * @parent Other parameters
 * @type boolean
 * @desc If this option is on/true it will DISABLE built-in dayphase functionality, if CE is used!
 * @default true
 *
 * @param Effect transition time
 * @parent Other parameters
 * @type number
 * @desc Time in frames for effects to change
 * (from day to dusk etc...)
 * @default 480
 *
 * @param Stop time on interact
 * @parent Other parameters
 * @type boolean
 * @desc Stops time while player is interacting with events.
 * @default false
 *
 * @param Stop time in battles
 * @parent Other parameters
 * @type boolean
 * @desc Stop time during battles.
 * @default true
 *
 * @param Stop time indoors
 * @parent Other parameters
 * @type boolean
 * @desc Stop time in <indoors> tagged maps.
 * @default false
 *
 * @param Auto tint indoors
 * @parent Other parameters
 * @type boolean
 * @desc Tint screen also in <indoors> tagged maps.
 * @default false
 *
 * @param Auto-start timer
 * @parent Other parameters
 * @type boolean
 * @desc Enable 'Time enabled switch' on new game?
 * @default true
 * 
 * @param Auto BGM Fade out
 * @parent Other parameters
 * @type number
 * @min 0
 * @max 60
 * @desc Auto BGM Fade out time in seconds
 * @default 1
 * 
 * @param Auto BGM Fade in
 * @parent Other parameters
 * @type number
 * @min 0
 * @max 60
 * @desc Auto BGM Fade in time in seconds
 * @default 1
 * 
 * @param Days per month
 * @parent Other parameters
 * @type number
 * @min 1
 * @max 9999
 * @desc How many days are there in 1 month?
 * @default 30
 * 
 * @param Seasons start month
 * @parent Other parameters
 * @type number
 * @min 1
 * @max 9999
 * @desc What month determinates start of seasons (Spring as default starts at month 3)
 * @default 3
 * 
 * @param Change tileset immediatly
 * @parent Other parameters
 * @type boolean
 * @desc Will change tileset immediatly when season is changed.
 * @default false
 *
 * @param Debug mode
 * @parent Other parameters
 * @type boolean
 * @desc Write some events to console log (F8 or F12).
 * @default false
 *
 * @help
 * ----------------------------------------------------------------------------
 * Introduction                                      (Embedded OcRam_Core v1.5)
 * ============================================================================
 * This plugin will give you core platform to create your own time system.
 *
 * Variables and switches are used for 2 reasons.
 *   1. They are automatically saved and are ready to use when game is loaded
 *   2. It gives much easier control (via change variable/switch command)
 *
 * For each season change this plugin will change tileset to corresponding
 * season next time player is transfered.
 * 
 * NOW with DYNAMIC days in month, months in year, days in week etc...!
 * 
 * NOTE: If short month/weekday captions are different from their long version:
 * array that has less captions will be used as max months/weekdays
 * 
 * NOTE2: If month count is not divisible by the number of seasons, remaining
 * months will be added to last season!
 * 
 * NOTE3: Using weather info requires OcRam_Weather_EX -plugin!
 * https://forums.rpgmakerweb.com/index.php?threads/ocram-weather_ex.89721/
 *
 * ----------------------------------------------------------------------------
 * Seasons tileset changes and day phases
 * ============================================================================
 * OcRam_Time_System must be imported before any other OcRam -plugin!
 *
 * Use TILESET NOTE field to define tileset to use for each season. 
 * <season_name:tileset_id> Example: <winter:7> uses tileset with id 7 
 * when it's season called 'winter'.
 *
 * Use <indoors> tag in tileset/map note field to flag it as "indoors".
 * 
 * Use <seasons:disabled> tag in MAP note field to disable season changes
 * in this map. You may also OVERRIDE tileset season id tags in MAP NOTE field.
 *
 * IF day phase common event is not used (value is 0):
 *   Night will default tint(-96, -96, -32, 48)
 *   Dawn will default tint(68, -32, -32, 0)
 *   Day will default tint(0, 0, 0, 0)
 *   Dusk will default tint(68, -32, -32, 0)
 *
 * Or you can do your own eventing via common events (You may need some
 * light/layer/weather/audio plugins to accomplish what you want)
 *
 * ----------------------------------------------------------------------------
 * Season / Day phase specific BGS
 * ============================================================================
 * You may use tileset and map note fields to add meta tags for season and
 * day phase specific BGS!
 *
 * Tileset note field meta tags inheritance (goto next line if not found):
 *   <bgs-season:night_bgs,dawn_bgs,day_bgs,dusk_bgs>
 *   <bgs-season:night_bgs,dawn_bgs,default_bgs>
 *   <bgs-season:night_bgs,default_bgs>
 *   <bgs-season:default_bgs>
 *   <bgs:night_bgs,dawn_bgs,day_bgs,dusk_bgs>
 *   <bgs:night_bgs,dawn_bgs,default_bgs>
 *   <bgs:night_bgs,default_bgs>
 *   <bgs:default_bgs>
 *   
 * BGM notetags are working sameway as BGS notetags
 *   <bgm-season:night_bgm,dawn_bgm,day_bgm,dusk_bgm> 
 *   <bgm:night_bgm,dawn_bgm,day_bgm,dusk_bgm> 
 *   <bgm:default_bgm> etc...
 *
 * MAP note field meta tags will OVERRIDE tileset meta tags!
 *
 * BGS Example:
 * <bgs:birds> // Default BGS (in this case only on spring)
 * <bgs-winter:wind> // In winter times wind always blows
 * <bgs-summer:crickets,birds> // Crickets at night and default to birds
 * <bgs-autumn:owl,birds> // Owl at night and default to birds
 * 
 * ----------------------------------------------------------------------------
 * Plugin commands
 * ============================================================================
 * You may control time via variables or following plugin commands.
 * To hide map clock        time hide
 * To show map clock        time show
 * To disable time:         time stop
 * To enable time:          time start
 * To reverse time          time reverse true
 * To unreverse time        time reverse false
 * To adjust time interval: time interval 1000
 * To add 15 minutes:       time add minutes 15
 * To add 1 hour to time:   time add hours 1
 * To add 7 days to time:   time add days 7
 * To add 4 month to time:  time add months 4
 * To change year:          {simply change year variable}
 * To set time to 10:41 pm: time set 22 41
 * To set date 2019/3/30:   time set 2019 3 30
 * or 2019/3/30 10:41 pm:   time set 2019 3 30 22 41
 * 
 * ----------------------------------------------------------------------------
 * JS calls
 * ============================================================================
 * To get date related strings:
 *   OcRam.Time_System.getMonthString();       // Return: "Jan"
 *   OcRam.Time_System.getMonthStringLong();   // Return: "January"
 *   OcRam.Time_System.getWeekdayString();     // Return: "Mon"
 *   OcRam.Time_System.getWeekdayStringLong(); // Return: "Monday"
 *   OcRam.Time_System.getDayMonth();          // Return: "13. Jan"
 *   OcRam.Time_System.getDayMonthLong();      // Return: "13. January"
 *   OcRam.Time_System.getDateString();        // Return: "13. Jan 2000"
 *   OcRam.Time_System.getDateStringLong();    // Return: "13. January 2000"
 *   OcRam.Time_System.getTimeString();        // Return: "13:30" / "01:30 PM"
 *   OcRam.Time_System.getSeasonString();      // Return: "Spring"
 * 
 * To trigger autoplay(s) any time use script line:
 *   $gameMap.autoPlayBGS(); $gameMap.autoPlayBGM();
 *
 * To show/hide map clock JS calls:
 *   $gameSystem.showMapClock(); $gameSystem.hideMapClock();
 *
 * Check if indoors JS call:
 *   OcRam.isIndoors(); $gameSystem.isIndoors(); (for backward compatibility)
 *   
 * To add time:
 *   OcRam.Time_System.addMinutes(minutes_to_add);
 *   OcRam.Time_System.addHours(hours_to_add);
 *   OcRam.Time_System.addDays(days_to_add);
 *   OcRam.Time_System.addMonths(months_to_add);
 *   
 * To subtract time:
 *   OcRam.Time_System.subtractMinutes(minutes_to_subtract);
 * 
 * ----------------------------------------------------------------------------
 * Terms of Use
 * ============================================================================
 * Edits are allowed as long as "Terms of Use" is not changed in any way.
 *
 * NON-COMMERCIAL USE: Free to use with credits to 'OcRam'
 *
 * If you gain money with your game by ANY MEANS (inc. ads, crypto-mining,
 * micro-transactions etc..) it's considered as COMMERCIAL use of this plugin!
 *
 * COMMERCIAL USE: (Standard license: 10 EUR, No-credits license: 50 EUR)
 * Payment via PayPal (https://paypal.me/MarkoPaakkunainen), please mention
 * PLUGIN NAME(S) you are buying / ALL plugins and your PROJECT NAME(S).
 *
 * Licenses are purchased per project and standard license requires credits.
 * If you want to buy several licenses: Every license purhased will give you
 * discount of 2 EUR for the next license purchase until minimum price of
 * 2 EUR / license. License discounts can be used to any of my plugins!
 * ALL of my plugins for 1 project = 40 EUR (standard licenses)
 *
 * https://forums.rpgmakerweb.com/index.php?threads/ocram-time-system.107735
 *
 * DO NOT COPY, RESELL OR CLAIM ANY PIECE OF THIS SOFTWARE AS YOUR OWN!
 * Copyright (c) 2020, Marko Paakkunainen // mmp_81 (at) hotmail.com
 *
 * ----------------------------------------------------------------------------
 * Version History
 * ============================================================================
 * 2020/02/02 v2.00 - Initial release
 * 2020/02/11 v2.01 - OcRam_Core v1.02 and fixed default parameters
 * 2020/02/22 v2.02 - Included OcRam core v1.03
 *                    All images are now located in .\img\ocram -folder!
 *                    Weather info on map and in menu (Credits to: dragonx777)
 *                    (weather info requires OcRam_Weather_EX -plugin v2.04)
 *                    Dynamic month length, weekdays, seasons and months
 *                    (Credits to: arcadejump and DeadlyEssence01)
 * 2020/02/23 v2.03 - Seasonal tileset change is no longer case-sensitive!
 * 2020/03/14 v2.04 - OcRam core v1.04 (requirement for all of my plugins)
 *                    New function OcRam.Time_System.updateSeasonalTileset();
 *                    New plugin parameter "Change tileset immediatly"
 *                      false = Will change season tileset on next transfer
 *                      true = Will change season tileset immediatly
 * 2020/05/11 v2.05 - Fixed bug in plugin command "time add months/days"
 *                    and weather caption is not shown in menu, if 
 *                    "weather shown in menu" is false. (Credits to fizzly)
 * 2020/05/12 v2.06 - HotFix for v2.05 (time add months 1 plugin command)
 * 2020/06/12 v2.07 - Fixed bug where "Test event" crashed game - Requires
 *                    OcRam_Core v1.5 (Credits to jjraymonds)
 * 2020/06/16 v2.08 - Fixed bug with OcRam_Passages tileset changes
 * 2020/06/20 v2.09 - Fixed bug in day change CE (Credits to autophagy)
 * 2020/09/06 v2.10 - New pluging command "Reverse time" (Credits to JosephG)
 *                    Fixed bug where "Show map clock" state wasn't saved
 * 2020/09/21 v2.11 - New time add/subtract JS functions (Credits to JosephG)
 *                    Time Enabled switch bug fixed
 * 
 */
/*
 * ----------------------------------------------------------------------------
 * RMMV CORE function overrides (destructive) are listed here
 * ============================================================================
 *     -
 */
/*~struct~RGBG:
 *
 * @param Red
 * @type number
 * @min -255
 * @max 255
 * @desc Amount of Red color.
 *
 * @param Green
 * @type number
 * @min -255
 * @max 255
 * @desc Amount of Green color.
 *
 * @param Blue
 * @type number
 * @min -255
 * @max 255
 * @type number
 * @desc Amount of Blue color.
 *
 * @param Gray
 * @type number
 * @min -255
 * @max 255
 * @desc Amount of Gray color.
 */

/*~struct~ClockElement:
 *
 * @param X
 * @type number
 * @min -9999
 * @max 9999
 * @desc X position of the element.
 * @default 0
 *
 * @param Y
 * @type number
 * @min -9999
 * @max 9999
 * @desc Y position of the element.
 * @default 0
 *
 * @param Width
 * @type number
 * @min 64
 * @max 9999
 * @type number
 * @desc Width in pixels.
 * @default 100
 * 
 * @param Align
 * @type number
 * @type select
 * @option Left
 * @value 0
 * @option Center
 * @value 1
 * @option Right
 * @value 2
 * @desc Text align.
 * @default 0
 * 
 * @param FontFace
 * @type text
 * @desc Font face.
 * @default GameFont
 * 
 * @param FontSize
 * @type number
 * @desc Font size.
 * @default 18
 *
 * @param Type
 * @type select
 * @option Day. Month Year
 * @value 0
 * @option Day. Month (short) Year
 * @value 1
 * @option Day. Month
 * @value 2
 * @option Day. Month (short)
 * @value 3
 * @option Day.
 * @value 4
 * @option Month
 * @value 5
 * @option Month (short)
 * @value 6
 * @option Weekday
 * @value 7
 * @option Weekday (short)
 * @value 8
 * @option Season
 * @value 9
 * @option Year
 * @value 10
 * @option Time (hh:mm)
 * @value 11
 * @option Weather name
 * @value 12
 * @option Day phase icon
 * @value 16
 * @option Weather icon
 * @value 17
 * @desc Element content
 * @default 0
 * 
 */

// For the backward compatibility for other plugins
var OcRam_Time_System = OcRam.Time_System;

(function () {

    // ----------------------------------------------------------------------------
    // Plugin parameters and other variables
    // ============================================================================

    var OcRam_Utils = {}; var _this = this;

    var _autoStartTimer = OcRam.getBoolean(this.parameters['Auto-start timer']);
    var _timeEnabledSwitchId = Number(this.parameters['Time enabled switch Id']);
    var _timeIntervalVarId = Number(this.parameters['Time interval variable Id']);
    var _seasonVarId = Number(this.parameters['Season variable Id']);
    var _dayPhaseVarId = Number(this.parameters['Day phase variable Id']);
    var _seasonCE = Number(this.parameters['Season change CE']);
    var _dayPhaseCE = Number(this.parameters['Day phase CE']);
    var _yearVarId = Number(this.parameters['Year variable Id']);
    var _monthVarId = Number(this.parameters['Month variable Id']);
    var _dayVarId = Number(this.parameters['Day variable Id']);
    var _weekdayVarId = Number(this.parameters['Weekday variable Id']);

    var _hourVarId = Number(this.parameters['Hour variable Id']);
    var _minuteVarId = Number(this.parameters['Minute variable Id']);
    var _effectTransitionTime = Number(this.parameters['Effect transition time']);
    var _stopTimeInBattles = OcRam.getBoolean(this.parameters['Stop time in battles']);
    var _stopTimeIndoors = OcRam.getBoolean(this.parameters['Stop time indoors']);
    var _autoTintIndoors = OcRam.getBoolean(this.parameters['Auto tint indoors']);
    var _startDateStamp = this.parameters['Start date and time'];
    var _bgmFadeOutDuration = Number(this.parameters['Auto BGM Fade out']);
    var _bgmFadeInDuration = Number(this.parameters['Auto BGM Fade in']);
    var _useOnlyCE = OcRam.getBoolean(this.parameters['Use only CE on day phases']);
    var _stopTimeOnInteract = OcRam.getBoolean(this.parameters['Stop time on interact']);

    var _showClockInMenu = OcRam.getBoolean(this.parameters['Show clock in menu']);
    var _showClockInMap = OcRam.getBoolean(this.parameters['Show clock in map']);
    var _mapClockAlign = Number(this.parameters['Clock align in map']);
    var _mapClockPadding = Number(this.parameters['Clock padding in map']);
    var _clockType = Number(this.parameters['Clock type in map']);

    var _minuteHandLength = Number(this.parameters['Minute hand length']);
    var _hourHandLength = Number(this.parameters['Hour hand length']);
    var _changeTilesetImmediatly = OcRam.getBoolean(this.parameters['Change tileset immediatly']);

    var _shortWeekdayCaptions = OcRam.getArray(this.parameters['Weekday captions (short)'], ["Mon", "Tue", "Wed", "Thr", "Fri", "Sat", "Sun"]);
    var _weekdayCaptions = OcRam.getArray(this.parameters['Weekday captions'], ["Monday", "Tuesday", "Wednesday", "Thrusday", "Friday", "Saturday", "Sunday"]);
    var _shortMonthCaptions = OcRam.getArray(this.parameters['Month captions (short)'], ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]);
    var _monthCaptions = OcRam.getArray(this.parameters['Month captions'], ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]);
    var _seasonCaptions = OcRam.getArray(this.parameters['Season captions'], ["Spring", "Summer", "Autumn", "Winter"]);
    var _epiCenter = [Number(this.parameters['Clock center X']), Number(this.parameters['Clock center Y'])]; var _prevMin = -1; var _prevHour = -1;

    var _clockElements = OcRam.getJSONArray(this.parameters['Clock elements']);
    _clockElements.forEach(function (ce) { // Regulate numbers
        ce.X = Number(ce.X); ce.Y = Number(ce.Y); ce.Width = Number(ce.Width);
        ce.Align = Number(ce.Align); ce.Type = Number(ce.Type);
    });

    var _tintNight = OcRam.regulateRGBG(JSON.parse(this.parameters['Night tint color']));
    var _tintDawn = OcRam.regulateRGBG(JSON.parse(this.parameters['Dawn tint color']));
    var _tintDay = OcRam.regulateRGBG(JSON.parse(this.parameters['Day tint color']));
    var _tintDusk = OcRam.regulateRGBG(JSON.parse(this.parameters['Dusk tint color']));

    var _nightStart = Number(this.parameters['Night phase start']) || 22;
    var _dawnStart = Number(this.parameters['Dawn phase start']) || 6;
    var _dayStart = Number(this.parameters['Day phase start']) || 10;
    var _duskStart = Number(this.parameters['Dusk phase start']) || 18;

    var _digitalClockWidth = Number(this.parameters['Digital clock width'] || 70);
    var _digitalFontSize = Number(this.parameters['Digital font size'] || 24);
    var _digitalFontFace = this.parameters['Digital font face'] || 'GameFont';
    var _digitalBlink = OcRam.getBoolean(this.parameters['Digital blink']);
    var _daysPerMonth = Number(this.parameters['Days per month'] || 30);
    var _seasonStartMonth = Number(this.parameters['Seasons start month'] || 3);

    var _timeFormat = Number(this.parameters['Time format'] || 0);

    var _maxMonths = _monthCaptions.length < _shortMonthCaptions.length ? _monthCaptions.length : _shortMonthCaptions.length;
    var _maxWeekdays = _weekdayCaptions.length < _shortWeekdayCaptions.length ? _weekdayCaptions.length : _shortWeekdayCaptions.length;
    var _maxSeasons = _seasonCaptions.length; var _seasonLength = Math.floor(_maxMonths / _maxSeasons); var _oldSeason = null;
    var _timeReversed = false;

    // Warnings!
    if (_shortMonthCaptions.length != _monthCaptions.length) {
        console.warn('Month "long" captions should have same amount of months as "short" month captions');
    } if (_shortWeekdayCaptions.length != _weekdayCaptions.length) {
        console.warn('Weekday "long" captions should have same amount of days as "short" weekday captions');
    } if (_maxMonths % _maxSeasons != 0) console.warn('Months are not divisible by the number of seasons!');

    // Trying to make phases logical...
    if (_nightStart < _duskStart) _nightStart = 24;
    if (_duskStart < _dayStart) _duskStart = _dayStart + 1;
    if (_dayStart < _dawnStart) _dayStart = _dawnStart + 1;
    if (_dawnStart > _nightStart) _dawnStart = _nightStart - 1;

    this._timeEnabledSwitchId = _timeEnabledSwitchId; this._dayPhaseVarId = _dayPhaseVarId;
    this._effectTransitionTime = _effectTransitionTime; this._useAutoTint = true;
    var _prevInterVal = 0; var _justLoaded = false; var _prevTSEnabledState = _autoStartTimer;
    var _isNewOrLoaded = false; var _gameJustLoaded = false;
    var _isInteracting = false; this._prevTilesetId = 0; this._seasonId = 0;

    var _weatherVariableId = 0; var _prevMonth = 0;

    if (_clockType != 0) { // Pre-load images only when needed...
        var _clockBitmap = null;
        if (_clockType == 1) _clockBitmap = ImageManager.loadOcRamBitmap('analog');
        if (_clockType == 2) _clockBitmap = ImageManager.loadOcRamBitmap('digital');
        var _phaseBitmaps = [
            ImageManager.loadOcRamBitmap('night'),
            ImageManager.loadOcRamBitmap('dawn'),
            ImageManager.loadOcRamBitmap('day'),
            ImageManager.loadOcRamBitmap('dusk')
        ];
    }

    // Pre-build season checker
    var _preBuiltSeasons = [];
    function buildSeasonMonths() {
        var m = _seasonStartMonth; var s = null; var tmp = [];
        for (var i = 0; i < _maxSeasons; i++) {
            tmp = [];
            for (var j = 0; j < _seasonLength; j++) {
                tmp.push(m);
                m++; if (m > _maxMonths) m = (m % _maxMonths);
            } s = { Id: i + 1, Name: _seasonCaptions[i], Months: tmp };
            _preBuiltSeasons.push(s);
        }
        for (i = 0; i < _maxMonths % _maxSeasons; i++) {
            _preBuiltSeasons[_preBuiltSeasons.length - 1].Months.push(m);
            m++; if (m > _maxMonths) m = (m % _maxMonths);
        }
    } buildSeasonMonths();

    this.debug("Pre-built seasons:", _preBuiltSeasons, "Seasons:", _maxSeasons, "Season length:", _seasonLength);

    // ------------------------------------------------------------------------------
    // Public Utility functions - Usage: OcRam.PluginName.funcName([args]);
    // ==============================================================================
    this.getDayMonth = function () {
        return $gameVariables.value(_dayVarId) + ". " + this.getMonthString();
    };

    this.getDayMonthLong = function () {
        return $gameVariables.value(_dayVarId) + ". " + this.getMonthStringLong();
    };

    this.getDateString = function () {
        return this.getDayMonth() + " " + $gameVariables.value(_yearVarId);
    };

    this.getDateStringLong = function () {
        return this.getDayMonthLong() + " " + $gameVariables.value(_yearVarId);
    };

    this.getTimeString = function () {
        if (_timeFormat == 0) { // 24h
            return ($gameVariables.value(_hourVarId) % 24).padZero(2) + ":" + ($gameVariables.value(_minuteVarId) % 60).padZero(2);
        } else { // 12h
            var ampm = $gameVariables.value(_hourVarId) > 12 ? " PM" : " AM";
            return ($gameVariables.value(_hourVarId) % 12).padZero(2) + ":" + $gameVariables.value(_minuteVarId).padZero(2) + ampm;
        }
    };

    this.getWeekdayString = function () {
        return _shortWeekdayCaptions[$gameVariables.value(_weekdayVarId) % _maxWeekdays];
    };

    this.getWeekdayStringLong = function () {
        return _weekdayCaptions[$gameVariables.value(_weekdayVarId) % _maxWeekdays];
    };

    this.getMonthString = function () {
        return _shortMonthCaptions[Number(($gameVariables.value(_monthVarId)) - 1) % _maxMonths];
    };

    this.getMonthStringLong = function () {
        return _monthCaptions[Number(($gameVariables.value(_monthVarId)) - 1) % _maxMonths];
    };

    this.getSeasonString = function () {
        var season = Number($gameVariables.value(_seasonVarId)) - 1;
        if (!season) season = 0; if (season < 0) season = 0; if (season > 3) season = 3;
        return _seasonCaptions[season];
    };

    this.getSeasonById = function (id) {
        var tmp = null;
        _preBuiltSeasons.forEach(function (s) {
            if (s.Id == id) tmp = s; return;
        }); return tmp;
    };

    this.getSeasonByMonth = function (month) {
        var tmp = null;
        _preBuiltSeasons.forEach(function (s) {
            return s.Months.forEach(function (m) {
                if (m == month) tmp = s; return;
            });
        }); return tmp;
    };

    this.updateSeasonalTileset = function (check_season) {
        if (check_season) OcRam_Utils.checkSeason();
        if (_oldSeason != $gameVariables.value(_seasonVarId)) {
            _oldSeason = $gameVariables.value(_seasonVarId);
            if ($gameMap) {
                if (OcRam.Passages) OcRam.Passages.forceTilesetReload();
                $gamePlayer.reserveTransfer($gameMap._mapId, $gamePlayer._x, $gamePlayer._y, $gamePlayer._direction, 0);
            }
        }
    };
    
    // ------------------------------------------------------------------------------
    // Private Utility functions - Inherited to all sub scopes here
    // ==============================================================================

    OcRam_Utils.playBGS = function (bgs_name, bgs_vol, bgs_pitch, bgs_pan, bgs_pos) {
        if (AudioManager._currentBgs && AudioManager._currentBgs.name == bgs_name) return;
        var tmp_bgs = {
            name: bgs_name,
            volume: bgs_vol,
            pitch: bgs_pitch,
            pan: bgs_pan,
            pos: bgs_pos
        }; _this.debug("playBGS:", tmp_bgs);
        AudioManager.playBgs(tmp_bgs);
    };

    OcRam_Utils.playBGM = function (bgm_name, bgm_vol, bgm_pitch, bgm_pan, bgm_pos) {
        if (AudioManager._currentBgm && AudioManager._currentBgm.name == bgm_name) return;
        AudioManager.fadeOutBgm(_bgmFadeOutDuration);
        setTimeout(function () {
            var tmp_bgm = {
                name: bgm_name,
                volume: bgm_vol,
                pitch: bgm_pitch,
                pan: bgm_pan,
                pos: bgm_pos
            }; _this.debug("playBGM:", tmp_bgm);
            AudioManager.playBgm(tmp_bgm);
            AudioManager.fadeInBgm(_bgmFadeInDuration);
        }, _bgmFadeOutDuration * 1000);
    };

    OcRam_Utils.initTimeVars = function () {

        _this.debug("initTimeVars", _startDateStamp);

        var dTmp = (_startDateStamp + " ").split(" ")[0] + "//";
        var y = parseInt((dTmp).split("/")[0]);
        var m = parseInt((dTmp).split("/")[1]);
        var d = parseInt((dTmp).split("/")[2]);

        dTmp = (_startDateStamp + " ").split(" ")[1] + ":";
        var h = parseInt((dTmp).split(":")[0]);
        var n = parseInt((dTmp).split(":")[1]);

        if (d == 0) d = 1;
        if (m == 0) m = 1;
        if (d > _daysPerMonth) d = _daysPerMonth;
        if (m > _maxMonths) m = _maxMonths;
        if (h > 23) h = 23;
        if (n > 59) n = 59;

        $gameVariables.setValue(_yearVarId, y);
        $gameVariables.setValue(_monthVarId, m);
        $gameVariables.setValue(_dayVarId, d);
        $gameVariables.setValue(_hourVarId, h);
        $gameVariables.setValue(_minuteVarId, n);

        var season = _this.getSeasonByMonth(parseInt(m));
        if (season && season.Id != $gameVariables.value(_seasonVarId)) {
            $gameVariables.setValue(_seasonVarId, season.Id); $gameMap.autoPlayBGS(); $gameMap.autoPlayBGM();
            //if (_seasonCE != 0) OcRam.runCE(_seasonCE);
            _this._seasonId = season.Id; _oldSeason = season.Id;
        }

        if (h > 21 || h < 6) { // Night
            $gameVariables.setValue(_dayPhaseVarId, 1);
        } else if (h > 5 && h < 10) { // Dawn
            $gameVariables.setValue(_dayPhaseVarId, 2);
        } else if (h > 9 && h < 18) { // Day
            $gameVariables.setValue(_dayPhaseVarId, 3);
        } else if (h > 17 && h < 22) { // Dusk
            $gameVariables.setValue(_dayPhaseVarId, 4);
        }

        $gameSwitches.setValue(_timeEnabledSwitchId, _autoStartTimer);

    };

    OcRam_Utils.initTimer = function () {

        if ($gameVariables.value(_timeIntervalVarId) < 250) $gameVariables.setValue(_timeIntervalVarId, 250);

        if (window._OC_Timer !== undefined) {
            _this.debug("clearInterval:", window._OC_Timer);
            window.clearInterval(window._OC_Timer); window._OC_Timer = undefined;
        }

        if (OcRam._isIndoors && _stopTimeIndoors) return;

        if (window._OC_Timer === undefined) {
            window._OC_Timer = window.setInterval(function () {
                window.processInterval_OC();
            }, $gameVariables.value(_timeIntervalVarId));
            _this.debug("setInterval:", window._OC_Timer);
        }

    };

    OcRam_Utils.getSeasonText = function (season) {
        var s = _this.getSeasonById(season);
        return s ? s.Name : "";
    };

    OcRam_Utils.addMonths = function (months_to_add) {
        this.addDays(months_to_add * _daysPerMonth);
    };

    OcRam_Utils.addDays = function (days_to_add) {

        if (days_to_add == 0) return;

        var add_m = 0; var add_d = parseInt(days_to_add);

        if (add_d >= _daysPerMonth) { add_m = parseInt(add_d / _daysPerMonth); } // param over 1 month (_daysPerMonth days)
        add_d = add_d % _daysPerMonth; // take days for further use

        // get current time
        var cur_d = $gameVariables.value(_dayVarId);
        var cur_m = $gameVariables.value(_monthVarId);
        var cur_y = $gameVariables.value(_yearVarId);

        // add time
        cur_d += add_d; // max _daysPerMonth
        cur_m += add_m; // max 12

        // check modulos
        if (cur_d > _daysPerMonth) { cur_d = (cur_d % _daysPerMonth); cur_m++; }
        if (cur_m > _maxMonths) { cur_m = (cur_m % _maxMonths); cur_y++; }

        // set variables
        if ($gameVariables.value(_yearVarId) != cur_y) $gameVariables.setValue(_yearVarId, cur_y);
        if ($gameVariables.value(_monthVarId) != cur_m) $gameVariables.setValue(_monthVarId, cur_m);
        if ($gameVariables.value(_dayVarId) != cur_d) $gameVariables.setValue(_dayVarId, cur_d);

        _this.debug("time stamp:", cur_y + "." + cur_m + "." + cur_d);

        this.checkPhases();

    };

    OcRam_Utils.addHours = function (hours_to_add) {
        this.addMinutes(hours_to_add * 60);
    };

    OcRam_Utils.subtractHours = function (hours_to_subtract) {
        this.subtractMinutes(hours_to_subtract * 60);
    };

    OcRam_Utils.subtractMinutes = function (minutes_to_subtract) {

        if (minutes_to_subtract == 0) return;

        var add_h = 0; var add_d = 0; var add_m = 0; var add_n = parseInt(minutes_to_subtract);
        if (add_n > 59) { add_h = parseInt(add_n / 60); } // param over 1 hour (60 min)
        add_n = add_n % 60; // take minutes for further use
        if (add_h > 23) { add_d = parseInt(add_h / 24); } // param over 1 day (24 hours)
        add_h = add_h % 24; // take hours for further use
        if (add_d > _daysPerMonth) { add_m = parseInt(add_d / _daysPerMonth); } // param over 1 month (_daysPerMonth days)
        add_d = add_d % _daysPerMonth; // take days for further use

        // get current time
        var cur_n = $gameVariables.value(_minuteVarId);
        var cur_h = $gameVariables.value(_hourVarId);
        var cur_d = $gameVariables.value(_dayVarId);
        var cur_m = $gameVariables.value(_monthVarId);
        var cur_y = $gameVariables.value(_yearVarId);

        // add time
        cur_n -= add_n; // max 59
        cur_h -= add_h; // max 23
        cur_d -= add_d; // max _daysPerMonth
        cur_m -= add_m; // max _maxMonths

        // check modulos
        if (cur_n < 0) { cur_n = 58 - cur_n; cur_h--; }
        if (cur_h < 0) { cur_h = 22 - cur_h; cur_d--; }
        if (cur_d < 1) { cur_d = (_daysPerMonth - cur_d); cur_m--; }
        if (cur_m < 1) { cur_m = (_maxMonths - cur_m); cur_y--; }

        // set variables
        if ($gameVariables.value(_yearVarId) != cur_y) $gameVariables.setValue(_yearVarId, cur_y);
        if ($gameVariables.value(_monthVarId) != cur_m) $gameVariables.setValue(_monthVarId, cur_m);
        if ($gameVariables.value(_dayVarId) != cur_d) $gameVariables.setValue(_dayVarId, cur_d);
        if ($gameVariables.value(_hourVarId) != cur_h) $gameVariables.setValue(_hourVarId, cur_h);
        $gameVariables.setValue(_minuteVarId, cur_n);

        if (_prevMonth != cur_m) {
            _prevMonth = cur_m;
            checkSeason();
        }

        _this.debug("time stamp:", cur_y + "." + cur_m + "." + cur_d + " " + cur_h + ":" + cur_n);

        this.checkPhases();

    };

    OcRam_Utils.addMinutes = function (minutes_to_add) {

        if (minutes_to_add == 0) return;

        if (minutes_to_add < 0) {
            this.subtractMinutes(-Number(minutes_to_add)); return;
        }

        var add_h = 0; var add_d = 0; var add_m = 0; var add_n = parseInt(minutes_to_add);
        if (add_n > 59) { add_h = parseInt(add_n / 60); } // param over 1 hour (60 min)
        add_n = add_n % 60; // take minutes for further use
        if (add_h > 23) { add_d = parseInt(add_h / 24); } // param over 1 day (24 hours)
        add_h = add_h % 24; // take hours for further use
        if (add_d > _daysPerMonth) { add_m = parseInt(add_d / _daysPerMonth); } // param over 1 month (_daysPerMonth days)
        add_d = add_d % _daysPerMonth; // take days for further use

        // get current time
        var cur_n = $gameVariables.value(_minuteVarId);
        var cur_h = $gameVariables.value(_hourVarId);
        var cur_d = $gameVariables.value(_dayVarId);
        var cur_m = $gameVariables.value(_monthVarId);
        var cur_y = $gameVariables.value(_yearVarId);

        // add time
        cur_n += add_n; // max 59
        cur_h += add_h; // max 23
        cur_d += add_d; // max _daysPerMonth
        cur_m += add_m; // max _maxMonths

        // check modulos
        if (cur_n > 59) { cur_n = cur_n % 60; cur_h++; }
        if (cur_h > 23) { cur_h = cur_h % 24; cur_d++; }
        if (cur_d > _daysPerMonth) { cur_d = (cur_d % _daysPerMonth); cur_m++; }
        if (cur_m > _maxMonths) { cur_m = (cur_m % _maxMonths); cur_y++; }

        // set variables
        if ($gameVariables.value(_yearVarId) != cur_y) $gameVariables.setValue(_yearVarId, cur_y);
        if ($gameVariables.value(_monthVarId) != cur_m) $gameVariables.setValue(_monthVarId, cur_m);
        if ($gameVariables.value(_dayVarId) != cur_d) $gameVariables.setValue(_dayVarId, cur_d);
        if ($gameVariables.value(_hourVarId) != cur_h) $gameVariables.setValue(_hourVarId, cur_h);
        $gameVariables.setValue(_minuteVarId, cur_n);

        if (_prevMonth != cur_m) {
            _prevMonth = cur_m;
            this.checkSeason();
        }

        _this.debug("time stamp:", cur_y + "." + cur_m + "." + cur_d + " " + cur_h + ":" + cur_n);

        this.checkPhases();

    };

    OcRam_Utils.checkSeason = function () {

        var no_transition_time = _justLoaded; var month = $gameVariables.value(_monthVarId);
        var fxTransitionTime = no_transition_time ? 0 : _effectTransitionTime;

        var season = _this.getSeasonByMonth(parseInt(month)); _this.debug("checkSeason:", season);
        if (season && season.Id != $gameVariables.value(_seasonVarId)) {
            _this.debug(season.Name, "(month " + month + ", " + no_transition_time + ")");
            $gameVariables.setValue(_seasonVarId, season.Id); $gameMap.autoPlayBGS(); $gameMap.autoPlayBGM();
            if (_seasonCE != 0) OcRam.runCE(_seasonCE); _this._seasonId = season.Id;
        }

    };

    OcRam_Utils.checkPhases = function () {

        this.setWeekday(); var no_transition_time = _justLoaded;

        if (!_autoTintIndoors) { // Check no auto tint for indoors...
            if (OcRam._isIndoors) {
                if (no_transition_time) {
                    _this.debug("Phase:", "Indoors");
                    $gameMap.autoPlayBGS(); $gameMap.autoPlayBGM();
                    if (_dayPhaseCE == 0) {
                        $gameScreen.startTint([0, 0, 0, 0], 0); return;
                    } else {
                        OcRam.runCE(_dayPhaseCE); return;
                    }
                } else {
                    return;
                }
            }
        }

        var hour = $gameVariables.value(_hourVarId);
        var fxTransitionTime = no_transition_time ? 0 : _effectTransitionTime;
        var auto_tint = _this._useAutoTint;

        // Day phase
        var day_phase = $gameVariables.value(_dayPhaseVarId);
        if (hour > (_nightStart - 1) || hour < _dawnStart) { // Night
            if (day_phase != 1 || no_transition_time) { // First occurance or instant tint
                $gameVariables.setValue(_dayPhaseVarId, 1); $gameMap.autoPlayBGS(); $gameMap.autoPlayBGM();
                if (_dayPhaseCE == 0 || !_useOnlyCE) {
                    _this.debug("Night phase (hour " + hour + ", " + fxTransitionTime + ", auto tint: " + auto_tint + ")", _tintNight);
                    if (auto_tint) $gameScreen.startTint([_tintNight.Red, _tintNight.Green, _tintNight.Blue, _tintNight.Gray], fxTransitionTime);
                    if (_dayPhaseCE != 0) OcRam.runCE(_dayPhaseCE);
                } else {
                    _this.debug("Night phase", "(CE:" + _dayPhaseCE + ")"); OcRam.runCE(_dayPhaseCE);
                }
            }
        } else if (hour > (_dawnStart - 1) && hour < _dayStart) { // Dawn
            if (day_phase != 2 || no_transition_time) { // First occurance or instant tint
                $gameVariables.setValue(_dayPhaseVarId, 2); $gameMap.autoPlayBGS(); $gameMap.autoPlayBGM();
                if (_dayPhaseCE == 0 || !_useOnlyCE) {
                    _this.debug("Dawn phase (hour " + hour + ", " + fxTransitionTime + ", auto tint: " + auto_tint + ")", _tintDawn);
                    if (auto_tint) $gameScreen.startTint([_tintDawn.Red, _tintDawn.Green, _tintDawn.Blue, _tintDawn.Gray], fxTransitionTime);
                    if (_dayPhaseCE != 0) OcRam.runCE(_dayPhaseCE);
                } else {
                    _this.debug("Dawn phase", "(CE:" + _dayPhaseCE + ")"); OcRam.runCE(_dayPhaseCE);
                }
            }
        } else if (hour > (_dayStart - 1) && hour < _duskStart) { // Day
            if (day_phase != 3 || no_transition_time) { // First occurance or instant tint
                $gameVariables.setValue(_dayPhaseVarId, 3); $gameMap.autoPlayBGS(); $gameMap.autoPlayBGM();
                if (_dayPhaseCE == 0 || !_useOnlyCE) {
                    _this.debug("Day phase (hour " + hour + ", " + fxTransitionTime + ", auto tint: " + auto_tint + ")", _tintDay);
                    if (auto_tint) $gameScreen.startTint([_tintDay.Red, _tintDay.Green, _tintDay.Blue, _tintDay.Gray], fxTransitionTime);
                    if (_dayPhaseCE != 0) OcRam.runCE(_dayPhaseCE);
                } else {
                    _this.debug("Day phase", "(CE:" + _dayPhaseCE + ")"); OcRam.runCE(_dayPhaseCE);
                }
            }
        } else if (hour > (_duskStart - 1) && hour < _nightStart) { // Dusk
            if (day_phase != 4 || no_transition_time) { // First occurance or instant tint
                $gameVariables.setValue(_dayPhaseVarId, 4); $gameMap.autoPlayBGS(); $gameMap.autoPlayBGM();
                if (_dayPhaseCE == 0 || !_useOnlyCE) {
                    _this.debug("Dusk phase (hour " + hour + ", " + fxTransitionTime + ", auto tint: " + auto_tint + ")", _tintDusk);
                    if (auto_tint) $gameScreen.startTint([_tintDusk.Red, _tintDusk.Green, _tintDusk.Blue, _tintDusk.Gray], fxTransitionTime);
                    if (_dayPhaseCE != 0) OcRam.runCE(_dayPhaseCE);
                } else {
                    _this.debug("Dusk phase", "(CE:" + _dayPhaseCE + ")"); OcRam.runCE(_dayPhaseCE);
                }
            }
        }

    };

    OcRam_Utils.setWeekday = function () {
        var sum = $gameVariables.value(_yearVarId) * _maxMonths * _daysPerMonth;
        sum += $gameVariables.value(_monthVarId) * _daysPerMonth + $gameVariables.value(_dayVarId);
        sum = sum % _maxWeekdays; if (sum != $gameVariables.value(_weekdayVarId)) $gameVariables.setValue(_weekdayVarId, sum);
    };

    this.addMinutes = function (v) {
        OcRam_Utils.addMinutes(v)
    }; this.addHours = function (v) {
        OcRam_Utils.addHours(v)
    }; this.addDays = function (v) {
        OcRam_Utils.addDays(v)
    }; this.addMonths = function (v) {
        OcRam_Utils.addMonths(v)
    }; this.subtractMinutes = function (v) {
        OcRam_Utils.subtractMinutes(v)
    }; this.subtractHours = function (v) {
        OcRam_Utils.subtractHours(v)
    };

    // ----------------------------------------------------------------------------
    // Plugin commands
    // ============================================================================
    this.extend(Game_Interpreter, "pluginCommand", function (command, args) {
        switch (command) {
            case "time":
                switch (args[0]) {
                    case "reverse": _this.debug("time reverse", args);
                        _timeReversed = OcRam.getBoolean(args[1]); break;
                    case "show": _this.debug("time show", args);
                        $gameSystem.showMapClock(); break;
                    case "hide": _this.debug("time hide", args);
                        $gameSystem.hideMapClock(); break;
                    case "start": _this.debug("time start", args);
                        $gameSwitches.setValue(_timeEnabledSwitchId, true); break;
                    case "stop": _this.debug("time stop", args);
                        $gameSwitches.setValue(_timeEnabledSwitchId, false); break;
                    case "add": _this.debug("time add ", args);
                        switch ((args[1] + "").toLowerCase()) {
                            case "minutes":
                                OcRam_Utils.addMinutes(parseInt(args[2])); break;
                            case "hours":
                                OcRam_Utils.addHours(parseInt(args[2])); break;
                            case "days":
                                OcRam_Utils.addDays(parseInt(args[2])); break;
                            case "months":
                                OcRam_Utils.addMonths(parseInt(args[2])); break;
                            default:
                                OC_Game_Interpreter_pluginCommand.call(this, command, args);
                        } break;
                    case "set": _this.debug("time set ", args);
                        if (args[5] !== undefined) {
                            $gameVariables.setValue(_yearVarId, parseInt(args[1]));
                            $gameVariables.setValue(_monthVarId, parseInt(args[2]));
                            $gameVariables.setValue(_dayVarId, parseInt(args[3]));
                            $gameVariables.setValue(_hourVarId, parseInt(args[4]));
                            $gameVariables.setValue(_minuteVarId, parseInt(args[5]));
                        } else if (args[3] !== undefined) {
                            $gameVariables.setValue(_yearVarId, parseInt(args[1]));
                            $gameVariables.setValue(_monthVarId, parseInt(args[2]));
                            $gameVariables.setValue(_dayVarId, parseInt(args[3]));
                        } else if (args[2] !== undefined) {
                            $gameVariables.setValue(_hourVarId, parseInt(args[1]));
                            $gameVariables.setValue(_minuteVarId, parseInt(args[2]));
                        } break;
                    case "interval": _this.debug("time interval ", args);
                        $gameVariables.setValue(_timeIntervalVarId, parseInt(args[1])); break;
                    default:
                        OC_Game_Interpreter_pluginCommand.call(this, command, args);
                } break;
            default:
                _this["Game_Interpreter_pluginCommand"].apply(this, arguments);
        }
    });

    if (Game_Map.prototype.unspawnEvent) {
        _this.debug("Using event spawner", Game_Map.prototype.unspawnEvent);
        this.extend(Game_Map, "unspawnEvent", function (eid) {
            _this["Game_Map_unspawnEvent"].apply(this, arguments); _isInteracting = false;
        });
    }

    Scene_Base.prototype.isSceneTitle = function () { return false; };
    Scene_Title.prototype.isSceneTitle = function () { return true; };
    Scene_Base.prototype.isSceneMap = function () { return false; };
    Scene_Map.prototype.isSceneMap = function () { return true; };

    // ------------------------------------------------------------------------------
    // RMMV core - Aliases
    // ==============================================================================

    var _weatherInUse = false;

    // Get weather variable id
    this.extend(Scene_Boot, "create", function () {
        if (Imported.OcRam_Weather_EX && OcRam.Weather_EX && parseFloat(OcRam.Weather_EX.version) > 2.03) {
            _weatherVariableId = Number(OcRam.Weather_EX.parameters['Weather Variable']); _weatherInUse = true;
            OcRam.Weather_EX.getWeathers().forEach(function (w) {
                if (w && w.Id) w._icon = ImageManager.loadOcRamBitmap('weather' + w.Id);
            });
        } _this["Scene_Boot_create"].apply(this, arguments);
    });
    
    // Setup time variables on NEW game and _isNewOrLoaded flag to true
    this.extend(DataManager, "setupNewGame", function () {
        _this["DataManager_setupNewGame"].apply(this, arguments);
        if (SceneManager._scene.isSceneTitle()) OcRam_Utils.initTimeVars();
        _isNewOrLoaded = true;
    });

    this.extend(Game_System, "onBeforeSave", function () {
        _this["Game_System_onBeforeSave"].apply(this, arguments);
        this._timeEnabled = _prevTSEnabledState;
        this._timeReversed = _timeReversed;
        this._showClockInMap = _showClockInMap;
    });

    this.extend(Game_System, "onAfterLoad", function () {
        _this["Game_System_onAfterLoad"].apply(this, arguments); 
        _timeReversed = this._timeReversed;
        _showClockInMap = this._showClockInMap;
        _prevTSEnabledState = this._timeEnabled;
        _oldSeason = $gameVariables.value(_seasonVarId);
    });

    this.extend(Scene_Load, "onLoadSuccess", function () {
        _this["Scene_Load_onLoadSuccess"].apply(this, arguments);
        _prevTSEnabledState = $gameSwitches.value(_timeEnabledSwitchId);
        _isNewOrLoaded = true; _gameJustLoaded = true;
    });

    // Check if menu / save scene was called >> Do not try to reload any tilesets
    this.extend(Scene_Map, "callMenu", function () {
        _this["Scene_Map_callMenu"].apply(this, arguments);
        _prevTSEnabledState = $gameSwitches.value(_timeEnabledSwitchId);
        $gameSwitches.setValue(_timeEnabledSwitchId, false);
    });

    this.extend(Scene_Save, "initialize", function () {
        _this["Scene_Save_initialize"].apply(this, arguments);
        if (!_this._menuCalled) _prevTSEnabledState = $gameSwitches.value(_timeEnabledSwitchId);
        _this._menuCalled = true; $gameSwitches.setValue(_timeEnabledSwitchId, false);
    });

    // Make sure that time enabled switch is also saved
    this.extend(Scene_Save, "onSavefileOk", function () {
        $gameSwitches.setValue(_timeEnabledSwitchId, _prevTSEnabledState);
        _this["Scene_Save_onSavefileOk"].apply(this, arguments);
    });

    // Re-init timer if in-game speed has been changed
    this.extend(Game_Variables, "onChange", function () {
        if (_prevInterVal != $gameVariables.value(_timeIntervalVarId)) {
            _this.debug("Time interval changed", this);
            _prevInterVal = $gameVariables.value(_timeIntervalVarId); OcRam_Utils.initTimer();
        } _this["Game_Variables_onChange"].apply(this, arguments);
    });

    // Set _justLoaded flag to true (for manual instant tint etc..)
    this.extend(Scene_Base, "initialize", function () {
        _this["Scene_Base_initialize"].apply(this, arguments); _justLoaded = true;
    });

    // Set _justLoaded flag to true on player transfer
    this.extend(Game_Player, "performTransfer", function () {
        _this["Game_Player_performTransfer"].apply(this, arguments); _justLoaded = true;
    });

    // Wait for all events to finish before setting _justLoaded -flag to false
    this.extend(Game_Map, "setupStartingEvent", function () {
        var ret = _this["Game_Map_setupStartingEvent"].apply(this, arguments);
        if (_justLoaded) {
            // Do heavy processing ONLY if needed (flag is on)
            if (!ret && !this.isAnyEventStarting() && !this.isEventRunning() && !this._interpreter.isRunning() && this._interpreter.eventId() < 1 && !$gameTemp.isCommonEventReserved()) {
                _this.debug("SET _justLoaded -flag to:", "false");
                _justLoaded = false;
            }
        } return ret;
    });

    // Stop time during interacts?
    if (_stopTimeOnInteract) {

        _this.debug("Time will be stopped on interact!", _stopTimeOnInteract)

        this.extend(Game_Event, "start", function () {
            if (this.list().length > 1) {
                _isInteracting = true;
            } _this["Game_Event_start"].apply(this, arguments);
        });

        this.extend(Game_Event, "unlock", function () {
            _this["Game_Event_unlock"].apply(this, arguments); _isInteracting = false;
        });

    }

    // Init timers
    this.extend(Scene_Map, "onMapLoaded", function () {

        OcRam_Utils.checkPhases();

        // Make it pitch black to not show sprites before tileset on season change
        if (_isNewOrLoaded) $gameScreen._brightness = 0;

        _this["Scene_Map_onMapLoaded"].apply(this, arguments);

        if (_this._menuCalled) {
            _this.debug("Menu / Save scene was called.", "No need for checks. Just restore previous enabled state.");
            _this._menuCalled = false; $gameSwitches.setValue(_timeEnabledSwitchId, _prevTSEnabledState);
        } else {
            $gameMap.changeSeason(); $gameMap.autoPlayBGS(); $gameMap.autoPlayBGM();
        } OcRam_Utils.initTimer(); // Init timer

        if (_isNewOrLoaded) { // Show graphics again
            window.setTimeout(function () {
                $gameScreen._brightness = 255;
            }, 250); _isNewOrLoaded = false;
        } _gameJustLoaded = false;

    });

    this.extend(Scene_Battle, "initialize", function () {
        if (!_stopTimeInBattles) OcRam_Utils.initTimer();
        _this["Scene_Battle_initialize"].apply(this, arguments);
    });

    // Clear timers
    this.extend(Scene_Map, "terminate", function () {
        _this.debug("clearInterval:", window._OC_Timer);
        window.clearInterval(window._OC_Timer); window._OC_Timer = undefined;
        _this["Scene_Map_terminate"].apply(this, arguments);
    });

    this.extend(Scene_Battle, "terminate", function () {
        if (!_stopTimeInBattles) {
            _this.debug("clearInterval:", window._OC_Timer);
            window.clearInterval(window._OC_Timer); window._OC_Timer = undefined;
        } _this["Scene_Battle_terminate"].apply(this, arguments);
    });

    this.extend(Game_Map, "changeTileset", function (tilesetId) {
        _this["Game_Map_changeTileset"].apply(this, arguments);
        this.autoPlayBGS(); this.autoPlayBGM(); _oldSeason = $gameVariables.value(_seasonVarId);
    });

    // ------------------------------------------------------------------------------
    // RMMV core - New methods
    // ==============================================================================
    Game_Map.prototype.changeSeason = function () {

        OcRam.setIndoorsFlag(); OcRam_Utils.checkPhases();

        _this._currentTilesetId = $gameMap._tilesetId;

        if (OcRam._isIndoors) return; // Do not change tileset if indoors

        OcRam_Utils.checkSeason(); var season = $gameVariables.value(_seasonVarId);

        if (!($gameMap._tilesetId > 0)) { _this.debug("$gameMap has no tileset?", $gameMap); return; }

        var tileset_meta = $dataMap.meta;
        if (tileset_meta["seasons"] == "disabled") return;
        
        var targetTilesetId = tileset_meta[OcRam_Utils.getSeasonText(season).toLowerCase()];

        if (targetTilesetId !== undefined) {
            targetTilesetId = parseInt(targetTilesetId);
        } else {
            _this.debug("No map season meta was found >> look for a tileset meta.", $gameMap);
            tileset_meta = $dataTilesets[$dataMap.tilesetId].meta;
            if (tileset_meta["seasons"] == "disabled") return;
            targetTilesetId = tileset_meta[OcRam_Utils.getSeasonText(season).toLowerCase()];
            try { // Make targetTilesetId as a number
                targetTilesetId = parseInt(targetTilesetId);
            } catch (ex) {
                targetTilesetId = 0; _this.debug("Tileset meta not found.", tileset_meta);
            }
        } if (isNaN(targetTilesetId)) targetTilesetId = 0;

        if (targetTilesetId != 0 && (targetTilesetId != $gameMap._tilesetId)) {
            _this.debug("Tileset CHANGED to: ", targetTilesetId);
            _this._prevTilesetId = $gameMap._tilesetId;
            _this._currentTilesetId = targetTilesetId;
            $gameMap.changeTileset(targetTilesetId);
        }
         
    };

    Game_System.prototype.isIndoors = function () {
        return OcRam._isIndoors;
    };

    Game_System.prototype.justLoaded = function () {
        return _justLoaded;
    };

    Game_Map.prototype.autoPlayBGS = function () {

        if (_gameJustLoaded || DataManager.isEventTest()) return; // this.isBattleTest() || DataManager.isEventTest();

        var season_txt = OcRam_Utils.getSeasonText($gameVariables.value(_seasonVarId));
        var day_phase = $gameVariables.value(_dayPhaseVarId) - 1;
        var bgs_name = ""; var bgs_meta = ""; var arr_phases;

        if ($dataMap) {
            // MAP META
            bgs_meta = $dataMap.meta["bgs-" + season_txt];
            if (bgs_meta !== undefined) {
                _this.debug("MAP bgs-season tag found:", bgs_meta); arr_phases = (bgs_meta + ",,,").split(",");
                if (arr_phases[day_phase] != "") { bgs_name = arr_phases[day_phase]; OcRam_Utils.playBGS(bgs_name, 100, 100, 0, 0); return; } // Season + phase found on map meta
                bgs_name = arr_phases[arr_phases.length - 4]; OcRam_Utils.playBGS(bgs_name, 100, 100, 0, 0); return; // Season found on map meta
            }

            bgs_meta = $dataMap.meta["bgs"];
            if (bgs_meta !== undefined) {
                _this.debug("MAP bgs tag found:", bgs_meta); arr_phases = (bgs_meta + ",,,").split(",");
                if (arr_phases[day_phase] != "") { bgs_name = arr_phases[day_phase]; OcRam_Utils.playBGS(bgs_name, 100, 100, 0, 0); return; } // Default phase found on map meta
                bgs_name = arr_phases[arr_phases.length - 4]; OcRam_Utils.playBGS(bgs_name, 100, 100, 0, 0); return; // Default found on map meta
            }
        } else {
            _this.debug("autoPlayBGS, $dataMap was:", "NULL ?!?");
        }

        // TILESET META
        if ($dataTilesets[$gameMap._tilesetId]) {
            bgs_meta = $dataTilesets[$gameMap._tilesetId].meta["bgs-" + season_txt];
            if (bgs_meta !== undefined) {
                _this.debug("TILESET bgs-season tag found:", bgs_meta); arr_phases = (bgs_meta + ",,,").split(",");
                if (arr_phases[day_phase] != "") { bgs_name = arr_phases[day_phase]; OcRam_Utils.playBGS(bgs_name, 100, 100, 0, 0); return; } // Season + phase found on map meta
                bgs_name = arr_phases[arr_phases.length - 4]; OcRam_Utils.playBGS(bgs_name, 100, 100, 0, 0); return;
            }
            bgs_meta = $dataTilesets[$gameMap._tilesetId].meta["bgs"];
            if (bgs_meta !== undefined) {
                _this.debug("TILESET bgs tag found:", bgs_meta); arr_phases = (bgs_meta + ",,,").split(",");
                if (arr_phases[day_phase] != "") { bgs_name = arr_phases[day_phase]; OcRam_Utils.playBGS(bgs_name, 100, 100, 0, 0); return; } // Default phase found on map meta
                bgs_name = arr_phases[arr_phases.length - 4]; OcRam_Utils.playBGS(bgs_name, 100, 100, 0, 0); return;
            }
        }

    };

    Game_Map.prototype.autoPlayBGM = function () {

        if (_gameJustLoaded || DataManager.isEventTest()) return;

        var season_txt = OcRam_Utils.getSeasonText($gameVariables.value(_seasonVarId));
        var day_phase = $gameVariables.value(_dayPhaseVarId) - 1;
        var bgm_name = ""; var bgm_meta = ""; var arr_phases;

        if ($dataMap) {
            // MAP META
            bgm_meta = $dataMap.meta["bgm-" + season_txt];
            if (bgm_meta !== undefined) {
                _this.debug("MAP bgm-season tag found:", bgm_meta); arr_phases = (bgm_meta + ",,,").split(",");
                if (arr_phases[day_phase] != "") { bgm_name = arr_phases[day_phase]; OcRam_Utils.playBGM(bgm_name, 100, 100, 0, 0); return; } // Season + phase found on map meta
                bgm_name = arr_phases[arr_phases.length - 4]; OcRam_Utils.playBGM(bgm_name, 100, 100, 0, 0); return; // Season found on map meta
            }

            bgm_meta = $dataMap.meta["bgm"];
            if (bgm_meta !== undefined) {
                _this.debug("MAP bgm tag found:", bgm_meta); arr_phases = (bgm_meta + ",,,").split(",");
                if (arr_phases[day_phase] != "") { bgm_name = arr_phases[day_phase]; OcRam_Utils.playBGM(bgm_name, 100, 100, 0, 0); return; } // Default phase found on map meta
                bgm_name = arr_phases[arr_phases.length - 4]; OcRam_Utils.playBGM(bgm_name, 100, 100, 0, 0); return; // Default found on map meta
            }
        } else {
            _this.debug("autoPlayBGM, $dataMap was:", "NULL ?!?");
        }

        // TILESET META
        if ($dataTilesets[$gameMap._tilesetId]) {
            bgm_meta = $dataTilesets[$gameMap._tilesetId].meta["bgm-" + season_txt];
            if (bgm_meta !== undefined) {
                _this.debug("TILESET bgm-season tag found:", bgm_meta); arr_phases = (bgm_meta + ",,,").split(",");
                if (arr_phases[day_phase] != "") { bgm_name = arr_phases[day_phase]; OcRam_Utils.playBGM(bgm_name, 100, 100, 0, 0); return; } // Season + phase found on map meta
                bgm_name = arr_phases[arr_phases.length - 4]; OcRam_Utils.playBGM(bgm_name, 100, 100, 0, 0); return;
            }
            bgm_meta = $dataTilesets[$gameMap._tilesetId].meta["bgm"];
            if (bgm_meta !== undefined) {
                _this.debug("TILESET bgm tag found:", bgm_meta); arr_phases = (bgm_meta + ",,,").split(",");
                if (arr_phases[day_phase] != "") { bgm_name = arr_phases[day_phase]; OcRam_Utils.playBGM(bgm_name, 100, 100, 0, 0); return; } // Default phase found on map meta
                bgm_name = arr_phases[arr_phases.length - 4]; OcRam_Utils.playBGM(bgm_name, 100, 100, 0, 0); return;
            }
        }

    };

    // Other plugins may hook-up on this if something needs to be done every 'second'
    window.processInterval_OC = function () {
        if ($dataMap == null) return;
        if ($gameSwitches.value(_timeEnabledSwitchId) && !_isInteracting) {
            OcRam_Utils.addMinutes(_timeReversed ? -1 : 1); if (_changeTilesetImmediatly) _this.updateSeasonalTileset();
        }
    };

    // ------------------------------------------------------------------------------
    // Game_System - Hide and show map clock
    // ==============================================================================

    Game_System.prototype.hideMapClock = function () {
        _showClockInMap = false;
        if (SceneManager._scene._mapClock) {
            SceneManager._scene._mapClock.close();
            SceneManager._scene.removeChild(SceneManager._scene._mapClock);
        }
    };

    Game_System.prototype.showMapClock = function () {
        _showClockInMap = true;
        if (SceneManager._scene._mapNameWindow) {
            if (!_mapClockAlign) _mapClockAlign = 9;
            SceneManager._scene.createMapClock();
        }
    };

    // ------------------------------------------------------------------------------
    // OcRam - Clock window to MENU (based on 'gold' window)
    // ==============================================================================

    this.extend(Scene_Menu, "create", function () {
        _this["Scene_Menu_create"].apply(this, arguments);
        if (_showClockInMenu) this.createClockWindow();
    });

    Scene_Menu.prototype.createClockWindow = function () {
        this._clockWindow = new Window_Clock(0, 0);
        this._clockWindow.y = this._commandWindow.height + 2;
        this.addWindow(this._clockWindow);
    };

    function Window_Clock() {
        this.initialize.apply(this, arguments);
    }

    Window_Clock.prototype = Object.create(Window_Base.prototype);
    Window_Clock.prototype.constructor = Window_Clock;

    Window_Clock.prototype.initialize = function (x, y) {
        var width = this.windowWidth();
        var height = this.windowHeight();
        Window_Base.prototype.initialize.call(this, x, y, width, height);
        this.refresh();
    };

    Window_Clock.prototype.windowWidth = function () {
        return 240;
    };

    Window_Clock.prototype.windowHeight = function () {
        if (_weatherInUse && OcRam.getBoolean(OcRam.Weather_EX.parameters['Show weather in menu'])) {
            return this.fittingHeight(3) - 4;
        } else {
            return this.fittingHeight(2) - 4;
        }
    };

    Window_Clock.prototype.refresh = function () {

        var width = this.contents.width - this.textPadding() * 2 + 10;
        this.contents.clear(); this.resetTextColor();

        this.contents.fontSize = this.standardFontSize() - 2;
        this.contents.fontFace = this.standardFontFace();

        this.drawText(_this.getDayMonth(), 0, 0, width, 'left');
        this.drawText($gameVariables.value(_yearVarId), 0, 0, width, 'right');

        if (_weatherInUse && OcRam.getBoolean(OcRam.Weather_EX.parameters['Show weather in menu'])) {
            this.drawText((_timeFormat == 0) ? _this.getWeekdayStringLong() : _this.getWeekdayString(), 0, this.contents.height * 0.333, width, 'left');
            this.drawText(_this.getTimeString(), 0, this.contents.height * 0.333, width, 'right');
            this.drawText(OcRam.Weather_EX.getWeatherName(), 0, this.contents.height * 0.666, width, 'left');
            var bm = (OcRam.Weather_EX.getCurrentWeather())._icon;
            if (bm) {
                this.contents.blt(bm, 0, 0, bm.width, bm.height, this.contents.width - bm.width - 1, this.contents.height * 0.666);
            } else {
                var phase = Number($gameVariables.value(_dayPhaseVarId)) - 1; if (!phase) phase = 0; if (phase < 0) phase = 0; if (phase > 3) phase = 3; bm = _phaseBitmaps[phase]
                this.contents.blt(bm, 0, 0, bm.width, bm.height, this.contents.width - bm.width - 1, this.contents.height * 0.666);
            }
        } else {
            this.drawText((_timeFormat == 0) ? _this.getWeekdayStringLong() : _this.getWeekdayString(), 0, this.contents.height * 0.5, width, 'left');
            this.drawText(_this.getTimeString(), 0, this.contents.height * 0.5, width, 'right');
        }

    };

    Window_Clock.prototype.open = function () {
        this.refresh(); Window_Base.prototype.open.call(this);
    };

    // ------------------------------------------------------------------------------
    // OcRam - Clock window to MAP (based on 'map name' window)
    // ==============================================================================
    this.extend(Scene_Map, "createDisplayObjects", function () {
        _this["Scene_Map_createDisplayObjects"].apply(this, arguments);
        if ($gameVariables.value(_monthVarId)) this.createMapClock();
    });

    Scene_Map.prototype.createMapClock = function () {
        if (_showClockInMap) {
            this._mapClock = new Window_MapClock();
            this.addChild(this._mapClock); this._mapClock.update();
        }
    };

    function Window_MapClock() {
        this.initialize.apply(this, arguments);
    }

    Window_MapClock.prototype = Object.create(Window_Base.prototype);
    Window_MapClock.prototype.constructor = Window_MapClock;

    Window_MapClock.prototype.initialize = function () {

        var width = 120; var height = this.fittingHeight(1); var y = 0; var x = 0; var margin = 20;

        if (_clockType != 0) {
            width = _clockBitmap.width; height = _clockBitmap.height;
            width += margin + _mapClockPadding * 2; height += margin + _mapClockPadding * 2;
        }

        switch (_mapClockAlign) {
            case 1: // Bottom-Left
                x = -margin + _mapClockPadding; y = Graphics.height - height + margin - _mapClockPadding; break;
            case 2: // Bottom-Center
                x = Graphics.width * 0.5 - width * 0.5; y = Graphics.height - height + margin - _mapClockPadding; break;
            case 3: // Bottom-Right
                x = Graphics.width - width + margin - _mapClockPadding; y = Graphics.height - height + margin - _mapClockPadding; break;
            case 7: // Top-Left
                x = -margin + _mapClockPadding; y = -margin + _mapClockPadding; break;
            case 8: // Top-Center
                x = Graphics.width * 0.5 - width * 0.5; y = -margin + _mapClockPadding; break;
            case 9: // Top-Right
                x = Graphics.width - width + margin - _mapClockPadding; y = -margin + _mapClockPadding; break;
            default: break;
        }

        Window_Base.prototype.initialize.call(this, x, y, width, height);
        this._x = x; this._y = y; this._width = width; this._height = height;
        _prevMin = -1; _prevHour = -1;
        this.opacity = 0; this.refresh();

    };

    Window_MapClock.prototype.windowWidth = function () {
        return this._width;
    };

    Window_MapClock.prototype.windowHeight = function () {
        return this._height;
    };

    Window_MapClock.prototype.update = function () {
        Window_Base.prototype.update.call(this); this.refresh();
    };

    Window_MapClock.prototype.open = function () {
        this.refresh();
    };

    Window_MapClock.prototype.refresh = function () {

        if (_prevMin != $gameVariables.value(_minuteVarId) || _prevHour != $gameVariables.value(_hourVarId)) {

            this.contents.clear();
            var width = this.contentsWidth();

            if (_clockType == 0) {
                this.contents.fontSize = _timeFormat == 0 ? 24 : 20;
                this.drawBackground(0, 0, width, this.lineHeight());
                this.drawText(_this.getTimeString(), 0, 0, width, 'center');
            } else {
                if (_clockType == 1) {
                    this.drawAnalogClock();
                } else {
                    this.drawDigitalClock();
                }
            } _prevMin = $gameVariables.value(_minuteVarId);
            _prevHour = $gameVariables.value(_hourVarId);
        }

    };

    Window_MapClock.prototype.drawMinuteHand = function (ctx) {

        ctx.lineWidth = 1; ctx.lineCap = "round"; ctx.lineJoin = "round";

        var pos = $gameVariables.value(_minuteVarId);
        var hand_length = _minuteHandLength;
        var angle = (pos * 6) - 90;

        var radians = angle * Math.PI / 180;
        var x = Math.cos(radians) * hand_length + _epiCenter[0];
        var y = Math.sin(radians) * hand_length + _epiCenter[1];

        ctx.line(_epiCenter[0], _epiCenter[1], x, y);

        // "TAIL"
        ctx.lineWidth += 1; hand_length = hand_length * 0.2;

        angle = ((pos + 30) * 6) - 90;
        radians = (angle) * Math.PI / 180;
        x = Math.cos(radians) * hand_length + _epiCenter[0];
        y = Math.sin(radians) * hand_length + _epiCenter[1];

        ctx.line(_epiCenter[0], _epiCenter[1], x, y);

    };

    Window_MapClock.prototype.drawHourHand = function (ctx) {

        ctx.lineWidth = 3; ctx.lineCap = "round"; ctx.lineJoin = "round";

        var pos = $gameVariables.value(_hourVarId) % 12;
        pos = pos * 60 + $gameVariables.value(_minuteVarId);

        var hand_length = _hourHandLength;
        var angle = (pos * 0.5) - 90;

        var radians = angle * Math.PI / 180;
        var x = Math.cos(radians) * hand_length + _epiCenter[0];
        var y = Math.sin(radians) * hand_length + _epiCenter[1];

        ctx.line(_epiCenter[0], _epiCenter[1], x, y);

        // "TAIL"
        hand_length = hand_length * 0.1;

        angle = ((pos + 360) * 0.5) - 90;
        radians = (angle) * Math.PI / 180;
        x = Math.cos(radians) * hand_length + _epiCenter[0];
        y = Math.sin(radians) * hand_length + _epiCenter[1];

        ctx.line(_epiCenter[0], _epiCenter[1], x, y);

    };

    Window_MapClock.prototype.drawClockTextLayout = function () {

        var text_to_draw = ""; var tc = this;

        _clockElements.forEach(function (elem) {
            text_to_draw = "";
            switch (elem.Type) {
                case 0: // d. month yyyy
                    text_to_draw = _this.getDateStringLong(); break;
                case 1: // d. mon yyyy
                    text_to_draw = _this.getDateString(); break;
                case 2: // d. month
                    text_to_draw = _this.getDayMonthLong(); break;
                case 3: // d. mon
                    text_to_draw = _this.getDayMonth(); break;
                case 4: // d.
                    text_to_draw = $gameVariables.value(_dayVarId) + "."; break;
                case 5: // month
                    text_to_draw = _this.getMonthStringLong(); break;
                case 6: // mon
                    text_to_draw = _this.getMonthString(); break;
                case 7: // weekday
                    text_to_draw = _this.getWeekdayStringLong(); break;
                case 8: // wd
                    text_to_draw = _this.getWeekdayString(); break;
                case 9: // season
                    text_to_draw = _this.getSeasonString(); break;
                case 10: // year
                    text_to_draw = $gameVariables.value(_yearVarId); break;
                case 11: // time
                    text_to_draw = _this.getTimeString(); break;
                case 12: // weather
                    if (_weatherInUse) {
                        text_to_draw = OcRam.Weather_EX.getWeatherName();
                    } else {
                        text_to_draw = "";
                    } break;
                case 16: // day phase icon
                    var phase = Number($gameVariables.value(_dayPhaseVarId)) - 1; if (!phase) phase = 0; if (phase < 0) phase = 0; if (phase > 3) phase = 3;
                    this.contents.blt(_phaseBitmaps[phase], 0, 0, _phaseBitmaps[phase].width, _phaseBitmaps[phase].height, elem.X, elem.Y);
                    break;
                case 17: // weather icon
                    if (_weatherInUse) {
                        if (tc._weatherId != $gameVariables.value(_weatherVariableId)) {
                            tc._weatherId = $gameVariables.value(_weatherVariableId);
                            var wo = OcRam.Weather_EX.getJsonWeatherById(Number($gameVariables.value(_weatherVariableId)));
                            if (wo) {
                                tc._weatherIcon = OcRam.Weather_EX.getJsonWeatherById(Number($gameVariables.value(_weatherVariableId)))._icon
                            } else {
                                tc._weatherIcon = null;
                            }
                        } if (tc._weatherIcon) {
                            var bm = tc._weatherIcon;
                            this.contents.blt(bm, 0, 0, bm.width, bm.height, elem.X, elem.Y);
                        }
                    } break;
            } if (elem.Type < 16) {
                this.contents.fontSize = elem.FontSize || 18; this.contents.fontFace = elem.FontFace || 'GameFont';
                this.drawText(text_to_draw, elem.X, elem.Y, elem.Width, elem.Align == 0 ? 'left' : elem.Align == 1 ? 'right' : 'center');
            }
        }.bind(this));

    };

    Window_MapClock.prototype.drawAnalogClock = function () {
        this.contents.blt(_clockBitmap, 0, 0, _clockBitmap.width, _clockBitmap.height, 0, 0);
        this.drawMinuteHand(this.contents._context); this.drawHourHand(this.contents._context);
        this.drawClockTextLayout();
    };

    Window_MapClock.prototype.drawDigitalClock = function () {

        this.contents.blt(_clockBitmap, 0, 0, _clockBitmap.width, _clockBitmap.height, 0, 0);
        var w = _digitalClockWidth; this.contents.fontSize = _digitalFontSize; this.contents.fontFace = _digitalFontFace;

        if ($gameVariables.value(_minuteVarId) % 2 && _digitalBlink) {
            this.drawText(_this.getTimeString().replace(":", " "), _epiCenter[0] - w * 0.5, _epiCenter[1] - this.contents.fontSize * 0.75, w, 'center');
        } else {
            this.drawText(_this.getTimeString(), _epiCenter[0] - w * 0.5, _epiCenter[1] - this.contents.fontSize * 0.75, w, 'center');
        } this.drawClockTextLayout();

    };

    Window_MapClock.prototype.drawBackground = function (x, y, width, height) {
        var color1 = '#00000088'; var color2 = '#00000022';
        this.contents.gradientFillRect(x, y, width / 2, height, color2, color1);
        this.contents.gradientFillRect(x + width / 2, y, width / 2, height, color1, color2);
    };

}.bind(OcRam.Time_System)());