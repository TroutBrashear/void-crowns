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
	"Akhir", "A'yn", "Athafi", "Alyah", "Akhbiyah", "Aqarib", "Asvini", "Ayilyam", "Asttam", "Anusham", "Ailm", "Añañuca",
	"Bayd", "Bari'", "Bie", "Barani", "Baradi", "Bidbid", "Bleiz", "Bandurah", "Blewit", "Beithe", "Bimac",
	"Cong Guan", "Cittirai", "Corydon", "Cunot", "Coll", "Ceirt", "Ceibo", "Cleyre",
	"Dabaran", "Dhanab", "Dubb", "Dun Wan", "Dair",
	"Eadhadh",
	"Firk", "Fard", "Fakkah", "Farrud", "Fakhidh", "Fu Yue", "Fei Yu", "Ferne",
    "Ghul", "Gumaysa", "Ghafar", "Geng He", "Gou Guo", "Gai Wu", "Guan", "Gevelled", "Gwezenn", "Glenn Ayr", "Greeb", "Gort", "Geadal",
	"Haddar", "Humam", "Haqa'ah", "He Gu", "Hai Shan", "Hirsh", "Hafawrang", "Harlaus", "Haqqar",
	"Iodhadh", "Ifin",
	"Jabbar", "Jabhah", "Jathi", "Jubhah", "Jiao Xiu", "Jin Xian", "Ji Shui", "Jun Jing",
	"Kawkab", "Khaytan", "Kui Xiu", "Kongque", "Karthigai", "Kettai", "Koad", "Kurusan", "Kinoko", "Karaka",
	"Lang Jiang", "Ling Tai", "Lei Bi Zhen", "Li Gong", "Lourenn", "Layotto", "Luise", "LaQuinli",
	"Maysan", "Mi'sam", "Ma'z", "Mankib", "Mabsutah", "Mirugali", "Maghriz", "Minkhar", "Magam", "Maqbudah", "Maraq", "Muqadam", "Mulam", "Mao Xiu", "Maram", "Martolod", "Morchella", "Mervyn", "Muin", "Mishmish", "Magon",
	"Najmah", "Natah", "Nasaqan", "Narakh", "Nan Men", "Nu Xiu", "Nan Chuan", "Naeretaer", "Nin", "Noquisi",
	"Oolitic", "Ohia", "Osisi", "Onn",
	"Ping", "Pi Li", "Punarpusam", "Puram", "Puratam", "Pomp Aer", "Pempont", "Pholiota",
	"Qafzah", "Qaws", "Qayd", "Qurhah", "Qanturus", "Qalab", "Qi Guan",
	"Risha", "Rijl", "Rogini", "Ravajul", "Russula", "Ruis",
	"Sabiq", "Sayf", "Saq", "Shawlah", "Sharatan", "Surrat", "Samak", "Shang Wei", "Shang Cheng", "Shi Lou", "Si Fei", "Suvati", "Sadayam", "Satavis", "Shajarah", "Shu", "Saezhataer", "Shram", "Saffaras", "Summaq", "Saille", "Straif",
	"Ta'ir", "Tays", "Thu'ban", "Tarf", "Turafah", "Tuwayba'", "Tiruvadirai", "Thuraya", "Tian Quan", "Tu Si", "Teng She", "Tishtar", "Tanuwin", "Tinne",
	"Uttiram", "Uhelgoad", "Uath", "Uir", "Uilleann",
	"Visakam", "Vanand",
	"Waqi'", "Wazn", "Wardah", "Wegan",
	"Xuan Ge", "Xiang", "Xing Chen", "Xia Tai", "Xin Xiu", "Xi Zhong",
	"Yad", "Yaqut", "Yu Heng", "Ye Zhe", "You Geng", "Yeddo", "Yafin",
	"Zawiyah", "Zawraq", "Zubana", "Zao Fu", "Zhu Wang", "Zi Xiu", "Zimbrah"
];

export const SPECIES_NAMES: string[] = [
		"Lizarb", "Slamand", "Gorbusian", "Blaarb", "Baboo",  "Eckon", "BigAlien"
];
