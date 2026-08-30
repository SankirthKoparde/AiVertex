/**
 * ElevenLabs High-Definition Soft & Beautiful Female Voice TTS Service for AI VARTEX
 */

/**
 * Phonetic Normalization helper to prevent TTS engines from spelling out letters.
 * Transforms "AI VARTEX" into "AI Vertex" for smooth, natural voice pronunciation.
 */
const normalizePhoneticsForSpeech = (text) => {
  if (!text) return text;
  return text
    .replace(/\bAI VARTEX\b/gi, 'AI Vertex')
    .replace(/\bVARTEX AI\b/gi, 'AI Vertex')
    .replace(/\bVARTEX\b/gi, 'Vertex')
    .replace(/\bA\.I\.\b/gi, 'AI');
};

export const speakWithAdvancedVoice = async (text, onStart, onEnd, onError) => {
  const cleanText = normalizePhoneticsForSpeech(text);
  const elevenLabsKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
  // Bella (Soft, Warm, Beautiful Female Voice): EXAVITQu4vr4xnSDxMaL
  // Rachel (Calm, Soft Conversational Female Voice): 21m00Tcm4TlvDq8ikWAM
  const voiceId = import.meta.env.VITE_ELEVENLABS_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL';

  if (elevenLabsKey) {
    try {
      if (onStart) onStart();
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': elevenLabsKey,
        },
        body: JSON.stringify({
          text: cleanText,
          model_id: 'eleven_turbo_v2_5', // ElevenLabs ultra-low latency high-speed model
          voice_settings: {
            stability: 0.65,        // Higher stability for a smooth, gentle, soft voice
            similarity_boost: 0.85, // Crystal-clear, beautiful articulation
            style: 0.35,            // Warm, soft expressive tone
            use_speaker_boost: true,
          },
        }),
      });

      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);

        audio.onended = () => {
          if (onEnd) onEnd();
        };
        audio.onerror = () => {
          if (onError) onError();
          fallbackWebSpeech(cleanText, onStart, onEnd, onError);
        };

        await audio.play();
        return;
      } else {
        console.warn(`ElevenLabs API returned status ${response.status}. Using Web Speech fallback.`);
      }
    } catch (err) {
      console.warn('ElevenLabs API network error, using Web Speech fallback:', err);
    }
  }

  // Fallback to Web Speech Soft Female Voice if VITE_ELEVENLABS_API_KEY is not set or network fails
  fallbackWebSpeech(cleanText, onStart, onEnd, onError);
};

const fallbackWebSpeech = (text, onStart, onEnd, onError) => {
  if (!('speechSynthesis' in window)) {
    if (onStart) onStart();
    setTimeout(() => {
      if (onEnd) onEnd();
    }, 3500);
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95; // Gentle, soft conversational speed
  utterance.pitch = 1.1; // Soft, friendly female pitch

  const voices = window.speechSynthesis.getVoices();

  const preferredFemaleVoice =
    voices.find((v) => v.name.includes('Natural') && v.name.includes('Jenny') && v.lang.startsWith('en')) ||
    voices.find((v) => v.name.includes('Natural') && v.name.includes('Aria') && v.lang.startsWith('en')) ||
    voices.find((v) => v.name.includes('Google UK English Female') && v.lang.startsWith('en')) ||
    voices.find((v) => v.name.includes('Google US English') && v.lang.startsWith('en')) ||
    voices.find((v) => v.name.includes('Samantha') && v.lang.startsWith('en')) ||
    voices.find((v) => v.name.includes('Victoria') && v.lang.startsWith('en')) ||
    voices.find((v) => v.name.includes('Karen') && v.lang.startsWith('en')) ||
    voices.find((v) => v.lang.startsWith('en'));

  if (preferredFemaleVoice) {
    utterance.voice = preferredFemaleVoice;
  }

  utterance.onstart = () => {
    if (onStart) onStart();
  };
  utterance.onend = () => {
    if (onEnd) onEnd();
  };
  utterance.onerror = () => {
    if (onError) onError();
  };

  window.speechSynthesis.speak(utterance);
};
