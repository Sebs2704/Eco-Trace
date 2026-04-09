export const LOCATIONS: Record<string, string> = {
  jordan:        "Barrio Jordán",
  barzal:        "Barrio Barzal",
  esperanza:     "Barrio La Esperanza",
  manzanares:    "Barrio Manzanares",
  centro:        "Centro de Villavicencio",
  porvenir:      "Barrio El Porvenir",
  villa_lucia:   "Barrio Villa Lucía",
  chapinero:     "Barrio Chapinero",
  primero_mayo:  "Barrio Primero de Mayo",
  el_buque:      "Barrio El Buque",
  santa_helena:  "Barrio Santa Helena",
  recuperarte:   "Asociación Recuperarte",
  ecoambiente:   "Asociación Ecoambiente",
  recinam:       "Recinam del Llano",
  suaitana:      "Asociación La Suaitana",
  asocanitas:    "ASOCANITAS",
  arum:          "ARUM",
};

export const getLocationName = (key: string, fallback = "Villavicencio"): string =>
  LOCATIONS[key] ?? (key || fallback);
