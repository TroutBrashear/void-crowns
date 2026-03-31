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
	"Akhir", "A'yn", "Athafi", "Alyah", "Akhbiyah", "Aqarib",
	"Bayd", "Bari'", "Bie",
	"Cong Guan",
	"Dabaran", "Dhanab", "Dubb", "Dun Wan",
	"Firk", "Fard", "Fakkah", "Farrud", "Fakhidh", "Fu Yue", "Fei Yu",
    "Ghul", "Gumaysa", "Ghafar", "Geng He", "Gou Guo", "Gai Wu", "Guan",
	"Haddar", "Humam", "Haqa'ah", "He Gu", "Hai Shan",
	"Jabbar", "Jabhah", "Jathi", "Jubhah", "Jiao Xiu", "Jin Xian", "Ji Shui", "Jun Jing",
	"Kawkab", "Khaytan", "Kui Xiu", "Kongque",
	"Lang Jiang", "Ling Tai", "Lei Bi Zhen", "Li Gong",
	"Maysan", "Mi'sam", "Ma'z", "Mankib", "Mabsutah", "Maghriz", "Minkhar", "Maqbudah", "Maraq", "Muqadam", "Mao Xiu",
	"Najmah", "Natah", "Nasaqan", "Narakh", "Nan Men", "Nu Xiu", "Nan Chuan",
	"Ping", "Pi Li",
	"Qafzah", "Qaws", "Qayd", "Qurhah", "Qanturus", "Qalab", "Qi Guan",
	"Risha", "Rijl",
	"Sabiq", "Sayf", "Saq", "Shawlah", "Sharatan", "Surrat", "Samak", "Shang Wei", "Shang Cheng", "Shi Lou", "Si Fei",
	"Ta'ir", "Tays", "Thu'ban", "Tarf", "Turafah", "Tuwayba'", "Thuraya", "Tian Quan", "Tu Si", "Teng She",
	"Waqi'", "Wazn",
	"Xuan Ge", "Xiang", "Xing Chen", "Xia Tai", "Xin Xiu", "Xi Zhong",
	"Yad", "Yaqut", "Yu Heng", "Ye Zhe", "You Geng",
	"Zawiyah", "Zawraq", "Zubana", "Zao Fu", "Zhu Wang", "Zi Xiu"
];
