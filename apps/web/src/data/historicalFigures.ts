export interface HistoricalFigure {
  name: string;
  period: string;
  achievement: string;
  lagna: string;
  dominantPlanet: string;
  notablePlacement: string;
  description: string;
}

export const HISTORICAL_FIGURES: HistoricalFigure[] = [
  {
    name: "Jawaharlal Nehru",
    period: "1889 - 1964",
    achievement: "First Prime Minister of India",
    lagna: "Cancer",
    dominantPlanet: "Moon",
    notablePlacement: "Moon in 1st House",
    description: "Known for his emotional intelligence and deep connection with the masses, a classic Cancer trait."
  },
  {
    name: "Abraham Lincoln",
    period: "1809 - 1865",
    achievement: "16th US President",
    lagna: "Aquarius",
    dominantPlanet: "Saturn",
    notablePlacement: "Saturn in 10th House",
    description: "His resilience and commitment to justice during the Civil War reflect the discipline of Saturn."
  },
  {
    name: "Albert Einstein",
    period: "1879 - 1955",
    achievement: "Theoretical Physicist",
    lagna: "Gemini",
    dominantPlanet: "Mercury",
    notablePlacement: "Mercury in 10th House",
    description: "The ultimate intellect, his work redefined physics through Gemini's analytical power."
  },
  {
    name: "Mahatma Gandhi",
    period: "1869 - 1948",
    achievement: "Leader of Indian Independence",
    lagna: "Libra",
    dominantPlanet: "Venus",
    notablePlacement: "Venus in 1st House",
    description: "His life was a pursuit of balance, harmony, and non-violence, the core of Libra."
  },
  {
    name: "Steve Jobs",
    period: "1955 - 2011",
    achievement: "Co-founder of Apple Inc.",
    lagna: "Leo",
    dominantPlanet: "Sun",
    notablePlacement: "Sun in 10th House",
    description: "A visionary leader with the charismatic authority and creative drive of a Leo Sun."
  },
  {
    name: "Marie Curie",
    period: "1867 - 1934",
    achievement: "Nobel Prize in Physics & Chemistry",
    lagna: "Scorpio",
    dominantPlanet: "Mars",
    notablePlacement: "Mars in 8th House",
    description: "Driven by intense Scorpio curiosity to uncover the secrets of radioactivity."
  },
  {
    name: "Nelson Mandela",
    period: "1918 - 2013",
    achievement: "President of South Africa",
    lagna: "Sagittarius",
    dominantPlanet: "Jupiter",
    notablePlacement: "Jupiter in 7th House",
    description: "A symbol of hope and justice, reflecting the expansive wisdom of Sagittarius."
  },
  {
    name: "Leonardo da Vinci",
    period: "1452 - 1519",
    achievement: "Renaissance Polymath",
    lagna: "Taurus",
    dominantPlanet: "Venus",
    notablePlacement: "Venus in 12th House",
    description: "His mastery of art and science was fueled by the aesthetic perfection of Taurus."
  },
  {
    name: "Winston Churchill",
    period: "1874 - 1965",
    achievement: "UK Prime Minister during WWII",
    lagna: "Virgo",
    dominantPlanet: "Mercury",
    notablePlacement: "Mercury in 3rd House",
    description: "His powerful oratory and tactical mind were driven by Virgo's attention to detail."
  },
  {
    name: "Martin Luther King Jr.",
    period: "1929 - 1968",
    achievement: "Civil Rights Leader",
    lagna: "Aries",
    dominantPlanet: "Mars",
    notablePlacement: "Mars in 2nd House",
    description: "His courageous voice for equality showcased the pioneering spirit of Aries."
  },
  {
    name: "Indira Gandhi",
    period: "1917 - 1984",
    achievement: "First Female PM of India",
    lagna: "Cancer",
    dominantPlanet: "Moon",
    notablePlacement: "Saturn in 1st House",
    description: "A powerful leader who balanced emotional depth with iron-willed governance."
  },
  {
    name: "Sri Aurobindo",
    period: "1872 - 1950",
    achievement: "Yogi and Philosopher",
    lagna: "Cancer",
    dominantPlanet: "Jupiter",
    notablePlacement: "Jupiter in 1st House",
    description: "His spiritual evolution and profound philosophy reflected the exaltation of Jupiter."
  },
  {
    name: "William Shakespeare",
    period: "1564 - 1616",
    achievement: "Playwright and Poet",
    lagna: "Taurus",
    dominantPlanet: "Venus",
    notablePlacement: "Moon in 5th House",
    description: "The master of human emotion and aesthetic language, a true Venusian soul."
  },
  {
    name: "Benjamin Franklin",
    period: "1706 - 1790",
    achievement: "Founding Father of the US",
    lagna: "Pisces",
    dominantPlanet: "Jupiter",
    notablePlacement: "Jupiter in 11th House",
    description: "An inventor and diplomat who embodied the fluid wisdom and connectivity of Pisces."
  },
  {
    name: "Rabindranath Tagore",
    period: "1861 - 1941",
    achievement: "Poet and Nobel Laureate",
    lagna: "Pisces",
    dominantPlanet: "Jupiter",
    notablePlacement: "Moon in 1st House",
    description: "His poetic vision and universalism were hallmarks of the Piscean spirit."
  },
  {
    name: "George Washington",
    period: "1732 - 1799",
    achievement: "1st US President",
    lagna: "Capricorn",
    dominantPlanet: "Saturn",
    notablePlacement: "Saturn in 10th House",
    description: "His steadfast leadership and sense of duty define the Capricornian archetype."
  },
  {
    name: "Nikola Tesla",
    period: "1856 - 1943",
    achievement: "Inventor and Engineer",
    lagna: "Aries",
    dominantPlanet: "Mars",
    notablePlacement: "Mars in 6th House",
    description: "A pioneer of electricity whose intense focus and innovation were driven by Aries."
  },
  {
    name: "Srinivasa Ramanujan",
    period: "1887 - 1920",
    achievement: "Mathematician",
    lagna: "Capricorn",
    dominantPlanet: "Saturn",
    notablePlacement: "Jupiter in 9th House",
    description: "His intuitive grasp of complex mathematics reflected a divine Piscean influence on Capricorn structure."
  },
  {
    name: "Mother Teresa",
    period: "1910 - 1997",
    achievement: "Humanitarian",
    lagna: "Sagittarius",
    dominantPlanet: "Jupiter",
    notablePlacement: "Moon in 4th House",
    description: "Her life of service and compassion was a manifestation of Jupiterian benevolence."
  },
  {
    name: "Vikram Sarabhai",
    period: "1919 - 1971",
    achievement: "Father of Indian Space Program",
    lagna: "Gemini",
    dominantPlanet: "Mercury",
    notablePlacement: "Mercury in 1st House",
    description: "A visionary scientist whose communicative leadership launched India into space."
  },
  {
    name: "Subhash Chandra Bose",
    period: "1897 - 1945",
    achievement: "Freedom Fighter",
    lagna: "Aries",
    dominantPlanet: "Mars",
    notablePlacement: "Mars in 1st House",
    description: "His militant approach to independence was the pure expression of Martian courage."
  },
  {
    name: "Amelia Earhart",
    period: "1897 - 1937",
    achievement: "Aviation Pioneer",
    lagna: "Gemini",
    dominantPlanet: "Mercury",
    notablePlacement: "Mercury in 2nd House",
    description: "A daring explorer whose love for movement and communication defined her Gemini soul."
  },
  {
    name: "Thomas Edison",
    period: "1847 - 1931",
    achievement: "Inventor",
    lagna: "Scorpio",
    dominantPlanet: "Mars",
    notablePlacement: "Mars in 10th House",
    description: "His relentless experimentation and transformative inventions were Scorpio-driven."
  }
];
