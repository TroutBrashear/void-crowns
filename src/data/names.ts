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

export type OriginType = 'Star' | 'Plant' | 'Place' | 'Fiction' | 'Machine Generated' | 'Jewel';
export type OriginLang = 'Arabic' |  'Tamil' | 'Breton' | 'Chinese' | 'Irish' | 'Hoosier' | 'Conlang' | 'Machine Generated';

export interface StarInfo {
	name: string;
	type: OriginType;
	lang: OriginLang;
	blurb: string;
}

export const SYSTEM_NAMES: string[] = [
	"'Anaqi", "'Uqdah", "'Aqiq",
"Akhir", "A'yn", "Athafi", "Alyah", "Akhbiyah", "Aqarib", "Ayilyam", "Asttam", "Ailm", "Añañuca", "Aušrinė", "Athshe", "Afank", "Atropia", "Almat", "Aghnam",
"Bayd", "Bari'", "Bie", "Barani", "Baradi", "Bidbid", "Bleiz", "Bandurah", "Blewit", "Beithe", "Bimac", "Bisclavret", "Baydaq", "Bokštas", "Bebras",
"Cong Guan", "Cittirai", "Corydon", "Cunot", "Coll", "Ceirt", "Ceibo", "Cleyre", "Coudre", "Cleveland",
"Dabaran", "Dhanab", "Dubb", "Dun Wan", "Dair", "Donovia", "Dobbrewa",
"Eadhadh", "Equitan", "Erminig", "Eog",
"Firk", "Fard", "Fakkah", "Furud", "Fakhidh", "Fu Yue", "Fei Yu", "Ferne", "Fresne", "Ferrer",
"Ghul", "Gumaysa", "Ghafar", "Geng He", "Gou Guo", "Gai Wu", "Guan", "Gevelled", "Gwezenn", "Glenn Ayr", "Greeb", "Gort", "Geadal", "Grybu", "Gorgas",
"Haddar", "Humam", "Haqa'ah", "He Gu", "Hai Shan", "Hirsh", "Hafawrang", "Harlaus", "Haqqar",
"Iodhadh", "Ifin", "Iseult", "Iklil",
"Jabbar", "Jabhah", "Jathi", "Jubhah", "Jiao Xiu", "Jin Xian", "Ji Shui", "Jun Jing", "Jūra", "Jayda",
"Kawkab", "Khaytan", "Kui Xiu", "Kongque", "Karthigai", "Kettai", "Koad", "Kurusan", "Kinoko", "Karaka", "Kärppä", "Kuthirai", "Kangar", "Kilangaan",
"Lang Jiang", "Ling Tai", "Lei Bi Zhen", "Li Gong", "Lourenn", "Layotto", "Luise", "LaQuinli", "Lanval", "Lalgudi", "Llyn Llyw", "Lašiša",
"Maysan", "Mi'sam", "Ma'z", "Mankib", "Mabsutah", "Mirugali", "Maghriz", "Minkhar", "Magam", "Maqbudah", "Maraq", "Muqadam", "Mulam", "Mao Xiu", "Maram", "Martolod", "Morchella", "Mervyn", "Muin", "Mishmish", "Magon", "Medis", "Miškas", "Manthiri",
"Najmah", "Natah", "Nasaqan", "Narakh", "Nan Men", "Nu Xiu", "Nan Chuan", "Naeretaer", "Nin", "Nelliyalam", "Nyumba",
"Oolitic", "Ohia", "Osisi", "Onn", "Okir", "Orghret",
"Ping", "Pi Li", "Punarpusam", "Puram", "Puratam", "Pomp Aer", "Pempont", "Pholiota", "Pallavaram", "Pernambut", "Padaiveeran", "Pezh", "Pirtuni",
"Qafzah", "Qaws", "Qayd", "Qurhah", "Qanturus", "Qalab", "Qi Guan", "Qaqim", "Quadinar",
"Risha", "Rijl", "Rogini", "Ravajul", "Russula", "Ruis",
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
	}
};


export const SPECIES_NAMES: string[] = [
		"Lizarb", "Slamand", "Gorbusian", "Blaarb", "Baboo",  "Eckon", "BigAlien"
];
