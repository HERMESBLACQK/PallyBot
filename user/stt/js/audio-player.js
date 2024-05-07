/*===========================================================================
*
*  AUDIO PLAYER - GREEN AUDIO PLAYER PLUGIN 
*
*============================================================================*/

$(document).ready(function() {

    "use strict";
 
     GreenAudioPlayer.init({
         selector: '.player', // inits Green Audio Player on each audio container that has class "player"
         stopOthersOnPlay: true,
     });

     GreenAudioPlayer.init({
        selector: '.user-result-player', // inits Green Audio Player on each audio container that has class "player"
        stopOthersOnPlay: false,
        showDownloadButton: true,
        showTooltips: true
    });

    GreenAudioPlayer.init({
        selector: '.green-player', // inits Green Audio Player on each audio container that has class "player"
        stopOthersOnPlay: false,
        showDownloadButton: true,
        showTooltips: true
    });
   
 
 });


/*===========================================================================
*
*  AUDIO PLAYER - SINGLE BUTTON PLAYER
*
*============================================================================*/

let current = '';
let audio = new Audio();

function resultPlay(element){

    let src = $(element).attr('src');
    let type = $(element).attr('type');
    let id = $(element).attr('id');

    let isPlaying = false;
    
    audio.src = src;
    audio.type= type;    

    if (current == id) {
        audio.pause();
        isPlaying = false;
        document.getElementById(id).innerHTML = '<i class="fa fa-play"></i>';
        document.getElementById(id).classList.remove('result-pause');
        current = '';

    } else {    
        if(isPlaying) {
            audio.pause();
            isPlaying = false;
            document.getElementById(id).innerHTML = '<i class="fa fa-play"></i>';
            document.getElementById(id).classList.remove('result-pause');
            current = '';
        } else {
            audio.play();
            isPlaying = true;
            if (current) {
                document.getElementById(current).innerHTML = '<i class="fa fa-play"></i>';
                document.getElementById(current).classList.remove('result-pause');
            }
            document.getElementById(id).innerHTML = '<i class="fa fa-pause"></i>';
            document.getElementById(id).classList.add('result-pause');
            current = id;
        }
    }

    audio.addEventListener('ended', (event) => {
        document.getElementById(id).innerHTML = '<i class="fa fa-play"></i>';
        document.getElementById(id).classList.remove('result-pause');
        isPlaying = false;
        current = '';
    });      
        
}


 


 