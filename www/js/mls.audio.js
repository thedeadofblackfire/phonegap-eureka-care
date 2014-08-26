
(function($) {

    $.extend({
        playSound: function() {
            return $("<embed src='" + arguments[0] + "' hidden='true' autostart='true' loop='false' class='playSound'>").appendTo('.play');
        }
    });

})(jQuery);


// Audio player
var my_media = null;
        
function play_audio(audiofile) {
    //http://docs.phonegap.com/en/3.2.0/cordova_media_media.md.html#Media
    if (audioEnable) {
        if (ENV == 'dev') {
            $.playSound(audiofile);
        } else {   
            if (my_media == null) {           
                //ar myMedia = new Media("documents://beer.mp3")
                my_media = new Media(audiofile, onMediaSuccess, onMediaError);
            } // else play current audio
                    
            // Play audio
            my_media.play();
        }
    }

}
// onSuccess Callback
function onMediaSuccess() {
    console.log("playAudio():Audio Success");
}

// onError Callback
function onMediaError(error) {
    console.log("playAudio():Audio Error: " + err);
            /*
            alert('code: '    + error.code    + '\n' +
                  'message: ' + error.message + '\n');
            */
}
        