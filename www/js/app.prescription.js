
// ---------------------
// PRESCRIPTION
// ---------------------
var capturedPhoto = 0;
var uploadedPhoto = 0;
var hasPic = 0;
var prescriptionURI;

app.prescription = {};

//Success callback
app.prescription.win = function(r) {    
    //playBeep();
    //vibrate();
    //console.log("Image uploaded successfully!!"); 
    //alert("Image uploaded successfully!!"); 
	uploadedPhoto++;
    //alert(uploadedPhoto);
    
    //$('.status').html('');
    NProgress.done();
	
	//document.getElementById('damagedbtn').enabled = true;
	//NProgress.done(true);				
				
    //alert("Sent = " + r.bytesSent); 
    console.log("Code = " + r.responseCode);
    console.log("Response = " + r.response);
    console.log("Sent = " + r.bytesSent);
	
	var prescriptionFrame = document.getElementById('prescriptionFrame');
    prescriptionFrame.src = 'img/focus.svg';
	
	console.log('upload done');
}

//Failure callback
app.prescription.fail = function(error) {
   console.log("There was an error uploading image");
   
   switch (error.code) 
    {  
     case FileTransferError.FILE_NOT_FOUND_ERR: 
      console.log("Photo file not found"); 
      break; 
     case FileTransferError.INVALID_URL_ERR: 
      console.log("Bad Photo URL"); 
      break; 
     case FileTransferError.CONNECTION_ERR: 
      console.log("Connection error "+error.source+" "+error.target); 
	  // @todo need to upload again using error.source as imageURI
      break;  
	  case FileTransferError.ABORT_ERR:
	  console.log("upload Abort");
	  break;
    } 

    console.log("An error has occurred: Code = " + error.code); 
    console.log("upload error source " + error.source);
    console.log("upload error target " + error.target);
}

// Called if something bad happens.
app.prescription.onFail = function(message) {
    console.log('Failed because: ' + message);
	//var msg ='Impossible de lancer l\'appareil photo';        
    //navigator.notification.alert(msg, null, '');       
}

app.prescription.capturePrescription = function() {
	var destinationType = Camera.DestinationType.NATIVE_URI;
	if (objConfig.platform == 'Android') {
		destinationType = Camera.DestinationType.FILE_URI;
	}
	console.log('destinationType='+destinationType);
	
    navigator.camera.getPicture(app.prescription.showPrescription, app.prescription.onFail, { quality: 70,
    destinationType: destinationType, correctOrientation: true });
}

// A button will call this function
// To select image from gallery
app.prescription.getPrescription = function() {
	var destinationType = navigator.camera.DestinationType.NATIVE_URI;
	if (objConfig.platform == 'Android') {
		destinationType = navigator.camera.DestinationType.FILE_URI;
	}
	console.log('destinationType='+destinationType);
	
    // Retrieve image file location from specified source
    navigator.camera.getPicture(app.prescription.showPrescription, app.prescription.onFail, { quality: 70,
        destinationType: destinationType,
		correctOrientation: true,
        sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
    });
}

app.prescription.showPrescription = function(imageURI) {
	if (!imageURI) {
        document.getElementById('camera_status').innerHTML = "Take picture or select picture from library first.";
        return;
    }
   
    var prescriptionFrame = document.getElementById('prescriptionFrame');
    prescriptionFrame.src = imageURI;
    if(imageURI.length != 0){
        hasPic = 1;
    }
	  
	//If you wish to display image on your page in app
	capturedPhoto++;
	
	prescriptionURI = imageURI;
}

app.prescription.uploadVin = function(imageURI) {
	
   if (!imageURI) {
        document.getElementById('camera_status').innerHTML = "Take picture or select picture from library first.";
        return;
   }
	
   var prescriptionFrame = document.getElementById('prescriptionFrame');
      prescriptionFrame.src =  imageURI;
      if(imageURI.length != 0){
        hasPic = 1;
      }
	  
	 //If you wish to display image on your page in app
	//displayPhoto(imageURI);	 
	capturedPhoto++;
	
	
	NProgress.start();
	
	var request_id = objUser.uuid;
	console.log('request_id='+request_id);
	
	// upload
    var options = new FileUploadOptions();
    options.fileKey = "file";
    // var userid = '123456';
    var imagefilename = request_id + '_ordo_' + Number(new Date()) + ".jpg";
    //options.fileName = imageURI;
	//options.fileName = imagefilename;
	options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
    options.mimeType = "image/jpeg"; 

    var params = new Object();
    params.imageURI = imageURI;
	params.imageFileName = imagefilename;
	params.seq = capturedPhoto;
	params.office_seq = objUser.office.office_seq;
	params.patient_user_seq = objUser.uuid;
	params.request_id = request_id;
	params.upload_type = 'prescription';
	//params.id = request_id;
    //params.userid = sessionStorage.loginuserid;
    options.params = params;
    options.chunkedMode = true; //true;
    
    var ft = new FileTransfer();
    var url = encodeURI(app_settings.api_url+"/upload");
	console.log(url);
	
    ft.onprogress = function(progressEvent) {
        if (progressEvent.lengthComputable) {
          var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
		  //statusDom.innerHTML = perc + "% uploaded...";
          // console.log('uploading '+perc+'%');
          NProgress.set(perc / 100);
          //$('.status').html(perc + "% uploaded...");          
          //loadingStatus.setPercentage(progressEvent.loaded / progressEvent.total);
        } else {
          NProgress.inc();
          //loadingStatus.increment();
          /*
          var statusUploaded = $('.status').html();
          if (statusUploaded == "") {
              $('.status').html('Uploading');
          } else {
              $('.status').html(statusUploaded+'.');
          }
          */
          /*
          if(statusDom.innerHTML == "") {
				statusDom.innerHTML = "Uploading";
		  } else {
				statusDom.innerHTML += ".";
		  }
          */
        }
    };
    ft.upload(imageURI, url, app.prescription.win, app.prescription.fail, options);       
    
}

app.prescription.validPagePrescription = function() {

  if(hasPic == 1 && prescriptionURI){
			/*
			var formData = $("#form-confirmrequest").serialize();
		
            console.log(formData);
			
              $.ajax({
                    type: "POST",
                    url: app_settings.api_url+"/ajax.php?m=confirmrequest&id="+request_id,
                    cache: false,
                    data: formData,                    
                    beforeSend: function() {
                        // This callback function will trigger before data is sent
                        //$.mobile.showPageLoadingMsg(true); // This will show ajax spinner
                    },
                    complete: function() {
                        // This callback function will trigger on data sent/received complete
                        //$.mobile.hidePageLoadingMsg(); // This will hide ajax spinner
                    },
                    success: function (result) {
                        //    resultObject.formSubmitionResult = result;
                        //                $.mobile.changePage("#second");
                        console.log(result);  
						
                        //$("#page-addlocation").dialog('close');
                        //$('[data-role=dialog]').dialog( "close" );
						//window.location="#page4
						if (result.success) {
							$('#request_id').html(request_id);
							
							// clean datas
							request_id = '';
							window.localStorage.setItem('request_id', '');
							
							//$('#form-addrequest')[0].reset();
							$('#form-confirmrequest')[0].reset();	
							//capturedPhoto = 0;
							//uploadedPhoto = 0;							
							//$('#pictures').html('');
							//$('#picture-demo').show();
						
							$('#prescriptionFrame').attr('src','img/service-4.png.png');
							
							// move to final page
							//$.mobile.changePage("#page-completed");
						}
                    },
                    error: function (request,error) {
                        // This callback function will trigger on unsuccessful action                
                        alert('Network error has occurred please try again!');
                    }
                });
			*/
			
    
	NProgress.start();
	
	// upload
    var options = new FileUploadOptions();
    options.fileKey = "file";
    var imagefilename = objUser.uuid + '_ordo_' + Number(new Date()) + ".jpg";
	options.fileName = prescriptionURI.substr(prescriptionURI.lastIndexOf('/')+1);
    options.mimeType = "image/jpeg"; 

    var params = new Object();
    params.imageURI = prescriptionURI;
	params.imageFileName = imagefilename;
	params.seq = capturedPhoto;
	params.office_seq = objUser.office.office_seq;
	params.patient_user_seq = objUser.uuid;
	params.upload_type = 'prescription';
    options.params = params;
    options.chunkedMode = true; //true;
    
    var ft = new FileTransfer();
    var url = encodeURI(app_settings.api_url+"/upload");
	console.log(url);
	
    ft.onprogress = function(progressEvent) {
        if (progressEvent.lengthComputable) {
          var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);		     
          NProgress.set(perc / 100);
        } else {
          NProgress.inc();       
        }
    };
    ft.upload(prescriptionURI, url, app.prescription.win, app.prescription.fail, options);      
				
     //window.location = "#page-details";
	 
	 //localStorage.clear();
  } else {
     navigator.notification.alert(
            'Take a Picture of Your prescription',  // message
            app.prescription.alertDismissed,         // callback
            'Prescription',            // title
            'Ok'                  // buttonName
        );

   }
}

//alert dialog dismissed
app.prescription.alertDismissed = function() {
    // do something
}
