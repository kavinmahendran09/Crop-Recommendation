import random
import pandas as pd

# Define crops and their typical yield ranges (in quintals per hectare)
crops_data = {
    'Paddy (Common)': (20, 50),
    'Paddy (Grade A)': (25, 55),
    'Jowar (Hybrid)': (15, 40),
    'Maize': (30, 60),
    'Wheat': (25, 60),
    # Add remaining crops here
}

# Define month-season mapping
month_season = {
    'January': 'Winter', 'February': 'Winter', 'March': 'Spring',
    'April': 'Summer', 'May': 'Summer', 'June': 'Monsoon',
    'July': 'Monsoon', 'August': 'Monsoon', 'September': 'Autumn',
    'October': 'Autumn', 'November': 'Winter', 'December': 'Winter'
}

# Generate synthetic dataset
data = []
num_samples = 1000  # Desired number of samples

for _ in range(num_samples):
    crop = random.choice(list(crops_data.keys()))  # Randomly select a crop
    month = random.choice(list(month_season.keys()))  # Randomly select a month
    season = month_season[month]  # Get the corresponding season
    temp = random.uniform(10, 35)  # Adjust as per crop temperature needs
    humidity = random.uniform(50, 85)  # Typical humidity range
    precipitation = random.uniform(200, 1000) if season == 'Monsoon' else random.uniform(10, 200)
    yield_per_hectare = random.uniform(crops_data[crop][0], crops_data[crop][1])
    
    data.append([crop, month, season, temp, humidity, precipitation, yield_per_hectare])

# Create DataFrame
df = pd.DataFrame(data, columns=['Crop', 'Month', 'Season', 'Temperature', 'Humidity', 'Precipitation', 'Yield_per_Hectare'])

# Display the generated data
print(df.head())

# Save to CSV
df.to_csv('augmented_crop_data.csv', index=False)
