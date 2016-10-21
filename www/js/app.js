var BASE_URL = 'https://vendor.eureka-platform.com';
var ENV = 'production';
var ENV_TARGET = 'phonegap'; // html5, phonegap
if (window.location.hostname == 'eboxsmart.phonegap.local') {
    BASE_URL = 'http://eureka.vendor';
    ENV = 'dev';
}
var API = BASE_URL+'/api/mobile';

var objUser = {};
var audioEnable = true;
var doRefresh = true;

var baseLanguage = 'en';        

var objConfig = {
   'version': '1.0.0',
   'build': "1832",
   'release_time': '2014.09.13 11:00',
   'platform': 'Android'
};

// INIT SETTING: config
var dbAppUserSettings = dbAppUserSettings || fwkStore.DB("user_settings");
var objUserSettings = {}; 

// INIT TREATMENTS
var dbAppUserTreatments = dbAppUserTreatments || fwkStore.DB("user_treatments");
var objUserTreatments = {};

/*
// custom native log
window.console=(function(origConsole){

    if(!window.console)
      console = {};
    var isDebug=true,
    logArray = {
      logs: [],
      errors: [],
      warns: [],
      infos: []
    }
    return {
        log: function(){
          logArray.logs.push(arguments);
          if (typeof(arguments[0]) == "object") $('.log').prepend('<li>'+new Date().toISOString() + ' > '+JSON.stringify(arguments[0])+'</li>');
          else $('.log').prepend('<li>'+new Date().toISOString() + ' > '+arguments[0]+'</li>');  
          //$("#app-status-ul").prepend('<li>'+message+'</li>');
          isDebug && origConsole.log && origConsole.log.apply(origConsole,arguments);
        },
        warn: function(){
          logArray.warns.push(arguments)
          isDebug && origConsole.warn && origConsole.warn.apply(origConsole,arguments);
        },
        error: function(){
          logArray.errors.push(arguments)
          isDebug && origConsole.error && origConsole.error.apply(origConsole,arguments);
        },
        info: function(v){
          logArray.infos.push(arguments)
          isDebug && origConsole.info && origConsole.info.apply(origConsole,arguments);
        },
        debug: function(bool){
          isDebug = bool;
        },
        logArray: function(){
          return logArray;
        }
    };

}(window.console));
*/

var app = {
    // Application Constructor
    initialize: function() {
        
        app.treatments.init();
        
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
                  
        if (ENV == 'dev') {
            /*
            jQuery(document).ready(function($){	
               
                // Adjust canvas size when browser resizes
                $(window).resize( app.treatments.respondPill );

                // Adjust the canvas size when the document has loaded.
                app.treatments.respondPill();
            });
            */
        
            ln.init();        
            baseLanguage = ln.language.code;
                
            initFramework();
               
            //var a = app.date.formatDateToTimestamp('2014-05-07 09:40:00');
            //console.log(a);
        
            // get automatically user from session
            objUser = window.sessionStorage.getItem('user');
            
            if (objUser) {
                objUser = JSON.parse(objUser);	
                console.log('retrieved user: ', objUser);
                            
            } else {
                objUser = {};
            }                     
                                            
            if (Object.keys(objUser).length == 0) {                           
				var result = app.auth.checkPreAuth(false); 
                if (!result) return;
            } 
            
            initAfterLogin();			
        }
		        
		//document.addEventListener('load', this.onDeviceReady, true);		
    },
    // deviceready Event Handler
    getPhoneGapPath: function () {
        'use strict';
        var path = window.location.pathname;
        var phoneGapPath = path.substring(0, path.lastIndexOf('/') + 1);
        return phoneGapPath;
        	
        // iOS: /var/mobile/Applications/{GUID}/{appName}/www/

        //Android: /android_asset/www/
    },
    onDeviceReady: function() {	
		console.log('onDeviceReady');
                 
        // translation init
        ln.init();        
        baseLanguage = ln.language.code;
        
        app.treatments.localNotificationInit();
				
        if (ENV == 'production') {
            // hide the status bar using the StatusBar plugin
            //StatusBar.hide();
        
            objConfig.platform = device.platform;
            
            /*
            var iOS7 = window.device && window.device.platform && window.device.platform.toLowerCase() == "ios" && parseFloat(window.device.version) >= 7.0;
            if (iOS7) {
                $('body').addClass('iOS7');
                //document.body.style.marginTop = "20px";
            }    
            */
    
            initFramework();
            
            
            objUser = window.sessionStorage.getItem('user');
            if (objUser) {
                objUser = JSON.parse(objUser);	
                console.log('retrieved user: ', objUser);
                            
            } else {
                objUser = {};
            }                     
            
            if (Object.keys(objUser).length == 0) {           
				var result = app.auth.checkPreAuth(false); 
                if (!result) return;
            } 
            
            initAfterLogin();	            
        }
                        
        
        // document.addEventListener("offline", this.onOffline, false);
        // document.addEventListener("online", this.onOnline, false);
        
        // save device info the first time for mobile's ower (device uuid)
        // http://docs.phonegap.com/en/3.2.0/cordova_device_device.md.html#Device
    },
    onOffline: function() {
        // Handle the offline event
    },
    onOnline: function() {
        // Handle the online event
    },
	checkConnection: function() {
		var networkState = navigator.connection.type;

		var states = {};
		states[Connection.UNKNOWN]  = 'Unknown connection';
		states[Connection.ETHERNET] = 'Ethernet connection';
		states[Connection.WIFI]     = 'WiFi connection';
		states[Connection.CELL_2G]  = 'Cell 2G connection';
		states[Connection.CELL_3G]  = 'Cell 3G connection';
		states[Connection.CELL_4G]  = 'Cell 4G connection';
		states[Connection.CELL]     = 'Cell generic connection';
		states[Connection.NONE]     = 'No network connection';

		console.log('Connection type: ' + states[networkState]);
		if (networkState !== Connection.NONE) return true;
		else return false;
	}
};

// --
// functions
// --

function initAfterLogin() {
  doRefresh = true;
  
  //app.treatments.localNotificationInit();
             
  $('#nickname').html(objUser.first_name);
            		
  //language
  $('#selectlanguage').val(baseLanguage);                        
  $('body').i18n();
        
}

function alertDismissed() {
    // do something
}

    /* 
     * mobile framework - Change Page
     * pageid = test.html or #changePage
     */
    function mofChangePage(pageid, options) {
        console.log('mofChangePage '+pageid);
        mainView.loadPage(pageid);
        //$('body').i18n();
    }
	
    /* 
     * mobile framework - Show/hide loading page
     * show: true/false
     */
    function mofLoading(show) {
        console.log('loading '+show); 
        if (show) fw7.showPreloader();
        else fw7.hidePreloader();               
    }
	   
    /* 
     * mobile framework - Show/hide loading page
     * show: true/false
     */
    function mofAlert(message, title) {
        if (title == undefined) title = app_settings.package_name || 'Alert';
        fw7.alert(message, title);               
    }
    
    function mofProcessBtn(id, state) {
        if (state) {
            //$(id).addClass("ui-state-disabled");
            $(id).attr("disabled", "true");
            //$(id).html('processing...');
        } else {
            //$(id).removeClass("ui-state-disabled");
            $(id).removeAttr("disabled");
        }
    }
// ---------------------
// TRANSLATE
// ---------------------
var month, calendarTranslate;

function initTranslate() {

        month=new Array();
        month[0]="January";
        month[1]="February";
        month[2]="March";
        month[3]="April";
        month[4]="May";
        month[5]="June";
        month[6]="July";
        month[7]="August";
        month[8]="September";
        month[9]="October";
        month[10]="November";
        month[11]="December"; 
        
        calendarTranslate = {
            monthNames:	["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            today: 'today',
            day: 'day',
            week: 'week',
            month: 'month',
   
            treatments: 'Treatments',
            night: 'Night',
            morning: 'Morning',
            noon: 'Noon',
            evening: 'Evening'
        };    
        if (baseLanguage === 'fr') {
      
        	calendarTranslate.monthNames =	['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
			calendarTranslate.monthNamesShort = ['Janv','Févr','Mars','Avr','Mai','Juin','Juil','Août','Sept','Oct','Nov','Déc'];
			calendarTranslate.dayNames = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
			calendarTranslate.dayNamesShort = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
       
            calendarTranslate.today = 'aujourd\'hui';
		    calendarTranslate.day = 'jour';
		    calendarTranslate.week = 'semaine';
		    calendarTranslate.month = 'mois';
 
            calendarTranslate.treatments = 'Traitements';
            calendarTranslate.night = 'Nuit';
            calendarTranslate.morning = 'Matin';
            calendarTranslate.noon = 'Midi';
            calendarTranslate.evening = 'Soir';
            
            month[0]="Janvier";
            month[1]="Février";
            month[2]="Mars";
            month[3]="Avril";
            month[4]="Mai";
            month[5]="Juin";
            month[6]="Juillet";
            month[7]="Août";
            month[8]="Septembre";
            month[9]="Octobre";
            month[10]="Novembre";
            month[11]="Décembre";                                 
        }
}

// ---------------------
// DATE
// ---------------------
app.date = {};

//2013-06-03 08:00:00
app.date.formatDateToTimestamp = function(d) {
    //new Date().getTime()
    //(year, month, day, hours, minutes, seconds, milliseconds)    
    //console.log(parseInt(d.substr(0,4)) + ' '+(parseInt(d.substr(5,2)) - 1) + ' '+parseInt(d.substr(8,2))  );
    
    //console.log(d + ' ' + parseInt(d.substr(11,2)) + ' ' + parseInt(d.substr(17,2)));
                
    var current = new Date(parseInt(d.substr(0,4)), (parseInt(d.substr(5,2)) - 1), parseInt(d.substr(8,2)), parseInt(d.substr(11,2)), parseInt(d.substr(14,2)), parseInt(d.substr(17,2)) );
    //console.log(current.getTime());   
	return current;    
};

//2013-06-03 or 2013-06-03 08:00:00 or 20140929 to label
app.date.formatDateToLabel = function(d) {
    var current;
    if (d.length == 8) current = new Date(parseInt(d.substr(0,4)), (parseInt(d.substr(4,2)) - 1), parseInt(d.substr(6,2)), 0, 0, 0); 
    else if (d.length == 10) current = new Date(parseInt(d.substr(0,4)), (parseInt(d.substr(5,2)) - 1), parseInt(d.substr(8,2)), 0, 0, 0 );
    else current = app.date.formatDateToTimestamp(d);
    var dd = current.getDate().toString();
    var str = calendarTranslate.dayNames[current.getDay()]+' '+(dd[1]?dd:"0"+dd[0])+' '+calendarTranslate.monthNames[current.getMonth()];
    return str;
};

app.date.formatyyyymmdd = function(d) {         
                           
        var yyyy = d.getFullYear().toString();                                    
        var mm = (d.getMonth()+1).toString(); // getMonth() is zero-based         
        var dd  = d.getDate().toString();             
                            
        return '' + yyyy + (mm[1]?mm:"0"+mm[0]) + (dd[1]?dd:"0"+dd[0]);
        //return yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]);
};

app.date.getTodayTime = function() {
  // get today current time
    var d = new Date();
    var ho = ''+d.getHours();
    if (ho.length == 1) ho = '0'+ho;   
    var mi = ''+d.getMinutes();
    if (mi.length == 1) mi = '0'+mi;  
    var currentTodayTime = parseInt(ho + mi,10);    
    return currentTodayTime;
};

// convert 20140526 to a prev next object string
app.date.formatDateToObject = function(d) {
    var info = {};      
    var today = new Date();
    info.str_today = app.date.formatyyyymmdd(today);
    
    var hh  = today.getHours().toString();  
    var mm  = today.getMinutes().toString();           
                            
    info.str_time = '' + (hh[1]?hh:"0"+hh[0]) + (mm[1]?mm:"0"+mm[0]);
    
    var current = new Date(parseInt(d.substr(0,4)), (parseInt(d.substr(4,2)) - 1), parseInt(d.substr(6,2)) );
    info.current = current.getTime();
    info.str_current = d; 
    //var next = current;
    var next = new Date(current.getTime());
    next = new Date(next.setDate(next.getDate() + 1));
    info.next = next.getTime();
    info.str_next = app.date.formatyyyymmdd(next);

    // var prev = current;
    var prev = new Date(current.getTime());
    prev = new Date(prev.setDate(prev.getDate() - 1));
    info.prev = prev.getTime();
    info.str_prev = app.date.formatyyyymmdd(prev);
           
    // label
    var dd = current.getDate().toString();
    info.label_night_day = (next.getDate().toString()[1]?next.getDate().toString():"0"+next.getDate().toString()[0]);
    info.label_current_day = calendarTranslate.dayNamesShort[current.getDay()];
  
    info.current_section = 'archive';
    if (d === info.str_today) {        
        info.label_current_day = calendarTranslate.today.toUpperCase()+', '+ info.label_current_day;
        
        // morning: 0600 - 1200, noon (12 - 18), evening (18 - 00), night (00 - 06)
        var time = parseInt(info.str_time, 10);
        info.time = time;
        if (time >= 0 && time < 600) info.current_section = 'night';
        else if (time >= 600 && time < 1200) info.current_section = 'morning';
        else if (time >= 1200 && time < 1800) info.current_section = 'noon';
        else if (time >= 1800 && time < 2400) info.current_section = 'evening';
    }
    if (baseLanguage === 'fr') {
        
        info.label_current = (dd[1]?dd:"0"+dd[0])+' '+calendarTranslate.monthNamesShort[current.getMonth()];
       
        info.label_current_full = calendarTranslate.dayNamesShort[current.getDay()] + ' ' + info.label_current;
        info.label_next_full = calendarTranslate.dayNamesShort[next.getDay()] + ' ' + (next.getDate().toString()[1]?next.getDate().toString():"0"+next.getDate().toString()[0]) + ' ' + calendarTranslate.monthNamesShort[next.getMonth()];
        info.label_prev_full = calendarTranslate.dayNamesShort[prev.getDay()] + ' ' + (prev.getDate().toString()[1]?prev.getDate().toString():"0"+prev.getDate().toString()[0]) + ' ' + calendarTranslate.monthNamesShort[prev.getMonth()];
       // info.label_next_day = (dd[1]?dd:"0"+dd[0])+' '+calendarTranslate.monthNamesShort[next.getMonth()];
        //info.label_next_day = next.getDate().toString()+' '+calendarTranslate.monthNamesShort[next.getMonth()];
    } else {
        info.label_current = calendarTranslate.monthNamesShort[current.getMonth()]+', '+(dd[1]?dd:"0"+dd[0]);
        //info.label_next_day = calendarTranslate.monthNamesShort[next.getMonth()]+', '+next.getDate().toString();
        info.label_current_full = calendarTranslate.dayNamesShort[current.getDay()] + ' ' + info.label_current;
        info.label_next_full = calendarTranslate.dayNamesShort[next.getDay()] + ' ' + calendarTranslate.monthNamesShort[next.getMonth()] + ', '+(next.getDate().toString()[1]?next.getDate().toString():"0"+next.getDate().toString()[0]);
        info.label_prev_full = calendarTranslate.dayNamesShort[prev.getDay()] + ' ' + calendarTranslate.monthNamesShort[prev.getMonth()] + ', '+(prev.getDate().toString()[1]?prev.getDate().toString():"0"+prev.getDate().toString()[0]);
      
    }    
  
    console.log(info);
	return info;    
};

app.date.generateProcessingId = function() {
    var d = new Date();
    return d.getMinutes()+''+d.getSeconds()+''+d.getMilliseconds();
};

// ---------------------
// AUTH
// ---------------------          
app.auth = {};
       
app.auth.checkPreAuth = function(login) {
	console.log('AUTH - checkPreAuth');
                          
    var result = false;                    
	if(Object.keys(objUser).length == 0 && window.localStorage["username"] != undefined && window.localStorage["password"] != undefined) {			         
		app.auth.handleLogin(window.localStorage["username"], window.localStorage["password"], false);
	} else if (Object.keys(objUser).length == 0) {
        if (login === false) mofChangePage('login.html');
    }
        
    return result; 
}

app.auth.handleLoginForm = function() {
	console.log('AUTH - handleLoginForm');			
	var form = $("#loginForm");  		
	var u = $("#username", form).val();
	var p = $("#password", form).val();
    app.auth.handleLogin(u, p, true); 
}
        
app.auth.handleLogin = function(u,p,fromform) {
	console.log('AUTH - handleLogin fromform='+fromform);		

    // show loading icon
    //$.mobile.showPageLoadingMsg(); 
    //$.mobile.loading( 'show' );
    //$.mobile.showPageLoadingMsg("b", "This is only a test", true);
   
    if (fromform === true) mofProcessBtn("#btnLogin", true);
	//var form = $("#loginForm");  	
	//disable the button so we can't resubmit while we wait
	//$("#submitButton",form).attr("disabled","disabled");
	//$("#btnLogin").attr("disabled","disabled");
	//var u = $("#username", form).val();
	//var p = $("#password", form).val();	
	
	if(u != '' && p!= '') {            
        //mofLoading(true);
                      
        $.ajax({
            type: "POST",
            url: API+"/authloginpatient",
            async: true,
            dataType: 'json',
            data: {login:u,pass:p,rememberme:1},
            success: function(res, textStatus, jqXHR) {
                    console.log(res);
                    //$.mobile.hidePageLoadingMsg();
                    if(res.success == true) {
                        //http://stackoverflow.com/questions/5124300/where-cookie-is-managed-in-phonegap-app-with-jquery
                        //http://stackoverflow.com/questions/8358588/how-do-i-enable-third-party-cookies-under-phonegap-and-android-3-2
                        
                        var header = jqXHR.getAllResponseHeaders();
                        var match = header.match(/(Set-Cookie|set-cookie): (.+?);/);
                        //console.log(match);
                        if(match) {
                            my_saved_cookie = match[2];
                            console.log(my_saved_cookie);
                            window.localStorage.setItem("session",my_saved_cookie);
                        }
                            
                        //store
                        window.localStorage["username"] = u;
                        window.localStorage["password"] = p; 			
                        //window.sessionStorage["user_id"] = res.user.user_id; 
                        window.sessionStorage.setItem('user', JSON.stringify(res.user)); // should be localstorage with a timestamp cache

                        //dbAppUser.put(res.user);
                        
                        objUser = res.user;                                     
            
                        // launch the push notification center because it's required objUser
                        if (ENV == 'production') {
                            push_onDeviceReady();
                        }
                        
                        //mofLoading(false);
                        
                        if (fromform === true) {
                            mofProcessBtn("#btnLogin", false);
                        
                            mofChangePage('index.html');
                        } else {
                            console.log('auto login success');     
                            
                            initAfterLogin();	                           
                        }
                    } else {	
                        console.log(res.message);
                         
                        //mofLoading(false);
                        
                        if (ENV == 'dev' || ENV == 'production') {
                            mofAlert(res.message);
                        } else {
                            navigator.notification.alert(res.message, alertDismissed);
                        }					
                        if (fromform === true) mofProcessBtn("#btnLogin", false);
                   }	
            }                   
		});
	} else {        
		if (ENV == 'dev' || ENV == 'production' ) {
			mofAlert('You must enter a username and password');                
		} else {
			navigator.notification.alert("You must enter a username and password", alertDismissed);
		}
		if (fromform === true) mofProcessBtn("#btnLogin", false);
	}
	return false;
}

app.auth.handleLogout =	function() {
	console.log('AUTH - handleLogout');	
	mofProcessBtn(".btn-logout", true);
	$.getJSON(API+"/authlogoutpatient", function(res) {
		if (res.success) {
			window.localStorage.clear();  
			window.sessionStorage.clear();	

	        objUser = {};				
                
            mofProcessBtn(".btn-logout", false);
            mofChangePage('login.html');
		}
	});				
}
    	
app.auth.goRegister = function() {
	window.plugins.ChildBrowser.showWebPage('http://patient.eureka-platform.com', { showLocationBar: true });
}
    
/*
app.auth.handleUpdateNotification = function(current_status) {
	console.log('AUTH - handleUpdateNotification '+current_status);			
        
    $.ajax({
        url : API+"/account/notificationstatus",
        type: "POST",
        dataType : 'json',
        data:{user_seq: objUser.uuid, action:'notificationStatus', status:current_status},
        success :function(data){
			console.log(data);
        },
        error:function(data){    
			console.log(data);			  
        } 
    });       
}
*/
            
jQuery(document).ready(function($){
		        
	$(document).on('click', '.btn-logout', app.auth.handleLogout);

	$(document).on('click', "#btnLogin", app.auth.handleLoginForm);
    
    $(document).on('change', '#selectlanguage', function(e) {		
        var current_status = $(this).val();
        console.log('selectlanguage '+current_status);
        //alert(current_status);
        //displayLanguage();
       
        i18n.setLng(current_status, function(t) {      
            baseLanguage = current_status;
            initTranslate();
            $('body').i18n();
        });
        //lang.set(current_status);
	});
	    
	/*	
    $(document).on('change', '#toggleswitchnotification', function(e) {		      
       var current_status = 'Off'; //$(this).val();
       if ($(this).is(':checked') === true) current_status = 'On';
       
       app.auth.handleUpdateNotification(current_status);
	       		
	});
	*/
	
});


/* ---------------------- */
// FRAMEWORK 7 
/* ---------------------- */

var fw7;
var $$;
var mainView;
var router = {};

/**
 * Init router, that handle page events
 */
router.init = function() {
		$(document).on('pageBeforeInit', function (e) {
			var page = e.detail.page;
			load(page.name, page.query);
		});
    }

/**
 * Load (or reload) controller from js code (another controller) - call it's init function
 * @param controllerName
 * @param query
 */
 /*
router.load = function(controllerName, query) {
		require(['js/' + controllerName + '/'+ controllerName + 'Controller'], function(controller) {
			controller.init(query);
		});
	}
*/
    
function initFramework() {

    initTranslate();

    fw7 = new Framework7({
        fastClicks : true,
        cache: false,
        cacheDuration: 1000,
        swipePanel: 'left',
        swipePanelActiveArea: 30,
		modalTitle: 'eureKa Care',
        animateNavBackIcon: true
    });
    
    // Expose Internal DOM library
    $$ = Dom7; //Framework7.$;
    
    mainView = fw7.addView('.view-main', {
        // Because we use fixed-through navbar we can enable dynamic navbar
        dynamicNavbar: false
		//domCache: true
    });
    
    // Events for specific pages when it initialized
    //$$(document).on('pageInit', function (e) {
    $$(document).on('pageBeforeInit', function (e) {
        var page = e.detail.page;
        console.log('PAGE '+page.name);
        // handle index loader
        if (page.name === 'index' || page.name === 'index.html') {
            // to prevent back url on login
            //alert(page.name);
            if (Object.keys(objUser).length == 0) {        
               var result = app.auth.checkPreAuth(false); 
               if (!result) return;
            }                 
           
            initAfterLogin();                    
        }
        
        if (page.name === 'login') {
            console.log('login.html pageinit'); 
            //alert('login');
            if (Object.keys(objUser).length == 0) {
                doRefresh = false;
            }
  
        }
        
        if (page.name === 'device' || page.name === 'device.html' ) {
           console.log('query address='+page.query.address);
        
           // $('.device-page').html('<p>address:'+page.query.address+'</p>');
          // app.ui.displayDevicePage(page);          
        }
        
        if (page.name === 'treatments') {                  
       
             app.treatments.displayTreatmentPage(page);
 
        }
        
        if (page.name === 'treatments_report') {                  
       
             app.treatments.displayPageTreatmentReport(page);
 
        }
        
        //alert(page.name);
        if (page.name === 'video_feature') {
			 console.log('video_feature.html pageinit'); 
			 peer_init();
		}
		
        if (page.name === 'video') {
            console.log('video.html pageinit'); 
            if (Object.keys(objUser).length == 0) {
                doRefresh = false;
            }
            
            $.ajax({
              //url: 'js/vline.js',
              url: 'https://static.vline.com/vline.js',
              dataType: "script",
              success: function() {
                
                 $.ajax({
                  url: 'js/mls.vline.js',                  
                  dataType: "script",
                  success: function() {
                                   
                        handleVideo();
                  }
                 });
             
              }
            });
            
        }
        
        if (page.name === 'ble') { 
       
            $.ajax({
                  url: 'js/mls.ble.js',                  
                  dataType: "script",
                  success: function() {
                                   
                        handleBle();
                  }
                 });
        }
               
        if (page.name === 'messages') {        
             $$('.demo-remove-callback').on('deleted', function () {
                fw7.alert('Thanks, item removed!', 'eBox Smart');
            });

            console.log('message to load');
        
            $$('.ks-send-message').on('click', function () {
                $$('.ks-messages-form').trigger('submit');
            });
        }
        
        if (page.name === 'settings') {        
            $$('.reset-local-storage').on("click", function() {
                app.resetLocalStorage();
            });
                
            $$('#selectlanguage').val(baseLanguage);             
            
            $('.page[data-page="settings"] .page-content').html($('.page[data-page="settings"] .page-content').html().replace(/{{version}}/g, objConfig.version).replace(/{{build}}/g, objConfig.build).replace(/{{release_time}}/g, objConfig.release_time));
        
            if (objUserSettings.flashlight) $$('#switch-flashlight').attr( "checked", "checked");       
            if (objUserSettings.vibration) $$('#switch-vibration').attr( "checked", "checked");
            if (objUserSettings.sound) $$('#switch-sound').attr( "checked", "checked"); 
            $$('#audio_volume').val(objUserSettings.audio_volume);    
			            
        }
		
		if (page.name === 'prescription') {        
            $$('.send-prescription').on("click", function() {
				console.log('send-prescription');
				app.prescription.validPagePrescription();
            });                                               
        }
            
        // update translation
        $('.pages').i18n();

    });
    
    // Required for demo popover
    $$('.popover a').on('click', function () {
        fw7.closeModal('.popover');
    });

    // Change statusbar bg when panel opened/closed
    $$('.panel-left').on('open', function () {
        $$('.statusbar-overlay').addClass('with-panel-left');
    });
    $$('.panel-right').on('open', function () {
        $$('.statusbar-overlay').addClass('with-panel-right');
    });
    $$('.panel-left, .panel-right').on('close', function () {
        $$('.statusbar-overlay').removeClass('with-panel-left with-panel-right');
    });
	
	ipc = new app.pages.IndexPageController(fw7, $$);

}

function goMainTab(link) {
 var newTab = $$(link);
                    if (newTab.length === 0) return;
                    var oldTab = $$('.tabs').find('.tab.active').removeClass('active');
                    newTab.addClass('active');
                    newTab.trigger('show');
                    var clickedParent = $$('.toolbar-inner');
                    
                    clickedParent.find('.active').removeClass('active');
                    $$('a[href="'+link+'"]').addClass('active');
                    
                    if (newTab.find('.navbar').length > 0) {
                        // Find tab's view
                        var viewContainer;
                        if (newTab.hasClass('view')) viewContainer = newTab[0];
                        else viewContainer = newTab.parents('.view')[0];
                        fw7.sizeNavbars(viewContainer);
                    }
                    
}


// -----------
// SETTINGS
// -----------
app.settings = {};

app.settings.init = function()
{
    objUserSettings = dbAppUserSettings.get();
    if (Object.keys(objUserSettings).length == 0) {
       objUserSettings = {  
        'autoconnect': true, 
        'last_update': new Date().toISOString(),     
        };            
       dbAppUserSettings.set(objUserSettings);
    }      
};

app.settings.set = function(key, value)
{
    objUserSettings[key] = value;
    objUserSettings['last_update'] = new Date().toISOString();
    dbAppUserSettings.set(objUserSettings);       
};

app.settings.get = function(key)
{
    return objUserSettings[key];            
};
