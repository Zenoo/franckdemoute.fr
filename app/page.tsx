"use client";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import AboutSection from "./components/homepage/about";
import ContactSection from "./components/homepage/contact";
import { Education } from "./components/homepage/education";
import { Experience } from "./components/homepage/experience";
import HeroSection from "./components/homepage/hero-section";
import MoreSection from "./components/homepage/more";
import MoreProjects from "./components/homepage/more-projects";
import Projects from "./components/homepage/projects";
import Skills from "./components/homepage/skills";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <AboutSection />
      <MoreSection />
      <Experience />
      <Skills />
      <Projects />
      <Education />
      <MoreProjects />
      <ContactSection />
      <SpeedInsights />
      <Analytics />
    </div>
  );
}
