import Navigation       from "@/components/layout/Navigation";
import GlobalAmbient    from "@/components/layout/GlobalAmbient";
import SectionBridge    from "@/components/layout/SectionBridge";
import Footer           from "@/components/layout/Footer";
import Hero             from "@/components/sections/Hero";
import Ticker           from "@/components/sections/Ticker";
import Stats            from "@/components/sections/Stats";
import Services         from "@/components/sections/Services";
import ScrollStory      from "@/components/sections/ScrollStory";
import Vehicles         from "@/components/sections/Vehicles";
import Calculator       from "@/components/sections/Calculator";
import Tourism          from "@/components/sections/Tourism";
import Process          from "@/components/sections/Process";
import Testimonials     from "@/components/sections/Testimonials";
import ClientPhotos     from "@/components/sections/ClientPhotos";
import ReservationCTA   from "@/components/sections/ReservationCTA";
import FAQ              from "@/components/sections/FAQ";
import Contact          from "@/components/sections/Contact";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* ── Persistent global layer — always above everything ── */}
      <GlobalAmbient />
      <Navigation />

      {/* ── Page flow — SectionBridges connect every transition ── */}
      <Hero />
      <Ticker />
      <SectionBridge />
      <Stats />
      <SectionBridge />
      <Services />
      <SectionBridge />
      <ScrollStory />
      <SectionBridge />
      <Vehicles />
      <SectionBridge />
      <Calculator />
      <SectionBridge />
      <Tourism />
      <SectionBridge />
      <Process />
      <SectionBridge />
      <Testimonials />
      <SectionBridge />
      <ClientPhotos />
      <SectionBridge />
      <ReservationCTA />
      <SectionBridge />
      <FAQ />
      <SectionBridge />
      <Contact />
      <Footer />
    </main>
  );
}
