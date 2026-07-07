"use client";

import { useRef, useState } from "react";
import BirthdayPopup from "@/components/BirthdayPopup";
import LoadingScreen from "@/components/LoadingScreen";
import LandingScreen from "@/components/LandingScreen";
import BirthdayMemories from "@/components/BirthdayMemories";
import BirthdayHero from "@/components/BirthdayHero";
import LoveLetter from "@/components/LoveLetter";
import RelationshipTimeline from "@/components/RelationshipTimeline";
import ReasonsGrid from "@/components/ReasonsGrid";
import MemoryGallery from "@/components/MemoryGallery";
import FloatingLoveNotes from "@/components/FloatingLoveNotes";
import SecretSurprise from "@/components/SecretSurprise";
import FinaleScreen from "@/components/FinaleScreen";
import MusicControls from "@/components/MusicControls";
import RibbonThread from "@/components/RibbonThread";
import CursorGlow from "@/components/CursorGlow";
import RevealSection from "@/components/RevealSection";

export default function Home() {
  const [showPopup, setShowPopup] = useState(false);
  const memoriesRef = useRef<HTMLDivElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);
  const secretRef = useRef<HTMLDivElement>(null);

  const handleLoadingFinish = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };
  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleGiftSelect = (id: string) => {
    if (id === "memories") scrollTo(memoriesRef);
    else if (id === "letter") scrollTo(letterRef);
    else if (id === "secret") scrollTo(secretRef);
  };

  return (
    <main className="relative w-full">
      <LoadingScreen onFinish={handleLoadingFinish} />
      {showPopup && <BirthdayPopup onClose={handleClosePopup} />}
      <RibbonThread />
      <CursorGlow />
      <MusicControls />

      <LandingScreen onSelect={handleGiftSelect} />

      <div ref={memoriesRef}>
        <BirthdayMemories />
      </div>

      <BirthdayHero />

      <div ref={letterRef}>
        <LoveLetter />
      </div>

      <RevealSection>
        <RelationshipTimeline />
      </RevealSection>

      <RevealSection>
        <ReasonsGrid />
      </RevealSection>

      <RevealSection>
        <MemoryGallery />
      </RevealSection>

      <RevealSection>
        <FloatingLoveNotes />
      </RevealSection>

      <div ref={secretRef}>
        <RevealSection>
          <SecretSurprise />
        </RevealSection>
      </div>

      <FinaleScreen />
    </main>
  );
}
