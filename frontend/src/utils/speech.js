// src/utils/speech.js

const synth = window.speechSynthesis;

export const speak = (text) => {
  if (synth.speaking) {
    synth.cancel();
  }
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.pitch = 1;
  utterance.rate = 1;
  
  synth.speak(utterance);
};