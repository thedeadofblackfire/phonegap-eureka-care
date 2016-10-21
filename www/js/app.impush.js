var ImPush = {        
        getHWId : function() {
                return device.uuid || '';
        },
        
        register : function(token, lambda, lambdaerror) {
                var method = 'POST';
                var url = ImPush.baseurl + 'registerdevice';
                
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
                                        vendor_seq : ImPush.vendorSeq,
                                        pid : ImPush.pid,  
                                        mid : ImPush.mid,
                                        device_serial : ImPush.deviceSerial,                                        
                                        app_code : ImPush.appCode,
                                        app_version : ImPush.appVersion,
                                        push_token : token,
                                        language : lang,
                                        hwid : ImPush.getHWId(),
                                        timezone : offset,
                                        brand : deviceType,
                                        model : deviceModel,
                                        version : deviceVersion
                        };                        

				//payload = params;
                //payload = (params) ? JSON.stringify(params) : '';	
                payload = (params) ? ImPush.getAsUriParameters(params) : '';                		
                ImPush.helper(url, method, payload, lambda, lambdaerror);
        },
        
        unregister : function(lambda, lambdaerror) {
                var method = 'POST';
                var url = ImPush.baseurl + 'unregisterdevice';
                
                var params = {                          
                                        pid : ImPush.pid,
                                        device_serial : ImPush.deviceSerial,                         
                                        app_code : ImPush.appCode,
                                        hwid : ImPush.getHWId()                             
                        };

                //payload = (params) ? JSON.stringify(params) : '';
                payload = (params) ? ImPush.getAsUriParameters(params) : '';
                ImPush.helper(url, method, payload, lambda, lambdaerror);
        },
        
        sendBadge : function(badgeNumber, lambda, lambdaerror) {
                var method = 'POST';
                var url = ImPush.baseurl + 'setbadge';
                
                var params = {
                                        app_code : ImPush.appCode,
                                        hwid : ImPush.getHWId(),
                                        badge: badgeNumber
                        };

                //payload = (params) ? JSON.stringify(params) : '';
                payload = (params) ? ImPush.getAsUriParameters(params) : '';
                ImPush.helper(url, method, payload, lambda, lambdaerror);
        },

        sendAppOpen : function(lambda, lambdaerror) {
                var method = 'POST';
                var url = ImPush.baseurl + 'applicationopen';
                
                var params = {
                                        pid : ImPush.pid,
                                        app_code : ImPush.appCode,
                                        hwid : ImPush.getHWId()
                        };

                //payload = (params) ? JSON.stringify(params) : '';
                payload = (params) ? ImPush.getAsUriParameters(params) : '';
                ImPush.helper(url, method, payload, lambda, lambdaerror);
        },

        sendAppClose : function(lambda, lambdaerror) {
                var method = 'POST';
                var url = ImPush.baseurl + 'applicationclose';
                
                var params = {
                                        pid : ImPush.pid,
                                        app_code : ImPush.appCode,
                                        hwid : ImPush.getHWId()
                        };

                //payload = (params) ? JSON.stringify(params) : '';
                payload = (params) ? ImPush.getAsUriParameters(params) : '';
                ImPush.helper(url, method, payload, lambda, lambdaerror);
        },
        
        sendPushStat : function(hashValue, lambda, lambdaerror) {
                var method = 'POST';
                var url = ImPush.baseurl + 'pushstat';
                
                var params = {
                                        pid : ImPush.pid,
                                        app_code : ImPush.appCode,
                                        hwid : ImPush.getHWId(),
                                        hash: hashValue
                        };

                //payload = (params) ? JSON.stringify(params) : '';
                payload = (params) ? ImPush.getAsUriParameters(params) : '';
                ImPush.helper(url, method, payload, lambda, lambdaerror);
        },
                
        setTags : function(tagsJsonObject, lambda, lambdaerror) {
                var method = 'POST';
                var url = ImPush.baseurl + 'settags';
                
                var params = {
                                        app_code : ImPush.appCode,
                                        hwid : ImPush.getHWId(),
                                        tags: tagsJsonObject
                        };

                //payload = (params) ? JSON.stringify(params) : '';
                payload = (params) ? ImPush.getAsUriParameters(params) : '';
                ImPush.helper(url, method, payload, lambda, lambdaerror);
        },
        
        getNearestZone : function(lat, lng, lambda, lambdaerror) {
                var method = 'POST';
                var url = ImPush.baseurl + 'getnearestzone';
                
                var params = {
                                        app_code : ImPush.appCode,
                                        hwid : ImPush.getHWId(),
                                        lat: lat,
                                        lng: lng
                        };

                //payload = (params) ? JSON.stringify(params) : '';
                payload = (params) ? ImPush.getAsUriParameters(params) : '';
                ImPush.helper(url, method, payload, lambda, lambdaerror);
        },
        
        getAsUriParameters : function(data) {
           var url = '';
           for (var prop in data) {
              url += encodeURIComponent(prop)+'='+encodeURIComponent(data[prop])+'&';
           }
           return url.substring(0, url.length - 1);
        },
    
        helper : function(url, method, params, lambda, lambdaerror) {
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function() {		
                        if(xhr.readyState == 4) { //Request complete !!
                                if(xhr.status == 200) {
                                        // process response in JSON directly
                                        if(lambda) lambda(JSON.parse(xhr.responseText));
                                        //if(lambda) lambda(xhr.responseText);                                        
                                }
                                else {
                                        if(lambdaerror) lambdaerror(JSON.parse(xhr.responseText));
                                        //if(lambdaerror) lambdaerror(xhr.responseText);
                                }
                        }
                };

                // open the client
                xhr.open(method, url, true);
                //xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
				xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8');        
         
                // send the data
				//alert("helper: " + params);
                xhr.send(params);
        }
};

ImPush.baseurl = app_settings.api_url + '/';
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