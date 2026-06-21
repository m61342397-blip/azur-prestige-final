import { useTranslations } from "next-intl";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import GlobalAmbient from "@/components/layout/GlobalAmbient";
import { Link } from "@/i18n/navigation";

// Bloc de contenu d'une section : paragraphe (string, avec tokens optionnels
// {email}/{cnil}/{privacy}), liste à puces, ou tableau label/valeur.
type Block =
  | string
  | { type: "ul"; items: string[] }
  | { type: "rows"; rows: { label: string; value: string }[] };

type LegalSection = { title: string; blocks: Block[] };

const EMAIL = "contact@azurprestige.eu";

/**
 * Page légale générique (CGV, confidentialité, mentions légales) rendue à partir
 * d'une structure traduite dans les messages : { eyebrow, title, lastUpdate,
 * sections: [{ title, blocks: [...] }] }. Les valeurs non traduisibles (SIRET,
 * téléphone, email…) vivent telles quelles dans les messages.
 */
export default function LegalPage({ namespace }: { namespace: string }) {
  const t = useTranslations(namespace);
  const sections = t.raw("sections") as LegalSection[];
  const privacyLabel = t("privacyLabel");
  const titleLines = t("title").split("\n");

  // Interpole les tokens {email}/{cnil}/{privacy} d'un paragraphe en liens.
  const renderText = (text: string) => {
    const out: React.ReactNode[] = [];
    const re = /\{(email|cnil|privacy)\}/g;
    let last = 0; let m: RegExpExecArray | null; let k = 0;
    while ((m = re.exec(text))) {
      if (m.index > last) out.push(text.slice(last, m.index));
      const link = "text-[#D4AF37] hover:text-white transition-colors";
      if (m[1] === "email") out.push(<a key={k++} href={`mailto:${EMAIL}`} className={link}>{EMAIL}</a>);
      else if (m[1] === "cnil") out.push(<a key={k++} href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className={link}>www.cnil.fr</a>);
      else out.push(<Link key={k++} href="/confidentialite" className={link}>{privacyLabel}</Link>);
      last = m.index + m[0].length;
    }
    if (last < text.length) out.push(text.slice(last));
    return out;
  };

  return (
    <main className="bg-[#050505] min-h-screen">
      <GlobalAmbient />
      <Navigation />

      <div className="max-w-[860px] mx-auto px-6 lg:px-12 pt-36 pb-24">

        {/* Header */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-[#D4AF37]" />
            <span className="text-[#D4AF37] text-xs tracking-[0.35em] uppercase font-light">{t("eyebrow")}</span>
          </div>
          <h1 className="font-light leading-tight text-white"
            style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.5rem,5vw,5rem)" }}>
            {titleLines.map((line, i) => (
              <span key={i}>{line}{i < titleLines.length - 1 && <br />}</span>
            ))}
          </h1>
          <p className="text-[#A1A1AA] text-sm font-light mt-4">{t("lastUpdate")}</p>
        </div>

        <div className="space-y-12 text-[#8A8A8A] font-light leading-relaxed">
          {sections.map((section, si) => (
            <div key={si} className="border-t border-white/[0.05] pt-10">
              <h2 className="text-white font-light mb-5 text-lg" style={{ letterSpacing: "0.02em" }}>
                {section.title}
              </h2>
              {section.blocks.map((block, bi) => {
                if (typeof block === "string") {
                  return <p key={bi} className={bi > 0 ? "mt-4" : ""}>{renderText(block)}</p>;
                }
                if (block.type === "ul") {
                  return (
                    <ul key={bi} className="mt-4 space-y-2 list-none">
                      {block.items.map((item, ii) => (
                        <li key={ii} className="flex items-start gap-3">
                          <div className="w-1 h-1 rounded-full bg-[#D4AF37] mt-2 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  );
                }
                return (
                  <div key={bi} className="mt-4 border border-white/[0.06] divide-y divide-white/[0.04]">
                    {block.rows.map((row, ri) => (
                      <div key={ri} className="flex flex-col sm:flex-row gap-1 sm:gap-6 px-5 py-3">
                        <span className="text-[#A1A1AA] text-xs uppercase tracking-[0.15em] sm:w-56 shrink-0">{row.label}</span>
                        <span className="text-[#8A8A8A] text-sm">{row.value}</span>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}
