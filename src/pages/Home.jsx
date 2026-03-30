import React from "react";
import Hero from "../features/home/components/Hero.jsx";
import PartnerUniversities from "../features/home/components/PartnerUniversities.jsx";
import RecommendedUniversities from "../features/home/components/RecommendedUniversities.jsx";
import RecommendedSelfFinanced from "../features/home/components/RecommendedSelfFinanced.jsx";
import TopScholarships from "../features/home/components/TopScholarships.jsx";
import FeaturedScholarships from "../features/home/components/FeaturedScholarships.jsx";
import TopUniversitiesChina from "../features/home/components/TopUniversitiesChina.jsx";
import WhyChooseUs from "../features/home/components/WhyChooseUs.jsx";
import JourneySection from "../features/home/components/JourneySection.jsx";
import TestimonialSection from "../features/home/components/TestimonialSection.jsx";

function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <FeaturedScholarships />
      <PartnerUniversities />
      <RecommendedUniversities />
      <TopScholarships />
      <RecommendedSelfFinanced />
      <TopUniversitiesChina />
      <WhyChooseUs />
      <JourneySection />
      <TestimonialSection />
    </div>
  );
}

export default Home;
