import React from 'react';
import AboutHero from '../features/about/components/AboutHero.jsx';
import HistorySection from '../features/about/components/HistorySection.jsx';
import MissionSection from '../features/about/components/MissionSection.jsx';
import Team from '../features/about/components/Team.jsx';
import PartnersSection from '../features/about/components/PartnersSection.jsx';
import aboutData from '../data/about.json';

function About() {
  return (
    <div className="flex flex-col bg-white">
      <AboutHero 
        title="About Nadoumi"
        subtitle="Bridging Dreams & Opportunities"
        description="A trusted partner in scholarship acquisition and education consulting since 2014."
      />
      
      <HistorySection 
        title={aboutData.history.title}
        content={aboutData.history.content}
      />
      
      <MissionSection 
        title={aboutData.mission.title}
        content={aboutData.mission.content}
      />
      
      <Team 
        members={aboutData.team}
      />
      
      <PartnersSection 
        partners={aboutData.partners}
      />
    </div>
  );
}

export default About;
