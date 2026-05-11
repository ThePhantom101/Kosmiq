export type ActivityType = 
  | "Marriage" 
  | "Travel" 
  | "Business" 
  | "Medical" 
  | "Property" 
  | "Education" 
  | "New venture" 
  | "Meeting";

export interface MuhurtaRule {
  favorableTithis?: number[];
  favorableNakshatras?: string[];
  avoidKaranas?: string[];
  favorableVara?: string[];
  description: string;
}

export const MUHURTA_RULES: Record<ActivityType, MuhurtaRule> = {
  Marriage: {
    favorableTithis: [2, 3, 5, 7, 10, 11, 13],
    favorableNakshatras: ["Rohini", "Mrigashira", "Magha", "Uttara Phalguni", "Hasta", "Swati", "Anuradha", "Uttarashadha", "Uttarabhadra", "Revati"],
    description: "Requires strong lunar connection and stable asterisms for long-term harmony."
  },
  Travel: {
    favorableNakshatras: ["Ashwini", "Mrigashira", "Pushya", "Hasta", "Anuradha", "Shravana", "Revati"],
    avoidKaranas: ["Vishti"], // Bhadra
    description: "Favor light and fast Nakshatras. Avoid Bhadra periods for safety and smooth transit."
  },
  Business: {
    favorableTithis: [2, 3, 5, 7, 10, 11, 13],
    favorableVara: ["Wednesday", "Thursday", "Friday"],
    description: "Mercury and Jupiter influences are vital for commercial success and expansion."
  },
  Medical: {
    favorableNakshatras: ["Ashwini", "Mrigashira", "Anuradha", "Shravana", "Dhanishta", "Shatabhisha"],
    favorableTithis: [2, 3, 5, 7, 10, 11, 13],
    description: "Focus on healing Nakshatras and strong lunar vitality for recovery."
  },
  Property: {
    favorableVara: ["Thursday", "Friday"],
    favorableNakshatras: ["Mrigashira", "Chitra", "Anuradha", "Revati"],
    description: "Jupiter and Venus support stable investments and beautiful dwellings."
  },
  Education: {
    favorableVara: ["Wednesday", "Thursday"],
    favorableNakshatras: ["Pushya", "Hasta", "Swati", "Anuradha", "Shravana"],
    description: "Mercury's intellect and Jupiter's wisdom are paramount for academic beginnings."
  },
  "New venture": {
    favorableTithis: [1, 2, 3, 5, 10, 11],
    favorableNakshatras: ["Ashwini", "Rohini", "Pushya", "Uttara Phalguni", "Hasta", "Chitra", "Uttarashadha", "Uttarabhadra"],
    description: "Requires pioneering energy and stable foundations for growth."
  },
  Meeting: {
    favorableVara: ["Monday", "Wednesday", "Thursday", "Friday"],
    description: "Favor days with strong communicative and beneficial energies."
  }
};
