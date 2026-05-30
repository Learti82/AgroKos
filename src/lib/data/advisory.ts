// Kosovo-specific advisory knowledge base (Albanian content).

export interface CropGuide {
  cropId: string;
  planting: string;
  varieties: string;
  fertilization: string;
  irrigation: string;
  pests: string;
  yield: string;
  harvest: string;
}

export const CROP_GUIDES: CropGuide[] = [
  {
    cropId: "wheat",
    planting: "Mbillet në vjeshtë, tetor–nëntor, kur temperatura e tokës bie nën 12°C. Thellësia 3-4 cm, 180-220 kg farë/ha.",
    varieties: "Simonida, Pobeda, NS-40S — të përshtatshme për klimën kontinentale të Kosovës.",
    fertilization: "Bazë: 300 kg/ha NPK 15-15-15 para mbjelljes. Mbulesë: 150-200 kg/ha KAN në fillim të pranverës (faza e bërthamëzimit).",
    irrigation: "Kryesisht me shi. Ujitje plotësuese në prill-maj nëse ka thatësirë gjatë mbushjes së kokrrës.",
    pests: "Ndryshku i verdhë, septoria, morra e drithit. Kontrolloni nga prilli.",
    yield: "3.5–5 t/ha në kushtet e Kosovës.",
    harvest: "Korret në korrik kur lagështia e kokrrës bie nën 14%. Kashta e verdhë, kokrra e fortë.",
  },
  {
    cropId: "corn",
    planting: "Mbillet prill–maj kur toka arrin 10-12°C. Dendësia 70.000-80.000 bimë/ha, distanca 70 cm mes rreshtave.",
    varieties: "Pioneer P9911, NS hibride (FAO 400-600) për sezone të ndryshme.",
    fertilization: "Bazë: 400 kg/ha NPK. Mbulesë: 150 kg/ha urea në fazën 6-8 gjethe.",
    irrigation: "Nevojë e lartë, sidomos në tasselim dhe mbushje kokrre (korrik-gusht). 4-6 ujitje.",
    pests: "Tarmi i misrit (Ostrinia), krimbi rrënjor, vrugu i fletëve.",
    yield: "7–10 t/ha kokërr e thatë me ujitje.",
    harvest: "Shtator-tetor kur lagështia 25-30% për silazh, 14-18% për kokërr.",
  },
  {
    cropId: "tomato",
    planting: "Fidanë transplantohen pas 15 majit (jashtë rrezikut të ngricës). Distanca 50×70 cm. Në serra nga marsi.",
    varieties: "Belle F1, Optima F1, varietete vendore për salcë.",
    fertilization: "Pleh organik 30-40 t/ha + NPK. Plehërim me pika gjatë sezonit (fertigim).",
    irrigation: "Nevojë e lartë e qëndrueshme. Ujitje me pika 2-3 herë/javë; shmangni lagien e fletëve.",
    pests: "Vrugu (Phytophthora), tuta absoluta, alternaria. Trajtim parandalues.",
    yield: "40–60 t/ha në fushë, deri 100 t/ha në serra.",
    harvest: "Korret hap pas hapi nga korriku, kur frutat marrin ngjyrë.",
  },
  {
    cropId: "pepper",
    planting: "Transplantim pas mesit të majit. Distanca 40×60 cm. I ndjeshëm ndaj të ftohtit.",
    varieties: "Speca për sallatë dhe për ajvar (Kurtovska kapija).",
    fertilization: "Pleh organik + NPK i balancuar. Kujdes me azotin e tepërt.",
    irrigation: "E rregullt me pika; mungesa e ujit shkakton rënie lulesh.",
    pests: "Morra, merimanga e kuqe, vrugu i specit.",
    yield: "25–35 t/ha.",
    harvest: "Gusht-tetor sipas pjekurisë teknologjike ose të plotë.",
  },
  {
    cropId: "apple",
    planting: "Fidanët mbillen në vjeshtë ose pranverë të hershme. Sistem intensiv 3.5×1 m me mbështetje.",
    varieties: "Idared, Golden Delicious, Gala — të kërkuara në tregun e Kosovës dhe BE.",
    fertilization: "NPK sipas analizës; plehërim pranveror + mikroelemente (bor, kalcium).",
    irrigation: "Me pika; kritike gjatë rritjes së frutit (qershor-gusht).",
    pests: "Morra e mollës, vemja e mollës (Cydia), vrugu (Venturia).",
    yield: "30–50 t/ha në pemishte intensive të rritura.",
    harvest: "Shtator-tetor sipas varietetit; testi i niseshtesë dhe ngjyra.",
  },
  {
    cropId: "raspberry",
    planting: "Mbillet vonë vjeshte ose pranverë. Distanca 0.4×2.5 m me tela mbështetës.",
    varieties: "Polka, Tulameen, Willamette — të suksesshme në zonat malore të Kosovës.",
    fertilization: "Pleh organik i pasur + NPK; mbajeni pH 5.5-6.5.",
    irrigation: "Nevojë e lartë; ujitje me pika e detyrueshme gjatë frytezimit.",
    pests: "Krimbi i mjedrës, sëmundjet rrënjore, kërpudha gri (Botrytis).",
    yield: "8–12 t/ha; kulturë me vlerë të lartë eksporti.",
    harvest: "Qershor-shtator; vjelje çdo 2-3 ditë, ftohje e shpejtë.",
  },
];

export interface PestEntry {
  name: string;
  crops: string;
  symptoms: string;
  prevention: string;
  treatment: string;
}

export const PEST_LIBRARY: PestEntry[] = [
  { name: "Vrugu i domates (Phytophthora)", crops: "Domate, patate", symptoms: "Njolla kafe në fletë dhe fruta, push i bardhë në anën e poshtme.", prevention: "Qarkullim ajri, shmangni lagien e fletëve, varietete rezistente.", treatment: "Fungicide bakri ose Ridomil Gold në mënyrë parandaluese." },
  { name: "Tuta absoluta", crops: "Domate", symptoms: "Galeri/tunele në fletë dhe fruta, dëmtim i thellë.", prevention: "Rrjeta kundër insekteve, kurthe feromoni, higjienë.", treatment: "Insekticide selektive + lëshim natyror i parazitoidëve." },
  { name: "Morra e bostanit/mollës", crops: "Speca, mollë, perime", symptoms: "Kolonі të vogla, deformim fletësh, melatë e ngjitur.", prevention: "Insekte të dobishme (mareshalët), kontroll i hershëm.", treatment: "Sapun kaliumi ose insekticide sistemike kur është e nevojshme." },
  { name: "Ndryshku i verdhë i grurit", crops: "Grurë, elb", symptoms: "Vija pluhuri të verdhë në gjethe.", prevention: "Varietete rezistente, mos teprim me azot.", treatment: "Fungicide triazol në fazat e hershme të infeksionit." },
  { name: "Tarmi i misrit (Ostrinia)", crops: "Misër", symptoms: "Vrima në kërcell dhe kallinj, thyerje kërcelli.", prevention: "Grumbullim i mbeturinave, monitorim me kurthe.", treatment: "Insekticide në kohën e daljes së vemjeve." },
  { name: "Vemja e mollës (Cydia)", crops: "Mollë, kumbull", symptoms: "Vrima në fruta, krimba brenda, rënie e frutit.", prevention: "Kurthe feromoni, çrregullim çiftëzimi.", treatment: "Insekticide në kohën sipas modelit të pjekurisë." },
  { name: "Vrugu i mollës (Venturia)", crops: "Mollë", symptoms: "Njolla të errëta në fletë dhe fruta.", prevention: "Krasitje për ajrim, mbledhje e fletëve të rëna.", treatment: "Fungicide parandalues nga lulëzimi." },
  { name: "Merimanga e kuqe", crops: "Speca, fasule, fruta", symptoms: "Pika të verdha, fije të holla, tharje fletësh.", prevention: "Lagështi e mjaftueshme, akaride të dobishme.", treatment: "Akaricide në vatra; alternoni produktet." },
  { name: "Sëmundjet rrënjore (Fusarium)", crops: "Perime, mjedër", symptoms: "Vyshkje, nxirje e rrënjëve dhe qafës.", prevention: "Drenazh i mirë, qarkullim kulturash, fidanë të shëndoshë.", treatment: "Vështirë; largoni bimët e prekura, dezinfektim toke." },
  { name: "Botrytis (kërpudha gri)", crops: "Mjedër, rrush, luleshtrydhe", symptoms: "Push gri në fruta, kalbje.", prevention: "Ajrim, vjelje në kohë, shmangni mbingopjen.", treatment: "Fungicide specifikë; reduktoni lagështinë." },
  { name: "Plasaritja e qershisë/kumbullës", crops: "Kumbull, qershi", symptoms: "Frutat plasin pas shiut.", prevention: "Ujitje e qëndrueshme, varietete tolerante.", treatment: "Menaxhim uji; kalcium gjethor." },
  { name: "Peronospora e rrushit", crops: "Rrush", symptoms: "Njolla vajore në fletë, push i bardhë.", prevention: "Krasitje, ajrim, monitorim moti.", treatment: "Fungicide bakri sipas parashikimit të motit." },
  { name: "Barojat shumëvjeçare", crops: "Të gjitha", symptoms: "Konkurrencë për ujë dhe ushqim.", prevention: "Mulçim, qarkullim, përgatitje e mirë e tokës.", treatment: "Herbicide selektive ose prashitje mekanike." },
  { name: "Breshëri (dëmtim fizik)", crops: "Fruta, perime", symptoms: "Plagë në fruta dhe fletë.", prevention: "Rrjeta kundër breshërit në pemishte intensive.", treatment: "Trajtim plagësh; sigurim bujqësor." },
  { name: "Nematodat e tokës", crops: "Patate, perime", symptoms: "Nyje në rrënjë, rritje e dobët.", prevention: "Qarkullim kulturash, bimë biofumiguese.", treatment: "Solarizim toke; varietete rezistente." },
];

export const FAQ: { q: string; a: string }[] = [
  { q: "Kur është koha më e mirë për të mbjellë grurin në Kosovë?", a: "Periudha optimale është tetor–nëntor, kur temperatura e tokës bie nën 12°C, që bima të zhvillojë rrënjë para dimrit." },
  { q: "Si ta mbroj domaten nga vrugu?", a: "Siguroni qarkullim ajri, shmangni lagien e gjetheve, ujisni me pika në mëngjes dhe aplikoni fungicide parandalues kur moti është i lagësht." },
  { q: "Sa plehërim azotik i duhet grurit?", a: "Rreth 150-200 kg/ha KAN si plehërim mbulese në pranverë, përveç plehërimit bazë NPK në vjeshtë. Bazohuni në analizën e tokës." },
  { q: "Cila kulturë jep fitimin më të lartë për hektar?", a: "Manaferrat si mjedra dhe boronica kanë vlerë të lartë eksporti (€3-5/kg), megjithëse kërkojnë investim dhe punë më të madhe." },
  { q: "Si ta di nëse toka ime ka nevojë për gëlqere?", a: "Nëse analiza tregon pH nën 6.0, toka është acide dhe gëlqerja (2-3 t/ha) do të përmirësojë disponueshmërinë e ushqyesve." },
  { q: "Kur duhet të ujis pemishten e mollëve?", a: "Periudha më kritike është qershor-gusht gjatë rritjes së frutit. Ujitja me pika 1-2 herë në javë sipas motit është ideale." },
  { q: "A mund të eksportoj produktet bujqësore në BE?", a: "Po, Kosova ka qasje pa doganë në BE për mbi 2.560 produkte bujqësore sipas MSA-së. Nevojiten certifikata fitosanitare dhe standarde cilësie." },
  { q: "Si të aplikoj për subvencione bujqësore?", a: "Aplikohet pranë MBPZHR-së gjatë periudhave të hapura, përmes Agjencisë për Zhvillimin e Bujqësisë. Shihni faqen 'Subvencione'." },
  { q: "Çfarë qarkullimi kulturash rekomandohet?", a: "Mos mbillni perime të të njëjtës familje radhazi. Ndiqni: drithëra → bishtajore → perime. Shihni 'Këshilltarin e Qarkullimit'." },
  { q: "Si t'i ruaj mjedrat pas vjeljes?", a: "Ftohini menjëherë në 0-2°C. Mjedra është shumë e prishshme; shitja ose ngrirja brenda 24 orëve është e rekomanduar." },
  { q: "Sa shpesh duhet bërë analiza e tokës?", a: "Të paktën një herë në 2-3 vjet, ose para çdo cikli të ri për kultura intensive." },
  { q: "Cilat varietete molle shiten më mirë në treg?", a: "Idared, Gala dhe Golden Delicious kanë kërkesë të mirë në tregun vendor dhe atë të BE-së." },
];
