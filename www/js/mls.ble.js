

//jQuery(document).ready(function($){

    //$(document).on('click', "#btnLogin", handleVideo);

    function handleBle() {
	   console.log('handleBle');			
      
    var element = document.getElementById('deviceProperties');
            element.innerHTML = 'Device Model: '    + device.model    + '<br />' +
                            'Device Cordova: '  + device.cordova  + '<br />' +
                            'Device Platform: ' + device.platform + '<br />' +
                            'Device UUID: '     + device.uuid     + '<br />' +
                            'Device Version: '  + device.version  + '<br />';
            
            var btstatus = document.getElementById('status');
            btstatus.innerHTML = "Getting bluetooth information";

            //window.bluetoothle.isEnabled(isEnabledSuccess);
            
            bluetoothSerial.isEnabled(
                function() { 
                    console.log("Bluetooth is enabled");
                   btstatus.innerHTML = 'Bluetooth is enabled';
                },
                function() { 
                    console.log("Bluetooth is *not* enabled");
                     btstatus.innerHTML = 'Bluetooth is disabled';
                }
            );    

        
    }
    
    
function traceLog(m) {
	console.log(m);
	$('.log').append('<li>'+m+'</li>');
}


  function checkBluetoothStatus() {
        var btstatus = document.getElementById('status');
        btstatus.innerHTML = "Checking bluetooth information";
        //window.bluetoothle.isEnabled(isEnabledSuccess);
        // window.bluetooth.isEnabled(isEnabledSuccess, isEnabledError);
        
        bluetoothSerial.isEnabled(
                function() { 
                    console.log("Bluetooth is enabled");
                   btstatus.innerHTML = 'Bluetooth is enabled';
                },
                function() { 
                    console.log("Bluetooth is *not* enabled");
                     btstatus.innerHTML = 'Bluetooth is disabled';
                }
            );  
    }

    function isEnabledSuccess(isEnabled){
       var btstatus = document.getElementById('status');
       if(isEnabled){
         btstatus.innerHTML = "Enabled";
       }else{
         btstatus.innerHTML = "Disabled";
       }
    }

    function isEnabledError(error){
       var btstatus = document.getElementById('status');
       btstatus.innerHTML = "Cannot determine Bluetooth status: " + error.message;
    }
    
//});
    

	
