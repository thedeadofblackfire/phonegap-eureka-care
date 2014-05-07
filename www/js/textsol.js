
//var BASE_URL = 'http://staging.textsol.com';
var BASE_URL = 'http://www.textsol.com';
var ENV = 'production';
var ENV_TARGET = 'phonegap'; // html5, phonegap
if (window.location.hostname == 'eboxsmart.phonegap.local') {
    BASE_URL = 'http://textwc.local';
    ENV = 'dev';
}
var API = BASE_URL+'/api';
var AjaxURL = BASE_URL+'/chat/';

var objUser = {};
var objChat = {};
var objSession = {}; // notification
var badgeChatCount = 0;
var audioEnable = true;
var isChatSession = false;
var current_session_id = '';
var totalVisitors = 0;
var doRefresh = true;
var firstAudioMessage = true;
var firstAudioChat = true;

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
            initFramework();
        
         var a = formatDateToTimestamp('2014-05-07 09:40:00');
         traceHandler(a);
        /*
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
*/
        }
		        
		//document.addEventListener('load', this.onDeviceReady, true);		
    },
    // deviceready Event Handler
    onDeviceReady: function() {
        //checkConnection();	
		console.log('onDeviceReady');
        
        
        var now                  = new Date().getTime();
        //_30_seconds_from_now = new Date(now + 30*1000);
        var _60_seconds_from_now = new Date(now + 60*1000);

        var package_name = "com.mls.eboxsmart";
        
        _30_seconds_from_now = formatDateToTimestamp('2014-05-07 10:10:00');
        traceHandler(_30_seconds_from_now);
        
        window.plugin.notification.local.add({
            id:      1,
            title:   'Reminder',
            message: 'Dont forget ',
            repeat:  'daily',
            //sound:   '/www/res/raw/beep.mp3',
            //sound: 'android.resource://' + package_name + '/raw/beep',
            sound:   'TYPE_ALARM',
            badge: 0,
            autoCancel: true,
            //smallIcon: 'ic_dialog_email',
            date:    _30_seconds_from_now
        });

        
        window.plugin.notification.local.add({
            id:      2,
            title:   'Reminder2',
            message: 'Allo',
            repeat:  'daily',
            sound:   '/www/res/raw/beep',
            //sound: 'android.resource://' + package_name + '/raw/beep',
            //sound:   'TYPE_ALARM',
            badge: 0,
            autoCancel: true,
            date:    _60_seconds_from_now
        });
       // window.plugin.notification.local.add({ message: 'Great app!' });
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
            
            /*
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
            */
        }
        
        // document.addEventListener("offline", this.onOffline, false);
        
        // save device info the first time for mobile's ower (device uuid)
        // http://docs.phonegap.com/en/3.2.0/cordova_device_device.md.html#Device
    },
    onOffline: function() {
        // Handle the offline event
    }
};
  

function initAfterLogin() {
  doRefresh = true;
             
  $('#nickname').html(objUser.first_name);
            
  loadChatInit();		
}


// --
// functions
// --



 
            function traceHandler(message) {
               // console.log(message);                
                $("#app-status-ul").append('<li>'+message+'</li>');
            }
            
//2013-06-03 08:00:00
function formatDateToTimestamp(d) {
    //new Date().getTime()
    //(year, month, day, hours, minutes, seconds, milliseconds)    
    console.log(parseInt(d.substr(0,4)) + ' '+(parseInt(d.substr(5,2)) - 1) + ' '+parseInt(d.substr(8,2))  );
    
    traceHandler(d + ' ' + parseInt(d.substr(11,2)) + ' ' + parseInt(d.substr(17,2)));
        
        
    var current = new Date(parseInt(d.substr(0,4)), (parseInt(d.substr(5,2)) - 1), parseInt(d.substr(8,2)), parseInt(d.substr(11,2)), parseInt(d.substr(14,2)), parseInt(d.substr(17,2)) );
    console.log(current.getTime());
    console.log(current);
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

// linkify
if(!String.linkify) {
    String.prototype.linkify = function() {

        // http://, https://, ftp://
        var urlPattern = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;

        // www. sans http:// or https://
        var pseudoUrlPattern = /(^|[^\/])(www\.[\S]+(\b|$))/gim;

        // Email addresses
        //var emailAddressPattern = /\w+@[a-zA-Z_]+?(?:\.[a-zA-Z]{2,6})+/gim;
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
        //$.mobile.changePage("some.html");				
        //$.mobile.changePage(pageid, options);
        mainView.loadPage(pageid);
        //$('body').i18n();
    }
	
    /* 
     * mobile framework - Show/hide loading page
     * show: true/false
     */
    function mofLoading(show) {
        //$.mobile.loading('show');
        //$.mobile.loading('hide');
        console.log('loading '+show); 
        if (show) myApp.showPreloader();
        else myApp.hidePreloader();               
    }
    
    /* 
     * mobile framework - Show/hide loading page
     * show: true/false
     */
    function mofAlert(message, title) {
        //$.mobile.loading('show');
        //$.mobile.loading('hide');
        if (title == undefined) title = 'Live Chat';
        myApp.alert(message, title);               
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
			//$("#username", form).val(window.localStorage["username"]);
			//$("#password", form).val(window.localStorage["password"]);            
			handleLogin(window.localStorage["username"], window.localStorage["password"], false);
		} else if (Object.keys(objUser).length == 0) {
            if (login === false) mofChangePage('login.html');
        }
        
        return result; 
	}

    function handleLoginForm() {
		console.log('handleLoginForm');			
		var form = $("#loginForm");  	
		//disable the button so we can't resubmit while we wait
		//$("#submitButton",form).attr("disabled","disabled");
		//$("#btnLogin").attr("disabled","disabled");
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
                url: API+"/account/login",
                async: true,
                dataType: 'json',
                data: {username:u,password:p},
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

                        objUser = res.user;
                        
                        /*
                        if (objUser.country == 'FR') lang.set('fr');
                        else if (objUser.country == 'MEX') lang.set('es');
                        lang.initialize();
                        */
            
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
                        
                        if (ENV == 'dev') {
                            mofAlert(res.message);
                        } else {
                            navigator.notification.alert(res.message, alertDismissed);
                        }					
                        if (fromform === true) mofProcessBtn("#btnLogin", false);
                   }	
                }                   
			});
		} else {        
			if (ENV == 'dev') {
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
		$.getJSON(API+"/account/logout", function(res) {
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
                 
                 // flag unread 
                 checkUnread(sessionid);
         
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
                
                // @todo bug here : clean badge, bad thing
                //badgeChatCount = 0;
                //displayBadgeChat();
                          
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

function updateSession(v) {
    if( !objSession[ v.session_id ] ) {
        console.log('updateUser new='+v.session_id);
        v.unreadMessage = 0; // should be 1
        objSession[ v.session_id ] = v; //{}
    } else {
        // update
        console.log('updateUser update='+v.session_id);
          
        var sess = objSession[ v.session_id ];     
        sess.end_date = v.end_date;
        var newIncomingMessage = parseInt(v.totalmsg) - parseInt(sess.totalmsg);
        sess.totalmsg = v.totalmsg;
        sess.unreadMessage = sess.unreadMessage + newIncomingMessage;
        //objSession[ v.session_id ] = sess;
        
        badgeChatCount += newIncomingMessage;
        displayBadgeChat();

        console.log(sess); 
    }        
}

function displayBadgeChat() {
	console.log('displayBadgeChat '+badgeChatCount);
    //if (badgeChatCount > 0) $('.badge-chat').html(badgeChatCount).fadeIn();
    //else $('.badge-chat').html('').fadeOut();
	if (badgeChatCount > 0) $('#badge-chat').html('<span class="badge badge-green">'+badgeChatCount+'</span>');
	else $('#badge-chat').html('');
}

function addUnread(session_id) {
	console.log('addUnread '+session_id+' badgeChatCount='+badgeChatCount);	
	// don't display bubble if current session
	if (isChatSession && session_id == current_session_id) {
		// do nothing but play the incoming message sound
	} else {
		var sess = objSession[ session_id ]; 
        if (sess) {		 
            sess.unreadMessage += 1; 
            badgeChatCount += 1;
            displayBadgeChat();
            //console.log(sess);
        }
	}
        
    // update total in list        
    updateBadgeUser(session_id);
}

function updateBadgeUser(session_id) {
    // update total in list        
    var currentLi = $('#chat_userlist').find('a[sid="' + session_id + '"]'); 
    //alert(currentLi.length);    
    if (currentLi.length > 0) {    
        var currentTotal = currentLi.find('.badge').html();
        currentTotal = parseInt(currentTotal) + 1;
        console.log('currentTotal='+currentTotal);
        currentLi.find('.badge').html(currentTotal);
    }
}

function checkUnread(session_id) {
    console.log('checkUnread '+session_id+' badgeChatCount='+badgeChatCount);
    var sess = objSession[ session_id ]; 
	//console.log(sess);
    if (sess && sess.unreadMessage > 0) {     
        console.log('checkUnread '+session_id);   
        badgeChatCount -= sess.unreadMessage; 
        sess.unreadMessage = 0;         
        displayBadgeChat();    
           
        //removeNewUserTag(session_id);        
        //console.log(sess); 
    }
}

function removeNewUserTag(session_id) {
	 console.log('removeNewUserTag '+session_id);     
     var find = $('#chat_userlist').find('a[sid="' + session_id + '"]');
	 //console.log(find);     
	 if (find.length > 0) {	    
		//find.parent('li').removeClass('new_user');
	 }       
}

function pictureBrowser(v) {
    var browser = '';    
    if (v.browser == 'Internet Explorer') browser = 'IE.png';
    else if (v.browser == 'Google Chrome') browser = 'Chrome.png';
    else if (v.browser == 'Mozilla Firefox') browser = 'Firefox.png';
    else if (v.browser == 'Apple Safari') browser = 'Safari.png';
    else if (v.browser == 'Netscape') browser = 'Netscape.png';
    else if (v.browser == 'Opera') browser = 'Opera.png';
    else if (v.browser == 'Maxthon') browser = 'Maxthon.png';
    else browser = 'TheWorld.png';
    return browser;
}

function generateLineUser(v, newuser) {
    //htmlUserList += '<li data-icon="false"><a href="#pageChatSession?id='+v.session_id+'" sid="'+v.session_id+'" data-theme="e">'+v.name+'<p>CA</p> <p class="ui-li-aside"><strong>'+formatDate(v.start_date)+'</strong></p> <span class="ui-li-count">'+(parseInt(v.totalmsg) + parseInt(v.totalreply))+'</span></a></li>';
    
    // state http://www.iconarchive.com/show/american-states-icons-by-custom-icon-design.html    
 
    var browser = '';
	browser = pictureBrowser(v);        
    if (browser != '') browser = '<img src="img/browser/64/'+browser+'" border="0" alt="'+v.browser+'" width="32">';
    	
    var lg = '';
    lg = pictureCountry(v.country);
    if (lg != '') lg = '<img src="img/country/32/'+lg+'" alt="'+v.country+'" border="0" width="32" style="margin-left:2px;">';    
    //var lg = '<img src="img/country/64/us.png" alt="United States" border="0" width="32" style="margin-left:2px;">';
        
    var info = lg;
    if (v.city && v.city != '') info += ' '+v.city;
    if (v.region && v.region != '') info += ', '+v.region;
    //if (v.country && v.country != '' && v.country != 'Reserved' ) info += ' '+v.country;
    
    /*
    var str = '<li data-icon="false"';   
    if (newuser) str += 'class="new_user"';    
    //str += '><a href="#pageChatSession?id=' + v.session_id + '" sid="'+v.session_id+'" data-theme="e">' + lg + '<h2>' +v.name + '</h2><p>started at <strong>'+formatDate(v.start_date)+'</strong></p> <span class="ui-li-count">'+(parseInt(v.totalmsg) + parseInt(v.totalreply))+'</span></a></li>';
    str += '><a href="#pageChatSession?id=' + v.session_id + '" sid="'+v.session_id+'" data-theme="a">' + browser + '<h3>' + v.name + '</h3><p>'+info+'</p> <p class="ui-li-aside"><small>'+formatDate(v.start_date)+'</small></p> <span class="ui-li-count">'+(parseInt(v.totalmsg) + parseInt(v.totalreply))+'</span></a></li>';
    */
    //str += '><a href="#pageChatSession?id=' + v.session_id + '" sid="'+v.session_id+'" data-theme="e">' + lg + v.name + ' <p class="ui-li-aside">started at <strong>'+formatDate(v.start_date)+'</strong></p> <span class="ui-li-count">'+(parseInt(v.totalmsg) + parseInt(v.totalreply))+'</span></a></li>';
    var totalmsg = parseInt(v.totalmsg) + parseInt(v.totalreply);
    if (newuser) totalmsg = 0; // adding by new_message
	
    var str = '<li><a href="#" sid="'+v.session_id+'" onclick="return loadChatSession(\''+v.session_id+'\');" class="item-link">'+
                      '<div class="item-content">'+
                        '<div class="item-media">'+browser+' '+lg+'</div>'+
                        '<div class="item-inner">'+
                          '<div class="item-title">'+v.name+'</div>'+
						  '<div class="item-after"><span class="badge">'+totalmsg+'</span></div>'+
                        '</div>'+
                      '</div></a></li>';
                      
    updateSession(v); 
    
    return str;
}

function generateDetailVisitor(data) {
    console.log('generateDetailVisitor');
    var str = '';
    
    //str += '<div class="ui-panel-inner user_infox both_shadowx">';
    //str += '<h3>'+i18n.t('label.details')+'</h3>';
    str += '<p>';
    //str += '<strong>User Info:</strong>&nbsp;&nbsp;';
    
    var browser = pictureBrowser(data.visitor);        
    if (browser != '') browser = '<img src="img/browser/64/'+browser+'" border="0" alt="'+data.visitor.browser+'" width="16">';    	
 
    var lg = '';
    lg = pictureCountry(data.visitor.country);
    if (lg != '') lg = '<img src="img/country/32/'+lg+'" alt="'+data.visitor.country+'" border="0" width="16">';    
            
    if (data.visitor.email != '' || data.visitor.email != '0') str += '<br><b>'+i18n.t('label.email')+':</b> '+data.visitor.email;
    if (data.visitor.phone != '' || data.visitor.phone != '0') str += '<br><b>'+i18n.t('label.phone')+':</b> '+data.visitor.phone;
    if (data.visitor.ip != '') str += '<br><b>'+i18n.t('label.ip')+':</b> '+data.visitor.ip;
    if (data.visitor.country != '') str += '<br><b>'+i18n.t('label.country')+':</b> '+data.visitor.country+' '+lg;   
    if (data.visitor.city != '') str += '<br><b>'+i18n.t('label.city')+':</b> '+data.visitor.city;
    if (data.visitor.region != '') str += '<br><b>'+i18n.t('label.region')+':</b> '+data.visitor.region;
    if (data.visitor.platform != '') str += '<br><b>'+i18n.t('label.platform')+':</b> '+data.visitor.platform;
    if (data.visitor.browser != '') str += '<br><b>'+i18n.t('label.browser')+':</b> '+data.visitor.browser+' '+browser;
    if (data.visitor.referrer != '') str += '<br><b>'+i18n.t('label.url')+':</b> '+data.visitor.referrer;   
    else str += '<br><b>'+i18n.t('label.url')+':</b> '+i18n.t('label.unknowreferrer');   
    if (data.visitor.visit != '') str += '<br><b>'+i18n.t('label.visittime')+':</b> '+data.visitor.visit;
        
    str += '</p>';
    //str += '<a href="#" data-rel="close" data-theme="d" class="ui-btn ui-btn-d ui-mini ui-shadow ui-corner-all ui-icon-delete ui-btn-icon-left ui-btn-inline theme">'+i18n.t('label.closepanel')+'</a>';    
    //str += '</div>';
          
    $('#panelvisitor').html(str);
    
    return str;
}

function generatePageSession(data) {
    console.log('generatePageSession');
    var displayChatClose = false;
    var str = '';
    
    current_session_id = data.session_id;
      
    // shortcuts
    /*
	var browser = pictureBrowser(data.visitor);        
    if (browser != '') browser = '<img src="img/browser/64/'+browser+'" border="0" alt="'+data.visitor.browser+'" width="32">';    	
   
    var lg = '';
    lg = pictureCountry(data.visitor.country);
    if (lg != '') lg = '<img src="img/country/32/'+lg+'" alt="'+data.visitor.country+'" border="0" width="32" style="margin-left:2px;">';          
    */
    
    generateDetailVisitor(data);
            
    str += '<div class="navbar">' +
            '<div class="navbar-inner">' +
            '<div class="left"><a href="#" class="back link"><i class="icon icon-back-blue"></i><span>Back</span></a></div>' +
            '<div class="center sliding">'+data.name+'</div>' +
            '<div class="right"><a href="#" class="link open-panel icon-only"><i class="icon icon-bars-blue"></i></a></div>' +
            '</div>'+
            '</div>'+        
'<div class="pages navbar-through">'+
  '<div data-page="messages" class="page no-toolbar toolbar-fixed">'+
    '<div class="toolbar">'+
     '<form class="ks-messages-form">'+
        '<div class="toolbar-inner">'+
         '<input type="hidden" name="current_session_id" id="current_session_id" value="'+data.session_id+'" />'+    
          '<input type="text" data-session="'+data.session_id+'" name="chatText" id="chatInput" placeholder="'+i18n.t('label.pressenter')+'" class="ks-messages-input"/><a href="#" class="link ks-send-message btnChatSendReply" data-i18n="label.send">'+i18n.t('label.send')+'</a>'+
        '</div>'+
      '</form>'+
    '</div>'+
    '<div class="page-content messages-content">'+    
    
    // '<div class="col-20">'+browser+' '+lg+'</div>'+
       '<div class="content-block">'+
          '<div class="row no-gutter">'+         
            '<div class="col-50"><a href="#" data-session="'+data.session_id+'" class="button button-round button-cancel closeChat" data-i18n="label.closechat">'+i18n.t('label.closechat')+'</a></div>'+
            '<div class="col-50"><a href="#" data-panel="right" class="button button-round active open-panel" data-i18n="label.details">'+i18n.t('label.details')+'</a></div>'+           
          '</div>'+         
        '</div>';
// <a href="#" data-popover=".popover-menu" class="button button-round active open-popover">Info</a>   
     
     /*
     '<div class="list-block">'+
        '<ul>'+
          '<li class="swipeout demo-remove-callback transitioning">'+
            '<div class="item-content swipeout-content" style="-webkit-transform: translate3d(0px, 0px, 0px);">'+
              '<div class="item-media">'+browser+' '+lg+'</div>'+
              '<div class="item-inner">'+
                '<div class="item-title">'+data.name+'</div>'+
              '</div>'+
            '</div>'+
            '<div class="swipeout-actions">'+
              '<div class="swipeout-actions-inner"><a href="#" data-confirm="Are you sure you want to delete this session?" class="swipeout-delete closeChat">'+i18n.t('label.closechat')+'</a></div>'+
            '</div>'+
          '</li>'+       
        '</ul>'+
      '</div>'+
          */
     
      str += '<div class="messages messageWrapper">';
      
  
    if (data.conversation != null) {
        var conversationStarted = false;
            
        $.each(data.conversation, function(k, v) {                    	
            var day = !conversationStarted ? 'Today' : false;
            //var time = !conversationStarted ? (new Date()).getHours() + ':' + (new Date()).getMinutes() : false;
            var time = !conversationStarted ? formatDateLight(v.message.post_date) : false;
          
            if (day) {
                str += '<div class="messages-date">' + day + (time ? ',' : '') + (time ? ' <span>' + time + '</span>' : '') + '</div>';
            }
            str += updateSessionMessage(v.message, false, true);	
            //str += '<div class="message message-received" mid="'+v.message.id+'">'+v.message.message+' <time datetime="'+v.message.post_date+'">'+formatDateLight(v.message.post_date)+'</time></div>';    
            conversationStarted = true;
             
            if (v.reply != null) {
                $.each(v.reply, function(i, r) {    
                    str += updateSessionReply(r, false, true);
                    //str += '<div class="message message-sent reply" rid="'+r.id+'">'+r.reply+' <time datetime="'+r.post_date+'">'+formatDateLight(r.post_date)+'</time></div>';   
                }); 
            }
        });
    }
    /*
        <div class="messages-date">Sunday, Feb 9, <span>12:58</span></div>
        <div class="message message-sent">Hello</div>
        <div class="message message-sent">How are you?</div>
        <div class="message message-received">Hi</div>
        <div class="message message-received">I am fine, thanks! And how are you?</div>
        <div class="message message-sent">I am great!</div>
        <div class="message message-sent">What do you think about my new logo?</div>
        <div class="messages-date">Wednesday, Feb 12, <span>19:33</span></div>
        <div class="message message-sent">Hey? Any thoughts about my new logo?</div>
        <div class="messages-date">Thursday, Feb 13, <span>11:20</span></div>
        <div class="message message-sent">Alo...</div>
        <div class="message message-sent">Are you there?</div>
        <div class="message message-received">Hi, i am here</div>
        <div class="message message-received">Your logo is great</div>
        <div class="message message-received">Leave me alone!</div>
        <div class="message message-sent">:(</div>
        <div class="message message-sent">Hey, look, cutest kitten ever!</div>
        <div class="message message-sent message-pic"><img src="http://placekitten.com/g/300/400"/></div>
        <div class="message message-received">Yep</div>
        */
        
      str += '</div>'+
    '</div>'+
  '</div>'+
'</div>';

     
 //popup
 /*
    var popover = '<ul>'+
            '<li><a href="modals.html" class="list-button item-link">Modals</a></li>'+
            '<li><a href="popover.html" class="list-button item-link">Popover</a></li>'+
          '</ul>';
    

    $('#popovervisitor').html(popover);    
*/    
       /*
    str += '<div class="zone_session2" id="'+data.session_id+'">';
    //str += generateDetailVisitor(data);
    generateDetailVisitor(data);
    
    str += '<div class="plugins">';    
    
    str += '<a href="#panelvisitor" class="btn btn-primary" style="width:auto!important;color:white;"><i class="icon-info-sign"></i> '+i18n.t('label.details')+'</a>&nbsp;&nbsp;';
     
    if (displayChatClose) {
		str += '<a class="btn btn-success disabled">'+i18n.t('label.chatclosed')+'</a>';		
	} else {
		str += '<a class="btn closeChat btn-danger" style="width:auto!important;color:white;"><i class="icon-remove"></i> '+i18n.t('label.closechat')+'</a>';		
	}      
    str += '</div>';
    
    str += '<input type="hidden" name="current_session_id" id="current_session_id" value="'+data.session_id+'" />';
    
    str += '<ul class="messageWrapper chat-messages">';
    if (data.conversation != null) {
        $.each(data.conversation, function(k, v) {        
            str += updateSessionMessage(v.message, false);			
            if (v.reply != null) {
                $.each(v.reply, function(i, r) {
                    str += updateSessionReply(r, false);
                }); 
            }
        });
    }
    str += '</ul>';
    	
	str += '<div class="chat-footer chatform">';
    str += '<input type="text" data-session="'+data.session_id+'" name="chatText" id="chatInput" class="input-light input-large brad chat-search" placeholder="'+i18n.t('label.pressenter')+'">';
    //str += '<a data-role="button" href="#" data-session="'+data.session_id+'" class="btn btn-primary btnChatSendReply">'+i18n.t('label.send')+'</a>';
    str += '<a href="#" data-session="'+data.session_id+'" class="ui-btn ui-icon-arrow-r ui-btn-icon-right ui-shadow ui-corner-all btnChatSendReply" data-i18n="label.send">'+i18n.t('label.send')+'</a>';  
    str += '</div>';				
        
    str += '</div>';
    */
    
    return str;
}

function updateDataUserList(v) {
	console.log('updateDataUserList');
    var str = generateLineUser(v,true);    
    //$('#chat_userlist > li:first').after(str);
    //$('#chat_userlist li:first').html(i18n.t('description.currentlyactivechats')); 
	
    $('#activechat_title').html(i18n.t('description.currentlyactivechats'));
    $('#chat_userlist').append(str);
    
    $('#panel_userlist').append(str);
 
    // play incoming chat
    if (firstAudioChat) {
        play_audio(objChat.chat_sound_path_local_incomingchat);      
        firstAudioChat = false;
    }
}     

// move active user to offline
function removeDataUserList(v) {
    var find = $('#chat_userlist').find('a[sid="' + v.session_id + '"]');   
    if (find.length > 0) { 
       console.log('removeDataUserList '+v.session_id);         
       find.parent().remove();
       $('#panel_userlist').find('a[sid="' + v.session_id + '"]').parent().remove();
        
        // check if last user active
        var count = $("#chat_userlist > li").length;
        if (count == 0) {
            $('#activechat_title').html(i18n.t('description.nochatsinprogress'));
        }
       
        // clean unread 
        checkUnread(v.session_id);
       
        // generate close chats
        refreshArchives();
        
        /*
        var findclose = $('#chat_userlist').find('a[sid="' + v.session_id + '"]');   
        if (findclose.length == 0) {    
            var str = generateLineUser(v,true);    
        }
        */
        
        // play close chat
        /*
        if (firstAudioChat) {
            play_audio(objChat.chat_sound_path_local_incomingchat);      
            firstAudioChat = false;
        }
        */
    }
}  

function updateSessionMessage(v, toAppend, markTime) {
    //var str = '<li class="message right" mid="'+v.id+'"><div class="message_text">'+v.message+'<time datetime="'+v.post_date+'">'+formatDateLight(v.post_date)+'</time></div></li>';         				
    var str = '<div class="message message-received" mid="'+v.id+'">'+v.message.linkify();
    if (markTime === true) str += ' <time datetime="'+v.post_date+'">'+formatDateLight(v.post_date)+'</time>';
    str += '</div>';
    
    if (toAppend) {
        $(".messageWrapper").append(str);	 
        
        var messagesContent = $('.messages-content');
        var messages = messagesContent.find('.messages');
        myApp.updateMessagesAngles(messages);
        myApp.scrollMessagesContainer(messagesContent);
    } else return str;
}  

function updateSessionReply(v, toAppend, markTime) {
    //var str = '<p class="reply treply" rid="'+v.id+'"><b>'+objChat.support_display_name+'</b>: '+v.reply+' <span class="time">'+formatDate(v.post_date)+'</span></p>';
    //var str = '<li class="reply" rid="'+v.id+'"><div class="message_text">'+v.reply+'<time datetime="'+v.post_date+'">'+formatDateLight(v.post_date)+'</time></div></li>';         		     
	var str = '<div class="message message-sent reply" rid="'+v.id+'">'+v.reply.linkify();
    if (markTime === true) str += ' <time datetime="'+v.post_date+'">'+formatDateLight(v.post_date)+'</time>';
    str += '</div>';
    
    if (toAppend) {
        $(".messageWrapper").append(str);	   
        
        var messagesContent = $('.messages-content');
        var messages = messagesContent.find('.messages');
        myApp.updateMessagesAngles(messages);
        myApp.scrollMessagesContainer(messagesContent);
    } else return str;    
}      


function completeSessionReply(v) {
    console.log('complete '+v.processing_id);
    var newfind = $(".messageWrapper .reply[rid='"+v.processing_id+"']"); 
    if (newfind.length > 0) {
        console.log('complete '+v.processing_id+' changed');
        newfind.attr('rid', v.id);	
        newfind.append(' <time datetime="'+v.post_date+'">'+formatDateLight(v.post_date)+'</time>');
        //newfind.child('time').html(formatDateLight(v.post_date));
    }
    // put a loader
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
      
      if (Object.keys(objChat).length == 0 ){
            console.log('Chat init & start');
            // save the online chat status
                           
            //{"X-Requested-With":"XMLHttpRequest"}
            $.getJSON(API+"/chat/init?user_id="+objUser.user_id, function(res) {			
                objChat = res;
                //window.sessionStorage.setItem('objChat', JSON.stringify(objChat));
                console.log(objChat);
                        
                handleRefreshOnlineUser(false);
                
                chat_start();
                
            });
                  
            // visitors
           //refreshVisitors();		    
            
        } else {
			console.log('Chat restart');
			console.log(objChat);
		    handleRefreshOnlineUser(true);
		}
		
		// visitors
        refreshVisitors();	
        
        // no current session
        isChatSession = false; 
        current_session_id = '';
        
        // settings
        $.getJSON(API+"/account/onlinestatus?user_id="+objUser.user_id, function(res) {
                console.log(res);
                 var valeur = 'Off';
                 if (res.status == '1') {
                    valeur = 'On';
                    $('#toggleswitchremotechat').attr( "checked", "checked");
                 }
                 //console.log(valeur);
                 //$('#toggleswitchremotechat option[value=Off]').removeAttr("selected");
                // $('#toggleswitchremotechat option[value=On]').removeAttr("selected");
                // $('#toggleswitchremotechat option[value='+valeur+']').attr("selected", "selected");
                //$('select').selectmenu('refresh', true);
      
        });
            
        $.getJSON(API+"/account/notificationstatus?user_id="+objUser.user_id+"&operator_id="+objUser.operator_id, function(res) {
                console.log(res);
                var valeur = 'Off';
                if (res.status == '1') {
                    valeur = 'On';
                    $('#toggleswitchnotification').attr( "checked", "checked");
                }		
                //$('#toggleswitchnotification').val(valeur).slider("refresh");
      
        });
		     
        // archives
        refreshArchives();
        
        //language
        $('#selectlanguage').val(ln.language.code);
                        
        $('body').i18n();
       
}

function pictureCountry(country) {
    var str = ''; 
    if (country != undefined && country != 'Reserved' && country != '') {
        if (country == 'United States') {
            str = 'United-states-flag.png';
        } else {
            country = country.replace(" ", "-");
            str = country+'-flag.png'; 
        }
    } else {
        str = 'United-states-flag.png';
    }
/*    
    if (country == 'United States') str = 'us.png';
    else if (country == 'France') str = 'fr.png';
    else if (country == 'Canada') str = 'ca.png';
    else if (country == 'Mexico') str = 'mx.png';
    else if (country == 'England') str = 'en.png';
    else if (country == 'Germany') str = 'de.png';
    else str = 'us.png';
    */
    return str;
}

function generateLineVisitor(v) {
    var browser = '';
	browser = pictureBrowser(v);        
    if (browser != '') browser = '<img src="img/browser/64/'+browser+'" border="0" alt="'+v.browser+'" width="32">';
    	
    var lg = '';
    lg = pictureCountry(v.country);
    if (lg != '') lg = '<img src="img/country/32/'+lg+'" alt="'+v.country+'" border="0" width="16">';

    var info = lg;
    if (v.city && v.city != '') info += ' '+v.city+',';
    //if (v.region && v.region != '') info += v.region+',';
    if (v.country && v.country != '' && v.country != 'Reserved' ) info += ' '+v.country;
    
    var referrer = i18n.t('label.unknowreferrer');
    if (v.referrer != '') referrer = v.referrer;
    //  data-i18n="label.details">'+i18n.t('label.details')+'
    
    var day = '';
    //2014-04-15 06:54:48 18
    var myDate = new Date();
    var myDate_string = myDate.toISOString();
    var myDate_string = myDate_string.substr(0,10);

    var visit = v.visit_time;
    var currentday = visit.substr(0,10);
    //console.log(currentday);
    if (currentday !== myDate_string) day = i18n.t('label.yesterday')+' - '; // @todo change this to more accurate
    var currenttime = day + visit.substr(11,5);   
    //time_on_site
    
    var str = '<li><div class="item-content">'+
              '<div class="item-media">'+browser+'</div>'+
              '<div class="item-inner"><div class="item-title">'+v.ip+'<br>'+info+'<br>'+referrer+'<br>'+currenttime+'</div></div>'+
              '</div></li>';                            
              
    return str;
}


function refreshVisitors() {
      console.log('refreshVisitors');
      if (doRefresh) {
          var limit = 25;
          //$.getJSON(API+"/account/totalvisitors?user_id="+objUser.user_id, function(res) {	
          $.getJSON(API+"/account/visitors?limit="+limit+"&user_id="+objUser.user_id, function(res) {			
            //console.log(res);
            
            // update total            
            var oldTotal = totalVisitors;
            totalVisitors = res.total;
            $('.totalvisitors').html(totalVisitors);            
            var diff = totalVisitors - oldTotal;
            console.log('visitors diff='+diff);
			/*
            $('#badgetotalvisitors').html('');
            if (oldTotal > 0) {
                if (diff > 0) {
                    $('#badgetotalvisitors').html('<span class="badge badge-green">+'+diff+'</span>');    
                } else if (diff < 0) {
                    $('#badgetotalvisitors').html('<span class="badge badge-red">'+diff+'</span>');          
                }          
            }    
			*/			
          
            // update visitors list
            var htmlVisitorList = '';
            //if (totalVisitors > limit) htmlVisitorList += '<div class="content-block-title">'+i18n.t('label.browsing')+' ('+totalVisitors+'), '+limit+' displayed</div>';
            //else htmlVisitorList += '<div class="content-block-title">'+i18n.t('label.browsing')+' ('+totalVisitors+')</div>';
            htmlVisitorList += '<div class="content-block-title">'+i18n.t('label.browsing')+'</div>';
			
            htmlVisitorList += '<div class="list-block"><ul>';                           
            $.each(res.visitors, function(k, v) {
                var line = generateLineVisitor(v);     
                htmlVisitorList += line;                             
            });
            htmlVisitorList += '</ul></div>';
    
            $('#container_visitor_list').html(htmlVisitorList);
            
         });
     }
}

/* ---------------------- */
// ARCHIVES 
/* ---------------------- */
function loadArchiveSession(sessionid) {
        console.log('loadArchiveSession '+sessionid);
        
        // show loading icon
        mofLoading(true);

        $.ajax({
              url: API+"/chat/get_conversation_by_session",
              datatype: 'json',      
              type: "post",
              data: {replyname: objChat.support_display_name, session_id: sessionid, user_id: objUser.user_id},   
              success:function(res){                    
                 console.log(res);
     
                 var str = generatePageArchive(res);
               
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
    
function generatePageArchive(data) {
    console.log('generatePageArchive');
    var str = '';
    
    // shortcuts
	var browser = pictureBrowser(data.visitor);        
    if (browser != '') browser = '<img src="img/browser/64/'+browser+'" border="0" alt="'+data.visitor.browser+'" width="32">';    	
 
    var lg = '';
    lg = pictureCountry(data.visitor.country);
    if (lg != '') lg = '<img src="img/country/32/'+lg+'" alt="'+data.visitor.country+'" border="0" width="32" style="margin-left:2px;">';    
            
    generateDetailVisitor(data);
            
    str += '<div class="navbar">' +
            '<div class="navbar-inner">' +
            '<div class="left"><a href="#" class="back link"><i class="icon icon-back-blue"></i><span>Back</span></a></div>' +
            '<div class="center sliding">'+data.name+'</div>' +
            '<div class="right"><a href="#" class="link open-panel icon-only"><i class="icon icon-bars-blue"></i></a></div>' +
            '</div>'+
            '</div>'+        
'<div class="pages navbar-through">'+
  '<div data-page="messages" class="page no-toolbar toolbar-fixed">'+
    '<div class="toolbar">'+
        '<div class="toolbar-inner">'+         
        '</div>'+
    '</div>'+
    '<div class="page-content messages-content">'+    
    
       '<div class="content-block">'+
          '<div class="row no-gutter">'+
            '<div class="col-50">'+browser+' '+lg+'</div>'+
            '<div class="col-50"><a href="#" data-panel="right" class="button button-round active open-panel" data-i18n="label.details">'+i18n.t('label.details')+'</a></div>'+
          '</div>'+         
        '</div>';
      
    str += '<div class="messages messageWrapper">';      
  
    if (data.conversation != null) {
         var conversationStarted = false;
            
         $.each(data.conversation, function(k, v) {    
            var day = !conversationStarted ? v.message.post_date : false;      
            if (day) {            
                str += '<div class="messages-date">'+day+'</div>';
            }
            /*
            var day = !conversationStarted ? 'Today' : false;            
            //var time = !conversationStarted ? (new Date()).getHours() + ':' + (new Date()).getMinutes() : false;
            var time = !conversationStarted ? formatDateLight(v.message.post_date) : false;
            
            if (day) {
                str += '<div class="messages-date">' + day + (time ? ',' : '') + (time ? ' <span>' + time + '</span>' : '') + '</div>';                
            }
            */
            
            str += updateSessionMessage(v.message, false, true);
            conversationStarted = true;
             
            if (v.reply != null) {
                $.each(v.reply, function(i, r) {
                    str += updateSessionReply(r, false, true);                    
                }); 
            }
        });
    }
    /*
        <div class="messages-date">Sunday, Feb 9, <span>12:58</span></div>       
        */
        
      str += '</div>'+
    '</div>'+
  '</div>'+
'</div>';
    
    return str;
}

function generateLineArchive(v) {
    var browser = '';
	browser = pictureBrowser(v);        
    if (browser != '') browser = '<img src="img/browser/64/'+browser+'" border="0" alt="'+v.browser+'" width="32">';
    	
    var lg = '';
    lg = pictureCountry(v.country);
    if (lg != '') lg = '<img src="img/country/32/'+lg+'" alt="'+v.country+'" border="0" width="16">';    
      
    var info = lg;
    if (v.city && v.city != '') info += ' '+v.city;
    if (v.region && v.region != '') info += ', '+v.region;
    //if (v.country && v.country != '' && v.country != 'Reserved' ) info += ' '+v.country;
      
    var referrer = i18n.t('label.unknowreferrer');
    if (v.referrer != '') referrer = v.referrer;
    //  data-i18n="label.details">'+i18n.t('label.details')+'
    
    /*
    var day = '';
    //2014-04-15 06:54:48 18
    var myDate = new Date();
    var myDate_string = myDate.toISOString();
    var myDate_string = myDate_string.substr(0,10);

    var visit = v.visit_time;
    var currentday = visit.substr(0,10);
    //console.log(currentday);
    if (currentday !== myDate_string) day = i18n.t('label.yesterday')+' - '; // @todo change this to more accurate
    var currenttime = day + visit.substr(11,5);   
    */
    var currenttime = v.end_date; 
    
    var str = '<li><a href="#" sid="'+v.session_id+'" onclick="return loadArchiveSession(\''+v.session_id+'\');" class="item-link"><div class="item-content">'+
              '<div class="item-media">'+browser+'</div>'+
              '<div class="item-inner">'+
              '<div class="item-title">'+v.name+'<br>'+info+'<br>'+referrer+'<br>'+currenttime+'</div>'+
              '<div class="item-after"><span class="badge">'+(parseInt(v.totalmsg) + parseInt(v.totalreply))+'</span></div>'+
              '</div>'+
              '</div></a></li>';   
              
              /*
    var str = '<li><a href="#" sid="'+v.session_id+'" onclick="return loadChatSession(\''+v.session_id+'\');" class="item-link">'+
                      '<div class="item-content">'+
                        '<div class="item-media">'+browser+' '+lg+'</div>'+
                        '<div class="item-inner">'+
                          '<div class="item-title">'+v.name+'</div>'+
						  '<div class="item-after"><span class="badge">'+(parseInt(v.totalmsg) + parseInt(v.totalreply))+'</span></div>'+
                        '</div>'+
                      '</div></a></li>';
                      */
                      
    return str;
}

function refreshArchives() {
      console.log('refreshArchives');
      //if (doRefresh) {
          var limit = 20;     
          $.getJSON(API+"/chat/offline_user?limit="+limit+"&user_id="+objUser.user_id, function(data) {			
            console.log(data);
                             
            var htmlUserList = '';
            htmlUserList += '<div class="content-block-title">'+i18n.t('label.archives')+' ('+limit+')</div>';
            htmlUserList += '<div class="list-block"><ul>';                                  
            $.each(data.offline_user, function(k, v) {
                htmlUserList += generateLineArchive(v);         
            });
            htmlUserList += '</ul></div>';

            $('#container_archives_list').html(htmlUserList);            
         });
     //}
}

function goRegister() {
	window.plugins.ChildBrowser.showWebPage('http://m.blastis.com',
                                        { showLocationBar: true });
}

var myApp;
var $$;
var mainView;
function initFramework() {
    myApp = new Framework7({
        fastClicks : false,
        cache: false,
		modalTitle: 'Live Chat'
    });
    
    // Expose Internal DOM library
    $$ = Framework7.$;
    
    mainView = myApp.addView('.view-main', {
        // Because we use fixed-through navbar we can enable dynamic navbar
        dynamicNavbar: true
    });
    
    // Events for specific pages when it initialized
    $$(document).on('pageInit', function (e) {
        var page = e.detail.page;
        //console.log(page.name);
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
               
        if (page.name === 'messages') {        
             $$('.demo-remove-callback').on('deleted', function () {
                myApp.alert('Thanks, item removed!', 'Live Chat');
            });

            console.log('message to load');
        
            $$('.ks-send-message').on('click', function () {
                $$('.ks-messages-form').trigger('submit');
            });
        }

    });

    // Required for demo popover
    $$('.popover a').on('click', function () {
        myApp.closeModal('.popover');
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
                        myApp.sizeNavbars(viewContainer);
                    }
                    
}