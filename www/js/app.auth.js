
// ---------------------
// AUTH
// ---------------------          
app.auth = {};
       
app.auth.checkPreAuth = function(login) {
	console.log('AUTH - checkPreAuth');
                          
    var result = false;                    
	if(Object.keys(objUser).length == 0 && window.localStorage["username"] != undefined && window.localStorage["password"] != undefined) {			         
		app.auth.handleLogin(window.localStorage["username"], window.localStorage["password"], false);
	} else if (Object.keys(objUser).length == 0) {
        if (login === false) mofChangePage('login.html');
    }
        
    return result; 
}

app.auth.handleLoginForm = function() {
	console.log('AUTH - handleLoginForm');			
	var form = $("#loginForm");  		
	var u = $("#username", form).val();
	var p = $("#password", form).val();
    app.auth.handleLogin(u, p, true); 
}
        
app.auth.handleLogin = function(u,p,fromform) {
	console.log('AUTH - handleLogin fromform='+fromform);		

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
            url: app_settings.api_url+"/authloginpatient",
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

app.auth.handleLogout =	function() {
	console.log('AUTH - handleLogout');	
	mofProcessBtn(".btn-logout", true);
	$.getJSON(app_settings.api_url+"/authlogoutpatient", function(res) {
		if (res.success) {
			window.localStorage.clear();  
			window.sessionStorage.clear();	

	        objUser = {};				
                
            mofProcessBtn(".btn-logout", false);
            mofChangePage('login.html');
		}
	});				
}
    	
app.auth.goRegister = function() {
	window.plugins.ChildBrowser.showWebPage('http://patient.eureka-platform.com', { showLocationBar: true });
}
    
/*
app.auth.handleUpdateNotification = function(current_status) {
	console.log('AUTH - handleUpdateNotification '+current_status);			
        
    $.ajax({
        url : app_settings.api_url+"/account/notificationstatus",
        type: "POST",
        dataType : 'json',
        data:{user_seq: objUser.uuid, action:'notificationStatus', status:current_status},
        success :function(data){
			console.log(data);
        },
        error:function(data){    
			console.log(data);			  
        } 
    });       
}
*/