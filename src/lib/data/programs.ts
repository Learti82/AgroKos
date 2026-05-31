// Crop rotation rules, Kosovo subsidies, and EU export readiness — static content.

// family grouping for rotation logic
export const CROP_FAMILY: Record<string, string> = {
  wheat: "cereal", corn: "cereal", barley: "cereal",
  tomato: "solanaceae", pepper: "solanaceae", potato: "solanaceae",
  onion: "allium", cabbage: "brassica", carrot: "umbellifer",
  cucumber: "cucurbit", sunflower: "oilseed",
  apple: "tree", plum: "tree", grape: "vine",
  raspberry: "berry", strawberry: "berry", blueberry: "berry",
};

// Good "next crop" suggestions given the last crop's family.
export const ROTATION_NEXT: Record<string, { good: string[]; avoid: string[]; reason: string }> = {
  solanaceae: { good: ["onion", "cabbage", "wheat", "barley"], avoid: ["tomato", "pepper", "potato"], reason: "Mos mbillni perime të familjes së patëllxhanit radhazi — rrisin sëmundjet e tokës." },
  cereal: { good: ["tomato", "pepper", "cabbage", "potato", "sunflower"], avoid: ["wheat", "corn", "barley"], reason: "Pas drithërave, perimet shfrytëzojnë mbetjet organike dhe thyejnë ciklin e barojave." },
  brassica: { good: ["wheat", "onion", "carrot"], avoid: ["cabbage"], reason: "Lakra shteron tokën; ndiqeni me drithëra ose qepë." },
  allium: { good: ["tomato", "cabbage", "wheat"], avoid: ["onion"], reason: "Qepa lë tokë të pastër — e mirë para perimeve gjethore." },
  cucurbit: { good: ["wheat", "onion", "cabbage"], avoid: ["cucumber"], reason: "Kungujt kërkojnë shumë ushqyes; ndiqni me kultura më pak kërkuese." },
  oilseed: { good: ["wheat", "barley"], avoid: ["sunflower"], reason: "Luledielli shteron tokën; ndiqeni me drithëra." },
  umbellifer: { good: ["cabbage", "wheat"], avoid: ["carrot"], reason: "Karota preferon tokë të strukturuar; mos përsërisni." },
};

export interface Subsidy {
  title: string;
  crops: string;
  categories: string[]; // crop categories + "dairy"/"bees" for matching
  how: string;
}

// General areas where Kosovo's Ministry of Agriculture (MBPZHR/AZHB)
// typically offers support. NO fabricated amounts/deadlines — those change
// every call and must be read from the official source (azhb-rks.net).
export const SUBSIDIES: Subsidy[] = [
  { title: "Drithëra (grurë, misër, elb)", crops: "Grurë, misër, elb", categories: ["cereal"], how: "Mbështetje për sipërfaqe të mbjella. Aplikohet pranë AZHB gjatë thirrjes vjetore me fletën kadastrale." },
  { title: "Perimtari & serra", crops: "Domate, speca, kastravec", categories: ["vegetable"], how: "Grante për serra dhe inpute, përmes thirrjeve MBPZHR/IADK me plan biznesi." },
  { title: "Pemtari & vreshtari", crops: "Mollë, kumbull, rrush", categories: ["fruit"], how: "Mbështetje për ngritje pemishtesh dhe sisteme ujitjeje." },
  { title: "Manaferra", crops: "Mjedër, boronicë, luleshtrydhe", categories: ["berry"], how: "Grante për kultura me vlerë të lartë dhe ftohje/ruajtje." },
  { title: "Blegtori & bulmet", crops: "Lopë qumështore", categories: ["dairy"], how: "Subvencion për krerë dhe qumësht; kërkon regjistrim të kafshëve në AVUK." },
  { title: "Bletari", crops: "Mjaltë", categories: ["bees"], how: "Mbështetje për koshere, zakonisht përmes shoqatave të bletarëve." },
];

export interface ExportReq {
  category: string;
  docs: string[];
  standards: string;
  labeling: string;
}

export const EU_EXPORT: ExportReq[] = [
  {
    category: "Fruta të freskëta (mollë, kumbull, manaferra)",
    docs: ["Certifikatë fitosanitare (AUV)", "Certifikatë origjine EUR.1", "Faturë tregtare & listë pakimi"],
    standards: "Standardet e tregtimit të BE-së (Reg. 543/2011), kufijtë maksimalë të pesticideve (MRL).",
    labeling: "Origjina 'Kosovo', varieteti, klasa, pesha neto, gjurmueshmëria e lotit.",
  },
  {
    category: "Perime të freskëta (domate, speca)",
    docs: ["Certifikatë fitosanitare", "EUR.1", "Analizë rezidualesh pesticidesh"],
    standards: "Kategoritë Ekstra/I/II sipas madhësisë dhe cilësisë; pa dëmtime.",
    labeling: "Emri i produktit, origjina, klasa, kalibri, prodhuesi/paketuesi.",
  },
  {
    category: "Produkte të përpunuara (ajvar, reçel, lëngje)",
    docs: ["Certifikatë HACCP", "Certifikatë shëndetësore", "EUR.1", "Analizë laboratorike"],
    standards: "Siguria ushqimore BE (Reg. 852/2004), HACCP i detyrueshëm.",
    labeling: "Lista e përbërësve, vlerat ushqyese, alergenet, data e skadimit, lot.",
  },
];
