var BASE_URL = 'https://vendor.eureka-platform.com';
var ENV = 'production';
var ENV_TARGET = 'phonegap'; // html5, phonegap
if (window.location.hostname == 'eboxsmart.phonegap.local') {
    BASE_URL = 'http://eureka.vendor';
    ENV = 'dev';
}
var API = BASE_URL+'/api/mobile';

var objUser = {};
var objChat = {};
var audioEnable = true;
var isChatSession = false;
var current_session_id = '';
var totalVisitors = 0;
var doRefresh = true;

var current_treatment_page = 0;
var package_name = "com.cordova.eboxsmart";
//var package_name = "com.mls.eboxsmart";

var baseLanguage = 'fr';        
var info_date = {}; 


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
		  $('.log').prepend('<li>'+new Date().toISOString() + ' > '+arguments[0]+'</li>');
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

var app = {
    // Application Constructor
    initialize: function() {
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
                $(window).resize( respondPill );

                // Adjust the canvas size when the document has loaded.
                respondPill();
            });
            */
        
            initFramework();
               
            //var a = formatDateToTimestamp('2014-05-07 09:40:00');
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
        
        /*
        jQuery(document).ready(function($){	
               
            // Adjust canvas size when browser resizes
            $(window).resize( respondPill );

            // Adjust the canvas size when the document has loaded.
            respondPill();
        });
        */
        
        
        localNotificationInit();
        
        var now                  = new Date().getTime();
        //_30_seconds_from_now = new Date(now + 30*1000);
        var _60_seconds_from_now = new Date(now + 60*1000);

        _30_seconds_from_now = formatDateToTimestamp('2014-08-26 10:00:00');
        console.log(_30_seconds_from_now);
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

        ln.init();
				
        if (ENV == 'production') {
            // hide the status bar using the StatusBar plugin
            //StatusBar.hide();
        
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
        
        // save device info the first time for mobile's ower (device uuid)
        // http://docs.phonegap.com/en/3.2.0/cordova_device_device.md.html#Device
    },
    onOffline: function() {
        // Handle the offline event
    }
};


app.treatments = {};

app.treatments.displayTreatmentPage = function(page)
{        
        var delivery = page.query.delivery;
        if (delivery === undefined) {
                d = new Date();
                delivery = formatyyyymmdd(d);
        }
        console.log('query id='+delivery);
             
        info_date = formatDateToObject(delivery);
                  
        // show loading icon
        //mofLoading(true);
        
        var data = {};        
        data.info_date = info_date;
        data.width = calculeWidth();
        data.pill = renderPill(data.width);
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
                $(window).resize( respondPill );


                
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
    
    info_date = formatDateToObject(delivery);

    respondPill();  
                   
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
                delivery = formatyyyymmdd(d);
        }
        console.log('query id='+delivery);
             
        info_date = formatDateToObject(delivery);
                  
        // show loading icon
        //mofLoading(true);
        
        var data = {};        
        data.info_date = info_date;
        data.width = calculeWidth();
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

        return true;
};

function initAfterLogin() {
  doRefresh = true;
             
  $('#nickname').html(objUser.first_name);
            
  //loadChatInit();		
}


// --
// functions
// --

function traceHandler(message) {
    console.log(message);                
    $("#app-status-ul").append('<li>'+message+'</li>');
}
            
//2013-06-03 08:00:00
function formatDateToTimestamp(d) {
    //new Date().getTime()
    //(year, month, day, hours, minutes, seconds, milliseconds)    
    //console.log(parseInt(d.substr(0,4)) + ' '+(parseInt(d.substr(5,2)) - 1) + ' '+parseInt(d.substr(8,2))  );
    
    //console.log(d + ' ' + parseInt(d.substr(11,2)) + ' ' + parseInt(d.substr(17,2)));
                
    var current = new Date(parseInt(d.substr(0,4)), (parseInt(d.substr(5,2)) - 1), parseInt(d.substr(8,2)), parseInt(d.substr(11,2)), parseInt(d.substr(14,2)), parseInt(d.substr(17,2)) );
    //console.log(current.getTime());
    //console.log(current);
	return current;    
}

function formatDate(d) {
	var str = d.substr(11,8);
	if (parseInt(d.substr(11,2)) < 12) str += ' am';
	else str += ' pm';
	return str;
}

function formatDateLight(d) {
	return d.substr(11,5);
}

/*
Date.prototype.yyyymmdd = function() {         
                                
        var yyyy = this.getFullYear().toString();                                    
        var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based         
        var dd  = this.getDate().toString();             
                            
        return '' + yyyy + (mm[1]?mm:"0"+mm[0]) + (dd[1]?dd:"0"+dd[0]);
        //return yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]);
};  
*/

function formatyyyymmdd(d) {         
                           
        var yyyy = d.getFullYear().toString();                                    
        var mm = (d.getMonth()+1).toString(); // getMonth() is zero-based         
        var dd  = d.getDate().toString();             
                            
        return '' + yyyy + (mm[1]?mm:"0"+mm[0]) + (dd[1]?dd:"0"+dd[0]);
        //return yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]);
}

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

// convert 20140526 to a prev next object string
function formatDateToObject(d) {
    var info = {};      
    var today = new Date();
    info.str_today = formatyyyymmdd(today);
    
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
    info.str_next = formatyyyymmdd(next);

    // var prev = current;
    var prev = new Date(current.getTime());
    prev = new Date(prev.setDate(prev.getDate() - 1));
    info.prev = prev.getTime();
    info.str_prev = formatyyyymmdd(prev);
           
    // label
    var dd = current.getDate().toString();
    info.label_night_day = (next.getDate().toString()[1]?next.getDate().toString():"0"+next.getDate().toString()[0]);
    info.label_current_day = calendarTranslate.dayNamesShort[current.getDay()];
  
    info.current_section = 'archive';
    if (d === info.str_today) {        
        info.label_current_day = calendarTranslate.today.toUpperCase()+', '+ info.label_current_day;
        
        // morning: 0600 - 1200, noon (12 - 18), evening (18 - 00), night (00 - 06)
        var time = parseInt(info.str_time, 10);
        console.log(time);
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
}


// linkify
if(!String.linkify) {
    String.prototype.linkify = function() {

        // http://, https://, ftp://
        var urlPattern = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;

        // www. sans http:// or https://
        var pseudoUrlPattern = /(^|[^\/])(www\.[\S]+(\b|$))/gim;

        // Email addresses
		var emailAddressPattern = /(([a-zA-Z0-9_\-\.]+)@[a-zA-Z_]+?(?:\.[a-zA-Z]{2,6}))+/gim;

        return this
            .replace(urlPattern, '<a target="_blank" href="$&" class="external">$&</a>')
            .replace(pseudoUrlPattern, '$1<a target="_blank" href="http://$2" class="external">$2</a>')
            .replace(emailAddressPattern, '<a target="_blank" href="mailto:$&" class="external">$&</a>');
    };
}
            
jQuery(document).ready(function($){
		        
	$(document).on('click', '.btn-logout', handleLogout);

	$(document).on('click', "#btnLogin", handleLoginForm);
	
	$(document).on('change', '#toggleswitchremotechat', function(e) {	
        //alert($(this).is(':checked') +' '+$(this).val());
       var current_status = 'Off'; //$(this).val();
       if ($(this).is(':checked') === true) current_status = 'On';
      
       handleUpdateAvailability(current_status);
     		
	});
    
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
                    //handleRefreshOnlineUser(true);
                    $('body').i18n();
                });
       //lang.set(current_status);
	});
			
});

    
    // parse params in hash
	function hashParams(hash) {
		var ret = {};
	    var match;
	    var plus   = /\+/g;
	    var search = /([^\?&=]+)=([^&]*)/g;
	    var decode = function(s) { 
	    	return decodeURIComponent(s.replace(plus, " ")); 
	    };
	    while( match = search.exec(hash) ) ret[decode(match[1])] = decode(match[2]);
	    
	    return ret
	};
    
    
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
            mofLoading(true);
                      
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
                        console.log(match);
                        if(match) {
                            my_saved_cookie = match[2];
                            console.log(my_saved_cookie);
                             window.localStorage.setItem("session",my_saved_cookie);
                        }
                            
                        //store
                        window.localStorage["username"] = u;
                        window.localStorage["password"] = p; 			
                        //window.sessionStorage["user_id"] = res.user.user_id; 
                        window.sessionStorage.setItem('user', JSON.stringify(res.user));

                        //dbAppUser.put(res.user);
                        
                        objUser = res.user;                                     
            
                        // launch the push notification center because it's required objUser
                        if (ENV == 'production') {
                            push_onDeviceReady();
                        }
                        
                        mofLoading(false);
                        
                        if (fromform === true) {
                            mofProcessBtn("#btnLogin", false);
                        
                            mofChangePage('index.html');
                        } else {
                            console.log('auto login success');     
                            
                            initAfterLogin();	                           
                        }
                    } else {	
                        console.log(res.message);
                         
                        mofLoading(false);
                        
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
    
    function loadChatSession(sessionid) {
        console.log('loadChatSession '+sessionid);
        
        // show loading icon
        mofLoading(true);

        $.ajax({
              url: API+"/chat/get_conversation_by_session",
              datatype: 'json',      
              type: "post",
              data: {replyname: objChat.support_display_name, session_id: sessionid, user_id: objUser.user_id},   
              success:function(res){                    
                 //console.log(res);
     
                 var str = generatePageSession(res);
                                          
                 isChatSession = true;
                 
       
                 mofLoading(false);               

                 mainView.loadContent(str);
           
              },
              error: function(jqXHR, textStatus, errorThrown) {
				 mofLoading(false); 
                 alert('Error loading session, try again!');				 
				 alert(textStatus);
				 alert(errorThrown);
              }
           });
           
        return true;
    }

    
    function handleRefreshOnlineUser(loading) {
        console.log('handleRefreshOnlineUser');
        
        if (loading && doRefresh) {            
            $.getJSON(API+"/chat/online_user?user_id="+objUser.user_id, function(res) {			
                console.log(res);
                
                objChat.online_user = res.online_user;
      
                // loop online users to display list of active chats
                loadDataUserList(objChat);
                
            });
        } else {  			
            // loop online users to display list of active chats
            loadDataUserList(objChat);
        }
    }
    
function loadDataUserList(data) {	
    var htmlUserList = '';
    var panelUser = '';
    var title = 'description.nochatsinprogress'; //'You have no active chats'; //There are currently no chats in progress.
    if (data.online_user.length > 0) title = 'description.currentlyactivechats';
    //if (data.online_user.length > 0) title = '<img src="img/infoico.png" style="position:relative">'+i18n.t('description.currentlyactivechats');
    
    var focusChatStillAvailable = false;
                    
    //htmlUserList += '<div class="content-block-title" id="activechat_title" data-i18n="'+title+'">'+i18n.t(title)+'</div>';
    htmlUserList += '<p id="activechat_title" data-i18n="'+title+'">'+i18n.t(title)+'</p>';
    htmlUserList += '<div class="list-block"><ul id="chat_userlist">';
                           
    $.each(data.online_user, function(k, v) {
        var line = generateLineUser(v,false);     
        htmlUserList += line;
        panelUser += line;
        
        if (current_session_id != '' && v.session_id == current_session_id) {
            focusChatStillAvailable = true;
        } 
            
    });
    htmlUserList += '</ul></div>';

	$('#container_chat_userlist').html(htmlUserList);
    $('#panel_userlist').html(panelUser);
    
    // check if current chat session need to be close (visitor has closed the chat)
    if (isChatSession && !focusChatStillAvailable) {
        // we close chat
        console.log('force close chat by user #'+current_session_id);
        current_session_id = '';
        mofAlert('User has closed this session');   
        // should be removed the unreadmessage
        //mofChangePage('index.html');
    }    
                      
}


function generateProcessingId() {
    var d = new Date();
    return d.getMinutes()+''+d.getSeconds()+''+d.getMilliseconds();
}
// iso
function generateProcessingPostDate() {
    var d = new Date();
    return d.toISOString();
}

function loadChatInit() {
      console.log('loadChatInit');

        /*    
        $.getJSON(API+"/account/notificationstatus?user_id="+objUser.user_id+"&operator_id="+objUser.operator_id, function(res) {
                console.log(res);
                var valeur = 'Off';
                if (res.status == '1') {
                    valeur = 'On';
                    $('#toggleswitchnotification').attr( "checked", "checked");
                }		    
        });
		*/     
        
        //language
        $('#selectlanguage').val(ln.language.code);
                        
        $('body').i18n();
       
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

// ---------------------
// TREATMENT
// ---------------------
// load 7 last days
function loadTreatment() {
        console.log('loadTreatment');
        
        // show loading icon
        mofLoading(true);
        
        //if (!current_treatment_page) current_treatment_page = 0;
        current_treatment_page++;
        var last_days = 7;

        $.ajax({
              url: API+"/gettreatment",
              datatype: 'json',      
              type: "post",
              data: {office_seq: objUser.office.office_seq, patient_user_seq: objUser.user_id, last_days: last_days, page: current_treatment_page},   
              success:function(res){                    
                 console.log(res);
     
                 //var str = generatePageArchive(res);
               
                 mofLoading(false); 

                 /*
                $.each(res.items, function(k, v) { 
                    console.log(k+' | '+v.delivery_day);
                });        
*/                
                processLocalNotification(res.items);
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

 var _constant = {};
_constant.STATUS_TODAY_BEFORE           = _constant.STATUS_TODAY_BEFORE         || 0;
_constant.STATUS_TODAY                  = _constant.STATUS_TODAY                || 1;
_constant.STATUS_TODAY_AFTER            = _constant.STATUS_TODAY_AFTER          || 2;

_constant.STATUS_PENDING                = _constant.STATUS_PENDING              || 0;
_constant.STATUS_COMPLETED              = _constant.STATUS_COMPLETED            || 1;
_constant.STATUS_INPROGRESS             = _constant.STATUS_INPROGRESS           || 2;
_constant.STATUS_COMPLETEDWITHERRORS    = _constant.STATUS_COMPLETEDWITHERRORS  || 3;


function localNotificationInit() {
    console.log('localNotificationInit');
        /*
        window.plugin.notification.local.onadd = function (id, state, json) {
            console.log('onadd '+id+' state='+state+' '+JSON.stringify(json));
        };
        */
        
        window.plugin.notification.local.ontrigger  = function (id, state, json) {
            console.log('ontrigger '+id+' state='+state+' '+JSON.stringify(json));
        };
        
        window.plugin.notification.local.onclick   = function (id, state, json) {
            console.log('onclick  '+id+' state='+state+' '+JSON.stringify(json));
        };
        
}

function localNotificationCancelAll() {
  window.plugin.notification.local.cancelAll(function() {
             console.log('All notifications have been canceled');
        }); 
}

function localNotificationGetScheduledIds() {
  window.plugin.notification.local.getScheduledIds( function (scheduledIds) {
             console.log('Scheduled IDs: ' + scheduledIds.join(' ,'));
        }); 
}

// add new local notification for upcoming days 
function processLocalNotification(data) {
   
   var now = new Date().getTime();
        //_30_seconds_from_now = new Date(now + 30*1000);
        var _60_seconds_from_now = new Date(now + 60*1000);

        // status_today: before today (0), today (1), after today (2)
        // status: pending(0), completed(1), inprogress(2) (mix of completed/pending), completedwitherror(3)
        // ios limits to first 64 scheduled local notifications.
        $.each(data, function(k_day, v_day) { 
            console.log(k_day+' | '+v_day.delivery_day);
            if (v_day.status_today === _constant.STATUS_TODAY_AFTER || v_day.status_today === _constant.STATUS_TODAY) {
                if (v_day.status === _constant.STATUS_PENDING || v_day.status === _constant.STATUS_INPROGRESS) {
                     $.each(v_day.children, function(k_delivery, v_delivery) { 
                        console.log(k_delivery+' | '+v_delivery.delivery_dt+ ' | '+v_delivery.status);
                        
                        if (v_delivery.status === _constant.STATUS_PENDING) {
                            var notification_id = '' + v_delivery.delivery_day + v_delivery.delivery_time; //uniq, for android it must be convert to integer
                            var notification_date = formatDateToTimestamp(v_delivery.delivery_dt);                       
                            var notification_title = 'Rappel Prise '+v_delivery.display_delivery_time; //Reminder
                            var notification_message = 'Il est temps de prendre vos médicaments!';
                            
                            console.log(notification_id + ' | ' + notification_title);
                            
                            var url_sound = 'sounds/fr_alarm01.mp3';
                            if (device.platform == 'Android') {
                                url_sound = 'file:///android_asset/www/' + url_sound; //file:///android_asset/www/audio/aqua.mp3
                               
                            }
                            url_sound = 'android.resource://' + package_name + '/raw/beep';
        
                            window.plugin.notification.local.add({
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
                        }
    
                     });           
                }       
            }
        });    
              
                  
        //_30_seconds_from_now = formatDateToTimestamp('2014-08-26 10:00:00');
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
        
}
    
function calculeWidth() {
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
}

function respondPill() { 
                var width = calculeWidth();                
                var str = renderPill(width);
                $('.pill').html(str);
};
            
function renderPill(width) {   
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
                       
            if (info_date.current_section === 'morning') config.tr = 'pillbox_quart_empty_tr';
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
            str += '<img width="'+config.pillbox_quart_width+'" onclick="viewPill(\'night\');" border="0" style="position:absolute;top:0;left:0;" ontouchstart="this.src=\'img/ebox/'+config.tl+'_pressed.png\';" ontouchend="this.src=\'img/ebox/'+config.tl+'.png\';" onmouseup="this.src=\'img/ebox/'+config.tl+'.png\';" onmousedown="this.src=\'img/ebox/'+config.tl+'_pressed.png\';" src="img/ebox/'+config.tl+'.png">';
            str += '<img width="'+config.width_pillbox_base_vert+'" height="'+height_vertical+'px" border="0" style="position:absolute;top:0;left:'+config.pillbox_quart_width+'px;z-index:2;" src="img/ebox/pillbox_base_vert.png">';
            //str += '<img width="'+config.width_pillbox_base_vert+'" border="0" "style="position:absolute;top:0;left:49%;z-index:2;" src="img/ebox/pillbox_base_vert.png">';
            str += '<img width="'+config.pillbox_quart_width+'" onclick="viewPill(\'morning\');" border="0" style="position:absolute;top:0;left:'+(config.pillbox_quart_width + config.width_pillbox_base_vert)+'px;" ontouchstart="this.src=\'img/ebox/'+config.tr+'_pressed.png\';" ontouchend="this.src=\'img/ebox/'+config.tr+'.png\';" onmouseup="this.src=\'img/ebox/'+config.tr+'.png\';" onmousedown="this.src=\'img/ebox/'+config.tr+'_pressed.png\';" src="img/ebox/'+config.tr+'.png">';
            //str += '<img width="'+config.pillbox_quart_width+'" border="0" style="position:absolute;top:0;left:51%;" ontouchstart="this.src=\'img/ebox/'+config.tr+'_pressed.png\';" ontouchend="this.src=\'img/ebox/'+config.tr+'.png\';" onmouseup="this.src=\'img/ebox/'+config.tr+'.png\';" onmousedown="this.src=\'img/ebox/'+config.tr+'_pressed.png\';" src="img/ebox/'+config.tr+'.png">';
            str += '<img width="'+width_horiz+'px" height="'+config.width_pillbox_base_horiz+'" border="0" style="position:absolute;top:'+config.pillbox_quart_width+'px;left:0;z-index:2;" src="img/ebox/pillbox_base_horiz.png">';
            //str += '<img height="'+config.width_pillbox_base_horiz+'" border="0" style="position:absolute;top:49%;left:0;z-index:2;" src="img/ebox/pillbox_base_horiz.png">';
            str += '<img width="'+config.pillbox_quart_width+'" onclick="viewPill(\'evening\');" border="0" style="position:absolute;top:'+(config.pillbox_quart_width + config.width_pillbox_base_horiz)+'px;left:0;" ontouchstart="this.src=\'img/ebox/'+config.bl+'_pressed.png\';" ontouchend="this.src=\'img/ebox/'+config.bl+'.png\';" onmouseup="this.src=\'img/ebox/'+config.bl+'.png\';" onmousedown="this.src=\'img/ebox/'+config.bl+'_pressed.png\';" src="img/ebox/'+config.bl+'.png">';
            //str += '<img width="'+config.pillbox_quart_width+'" border="0" style="position:absolute;top:51%;left:0;" ontouchstart="this.src=\'img/ebox/'+config.bl+'_pressed.png\';" ontouchend="this.src=\'img/ebox/'+config.bl+'.png\';" onmouseup="this.src=\'img/ebox/'+config.bl+'.png\';" onmousedown="this.src=\'img/ebox/'+config.bl+'_pressed.png\';" src="img/ebox/'+config.bl+'.png">';            
            str += '<img width="'+config.pillbox_quart_width+'" onclick="viewPill(\'noon\');" border="0" style="position:absolute;top:'+(config.pillbox_quart_width + config.width_pillbox_base_horiz)+'px;left:'+(config.pillbox_quart_width + config.width_pillbox_base_vert)+'px;" ontouchstart="this.src=\'img/ebox/'+config.br+'_pressed.png\';" ontouchend="this.src=\'img/ebox/'+config.br+'.png\';" onmouseup="this.src=\'img/ebox/'+config.br+'.png\';" onmousedown="this.src=\'img/ebox/'+config.br+'_pressed.png\';" src="img/ebox/'+config.br+'.png">';            
            
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
}

function viewPill(type) {
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
    
    var message = 'Aucune prise de médicament prévu';
    window.plugins && window.plugins.toast.show(message, 'long', 'bottom', function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});
    
    fw7.addNotification({
                    title: title,
                    message: message, //'Aucun médicament prévu'
                    hold: 2500,
                    additionalClass: 'pill',
                    closeIcon: false,
                    media: '<img width="44" height="44" style="border-radius:100%" src="img/ebox/finaliconnight.png">'
                });
}