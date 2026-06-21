"use client";

import { useLocale, useTranslations } from "next-intl";
import { Phone, Mail, MessageCircle, ShieldCheck } from "lucide-react";
import ContactChoice from "@/components/ui/ContactChoice";
import { Link, usePathname } from "@/i18n/navigation";

// Cibles des liens (les libellés viennent des messages, par index).
const SERVICE_HREFS = ["#tourisme", "#services", "#services", "#services", "#services", "#services"];
const INFO_HREFS    = ["#faq", "#vehicules", "#calculateur", "/laisser-un-avis", "#contact"];
const LEGAL_HREFS   = ["/mentions-legales", "/confidentialite", "/cgv"];

export default function Footer() {
  const t = useTranslations("Footer");
  const locale = useLocale();
  const pathname = usePathname(); // sans préfixe de langue ; "/" sur l'accueil

  // Ancres (#section) : sur l'accueil on garde le scroll direct ; ailleurs on
  // renvoie vers l'accueil DE LA LANGUE COURANTE + ancre. Les vrais chemins
  // passent par <Link> next-intl (préfixe de langue automatique).
  const prefix = locale === "fr" ? "" : `/${locale}`;
  const anchorHref = (href: string) => {
    if (pathname === "/") return href;
    const homePath = prefix === "" ? "/" : prefix;
    return `${homePath}${href}`;
  };

  const linkClass = "text-[#A1A1AA] text-sm font-light hover:text-white transition-colors duration-300";

  const renderLink = (href: string, label: string, className: string) =>
    href.startsWith("#")
      ? <a href={anchorHref(href)} className={className}>{label}</a>
      : <Link href={href} className={className}>{label}</Link>;

  const services = t.raw("services") as string[];
  const info = t.raw("info") as string[];
  const legal = t.raw("legal") as string[];

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
              {t("tagline")}
            </p>
            <div className="inline-flex items-center gap-2 mt-5 border border-[#D4AF37]/30 px-3 py-1.5">
              <ShieldCheck size={13} className="text-[#D4AF37] shrink-0" />
              <span className="text-[#D4AF37] text-xs tracking-[0.2em] uppercase font-light">
                {t("licence")}
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
              <a href="mailto:contact@azurprestige.eu"
                className="text-[#A1A1AA] hover:text-[#D4AF37] transition-colors duration-300">
                <Mail size={16} />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-[#707070] text-[10px] tracking-[0.3em] uppercase mb-6 font-light">{t("servicesTitle")}</h4>
            <ul className="space-y-3">
              {services.map((label, i) => (
                <li key={i}>{renderLink(SERVICE_HREFS[i], label, linkClass)}</li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-[#707070] text-[10px] tracking-[0.3em] uppercase mb-6 font-light">{t("infoTitle")}</h4>
            <ul className="space-y-3">
              {info.map((label, i) => (
                <li key={i}>{renderLink(INFO_HREFS[i], label, linkClass)}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.04] py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500/70" />
            <span className="text-[#707070] text-xs font-light">
              © {new Date().getFullYear()} {t("copyright")}
            </span>
          </div>

          {/* Legal links */}
          <div className="flex items-center gap-5 flex-wrap">
            {legal.map((label, i) => (
              <Link key={LEGAL_HREFS[i]} href={LEGAL_HREFS[i]}
                className="text-[#707070] text-xs font-light hover:text-[#D4AF37] transition-colors duration-300">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
