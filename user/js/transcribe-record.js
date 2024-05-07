/*===========================================================================
*
*  DISPLAY SPEAKER IDENTIFICATION
*
*============================================================================*/
$(document).ready(function(){

  "use strict";

  if (document.getElementById('type').value == 'true') {
    $('#speakers-box').fadeIn();
  } else {
      $('#speakers-box').fadeOut();
  }
})

function displaySpeakerIdentification() {

  "use strict";

  if (document.getElementById('type').value == 'true') {
      $('#speakers-box').fadeIn();
  } else {
      $('#speakers-box').fadeOut();
  }
}



/*===========================================================================
*
*  RECORD TRANSCRIBE COUNTDOWN TIMER
*
*============================================================================*/
let time_limit; 
let clock;

$.ajax({
  headers: {
      'X-CSRF-TOKEN': '{{ csrf_token() }}',
  },
  type: "GET",
  url: 'settings',

}).done(function(data) {

    time_limit = data['length_file'];

    clock = $(".countdown").FlipClock(0, {
      countdown: true,
      clockFace: 'HourCounter',
      autoStart: false,
      callbacks: {
                stop: function() {
                  stopRecording();       
                  clock.setTime(time_limit*60);
                }
              }
    });  

    clock.setTime(time_limit*60);
    
});



/*===========================================================================
*
*  RECORD TRANSCRIBE ACTION BUTTONS (START & STOP)
*
*============================================================================*/

$(document).ready(function(){

    "use strict";

    /* -------------------------------------------- */
    /*    START RECORDING
    /* -------------------------------------------- */
    $("#record").on("click", function(e){

        e.preventDefault();

        clock.start();     

        startRecording();

    });


    /* -------------------------------------------- */
    /*    STOP RECORDING
    /* -------------------------------------------- */
    $("#stop").on("click", function(e){

        e.preventDefault();
        
        stopRecording();

        clock.stop();
        clock.setTime(time_limit*60);

    });

});



/*===========================================================================
*
*  RECORD TRANSCRIBE MAIN AUDIO FUNCTIONS
*
*============================================================================*/

URL = window.URL || window.webkitURL;
let gumStream;
let rec;
let input;
let audioStream;
let AudioContext = window.AudioContext || window.webkitAudioContext;
let audioLengthRecorded;

function startRecording() {

    /* Simple constraints object, for more advanced audio features see https://addpipe.com/blog/audio-constraints-getusermedia/ */
    let constraints = { audio: true, video:false }
     

    /* Disable the record button until we get a success or fail from getUserMedia() */
    $("#recordings").slideUp();

    $("#record").prop("disabled", true).addClass('is-recording is-blocked').removeClass('active').html('<i class="fa fa-microphone"></i>Recording');

    $("#stop").prop("disabled", false).removeClass("is-blocked").addClass("active");

   
    /*
        We're using the standard promise based getUserMedia() 
        https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
    */

    navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {

        /*
          create an audio context after getUserMedia is called
          sampleRate might change after getUserMedia is called, like it does on macOS when recording through AirPods
          the sampleRate defaults to the one set in your OS for your playback device

        */
        audioContext = new AudioContext({
          sampleRate: 48000,
        });

        
        $("#audio-format").slideDown();

        /*  assign to gumStream for later use  */
        gumStream = stream;
        
        /* use the stream */
        input = audioContext.createMediaStreamSource(stream);

        /* 
          Create the Recorder object and configure to record mono sound (1 channel)
          Recording 2 channels  will double the file size
        */
        rec = new Recorder(input,{numChannels:1})

        //start the recording process
        rec.record()

        console.log("Recording started");

    }).catch(function(err) {

      //enable the record button if getUserMedia() fails
      $("#record").prop("disabled", false);

      $("#stop").prop("disabled", true);   
      
    });
}


function stopRecording() {
 
    "use strict";

    //disable the stop button, enable the record too allow for new recordings
    $("#record").prop("disabled", false).removeClass('is-recording is-blocked').addClass('active').html('<i class="fa fa-microphone"></i>Record');

    $("#stop").prop("disabled", true).addClass("is-blocked").removeClass("active");
    
    $("#audio-format").slideUp();

 
    clock.setTime(time_limit*60);

    //tell the recorder to stop the recording
    rec.stop();

    //stop microphone access
    gumStream.getAudioTracks()[0].stop();

    //create the wav blob and pass it on to createDownloadLink
    rec.exportWAV(createDownloadLink);

    $("#recordings").slideDown().css("display", "flex");
}


function createDownloadLink(blob) {
  
    "use strict";     

    let url = URL.createObjectURL(blob);
    let audio = $('#audio');
    let link = $('#audio-link');
    audioStream = blob;

    //name of .wav file to use during upload and download (without extendion)
    let date = new Date().getTime();

    //add controls to the <audio> element
    audio[0].src = url;

    audio[0].addEventListener('canplaythrough', (event) => {

        let seconds = event.currentTarget.duration;

        audioLengthRecorded = seconds;

    });

    let filename = date + ".wav";

    //save to disk link
    link.attr('href', url);

    link.attr('download', filename); 

    link.html('Download');

    $("#recordings").slideDown();
}



/*===========================================================================
*
*  TRANSCRIBE RECORDED FILE
*
*============================================================================*/
          
$("#transcribe-record").on("submit",(function(e) {

  "use strict";

  e.preventDefault();

  let form = $(this);
  let formData = new FormData(this);

  if (audioStream) {
      let audiofile = new Blob([audioStream], { type: "audio/wav" });
      formData.append("audiofile", audiofile);
      formData.append("audiolength", audioLengthRecorded);
      formData.append("extension", 'wav');
      formData.append("taskType", 'record');

       $.ajax({
            headers: {
              'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
             type: "POST",
             url: form.attr('action'),
             data: formData,
             contentType: false,
             processData: false,
             cache: false,
             beforeSend: function() {
                $('#transcribe').html('');
                $('#transcribe').prop('disabled', true);
                $('#processing').show().clone().appendTo('#transcribe'); 
                $('#processing').hide();  
             },
             complete: function() {
                $('#transcribe').prop('disabled', false);
                $('#processing', '#transcribe').empty().remove();
                $('#processing').hide();
                $('#transcribe').html('Transcribe'); 
             },
             success: function(response) { },
             error: function (response) 
              {
                if (response.responseJSON['error']) {
                  $('#notificationModal').modal('show');
                  $('#notificationMessage').text(response.responseJSON['error']);
                }
  
                $('#transcribe').prop('disabled', false);
                $('#transcribe').html('Transcribe');
              }

           }).done(function(response) {
                $("#resultTable").DataTable().ajax.reload(); 
                $("#recordings").slideUp();
                audioStream = '';                
           })

    } else {
        $('#notificationModal').modal('show');
        $('#notificationMessage').text('Record your speech first before submitting a transcribe task.');
    }
}));


/*===========================================================================
*
*  CHECK LANGUAGE FEATURES
*
*============================================================================*/
$(document).ready(function() {
  
  "use strict";

  let id = document.getElementById('languages').value;

  let supported = [30, 41, 48, 51, 52, 58, 63, 72, 74, 92, 96, 117];
  if (supported.includes(parseInt(id))) {
      document.getElementById("removable-type").style.display = "block";
      document.getElementById("removable-speaker").style.display = "block";
  } else {
      document.getElementById("removable-type").style.display = "none";
      document.getElementById("removable-speaker").style.display = "none";
  }
  
});


function processLanguageFeature(value) {

  "use strict";

    let supported = [30, 41, 48, 51, 52, 58, 63, 72, 74, 92, 96, 117];
    if (supported.includes(parseInt(value))) {
        document.getElementById("removable-type").style.display = "block";
        document.getElementById("removable-speaker").style.display = "block";
    } else {
        document.getElementById("removable-type").style.display = "none";
        document.getElementById("removable-speaker").style.display = "none";
    }

}