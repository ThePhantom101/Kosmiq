import swisseph as swe
from engine.calculator import calculate_horoscope

def test_calculation():
    # Test with a known date/time/location
    # Example: 1990-01-01 12:00:00 UTC, 0N, 0E
    try:
        data = calculate_horoscope(1990, 1, 1, 12, 0, 0, 0, 0)
        print("Success!")
        print(f"Ascendant: {data['ascendant']}")
        for p, pos in data['planets'].items():
            print(f"{p}: {pos['longitude']}")
    except Exception as e:
        print(f"Failed: {e}")

if __name__ == "__main__":
    test_calculation()
