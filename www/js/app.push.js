            var pushNotification;
			
			var push;
            
            var push_senderID = app_settings && app_settings.push_senderID || '304393421639';
            var push_app = app_settings && app_settings.push_app || "eureka_care";
            var push_homeid = 'index';
                                
            function push_obj_init() {
                ImPush.vendorSeq = objUser.vendor_seq;
                ImPush.pid = objUser.uuid;
                ImPush.mid = objUser.reference;
                ImPush.deviceSerial = objUser.device_serial;
                if (!ImPush.deviceSerial) {
                    ImPush.deviceSerial = window.localStorage["device_serial"];
                }
                console.log('PUSH - push_obj_init - device_serial=' + ImPush.deviceSerial);		
                ImPush.appCode = push_app; // "539F5-D40CA";
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
                            
                            var soundfile = data.sound+'.mp3';
                            // if the notification contains a soundname, play it.
							if (device.platform == 'android' || device.platform == 'Android') {
								var my_media = new Media("file:///android_asset/www/audio/"+ soundfile);							
								my_media.play();
							}
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
					
					});

					push.on('error', function(e) {
						// e.message
						console.log('PUSH - ERROR -> MSG:' + e.message);
					});
	
                }
				catch(err) 
				{ 
					txt="There was an error on this page.\n\n"; 
					txt+="Error description: " + err.message + "\n\n"; 
					alert(txt); 
				} 
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
