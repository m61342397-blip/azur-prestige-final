/**
 * Email templates HTML premium — Azur Prestige
 * CSS inline uniquement (compatibilité email clients)
 * Fond sombre, typographie soignée, palette or/noir
 */

const BASE = {
  bg:       "#0A0A0A",
  surface:  "#111111",
  border:   "#1E1E1E",
  gold:     "#D4AF37",
  goldLight:"#E8C94A",
  white:    "#FFFFFF",
  gray:     "#A1A1AA",
  grayDark: "#52525B",
  text:     "#E4E4E7",
};

function wrapper(content: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Azur Prestige Taxi Marseille</title>
</head>
<body style="margin:0;padding:0;background-color:${BASE.bg};font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BASE.bg};min-height:100vh;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="100%" style="max-width:580px;margin:0 auto;">

          ${content}

          <!-- Footer -->
          <tr>
            <td style="padding:32px 0 0 0;border-top:1px solid ${BASE.border};text-align:center;">
              <p style="margin:0 0 6px 0;color:${BASE.grayDark};font-size:11px;letter-spacing:0.15em;text-transform:uppercase;font-weight:300;">Azur Prestige Taxi Marseille</p>
              <p style="margin:0 0 4px 0;color:${BASE.grayDark};font-size:11px;font-weight:300;">+33 6 66 32 38 17 &nbsp;·&nbsp; contact@azurprestige.eu</p>
              <p style="margin:0;color:#3A3A3A;font-size:10px;font-weight:300;">Service disponible 24h/7j &nbsp;·&nbsp; Marseille &amp; région PACA</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function header(): string {
  return `
  <!-- Header logo -->
  <tr>
    <td style="padding:0 0 32px 0;text-align:center;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding-bottom:20px;">
            <div style="width:40px;height:1px;background-color:${BASE.gold};margin:0 auto 16px auto;"></div>
            <p style="margin:0;color:${BASE.white};font-size:13px;letter-spacing:0.4em;text-transform:uppercase;font-weight:300;">AZUR PRESTIGE</p>
            <p style="margin:4px 0 0 0;color:${BASE.grayDark};font-size:10px;letter-spacing:0.25em;text-transform:uppercase;font-weight:300;">Taxi &middot; Marseille</p>
          </td>
        </tr>
        <tr>
          <td>
            <div style="height:1px;background:linear-gradient(to right,transparent,${BASE.gold},transparent);"></div>
          </td>
        </tr>
      </table>
    </td>
  </tr>`;
}

function infoRow(label: string, value: string, isLast = false): string {
  return `
  <tr>
    <td style="padding:12px 24px;${isLast ? "" : `border-bottom:1px solid ${BASE.border};`}">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td width="130" style="color:${BASE.grayDark};font-size:10px;letter-spacing:0.2em;text-transform:uppercase;font-weight:300;vertical-align:top;padding-top:2px;">${label}</td>
          <td style="color:${BASE.text};font-size:13px;font-weight:300;line-height:1.5;">${value}</td>
        </tr>
      </table>
    </td>
  </tr>`;
}

// ── Email client ────────────────────────────────────────────────────────────
export function emailClient(data: {
  prenom: string; nom: string; email: string;
  date_course: string; heure_course: string;
  depart: string; destination: string;
  nb_passagers: number; nb_bagages: number;
  vehicule: string; message?: string;
  refId: string;
}): string {
  const vehiculeLabel: Record<string, string> = { berline: "Berline", van: "Van", grandvan: "Grand Van" };
  const dateFormatted = new Date(data.date_course).toLocaleDateString("fr-FR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  });
  const vLabel = vehiculeLabel[data.vehicule] ?? data.vehicule;

  const content = `
  ${header()}

  <!-- Title -->
  <tr>
    <td style="padding:0 0 28px 0;">
      <p style="margin:0 0 8px 0;color:${BASE.grayDark};font-size:10px;letter-spacing:0.25em;text-transform:uppercase;font-weight:300;">Confirmation de réservation</p>
      <h1 style="margin:0;color:${BASE.white};font-size:28px;font-weight:300;line-height:1.2;letter-spacing:-0.01em;">Bonjour ${data.prenom},</h1>
      <p style="margin:12px 0 0 0;color:${BASE.gray};font-size:14px;font-weight:300;line-height:1.6;">
        Votre demande a bien été reçue. Nous confirmons la prise en charge sous 30 minutes.
      </p>
    </td>
  </tr>

  <!-- Référence badge -->
  <tr>
    <td style="padding:0 0 24px 0;">
      <table role="presentation" cellpadding="0" cellspacing="0">
        <tr>
          <td style="background-color:${BASE.surface};border:1px solid ${BASE.gold};padding:8px 20px;">
            <span style="color:${BASE.grayDark};font-size:10px;letter-spacing:0.2em;text-transform:uppercase;">Référence</span>
            &nbsp;&nbsp;
            <span style="color:${BASE.gold};font-size:13px;font-weight:400;letter-spacing:0.1em;">${data.refId}</span>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- Recap table -->
  <tr>
    <td style="padding:0 0 28px 0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BASE.surface};border:1px solid ${BASE.border};">
        <tr>
          <td style="padding:16px 24px;border-bottom:1px solid ${BASE.border};">
            <p style="margin:0;color:${BASE.grayDark};font-size:10px;letter-spacing:0.25em;text-transform:uppercase;font-weight:300;">Détails de votre course</p>
          </td>
        </tr>
        ${infoRow("Date", dateFormatted)}
        ${infoRow("Heure de prise en charge", data.heure_course)}
        ${infoRow("Départ", data.depart)}
        ${infoRow("Destination", data.destination)}
        ${infoRow("Véhicule", vLabel)}
        ${infoRow("Passagers", String(data.nb_passagers))}
        ${infoRow("Bagages", String(data.nb_bagages), !data.message)}
        ${data.message ? infoRow("Message", data.message, true) : ""}
      </table>
    </td>
  </tr>

  <!-- Paiement info -->
  <tr>
    <td style="padding:0 0 28px 0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-left:2px solid ${BASE.gold};padding-left:0;">
        <tr>
          <td style="padding:14px 20px;background-color:${BASE.surface};">
            <p style="margin:0;color:${BASE.gray};font-size:13px;font-weight:300;line-height:1.6;">
              <span style="color:${BASE.gold};">Paiement sur place</span> — directement auprès du chauffeur, en espèces ou par carte bancaire. Aucun prépaiement requis.
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- CTA Button -->
  <tr>
    <td style="padding:0 0 40px 0;">
      <table role="presentation" cellpadding="0" cellspacing="0">
        <tr>
          <td style="background-color:${BASE.gold};padding:0;">
            <a href="tel:+33666323817" style="display:block;padding:14px 32px;color:${BASE.bg};font-size:11px;font-weight:500;letter-spacing:0.2em;text-transform:uppercase;text-decoration:none;">Nous contacter</a>
          </td>
          <td width="12"></td>
          <td style="border:1px solid ${BASE.border};padding:0;">
            <a href="https://wa.me/33666323817" style="display:block;padding:13px 32px;color:${BASE.gray};font-size:11px;font-weight:300;letter-spacing:0.2em;text-transform:uppercase;text-decoration:none;">WhatsApp</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- Garanties -->
  <tr>
    <td style="padding:0 0 40px 0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td width="33%" style="text-align:center;padding:16px;">
            <p style="margin:0 0 4px 0;color:${BASE.gold};font-size:18px;font-weight:300;">24h</p>
            <p style="margin:0;color:${BASE.grayDark};font-size:10px;letter-spacing:0.15em;text-transform:uppercase;">Disponibilité</p>
          </td>
          <td width="1" style="background-color:${BASE.border};"></td>
          <td width="33%" style="text-align:center;padding:16px;">
            <p style="margin:0 0 4px 0;color:${BASE.gold};font-size:18px;font-weight:300;">4.9/5</p>
            <p style="margin:0;color:${BASE.grayDark};font-size:10px;letter-spacing:0.15em;text-transform:uppercase;">Note clients</p>
          </td>
          <td width="1" style="background-color:${BASE.border};"></td>
          <td width="33%" style="text-align:center;padding:16px;">
            <p style="margin:0 0 4px 0;color:${BASE.gold};font-size:18px;font-weight:300;">Gratuit</p>
            <p style="margin:0;color:${BASE.grayDark};font-size:10px;letter-spacing:0.15em;text-transform:uppercase;">Annulation 24h</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>`;

  return wrapper(content);
}

// ── Email chauffeur ─────────────────────────────────────────────────────────
export function emailChauffeur(data: {
  prenom: string; nom: string; telephone: string; email: string;
  date_course: string; heure_course: string;
  depart: string; destination: string;
  nb_passagers: number; nb_bagages: number;
  vehicule: string; message?: string;
  refId: string;
}): string {
  const vehiculeLabel: Record<string, string> = { berline: "Berline", van: "Van", grandvan: "Grand Van" };
  const dateFormatted = new Date(data.date_course).toLocaleDateString("fr-FR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  });
  const vLabel = vehiculeLabel[data.vehicule] ?? data.vehicule;
  const now = new Date().toLocaleString("fr-FR");

  const content = `
  ${header()}

  <!-- Alert banner -->
  <tr>
    <td style="padding:0 0 24px 0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BASE.gold};">
        <tr>
          <td style="padding:14px 24px;">
            <p style="margin:0;color:${BASE.bg};font-size:11px;letter-spacing:0.25em;text-transform:uppercase;font-weight:500;">Nouvelle réservation &nbsp;·&nbsp; ${data.refId}</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- Title -->
  <tr>
    <td style="padding:0 0 24px 0;">
      <h1 style="margin:0 0 8px 0;color:${BASE.white};font-size:24px;font-weight:300;line-height:1.2;">${data.prenom} ${data.nom}</h1>
      <p style="margin:0;color:${BASE.gold};font-size:13px;font-weight:300;">${dateFormatted} &nbsp;·&nbsp; ${data.heure_course}</p>
    </td>
  </tr>

  <!-- Client info -->
  <tr>
    <td style="padding:0 0 20px 0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BASE.surface};border:1px solid ${BASE.border};">
        <tr>
          <td style="padding:14px 24px;border-bottom:1px solid ${BASE.border};">
            <p style="margin:0;color:${BASE.grayDark};font-size:10px;letter-spacing:0.25em;text-transform:uppercase;">Client</p>
          </td>
        </tr>
        ${infoRow("Téléphone", `<a href="tel:${data.telephone}" style="color:${BASE.gold};text-decoration:none;">${data.telephone}</a>`)}
        ${infoRow("Email", `<a href="mailto:${data.email}" style="color:${BASE.gray};text-decoration:none;">${data.email}</a>`, true)}
      </table>
    </td>
  </tr>

  <!-- Course info -->
  <tr>
    <td style="padding:0 0 24px 0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BASE.surface};border:1px solid ${BASE.border};">
        <tr>
          <td style="padding:14px 24px;border-bottom:1px solid ${BASE.border};">
            <p style="margin:0;color:${BASE.grayDark};font-size:10px;letter-spacing:0.25em;text-transform:uppercase;">Course</p>
          </td>
        </tr>
        ${infoRow("Date", dateFormatted)}
        ${infoRow("Heure", data.heure_course)}
        ${infoRow("Départ", data.depart)}
        ${infoRow("Destination", data.destination)}
        ${infoRow("Véhicule", vLabel)}
        ${infoRow("Passagers", String(data.nb_passagers))}
        ${infoRow("Bagages", String(data.nb_bagages), !data.message)}
        ${data.message ? infoRow("Message", data.message, true) : ""}
      </table>
    </td>
  </tr>

  <!-- Call button -->
  <tr>
    <td style="padding:0 0 40px 0;">
      <table role="presentation" cellpadding="0" cellspacing="0">
        <tr>
          <td style="background-color:${BASE.gold};">
            <a href="tel:${data.telephone}" style="display:block;padding:14px 40px;color:${BASE.bg};font-size:11px;font-weight:500;letter-spacing:0.2em;text-transform:uppercase;text-decoration:none;">Appeler le client</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- Timestamp -->
  <tr>
    <td style="padding:0 0 32px 0;">
      <p style="margin:0;color:#2A2A2A;font-size:10px;font-weight:300;">Reçu le ${now}</p>
    </td>
  </tr>`;

  return wrapper(content);
}
