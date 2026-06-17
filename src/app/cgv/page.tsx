import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import GlobalAmbient from "@/components/layout/GlobalAmbient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions Générales de Vente | Azur Prestige Taxi Marseille",
  description: "Conditions générales de vente du service de taxi premium Azur Prestige à Marseille.",
  robots: { index: false, follow: false },
};

export default function CGV() {
  return (
    <main className="bg-[#050505] min-h-screen">
      <GlobalAmbient />
      <Navigation />

      <div className="max-w-[860px] mx-auto px-6 lg:px-12 pt-36 pb-24">

        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-[#D4AF37]" />
            <span className="text-[#D4AF37] text-xs tracking-[0.35em] uppercase font-light">Légal</span>
          </div>
          <h1 className="font-light leading-tight text-white"
            style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.5rem,5vw,5rem)" }}>
            Conditions générales<br />de vente
          </h1>
          <p className="text-[#A1A1AA] text-sm font-light mt-4">Dernière mise à jour : juin 2025</p>
        </div>

        <div className="space-y-12 text-[#8A8A8A] font-light leading-relaxed">

          <Section title="1. Objet">
            <p>
              Les présentes Conditions Générales de Vente (CGV) régissent l'ensemble des prestations
              de transport de personnes réalisées par Azur Prestige Taxi Marseille (ci-après « le Prestataire »)
              pour tout client particulier ou professionnel (ci-après « le Client »).
            </p>
            <p className="mt-4">
              Toute réservation implique l'acceptation pleine et entière des présentes CGV.
            </p>
          </Section>

          <Section title="2. Prestations proposées">
            <p>Le Prestataire propose les services suivants :</p>
            <ul className="mt-4 space-y-2 list-none">
              {[
                "Transferts aéroport / gare (Marseille-Provence, Gare Saint-Charles et autres)",
                "Déplacements professionnels ponctuels ou sous contrat",
                "Circuits touristiques en PACA (Calanques, Cassis, Aix-en-Provence, etc.)",
                "Mise à disposition avec chauffeur (événements, mariages, soirées)",
                "Transferts longue distance (France et Europe)",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-1 h-1 rounded-full bg-[#D4AF37] mt-2 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="3. Réservation">
            <p>
              La réservation peut être effectuée par téléphone, WhatsApp ou via le formulaire en ligne.
              Elle est confirmée par l'envoi d'un SMS ou d'un email récapitulatif mentionnant :
              la date, l'heure, le lieu de prise en charge, la destination et le tarif convenu.
            </p>
            <p className="mt-4">
              La réservation est ferme dès confirmation écrite (SMS ou email) par le Prestataire.
            </p>
          </Section>

          <Section title="4. Tarifs">
            <p>
              Les tarifs sont fixés à l'avance et communiqués au Client avant toute réservation.
              Les prix sont indiqués en euros TTC.
            </p>
            <p className="mt-4 font-normal text-white/70">Principes tarifaires :</p>
            <ul className="mt-3 space-y-2 list-none">
              {[
                "Tarifs fixes : pas de compteur, pas de surprise en fin de course",
                "Aucun supplément pour les vols en retard (suivi en temps réel inclus)",
                "Aucune majoration de nuit, week-end ou jour férié non annoncée",
                "Supplément bagages volumineux ou animaux sur demande préalable",
                "Péages et parkings inclus sauf mention contraire",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-1 h-1 rounded-full bg-[#D4AF37] mt-2 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="5. Paiement">
            <p>Le règlement peut s'effectuer :</p>
            <ul className="mt-4 space-y-2 list-none">
              {[
                "En espèces, à l'issue de la course",
                "Par carte bancaire (CB, Visa, Mastercard)",
                "Par virement bancaire pour les clients sous contrat (facturation mensuelle)",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-1 h-1 rounded-full bg-[#D4AF37] mt-2 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4">
              Un acompte peut être demandé pour les courses longues distances ou les mises
              à disposition de longue durée.
            </p>
          </Section>

          <Section title="6. Annulation et modification">
            <div className="border border-white/[0.06] divide-y divide-white/[0.04] mt-4">
              <Row label="Annulation > 24h avant" value="Gratuite, aucune pénalité" />
              <Row label="Annulation entre 12h et 24h" value="30% du tarif de la course" />
              <Row label="Annulation entre 2h et 12h" value="50% du tarif de la course" />
              <Row label="Annulation < 2h ou no-show" value="100% du tarif de la course" />
              <Row label="Modification d'horaire" value="Gratuite sous réserve de disponibilité" />
            </div>
            <p className="mt-4 text-sm">
              En cas de circonstances exceptionnelles (force majeure, accident, problème médical),
              les conditions d'annulation sont appréciées au cas par cas.
            </p>
          </Section>

          <Section title="7. Obligations du Prestataire">
            <ul className="mt-2 space-y-2 list-none">
              {[
                "Être présent à l'heure et au lieu convenus",
                "Conduire avec prudence dans le respect du code de la route",
                "Maintenir les véhicules en parfait état de propreté et de fonctionnement",
                "Assurer la confidentialité des déplacements du Client",
                "Posséder les licences, assurances et habilitations réglementaires en vigueur",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-1 h-1 rounded-full bg-[#D4AF37] mt-2 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="8. Obligations du Client">
            <ul className="mt-2 space-y-2 list-none">
              {[
                "Être présent au lieu et à l'heure convenus (tolérance de 15 minutes au-delà desquelles la course pourra être considérée comme un no-show)",
                "Indiquer avec précision les adresses de départ et de destination",
                "Ne pas fumer à bord des véhicules",
                "Respecter le véhicule et le chauffeur",
                "Signaler tout besoin particulier (siège enfant, fauteuil roulant, etc.) lors de la réservation",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-1 h-1 rounded-full bg-[#D4AF37] mt-2 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="9. Responsabilité">
            <p>
              Le Prestataire est couvert par une assurance responsabilité civile professionnelle.
              Sa responsabilité est limitée aux dommages corporels et matériels directement
              causés par une faute prouvée du Prestataire.
            </p>
            <p className="mt-4">
              Le Prestataire ne peut être tenu responsable des retards causés par des conditions
              de circulation imprévisibles, travaux, accidents ou tout autre événement de force majeure.
              En cas de risque de retard important, le Client en sera informé dès que possible.
            </p>
          </Section>

          <Section title="10. Litiges et droit applicable">
            <p>
              En cas de litige, une solution amiable sera recherchée en priorité.
              En l'absence d'accord, le Client peut recourir à un médiateur de la consommation
              conformément aux articles L.611-1 et suivants du Code de la consommation.
            </p>
            <p className="mt-4">
              Les présentes CGV sont soumises au droit français. À défaut de résolution amiable,
              le tribunal compétent sera celui de Marseille.
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
      <h2 className="text-white font-light mb-5 text-lg">{title}</h2>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-6 px-5 py-3">
      <span className="text-[#A1A1AA] text-xs uppercase tracking-[0.12em] sm:w-56 shrink-0">{label}</span>
      <span className="text-[#8A8A8A] text-sm">{value}</span>
    </div>
  );
}
