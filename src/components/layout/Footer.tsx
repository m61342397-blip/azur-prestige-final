"use client";

import { usePathname } from "next/navigation";
import { Phone, Mail, MessageCircle, ShieldCheck } from "lucide-react";
import ContactChoice from "@/components/ui/ContactChoice";

export default function Footer() {
  const pathname = usePathname();

  // Les ancres (#section) ne pointent vers une vraie cible que sur la page
  // d'accueil. Hors home, on les préfixe en /#section pour revenir sur la home
  // puis scroller vers la bonne section (le scroll est géré par SmoothScroll).
  // Les vrais chemins (/laisser-un-avis, /mentions-legales…) restent intacts.
  const resolve = (href: string) =>
    href.startsWith("#") && pathname !== "/" ? `/${href}` : href;

  return (
    <footer className="border-t border-white/[0.05] pt-16 pb-0">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
              <span className="text-white text-[11px] font-light uppercase"
                style={{ letterSpacing: "0.35em", fontFamily: "var(--font-serif)" }}>
                Azur Prestige
              </span>
            </div>
            <p className="text-[#A1A1AA] text-base font-light leading-relaxed max-w-xs">
              Tourisme accompagné à Marseille et en Provence. Transferts aéroport, gare,
              circuits sur mesure. Disponible 24h/7j, 365 jours par an.
            </p>
            <div className="inline-flex items-center gap-2 mt-5 border border-[#D4AF37]/30 px-3 py-1.5">
              <ShieldCheck size={13} className="text-[#D4AF37] shrink-0" />
              <span className="text-[#D4AF37] text-xs tracking-[0.2em] uppercase font-light">
                Taxi sous licence officielle de l'État
              </span>
            </div>
            <div className="flex items-center gap-5 mt-8">
              <ContactChoice
                mode="call"
                align="left"
                className="text-[#A1A1AA] hover:text-[#D4AF37] transition-colors duration-300 flex items-center"
                trigger={<Phone size={16} />}
              />
              <ContactChoice
                mode="whatsapp"
                align="left"
                className="text-[#A1A1AA] hover:text-[#D4AF37] transition-colors duration-300 flex items-center"
                trigger={<MessageCircle size={16} />}
              />
              <a href="mailto:contact@azurprestige.fr"
                className="text-[#A1A1AA] hover:text-[#D4AF37] transition-colors duration-300">
                <Mail size={16} />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-[#707070] text-[10px] tracking-[0.3em] uppercase mb-6 font-light">Services</h4>
            <ul className="space-y-3">
              {[
                { label: "Tourisme Accompagné", href: "#tourisme" },
                { label: "Transfert Aéroport",  href: "#services" },
                { label: "Prise en charge Gare",href: "#services" },
                { label: "Transport Médical",   href: "#services" },
                { label: "Événements",          href: "#services" },
                { label: "Longue Distance",     href: "#services" },
              ].map((s) => (
                <li key={s.label}>
                  <a href={resolve(s.href)}
                    className="text-[#A1A1AA] text-sm font-light hover:text-white transition-colors duration-300">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-[#707070] text-[10px] tracking-[0.3em] uppercase mb-6 font-light">Informations</h4>
            <ul className="space-y-3">
              {[
                { label: "FAQ",                href: "#faq"              },
                { label: "Nos véhicules",      href: "#vehicules"        },
                { label: "Devis",              href: "#calculateur"      },
                { label: "Laisser un avis",    href: "/laisser-un-avis"  },
                { label: "Contact",            href: "#contact"          },
              ].map((item) => (
                <li key={item.label}>
                  <a href={resolve(item.href)}
                    className="text-[#A1A1AA] text-sm font-light hover:text-white transition-colors duration-300">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.04] py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500/70" />
            <span className="text-[#707070] text-xs font-light">
              © {new Date().getFullYear()} Azur Prestige Taxi Marseille · SIRET 989 229 604 00016
            </span>
          </div>

          {/* Legal links */}
          <div className="flex items-center gap-5 flex-wrap">
            {[
              { label: "Mentions légales",         href: "/mentions-legales" },
              { label: "Confidentialité",          href: "/confidentialite"  },
              { label: "CGV",                      href: "/cgv"              },
            ].map((item) => (
              <a key={item.href} href={item.href}
                className="text-[#707070] text-xs font-light hover:text-[#D4AF37] transition-colors duration-300">
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
