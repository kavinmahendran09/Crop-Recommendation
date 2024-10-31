import random
import pandas as pd

# Define crops and their average yield ranges (in quintals per hectare)
crops_data = {
    'Paddy (Common)': (20, 30),
    'Paddy (Grade A)': (25, 35),
    'Jowar (Hybrid)': (15, 25),
    'Maize': (30, 40),
    'Wheat': (25, 35),
    'Ragi': (20, 30),
    'Tur (Arhar)': (15, 25),
    'Moong': (10, 20),
    'Urad': (10, 20),
    'Groundnut': (15, 30),
    'Cotton (Medium Staple)': (20, 30),
    'Cotton (Long Staple)': (20, 30),
    'Gram': (15, 25),
    'Barley': (20, 35),
}

# Define month-season mapping
month_season = {
    'January': 'Winter', 'February': 'Winter', 'March': 'Spring',
    'April': 'Summer', 'May': 'Summer', 'June': 'Monsoon',
    'July': 'Monsoon', 'August': 'Monsoon', 'September': 'Autumn',
    'October': 'Autumn', 'November': 'Winter', 'December': 'Winter'
}

# Define crop-season suitability
crop_season_mapping = {
    'Paddy (Common)': ['Monsoon'],
    'Paddy (Grade A)': ['Monsoon'],
    'Jowar (Hybrid)': ['Monsoon', 'Autumn'],
    'Maize': ['Summer', 'Monsoon'],
    'Wheat': ['Winter', 'Spring'],
    'Ragi': ['Summer', 'Monsoon'],
    'Tur (Arhar)': ['Summer', 'Monsoon'],
    'Moong': ['Summer', 'Monsoon'],
    'Urad': ['Summer', 'Monsoon'],
    'Groundnut': ['Summer'],
    'Cotton (Medium Staple)': ['Summer'],
    'Cotton (Long Staple)': ['Summer'],
    'Gram': ['Winter', 'Spring'],
    'Barley': ['Winter', 'Spring'],
}

# Generate synthetic dataset
data = []
num_samples = 1000  # Desired number of samples

for _ in range(num_samples):
    month = random.choice(list(month_season.keys()))  # Randomly select a month
    season = month_season[month]  # Get the corresponding season

    # Filter crops based on the selected season
    suitable_crops = [crop for crop, seasons in crop_season_mapping.items() if season in seasons]
    crop = random.choice(suitable_crops)  # Randomly select a suitable crop

    temp = random.uniform(10, 35)  # Adjust as per crop temperature needs
    humidity = random.uniform(50, 85)  # Typical humidity range
    precipitation = random.uniform(200, 1000) if season == 'Monsoon' else random.uniform(10, 200)

    # Generate yield_per_hectare based on average ranges
    yield_per_hectare = random.uniform(crops_data[crop][0], crops_data[crop][1])

    data.append([crop, month, season, temp, humidity, precipitation, yield_per_hectare])

# Create DataFrame
df = pd.DataFrame(data, columns=['Crop', 'Month', 'Season', 'Temperature', 'Humidity', 'Precipitation', 'Yield_per_Hectare'])

# Display the generated data
print(df.head())

# Save to CSV
df.to_csv('augmented_crop_data_new.csv', index=False)
