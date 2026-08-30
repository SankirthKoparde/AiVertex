import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';

const Navbar = ({ showGetStarted = true, onOpenGetStarted }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Hide navbar when scrolling down past 80px, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 transform ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      } ${
        isScrolled
          ? 'bg-[#05070E]/90 backdrop-blur-2xl border-b border-purple-500/20 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.8)]'
          : 'bg-gradient-to-b from-[#05070E]/95 via-[#05070E]/50 to-transparent backdrop-blur-md py-4.5 border-b border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between">
          {/* Left: AI Vertex Logo */}
          <a href="#home" className="flex items-center group py-0.5">
            <img
              src="/logo.png"
              alt="AI Vertex Logo"
              className="h-9 sm:h-11 lg:h-12 w-auto object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
            />
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {['Home', 'Courses', 'Learning', 'Projects', 'About'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                className="relative py-1 text-sm font-medium text-slate-300 hover:text-white transition-colors duration-200 group"
              >
                <span>{item}</span>
                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-purple-500 rounded-full transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Right CTAs */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href="#login"
              className="text-sm font-medium text-slate-300 hover:text-white px-3.5 py-1.5 transition-colors"
            >
              Sign In
            </a>

            {/* Get Started Button - Moves to Navbar when Modal is closed/cancelled */}
            {showGetStarted && (
              <button
                onClick={onOpenGetStarted}
                className="group relative inline-flex items-center justify-center px-5 py-2 text-sm font-semibold text-white transition-all duration-300 ease-in-out rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-600/30 hover:shadow-purple-500/50 hover:scale-[1.02] active:scale-[0.98] border border-purple-400/40 animate-in fade-in zoom-in-95 duration-500"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 ml-1.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors border border-white/10"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden w-full bg-[#05070E]/98 backdrop-blur-2xl border-t border-b border-purple-500/20 px-6 pt-4 pb-6 space-y-4 shadow-2xl animate-in fade-in slide-in-from-top-3 duration-200 mt-3">
          <div className="flex flex-col space-y-2">
            {['Home', 'Courses', 'Learning', 'Projects', 'About'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 text-base font-medium text-slate-200 hover:text-white hover:bg-purple-600/20 rounded-xl transition-colors"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-col space-y-2.5">
            <a
              href="#login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 text-slate-300 hover:text-white text-base font-medium rounded-xl hover:bg-white/5 transition-colors border border-white/5"
            >
              Sign In
            </a>
            {showGetStarted && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenGetStarted) onOpenGetStarted();
                }}
                className="w-full flex items-center justify-center py-3 text-white font-semibold text-base rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-600/30 animate-in fade-in duration-300"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
