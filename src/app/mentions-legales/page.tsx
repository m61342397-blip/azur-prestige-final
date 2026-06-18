import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import GlobalAmbient from "@/components/layout/GlobalAmbient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions Légales | Azur Prestige Taxi Marseille",
  description: "Mentions légales du service de taxi premium Azur Prestige à Marseille.",
  robots: { index: false, follow: false },
};

export default function MentionsLegales() {
  return (
    <main className="bg-[#050505] min-h-screen">
      <GlobalAmbient />
      <Navigation />

      <div className="max-w-[860px] mx-auto px-6 lg:px-12 pt-36 pb-24">

        {/* Header */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-[#D4AF37]" />
            <span className="text-[#D4AF37] text-xs tracking-[0.35em] uppercase font-light">Légal</span>
          </div>
          <h1 className="font-light leading-tight text-white"
            style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.5rem,5vw,5rem)" }}>
            Mentions légales
          </h1>
          <p className="text-[#A1A1AA] text-sm font-light mt-4">Dernière mise à jour : juin 2025</p>
        </div>

        <div className="space-y-12 text-[#8A8A8A] font-light leading-relaxed">

          <Section title="1. Éditeur du site">
            <p>Le présent site est édité par :</p>
            <Info>
              <Row label="Raison sociale" value="Azur Prestige Taxi Marseille" />
              <Row label="Forme juridique" value="Auto-entrepreneur / Micro-entreprise" />
              <Row label="SIRET" value="989 229 604 00016" />
              <Row label="Numéro de carte professionnelle" value="01325515101" />
              <Row label="Adresse" value="Marseille, Bouches-du-Rhône (13), France" />
              <Row label="Téléphone" value="+33 6 66 32 38 17" />
              <Row label="Email" value="contact@azurprestige.fr" />
            </Info>
          </Section>

          <Section title="2. Directeur de la publication">
            <p>Le directeur de la publication est le gérant de la société Azur Prestige Taxi Marseille.</p>
          </Section>

          <Section title="3. Hébergement">
            <Info>
              <Row label="Hébergeur" value="Vercel Inc." />
              <Row label="Adresse" value="340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis" />
              <Row label="Site web" value="vercel.com" />
            </Info>
          </Section>

          <Section title="4. Propriété intellectuelle">
            <p>
              L'ensemble du contenu du présent site (textes, images, graphismes, logo, icônes, etc.)
              est la propriété exclusive d'Azur Prestige Taxi Marseille, à l'exception des contenus
              tiers identifiés comme tels.
            </p>
            <p className="mt-4">
              Toute reproduction, distribution, modification, adaptation, retransmission ou publication
              de ces différents éléments est strictement interdite sans l'accord exprès par écrit
              d'Azur Prestige Taxi Marseille.
            </p>
          </Section>

          <Section title="5. Limitation de responsabilité">
            <p>
              Azur Prestige Taxi Marseille s'efforce d'assurer l'exactitude et la mise à jour des
              informations diffusées sur ce site, dont il se réserve le droit de corriger le contenu
              à tout moment et sans préavis.
            </p>
            <p className="mt-4">
              Azur Prestige Taxi Marseille décline toute responsabilité concernant les éventuelles
              erreurs ou omissions dans les informations fournies sur ce site.
            </p>
          </Section>

          <Section title="6. Données personnelles">
            <p>
              La collecte et le traitement des données personnelles sont décrits dans notre{" "}
              <a href="/confidentialite" className="text-[#D4AF37] hover:text-white transition-colors">
                Politique de confidentialité
              </a>.
            </p>
          </Section>

          <Section title="7. Cookies">
            <p>
              Ce site utilise uniquement des cookies techniques nécessaires à son fonctionnement.
              Aucun cookie publicitaire ou de tracking n'est déposé sans votre consentement.
            </p>
          </Section>

          <Section title="8. Droit applicable">
            <p>
              Les présentes mentions légales sont soumises au droit français. En cas de litige,
              les tribunaux compétents seront ceux du ressort de Marseille.
            </p>
          </Section>

        </div>
      </div>

      <Footer />
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-white/[0.05] pt-10">
      <h2 className="text-white font-light mb-5 text-lg" style={{ letterSpacing: "0.02em" }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

function Info({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 border border-white/[0.06] divide-y divide-white/[0.04]">
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-6 px-5 py-3">
      <span className="text-[#A1A1AA] text-xs uppercase tracking-[0.15em] sm:w-48 shrink-0">{label}</span>
      <span className="text-[#8A8A8A] text-sm">{value}</span>
    </div>
  );
}
