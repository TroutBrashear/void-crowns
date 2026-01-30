//definitions for NameLists

export interface NameList {
  firstNames: string[];
  lastNames: string[];
  fleetNames: string[];
}

export const NAME_LISTS: Record<string, NameList> = {
	
	default: {
		firstNames: ['Dan', 'Maria', 'Horatio', 'Johnny', 'Clarissa'],
		lastNames: ['Smith', 'Baker', 'Ferrerrarri', 'Orono', 'Regist'],
		fleetNames: ['Task Force 2', 'Local Defense Fleet'],
	}
}









export const SYSTEM_NAMES: string[] = [
	"'Anaq", "'Uqdah", "'Awa", "'Aqiq",
	"Akhir", "A'yn", "Athafi", "Alyah", "Akhbiyah", "Aqarib",
	"Bayd", "Bari'",
	"Dabaran", "Dhanab", "Dubb",
	"Firk", "Fard", "Fakkah", "Farrud", "Fakhidh",
    "Ghul", "Gumaysa", "Ghafar",
	"Haddar", "Humam", "Haqa'ah",
	"Jabbar", "Jabhah", "Jathi", "Jubhah",
	"Kawkab", "Khaytan",
	"Maysan", "Mi'sam", "Ma'z", "Mankib", "Mabsutah", "Maghriz", "Minkhar", "Maqbudah", "Maraq", "Muqadam",
	"Najmah", "Natah", "Nasaqan", "Narakh",
	"Qafzah", "Qaws", "Qayd", "Qurhah", "Qanturus", "Qalab",
	"Risha", "Rijl",
	"Sabiq", "Sayf", "Saq", "Shawlah", "Sharatan", "Surrat", "Samak",
	"Ta'ir", "Tays", "Thu'ban", "Tarf", "Turafah", "Tuwayba'", "Thuraya",
	"Waqi'", "Wazn",
	"Yad", "Yaqut",
	"Zawiyah", "Zawraq", "Zubana"
];
