const viewWords = document.getElementById("viewWords");
const recordButton = document.getElementById("recordButton");
const pauseButton = document.getElementById("pauseButton");
const continueButton = document.getElementById("continueButton");
const audioFileInput = document.getElementById("audioFileInput");
const audioPlayer = document.getElementById("audioPlayer");
const saveButton = document.getElementById("saveButton");
const searchButton = document.getElementById("searchButton");
const resultDiv = document.getElementById("result");
const botDiv = document.getElementById('bot');
const actionsDiv = document.getElementById("actions");
const dialogueBox = document.querySelector(".dialogue");
let recognition;
let recognizedText;
const texts = []; 

// Create play button
const playButton = document.createElement("button");
playButton.textContent = "Play";
playButton.className = "buttonCenter";
playButton.style.display = "none";
playButton.addEventListener("click", () => {
  audioPlayer.play();
  recognizeSpeechFromAudio(audioPlayer);
});

// Create pause button
const pausePlaybackButton = document.createElement("button");
pausePlaybackButton.textContent = "Pause";
pausePlaybackButton.className = "buttonCenter";
pausePlaybackButton.style.display = "none";
pausePlaybackButton.addEventListener("click", () => {
  audioPlayer.pause();
});

// Append play and pause buttons to actionsDiv
actionsDiv.appendChild(playButton);
actionsDiv.appendChild(pausePlaybackButton);

recordButton.addEventListener("click", async () => {
  if (!recognition) {
    recognition = new webkitSpeechRecognition(); // Use webkitSpeechRecognition for Chrome
    recognition.continuous = true; // Set to true for continuous recognition
    recognition.interimResults = false;

    recognition.onresult = async (event) => {
      recognizedText = event.results[0][0].transcript;
      resultDiv.innerHTML = `<br><div style="display: flex; align-items: center; justify-content: right;"><div style="border: 1px solid #eaa5ea; border-radius: 50%; height: 40px; width: 40px; display:flex; justify-content: center; border: 2px solid green; margin-right: 5px;"> <img src="images/avatar.jpg" alt="User Icon" style="width: 30px; height: 30px; border-radius 50%:;"> </div> ${recognizedText} </div>`;
      texts.push(recognizedText);
      sendTranslatedTextToGpt(recognizedText).then(gptRes => {
        botDiv.innerHTML += `<br> <div style="display: flex; align-items: center; padding: 5px; border-radius: 5px;  box-shadow: 0px 4px 16px rgba(17,17,26,0.1), 0px 8px 24px rgba(17,17,26,0.1), 0px 16px 56px rgba(17,17,26,0.1);"> <div style="border: 1px solid #eaa5ea; border-radius: 50%; height: 40px; width: 40px; margin-right:  5px; display:flex; justify-content: center; "> <img src="images/favicon.png" alt="Pally Icon" style="width: 30px; height: 30px;"> </div> ${gptRes}</div>`
        texts.push(`<b>Pally</b> ${gptRes}`);
      });
      recognition.stop();
      recognition.start();
    };

    recognition.onend = () => {
      recognition.start();
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      recognition.stop();
    };
  }

  recordButton.classList.add("listening"); // Add animation class
  recordButton.disabled = true;
  pauseButton.style.display = "inline-block";
  resultDiv.innerHTML = `<br><strong class="heading">I am Listening...</strong>`;

  // Start recognition
  recognition.start();
});

// Pause conversation
pauseButton.addEventListener("click", () => {
  recognition.stop();
  pauseButton.style.display = "none";
  continueButton.style.display = "inline-block";
  recordButton.disabled = false;
  recordButton.classList.remove("listening"); // Remove animation class
});

// Continue conversation
continueButton.addEventListener("click", () => {
  recognition.start();
  continueButton.style.display = "none";
  pauseButton.style.display = "inline-block";
  recordButton.disabled = true;
  recordButton.classList.add("listening"); // Add animation class
});

viewWords.addEventListener("click", (e) => {
  dialogueBox.innerHTML = "";
  texts.forEach((txt) => {
    const p = document.createElement("p");
    p.innerHTML = ` <div class="words">${txt}</div>`;
    dialogueBox.appendChild(p);
  });
});

audioFileInput.addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const fileReader = new FileReader();
  fileReader.onload = function () {
    const audioContext = new AudioContext();
    audioContext.decodeAudioData(this.result, function (buffer) {
      const duration = buffer.duration;
      const fileName = file.name;
      resultDiv.innerHTML = `<br><strong>Audio File Details:</strong><br>Name: ${fileName}<br>Duration: ${duration.toFixed(2) / 60
        } seconds`;
      playButton.style.display = "inline-block";
      pausePlaybackButton.style.display = "inline-block";
      actionsDiv.style.display = "block";
    });
  };
  fileReader.readAsArrayBuffer(file);
  audioPlayer.src = URL.createObjectURL(file);
});

function recognizeSpeechFromAudio(audio_data) {
  const recognizer = new webkitSpeechRecognition();
  recognizer.continuous = true;
  recognizer.interimResults = false;
  recognizer.onresult = (event) => {
    recognizedText = event.results[0][0].transcript;
    resultDiv.innerHTML = `<br><strong>You said:</strong> ${recognizedText}`;
    sendTranslatedTextToGpt(recognizedText);
    recognizer.stop();
    actionsDiv.style.display = "block";
  };
  recognizer.onend = () => {
    recordButton.disabled = false;
  };
  recognizer.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
    recognizer.stop();
  };
  recognizer.start();
}

saveButton.addEventListener("click", () => {
  alert("Text saved: " + recognizedText);
  actionsDiv.style.display = "none";
});

searchButton.addEventListener("click", () => {
  searchWeb(recognizedText);
  actionsDiv.style.display = "none";
});

async function searchWeb(query) {
  const response = await fetch("/process_audio", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  const data = await response.json();
  const searchResults = data.search_results || [];

  if (searchResults.length > 0) {
    resultDiv.innerHTML += `<br><br><strong>Search results:</strong>`;
    for (let i = 0; i < searchResults.length; i++) {
      resultDiv.innerHTML += `<br>(${i + 1}) <a href="${searchResults[i]
        }" target="_blank">${searchResults[i]}</a>`;
    }
  } else {
    resultDiv.innerHTML += "<br>No results found!";
  }
}

const openAiKey = "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";
const messages = [];

async function sendTranslatedTextToGpt(translatedText) {
  messages.push({
    role: "user",
    content: translatedText,
  });
  console.log("Request payload:", JSON.stringify({ model: "gpt-3.5-turbo", messages: messages }));
  console.log("Request headers:", { "Content-Type": "application/json", Authorization: "Bearer " + openAiKey });

  try {
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + openAiKey,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: messages,
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      const content = data.choices[0].message.content.trim();
      messages.push({
        role: "assistant",
        content: content,
      });
      return content;
    } else {
      console.error(
        "HTTP request failed with status code: " + response.status
      );
      return "An internal error occurred";
    }
  } catch (error) {
    console.error("Error occurred:", error);
    return error.toString();
  }
}