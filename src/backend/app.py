from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
import joblib
from model import predict_best_crop
import requests

app = Flask(__name__)
CORS(app)  # Enable CORS for the entire app

# Load model and encoders
model = joblib.load('src/backend/model.pkl')
label_enc_crop = joblib.load('src/backend/label_enc_crop.pkl')
label_enc_month = joblib.load('src/backend/label_enc_month.pkl')

def get_weather_data(api_key, city):
    base_url = "http://api.openweathermap.org/data/2.5/weather"
    params = {
        'q': city,
        'appid': api_key,
        'units': 'imperial'
    }
    response = requests.get(base_url, params=params)
    weather_data = response.json()

    if response.status_code == 200:
        main = weather_data['main']
        wind = weather_data['wind']
        return {
            'temp': main['temp'],
            'tempmax': main['temp_max'],
            'tempmin': main['temp_min'],
            'feelslike': main['feels_like'],
            'humidity': main['humidity'],
            'precip': weather_data.get('rain', {}).get('1h', 0),
            'windspeed': wind['speed']
        }
    else:
        print(f"Error: {weather_data['message']}")
        return None

@app.route('/predict-crop', methods=['POST'])
def predict_crop():
    data = request.json
    city = data['city']
    month = data['month']

    # Call weather API
    weather_api_key = "656df056e407fd93b840d048945a7bbf"
    weather_data = get_weather_data(weather_api_key, city)

    if weather_data:
        temp = weather_data['temp']
        humidity = weather_data['humidity']
        precip = weather_data['precip']

        # Call model prediction
        best_crop, best_yield = predict_best_crop(temp, humidity, precip, month)

        # Call government API for crop price per quintal
        msp_api_url = "https://api.data.gov.in/resource/1832c7b4-82ef-4734-b2b4-c2e3a38a28d3?api-key=579b464db66ec23bdd000001440aa332acc6499b45b3a17340d20fe5&format=json"
        response = requests.get(msp_api_url)
        price_data = response.json()
        price_record = next((record for record in price_data['records'] if record['commodity'] == best_crop), None)

        if price_record:
            price_per_quintal = price_record['_2023_24']
            total_revenue = best_yield * price_per_quintal
            return jsonify({
                "best_crop": best_crop,
                "best_yield": best_yield,
                "price_per_quintal": price_per_quintal,
                "total_revenue": total_revenue
            })
        else:
            return jsonify({"error": "Price data not found for the predicted crop"}), 404
    else:
        return jsonify({"error": "Weather data not found"}), 404

if __name__ == '__main__':
    app.run(debug=True)
