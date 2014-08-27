var fwkAjax = {  

    /* ------------- */   
    /* NATIVE AJAX   */
    /* ------------- */ 
    getAsUriParameters : function(data) {
       var url = '';
       for (var prop in data) {
          url += encodeURIComponent(prop)+'='+encodeURIComponent(data[prop])+'&';
       }
       return url.substring(0, url.length - 1);
    },
    
    ajax_postAsync : function(url, data, callback) {
      var xhr = window.ActiveXObject ? new ActiveXObject('Microsoft.XMLHTTP') : new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          xhr.onreadystatechange = doNothing;
          callback(xhr, xhr.status);
        }
      };
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
      json_data = encodeURIComponent(JSON.stringify(data));
      xhr.send(json_data);
    },
    
    ajax_postJsonSync : function(url, params, lambda, lambdaerror) {            
      var payload = (params) ? wcFwk.getAsUriParameters(params) : '';
      var options = {async: false};
      wcFwk.ajax_sendRequest(url, 'POST', payload, lambda, lambdaerror, options);
    },
    
    ajax_postJsonAsync : function(url, params, lambda, lambdaerror) {            
      var payload = (params) ? wcFwk.getAsUriParameters(params) : '';
      //var options = {async: false};
      var options = {};
      wcFwk.ajax_sendRequest(url, 'POST', payload, lambda, lambdaerror, options);
    },

    ajax_getJsonAsync : function(url, params, lambda, lambdaerror) {
        if (params) {
            url += '?'+wcFwk.getAsUriParameters(params);
        }
        var payload = null;
        var options = {};
        wcFwk.ajax_sendRequest(url, 'GET', payload, lambda, lambdaerror, options);
    },

    ajax_getJsonSync : function(url) {
        var xhr = window.ActiveXObject ? new ActiveXObject('Microsoft.XMLHTTP') : new XMLHttpRequest();                
        xhr.open('GET', url, false);
        xhr.send(null);            
        if (xhr.status === 200) {          
            json_data = JSON.parse(xhr.responseText);          
            return json_data;
        }                   
        //return JSON.parse('{}');       
    },

    ajax_sendRequest : function(url, method, params, lambda, lambdaerror, options) {
        this.options = { async: true, json: true };
        //var noCache = Date();  
        // merge options
        for (var attr in options) {
            this.options[attr] = options[attr];
        }
        options = this.options;
      
        //console.log(this.options);
        var xhr = window.ActiveXObject ? new ActiveXObject('Microsoft.XMLHTTP') : new XMLHttpRequest();
        xhr.onreadystatechange = function() {		
                        if(xhr.readyState == 4) { //Request complete !!
                                if(xhr.status == 200) {    
                                    if(lambda) {
                                        if (options.json) lambda(JSON.parse(xhr.responseText));                                       
                                        else lambda(xhr.responseText);
                                        //callback(xhr, xhr.status);
                                    }
                                } else {                                        
                                    if(lambdaerror) {
                                        if (options.json) lambdaerror(JSON.parse(xhr.responseText));
                                        else lambdaerror(xhr.responseText);
                                    }
                                }
                        }
        };
        xhr.open(method, url, options.async);
        //xhr.setRequestHeader('User-Agent','XMLHTTP/1.0');
        if (method == "POST") xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8');  
        //else xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');         
        xhr.send(params);
    },

    /*
function sendRequest(url,callback,postData) {
	//var req = createXMLHTTPObject();
    var req = window.ActiveXObject ? new ActiveXObject('Microsoft.XMLHTTP') : new XMLHttpRequest();

	if (!req) return;
	var method = (postData) ? "POST" : "GET";
	req.open(method,url,true);
	req.setRequestHeader('User-Agent','XMLHTTP/1.0');
	if (postData)
		req.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	req.onreadystatechange = function () {
		if (req.readyState != 4) return;
		if (req.status != 200 && req.status != 304) {
//			alert('HTTP error ' + req.status);
			return;
		}
		callback(req);
	}
	if (req.readyState == 4) return;
	req.send(postData);
}
*/
};
