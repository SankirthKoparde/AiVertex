import React, { useState, useEffect } from 'react';
import { X, ArrowRight, CheckCircle2, User, Mail, ShieldCheck } from 'lucide-react';

const GetStartedModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    setIsAnimatingOut(true);
    setTimeout(() => {
      onClose();
    }, 400); // match animation duration
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      handleClose();
    }, 1200);
  };

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-400 ${
        isAnimatingOut ? 'opacity-0 backdrop-blur-none' : 'opacity-100 backdrop-blur-xl bg-black/80'
      }`}
    >
      {/* Liquid Glass Modal Card */}
      <div
        className={`relative w-full max-w-md bg-[#0A0D1A]/95 rounded-3xl border-2 border-purple-500/40 p-6 sm:p-8 shadow-[0_25px_65px_rgba(0,0,0,0.95),inset_0_2px_20px_rgba(168,85,247,0.3)] backdrop-blur-2xl transition-all duration-400 transform ${
          isAnimatingOut ? 'scale-90 translate-y-8 opacity-0' : 'scale-100 translate-y-0 opacity-100'
        }`}
      >
        {/* Cancel / Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors border border-white/10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          /* Success State */
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 rounded-full bg-purple-600/30 border-2 border-purple-400 flex items-center justify-center text-purple-300 shadow-[0_0_30px_#a855f7]">
              <CheckCircle2 className="w-10 h-10 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-white">Welcome Aboard!</h3>
            <p className="text-sm text-slate-300">
              Registration complete. Moving to your AI VARTEX dashboard...
            </p>
          </div>
        ) : (
          /* Registration Form */
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center space-x-2 bg-purple-950/60 border border-purple-500/40 px-3 py-1 rounded-full text-xs font-mono text-purple-300 mb-3">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>START YOUR JOURNEY</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Get Started with <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">AI VARTEX</span>
              </h2>
              <p className="text-slate-300 text-sm mt-1.5 leading-relaxed">
                Join our next-generation AI platform to access courses, interactive labs, and voice AI assistants.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 absolute left-3.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-black/60 border border-white/15 focus:border-purple-400 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-400/50 transition-all"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 absolute left-3.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/60 border border-white/15 focus:border-purple-400 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-400/50 transition-all"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full flex items-center justify-center py-3 px-6 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-xl shadow-purple-600/40 hover:shadow-purple-500/60 transition-all duration-200 mt-2 border border-purple-400/40"
              >
                <span>Register & Continue</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </form>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={handleClose}
                className="text-xs text-slate-400 hover:text-slate-200 transition-colors underline underline-offset-4"
              >
                Skip for now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GetStartedModal;
