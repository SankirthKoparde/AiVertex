import React, { useState, useEffect, useRef } from 'react';
import { Brain, Activity, Mic, MicOff } from 'lucide-react';
import { getGroqCompletion } from '../services/groqApi';
import { speakWithAdvancedVoice } from '../services/ttsService';

const AIRobot3D = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);

  const containerRef = useRef(null);
  const recognitionRef = useRef(null);
  const historyRef = useRef([]);

  useEffect(() => {
    historyRef.current = conversationHistory;
  }, [conversationHistory]);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setIsProcessing(false);
      };

      recognition.onresult = async (event) => {
        setIsListening(false);
        setIsProcessing(true);
        const transcript = event.results[0][0].transcript;

        const updatedHistory = [...historyRef.current, { role: 'user', content: transcript }];
        setConversationHistory(updatedHistory);

        const aiResponse = await getGroqCompletion(transcript, updatedHistory);
        setIsProcessing(false);

        setConversationHistory([...updatedHistory, { role: 'assistant', content: aiResponse }]);

        // Speak back AI response using Advanced Voice Service
        speakResponse(aiResponse);
      };

      recognition.onerror = () => {
        setIsListening(false);
        setIsProcessing(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // Speech Output via Advanced Voice TTS Service (Supports ElevenLabs & Premium Web Voices)
  const speakResponse = (text) => {
    speakWithAdvancedVoice(
      text,
      () => setIsSpeaking(true),  // onStart
      () => setIsSpeaking(false), // onEnd
      () => setIsSpeaking(false)  // onError
    );
  };

  // Toggle Voice Interaction on Robot Tap/Click
  const handleRobotClick = async (e) => {
    if (e) e.stopPropagation();

    if (isSpeaking) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.log('Recognition active:', err);
      }
    } else {
      const fallbackMsg = "Hello! I am VARTEX AI. Ask me anything about Artificial Intelligence and our courses!";
      speakResponse(fallbackMsg);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const normX = Math.max(-1, Math.min(1, (e.clientX - centerX) / (window.innerWidth / 2)));
      const normY = Math.max(-1, Math.min(1, (e.clientY - centerY) / (window.innerHeight / 2)));

      setMousePos({ x: normX, y: normY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, []);

  // Eye & Visor tracking offsets
  const eyeX = mousePos.x * 20;
  const eyeY = mousePos.y * 15;

  // Head 3D rotation angles
  const rotY = mousePos.x * 28;
  const rotX = -mousePos.y * 22;

  return (
    <div
      ref={containerRef}
      onClick={handleRobotClick}
      title="Click or tap to speak to AI VARTEX Voice Assistant!"
      className="relative w-full max-w-[580px] aspect-square mx-auto flex items-center justify-center pointer-events-auto cursor-pointer group select-none py-2"
    >
      {/* Outer Holographic Orbit Ring 1 */}
      <div
        className={`absolute inset-0 rounded-full border-2 transition-all duration-500 pointer-events-none ${
          isListening
            ? 'border-yellow-400 shadow-[0_0_85px_rgba(250,204,21,0.6)] scale-105'
            : isProcessing
            ? 'border-purple-400 shadow-[0_0_85px_rgba(168,85,247,0.6)] scale-105'
            : isSpeaking
            ? 'border-cyan-300 shadow-[0_0_85px_rgba(56,189,248,0.6)] scale-105'
            : 'border-cyan-400/40 shadow-[0_0_60px_rgba(56,189,248,0.25)]'
        } animate-spin-slow`}
        style={{
          transform: `perspective(1000px) rotateX(${rotX * 0.5 + 60}deg) rotateY(${rotY * 0.5}deg)`,
        }}
      />

      {/* Outer Holographic Orbit Ring 2 */}
      <div
        className="absolute inset-6 rounded-full border-2 border-dashed border-purple-500/40 transition-transform duration-300 pointer-events-none"
        style={{
          transform: `perspective(1000px) rotateX(${-rotX * 0.4 - 45}deg) rotateY(${-rotY * 0.4}deg)`,
          boxShadow: '0 0 40px rgba(168, 85, 247, 0.2)',
        }}
      />

      {/* Dynamic Ambient Color Glow Backdrop */}
      <div
        className={`absolute w-96 h-96 rounded-full blur-3xl transition-all duration-500 pointer-events-none ${
          isListening
            ? 'bg-gradient-to-tr from-yellow-500/40 via-amber-500/40 to-cyan-500/30 scale-110'
            : isProcessing
            ? 'bg-gradient-to-tr from-purple-600/50 via-indigo-600/50 to-fuchsia-500/40 scale-110'
            : isSpeaking
            ? 'bg-gradient-to-tr from-cyan-400/40 via-purple-500/50 to-indigo-500/40 scale-110'
            : 'bg-gradient-to-tr from-cyan-500/25 via-purple-600/30 to-indigo-500/30 animate-pulse-glow'
        }`}
      />

      {/* Interactive 3D AI Robot Cyber Head */}
      <div
        className="relative w-76 h-88 sm:w-84 sm:h-[415px] transition-transform duration-200 ease-out flex flex-col items-center justify-center group-hover:scale-[1.02]"
        style={{
          transform: `perspective(1000px) rotateY(${rotY}deg) rotateX(${rotX}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Top Antenna Beacon Node */}
        <div className="relative flex flex-col items-center mb-[-8px] z-20">
          <div className={`w-5 h-5 rounded-full ${isListening ? 'bg-yellow-400 shadow-[0_0_25px_#facc15]' : isProcessing ? 'bg-purple-400 shadow-[0_0_25px_#c084fc]' : 'bg-cyan-400 shadow-[0_0_25px_#38bdf8]'} ${isSpeaking || isListening || isProcessing ? 'animate-ping duration-300' : 'animate-ping'} absolute`} />
          <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-cyan-400 via-sky-300 to-white shadow-[0_0_20px_#38bdf8] border-2 border-white relative flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-purple-950" />
          </div>
          <div className="w-2 h-10 bg-gradient-to-b from-cyan-400 via-purple-600 to-slate-900 rounded-t-full shadow-[0_0_12px_rgba(56,189,248,0.6)]" />
        </div>

        {/* Side Ear Cyber Modules */}
        <div className="absolute left-[-18px] top-[38%] w-7 h-20 bg-gradient-to-r from-purple-900/90 via-slate-900 to-slate-950 rounded-l-2xl border-l-2 border-y-2 border-purple-500/40 shadow-[-8px_0_20px_rgba(168,85,247,0.3)] flex flex-col items-center justify-center gap-1.5 z-10 backdrop-blur-md">
          <div className={`w-2 h-4 rounded-full ${isListening ? 'bg-yellow-400 shadow-[0_0_8px_#facc15]' : isProcessing ? 'bg-purple-400 shadow-[0_0_8px_#c084fc]' : 'bg-cyan-400 shadow-[0_0_8px_#38bdf8]'} ${isSpeaking || isListening || isProcessing ? 'animate-bounce' : 'animate-pulse'}`} />
          <div className="w-2 h-2 rounded-full bg-purple-500" />
          <div className="w-2 h-2 rounded-full bg-indigo-400" />
        </div>
        <div className="absolute right-[-18px] top-[38%] w-7 h-20 bg-gradient-to-l from-purple-900/90 via-slate-900 to-slate-950 rounded-r-2xl border-r-2 border-y-2 border-purple-500/40 shadow-[8px_0_20px_rgba(168,85,247,0.3)] flex flex-col items-center justify-center gap-1.5 z-10 backdrop-blur-md">
          <div className={`w-2 h-4 rounded-full ${isListening ? 'bg-yellow-400 shadow-[0_0_8px_#facc15]' : isProcessing ? 'bg-purple-400 shadow-[0_0_8px_#c084fc]' : 'bg-cyan-400 shadow-[0_0_8px_#38bdf8]'} ${isSpeaking || isListening || isProcessing ? 'animate-bounce' : 'animate-pulse'}`} />
          <div className="w-2 h-2 rounded-full bg-purple-500" />
          <div className="w-2 h-2 rounded-full bg-indigo-400" />
        </div>

        {/* Main Robot Helmet Shell */}
        <div className="relative w-full h-full bg-gradient-to-b from-[#161B26]/95 via-[#0D101A]/95 to-[#04060B]/98 rounded-[52px] border-2 border-purple-500/40 p-6 shadow-[0_25px_65px_rgba(0,0,0,0.95),inset_0_2px_30px_rgba(168,85,247,0.3)] backdrop-blur-2xl flex flex-col items-center justify-between overflow-hidden">
          
          {/* Vertical Neon Accent Strips */}
          <div className="absolute top-10 left-3.5 w-1 h-44 bg-gradient-to-b from-cyan-400 via-purple-500 to-transparent rounded-full shadow-[0_0_15px_#38bdf8] opacity-90" />
          <div className="absolute top-10 right-3.5 w-1 h-44 bg-gradient-to-b from-cyan-400 via-purple-500 to-transparent rounded-full shadow-[0_0_15px_#38bdf8] opacity-90" />

          {/* Top Cyber Branding Bar */}
          <div className="w-full flex items-center justify-between px-4 py-2 bg-gradient-to-r from-purple-950/60 via-slate-900/80 to-purple-950/60 rounded-full border border-purple-500/30 text-xs font-mono text-cyan-200 shadow-inner">
            <span className="flex items-center gap-2 font-bold tracking-wider">
              <Brain className="w-4 h-4 text-cyan-400 animate-pulse" /> VARTEX-NEURAL
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-purple-300 font-semibold font-mono">
                {isListening ? 'LISTENING...' : isProcessing ? 'THINKING...' : isSpeaking ? 'SPEAKING...' : 'TAP TO SPEAK'}
              </span>
              <span className={`inline-block w-2.5 h-2.5 rounded-full ${isListening ? 'bg-yellow-400 animate-ping' : isProcessing ? 'bg-purple-400 animate-ping' : isSpeaking ? 'bg-emerald-400 animate-ping' : 'bg-cyan-400 animate-pulse'} shadow-[0_0_10px_#38bdf8]`} />
            </div>
          </div>

          {/* Curved High-Tech Cyber Visor */}
          <div className={`relative w-full h-42 bg-gradient-to-b from-black via-[#040814] to-[#0A0716] rounded-3xl border-2 transition-colors duration-300 ${isListening ? 'border-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.5)]' : isProcessing ? 'border-purple-400 shadow-[0_0_30px_rgba(168,85,247,0.5)]' : isSpeaking ? 'border-cyan-300 shadow-[0_0_30px_rgba(56,189,248,0.5)]' : 'border-cyan-400/40 shadow-[inset_0_0_40px_rgba(56,189,248,0.25)]'} p-3 flex flex-col items-center justify-center overflow-hidden`}>
            
            {/* Visor HUD Indicators */}
            <div className="absolute top-2 left-3 text-[9px] font-mono text-cyan-300/70 flex items-center gap-1">
              <Activity className="w-3 h-3 text-cyan-400 animate-pulse" /> {isListening ? 'MIC.LISTENING' : isProcessing ? 'NEURAL.PROCESSING' : isSpeaking ? 'VOICE.SPEAKING' : 'SYSTEM.READY'}
            </div>
            <div className="absolute top-2 right-3 text-[9px] font-mono text-purple-300/70 flex items-center gap-1">
              {isListening ? <Mic className="w-3 h-3 text-yellow-400 animate-pulse" /> : <MicOff className="w-3 h-3 text-slate-500" />}
              [ AI VOICE ENGINE ]
            </div>

            {/* Visor Scanline Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.6)_51%)] bg-[length:100%_4px] pointer-events-none opacity-80" />
            <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-20" />

            {/* Glowing Lenses Container */}
            <div
              className="relative flex items-center justify-center gap-12 transition-transform duration-100 ease-out z-10"
              style={{
                transform: `translate(${eyeX}px, ${eyeY}px)`,
              }}
            >
              {/* Left Eye Lens Unit */}
              <div className="relative flex items-center justify-center">
                <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${isListening ? 'from-yellow-300 via-amber-500 to-orange-600' : isProcessing ? 'from-purple-400 via-indigo-500 to-fuchsia-600' : 'from-cyan-300 via-blue-500 to-purple-600'} p-1 ${isSpeaking || isListening || isProcessing ? 'shadow-[0_0_45px_#38bdf8] scale-105' : 'shadow-[0_0_35px_rgba(56,189,248,0.9)]'} transition-all flex items-center justify-center`}>
                  <div className="w-11 h-11 rounded-full bg-black border-2 border-cyan-300/80 flex items-center justify-center relative shadow-inner">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-white via-cyan-200 to-sky-400 shadow-[0_0_15px_#38bdf8]" />
                    <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-white shadow-[0_0_6px_#fff]" />
                  </div>
                </div>
              </div>

              {/* Right Eye Lens Unit */}
              <div className="relative flex items-center justify-center">
                <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${isListening ? 'from-yellow-300 via-amber-500 to-orange-600' : isProcessing ? 'from-purple-400 via-indigo-500 to-fuchsia-600' : 'from-cyan-300 via-blue-500 to-purple-600'} p-1 ${isSpeaking || isListening || isProcessing ? 'shadow-[0_0_45px_#38bdf8] scale-105' : 'shadow-[0_0_35px_rgba(56,189,248,0.9)]'} transition-all flex items-center justify-center`}>
                  <div className="w-11 h-11 rounded-full bg-black border-2 border-cyan-300/80 flex items-center justify-center relative shadow-inner">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-white via-cyan-200 to-sky-400 shadow-[0_0_15px_#38bdf8]" />
                    <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-white shadow-[0_0_6px_#fff]" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lower Speaker Grille & Active Sound Visualizer */}
          <div className={`w-[88%] h-8 flex items-center justify-center gap-2 bg-black/90 rounded-2xl border ${isListening ? 'border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.4)]' : isProcessing ? 'border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.4)]' : isSpeaking ? 'border-cyan-400 shadow-[0_0_20px_rgba(56,189,248,0.4)]' : 'border-purple-500/30'} px-4 shadow-inner transition-all`}>
            {[45, 85, 100, 70, 95, 65, 90, 55, 85].map((height, i) => (
              <div
                key={i}
                className={`w-1.5 rounded-full transition-all ${
                  isListening
                    ? 'bg-gradient-to-t from-yellow-500 via-amber-300 to-white animate-bounce'
                    : isProcessing
                    ? 'bg-gradient-to-t from-purple-500 via-fuchsia-300 to-white animate-bounce'
                    : isSpeaking
                    ? 'bg-gradient-to-t from-cyan-400 via-sky-300 to-white animate-bounce shadow-[0_0_12px_#38bdf8]'
                    : 'bg-gradient-to-t from-purple-600 via-indigo-400 to-cyan-300 animate-pulse opacity-95 shadow-[0_0_8px_#38bdf8]'
                }`}
                style={{
                  height: isListening || isSpeaking || isProcessing ? `${Math.min(100, height * 1.2)}%` : `${height}%`,
                  animationDelay: `${i * 0.08}s`,
                }}
              />
            ))}
          </div>

          {/* Metallic Cyber Neck Base */}
          <div className="w-32 h-5 bg-gradient-to-r from-purple-950 via-slate-800 to-purple-950 rounded-b-2xl border-t-2 border-cyan-400/40 flex items-center justify-center shadow-lg">
            <div className="w-20 h-1.5 bg-cyan-400/60 rounded-full shadow-[0_0_8px_#38bdf8]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIRobot3D;
