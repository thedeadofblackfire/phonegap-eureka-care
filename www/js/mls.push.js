            var pushNotification;
            
            var push_senderID = '304393421639';
            
            var push_homeid = 'index';
            
                    
            function push_obj_init() {
                ImPush.vendorSeq = objUser.vendor_seq;
                ImPush.userId = objUser.user_id;
                ImPush.officeSeq = objUser.reference;
                ImPush.deviceSerial = objUser.device_serial;
                if (!ImPush.deviceSerial) {
                    ImPush.deviceSerial = window.localStorage["device_serial"];
                }
                traceHandler('device_serial=' + ImPush.deviceSerial);
				//alert(ImPush.userId);
                ImPush.appCode = "eureka_care";
                //ImPush.appCode = "539F5-D40CA";
                ImPush.appVersion = "1.0";
            }
        
            function push_onDeviceReady() {
                traceHandler('push_onDeviceReady');
            
                traceHandler('PUSH - deviceready event received');
                
				document.addEventListener("backbutton", function(e)
				{
                	traceHandler('PUSH - backbutton event received');
  					
      				if( $("#home").length > 0 || $(push_homeid).length > 0 || doRefresh)
					{
						// call this to get a new token each time. don't call it to reuse existing token.						
						e.preventDefault();
                        //pushNotification.unregister(successHandler, errorHandler);
                        
                        /*
                        ImPush.userId = objUser.user_id;
                        ImPush.appCode = "539F5-D40CA";
                        ImPush.unregister(function(data) {                        
                            traceHandler("ImPush unregister success: " + JSON.stringify(data));
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
                	pushNotification = window.plugins.pushNotification;
                	if (device.platform == 'android' || device.platform == 'Android') {
						traceHandler('PUSH - registering android');
                    	pushNotification.register(successHandler, errorHandler, {"senderID":push_senderID,"ecb":"onNotificationGCM"});		// required!
					} else {
						traceHandler('PUSH - registering iOS');
                    	pushNotification.register(tokenHandler, errorHandler, {"badge":"true","sound":"true","alert":"true","ecb":"onNotificationAPN"});	// required!
                	}
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
                     traceHandler('PUSH - push-notification: ' + e.alert);
                     //navigator.notification.alert(e.alert);
                     
                     //chat_update();
                     //traceHandler('PUSH - --chat_update--');
                        
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
            
            // handle GCM notifications for Android
            function onNotificationGCM(e) {
                traceHandler('PUSH - EVENT -> RECEIVED: ' + e.event);
                
                switch( e.event )
                {
                    case 'registered':
					if ( e.regid.length > 0 )
					{
						traceHandler('PUSH - REGISTERED -> REGID=' + e.regid);
						// Your GCM push server needs to know the regID before it can push to this device
						// here is where you might want to send it the regID for later use.
						//console.log("regID = " + e.regid);
                        
                         // Your GCM push server needs to know the regID before it can push to this device
                         // here is where you might want to send it the regID for later use.
                         push_obj_init();
                                     
                         ImPush.register(e.regid, function(data) {                             
                             traceHandler("PUSH - ImPush register success: " + JSON.stringify(data));
                                                                   
                             // save device_serial on localstorage
                             if (data.device_serial) {
                                traceHandler("PUSH - local store device_serial="+data.device_serial);
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
                             traceHandler("PushWoosh register success: " + JSON.stringify(data));
                             
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
							traceHandler('PUSH - --INLINE NOTIFICATION--');
							
							// if the notification contains a soundname, play it.
                            //var my_media = new Media("/android_asset/www/"+e.soundname);
							var my_media = new Media("/android_asset/www/"+e.payload.soundname);
							my_media.play();
                    					
						}
						else
						{	// otherwise we were launched because the user touched a notification in the notification tray.
							if (e.coldstart)
								traceHandler('PUSH - --COLDSTART NOTIFICATION--');
							else
							traceHandler('PUSH - --BACKGROUND NOTIFICATION--');
						}
							
                        //chat_update();
                             
						traceHandler('PUSH - MESSAGE -> MSG: ' + e.payload.message);
						traceHandler('PUSH - MESSAGE -> MSGCNT: ' + e.payload.msgcnt);
                    break;
                    
                    case 'error':
						traceHandler('PUSH - ERROR -> MSG:' + e.msg);
                    break;
                    
                    default:
						traceHandler('PUST - EVENT -> Unknown, an event was received and we do not know what it is');
                    break;
                }
            }
            
            function tokenHandler(result) {
                traceHandler('token: '+ result);
                // Your iOS push server needs to know the token before it can push to this device
                // here is where you might want to send it the token for later use.
                push_obj_init();
        
                ImPush.register(result, function(data) {            
                        traceHandler("ImPush register success: " + JSON.stringify(data));
                    }, function(errorregistration) {
                        alert("Couldn't register with ImPush" +  errorregistration);
                    });
                    
                /*
                PushWoosh.appCode = "539F5-D40CA";
                PushWoosh.register(result, function(data) {
                        console.log("PushWoosh register success: " + JSON.stringify(data));
                        traceHandler("PushWoosh register success: " + JSON.stringify(data));
                    }, function(errorregistration) {
                        alert("Couldn't register with PushWoosh" +  errorregistration);
                    });
                */
            }
			
            function successHandler(result) {
                traceHandler('success:'+ result);
            }
            
            function errorHandler(error) {
                traceHandler('error:'+ error);
            }
            
            /*
            function traceHandler(message) {
                console.log(message);                
                //$("#app-status-ul").append(message);
            }
            */
            
			//document.addEventListener('deviceready', push_onDeviceReady, true);
