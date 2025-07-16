let voices = [];
let japaneseVoice = null;

const synth = window.speechSynthesis;

function loadVoices() {
  // GET THE FIRST JAPANESE VOICE AND STORE IT
  voices = synth.getVoices();
  console.log("Available voices:", voices);
  japaneseVoice = voices.find((voice) => voice.lang.includes("ja")) || null;
  console.log("Chosen Japanese voice:", japaneseVoice);
}

loadVoices();

//CHECK TO CONFIRM VALIDITY OF LOADVOICES FUNCTION
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = loadVoices;
}

document.querySelectorAll(".tts-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const text = btn.getAttribute("data-text");
    if (text) {
      const utter = new SpeechSynthesisUtterance(text);

      if (japaneseVoice) {
        utter.voice = japaneseVoice;
      }
      synth.speak(utter);
    }
  });
});
