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
  amount: string;
  deadline: string;
  crops: string;
  how: string;
  status: "open" | "soon" | "closed";
}

export const SUBSIDIES: Subsidy[] = [
  { title: "Subvencion për grurë dhe drithëra", amount: "€220/ha", deadline: "30 Qershor", crops: "Grurë, elb, misër", how: "Aplikim në AZHB me fletën kadastrale dhe dëshminë e mbjelljes.", status: "open" },
  { title: "Mbështetje për pemtari intensive", amount: "deri €3.000/ha", deadline: "15 Korrik", crops: "Mollë, kumbull, dredhëza", how: "Projekt-propozim + faturat e fidanëve dhe sistemit të ujitjes.", status: "open" },
  { title: "Grant për serra dhe perimtari", amount: "50% e investimit", deadline: "1 Shtator", crops: "Domate, speca, kastravec", how: "Aplikim përmes thirrjes IADK/MBPZHR me plan biznesi.", status: "soon" },
  { title: "Subvencion për lopë qumështore", amount: "€100/krerë", deadline: "31 Maj", crops: "Bulmet", how: "Regjistrim i kafshëve në AVUK + numri i identifikimit.", status: "closed" },
  { title: "Mbështetje për bletari", amount: "€20/koshere", deadline: "20 Qershor", crops: "Mjaltë", how: "Dëshmi e numrit të koshereve nga shoqata e bletarëve.", status: "open" },
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
