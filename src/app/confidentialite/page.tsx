import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import GlobalAmbient from "@/components/layout/GlobalAmbient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de Confidentialité | Azur Prestige Taxi Marseille",
  description: "Politique de confidentialité et protection des données personnelles — Azur Prestige Taxi Marseille.",
  robots: { index: false, follow: false },
};

export default function Confidentialite() {
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
            Politique de<br />confidentialité
          </h1>
          <p className="text-[#A1A1AA] text-sm font-light mt-4">Dernière mise à jour : juin 2025</p>
        </div>

        <div className="space-y-12 text-[#8A8A8A] font-light leading-relaxed">

          <Section title="1. Responsable du traitement">
            <p>
              Le responsable du traitement des données personnelles collectées via ce site est :
              Azur Prestige Taxi Marseille — contact@azurprestige.fr
            </p>
          </Section>

          <Section title="2. Données collectées">
            <p>Nous collectons les données suivantes uniquement lorsque vous nous les transmettez volontairement :</p>
            <ul className="mt-4 space-y-2 list-none">
              {[
                "Nom et prénom (formulaire de contact / réservation)",
                "Numéro de téléphone",
                "Adresse email",
                "Adresse de départ et de destination",
                "Date et heure souhaitées",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-1 h-1 rounded-full bg-[#D4AF37] mt-2 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4">
              Nous ne collectons aucune donnée sensible (bancaire, de santé, etc.)
              via ce site. Les paiements sont traités de façon sécurisée lors de la course.
            </p>
          </Section>

          <Section title="3. Finalité et base légale">
            <p>Vos données sont utilisées exclusivement pour :</p>
            <ul className="mt-4 space-y-2 list-none">
              {[
                "Répondre à vos demandes de devis ou de réservation (exécution d'un contrat)",
                "Vous envoyer une confirmation de course par SMS (intérêt légitime)",
                "Améliorer notre service (intérêt légitime)",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-1 h-1 rounded-full bg-[#D4AF37] mt-2 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4">
              Nous n'utilisons jamais vos données à des fins publicitaires
              et ne les revendons en aucun cas à des tiers.
            </p>
          </Section>

          <Section title="4. Durée de conservation">
            <p>
              Vos données sont conservées le temps nécessaire à la réalisation de la prestation,
              puis archivées pendant 3 ans à des fins de suivi client, conformément à la réglementation
              fiscale française. Elles sont ensuite supprimées définitivement.
            </p>
          </Section>

          <Section title="5. Partage des données">
            <p>
              Vos données ne sont jamais vendues, louées ou partagées avec des tiers à des fins commerciales.
              Elles peuvent être transmises uniquement à nos sous-traitants techniques
              (hébergeur Vercel, service d'envoi de SMS) dans le strict cadre de l'exécution du service,
              ces derniers étant soumis aux mêmes obligations de confidentialité.
            </p>
          </Section>

          <Section title="6. Cookies">
            <p>
              Ce site n'utilise pas de cookies publicitaires ni de tracking analytics.
              Seuls des cookies techniques strictement nécessaires au fonctionnement
              du site peuvent être déposés. Ces cookies ne collectent aucune donnée personnelle.
            </p>
          </Section>

          <Section title="7. Vos droits (RGPD)">
            <p>Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :</p>
            <ul className="mt-4 space-y-2 list-none">
              {[
                "Droit d'accès à vos données",
                "Droit de rectification",
                "Droit à l'effacement (« droit à l'oubli »)",
                "Droit à la limitation du traitement",
                "Droit à la portabilité",
                "Droit d'opposition",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-1 h-1 rounded-full bg-[#D4AF37] mt-2 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4">
              Pour exercer ces droits, contactez-nous par email à{" "}
              <a href="mailto:contact@azurprestige.fr" className="text-[#D4AF37] hover:text-white transition-colors">
                contact@azurprestige.fr
              </a>{" "}
              ou par courrier à notre adresse. Nous nous engageons à répondre dans un délai d'un mois.
            </p>
            <p className="mt-4">
              En cas de réclamation, vous pouvez saisir la CNIL :{" "}
              <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer"
                className="text-[#D4AF37] hover:text-white transition-colors">
                www.cnil.fr
              </a>
            </p>
          </Section>

          <Section title="8. Sécurité">
            <p>
              Nous mettons en œuvre les mesures techniques et organisationnelles appropriées
              pour protéger vos données contre tout accès non autorisé, perte, destruction ou altération.
              Le site est servi exclusivement en HTTPS.
            </p>
          </Section>

          <Section title="9. Modifications">
            <p>
              Nous nous réservons le droit de modifier cette politique à tout moment.
              La date de mise à jour est indiquée en haut de cette page.
              Nous vous encourageons à la consulter régulièrement.
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
