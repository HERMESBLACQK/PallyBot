/*===========================================================================
*
*  SHOW GCP CONVERSATION RESULT
*
*============================================================================*/

function processGCPConversation(raw, text) {

        let response = raw;
        let words = response['alternatives'][0]['words'];
        let speaker = 0, start = '', end = '';
        let speaker_text = '';
        let speaker_time = '';
        let speaker_result = '';

        words.forEach(function (item, index) {

            if (speaker != item['speakerTag']) {

                speaker = item['speakerTag'];
                start = item['startTime'];
                end = item['endTime'];

                speaker_time = 'Speaker#' + speaker + ': ' + start + ' - ';
                speaker_text += item['word'] + " ";
                
                let dot = speaker_text.includes(".") ? true : false;
                if (dot) {
                    speaker_time += end;
                    showResults(speaker_time, speaker_text);
                    speaker_result += speaker_time + '\n';
                    speaker_result += speaker_text + '\n\n';
                    speaker_time = 'Speaker#' + speaker + ': ' + end + ' - ';
                    speaker_text = '';
                }
                   
            } else {
                speaker_text += item['word'] + " ";
                end = item['endTime'];
                
                let dot = speaker_text.includes(".") ? true : false;
                if (dot) {
                    speaker_time += end;
                    showResults(speaker_time, speaker_text)
                    speaker_result += speaker_time + '\n';
                    speaker_result += speaker_text + '\n\n';
                    speaker_time = 'Speaker#' + speaker + ': ' + end + ' - ';
                    speaker_text = '';
                }
            }
        });

        final_result = speaker_result;
}

function showResults(speaker_time, speaker_text) {
    $('#transcript-table').find('tbody:last').append('<tr><td>' + speaker_time + '</td><td>' + speaker_text + '</td></tr>');
}



/*===========================================================================
*
*  SHOW GCP DICTATION RESULT
*
*============================================================================*/

function processGCPDictation(clean_text, end_time) {

    let time = '00:00:00 - ' + end_time;

    final_result = clean_text;
        
    $('#transcript-table').find('tbody:last').append('<tr><td>' + time + '</td><td>' + clean_text + '</td></tr>');

}



/*===========================================================================
*
*  FORMAT TIME
*
*============================================================================*/

function formatTime(t) {
    let a = t.split(".");
    let date = new Date(null);
    date.setSeconds(a[0]); 
    let result = date.toISOString().substr(11, 8);
    return result + "." + a[1];
}



/*===========================================================================
*
*  DOWNLOAD TRANSCRIPT RESULT
*
*============================================================================*/

$('#download-now').on('click', function(e) {

    e.preventDefault();
    
    let d = new Date();
    let date = ("0" + d.getDate()).slice(-2) + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" + d.getFullYear();

    let text = final_result;
    text = text.replace(/\n/g, "\r\n"); // To retain the Line breaks.
    let blob = new Blob([text], { type: "text/plain"});
    let anchor = document.createElement("a");
    anchor.download = date + "-transcribe-result.txt";
    anchor.href = window.URL.createObjectURL(blob);
    anchor.target ="_blank";
    anchor.style.display = "none"; // just to be safe!
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

});



