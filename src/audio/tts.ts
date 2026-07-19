// ==============================================================================
// BROWSER SPEECH SYNTHESIS (TTS) WRAPPER
// ==============================================================================

export function speakText(text: string, character: string, volume = 0.8) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  const synth = window.speechSynthesis;
  synth.cancel(); // Cancel any ongoing speech

  // Set parameters depending on character
  let rate = 1.0;
  let pitch = 1.0;
  let gender: 'male' | 'female' = 'male';

  switch (character) {
    case 'subastador':
      rate = 0.82;
      pitch = 0.60;
      gender = 'male';
      break;
    case 'fantasma':
      rate = 1.05;
      pitch = 1.45;
      gender = 'female';
      break;
    case 'rata':
      rate = 1.35;
      pitch = 1.65;
      gender = 'male';
      break;
    case 'sanguino':
      rate = 0.92;
      pitch = 0.75;
      gender = 'male';
      break;
  }

  // Load voices and select Spanish voice matching gender preferred names
  const speak = () => {
    const voices = synth.getVoices();
    const esVoices = voices.filter(v => v.lang.startsWith('es'));
    let selectedVoice: SpeechSynthesisVoice | null = null;

    if (esVoices.length > 0) {
      if (gender === 'male') {
        const maleNames = ['jorge', 'javier', 'diego', 'juan', 'carlos', 'enrique', 'pablo', 'alvaro'];
        for (const name of maleNames) {
          selectedVoice = esVoices.find(v => v.name.toLowerCase().includes(name)) || null;
          if (selectedVoice) break;
        }
      } else {
        const femaleNames = ['monica', 'paulina', 'marisol', 'angelica', 'sara', 'helena', 'laura'];
        for (const name of femaleNames) {
          selectedVoice = esVoices.find(v => v.name.toLowerCase().includes(name)) || null;
          if (selectedVoice) break;
        }
      }

      if (!selectedVoice) {
        selectedVoice = esVoices[0]; // fallback to first Spanish voice
      }
    }

    const utterance = new SpeechSynthesisUtterance(text);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    synth.speak(utterance);
  };

  if (synth.getVoices().length === 0) {
    synth.onvoiceschanged = speak;
  } else {
    speak();
  }
}
