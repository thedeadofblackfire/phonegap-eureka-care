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
var isChatSession = false;
var current_session_id = '';
var totalVisitors = 0;
var doRefresh = true;

var current_treatment_page = 0;
var current_treatment_report_page = 0;
var objSessionTreatments = {};

var package_name = "com.cordova.eboxsmart";
//var package_name = "com.mls.eboxsmart";

var baseLanguage = 'en';        
var info_date = {}; 


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


// ------------------------------------
// -- PRESCRIPTION
// ------------------------------------

var capturedPhoto = 0;
var uploadedPhoto = 0;
var vinPic = 0;

//Success callback
function win(r) {    
    //playBeep();
    //vibrate();
    //console.log("Image uploaded successfully!!"); 
    //alert("Image uploaded successfully!!"); 
	uploadedPhoto++;
    //alert(uploadedPhoto);
    
    //$('.status').html('');
    NProgress.done();
	
	//document.getElementById('damagedbtn').enabled = true;
	//NProgress.done(true);				
				
    //alert("Sent = " + r.bytesSent); 
    console.log("Code = " + r.responseCode);
    console.log("Response = " + r.response);
    console.log("Sent = " + r.bytesSent);
	
	alert('upload');
}
//Failure callback
function fail(error) {
   console.log("There was an error uploading image");
   
   switch (error.code) 
    {  
     case FileTransferError.FILE_NOT_FOUND_ERR: 
      console.log("Photo file not found"); 
      break; 
     case FileTransferError.INVALID_URL_ERR: 
      console.log("Bad Photo URL"); 
      break; 
     case FileTransferError.CONNECTION_ERR: 
      console.log("Connection error "+error.source+" "+error.target); 
	  // @todo need to upload again using error.source as imageURI
      break; 
    } 

    console.log("An error has occurred: Code = " + error.code); 
    console.log("upload error source " + error.source);
    console.log("upload error target " + error.target);
}

// Called if something bad happens.
function onFail(message) {
    console.log('Failed because: ' + message);
	//var msg ='Impossible de lancer l\'appareil photo';        
    //navigator.notification.alert(msg, null, '');       
}

function captureVIN(){
	var destinationType = Camera.DestinationType.NATIVE_URI;
	if (objConfig.platform == 'Android') {
		destinationType = Camera.DestinationType.FILE_URI;
	}
	console.log('destinationType='+destinationType);
    navigator.camera.getPicture(uploadVin, onFail, { quality: 50,
    destinationType: destinationType, });
}

// A button will call this function
// To select image from gallery
function getVIN(source) {
	var destinationType = navigator.camera.DestinationType.NATIVE_URI;
	if (objConfig.platform == 'Android') {
		destinationType = navigator.camera.DestinationType.FILE_URI;
	}
	console.log('destinationType='+destinationType);
    // Retrieve image file location from specified source
    navigator.camera.getPicture(uploadVin, onFail, { quality: 50,
        destinationType: destinationType,
        sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
    });
}

function uploadVin(imageURI) {
   if (!imageURI) {
        document.getElementById('camera_status').innerHTML = "Take picture or select picture from library first.";
        return;
   }
	
   var vehicleVIN = document.getElementById('vehicleVIN');
      vehicleVIN.src =  imageURI;
      if(imageURI.length != 0){
        vinPic = 1;
      }
	  
	 //If you wish to display image on your page in app
	//displayPhoto(imageURI);	 
	capturedPhoto++;
    
	NProgress.start();
	
	var request_id = objUser.uuid;
	console.log('request_id='+request_id);
	
	// upload
    var options = new FileUploadOptions();
    options.fileKey = "file";
    // var userid = '123456';
    var imagefilename = request_id + '_vin_' + Number(new Date()) + ".jpg";
    //options.fileName = imageURI;
	//options.fileName = imagefilename;
	options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
    options.mimeType = "image/jpeg"; 

    var params = new Object();
    params.imageURI = imageURI;
	params.imageFileName = imagefilename;
	params.seq = capturedPhoto;
	//params.id = request_id;
    //params.userid = sessionStorage.loginuserid;
    options.params = params;
    options.chunkedMode = true; //true;
    
    var ft = new FileTransfer();
    var url = encodeURI(API+"/uploadprescription?id="+request_id+"&nomimage="+imagefilename+"&office_seq="+objUser.office.office_seq+"&patient_user_seq="+objUser.uuid);
    ft.onprogress = function(progressEvent) {
        if (progressEvent.lengthComputable) {
          var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
		  //statusDom.innerHTML = perc + "% uploaded...";
          // console.log('uploading '+perc+'%');
          NProgress.set(perc / 100);
          //$('.status').html(perc + "% uploaded...");          
          //loadingStatus.setPercentage(progressEvent.loaded / progressEvent.total);
        } else {
          NProgress.inc();
          //loadingStatus.increment();
          /*
          var statusUploaded = $('.status').html();
          if (statusUploaded == "") {
              $('.status').html('Uploading');
          } else {
              $('.status').html(statusUploaded+'.');
          }
          */
          /*
          if(statusDom.innerHTML == "") {
				statusDom.innerHTML = "Uploading";
		  } else {
				statusDom.innerHTML += ".";
		  }
          */
        }
    };
    ft.upload(imageURI, url, win, fail, options);       
    
}


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
				var result = checkPreAuth(false); 
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
        //checkConnection();	
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
				var result = checkPreAuth(false); 
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
    }
};

app.checkConnection = function() {
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
            requiredPatient: 'A patient is required',
            requiredSubject: 'A subject is required',
            requiredContributor: 'At least one contributor is required',
            status: 'Status',
            location: 'Location',
            detail: 'Detail',
            contributors: 'Contributors',
            timestart: 'Start Time',
            timeend: 'End Time',
            statusforbidden: 'Status figé - impossible de déplacer',
            
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
            
            calendarTranslate.requiredPatient = 'Un patient est requis';
            calendarTranslate.requiredSubject = 'Un sujet est requis';
            calendarTranslate.requiredContributor = 'Au moins un intervenant est requis';
            
            calendarTranslate.status = 'Statut';
            calendarTranslate.location = 'Lieu';
            calendarTranslate.detail = 'Détail';
            calendarTranslate.contributors = 'Intervenants';
            calendarTranslate.timestart = 'Horaire Début';
            calendarTranslate.timeend = 'Horaire Fin';
            calendarTranslate.statusforbidden = 'Status figé - impossible de déplacer';
            
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
jQuery(document).ready(function($){
		        
	$(document).on('click', '.btn-logout', handleLogout);

	$(document).on('click', "#btnLogin", handleLoginForm);
	    
    $(document).on('change', '#toggleswitchnotification', function(e) {		      
       var current_status = 'Off'; //$(this).val();
       if ($(this).is(':checked') === true) current_status = 'On';
       
       handleUpdateNotification(current_status);
	       		
	});
    
    $(document).on('change', '#selectlanguage', function(e) {		
       var current_status = $(this).val();
       console.log('selectlanguage '+current_status);
       //alert(current_status);
       //displayLanguage();
       
       i18n.setLng(current_status, function(t)
                {      
                    baseLanguage = current_status;
                    initTranslate();
                    $('body').i18n();
                });
       //lang.set(current_status);
	});
			
});

    
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
        if (title == undefined) title = 'eureKa Care';
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
    
	function checkPreAuth(login) {
		console.log('checkPreAuth');
                          
        var result = false;                    
		if(Object.keys(objUser).length == 0 && window.localStorage["username"] != undefined && window.localStorage["password"] != undefined) {			         
			handleLogin(window.localStorage["username"], window.localStorage["password"], false);
		} else if (Object.keys(objUser).length == 0) {
            if (login === false) mofChangePage('login.html');
        }
        
        return result; 
	}

    function handleLoginForm() {
		console.log('handleLoginForm');			
		var form = $("#loginForm");  		
		var u = $("#username", form).val();
		var p = $("#password", form).val();
        handleLogin(u, p, true); 
    }
        
	function handleLogin(u,p,fromform) {
		console.log('handleLogin fromform='+fromform);		

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

	function handleLogout() {
		console.log('handleLogout');	
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
    
    function alertDismissed() {
        // do something
    } 
    
    function handleUpdateAvailability(current_status) {
	   console.log('handleUpdateAvailability '+current_status);			
      
       $.ajax({
              url : API+"/account/onlinestatus",
              type: "POST",
              dataType : 'json',
              data:{user_id: objUser.user_id, action:'chatStatus', status:current_status},
              success :function(data){
              	//window.location.reload();
				console.log(data);
              },
              error:function(data){    
				console.log(data);			  
              } 
        });
        
    }
    
    function handleUpdateNotification(current_status) {
		console.log('handleUpdateNotification '+current_status);			
        
        $.ajax({
              url : API+"/account/notificationstatus",
              type: "POST",
              dataType : 'json',
              data:{user_id: objUser.user_id, operator_id: objUser.operator_id, action:'notificationStatus', status:current_status},
              success :function(data){
				console.log(data);
              },
              error:function(data){    
				console.log(data);			  
              } 
        });
       
    }
            

function goRegister() {
	window.plugins.ChildBrowser.showWebPage('http://patient.eureka-platform.com', { showLocationBar: true });
}


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
               var result = checkPreAuth(false); 
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
				validPageVin();
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

// ---------------------
// TREATMENTS
// ---------------------
app.treatments = {};

app.treatments.constant = {};
app.treatments.constant.STATUS_TODAY_BEFORE           = app.treatments.constant.STATUS_TODAY_BEFORE         || 0;
app.treatments.constant.STATUS_TODAY                  = app.treatments.constant.STATUS_TODAY                || 1;
app.treatments.constant.STATUS_TODAY_AFTER            = app.treatments.constant.STATUS_TODAY_AFTER          || 2;

app.treatments.constant.STATUS_PENDING                = app.treatments.constant.STATUS_PENDING              || 0;
app.treatments.constant.STATUS_COMPLETED              = app.treatments.constant.STATUS_COMPLETED            || 1;
app.treatments.constant.STATUS_INPROGRESS             = app.treatments.constant.STATUS_INPROGRESS           || 2;
app.treatments.constant.STATUS_COMPLETEDWITHERRORS    = app.treatments.constant.STATUS_COMPLETEDWITHERRORS  || 3;


app.treatments.init = function()
{
    objUserTreatments = dbAppUserTreatments.get();   
    // @todo should be clean the old treatments to archives
    
    // @todo check on server if connected new production file or treatment to parse
    // if online, check if new treatment on server or wait a push notification ???
    
    dbAppUserTreatments.set(objUserTreatments);
};

// load 7 last days
app.treatments.load = function() {
        console.log('loadTreatment');
        
        // show loading icon
        mofLoading(true);
   
        current_treatment_page++;
        var last_days = 7;

        $.ajax({
              url: API+"/gettreatment",
              datatype: 'json',      
              type: "post",
              data: {office_seq: objUser.office.office_seq, patient_user_seq: objUser.uuid, last_days: last_days, page: current_treatment_page},   
              success:function(res){                    
                 console.log(res);
     
                 //var str = generatePageArchive(res);
               
                 mofLoading(false); 

                 /*
                $.each(res.items, function(k, v) { 
                    console.log(k+' | '+v.delivery_day);
                });        
                */                
                
                // save local storage
                
                app.treatments.processLocalNotification(res.items);
                //mainView.loadContent(str);
           
              },
              error: function(jqXHR, textStatus, errorThrown) {
				 mofLoading(false);  
                 alert('Error loading datas, try again!');
				 console.log(textStatus);
				 console.log(errorThrown);
              }
           });
           
        return true;
}

app.treatments.displayTreatmentPage = function(page)
{        
        var delivery = page.query.delivery;
        if (delivery === undefined) {
                d = new Date();
                delivery = app.date.formatyyyymmdd(d);
        }
        console.log('query id='+delivery);
             
        info_date = app.date.formatDateToObject(delivery);
                  
        // show loading icon
        //mofLoading(true);
        
        var data = {};        
        data.info_date = info_date;
        data.width = app.treatments.calculeWidth();
        data.pill = app.treatments.renderPill(data.width);
        //$('body').i18n();
        //data.url_edit = 'frames/edit.html?address='+app.convertAddressToId(address)+'&nocache=1&rand='+new Date().getTime();

        // And insert generated list to page content
        var content = $$(page.container).find('.page-content').html();       
        content = fwk.render(content, data, false);      
        $$(page.container).find('.page-content').html(content);
        
        var navcontent = $$(page.navbarInnerContainer).html();          
        navcontent = fwk.render(navcontent, data, false);      
        //alert(navcontent);
        $$(page.navbarInnerContainer).html(navcontent);
                       
            // jQuery(document).ready(function($){	
               
                // Adjust canvas size when browser resizes
                $(window).resize( app.treatments.respondPill );


                
              $('.current_date').html(info_date.label_current+'<br>'+info_date.label_current_day);
              //$('.current_date').attr('href', 'frames/ebox_treatments.html?delivery='+info_date.str_today+'&nocache=1');
              $('.current_date').attr('onclick', 'app.treatments.navigatePageTreatment(\''+info_date.str_today+'\')');
              
              //$('.prev_date').attr('href', 'frames/ebox_treatments.html?delivery='+info_date.str_prev+'&nocache=1');
              // $('.next_date').attr('href', 'frames/ebox_treatments.html?delivery='+info_date.str_next+'&nocache=1');
              $('.prev_date').attr('onclick', 'app.treatments.navigatePageTreatment(\''+info_date.str_prev+'\')');
               $('.next_date').attr('onclick', 'app.treatments.navigatePageTreatment(\''+info_date.str_next+'\')');
  
              //mainView.showNavbar();
        //mofLoading(false);     
        // mainView.loadContent(str);
        //$('.device-page').html(str);
            
             /*
           var contacts = JSON.parse(localStorage.getItem("fw7.ontacts"));
            if (query && query.id) {
                contact = new Contact(_.find(contacts, { id: query.id }));
            }
            */
        
            //$('.device-page').html(viewTemplate({ model: params.model }))
            //bindEvents(params.bindings);
            
 
        return true;
};
  
app.treatments.navigatePageTreatment = function(delivery) {
    console.log('page update id='+delivery);
    
    info_date = app.date.formatDateToObject(delivery);

    app.treatments.respondPill();  
                   
    $('.current_date').html(info_date.label_current+'<br>'+info_date.label_current_day);
    //$('.current_date').attr('href', 'frames/ebox_treatments.html?delivery='+info_date.str_today+'&nocache=1');
    $('.current_date').attr('onclick', 'app.treatments.navigatePageTreatment(\''+info_date.str_today+'\')');
              
    $('.prev_date').attr('onclick', 'app.treatments.navigatePageTreatment(\''+info_date.str_prev+'\')');
    $('.next_date').attr('onclick', 'app.treatments.navigatePageTreatment(\''+info_date.str_next+'\')');
  
}; 


app.treatments.displayPageTreatmentReport = function(page)
{        
        var delivery = page.query.delivery;
        if (delivery === undefined) {
                d = new Date();
                delivery = app.date.formatyyyymmdd(d);
        }
        console.log('query id='+delivery);
             
        info_date = app.date.formatDateToObject(delivery);
                  
        // show loading icon
        //mofLoading(true);
        
        //objUserTreatments
        
        //i18n.t('description.currentlyactivechats')
        
        var data = {};        
        data.info_date = info_date;
        data.width = app.treatments.calculeWidth();
        //data.url_edit = 'frames/edit.html?address='+app.convertAddressToId(address)+'&nocache=1&rand='+new Date().getTime();

        // And insert generated list to page content
        var content = $$(page.container).find('.page-content').html();          
        content = fwk.render(content, data, false);      
        $$(page.container).find('.page-content').html(content);
        
        var navcontent = $$(page.navbarInnerContainer).html();          
        navcontent = fwk.render(navcontent, data, false);      
        //alert(navcontent);
        $$(page.navbarInnerContainer).html(navcontent);
 
              $('.current_date').html(info_date.label_current+'<br>'+info_date.label_current_day);
              $('.current_date').attr('onclick', 'app.treatments.navigatePageTreatment(\''+info_date.str_today+'\')');
              
              $('.prev_date').attr('onclick', 'app.treatments.navigatePageTreatment(\''+info_date.str_prev+'\')');
               $('.next_date').attr('onclick', 'app.treatments.navigatePageTreatment(\''+info_date.str_next+'\')');

               /*
       // Generate new items HTML
            var html = '';
            for (var i = 1; i <= 20; i++) {
              html += '<li class="item-content"><div class="item-inner"><div class="item-title">Item ' + i + '</div></div></li>';
            }
         
            // Append new items
            $$('.page-archives > .list-block ul').append(html);
            */
               
        var last_days = 14; 

        if (Object.keys(objSessionTreatments).length == 0) {
            console.log('init objSessionTreatments');
            current_treatment_report_page++;
            $.ajax({
                  url: API+"/gettreatment",
                  datatype: 'json',      
                  type: "post",
                  data: {office_seq: objUser.office.office_seq, patient_user_seq: objUser.uuid, last_days: last_days, page: current_treatment_report_page},   
                  success:function(res){                    
                     console.log(res);
                    
                     objSessionTreatments = fwk.collectionMerge(objSessionTreatments, res.items);                     
                     
                     app.treatments.displayReportItems(res.items);                                 
               
                  },
                  error: function(jqXHR, textStatus, errorThrown) {				  
                     console.log('Error loading datas, try again!');
                     console.log(textStatus);
                     console.log(errorThrown);
                  }
             });     
        } else {
            console.log('preload objSessionTreatments');
            app.treatments.displayReportItems(objSessionTreatments);                 
        }
               
        // infinite scroll                      
               
        // Loading flag
        var loading = false;
                 
        // Attach 'infinite' event handler
        $$('.page-archives.infinite-scroll').on('infinite', function () {
         
          // Exit, if loading in progress
          if (loading) return;
         
          // Set loading flag
          loading = true;
          
          current_treatment_report_page++;           
         
          $.ajax({
              url: API+"/gettreatment",
              datatype: 'json',      
              type: "post",
              data: {office_seq: objUser.office.office_seq, patient_user_seq: objUser.uuid, last_days: last_days, page: current_treatment_report_page},   
              success:function(res){                    
                 console.log(res);
                 
                 // Reset loading flag
                 loading = false;
                 
                 if (Object.keys(res.items).length == 0) { 
                      // Nothing more to load, detach infinite scroll events to prevent unnecessary loadings
                      fw7.detachInfiniteScroll($$('.page-archives.infinite-scroll'));
                      // Remove preloader
                      $$('.page-archives > .infinite-scroll-preloader').remove();
                      return;
                 }
                
                 objSessionTreatments = fwk.collectionMerge(objSessionTreatments, res.items);
                     
                 app.treatments.displayReportItems(res.items);                
           
              },
              error: function(jqXHR, textStatus, errorThrown) {				  
                 console.log('Error loading datas, try again!');
				 console.log(textStatus);
				 console.log(errorThrown);
              }
          });  
         
        });      
      
        return true;
};

app.treatments.stats = {
    totalDays: 0,
    totalDrugProcessed: 0,
    totalSuccess: 0,
    totalError: 0,
    currentPercent: 100,
};

app.treatments.updateReportPercent = function() {
    var percent = (app.treatments.stats.totalSuccess / (app.treatments.stats.totalSuccess + app.treatments.stats.totalError)) * 100;
    percent = percent.toFixed(2);
    //console.log(app.treatments.stats.totalSuccess + ' ' + app.treatments.stats.totalError);
    var str_day = calendarTranslate.day+(app.treatments.stats.totalDays > 1?'s':'')
    $('.percent').html(percent+'%, '+app.treatments.stats.totalDays+' '+str_day);
                
};

app.treatments.displayReportItems = function(items) {
        console.log('displayReportItems ' + Object.keys(items).length);               
        
        var currentTodayTime = app.date.getTodayTime();
        console.log('currentTodayTime='+currentTodayTime);
        
        // Generate new items HTML
        var html = '';   
        $.each(items, function(k, v) { 
           if (v.status_today != app.treatments.constant.STATUS_TODAY_AFTER) {        
                  html += '<li class="item-content" style="z-index:10;background-color:#B9CBCE;color:#4B6968;border-top:0px solid #9797A6;border-bottom:0px solid #646473;box-shadow: 0px 3px 10px #646473;"><div class="item-inner"><div class="item-title"><i class="icon ion-calendar" style="color:#4B6968"></i> ' +  app.date.formatDateToLabel(k) + '</div></div></li>';
               
                  app.treatments.stats.totalSuccess += v.stats.totalSuccess;
                  app.treatments.stats.totalError += v.stats.totalError;
                  app.treatments.stats.totalDrugProcessed += (v.stats.totalSuccess + v.stats.totalError);
                  app.treatments.stats.totalDays++;
                  
                  $.each(v.children, function(delivery_key, delivery_item) { 
                    //html += '<li class="item-content" ><div class="item-inner"><div class="item-title">Item ' + delivery_key + '</div></div></li>';
                   
                    // get today current time                      
                    var deliveryT = parseInt(delivery_item.delivery_time,10);  
                    
                    var background = 'transparent';
                    
                    var delivery_icon = 'ion-ios7-circle-filled';   // ion-ios7-circle-outline         
                    var delivery_color = '#6DC4EF'; // app.treatments.constant.STATUS_PENDING
                    if (delivery_item.status == app.treatments.constant.STATUS_COMPLETED) {
                        delivery_color = '#9FDDB3';
                        delivery_icon = 'ion-ios7-checkmark';
                    } else if (delivery_item.status == app.treatments.constant.STATUS_INPROGRESS) {
                        // today
                        if (delivery_item.stats.totalPending == 0 && delivery_item.stats.totalError == 0) {
                            delivery_color = '#FFA64C';
                            delivery_icon = 'ion-ios7-checkmark';
                        } else if (delivery_item.stats.totalPending == 0 && delivery_item.stats.totalError > 0) {
                            delivery_color = '#FC8A70';
                            delivery_icon = 'ion-ios7-close';
                        } else if (delivery_item.status_today == app.treatments.constant.STATUS_TODAY) {
                                if (currentTodayTime > (deliveryT + 30)) {
                                    // error
                                   delivery_color = '#FC8A70';
                                   delivery_icon = 'ion-ios7-close';
                                } else if (currentTodayTime >= deliveryT) {
                                    // current in progress
                                   delivery_color = '#FFA64C';
                                   background = '#FFDFBF';
                                   delivery_icon = 'ion-ios7-alarm';
                                }        
                        }
                        
                    } else if (delivery_item.status == app.treatments.constant.STATUS_COMPLETEDWITHERRORS) {
                        delivery_color = '#FC8A70';
                        delivery_icon = 'ion-ios7-close';
                    }
                    
                    var html_detail = '<div class="row no-gutter"><div class="col-50">';
                    var total_drug = 0;
                    $.each(delivery_item.children, function(bag_key, bag_item) {                         
                        $.each(bag_item.children, function(drug_key, drug_item) {   
                            var mark;
                            if (delivery_item.status_today == app.treatments.constant.STATUS_TODAY_AFTER) mark = '<i class="icon ion-minus" style="color:#6DC4EF"></i>';
                            else if (drug_item.validate_taking == '1') mark = '<i class="icon ion-checkmark" style="color:#9FDDB3"></i>';
                            else if (delivery_item.status_today == app.treatments.constant.STATUS_TODAY_BEFORE && drug_item.validate_taking == '0') mark = '<i class="icon ion-close" style="color:#FC8A70"></i>';
                            else if (delivery_item.status_today == app.treatments.constant.STATUS_TODAY && drug_item.validate_taking == '0') {
                                                                                  
                                //console.log(currentTodayTime + ' ' + deliveryT);
                                if (currentTodayTime < deliveryT) {
                                    // is pending
                                    mark = '<i class="icon ion-flag" style="color:#6DC4EF"></i>';
                                } else if (currentTodayTime > (deliveryT + 30)) {
                                    // error
                                    mark = '<i class="icon ion-close" style="color:#FC8A70"></i>';
                                } else if (currentTodayTime >= deliveryT) {
                                    // in progress
                                    mark = '&nbsp;<i class="icon ion-alert-circled" style="color:#FFA64C"></i>';
                                }                                
                                                          
                            }                            
                            
                            //if (total_drug == 0) html_detail += '<div class="col-50">';
                            if (total_drug == 3)  html_detail += '</div><div class="col-50">';
                            html_detail += mark+' '+drug_item.drug_name+'<br>';
                            
                            total_drug++;
                        });
                    });
                    html_detail += '</div></div>';
                    
                     //<span class="badge" style="background-color:'+delivery_color+';">'+delivery_item.stats.totalDrug+'</span>
                     html += '<li style="width:100%;background-color:'+background+';border-bottom:1px solid #DBDBEA;border-right:10px solid '+delivery_color+';">'+
                            //'<a href="#" class="item-link item-content">'+
                            '<div class="item-inner" style="border:none;">'+
                            '<div class="item-title-row">'+
                            '<div class="item-title" style="margin-left:15px;"><i class="icon ion-clock" style="color:#000"></i> '+ delivery_item.display_delivery_time+'</div>'+
                            '<div class="item-after"><i class="icon size-24 '+delivery_icon+'" style="color:'+delivery_color+';"></i></div>'+
                            '</div>'+
                            '</div>'+
                            //'<div class="item-subtitle">New messages from John Doe</div>'+
                            '<div class="item-text" style="margin-left:13px;font-size:9px;/*font-family:arial sans-serif;*/color:#4B6968;line-height:110%;">'+
                            html_detail+                            
                            '</div>'+                          
                            //'</a>'+
                            '</li>';
                            
                     /*       
                    html += '<li class="accordion-item" style="background-color:'+background+';border-bottom:1px solid #DBDBEA;border-right:6px solid '+delivery_color+';"><a href="#" class="item-content item-link">'+
                            '<div class="item-inner" style="border:none;">'+
                            '<div class="item-title"><i class="icon ion-clock" style="color:#000"></i> '+ delivery_item.display_delivery_time+' </div>'+
                            '<div class="item-after"><span class="badge" style="background-color:'+delivery_color+';">'+delivery_item.stats.totalDrug+'</span></div>'+
                            '</div></a>'+
                            '<div class="accordion-item-content">'+
                            '<div class="content-block" style="font-size:10px;color: #4B6968;line-height:90%;">'+
                            html_detail+                            
                            '</div>'+
                            '</div>'+
                            '</li>';
                     */       
                  
                  });
                  
             }
        });
         
        // Append new items
        $$('.page-archives > .list-block ul').append(html);
        
        // update percent
        app.treatments.updateReportPercent();
        
        return true;
};

app.treatments.localNotificationInit = function() {
    console.log('localNotificationInit');
        /*
        window.plugin.notification.local.onadd = function (id, state, json) {
            console.log('onadd '+id+' state='+state+' '+JSON.stringify(json));
        };
        */
       /*
            window.plugin.notification.local.ontrigger  = function (id, state, json) {
                console.log('ontrigger '+id+' state='+state+' '+JSON.stringify(json));
            };
            */
            
	cordova.plugins.notification.local.on("click", function (notification) {
		console.log(notification);
		//console.log(state);
    alert(notification.id + ' ' +notification.text);
	 json = JSON.parse(notification.data);
	 console.log(json);
                // need to have the objUser preloaded
       //         app.treatments.createPopupDelivery(json.delivery_dt);
	});

	/*
            window.plugin.notification.local.onclick   = function (id, state, json) {
                console.log('onclick  '+id+' state='+state+' '+JSON.stringify(json));
                json = JSON.parse(json);
                // need to have the objUser preloaded
                app.treatments.createPopupDelivery(json.delivery_dt);
            };
        */
};

app.treatments.localNotificationCancelAll = function() {
	cordova.plugins.notification.local.cancelAll(function() {
		console.log('All notifications have been canceled');
		alert("done");
	}, this);
	/*
  window.plugin.notification.local.cancelAll(function() {
             console.log('All notifications have been canceled');
        }); 
		*/
};

app.treatments.localNotificationGetScheduledIds = function() {
	cordova.plugins.notification.local.getAll(function (notifications) {
console.log(notifications);
});
/*
  window.plugin.notification.local.getScheduledIds( function (scheduledIds) {
             console.log('Scheduled IDs: ' + scheduledIds.join(' ,'));
        }); 
		*/
};

// add new local notification for upcoming days 
app.treatments.processLocalNotification = function(data) {
   
        var now = new Date().getTime();
        //_30_seconds_from_now = new Date(now + 30*1000);
        var _60_seconds_from_now = new Date(now + 60*1000);

        // status_today: before today (0), today (1), after today (2)
        // status: pending(0), completed(1), inprogress(2) (mix of completed/pending), completedwitherror(3)
        // ios limits to first 64 scheduled local notifications.
        $.each(data, function(k_day, v_day) { 
            console.log(k_day+' | '+v_day.delivery_day);
            
            // force update in storage
            objUserTreatments[k_day] = v_day;
                      
            if (v_day.status_today === app.treatments.constant.STATUS_TODAY_AFTER || v_day.status_today === app.treatments.constant.STATUS_TODAY) {
                if (v_day.status === app.treatments.constant.STATUS_PENDING || v_day.status === app.treatments.constant.STATUS_INPROGRESS) {
                     $.each(v_day.children, function(k_delivery, v_delivery) { 
                        console.log(k_delivery+' | '+v_delivery.delivery_dt+ ' | '+v_delivery.status);
                        
                        //if (v_delivery.status === app.treatments.constant.STATUS_PENDING) {
                   
                            var notification_id = '' + v_delivery.delivery_day + v_delivery.delivery_time; //uniq, for android it must be convert to integer
                            var notification_date = app.date.formatDateToTimestamp(v_delivery.delivery_dt);                       
                            var notification_title = 'Rappel Prise '+v_delivery.display_delivery_time; //Reminder
                            var notification_message = 'Il est temps de prendre vos médicaments!';
                   
                            if (v_delivery.status === app.treatments.constant.STATUS_INPROGRESS && now > notification_date.getTime()) {
                                console.log('Exclude '+notification_id + ' | ' + notification_title);
                                return true;
                            }
                        
                            console.log(notification_id + ' | ' + notification_title);
                            
                            var url_sound = 'sounds/fr_alarm01.mp3';
                            if (objConfig.platform == 'Android') {
                                url_sound = 'file:///android_asset/www/' + url_sound; //file:///android_asset/www/audio/aqua.mp3
                               
                            }
                            url_sound = 'android.resource://' + package_name + '/raw/beep';
        
                            cordova.plugins && cordova.plugins.notification.local.schedule({
                                    id: notification_id,
                                    title: notification_title,
                                    text: notification_message,
                                    sound: url_sound,
                                    badge: 1,
                                    data: {'message': 'alert', 'delivery_dt': v_delivery.delivery_dt },
                                    //autoCancel: true,
                                    ongoing: false,
                                    //repeat: 5, // 2 minutes
                                    //icon: 'file:///android_asset/www/img/flower128.png',                               
                                    at: notification_date
                                });
								
								/*
								 window.plugin && window.plugin.notification.local.add({
                                    id: notification_id,
                                    title: notification_title,
                                    message: notification_message,
                                    sound: url_sound,
                                    badge: 1,
                                    json: {'message': 'alert', 'delivery_dt': v_delivery.delivery_dt },
                                    autoCancel: true,
                                    ongoing: false,
                                    //repeat: 5, // 2 minutes
                                    //icon: 'file:///android_asset/www/img/flower128.png',                               
                                    date: notification_date
                                });
								*/
                        //}
    
                     });           
                }       
            }
        });    
                          
        dbAppUserTreatments.set(objUserTreatments);         
  
        //_30_seconds_from_now = app.date.formatDateToTimestamp('2014-08-26 10:00:00');
        //console.log(_30_seconds_from_now.getTime());
         
        /*
        window.plugin.notification.local.add({
            id:      1,
            title:   'Reminder drug 0h',
            message: 'Dont forget your drug',
            //repeat:  'daily',
            //sound:   '/www/res/raw/beep.mp3',
            //sound: 'android.resource://' + package_name + '/raw/beep',
            sound:   'TYPE_ALARM',
            //sound: 'TYPE_NOTIFICATION',
            badge: 0,
            json: {'message': 'alert'},
            autoCancel: true,
            //smallIcon: 'ic_dialog_email',
            date:    _30_seconds_from_now
        });

        window.plugin.notification.local.onadd = function (id, state, json) {
            alert('onadd '+id+' state='+state+' '+JSON.stringify(json));
        };
        
        window.plugin.notification.local.ontrigger  = function (id, state, json) {
            alert('ontrigger '+id+' state='+state+' '+JSON.stringify(json));
        };
        
        window.plugin.notification.local.onclick   = function (id, state, json) {
            alert('onclick  '+id+' state='+state+' '+JSON.stringify(json));
        };
        */
    /*
        var url_sound = 'sounds/fr_alarm01.mp3';
    	if (device.platform == 'Android') {
            url_sound = 'file:///android_asset/www/' + url_sound; //file:///android_asset/www/audio/aqua.mp3
            console.log(url_sound);
        }
        url_sound = 'android.resource://' + package_name + '/raw/beep';
    
        window.plugin.notification.local.add({
            id:      2,
            title:   'Reminder sound 1',
            message: 'Allo 1',
            sound: url_sound,
            //sound:  'android.resource://' + package_name + '/raw/beep',
            //sound: 'beep.wav',
            //sound: 'https://office.eureka-platform.com/assets/media/en_alarm01.mp3',
            //repeat:  'daily',
            //sound:   '/www/res/raw/beep',
           // sound:   '/www/sounds/fr_alarm01.mp3',
            //sound: 'android.resource://' + package_name + '/raw/beep',
            //sound:   'TYPE_ALARM',
            badge: 1,
            autoCancel: true,
            //repeat: 2, // 2 minutes
            //icon: 'file:///android_asset/www/img/flower128.png',
            led: 'FFFFFF',
            date:    _60_seconds_from_now
        });
        
          //  var resourceaudio = this.getPhoneGapPath() + 'beep.wav'; //'audio/audio.mp3';
        //console.log(resourceaudio);
        
        
        var _30_seconds_from_now = new Date(now + 30*1000);   
        
        window.plugin.notification.local.add({
            id:      3,
            title:   'Reminder sound 2',
            message: 'Allo 2',
            sound: url_sound,
            //sound:   '/www/audio/beep.mp3',
            //sound: 'https://office.eureka-platform.com/assets/media/en_taking02.mp3',
            //sound: this.getPhoneGapPath() + 'res/raw/beep.mp3',
            //repeat:  'daily',
            //sound:   '/www/res/raw/beep',
           // sound:   '/www/sounds/fr_alarm01.mp3',
            //sound: 'android.resource://' + package_name + '/raw/beep',
            //sound:   'TYPE_NOTIFICATION',
            badge: 1,
            autoCancel: true,
            led: 'A0FF05',
            date:    _30_seconds_from_now
        });
       // window.plugin.notification.local.add({ message: 'Great app!' });
       
       */
        /*     
        window.plugin.notification.local.getScheduledIds( function (scheduledIds) {
             alert('Scheduled IDs: ' + scheduledIds.join(' ,'));
        });
        */
        
};

// taking dialog: app.treatments.createPopupDelivery('2014-10-06 10:00:00');
app.treatments.createPopupDelivery = function(delivery_dt) {
    console.log('createPopupDelivery '+delivery_dt);
    //console.log(objUserTreatments);
    var day = delivery_dt.substr(0,10);
    if (objUserTreatments[day]) {
        var delivery_item = objUserTreatments[day].children[delivery_dt];
        //console.log(delivery_item);

        var html_detail = '';
        
        var currentTodayTime = app.date.getTodayTime();
        console.log('currentTodayTime='+currentTodayTime);
        // get today current time                      
        var deliveryT = parseInt(delivery_item.delivery_time,10);  
        
        $.each(delivery_item.children, function(bag_key, bag_item) {                         
                        $.each(bag_item.children, function(drug_key, drug_item) {   
                            var mark;
                            if (delivery_item.status_today == app.treatments.constant.STATUS_TODAY_AFTER) mark = '<i class="icon ion-minus" style="color:#6DC4EF"></i>';
                            else if (drug_item.validate_taking == '1') mark = '<i class="icon ion-checkmark" style="color:#9FDDB3"></i>';
                            else if (delivery_item.status_today == app.treatments.constant.STATUS_TODAY_BEFORE && drug_item.validate_taking == '0') mark = '<i class="icon ion-close" style="color:#FC8A70"></i>';
                            else if (delivery_item.status_today == app.treatments.constant.STATUS_TODAY && drug_item.validate_taking == '0') {
                                                                                                         
                                if (currentTodayTime < deliveryT) {
                                    // is pending
                                    mark = '<i class="icon ion-flag" style="color:#6DC4EF"></i>';
                                } else if (currentTodayTime > (deliveryT + 30)) {
                                    // error
                                    mark = '<i class="icon ion-close" style="color:#FC8A70"></i>';
                                } else if (currentTodayTime >= deliveryT) {
                                    // in progress
                                    mark = '&nbsp;<i class="icon ion-alert-circled" style="color:#FFA64C"></i>';
                                }                                                                                          
                            }                            
                                                      
                            html_detail += mark+' '+drug_item.drug_name+'<br>';
                      
                        });
        });
        html_detail += '';
                    
        fw7.modal({
            title:  'Prise '+delivery_dt,
            text: i18n.t('treatments.notakingmedication')+'<br><small>'+html_detail+"</small>",
            buttons: [
            /*
              {
                text: 'RAPPEL',
                onClick: function() {
                  fw7.alert('You clicked first button!')
                }
              },
              */
              {
                text: '<i class="icon icon-size24 ion-checkmark-round" style="color:green;"></i> PRENDRE',
                onClick: function() {
                  fw7.alert('You clicked second button!')
                }
              },
              {
                text: '<i class="icon icon-size24 ion-close-round" style="color:red"></i>\nREFUSER',
                bold: true,
                onClick: function() {
                  fw7.alert('You clicked third button!')
                }
              },
            ]
          });
          
         return true; 
    } else {
        // no object, call the server to raise error ?
        return false;
    }
};
    
app.treatments.calculeWidth = function() {
                var width = $(document).width(); //$(window).width();
                var height = $(document).height();
                console.log(width +' x '+ height);
                if (width >= 900) width = 900;
                else width = width * 90 / 100;
                //if (width > 1150) width = 720;
                //else if (width > 700 && width <=1150) width = 450; 
                
                var canvas = $('.pill');
                //var container = $(canvas).parent()
                canvas.css('width', width ); // Max width
                canvas.css('height', width );
                //canvas.attr('height', $(container).height() ) // Max height
                
               return width;
};

app.treatments.respondPill = function() { 
                var width = app.treatments.calculeWidth();                
                var str = app.treatments.renderPill(width);
                $('.pill').html(str);
};
            
app.treatments.renderPill = function(width) {   
            console.log('renderPill width='+width);
            var config = {
                'tl': 'pillbox_quart_full_tl', //'pillbox_quart_empty_tl',
                'tr': 'pillbox_quart_full_tr', //'pillbox_quart_empty_tr',
                'bl': 'pillbox_quart_full_bl', //'pillbox_quart_empty_bl',
                'br': 'pillbox_quart_full_br', 
                'pillbox_quart_width': 441, // 900 = 441 * 2 + 18
                'width_pillbox_base_vert': 18,
                'width_pillbox_base_horiz': 18,
                'width_pillbox_center_logo': 111,
                'width_pillbox_time': 120,   
                'left_position_center_logo': 44,
                'night': 'finaliconnight',
                'morning': 'finaliconmorning',
                'evening': 'finaliconevening',
                'noon': 'finaliconnoon'
            };
                       
            if (info_date.current_section === 'morning') config.tr = 'pillbox_quart_current_tr'; //'pillbox_quart_empty_tr';
            else if (info_date.current_section === 'noon') config.br = 'pillbox_quart_empty_br';
            else if (info_date.current_section === 'evening') config.bl = 'pillbox_quart_empty_bl';
            else if (info_date.current_section === 'night') config.tl = 'pillbox_quart_empty_tl';
            
            /*
            if (width == 450) {
                config.pillbox_quart_width = 220;
                config.width_pillbox_base_vert = 9;
                config.width_pillbox_base_horiz = 9;
                */
            if(width == 900) {
                config.pillbox_quart_width = 441;
                config.width_pillbox_base_vert = 18;
                config.width_pillbox_base_horiz = 18;
                config.width_pillbox_center_logo = 111;
                config.width_pillbox_time = 120;
            } else {
                // 720
                config.pillbox_quart_width = (width / 100) * 49;
                config.width_pillbox_base_vert = (width / 100) * 2; // + 0.01;
                config.width_pillbox_base_horiz = (width / 100) * 2; // + 0.01;
                config.width_pillbox_center_logo = (width / 100) * 14;
                config.left_position_center_logo = 43;
                config.width_pillbox_time = (width / 100) * 10; //8
            }
            
            var height_vertical = width;
            var width_horiz = width;
            // smartphone adjustments
            if (width < 400) {
                height_vertical = width - 1;
            }
            if (width < 300) {
                width_horiz = width - 1;
            }
          
            var colorText = '#11C2BB';
          
            var str = '';
            str += '<img width="'+config.pillbox_quart_width+'" onclick="app.treatments.viewPill(\'night\');" border="0" style="position:absolute;top:0;left:0;" ontouchstart="this.src=\'img/ebox/'+config.tl+'_pressed.png\';" ontouchend="this.src=\'img/ebox/'+config.tl+'.png\';" onmouseup="this.src=\'img/ebox/'+config.tl+'.png\';" onmousedown="this.src=\'img/ebox/'+config.tl+'_pressed.png\';" src="img/ebox/'+config.tl+'.png">';
            str += '<img width="'+config.width_pillbox_base_vert+'" height="'+height_vertical+'px" border="0" style="position:absolute;top:0;left:'+config.pillbox_quart_width+'px;z-index:2;" src="img/ebox/pillbox_base_vert.png">';
            //str += '<img width="'+config.width_pillbox_base_vert+'" border="0" "style="position:absolute;top:0;left:49%;z-index:2;" src="img/ebox/pillbox_base_vert.png">';
            str += '<img width="'+config.pillbox_quart_width+'" onclick="app.treatments.viewPill(\'morning\');" border="0" style="position:absolute;top:0;left:'+(config.pillbox_quart_width + config.width_pillbox_base_vert)+'px;" ontouchstart="this.src=\'img/ebox/'+config.tr+'_pressed.png\';" ontouchend="this.src=\'img/ebox/'+config.tr+'.png\';" onmouseup="this.src=\'img/ebox/'+config.tr+'.png\';" onmousedown="this.src=\'img/ebox/'+config.tr+'_pressed.png\';" src="img/ebox/'+config.tr+'.png">';
            //str += '<img width="'+config.pillbox_quart_width+'" border="0" style="position:absolute;top:0;left:51%;" ontouchstart="this.src=\'img/ebox/'+config.tr+'_pressed.png\';" ontouchend="this.src=\'img/ebox/'+config.tr+'.png\';" onmouseup="this.src=\'img/ebox/'+config.tr+'.png\';" onmousedown="this.src=\'img/ebox/'+config.tr+'_pressed.png\';" src="img/ebox/'+config.tr+'.png">';
            str += '<img width="'+width_horiz+'px" height="'+config.width_pillbox_base_horiz+'" border="0" style="position:absolute;top:'+config.pillbox_quart_width+'px;left:0;z-index:2;" src="img/ebox/pillbox_base_horiz.png">';
            //str += '<img height="'+config.width_pillbox_base_horiz+'" border="0" style="position:absolute;top:49%;left:0;z-index:2;" src="img/ebox/pillbox_base_horiz.png">';
            str += '<img width="'+config.pillbox_quart_width+'" onclick="app.treatments.viewPill(\'evening\');" border="0" style="position:absolute;top:'+(config.pillbox_quart_width + config.width_pillbox_base_horiz)+'px;left:0;" ontouchstart="this.src=\'img/ebox/'+config.bl+'_pressed.png\';" ontouchend="this.src=\'img/ebox/'+config.bl+'.png\';" onmouseup="this.src=\'img/ebox/'+config.bl+'.png\';" onmousedown="this.src=\'img/ebox/'+config.bl+'_pressed.png\';" src="img/ebox/'+config.bl+'.png">';
            //str += '<img width="'+config.pillbox_quart_width+'" border="0" style="position:absolute;top:51%;left:0;" ontouchstart="this.src=\'img/ebox/'+config.bl+'_pressed.png\';" ontouchend="this.src=\'img/ebox/'+config.bl+'.png\';" onmouseup="this.src=\'img/ebox/'+config.bl+'.png\';" onmousedown="this.src=\'img/ebox/'+config.bl+'_pressed.png\';" src="img/ebox/'+config.bl+'.png">';            
            str += '<img width="'+config.pillbox_quart_width+'" onclick="app.treatments.viewPill(\'noon\');" border="0" style="position:absolute;top:'+(config.pillbox_quart_width + config.width_pillbox_base_horiz)+'px;left:'+(config.pillbox_quart_width + config.width_pillbox_base_vert)+'px;" ontouchstart="this.src=\'img/ebox/'+config.br+'_pressed.png\';" ontouchend="this.src=\'img/ebox/'+config.br+'.png\';" onmouseup="this.src=\'img/ebox/'+config.br+'.png\';" onmousedown="this.src=\'img/ebox/'+config.br+'_pressed.png\';" src="img/ebox/'+config.br+'.png">';            
            
            str += '<img width="'+config.width_pillbox_time+'" border="0" style="position:absolute;top:0;left:0;z-index:10;" ontouchstart="this.src=\'img/ebox/'+config.night+'dimmed.png\';" ontouchend="this.src=\'img/ebox/'+config.night+'.png\';" src="img/ebox/'+config.night+'.png">';
            str += '<span width="'+config.width_pillbox_time+'" class="pill_time_title" style="position:absolute;top:-20px;left:-10px;z-index:10;">'+calendarTranslate.night+' ('+info_date.label_night_day+')</span>';
            str += '<img width="'+config.width_pillbox_time+'" border="0" style="position:absolute;top:0;left:93%;z-index:10;" ontouchstart="this.src=\'img/ebox/'+config.morning+'dimmed.png\';" ontouchend="this.src=\'img/ebox/'+config.morning+'.png\';" src="img/ebox/'+config.morning+'.png">';
            str += '<span width="'+config.width_pillbox_time+'" class="pill_time_title" style="position:absolute;top:-20px;right:-10px;z-index:10;">'+calendarTranslate.morning+'</span>';
            str += '<img width="'+config.width_pillbox_time+'" border="0" style="position:absolute;top:95%;left:0px;z-index:10;" ontouchstart="this.src=\'img/ebox/'+config.evening+'dimmed.png\';" ontouchend="this.src=\'img/ebox/'+config.evening+'.png\';" src="img/ebox/'+config.evening+'.png">';
            str += '<span width="'+config.width_pillbox_time+'" class="pill_time_title" style="position:absolute;top:90%;left:-10px;z-index:10;">'+calendarTranslate.evening+'</span>';
            str += '<img width="'+config.width_pillbox_time+'" border="0" style="position:absolute;top:95%;left:93%;z-index:10;" ontouchstart="this.src=\'img/ebox/'+config.noon+'dimmed.png\';" ontouchend="this.src=\'img/ebox/'+config.noon+'.png\';" src="img/ebox/'+config.noon+'.png">';
            str += '<span width="'+config.width_pillbox_time+'" class="pill_time_title" style="position:absolute;top:90%;right:-10px;z-index:10;">'+calendarTranslate.noon+'</span>';
            str += '<img width="'+config.width_pillbox_center_logo+'" border="0" style="position:absolute;top:43%;left:'+config.left_position_center_logo+'%;z-index:10;" src="img/ebox/eureka_center_logo_back.png">';
            //document.getElementById("pill").innerHTML = str;
                    
            return str;
            //$('.pill').html(str);
};

app.treatments.viewPill = function(type) {
    var title;
    if (type === 'night') {
        title = info_date.label_next_full + ', 00:00 - 06:00';
    } else if (type === 'noon') {
        title = info_date.label_current_full + ', 12:00 - 18:00';
    } else if (type === 'evening') {
        title = info_date.label_current_full + ', 18:00 - 00:00';
    } else if (type === 'morning') {
        title = info_date.label_current_full + ', 06:00 - 12:00';
    }
    
    var message = i18n.t('treatments.notakingmedication');
    window.plugins && window.plugins.toast.show(message, 'long', 'bottom', function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});
    
	/*
	 window.plugins && window.plugins.toast.show(message, 'long', 'bottom', function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});    
	*/
    fw7.addNotification({
                    title: title,
                    message: message, //'Aucun médicament prévu'
                    hold: 2500,
                    additionalClass: 'pill',
                    closeIcon: false,
                    media: '<img width="44" height="44" style="border-radius:100%" src="img/ebox/finaliconnight.png">'
                });
};