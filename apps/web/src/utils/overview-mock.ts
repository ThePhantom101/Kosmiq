import type { ChartOverviewData } from "@/types/overview";

export const mockOverviewData: ChartOverviewData = {
  hero: {
    name: "Arjun Sharma",
    dateOfBirth: "1995-03-14",
    timeOfBirth: "06:42 AM",
    placeOfBirth: "New Delhi, India",
    lagna: "Aquarius",
    lagnaLord: "Saturn",
    moonSign: "Scorpio",
    moonNakshatra: "Anuradha",
    sunSign: "Pisces",
    ascendantDegree: 14.7,
  },
  metrics: {
    strongestPlanet: {
      planet: "Jupiter",
      sanskritName: "Guru",
      score: 89,
      dignity: "Exalted",
      house: 3,
    },
    weakestPlanet: {
      planet: "Sun",
      sanskritName: "Surya",
      score: 22,
      dignity: "Enemy",
      house: 12,
    },
    bestHouse: {
      house: 5,
      label: "Intelligence & Creativity",
      score: 82,
      planets: ["Mercury", "Venus"],
    },
    currentDasha: {
      mahadasha: "Jupiter",
      mahadashaSanskrit: "Guru Mahadasha",
      antardasha: "Saturn",
      antardashaSanskrit: "Shani Antardasha",
      endsAt: "2027-08-11",
      percentComplete: 63,
    },
    astroScore: 74,
    yogaSummary: {
      count: 7,
      active: ["Hamsa Yoga", "Gaja Kesari Yoga", "Saraswati Yoga"],
      dormant: ["Neecha Bhanga Raja Yoga", "Dhana Yoga", "Viparita Raja Yoga", "Budha-Aditya Yoga"],
    },
  },
  lifeGlance: {
    health: 68,
    wealth: 77,
    relationships: 55,
    career: 82,
    creativity: 85,
    spirituality: 91,
  },
  alerts: [
    {
      type: "Sade Sati",
      severity: "warning",
      title: "Sade Sati — Mid Phase",
      description: "Saturn transiting your natal Moon sign (Scorpio). Discipline and perseverance will yield rewards.",
      activeUntil: "2025-11-18",
    },
    {
      type: "Period Change",
      severity: "info",
      title: "Dasha Period Change",
      description: "Jupiter–Saturn period ends in 14 months. Jupiter–Mercury begins Aug 2027.",
    },
    {
      type: "Favorable Transit",
      severity: "success",
      title: "Benefic Jupiter Transit",
      description: "Jupiter transiting your 5th house activates creativity and gains from speculation.",
    },
  ],
};
