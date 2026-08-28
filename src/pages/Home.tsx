import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import AICareerCopilot from '../components/home/AICareerCopilot';
import CareerJourney from '../components/home/CareerJourney';
import CoreTools from '../components/home/CoreTools';
import HomeContent from '../components/home/HomeContent';
import HomeCTA from '../components/home/HomeCTA';
import HomeHero from '../components/home/HomeHero';
import HomeJobSearch from '../components/home/HomeJobSearch';
import SEO from '../components/SEO';
import { useAuth } from '../contexts/AuthContext';
import { trackEvent } from '../lib/analytics';

const homeJsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: '职引',
    url: 'https://www.zhiyincareer.com/',
    logo: 'https://www.zhiyincareer.com/favicon.svg',
    description: '面向留学生的一站式求职平台，提供职位搜索、简历优化、AI 模拟面试和校招信息。',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: '职引',
    url: 'https://www.zhiyincareer.com/',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://www.zhiyincareer.com/jobs?keyword={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  },
];

export default function Home() {
  const { isAuthenticated, openAuthModal } = useAuth();
  const navigate = useNavigate();

  const handleRegister = () => {
    trackEvent('home_register_click', { authenticated: isAuthenticated });
    if (isAuthenticated) navigate('/jobs');
    else openAuthModal('register', '/jobs');
  };

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-home-section]'));
    if (!sections.length || typeof IntersectionObserver === 'undefined') return undefined;
    const viewed = new Set<string>();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const section = (entry.target as HTMLElement).dataset.homeSection;
        if (!entry.isIntersecting || !section || viewed.has(section)) return;
        viewed.add(section);
        trackEvent('home_section_view', { section });
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.3 });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="zy-page-shell">
      <SEO
        title="留学生求职，从这里开始"
        description="找职位、做准备、练面试、管进度。职引把复杂的留学生求职过程，变成清晰的下一步。"
        keywords="留学生求职,海外求职,校招日历,AI模拟面试,简历优化,留学生职位"
        canonical="https://www.zhiyincareer.com/"
        jsonLd={homeJsonLd}
      />
      <HomeHero />
      <HomeJobSearch />
      <CareerJourney />
      <AICareerCopilot />
      <CoreTools />
      <HomeContent />
      <HomeCTA onRegister={handleRegister} />
    </main>
  );
}
