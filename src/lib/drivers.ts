// Les deux chauffeurs Azur Prestige et leurs numéros.
// `tel` = format pour les liens tel:  ·  `wa` = format pour wa.me  ·  `display` = affichage humain.
export const DRIVERS = [
  { name: "Chauffeur 1", tel: "+33666323817", wa: "33666323817", display: "+33 6 66 32 38 17" },
  { name: "Chauffeur 2", tel: "+33622845240", wa: "33622845240", display: "+33 6 22 84 52 40" },
] as const;

export type Driver = (typeof DRIVERS)[number];
