export interface RecyclingCenter {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
}

export const RECYCLING_CENTERS: RecyclingCenter[] = [
  { id: 1, name: "Asociación de Recicladores Recuperarte",                                          address: "Villavicencio, Meta", lat: 4.1435, lng: -73.6294 },
  { id: 2, name: "Asociación de Recicladores Ecoambiente",                                          address: "Villavicencio, Meta", lat: 4.1512, lng: -73.6350 },
  { id: 3, name: "Recinam del Llano",                                                               address: "Villavicencio, Meta", lat: 4.1380, lng: -73.6200 },
  { id: 4, name: "Asociación de Recicladores La Suaitana Villao",                                   address: "Villavicencio, Meta", lat: 4.1468, lng: -73.6480 },
  { id: 5, name: "Asociación de Recicladores Proyectos Ambientales Recuperables del Meta",          address: "Villavicencio, Meta", lat: 4.1310, lng: -73.6150 },
  { id: 6, name: "Asociación de Recicladores Con Canitas de Villavicencio (ASOCANITAS)",            address: "Villavicencio, Meta", lat: 4.1560, lng: -73.6410 },
  { id: 7, name: "Asociación de Recicladores Unidos por una Meta (ARUM)",                           address: "Villavicencio, Meta", lat: 4.1450, lng: -73.6260 },
];

export const MAP_CENTER: [number, number] = [4.1430, -73.6320];
