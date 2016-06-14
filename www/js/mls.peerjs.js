

	//var peer = new Peer({key: '3mw5ojc1w8my4x6r', 'secure': true, 'config':{ 'iceServers': [{ 'url': 'stun:stun.l.google.com:19302' }] } });
	

	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
		
	window.URL = window.URL || window.webkitURL;
	
	var callSettings = {
	  video: {
		mandatory: {
		  maxWidth: 400,
		  maxHeight: 300
		}
	  },
	  audio: true
	};
	
	
	 // get audio/video stream
    navigator.getUserMedia({audio:true, video: true}, function(stream) {
        //display video
		$('#myVideo').prop('src', URL.createObjectURL(stream));
        //var video = document.getElementById("myVideo");
		//video.src = window.URL.createObjectURL(stream);
        window.localStream = stream;
		console.log('local Stream');
      },
      function (error) { console.log(error); }
    );
	

	/*
	// media call
	function videoCall(peers_id) {
		navigator.getUserMedia({video: true, audio: true}, function(stream) {
		  var call = peer.call(peers_id, stream);
		  call.on('stream', function(remoteStream) {
			// Show stream in some <video> element.
		  });
		}, function(err) {
		  console.log('Failed to get local stream' ,err);
		});
	}

	// media answer
	function videoAnswer() {
		peer.on('call', function(call) {
		  navigator.getUserMedia({video: true, audio: true}, function(stream) {
			call.answer(stream); // Answer the call with an A/V stream.
			call.on('stream', function(remoteStream) {
			  // Show stream in some <video> element.
			});
		  }, function(err) {
			console.log('Failed to get local stream' ,err);
		  });
		});
	}
	
	*/

	 var peer; 
 jQuery(document).ready(function($){
	
	/*
	peer = new Peer({key: '3mw5ojc1w8my4x6r', 'debug': 3, config: {'iceServers': [
        { url: 'stun:stun.l.google.com:19302' },
        { url: 'stun:stun1.l.google.com:19302' },
      ]} });
	  */
	 
	/*
	 peer = new Peer({host: 'localhost', port: 9000, debug: 3,  config: {'iceServers': [
    { url: 'stun:stun.l.google.com:19302' }
  ]} 
  });
  
  //peer.eureka-platform.com
  //82.165.11.158
  //s16788987.domainepardefaut.fr
*/  
	 peer = new Peer({host: 'peer.eureka.care', port: 9000, debug: 3, secure: true, config: {'iceServers': [ 
	{url:'stun:stun01.sipphone.com'},
{url:'stun:stun.ekiga.net'},
{url:'stun:stun.fwdnet.net'},
{url:'stun:stun.ideasip.com'},
{url:'stun:stun.iptel.org'},
{url:'stun:stun.rixtelecom.se'},
{url:'stun:stun.schlund.de'},
{url:'stun:stun.l.google.com:19302'},
{url:'stun:stun1.l.google.com:19302'},
{url:'stun:stun2.l.google.com:19302'},
{url:'stun:stun3.l.google.com:19302'},
{url:'stun:stun4.l.google.com:19302'},
{url:'stun:stunserver.org'},
{url:'stun:stun.softjoys.com'},
{url:'stun:stun.voiparound.com'},
{url:'stun:stun.voipbuster.com'},
{url:'stun:stun.voipstunt.com'},
{url:'stun:stun.voxgratia.org'},
{url:'stun:stun.xten.com'},
{
	url: 'turn:numb.viagenie.ca',
	credential: 'muazkh',
	username: 'webrtc@live.com'
},
{
	url: 'turn:192.158.29.39:3478?transport=udp',
	credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
	username: '28224511:1379330808'
},
{
	url: 'turn:192.158.29.39:3478?transport=tcp',
	credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
	username: '28224511:1379330808'
}
  ]} 
  });
  

  /*
	  
	  	 // get audio/video
    navigator.getUserMedia({audio:true, video: true}, function(stream) {
        //display video
        var video = document.getElementById("myVideo");
		video.src = window.URL.createObjectURL(stream);
        window.localStream = stream;
		console.log('local Stream');
      },
      function (error) { console.log(error); }
    );
	*/

	//console.log(peer);
	console.log(util.supports);
	
	// Handle event: upon opening our connection to the PeerJS server
	peer.on('open', function(id) {
		console.log('My peer ID is: ' + id);
		$('#myPeerId').text(id); //peer.id
	});
	
	// Handle event: remote peer receives a call
    peer.on('call', function(incomingCall) {
		

		  navigator.getUserMedia({video: true, audio: true}, function(stream) {
			 			  
			//window.currentCall = incomingCall;
			incomingCall.answer(stream); // Answer the call with an A/V stream.
			
			// Hang up on an existing call if present
			if (window.existingCall) {
				window.existingCall.close();
			}
	  
			// Wait for stream on the call, then set peer video display
			incomingCall.on('stream', function(remoteStream) {
				// Show stream in some <video> element.
				//window.remoteStream = remoteStream;
				console.log('init remoteStream');
				//var video = $('#theirVideo'); //document.getElementById("theirVideo");
				//video.src = window.URL.createObjectURL(remoteStream);				
				$('#theirVideo').prop('src', URL.createObjectURL(remoteStream));
			});
			
			 // UI stuff
			window.existingCall = incomingCall;
			//$('#their-id').text(call.peer);
			incomingCall.on('close', function() {
				console.log('close call');
				window.existingCall.close();
				//ui change
			});
	  
		  }, function(err) {
			console.log('Failed to get local stream' ,err);
		  });
		
		/*
      window.currentCall = incomingCall;
      incomingCall.answer(window.localStream);
      incomingCall.on('stream', function (remoteStream) {
        window.remoteStream = remoteStream;
		console.log('call');
        var video = $('#theirVideo'); //document.getElementById("theirVideo");
        video.src = window.URL.createObjectURL(remoteStream);
      });
	  */
    });
	
	//receive data
	peer.on('connection', function(conn) {	  
	  conn.on('data', function(data){
		// Will print 'hi!'
		console.log('Received', data);
		//console.log(data);
		$('#video-message').append('<p>'+data+'</p>');
	  });
	  window.currentDataChannel = conn;
	});
	
	//var videoel = $("#teacher-stream")[0];

    $(document).on('click', "#makeCall", function () //A button initiates call
    {
		console.log('call id='+$('#remotePeerId').val());
		var peerTarget = $('#remotePeerId').val();
		
		//navigator.getUserMedia({video: true, audio: true}, function(stream) {
		   // Initiate a call!
		  var outgoingCall = peer.call(peerTarget, window.localStream);		  
		  outgoingCall.on('stream', function(remoteStream) {
			// Show stream in some <video> element.
			//window.remoteStream = remoteStream;
			console.log('init remoteStream by makecall');
			//var video = $('#theirVideo'); 
			//video.src = URL.createObjectURL(remoteStream); //window.URL.createObjectURL(remoteStream);
			 $('#theirVideo').prop('src', URL.createObjectURL(remoteStream));
		  });
		  window.existingCall = outgoingCall;
		  /*
		}, function(err) {
		  console.log('Failed to get local stream' ,err);
		});
		*/
		
		/*
		var outgoingCall = peer.call(peerTarget, window.localStream);
		window.currentCall = outgoingCall;
		outgoingCall.on('stream', function (remoteStream) {
			window.remoteStream = remoteStream;
			console.log('youpi');
			var video = $('#theirVideo'); //document.getElementById("theirVideo");
			video.src = window.URL.createObjectURL(remoteStream);
		});
		*/
	  
	  /*
        var peerID = $(this).data('id'); //Button contains ID of peer
        navigator.getMedia(callSettings, function (stream)
        {
            var call = peer.call(peerID, stream);
            call.on('stream', function(remoteStream)
            {
                console.log('stream!');
				//var video = document.getElementById("theirVideo");
                videoel.src = window.URL.createObjectURL(remoteStream);
                            //On stream copy data to video el

            });
        });
		*/
    });
	
	
	  $(document).on('click', "#sendData", function () {
		  console.log('call id='+$('#remotePeerId').val());
	      var conn = peer.connect($('#remotePeerId').val());
		  conn.on('open', function(){
			console.log('Open dataConnection');
			// receive message
			conn.on('data', function(data) {
				console.log('Received', data);
				$('#video-message').append('<p>'+data+'</p>');
			});
			
			// close
			conn.on('close', function() {
				console.log('Close dataConnection');
				window.currentDataChannel = null;
			});
			
			conn.send('hi!');
			window.currentDataChannel = conn;
		  });
		 
	  });
	  
	  $(document).on('click', "#sendMessage", function () {
		  console.log('sendMessage msg='+$('#message').val());
		  if (window.currentDataChannel) {
			var mes = $('#message').val();
			window.currentDataChannel.send(mes);
			$('#video-message').append('<p>'+mes+'</p>');
		  }
		
		 
	  });
	  
	  $(document).on('click', "#endCall", function () {
		  //window.currentCall.close();
		  window.existingCall.close();
	  });

	  /*
    peer.on('call', function(call)
    {
        console.log('got call');
        navigator.getMedia(callSettings, function(stream)
        {
            call.answer(stream);
            call.on('stream', function(remoteStream)
            {
				
                videoel.src = window.URL.createObjectURL(remoteStream);

            });
        });
    });
	*/
  
});	
