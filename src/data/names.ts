//definitions for NameLists

export interface NameList {
	firstNames: string[];
	lastNames: string[];
	fleetNames: string[];
}

export const NAME_LISTS: Record<string, NameList> = {

	default: {
		firstNames: ['Dan', 'Maria', 'Horatio', 'Johnny', 'Clarissa', 'Henry', 'Mikael'],
		lastNames: ['Smith', 'Baker', 'Ferrerrarri', 'Orono', 'Regist', 'Pike'],
		fleetNames: ['Task Force 2', 'Local Defense Fleet', 'Expeditionary Force'],
	}
}

export type OriginType = 'Star' | 'Lunar Mansion' | 'Constellation' | 'Plant' | 'Animal' | 'Food' | 'Place' | 'Mythology' | 'Fiction' | 'Machine Generated' | 'Jewel' | 'Person' | 'Misc';
export type OriginLang = 'Arabic' |  'Tamil' | 'Breton' | 'Chinese' | 'French' | 'Japanese' | 'Igbo' | 'Kurdish' | 'Lenape' | 'Welsh' | 'Swahili' |  'Ogham' |  'German' | 'Spanish' | 'Lithuanian' | 'Finnish' | 'Hoosier' | 'Latin' | 'Ugaritic' | 'Conlang' | 'Machine Generated';

export interface StarInfo {
	name: string;
	type: OriginType;
	lang: OriginLang;
	blurb: string;
}

export const SYSTEM_NAMES: string[] = [
	"'Anaqi", "'Uqdah", "'Aqiq",
"Akhir", "A'yn", "Athafi", "Alyah", "Akhbiyah", "Aqarib", "Ailm", "Añañuca", "Aušrinė", "Athshe", "Afank", "Atropia", "Aghnam", "Arianrhod",
"Bayd", "Bari'", "Bidbid", "Bleiz", "Bandurah", "Blewit", "Beithe", "Bisclavret", "Baydaq", "Bokštas", "Bebras",
"Corydon", "Cunot", "Coll", "Ceirt", "Cleyre", "Coudre",
"Dar", "Dabaran", "Dhanab", "Dubb", "Donovia",
"Eadhadh", "Equitan", "Erminig", "Eog",
"Firk", "Fard", "Fakkah", "Furud", "Fakhidh", "Ferne", "Fresne",
"Ghul", "Ghumaysa", "Ghafr",  "Gevelled", "Gwezenn", "Glenn Ayr", "Grybu", "Gorgas",
"Haddar", "Hirsh", "Haqqar", "Heval", "Houyhnhnm",
"Iodhadh", "Ifin", "Iseult",
"Jabbar", "Jabhah", "Jūra",
"Kawkab", "Kinoko", "Kärppä", "Kuthirai", "Kilangaan",
"Lourenn", "Layotto", "LaQuinli", "Lanval",  "Llyn Llyw", "Lašiša",
"Maysan", "Mi'sam", "Ma'z", "Mankib", "Mabsutah", "Maghriz", "Minkhar", "Maqbudah", "Maraq",  "Maram", "Martolod", "Morchel", "Mervyn", "Muin", "Mishmish", "Magón", "Miškas", "Manthiri",
"Najmah", "Nasaqan","Naeretaer", "Nelliyalam", "Nyumba",
"Oolitic", "Osisi", "Onn",
"Pomp Aer", "Pempont", "Pholiota", "Pallavaram", "Pernambut",  "Pirtuni",
"Qaws", "Qayd", "Qanturus", "Qalb", "Quadinar",
"Risha", "Rijl", "Russula", "Ruis",
"Sabiq", "Sayf", "Saq", "Shawlah", "Sharatan", "Samak", "Shajarah",  "Saezhataer", "Shram", "Summaq", "Saille", "Straif", "Shapash",
"Ta'ir", "Tays", "Thu'ban", "Tarf", "Thuraya", "Tinne", "Tittakudi",
"Uhelgoad", "Uath", "Úir", "Uilleann",
"Vakarinė",
"Waqi'", "Wazn", "Wisamèkw",
"Yad", "Yaqut", "Yeddo", "Yanqul", "Ysbaddaden",
"Zawiyah", "Zawraq", "Zuban", "Zao Fu", "Zhu Wang", "Zi Xiu", "Zimbrah", "Zayt", "Zomia"
];

export const SYSTEM_METADATA: Record<string, StarInfo> = {
	"'Anaqi": {
		name: "'Anaqi",
		type: 'Star',
		lang: 'Arabic',
		blurb: ''
	},
	"'Uqdah": {
		name: "'Uqdah",
		type: 'Star',
		lang: 'Arabic',
		blurb: ''
	},
	"'Aqiq": {
		name: "'Aqiq",
		type: 'Jewel',
		lang: 'Arabic',
		blurb: 'An Agate.'
	},
	"Akhir": {
		name: "Akhir",
		type: 'Star',
		lang: 'Arabic',
		blurb: 'Akhir, or End, is derived from Akhir an-Nahr: End of the River. The star is commonly known as Achernar, directly from this name.'
	},
	"A'yn": {
		name: "A'yn",
		type: 'Star',
		lang: 'Arabic',
		blurb: "A'yn is the Arabic word for Eye. It has been adopted for common use as a star name."
	},
	"Athafi": {
		name: "Athafi",
		type: 'Star',
		lang: 'Arabic',
		blurb: 'From al-Athafi'
	},
	"Alyah": {
		name: "Alyah",
		type: 'Star',
		lang: 'Arabic',
		blurb: 'From al-Alyah'
	},
	"Akhbiyah": {
		name: "Akhbiyah",
		type: "Lunar Mansion",
		lang: 'Arabic',
		blurb: "Sa'd al-Akhbiyah is a lunar mansion"
	},
	"Aqarib": {
		name: "Aqarib",
		type: "Constellation",
		lang: 'Arabic',
		blurb: "Aqarib, or Scorpions"
	},
	"Ailm": {
		name: "Ailm",
		type: "Plant",
		lang: 'Ogham',
		blurb: "Ailm is the Ogham letter resembling A. It represents the conifer."
	},
	"Añañuca": {
		name: "Añañuca",
		type: "Star",
		lang: "Spanish",
		blurb: "Añañuca is a star, named for a Chilean wildflower."
	},
	"Aušrinė": {
		name: "Aušrinė",
		type: 'Mythology',
		lang: 'Lithuanian',
		blurb: "Aušrinė is the goddess of the morning star in Lithuanian mythology."
	},
	"Athshe": {
		name: "Athshe",
		type: 'Fiction',
		lang: 'Conlang',
		blurb: "Athshe is the setting of Le Guin's The Word for World is Forest."
	},
	"Afank": {
		name: "Afank",
		type: "Mythology",
		lang: 'Welsh',
		blurb: "The Afanc was a monster in Welsh mythology that resembled a giant beaver."
	},
	"Atropia": {
		name: "Atropia",
		type: "Fiction",
		lang: 'Conlang',
		blurb: "Atropia is a fictional country used in US military training."
	},
	"Aghnam": {
		name: "Aghnam",
		type: "Constellation",
		lang: 'Arabic',
		blurb: "Aghnam, or Sheep, was part of the old Arabic Pasture represented in the stars."
	},
	"Arianrhod": {
		name: "Arianrhod",
		type: "Person",
		lang: "Breton",
		blurb: "?"
	},
	"Bayd": {
		name: "Bayd",
		type: "Star",
		lang: "Arabic",
		blurb: "Bayd, Arabic for Eggs."
	},
	"Bari'": {
		name: "Bari'",
		type: "Star",
		lang: "Arabic",
		blurb: "Sa'd al-Bari' is the Arabic name of Sadalbari."
	},
	"Bidbid": {
		name: "Bidbid",
		type: "Place",
		lang: "Arabic",
		blurb: "Bidbid is a town in Oman"
	},
	"Bleiz": {
		name: "Bleiz",
		type: "Animal",
		lang: "Breton",
		blurb: "Bleiz is Breton for wolf."
	},
	"Bandurah": {
		name: "Bandurah",
		type: "Plant",
		lang: "Arabic",
		blurb: "Bandurah is an Arabic word for Tomato"
	},
	"Blewit": {
		name: "Blewit",
		type: "Plant",
		lang: "Conlang",
		blurb: "Blewits are a variety of mushroom"
	},
	"Beithe": {
		name: "Beithe",
		type: "Plant",
		lang: "Ogham",
		blurb: "Beithe is the Ogham letter resembling B. It also means birch."
	},
	"Bisclavret": {
		name: "Bisclavret",
		type: "Fiction",
		lang: "Breton",
		blurb: "The Breton word for Werewolf, and a lai of Marie de France."
	},
	"Baydaq": {
		name: "Baydaq",
		type: "Misc",
		lang: "Arabic",
		blurb: "The Arabic word for the Pawn in Chess."
	},
	"Bokštas": {
		name: "Bokštas",
		type: "Misc",
		lang: "Lithuanian",
		blurb: "Bokštas is the Lithuanian word for the Rook in Chess."
	},
	"Bebras": {
		name: "Bebras",
		type: "Animal",
		lang: "Lithuanian",
		blurb: "Bebras is Lithuanian for beaver."
	},
	"Corydon": {
		name: "Corydon",
		type: "Place",
		lang: "Hoosier",
		blurb: "The name of the original capital of Indiana."
	},
	"Cunot": {
		name: "Cunot",
		type: "Place",
		lang: "Hoosier",
		blurb: "The name of a small Indiana town."
	},
	"Coll": {
		name: "Coll",
		type: "Plant",
		lang: "Ogham",
		blurb: "Coll is the Ogham letter approximating K. It means hazel tree."
	},
	"Ceirt": {
		name: "Ceirt",
		type: "Plant",
		lang: "Ogham",
		blurb: "Ceirt is the Ogham letter nearest Q."
	},
	"Cleyre": {
		name: "Cleyre",
		type: "Person",
		lang: "French",
		blurb: "For Voltairine de Cleyre"
	},
	"Coudre": {
		name: "Coudre",
		type: "Fiction",
		lang: "French",
		blurb: "La Coudre is a character appearing in the lai La Fresne."
	},
	"Dar": {
		name: "Dar",
		type: "Plant",
		lang: "Kurdish",
		blurb: "Dar is one Kurdish word for tree."
	},
	"Dabaran": {
		name: "Dabaran",
		type: "Star",
		lang: "Arabic",
		blurb: "ad-Dabaran is a star"
	},
	"Dhanab": {
		name: "Dhanab",
		type: "Star",
		lang: "Arabic",
		blurb: "Dhanab al-Dajajah is a common Arabic star name meaning the chicken's tail."
	},
	"Dubb": {
		name: "Dubb",
		type: "Star",
		lang: "Arabic",
		blurb: "ad-Dubb, Arabic for the bear, is part of the star name Thahr ad-Dubb al-Kabir."
	},
	"Donovia": {
		name: "Donovia",
		type: "Fiction",
		lang: "Conlang",
		blurb: "Donovia is a fictional nation created for US Army training."
	},
	"Eadhadh": {
		name: "Eadhadh",
		type: "Plant",
		lang: "Ogham",
		blurb: "Eadhadh is the Ogham letter resembling E."
	},
	"Equitan": {
		name: "Equitan",
		type: "Fiction",
		lang: "French",
		blurb: "The King of Nantes in the lai of the same name."
	},
	"Erminig": {
		name: "Erminig",
		type: "Animal",
		lang: "Breton",
		blurb: "Erminig is the word for Ermine in Breton."
	},
	"Eog": {
		name: "Eog",
		type: "Animal",
		lang: "Breton",
		blurb: "Eog is Breton (and Welsh) for Salmon."
	},
	"Firk": {
		name: "Firk",
		type: "Star",
		lang: "Arabic",
		blurb: "al-Firk is a well-known Arabic star name."
	},
	"Fard": {
		name: "Fard",
		type: "Star",
		lang: "Arabic",
		blurb: "al-Fard is an Arabic star name."
	},
	"Fakkah": {
		name: "Fakkah",
		type: "Star",
		lang: "Arabic",
		blurb: "al-Fakkah is an Arabic star name."
	},
	"Furud": {
		name: "Furud",
		type: "Star",
		lang: "Arabic",
		blurb: "al-Furud is an Arabic star name. It shares a root with al-Fard, another Arabic star."
	},
	"Fakhidh": {
		name: "Fakhidh",
		type: "Star",
		lang: "Arabic",
		blurb: "Fakhidh ad-Dubb al-Akbar is an Arabic star name; Fakhidh meaning Thigh."
	},
	"Ferne": {
		name: "Ferne",
		type: "Plant",
		lang: "Ogham",
		blurb: "Fern is the Ogham letter resembling F. It means alder tree."
	},
	"Fresne": {
		name: "Fresne",
		type: "Fiction",
		lang: "French",
		blurb: "La Fresne is one of the lais of Marie de France."
	},
	"Ghul": {
		name: "Ghul",
		type: "Star",
		lang: "Arabic",
		blurb: "From the Arabic star name Ras al-Ghul"
	},
	"Ghumaysa": {
		name: "Ghumaysa",
		type: "Star",
		lang: "Arabic",
		blurb: "From the  Arabic star name Mirzam al-Ghumaysa"
	},
	"Ghafr": {
		name: "Ghafr",
		type: "Star",
		lang: "Arabic",
		blurb: "From the Arabic Star name al-Ghafr"
	},
	"Gevelled": {
		name: "Gevelled",
		type: "Constellation",
		lang: "Breton",
		blurb: "The Breton translation for the constellation Gemini."
	},
	"Gwezenn": {
		name: "Gwezenn",
		type: "Plant",
		lang: "Breton",
		blurb: "The Breton word for tree."
	},
	"Glenn Ayr": {
		name: "Glenn Ayr",
		type: "Place",
		lang: "Hoosier",
		blurb: "A town in Indiana."
	},
	"Grybu": {
		name: "Grybu",
		type: "Plant",
		lang: "Lithuanian",
		blurb: "Mushroom"
	},
	"Gorgas": {
		name: "Gorgas",
		type: "Fiction",
		lang: "Conlang",
		blurb: "Gorgas is a fictional country used for US Military training."
	},
	"Haddar": {
		name: "Haddar",
		type: "Star",
		lang: "Arabic",
		blurb: "Hadar is a known Arabic star name."
	},
	"Hirsh": {
		name: "Hirsh",
		type: "Plant",
		lang: "Arabic",
		blurb: "Hirsh is an Arabic word for forest."
	},
	"Haqqar": {
		name: "Haqqar",
		type: "Place",
		lang: "Arabic",
		blurb: "al-Haqqar is a village in Yemen."
	},
	"Heval": {
		name: "Heval",
		type: "Misc",
		lang: "Kurdish",
		blurb: "A Kurdish word for friend."
	},
	"Houyhnhnm": {
		name: "Houyhnhnm",
		type: "Fiction",
		lang: "Conlang",
		blurb: "From Gulliver's Travels."
	},
	"Iodhadh": {
		name: "Iodhadh",
		type: "Plant",
		lang: "Ogham",
		blurb: "Iodhadh is the Ogham letter reembling I"
	},
	"Ifin": {
		name: "Ifin",
		type: "Plant",
		lang: "Ogham",
		blurb: "An Ogham letter reembling IA",
	},
	"Iseult": {
		name: "Iseult",
		type: "Fiction",
		lang: "Welsh",
		blurb: "A character in legends across Celtic regions"
	},
	"Jabbar": {
		name: "Jabbar",
		type: "Star",
		lang: "Arabic",
		blurb: "From Sayf al-Jabbar, or 'Sword of the Giant'"
	},
	"Jabhah": {
		name: "Jabhah",
		type: "Star",
		lang: "Arabic",
		blurb: "From al-Jabhah, the forehead."
	},
	"Jūra": {
		name: "Jūra",
		type: "Misc",
		lang: "Lithuanian",
		blurb: "Jūra is Lithuanian for 'sea'."
	},
	"Kawkab": {
		name: "Kawkab",
		type: "Misc",
		lang: "Arabic",
		blurb: "Kawkab is the Arabic word for planet"
	},
	"Kinoko": {
		name: "Kinoko",
		type: "Plant",
		lang: "Japanese",
		blurb: "Kinoko is Japanese for 'mushroom'."
	},
	"Kärppä": {
		name: "Kärppä",
		type: "Animal",
		lang: "Finnish",
		blurb: "Word for 'Ermine'."
	},
	"Kuthirai": {
		name: "Kuthirai",
		type: "Misc",
		lang: "Tamil",
		blurb: "Kuthirai refers to the chess Knight or to 'horse'."
	},
	"Kilangaan": {
		name: "Kilangaan",
		type: "Animal",
		lang: "Tamil",
		blurb: "Kilangaan is a variety of fish."
	},
	"Lourenn": {
		name: "Lourenn",
		type: "Misc",
		lang: "Conlang",
		blurb: "?"
	},
	"Layotto": {
		name: "Layotto",
		type: "Place",
		lang: "Hoosier",
		blurb: "Laotto is a town in Indiana."
	},
	"LaQuinli": {
		name: "LaQuinli",
		type: "Misc",
		lang: "Conlang",
		blurb: "?"
	},
	"Lanval": {
		name: "Lanval",
		type: "Fiction",
		lang: "French",
		blurb: "Lanval refers to a knight of King Arthur who appears in a lai of Marie de France"
	},
	"Llyn Llyw": {
		name: "Llyn Llyw",
		type: "Place",
		lang: "Welsh",
		blurb: "The Salmon of Llyn Llyw appears in Arthurian legends."
	},
	"Lašiša": {
		name: "Lašiša",
		type: "Animal",
		lang: "Lithuanian",
		blurb: "Lašiša means Salmon."
	},
	"Maysan": {
		name: "Maysan",
		type: "Star",
		lang: "Arabic",
		blurb: "Al-Maysan is a traditional Arabic star name."
	},
	"Mi'sam": {
		name: "Mi'sam",
		type: "Star",
		lang: "Arabic",
		blurb: "Mi'sam, or wrist, is a traditional Arabic star name."
	},
	"Ma'z": {
		name: "Ma'z",
		type: "Star",
		lang: "Arabic",
		blurb: "Al-Ma'z is an Arabic star name."
	},
	"Mankib": {
		name: "Mankib",
		type: "Star",
		lang: "Arabic",
		blurb: "Mankib, or shoulder, is a traditional Arabic star name."
	},
	"Mabsutah": {
		name: "Mabsutah",
		type: "Star",
		lang: "Arabic",
		blurb: "Mabsutah is a traditional Arabic star name."
	},
	"Maghriz": {
		name: "Maghriz",
		type: "Star",
		lang: "Arabic",
		blurb: "Maghriz is a traditional Arabic star name."
	},
	"Minkhar": {
		name: "Minkhar",
		type: "Star",
		lang: "Arabic",
		blurb: "Minkhar, or nostril, is a traditional Arabic star name."
	},
	"Maqbudah": {
		name: "Maqbudah",
		type: "Star",
		lang: "Arabic",
		blurb: "Maqbudah is a traditional Arabic star name."
	},
	"Maraq": {
		name: "Maraq",
		type: "Star",
		lang: "Arabic",
		blurb: "al-Maraq, or  is a traditional Arabic star name."
	},
	"Maram": {
		name:  "Maram",
		type: "Plant",
		lang: "Tamil",
		blurb:  "Maram is the Tamil word for tree."
	},
	"Martolod": {
		name: "Martolod",
		type: "Misc",
		lang: "Breton",
		blurb: "Martolod is the Breton word for sailor."
	},
	"Morchel": {
		name: "Morchel",
		type: "Plant",
		lang: "German",
		blurb: "Morchel is an old German word for mushroom, and the origin of Morchella."
	},
	"Mervyn": {
		name: "Mervyn",
		type: "Person",
		lang: "Welsh",
		blurb: "For author Mervyn Peake."
	},
	"Muin": {
		name: "Muin",
		type: "Misc",
		lang: "Ogham",
		blurb: "Muin is the Ogham letter representing M."
	},
	"Mishmish": {
		name: "Mishmish",
		type: "Food",
		lang: "Arabic",
		blurb: "Mishmish is the Arabic word for apricot."
	},
	"Magón": {
		name: "Magón",
		type: "Person",
		lang: "Spanish",
		blurb: "For los hermanos Flores Magón"
	},
	"Miškas": {
		name: "Miškas",
		type: "Plant",
		lang: "Lithuanian",
		blurb: "Miškas is the Lithuanian word for forest."
	},
	"Manthiri": {
		name: "Manthiri",
		type: "Misc",
		lang: "Tamil",
		blurb: "The Tamil word for minister. In chess, this is an analogue for the English bishop."
	},
	"Najmah": {
		name: "Najmah",
		type: "Star",
		lang: "Arabic",
		blurb: "Literally the Arabic word for star."
	},
	"Nasaqan": {
		name: "Nasaqan",
		type: "Star",
		lang: "Arabic",
		blurb: "an-Nasaqan is a traditional Arabic star name."
	},
	"Naeretaer": {
		name: "Naeretaer",
		type: "Constellation",
		lang: "Breton",
		blurb: "The Breton translation for Ophiuchus"
	},
	"Nelliyalam": {
		name: "Nelliyalam",
		type: "Place",
		lang: "Tamil",
		blurb: "Nelliyalam is the name of a Tamil town."
	},
	"Nyumba": {
		name: "Nyumba",
		type: "Misc",
		lang: "Swahili",
		blurb: "Nyumba is the Swahili word for home."
	},
	"Oolitic": {
		name: "Oolitic",
		type: "Place",
		lang: "Hoosier",
		blurb: "Oolitic is an Indiana community."
	},
	"Osisi": {
		name: "Osisi",
		type: "Plant",
		lang: "Igbo",
		blurb: "Osisi is the Igbo word for Tree."
	},
	"Onn": {
		name: "Onn",
		type: "Plant",
		lang: "Ogham",
		blurb: "Onn stands as the O of the Ogham Alphabet. It also means ash tree."
	},
	"Pomp Aer": {
		name: "Pomp Aer",
		type: "Constellation",
		lang: "Breton",
		blurb: "Pomp Aer is the Breton name for Antlia."
	},
	"Pempont": {
		name: "Pempont",
		type: "Place",
		lang: "Breton",
		blurb: "Pempont is a forest in Breizh"
	},
	"Pholiota": {
		name: "Pholiota",
		type: "Plant",
		lang: "Latin",
		blurb: "A mushroom variety."
	},
	"Pallavaram": {
		name: "Pallavaram",
		type: "Place",
		lang: "Tamil",
		blurb: "A town in Tamil Nadu"
	},
	"Pernambut": {
		name: "Pernambut",
		type: "Place",
		lang: "Tamil",
		blurb: "A town in Tamil Nadu"
	},
	"Pirtuni": {
		name: "Pirtuni",
		type: "Fiction",
		lang: "Conlang",
		blurb: "Pirtuni is a fictional country used in US military training."
	},
	"Qaws": {
		name: "Qaws",
		type: "Star",
		lang: "Arabic",
		blurb: "al-Qaws is a traditional Arabic star name"
	},
	"Qayd": {
		name: "Qayd",
		type: "Star",
		lang: "Arabic",
		blurb: "al-Qayd is a traditional Arabic star name"
	},
	"Qanturus": {
		name: "Qanturus",
		type: "Constellation",
		lang: "Arabic",
		blurb: "The Arabic word for the constellation Centaurus."
	},
	"Qalb": {
		name: "Qalb",
		type: "Star",
		lang: "Arabic",
		blurb: "Qalb, or heart, is an Arabic star name."
	},
	"Quadinar": {
		name: "Quadinar",
		type: "Fiction",
		lang: "Conlang",
		blurb: "I'm still upset we never got to see what Ben Quadinaros could do."
	},
	"Risha": {
		name: "Risha",
		type: "Star",
		lang: "Arabic",
		blurb: "al-Risha is a classical Arabic star name."
	},
	"Rijl": {
		name: "Rijl",
		type: "Star",
		lang: "Arabic",
		blurb: "Rijl is a classical Arabic star name."
	},
	"Russula": {
		name: "Russula",
		type: "Plant",
		lang: "Latin",
		blurb: "Russula is a variety of mushroom"
	},
	"Ruis": {
		name: "Ruis",
		type: "Misc",
		lang: "Ogham",
		blurb: "Ruis is a letter of the Ogham alphabet representing R. It also means red."
	},
	"Sabiq": {
		name: "Sabiq",
		type: "Star",
		lang: "Arabic",
		blurb: "Sabiq is a classical Arabic star name "
	},
	"Sayf": {
		name: "Sayf",
		type: "Star",
		lang: "Arabic",
		blurb: "Sayf al-Jabbar, or Sword of the Giant, is an Arabic star name"
	},
	"Saq": {
		name: "Saq",
		type: "Star",
		lang: "Arabic",
		blurb: "as-Saq is a classic Arabic star name"
	},
	"Shawlah": {
		name: "Shawlah",
		type: "Star",
		lang: "Arabic",
		blurb: "ash-Shawlah is a classic Arabic star name"
	},
	"Sharatan": {
		name: "Sharatan",
		type: "Star",
		lang: "Arabic",
		blurb: "ash-Sharatan is a classic Arabic star name"
	},
	"Samak": {
		name: "Samak",
		type: "Animal",
		lang: "Arabic",
		blurb: "Samak is the Arabic word for fish."
	},
	"Shajarah": {
		name: "Shajarah",
		type: "Plant",
		lang: "Arabic",
		blurb: "Shajarah is the Arabic word for tree."
	},
	"Saezhataer": {
		name: "Saezhataer",
		type: "Constellation",
		lang: "Breton",
		blurb: "Saezhataer is the Breton translation of Sagittarius"
	},
	"Shram": {
		name: "Shram",
		type: "Misc",
		lang: "Conlang",
		blurb: "?"
	},
	"Summaq": {
		name: "Summaq",
		type: "Food",
		lang: "Arabic",
		blurb: "Summaq is an Arabic spice"
	},
	"Saille": {
		name: "Saille",
		type: "Plant",
		lang: "Ogham",
		blurb: "Saille, meaning Willow, is an Ogham letter representing S"
	},
	"Straif": {
		name: "Straif",
		type: "Misc",
		lang: "Ogham",
		blurb: "Saille is an Ogham letter"
	},
	"Shapash": {
		name: "Shapash",
		type: "Mythology",
		lang: "Ugaritic",
		blurb: "Shapash was a sun goddess"
	},
	"Ta'ir": {
		name: "Ta'ir",
		type: "Star",
		lang: "Arabic",
		blurb: "an-Nasr at-Ta'ir is a well-known Arabic star name"
	},
	"Tays": {
		name: "Tays",
		type: "Star",
		lang: "Arabic",
		blurb: "at-Tays is a classical Arabic star name"
	},
	"Thu'ban": {
		name: "Thu'ban",
		type: "Star",
		lang: "Arabic",
		blurb: "Thu'ban is a well-known Arabic star name"
	},
	"Tarf": {
		name: "Tarf",
		type: "Star",
		lang: "Arabic",
		blurb: "at-Tarf is a well-known Arabic star name"
	},
	"Thuraya": {
		name: "Thuraya",
		type: "Constellation",
		lang: "Arabic",
		blurb: "ath-Thuraya is the Arabic term for the Pleiades"
	},
	"Tinne": {
		name: "Tinne",
		type: "Misc",
		lang: "Ogham",
		blurb: "Tinne is the Ogham letter corresponding to T."
	},
	"Tittakudi": {
		name: "Tittakudi",
		type: "Place",
		lang: "Tamil",
		blurb: "Tittakudi is a town in Tamil Nadu."
	},
	"Uhelgoad": {
		name: "Uhelgoad",
		type: "Place",
		lang: "Breton",
		blurb: "A forest in Breizh"
	},
	"Uath": {
		name: "Uath",
		type: "Misc",
		lang: "Ogham",
		blurb: "Uath is a letter in the Ogham alphabet."
	},
	"Úir": {
		name: "Úir",
		type: "Misc",
		lang: "Ogham",
		blurb: "Úir is a letter in the Ogham alphabet."
	},
	"Uilleann": {
		name: "Uilleann",
		type: "Misc",
		lang: "Ogham",
		blurb: "Uilleann is a letter in the Ogham alphabet."
	},
	"Vakarinė": {
		name: "Vakarinė",
		type: "Mythology",
		lang: "Lithuanian",
		blurb: "The goddess of the evening star."
	},
	"Waqi'": {
		name: "Waqi'",
		type: "Star",
		lang: "Arabic",
		blurb: "an-Nasr al-Waqi' is a classical Arabic star name."
	},
	"Wazn": {
		name: "Wazn",
		type: "Star",
		lang: "Arabic",
		blurb: "Wazn is a classical Arabic star name."
	},
	"Wisamèkw": {
		name: "Wisamèkw",
		type: "Animal",
		lang: "Lenape",
		blurb: "Wisamèkw means 'fat fish' in the Lenape language."
	},
	"Yad": {
		name: "Yad",
		type: "Star",
		lang: "Arabic",
		blurb: "Yad refers to the Arabic star name Yad al-Jawza'"
	},
	"Yaqut": {
		name: "Yaqut",
		type: "Jewel",
		lang: "Arabic",
		blurb: "Yaqut means Ruby in Arabic."
	},
	"Yeddo": {
		name: "Yeddo",
		type: "Place",
		lang: "Hoosier",
		blurb: "An Indiana town, named for an older term for Tokyo."
	},
	"Yanqul": {
		name: "Yanqul",
		type: "Place",
		lang: "Arabic",
		blurb: "A town in Oman"
	},
	"Ysbaddaden": {
		name: "Ysbaddaden",
		type: "Mythology",
		lang: "Welsh",
		blurb: "Chief of Giants"
	},

};


export const SPECIES_NAMES: string[] = [
	"Lizarb", "Slamand", "Gorbusian", "Blaarb", "Baboo",  "Eckon", "BigAlien"
];
