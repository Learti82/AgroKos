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

// No fabricated contacts. Real, verified local listings are added over time
// (or via a future community-submission flow). Empty by design.
export const DIRECTORY: DirEntry[] = [];

// Official, real institutions farmers can contact directly.
export const OFFICIAL_LINKS = [
  { name: "MBPZHR — Ministria e Bujqësisë", url: "https://www.mbpzhr-ks.net", note_sq: "Politika, subvencione, lajme", note_en: "Policy, subsidies, news" },
  { name: "AZHB — Agjencia për Zhvillimin e Bujqësisë", url: "https://azhb-rks.net", note_sq: "Thirrjet & aplikimet për grante", note_en: "Grant calls & applications" },
  { name: "AUV — Agjencia e Ushqimit dhe Veterinarisë", url: "https://www.auv-ks.net", note_sq: "Veterinari & siguri ushqimi", note_en: "Veterinary & food safety" },
  { name: "SIT Kosova — Çmimet e tregut", url: "http://www.sitkosova.org/price?type=1", note_sq: "Çmime javore fruta-perime", note_en: "Weekly fruit/veg prices" },
  { name: "ASK — Agjencia e Statistikave", url: "https://ask.rks-gov.net", note_sq: "Statistika & indekse çmimesh", note_en: "Statistics & price indices" },
];

export const DIR_LABELS: Record<DirCategory, { sq: string; en: string; icon: string }> = {
  inputs: { sq: "Inpute bujqësore", en: "Farm inputs", icon: "🛒" },
  machinery: { sq: "Makineri", en: "Machinery", icon: "🚜" },
  vet: { sq: "Veteriner", en: "Veterinarian", icon: "🩺" },
  agronomist: { sq: "Agronom", en: "Agronomist", icon: "👨‍🌾" },
  lab: { sq: "Laborator", en: "Laboratory", icon: "🧪" },
  buyer: { sq: "Blerës / Grumbullues", en: "Buyer / Collector", icon: "📦" },
};
