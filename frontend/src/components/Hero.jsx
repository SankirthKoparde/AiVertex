import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Play } from 'lucide-react';
import AIRobot3D from './AIRobot3D';

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isFade, setIsFade] = useState(true);

  const videoRef = useRef(null);
  const containerRef = useRef(null);

  // Rotating words - AI & EdTech related, under 10 characters each
  const dynamicWords = [
    'AGENTS',
    'NEURAL',
    'SKILLS',
    'CAREERS',
    'MASTERY',
  ];

  // Dynamic Word Rotator effect
  useEffect(() => {
    const wordInterval = setInterval(() => {
      setIsFade(false); // start fade out
      setTimeout(() => {
        setCurrentWordIndex((prevIndex) => (prevIndex + 1) % dynamicWords.length);
        setIsFade(true); // fade back in
      }, 250); // 250ms fade transition
    }, 2400); // change every 2.4s

    return () => clearInterval(wordInterval);
  }, [dynamicWords.length]);

  useEffect(() => {
    setIsLoaded(true);

    if (videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.log('Autoplay playback initialized:', err);
      });
    }
  }, []);

  const videoPath = encodeURI('/videos/Ai Brain Free Stock videos  4K  No copyright - Stock Footage (1080p, h264) (1).mp4');

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative w-full min-h-screen lg:h-screen flex flex-col justify-center overflow-hidden bg-[#04060C] pt-28 pb-16 lg:py-0"
    >
      {/* Background Video - 100% Vivid Brightness */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-100 scale-100 transition-opacity duration-1000"
      >
        <source src={videoPath} type="video/mp4" />
        <source src="/videos/ai-brain.mp4" type="video/mp4" />
      </video>

      {/* Light Professional Vignette Overlay to ensure background is vibrant & text readable */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#04060C]/70 via-[#04060C]/40 to-transparent pointer-events-none" />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#04060C] via-transparent to-black/25 pointer-events-none" />

      {/* Main Hero Content Container */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Headline & Action Buttons */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            
            {/* Main Headline - Bold, Dynamic Word Rotator (< 10 Chars) */}
            <h1
              className={`text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6 drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)] transition-all duration-700 delay-150 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              <div>LEARN WITH AI.</div>
              <div className="whitespace-normal sm:whitespace-nowrap">
                BUILD THE{' '}
                <span
                  className={`inline-block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 transition-all duration-300 transform ${
                    isFade ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-2 scale-95'
                  }`}
                >
                  {dynamicWords[currentWordIndex]}.
                </span>
              </div>
            </h1>

            {/* Description */}
            <p
              className={`text-base sm:text-lg md:text-xl text-slate-200 max-w-2xl font-normal leading-relaxed mb-8 drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] transition-all duration-700 delay-300 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              Master Artificial Intelligence, Machine Learning, Prompt Engineering, and AI Agents through hands-on courses, industry-grade projects, and real-time AI guidance.
            </p>

            {/* Action Buttons */}
            <div
              className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-4 transition-all duration-700 delay-450 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              {/* Primary CTA */}
              <a
                href="#courses"
                className="group relative inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white transition-all duration-300 ease-in-out rounded-xl bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-500 hover:from-blue-500 hover:to-cyan-500 shadow-xl shadow-cyan-500/30 hover:shadow-cyan-400/50 hover:scale-[1.02] active:scale-[0.98] border border-cyan-400/40"
              >
                <span>Explore Courses</span>
                <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
              </a>

              {/* Secondary CTA */}
              <a
                href="#learn-with-ai"
                className="group relative inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-slate-200 hover:text-white transition-all duration-300 ease-in-out rounded-xl bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/15 hover:border-cyan-400/50 shadow-lg hover:scale-[1.02] active:scale-[0.98]"
              >
                <Play className="w-4 h-4 mr-2.5 text-cyan-400 group-hover:text-cyan-300 transition-colors fill-cyan-400/30" />
                <span>Start Learning</span>
              </a>
            </div>
          </div>

          {/* Right Column: 3D Interactive AI Robot Avatar */}
          <div
            className={`lg:col-span-5 flex justify-center items-center mt-8 lg:mt-0 lg:-mt-10 lg:-translate-y-6 transition-all duration-700 delay-600 ${
              isLoaded ? 'opacity-100' : 'opacity-0 translate-y-8'
            }`}
          >
            <AIRobot3D />
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
