import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // On exclut les routes techniques (API), les fichiers statiques (avec
  // extension) et l'interne Next. Tout le reste passe par le routing i18n.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
