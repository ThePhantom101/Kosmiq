# Astrological Constants and Data Tables

PLANETS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"]
ALL_PLANETS = PLANETS + ["Rahu", "Ketu"]

SIGNS = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
]

# Sign Lordships (Traditional)
SIGN_LORDS = {
    0: "Mars", 1: "Venus", 2: "Mercury", 3: "Moon",
    4: "Sun", 5: "Mercury", 6: "Venus", 7: "Mars",
    8: "Jupiter", 9: "Saturn", 10: "Saturn", 11: "Jupiter"
}

# Exaltation (Uchcha) Points and Signs
# (Planet: (SignIndex, DeepExaltationDegree))
EXALTATION = {
    "Sun": (0, 10),
    "Moon": (1, 3),
    "Mars": (9, 28),
    "Mercury": (5, 15),
    "Jupiter": (3, 5),
    "Venus": (11, 27),
    "Saturn": (6, 20)
}

# Moolatrikona Signs and Ranges
# (Planet: (SignIndex, StartDeg, EndDeg))
MOOLATRIKONA = {
    "Sun": (4, 0, 20),
    "Moon": (1, 3, 30),
    "Mars": (0, 0, 12),
    "Mercury": (5, 15, 20),
    "Jupiter": (8, 0, 10),
    "Venus": (6, 0, 15),
    "Saturn": (10, 0, 20)
}

# Natural Relationships (Naisargika Graha Maitri)
# 1: Friend, 0: Neutral, -1: Enemy
NATURAL_RELATIONSHIPS = {
    "Sun": {"Moon": 1, "Mars": 1, "Mercury": 0, "Jupiter": 1, "Venus": -1, "Saturn": -1},
    "Moon": {"Sun": 1, "Mars": 0, "Mercury": 1, "Jupiter": 0, "Venus": 0, "Saturn": 0},
    "Mars": {"Sun": 1, "Moon": 1, "Mercury": -1, "Jupiter": 1, "Venus": 0, "Saturn": 0},
    "Mercury": {"Sun": 1, "Moon": -1, "Mars": 0, "Jupiter": 0, "Venus": 1, "Saturn": 0},
    "Jupiter": {"Sun": 1, "Moon": 1, "Mars": 1, "Mercury": -1, "Venus": -1, "Saturn": 0},
    "Venus": {"Sun": -1, "Moon": -1, "Mars": 0, "Mercury": 1, "Jupiter": 0, "Saturn": 1},
    "Saturn": {"Sun": -1, "Moon": -1, "Mars": -1, "Mercury": 1, "Jupiter": 0, "Venus": 1}
}

# Shadbala Requirement (Standard Virupas)
SHADBALA_MINIMUMS = {
    "Sun": 300,
    "Moon": 360,
    "Mars": 300,
    "Mercury": 420,
    "Jupiter": 390,
    "Venus": 330,
    "Saturn": 300
}

# Naisargika Bala (Natural Strength) in Virupas
NAISARGIKA_BALA = {
    "Sun": 60,
    "Moon": 51.43,
    "Venus": 42.86,
    "Jupiter": 34.29,
    "Mercury": 25.71,
    "Mars": 17.14,
    "Saturn": 8.57
}
