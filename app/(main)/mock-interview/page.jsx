import React from "react";
import HeroSection from "./_component/hero-section";
import ATSScore from "./_component/ATSScore";
import AIInterviewLive from "./_component/AIInterviewLive";

const MockInterview = () => {
  return (
    <div className="space-y-8">
      <HeroSection />
      <ATSScore />
      <AIInterviewLive />
    </div>
  );
};

export default MockInterview;