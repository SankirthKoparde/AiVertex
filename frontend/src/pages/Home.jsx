import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import GetStartedModal from '../components/GetStartedModal';
import { Sparkles, BookOpen, Brain, Rocket, Trophy, HelpCircle, Star, ArrowRight } from 'lucide-react';

const Home = () => {
  // Check if user has previously dismissed or completed Get Started
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showGetStartedInNav, setShowGetStartedInNav] = useState(false);

  useEffect(() => {
    // Open Get Started Modal on first landing page visit
    const hasSeenModal = sessionStorage.getItem('ai_vertex_get_started_dismissed');
    if (!hasSeenModal) {
      setIsModalOpen(true);
      setShowGetStartedInNav(false);
    } else {
      setShowGetStartedInNav(true);
    }
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setShowGetStartedInNav(true);
    sessionStorage.setItem('ai_vertex_get_started_dismissed', 'true');
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const futureSections = [
    {
      id: 'about',
      num: '02',
      title: 'About AI VARTEX',
      subtitle: 'Building the next generation of AI pioneers & engineers',
      icon: Sparkles,
    },
    {
      id: 'courses',
      num: '03',
      title: 'Courses',
      subtitle: 'Curated AI, Data Science & Engineering curricula',
      icon: BookOpen,
    },
    {
      id: 'learn-with-ai',
      num: '04',
      title: 'Learn With AI',
      subtitle: 'Personalized AI mentors and interactive coding labs',
      icon: Brain,
    },
    {
      id: 'projects',
      num: '05',
      title: 'Projects',
      subtitle: 'Build production-ready AI agents and LLM applications',
      icon: Rocket,
    },
    {
      id: 'journey',
      num: '06',
      title: 'Learning Journey',
      subtitle: 'From fundamentals to advanced AI deployment',
      icon: Trophy,
    },
    {
      id: 'why-us',
      num: '07',
      title: 'Why AI VARTEX',
      subtitle: 'Industry-first AI education & direct career mentorship',
      icon: Sparkles,
    },
    {
      id: 'testimonials',
      num: '08',
      title: 'Testimonials',
      subtitle: 'Hear from our alumni working at top tech firms',
      icon: Star,
    },
    {
      id: 'faq',
      num: '09',
      title: 'Frequently Asked Questions',
      subtitle: 'Everything you need to know about our programs',
      icon: HelpCircle,
    },
    {
      id: 'cta',
      num: '10',
      title: 'Final CTA',
      subtitle: 'Ready to transform your tech career with AI?',
      icon: Rocket,
    },
  ];

  return (
    <div className="min-h-screen bg-[#05070E] text-slate-100 selection:bg-blue-500 selection:text-white">
      {/* Get Started First Visit Modal */}
      <GetStartedModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      {/* Navbar with Animated Get Started Docking */}
      <Navbar
        showGetStarted={showGetStartedInNav}
        onOpenGetStarted={handleOpenModal}
      />

      {/* Section 1: Hero Section */}
      <Hero />

      {/* Placeholders for Future Sections */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-16">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold tracking-widest text-blue-400 uppercase bg-blue-950/40 px-3.5 py-1.5 rounded-full border border-blue-500/20">
            Roadmap & Sections
          </span>
          <h2 className="text-3xl font-bold text-white mt-4">
            Upcoming Modular Sections
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            These sections will be built one by one after refining the hero section.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {futureSections.map((sec) => {
            const Icon = sec.icon;
            return (
              <section
                key={sec.id}
                id={sec.id}
                className="group relative p-6 rounded-2xl bg-gradient-to-b from-white/[0.04] to-transparent border border-white/10 hover:border-blue-500/30 transition-all duration-300 backdrop-blur-md"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-950/50 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-105 group-hover:border-blue-400/40 transition-all">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono text-slate-500 font-semibold">
                    SECTION {sec.num}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors">
                  {sec.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {sec.subtitle}
                </p>
                <div className="mt-6 flex items-center text-xs font-medium text-blue-400/60 group-hover:text-blue-400 transition-colors">
                  <span>Placeholder Ready</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
              </section>
            );
          })}
        </div>
      </div>

      {/* Section 11: Footer */}
      <footer id="footer" className="relative z-20 border-t border-white/10 bg-[#030408] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-400 text-sm">
          <p>© 2026 AI VARTEX. All rights reserved. Building the future of AI & technology education.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
