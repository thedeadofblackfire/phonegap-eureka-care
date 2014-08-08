

//jQuery(document).ready(function($){

    //$(document).on('click', "#btnLogin", handleVideo);

    function handleVideo() {
	   console.log('handleVideo');			
      
       $.ajax({
              url: API+"/authvideo",
              type: "POST",
              dataType : 'json',
              data:{patient_user_seq: objUser.user_id},
              success :function(data){
              	//window.location.reload();
				console.log(data);
                
                
                
                var vlineClient = (function(){
	  	  
	  var client, vlinesession,
		authToken = data.video_authToken,
		serviceId = data.video_serviceId,
        profile = data.video_profile;
		//profile = {"displayName": video_profile.displayName, "id": video_profile.id};
	
	  // Create vLine client  
	  window.vlineClient = client = vline.Client.create({"serviceId": serviceId, "ui": true});
	  // Add login event handler
	  client.on('login', onLogin);
	  // Do login
	  
	  
      client.login(serviceId, profile, authToken);
      
	
	  function onLogin(event) {
		vlinesession = event.target;
		// Find and init call buttons and init them
		$(".callbutton").each(function(index, element) {
           initCallButton($(this)); 
        });
	  }
	
	  // add event handlers for call button
	  function initCallButton(button) {
		var userId = button.attr('data-userid');
        console.log(userId);
	  
		// fetch person object associated with username
		vlinesession.getPerson(userId).done(function(person) {
		  // update button state with presence
		  function onPresenceChange() {
			if(person.getPresenceState() == 'online'){
			    button.addClass('active');
                //button.removeClass().addClass('active');
                button.find('span.status').removeClass('offline').addClass('online');
                button.css('display', 'block');
			}else{
			    button.removeClass('button-submit').removeClass('active').addClass('disabled');
                //button.removeClass().addClass('disabled');
                button.css('display', 'none');
			}
			button.attr('data-presence', person.getPresenceState());
		  }
		
		  // set current presence
		  onPresenceChange();
		
		  // handle presence changes
		  person.on('change:presenceState', onPresenceChange);
		
		  // start a call when button is clicked
		  button.click(function() {
		      	  if (person.getId() == vlinesession.getLocalPersonId()) {
				alert('You cannot call yourself. Login as another user in an incognito window');
				return;
		       	  }
			  if(button.hasClass('active'))
				person.startMedia();
		  });
		});
		
	  }
	  
	  return client;
	})();
	
	$(window).unload(function() {
	  vlineClient.logout();
	});
    
    
                
                
                
              },
              error:function(data){    
				console.log(data);			  
              } 
        });
        
    }
    
//});
    

	
