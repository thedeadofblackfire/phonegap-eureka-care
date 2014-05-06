            var pushNotification;
            
            var push_senderID = '304393421639';
            
            var push_homeid = 'index';
            
            function push_onDeviceReady() {
                console.log('push_onDeviceReady');
            
                traceHandler('<li>deviceready event received</li>');
                
				document.addEventListener("backbutton", function(e)
				{
                	traceHandler('<li>backbutton event received</li>');
  					
      				if( $("#home").length > 0 || $(push_homeid).length > 0 || doRefresh)
					{
						// call this to get a new token each time. don't call it to reuse existing token.						
						e.preventDefault();
                        //pushNotification.unregister(successHandler, errorHandler);
                        
                        /*
                        ImPush.userId = objUser.user_id;
                        ImPush.operatorId = objUser.operator_id;
                        ImPush.appCode = "539F5-D40CA";
                        ImPush.unregister(function(data) {                        
                            traceHandler("ImPush unregister success: " + JSON.stringify(data));
                        }, function(errorregistration) {
                            alert("Couldn't unregister with ImPush" +  errorregistration);
                        });
                        */
                    
                        ImPush.sendAppClose();
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
						traceHandler('<li>registering android</li>');
                    	pushNotification.register(successHandler, errorHandler, {"senderID":push_senderID,"ecb":"onNotificationGCM"});		// required!
					} else {
						traceHandler('<li>registering iOS</li>');
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
                     traceHandler('<li>push-notification: ' + e.alert + '</li>');
                     //navigator.notification.alert(e.alert);
                     
                     chat_update();
                     traceHandler('<li>--chat_update--' + '</li>');
                        
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
                traceHandler('<li>EVENT -> RECEIVED:' + e.event + '</li>');
                
                switch( e.event )
                {
                    case 'registered':
					if ( e.regid.length > 0 )
					{
						traceHandler('<li>REGISTERED -> REGID:' + e.regid + "</li>");
						// Your GCM push server needs to know the regID before it can push to this device
						// here is where you might want to send it the regID for later use.
						console.log("regID = " + e.regid);
                        
                         // Your GCM push server needs to know the regID before it can push to this device
                         // here is where you might want to send it the regID for later use.
                         ImPush.userId = objUser.user_id;
                         ImPush.operatorId = objUser.operator_id;
						 //alert(ImPush.userId);
                         ImPush.appCode = "539F5-D40CA";
                         ImPush.register(e.regid, function(data) {                             
                             traceHandler("ImPush register success: " + JSON.stringify(data));
                             
                             ImPush.sendAppOpen();
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
							traceHandler('<li>--INLINE NOTIFICATION--' + '</li>');
							
							// if the notification contains a soundname, play it.
                            //var my_media = new Media("/android_asset/www/"+e.soundname);
							var my_media = new Media("/android_asset/www/"+e.payload.soundname);
							my_media.play();
                            
                            //chat_update();
							//traceHandler('<li>--chat_update--' + '</li>');
						}
						else
						{	// otherwise we were launched because the user touched a notification in the notification tray.
							if (e.coldstart)
								traceHandler('<li>--COLDSTART NOTIFICATION--' + '</li>');
							else
							traceHandler('<li>--BACKGROUND NOTIFICATION--' + '</li>');
						}
							
                        chat_update();
                        traceHandler('<li>--chat_update--' + '</li>');
                             
						traceHandler('<li>MESSAGE -> MSG: ' + e.payload.message + '</li>');
						traceHandler('<li>MESSAGE -> MSGCNT: ' + e.payload.msgcnt + '</li>');
                    break;
                    
                    case 'error':
						traceHandler('<li>ERROR -> MSG:' + e.msg + '</li>');
                    break;
                    
                    default:
						traceHandler('<li>EVENT -> Unknown, an event was received and we do not know what it is</li>');
                    break;
                }
            }
            
            function tokenHandler (result) {
                traceHandler('<li>token: '+ result +'</li>');
                // Your iOS push server needs to know the token before it can push to this device
                // here is where you might want to send it the token for later use.
                ImPush.userId = objUser.user_id;
                ImPush.operatorId = objUser.operator_id;
                ImPush.appCode = "539F5-D40CA";
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
			
            function successHandler (result) {
                traceHandler('<li>success:'+ result +'</li>');
            }
            
            function errorHandler (error) {
                traceHandler('<li>error:'+ error +'</li>');
            }
            
            function traceHandler(message) {
                console.log(message);                
                //$("#app-status-ul").append(message);
            }
            
			//document.addEventListener('deviceready', push_onDeviceReady, true);
