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
	"Akhir", "A'yn", "Athafi", "Alyah", "Akhbiyah", "Aqarib", "Asvini", "Ayilyam", "Asttam", "Anusham",
	"Bayd", "Bari'", "Bie", "Barani", "Baradi", "Bidbid", "Bleiz", "Bandurah", "Blewit",
	"Cong Guan", "Cittirai", "Corydon", "Cunot",
	"Dabaran", "Dhanab", "Dubb", "Dun Wan",
	"Firk", "Fard", "Fakkah", "Farrud", "Fakhidh", "Fu Yue", "Fei Yu",
    "Ghul", "Gumaysa", "Ghafar", "Geng He", "Gou Guo", "Gai Wu", "Guan", "Gevelled", "Gwezenn", "Glenn Ayr", "Greeb",
	"Haddar", "Humam", "Haqa'ah", "He Gu", "Hai Shan", "Hirsh", "Hafawrang", "Harlaus",
	"Jabbar", "Jabhah", "Jathi", "Jubhah", "Jiao Xiu", "Jin Xian", "Ji Shui", "Jun Jing",
	"Kawkab", "Khaytan", "Kui Xiu", "Kongque", "Karthigai", "Kettai", "Koad", "Kurusan", "Kinoko",
	"Lang Jiang", "Ling Tai", "Lei Bi Zhen", "Li Gong", "Lourenn", "Layotto",
	"Maysan", "Mi'sam", "Ma'z", "Mankib", "Mabsutah", "Mirugali", "Maghriz", "Minkhar", "Magam", "Maqbudah", "Maraq", "Muqadam", "Mulam", "Mao Xiu", "Maram", "Martolod", "Morchella", "Mervyn",
	"Najmah", "Natah", "Nasaqan", "Narakh", "Nan Men", "Nu Xiu", "Nan Chuan", "Naeretaer",
	"Oolitic", "Ohia", "Osisi",
	"Ping", "Pi Li", "Punarpusam", "Puram", "Puratam", "Pomp Aer", "Pempont",
	"Qafzah", "Qaws", "Qayd", "Qurhah", "Qanturus", "Qalab", "Qi Guan",
	"Risha", "Rijl", "Rogini", "Revati", "Ravajul", "Russula",
	"Sabiq", "Sayf", "Saq", "Shawlah", "Sharatan", "Surrat", "Samak", "Shang Wei", "Shang Cheng", "Shi Lou", "Si Fei", "Suvati", "Sadayam", "Satavis", "Shajarah", "Shu", "Saezhataer", "Shram", "Saffaras", "Summaq", "Sidrah",
	"Ta'ir", "Tays", "Thu'ban", "Tarf", "Turafah", "Tuwayba'", "Tiruvadirai", "Thuraya", "Tian Quan", "Tiruvonam", "Tu Si", "Teng She", "Tishtar", "Tanuwin",
	"Uttiram", "Uhelgoad",
	"Visakam", "Vanand",
	"Waqi'", "Wazn", "Wardah", "Wegan",
	"Xuan Ge", "Xiang", "Xing Chen", "Xia Tai", "Xin Xiu", "Xi Zhong",
	"Yad", "Yaqut", "Yu Heng", "Ye Zhe", "You Geng", "Yeddo", "Yafin",
	"Zawiyah", "Zawraq", "Zubana", "Zao Fu", "Zhu Wang", "Zi Xiu"
];

export const SPECIES_NAMES: string[] = [
		"Lizarb", "Slamand", "Gorbusian", "Blaarb", "Baboo",  "Eckon", "BigAlien"
];
