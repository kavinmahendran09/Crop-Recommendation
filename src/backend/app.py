from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
from model import predict_best_crop
import requests
from babel.numbers import format_currency
import pandas as pd  # Import pandas for data manipulation

app = Flask(__name__)
CORS(app)

# Load model and encoders
model = joblib.load('src/backend/model.pkl')
label_enc_crop = joblib.load('src/backend/label_enc_crop.pkl')
label_enc_month = joblib.load('src/backend/label_enc_month.pkl')

# Load the dataset for comparison
df_seasonal = pd.read_csv('src/dataset/augmented_crop_data.csv')  # Ensure you have a CSV for crop data

def get_weather_data(api_key, city):
    base_url = "http://api.openweathermap.org/data/2.5/weather"
    params = {
        'q': city,
        'appid': api_key,
        'units': 'metric'  # Changed to metric for consistency
    }
    response = requests.get(base_url, params=params)
    weather_data = response.json()

    if response.status_code == 200:
        main = weather_data['main']
        return {
            'temp': main['temp'],
            'humidity': main['humidity'],
            'precip': weather_data.get('rain', {}).get('1h', 0)
        }
    else:
        print(f"Error: {weather_data['message']}")
        return None

@app.route('/predict-crop', methods=['POST'])
def predict_crop():
    data = request.json
    city = data['city']
    month = data['month']
    area = data['area']

    # Get weather data
    weather_api_key = "656df056e407fd93b840d048945a7bbf"
    weather_data = get_weather_data(weather_api_key, city)

    if weather_data:
        temp = weather_data['temp']
        humidity = weather_data['humidity']
        precip = weather_data['precip']

        # Fetch crop prices from the API
        msp_api_url = "https://api.data.gov.in/resource/1832c7b4-82ef-4734-b2b4-c2e3a38a28d3?api-key=579b464db66ec23bdd000001440aa332acc6499b45b3a17340d20fe5&format=json"
        response = requests.get(msp_api_url)
        price_data = response.json()

        # Build crop prices dictionary with "Commodity (Variety)" format as the key
        crop_prices = {
            f"{record['commodity']} ({record['variety']})": record.get('_2023_24', 'N/A')
            for record in price_data['records']
        }

        # Predict crop, yield per hectare, and revenue
        best_crop, best_yield_per_hectare, best_revenue = predict_best_crop(temp, humidity, precip, month, crop_prices)

        # Calculate total yield and revenue
        total_yield = best_yield_per_hectare * area
        total_revenue = best_revenue * area

        # Format yield and revenue
        formatted_yield = format_currency(best_yield_per_hectare, 'INR', locale='en_IN').replace('₹', '').strip()
        formatted_revenue = format_currency(total_revenue, 'INR', locale='en_IN').replace('₹', '').strip()

        # Access the price of the specific crop and variety
        price_per_quintal = crop_prices.get(best_crop, 'N/A')

        return jsonify({
            "best_crop": best_crop,
            "best_yield_per_hectare": formatted_yield,
            "price_per_quintal": price_per_quintal,
            "total_yield": total_yield,
            "total_revenue": formatted_revenue
        })
    else:
        return jsonify({"error": "Weather data not found"}), 404



if __name__ == '__main__':
    app.run(debug=True)
