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
export type OriginLang = 'Arabic' |  'Tamil' | 'Breton' | 'Chinese' | 'French' | 'Kurdish' | 'Welsh' |  'Ogham' |  'Spanish' | 'Lithuanian' | 'Hoosier' | 'Conlang' | 'Machine Generated';

export interface StarInfo {
	name: string;
	type: OriginType;
	lang: OriginLang;
	blurb: string;
}

export const SYSTEM_NAMES: string[] = [
	"'Anaqi", "'Uqdah", "'Aqiq",
	"Akhir", "A'yn", "Athafi", "Alyah", "Akhbiyah", "Aqarib", "Ailm", "Añañuca", "Aušrinė", "Athshe", "Afank", "Atropia", "Aghnam",
	"Bayd", "Bari'", "Bidbid", "Bleiz", "Bandurah", "Blewit", "Beithe", "Bisclavret", "Baydaq", "Bokštas", "Bebras",
	"Corydon", "Cunot", "Coll", "Ceirt", "Cleyre", "Coudre",
	"Dar", "Dabaran", "Dhanab", "Dubb", "Donovia",
	"Eadhadh", "Equitan", "Erminig", "Eog",
	"Firk", "Fard", "Fakkah", "Furud", "Fakhidh", "Ferne", "Fresne",
	"Ghul", "Ghumaysa", "Ghafr",  "Gevelled", "Gwezenn", "Glenn Ayr", "Grybu", "Gorgas",
"Haddar", "Humam", "Haqa'ah", "He Gu", "Hai Shan", "Hirsh", "Hafawrang", "Harlaus", "Haqqar", "Heval",
"Iodhadh", "Ifin", "Iseult", "Iklil",
"Jabbar", "Jabhah", "Jathi", "Jubhah", "Jiao Xiu", "Jin Xian", "Ji Shui", "Jun Jing", "Jūra", "Jayda",
"Kawkab", "Khaytan", "Kui Xiu", "Kongque", "Karthigai", "Kettai", "Koad", "Kurusan", "Kinoko", "Karaka", "Kärppä", "Kuthirai", "Kangar", "Kilangaan",
"Lang Jiang", "Ling Tai", "Lei Bi Zhen", "Li Gong", "Lourenn", "Layotto", "Luise", "LaQuinli", "Lanval", "Lalgudi", "Llyn Llyw", "Lašiša",
"Maysan", "Mi'sam", "Ma'z", "Mankib", "Mabsutah", "Mirugali", "Maghriz", "Minkhar", "Magam", "Maqbudah", "Maraq", "Muqadam", "Mulam", "Mao Xiu", "Maram", "Martolod", "Morchella", "Mervyn", "Muin", "Mishmish", "Magon", "Medis", "Miškas", "Manthiri",
"Najmah", "Natah", "Nasaqan", "Narakh", "Nan Men", "Nu Xiu", "Nan Chuan", "Naeretaer", "Nin", "Nelliyalam", "Nyumba",
"Oolitic", "Ohia", "Osisi", "Onn", "Okir", "Orghret",
"Ping", "Pi Li", "Punarpusam", "Puram", "Puratam", "Pomp Aer", "Pempont", "Pholiota", "Pallavaram", "Pernambut", "Padaiveeran", "Pezh", "Pirtuni",
"Qafzah", "Qaws", "Qayd", "Qurhah", "Qanturus", "Qalab", "Qi Guan", "Qaqim", "Quadinar",
"Risha", "Rijl", "Rogini", "Ravajul", "Russula", "Ruis", "Rawdah",
"Sabiq", "Sayf", "Saq", "Shawlah", "Sharatan", "Surrat", "Samak", "Shang Wei", "Shang Cheng", "Shi Lou", "Si Fei", "Suvati", "Sadayam", "Satavis", "Shajarah", "Shu", "Saezhataer", "Shram", "Saffaras", "Summaq", "Saille", "Straif", "Shapash", "Silur",
"Ta'ir", "Tays", "Thu'ban", "Tarf", "Turafah", "Tuwayba'", "Tiruvadirai", "Thuraya", "Tian Quan", "Tu Si", "Teng She", "Tanuwin", "Tinne", "Tittakudi",
"Uttiram", "Uhelgoad", "Uath", "Uir", "Uilleann",
"Vakarinė", "Vargweq", "Verhob",
"Waqi'", "Wazn", "Wardah", "Wegan", "Wisamèkw",
"Xuan Ge", "Xiang", "Xing Chen", "Xia Tai", "Xin Xiu", "Xi Zhong",
"Yad", "Yaqut", "Yu Heng", "Ye Zhe", "You Geng", "Yeddo", "Yafin", "Yanqul", "Yumen", "Yaanai", "Ysbaddaden",
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
	"Heval": {
		name: "Heval",
		type: "Misc",
		lang: "Kurdish",
		blurb: "A Kurdish word for friend."
	}
};


export const SPECIES_NAMES: string[] = [
		"Lizarb", "Slamand", "Gorbusian", "Blaarb", "Baboo",  "Eckon", "BigAlien"
];
