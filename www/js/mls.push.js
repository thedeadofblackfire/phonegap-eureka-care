            var pushNotification;
			
			var push;
            
            var push_senderID = '304393421639';
            
            var push_homeid = 'index';
            
                    
            function push_obj_init() {
                ImPush.vendorSeq = objUser.vendor_seq;
                ImPush.pid = objUser.user_id;
                ImPush.mid = objUser.reference;
                ImPush.deviceSerial = objUser.device_serial;
                if (!ImPush.deviceSerial) {
                    ImPush.deviceSerial = window.localStorage["device_serial"];
                }
                console.log('PUSH - push_obj_init - device_serial=' + ImPush.deviceSerial);		
                ImPush.appCode = "eureka_care";
                //ImPush.appCode = "539F5-D40CA";
                ImPush.appVersion = "1.0";
            }
        
            function push_onDeviceReady() {
                console.log('push_onDeviceReady');
            
                console.log('PUSH - deviceready event received');
                
				document.addEventListener("backbutton", function(e)
				{
                	console.log('PUSH - backbutton event received');
  					
      				if( $("#home").length > 0 || $(push_homeid).length > 0 || doRefresh)
					{
						// call this to get a new token each time. don't call it to reuse existing token.						
						e.preventDefault();
                        //pushNotification.unregister(successHandler, errorHandler);
                        
                        /*
                        ImPush.userId = objUser.user_id;
                        ImPush.appCode = "539F5-D40CA";
                        ImPush.unregister(function(data) {                        
                            console.log("ImPush unregister success: " + JSON.stringify(data));
                        }, function(errorregistration) {
                            alert("Couldn't unregister with ImPush" +  errorregistration);
                        });
                        */
                    
                        //ImPush.sendAppClose();
						navigator.app.exitApp();
					}
					else
					{
						navigator.app.backHistory();
					}
				}, false);
			
				try 
				{                 	
					console.log('PUSH - init');
					push = PushNotification.init({
						android: {
							senderID: push_senderID
						},
						browser: {
							pushServiceURL: 'http://push.api.phonegap.com/v1/push'
						},
						ios: {
							alert: "true",
							badge: "true",
							sound: "true"
						},
						windows: {}
					});
					
					push.on('registration', function(data) {
						// data.registrationId						
						console.log('PUSH - REGISTERED -> REGID=' + data.registrationId);
					
						push_obj_init();
        
						ImPush.register(data.registrationId, function(data) {     
							console.log("PUSH - ImPush register success: " + JSON.stringify(data));						
						
							// save device_serial on localstorage
                            if (data.device_serial) {
                                console.log("PUSH - local store device_serial="+data.device_serial);
                                window.localStorage["device_serial"] = data.device_serial;
                                objUser.device_serial = data.device_serial;
                            }
                    
                            //ImPush.sendAppOpen();
							 
						}, function(errorregistration) {
							alert("Couldn't register with ImPush" +  errorregistration);
						});
												
						 
					});

					push.on('notification', function(data) {
						// data.message,
						// data.title,
						// data.count,
						// data.sound,
						// data.image,
						// data.additionalData
						console.log('PUSH - --NOTIFICATION--');
						console.log(data);
						
						if (data.additionalData.foreground) {
							console.log('PUSH - --INLINE NOTIFICATION--');
							//Whether the notification was received while the app was in the foreground
							
							// if the notification contains a soundname, play it.
                            //console.log('PUSH - ' + JSON.stringify(data));
                            
							// on Android soundname is outside the payload. 
                            // On Amazon FireOS all custom attributes are contained within payload
                            var soundfile = data.sound;
                            // if the notification contains a soundname, play it.
                            var my_media = new Media("file:///android_asset/www/audio/"+ soundfile); //new Media("file:///android_asset/www/audio/"+e.soundname); 
                            my_media.play();
						} else {
							// otherwise we were launched because the user touched a notification in the notification tray.
							// coldstart Will be true if the application is started by clicking on the push notification, false if the app is already started.
							if (data.additionalData.coldstart) {
								console.log('PUSH - --COLDSTART NOTIFICATION--');
							} else {
								console.log('PUSH - --BACKGROUND NOTIFICATION--');
							}
						}
						
						/*
						console.log('PUSH - MESSAGE -> MSG: ' + data.message);
                        //Only works for GCM
						console.log('PUSH - MESSAGE -> MSGCNT: ' + data.count);
                        //Only works on Amazon Fire OS
                        console.log('PUSH - MESSAGE -> TIME: ' + e.payload.timeStamp);
						*/
						
						/*
							if (e.foreground)
                    	{
							console.log('PUSH - --INLINE NOTIFICATION--');
							
							// if the notification contains a soundname, play it.
                            console.log('PUSH - ' + JSON.stringify(e));
                            
                            // on Android soundname is outside the payload. 
                            // On Amazon FireOS all custom attributes are contained within payload
                            var soundfile = e.soundname || e.payload.sound;
                            // if the notification contains a soundname, play it.
                            var my_media = new Media("file:///android_asset/www/audio/"+ soundfile); //new Media("file:///android_asset/www/audio/"+e.soundname); 
                            my_media.play();
                             					
						}
						else
						{	// otherwise we were launched because the user touched a notification in the notification tray.
							if (e.coldstart)
								console.log('PUSH - --COLDSTART NOTIFICATION--');
							else
							console.log('PUSH - --BACKGROUND NOTIFICATION--');
						}
							
						console.log('PUSH - MESSAGE -> MSG: ' + e.payload.message);
                        //Only works for GCM
						console.log('PUSH - MESSAGE -> MSGCNT: ' + e.payload.msgcnt);
                        //Only works on Amazon Fire OS
                        console.log('PUSH - MESSAGE -> TIME: ' + e.payload.timeStamp);
						*/
						
						
					});

					push.on('error', function(e) {
						// e.message
						console.log('PUSH - ERROR -> MSG:' + e.message);
					});

					/*
					pushNotification = window.plugins.pushNotification;
                	if (device.platform == 'android' || device.platform == 'Android' || device.platform == "amazon-fireos") {
						console.log('PUSH - registering android');
                    	pushNotification.register(successHandler, errorHandler, {"senderID":push_senderID,"ecb":"onNotification"});		// required!
					} else {
						console.log('PUSH - registering iOS');
                    	pushNotification.register(tokenHandler, errorHandler, {"badge":"true","sound":"true","alert":"true","ecb":"onNotificationAPN"});	// required!
                	}
					*/
                }
				catch(err) 
				{ 
					txt="There was an error on this page.\n\n"; 
					txt+="Error description: " + err.message + "\n\n"; 
					alert(txt); 
				} 
            }
            
            // handle APNS notifications for iOS
            function onNotificationAPN(e) {
                if (e.alert) {
                     console.log('PUSH - push-notification: ' + e.alert);
                     //navigator.notification.alert(e.alert);
                     
                     //chat_update();
                     //console.log('PUSH - --chat_update--');
                        
                     // JSON.stringify(e)  //if you want to access additional custom data in the payload
                }
                    
                if (e.sound) {
                    var snd = new Media(e.sound);
                    snd.play();
                }
                
                if (e.badge) {
                    //badgeCount - an integer indicating what number should show up in the badge. Passing 0 will clear the badge.
                    pushNotification.setApplicationIconBadgeNumber(successHandler, errorHandler, e.badge);
                }
            }
            
            // handle notifications for Android and Amazon Fire OS
            function onNotification(e) {
                console.log('PUSH - EVENT -> RECEIVED: ' + e.event);
                
                switch( e.event )
                {
                    case 'registered':
					if ( e.regid.length > 0 )
					{
						console.log('PUSH - REGISTERED -> REGID=' + e.regid);
						// Your GCM push server needs to know the regID before it can push to this device
						// here is where you might want to send it the regID for later use.
						//console.log("regID = " + e.regid);
                        
                         // Your GCM push server needs to know the regID before it can push to this device
                         // here is where you might want to send it the regID for later use.
                         push_obj_init();
                                     
                         ImPush.register(e.regid, function(data) {                             
                             console.log("PUSH - ImPush register success: " + JSON.stringify(data));
                                                                   
                             // save device_serial on localstorage
                             if (data.device_serial) {
                                console.log("PUSH - local store device_serial="+data.device_serial);
                                window.localStorage["device_serial"] = data.device_serial;
                                objUser.device_serial = data.device_serial;
                             }
                    
                             //ImPush.sendAppOpen();
                         }, function(errorregistration) {
                             alert("Couldn't register with ImPush" +  errorregistration);
                         });
                         /*
                         PushWoosh.appCode = "539F5-D40CA";
                         PushWoosh.register(e.regid, function(data) {
                             console.log("PushWoosh register success: " + JSON.stringify(data));
                             console.log("PushWoosh register success: " + JSON.stringify(data));
                             
                             PushWoosh.sendAppOpen();
                         }, function(errorregistration) {
                             alert("Couldn't register with PushWoosh" +  errorregistration);
                         });
                         */
					}
                    break;
                    
                    case 'message':
                    	// if this flag is set, this notification happened while we were in the foreground.
                    	// you might want to play a sound to get the user's attention, throw up a dialog, etc.
                    	if (e.foreground)
                    	{
							console.log('PUSH - --INLINE NOTIFICATION--');
							
							// if the notification contains a soundname, play it.
                            console.log('PUSH - ' + JSON.stringify(e));
                            
                            // on Android soundname is outside the payload. 
                            // On Amazon FireOS all custom attributes are contained within payload
                            var soundfile = e.soundname || e.payload.sound;
                            // if the notification contains a soundname, play it.
                            var my_media = new Media("file:///android_asset/www/audio/"+ soundfile); //new Media("file:///android_asset/www/audio/"+e.soundname); 
                            my_media.play();
                             					
						}
						else
						{	// otherwise we were launched because the user touched a notification in the notification tray.
							if (e.coldstart)
								console.log('PUSH - --COLDSTART NOTIFICATION--');
							else
							console.log('PUSH - --BACKGROUND NOTIFICATION--');
						}
							
                        //chat_update();
                             
						console.log('PUSH - MESSAGE -> MSG: ' + e.payload.message);
                        //Only works for GCM
						console.log('PUSH - MESSAGE -> MSGCNT: ' + e.payload.msgcnt);
                        //Only works on Amazon Fire OS
                        console.log('PUSH - MESSAGE -> TIME: ' + e.payload.timeStamp);
                    break;
                    
                    case 'error':
						console.log('PUSH - ERROR -> MSG:' + e.msg);
                    break;
                    
                    default:
						console.log('PUST - EVENT -> Unknown, an event was received and we do not know what it is');
                    break;
                }
            }
            
            function tokenHandler(result) {
                console.log('token: '+ result);
                // Your iOS push server needs to know the token before it can push to this device
                // here is where you might want to send it the token for later use.
                push_obj_init();
        
                ImPush.register(result, function(data) {            
                        console.log("ImPush register success: " + JSON.stringify(data));
                    }, function(errorregistration) {
                        alert("Couldn't register with ImPush" +  errorregistration);
                    });
                    
                /*
                PushWoosh.appCode = "539F5-D40CA";
                PushWoosh.register(result, function(data) {
                        console.log("PushWoosh register success: " + JSON.stringify(data));
                        console.log("PushWoosh register success: " + JSON.stringify(data));
                    }, function(errorregistration) {
                        alert("Couldn't register with PushWoosh" +  errorregistration);
                    });
                */
            }
			
            function successHandler(result) {
                console.log('PUSH - success:'+ result);
            }
            
            function errorHandler(error) {
                console.log('PUSH - error:'+ error);
            }
            
            /*
            function console.log(message) {
                console.log(message);                
                //$("#app-status-ul").append(message);
            }
            */
            
			//document.addEventListener('deviceready', push_onDeviceReady, true);
