import React from 'react';
import { HeroSection } from './HeroSection';
import { ServicesSection } from './ServicesSection';
import { DoctorsSection } from './DoctorsSection';
import { AiAssistantTeaser } from './AiAssistantTeaser';
import { TestimonialsSection } from './TestimonialsSection';

export const LandingPage = ({ onDoctorSelect }) => {
  return (
    <div className="space-y-0">
      <HeroSection onDoctorSelect={onDoctorSelect} />
      <ServicesSection />
      <DoctorsSection onBookDoctor={onDoctorSelect} />
      <AiAssistantTeaser />
      <TestimonialsSection />
    </div>
  );
};
