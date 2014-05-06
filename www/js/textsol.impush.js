var ImPush = {        
        getHWId : function() {
                return device.uuid || '';
        },
        
        register : function(token, lambda, lambdaerror) {
                var method = 'POST';
                var url = ImPush.baseurl + 'registerDevice';
                
                var offset = new Date().getTimezoneOffset() * 60;        //in seconds
                
                var language = window.navigator.language;
                var lang = 'en';
                if(language) {
                     lang = language.substring(0,2); 
                }
                
                var deviceType = 1;
                if (device.platform == 'android' || device.platform == 'Android') {
                    deviceType = 2;
                }
				
				var deviceModel = device.model || '';
				var deviceVersion = device.version || '';

                var params = {
								//user_id : ImPush.userId,
                                request : {
                                        user_id : ImPush.userId,
                                        operator_id : ImPush.operatorId,
                                        application : ImPush.appCode,
                                        push_token : token,
                                        language : lang,
                                        hwid : ImPush.getHWId(),
                                        timezone : offset,
                                        device_type : deviceType,
                                        model : deviceModel,
                                        version : deviceVersion
                                }
                        };

				//payload = params;
                payload = (params) ? JSON.stringify(params) : '';			
                ImPush.helper(url, method, payload, lambda, lambdaerror);
        },
        
        unregister : function(lambda, lambdaerror) {
                var method = 'POST';
                var url = ImPush.baseurl + 'unregisterDevice';
                
                var params = {
                                request : {
                                        user_id : ImPush.userId,
                                        operator_id : ImPush.operatorId,
                                        application : ImPush.appCode,
                                        hwid : ImPush.getHWId()
                                }
                        };

                payload = (params) ? JSON.stringify(params) : '';
                ImPush.helper(url, method, payload, lambda, lambdaerror);
        },
        
        sendBadge : function(badgeNumber, lambda, lambdaerror) {
                var method = 'POST';
                var url = ImPush.baseurl + 'setBadge';
                
                var params = {
                                request : {
                                        application : ImPush.appCode,
                                        hwid : ImPush.getHWId(),
                                        badge: badgeNumber
                                }
                        };

                payload = (params) ? JSON.stringify(params) : '';
                ImPush.helper(url, method, payload, lambda, lambdaerror);
        },

        sendAppOpen : function(lambda, lambdaerror) {
                var method = 'POST';
                var url = ImPush.baseurl + 'applicationOpen';
                
                var params = {
                                request : {
                                        user_id : ImPush.userId,
                                        operator_id : ImPush.operatorId,
                                        application : ImPush.appCode,
                                        hwid : ImPush.getHWId()
                                }
                        };

                payload = (params) ? JSON.stringify(params) : '';
                ImPush.helper(url, method, payload, lambda, lambdaerror);
        },

        sendAppClose : function(lambda, lambdaerror) {
                var method = 'POST';
                var url = ImPush.baseurl + 'applicationClose';
                
                var params = {
                                request : {
                                        user_id : ImPush.userId,
                                        operator_id : ImPush.operatorId,
                                        application : ImPush.appCode,
                                        hwid : ImPush.getHWId()
                                }
                        };

                payload = (params) ? JSON.stringify(params) : '';
                ImPush.helper(url, method, payload, lambda, lambdaerror);
        },
        
        sendPushStat : function(hashValue, lambda, lambdaerror) {
                var method = 'POST';
                var url = ImPush.baseurl + 'pushStat';
                
                var params = {
                                request : {
                                        user_id : ImPush.userId,
                                        operator_id : ImPush.operatorId,
                                        application : ImPush.appCode,
                                        hwid : ImPush.getHWId(),
                                        hash: hashValue
                                }
                        };

                payload = (params) ? JSON.stringify(params) : '';
                ImPush.helper(url, method, payload, lambda, lambdaerror);
        },
                
        setTags : function(tagsJsonObject, lambda, lambdaerror) {
                var method = 'POST';
                var url = ImPush.baseurl + 'setTags';
                
                var params = {
                                request : {
                                        application : ImPush.appCode,
                                        hwid : ImPush.getHWId(),
                                        tags: tagsJsonObject
                                }
                        };

                payload = (params) ? JSON.stringify(params) : '';
                ImPush.helper(url, method, payload, lambda, lambdaerror);
        },
        
        helper : function(url, method, params, lambda, lambdaerror) {
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function() {		
                        if(xhr.readyState == 4) { //Request complete !!
                                if(xhr.status == 200) {
                                        if(lambda) lambda(xhr.responseText);
                                }
                                else {
                                        if(lambdaerror) lambdaerror(xhr.responseText);
                                }
                        }
                };

                // open the client
                xhr.open(method, url, true);
                xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
				//xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8');
		
                // send the data
				//alert("helper: " + params);
                xhr.send(params);
        }
};

ImPush.baseurl = BASE_URL+'/api/notification/';
//if (ENV == 'dev') ImPush.baseurl = BASE_URL+'/api/notification/';
/*
      ImPush.userId = 374;
                         ImPush.appCode = "539F5-D40CA";
                         ImPush.register('abc', function(data) {
                             console.log("ImPush register success: " + JSON.stringify(data));
                             $("#app-status-ul").append("ImPush register success: " + JSON.stringify(data));
                             
                             //ImPush.sendAppOpen();
                         }, function(errorregistration) {
                             alert("Couldn't register with ImPush" +  errorregistration);
                         });
                         */