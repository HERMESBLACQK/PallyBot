/*===========================================================================
*
*  AUDIO FILE UPLOAD - FILEPOND PLUGIN
*
*============================================================================*/

FilePond.registerPlugin( 

   FilePondPluginFileValidateSize,
   FilePondPluginFileValidateType

);

let pond = FilePond.create(document.querySelector('.filepond'));
let all_types;
let maxFileSize;
let type = '';
let typeShow = '';
let fileType;

$.ajax({
    headers: {
        'X-CSRF-TOKEN': '{{ csrf_token() }}',
    },
    type: "GET",
    url: 'settings',

  }).done(function(data) {

      maxFileSize = data['size'] + 'MB';
      all_types = data['type'];

     checkExtensions(all_types, data['type_show']);
     
     fileType = type;

      FilePond.setOptions({
         
          allowMultiple: false,
          maxFiles: 1,
          allowReplace: true,
          maxFileSize: maxFileSize,
          labelIdle: "Drag & Drop your audio file or <span class=\"filepond--label-action\">Browse</span><br><span class='restrictions'>[<span class='restrictions-highlight'>" + maxFileSize + "</span>: " + typeShow + "]</span>",
          required: true,
          instantUpload:false,
          storeAsFile: true,
          acceptedFileTypes: fileType,
          labelFileProcessingError: (error) => {
            console.log(error);
          }
    
      });

});


function checkExtensions(all_types, types) {

  'use strict';

  let id = document.getElementById('languages').value;

    typeShow = "WAV, FLAC";
    all_types.forEach(function (item, index, array) {
        if (index === array.length - 1){ 
          if ((item == 'audio/wav') || (item == 'audio/flac')) {
            type += item;
          }          
        } else {
          if ((item == 'audio/wav') || (item == 'audio/flac')) {
            type += item + ',';
          }
        }        
    });

    FilePond.setOptions({
      labelIdle: "Drag & Drop your audio file or <span class=\"filepond--label-action\">Browse</span><br><span class='restrictions'>[<span class='restrictions-highlight'>" + maxFileSize + "</span>: " + typeShow + "]</span>",
      acceptedFileTypes: type,
    });

 
}



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
*  TRANSCRIBE AUDIO FILE
*
*============================================================================*/
 $('#transcribe-audio').on('submit',function(e) {

  "use strict";

  e.preventDefault()
  
  let inputAudio = [];
  let duration;
  
  if (pond.getFiles().length !== 0) {   
      pond.getFiles().forEach(function(file) {
      inputAudio.push(file);
    });
  }

  let audio = document.createElement('audio');
  let objectUrl = URL.createObjectURL(inputAudio[0].file);

  audio.src = objectUrl;
  audio.addEventListener('loadedmetadata', function(){
    duration = audio.duration;
  },false);

  let form = $(this);
  let formData = new FormData(this);

  setTimeout(function() {

    formData.append('audiofile', inputAudio[0].file);
    formData.append('audiolength', duration);
    formData.append("taskType", 'file');

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
        success: function(data) {},
        error: function(data) {
            if (data.responseJSON['error']) {
                $('#notificationModal').modal('show');
                $('#notificationMessage').text(data.responseJSON['error']);
            }

            $('#transcribe').prop('disabled', false);
            $('#transcribe').html('Transcribe');   
            
            if (pond.getFiles().length != 0) {
                for (let j = 0; j <= pond.getFiles().length - 1; j++) {
                    pond.removeFiles(pond.getFiles()[j].id);
                }
            }
          
            inputAudio = [];
        }
    }).done(function(data) {
      $("#audioResultsTable").DataTable().ajax.reload();
      if (pond.getFiles().length != 0) {
          for (let j = 0; j <= pond.getFiles().length - 1; j++) {
              pond.removeFiles(pond.getFiles()[j].id);
          }
      }
    
      inputAudio = [];
    })

  }, 500);  

});



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

  checkVendorExtensions(['audio/flac', 'audio/wav']);

  let supported = [30, 41, 48, 51, 52, 58, 63, 72, 74, 92, 96, 117];
  if (supported.includes(parseInt(value))) {
      document.getElementById("removable-type").style.display = "block";
      document.getElementById("removable-speaker").style.display = "block";
  } else {
      document.getElementById("removable-type").style.display = "none";
      document.getElementById("removable-speaker").style.display = "none";
  }

}


function checkVendorExtensions(all_types) {

  'use strict';

  let id = document.getElementById('languages').value;
  let vendorType = '';

    typeShow = "WAV, FLAC";
    all_types.forEach(function (item, index, array) {
        if (index === array.length - 1){ 
          if ((item == 'audio/wav') || (item == 'audio/flac')) {
            vendorType += item;
          }          
        } else {
          if ((item == 'audio/wav') || (item == 'audio/flac')) {
            vendorType += item + ',';
          }
        }        
    });

    FilePond.setOptions({
      labelIdle: "Drag & Drop your audio file or <span class=\"filepond--label-action\">Browse</span><br><span class='restrictions'>[<span class='restrictions-highlight'>" + maxFileSize + "</span>: " + typeShow + "]</span>",
      acceptedFileTypes: vendorType,
    });

   
}


