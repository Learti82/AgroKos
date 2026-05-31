// Kosovo agricultural services directory — illustrative listings.
export type DirCategory = "inputs" | "machinery" | "vet" | "agronomist" | "lab" | "buyer";

export interface DirEntry {
  name: string;
  category: DirCategory;
  municipality: string;
  phone: string;
  note_sq: string;
  note_en: string;
}

export const DIRECTORY: DirEntry[] = [
  { name: "Agroprodukt", category: "inputs", municipality: "Pejë", phone: "+383 39 432 100", note_sq: "Fara, plehra, pesticide", note_en: "Seeds, fertilizers, pesticides" },
  { name: "Bujku Market", category: "inputs", municipality: "Prishtinë", phone: "+383 38 244 500", note_sq: "Inpute bujqësore & vegla", note_en: "Farm inputs & tools" },
  { name: "Agro Vita", category: "inputs", municipality: "Ferizaj", phone: "+383 290 320 11", note_sq: "Mbrojtje bimore", note_en: "Plant protection" },
  { name: "Laboratori Bujqësor", category: "lab", municipality: "Pejë", phone: "+383 39 423 777", note_sq: "Analiza toke & gjethe", note_en: "Soil & leaf analysis" },
  { name: "Instituti Bujqësor i Kosovës", category: "lab", municipality: "Pejë", phone: "+383 39 421 222", note_sq: "Analiza & certifikim fare", note_en: "Analysis & seed certification" },
  { name: "Dr. Vet. Fatmir Berisha", category: "vet", municipality: "Pejë", phone: "+383 44 222 333", note_sq: "Veteriner — gjedh & dele", note_en: "Vet — cattle & sheep" },
  { name: "Ambulanca Veterinare Prizren", category: "vet", municipality: "Prizren", phone: "+383 29 233 444", note_sq: "Shërbime veterinare", note_en: "Veterinary services" },
  { name: "Ing. Agr. Vlora Krasniqi", category: "agronomist", municipality: "Prishtinë", phone: "+383 45 678 900", note_sq: "Këshillim për perimtari & serra", note_en: "Vegetable & greenhouse advisory" },
  { name: "Ing. Agr. Bekim Gashi", category: "agronomist", municipality: "Gjakovë", phone: "+383 44 567 800", note_sq: "Pemtari & vreshtari", note_en: "Orchards & viticulture" },
  { name: "Traktor Servis Mitrovica", category: "machinery", municipality: "Mitrovicë", phone: "+383 28 530 200", note_sq: "Makineri & pjesë këmbimi", note_en: "Machinery & spare parts" },
  { name: "AgroMek", category: "machinery", municipality: "Ferizaj", phone: "+383 290 326 50", note_sq: "Shitje & qira makinerie", note_en: "Machinery sales & rental" },
  { name: "Frigo Food Export", category: "buyer", municipality: "Prizren", phone: "+383 29 244 888", note_sq: "Blerës perimesh & frutash për eksport", note_en: "Vegetable & fruit buyer for export" },
  { name: "Kooperativa Bletaria", category: "buyer", municipality: "Gjilan", phone: "+383 280 320 90", note_sq: "Grumbullim mjalti", note_en: "Honey collection" },
  { name: "Frutex Grumbullim", category: "buyer", municipality: "Pejë", phone: "+383 39 434 200", note_sq: "Grumbullim manaferrash", note_en: "Berry collection point" },
];

export const DIR_LABELS: Record<DirCategory, { sq: string; en: string; icon: string }> = {
  inputs: { sq: "Inpute bujqësore", en: "Farm inputs", icon: "🛒" },
  machinery: { sq: "Makineri", en: "Machinery", icon: "🚜" },
  vet: { sq: "Veteriner", en: "Veterinarian", icon: "🩺" },
  agronomist: { sq: "Agronom", en: "Agronomist", icon: "👨‍🌾" },
  lab: { sq: "Laborator", en: "Laboratory", icon: "🧪" },
  buyer: { sq: "Blerës / Grumbullues", en: "Buyer / Collector", icon: "📦" },
};
