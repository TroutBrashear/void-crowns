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



export const SYSTEM_NAMES: string[] = [
	"'Anaq", "'Uqdah", "'Awa", "'Aqiq",
	"Akhir", "A'yn", "Athafi", "Alyah", "Akhbiyah", "Aqarib", "Ayilyam", "Asttam", "Ailm", "Añañuca", "Aušrinė", "Athshe",
	"Bayd", "Bari'", "Bie", "Barani", "Baradi", "Bidbid", "Bleiz", "Bandurah", "Blewit", "Beithe", "Bimac", "Bisclavret",
	"Cong Guan", "Cittirai", "Corydon", "Cunot", "Coll", "Ceirt", "Ceibo", "Cleyre", "Coudre",
	"Dabaran", "Dhanab", "Dubb", "Dun Wan", "Dair",
	"Eadhadh", "Equitan", "Erminig",
	"Firk", "Fard", "Fakkah", "Furud", "Fakhidh", "Fu Yue", "Fei Yu", "Ferne", "Fresne",
    "Ghul", "Gumaysa", "Ghafar", "Geng He", "Gou Guo", "Gai Wu", "Guan", "Gevelled", "Gwezenn", "Glenn Ayr", "Greeb", "Gort", "Geadal", "Grybu",
	"Haddar", "Humam", "Haqa'ah", "He Gu", "Hai Shan", "Hirsh", "Hafawrang", "Harlaus", "Haqqar",
	"Iodhadh", "Ifin", "Iseult", "Iklil",
	"Jabbar", "Jabhah", "Jathi", "Jubhah", "Jiao Xiu", "Jin Xian", "Ji Shui", "Jun Jing", "Jūra",
	"Kawkab", "Khaytan", "Kui Xiu", "Kongque", "Karthigai", "Kettai", "Koad", "Kurusan", "Kinoko", "Karaka", "Kärppä",
	"Lang Jiang", "Ling Tai", "Lei Bi Zhen", "Li Gong", "Lourenn", "Layotto", "Luise", "LaQuinli", "Lanval",
	"Maysan", "Mi'sam", "Ma'z", "Mankib", "Mabsutah", "Mirugali", "Maghriz", "Minkhar", "Magam", "Maqbudah", "Maraq", "Muqadam", "Mulam", "Mao Xiu", "Maram", "Martolod", "Morchella", "Mervyn", "Muin", "Mishmish", "Magon", "Medis", "Miškas",
	"Najmah", "Natah", "Nasaqan", "Narakh", "Nan Men", "Nu Xiu", "Nan Chuan", "Naeretaer", "Nin",
	"Oolitic", "Ohia", "Osisi", "Onn",
	"Ping", "Pi Li", "Punarpusam", "Puram", "Puratam", "Pomp Aer", "Pempont", "Pholiota",
	"Qafzah", "Qaws", "Qayd", "Qurhah", "Qanturus", "Qalab", "Qi Guan", "Qaqim",
	"Risha", "Rijl", "Rogini", "Ravajul", "Russula", "Ruis",
	"Sabiq", "Sayf", "Saq", "Shawlah", "Sharatan", "Surrat", "Samak", "Shang Wei", "Shang Cheng", "Shi Lou", "Si Fei", "Suvati", "Sadayam", "Satavis", "Shajarah", "Shu", "Saezhataer", "Shram", "Saffaras", "Summaq", "Saille", "Straif", "Shapash",
	"Ta'ir", "Tays", "Thu'ban", "Tarf", "Turafah", "Tuwayba'", "Tiruvadirai", "Thuraya", "Tian Quan", "Tu Si", "Teng She", "Tanuwin", "Tinne",
	"Uttiram", "Uhelgoad", "Uath", "Uir", "Uilleann",
	"Vakarinė",
	"Waqi'", "Wazn", "Wardah", "Wegan",
	"Xuan Ge", "Xiang", "Xing Chen", "Xia Tai", "Xin Xiu", "Xi Zhong",
	"Yad", "Yaqut", "Yu Heng", "Ye Zhe", "You Geng", "Yeddo", "Yafin", "Yanqul", "Yumen",
	"Zawiyah", "Zawraq", "Zubana", "Zao Fu", "Zhu Wang", "Zi Xiu", "Zimbrah"
];

export const SPECIES_NAMES: string[] = [
		"Lizarb", "Slamand", "Gorbusian", "Blaarb", "Baboo",  "Eckon", "BigAlien"
];
