import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestRegressor
import joblib
import datetime
import os

df = pd.read_csv(os.path.join('src', 'dataset', 'augmented_crop_data.csv'))

current_month = datetime.datetime.now().strftime("%B")
month_season = {
    'January': 'Winter', 'February': 'Winter', 'March': 'Spring',
    'April': 'Summer', 'May': 'Summer', 'June': 'Monsoon',
    'July': 'Monsoon', 'August': 'Monsoon', 'September': 'Autumn',
    'October': 'Autumn', 'November': 'Winter', 'December': 'Winter'
}
current_season = month_season[current_month]
df_seasonal = df[df['Season'] == current_season]

label_enc_crop = LabelEncoder()
df_seasonal.loc[:, 'Crop'] = label_enc_crop.fit_transform(df_seasonal['Crop'])
label_enc_month = LabelEncoder()
df_seasonal.loc[:, 'Month'] = label_enc_month.fit_transform(df_seasonal['Month'])


X = df_seasonal[['Crop', 'Month', 'Temperature', 'Humidity', 'Precipitation']]
y = df_seasonal['Yield_per_Hectare']


X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)


model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

os.makedirs('src/backend', exist_ok=True)


joblib.dump(model, os.path.join('src', 'backend', 'model.pkl'))
joblib.dump(label_enc_crop, os.path.join('src', 'backend', 'label_enc_crop.pkl'))
joblib.dump(label_enc_month, os.path.join('src', 'backend', 'label_enc_month.pkl'))


def predict_best_crop(temp: float, humidity: float, precipitation: float, month: str, crop_prices: dict) -> tuple:
    month_encoded = label_enc_month.transform([month])[0]
    crops_yield = {}

    for crop in label_enc_crop.classes_:
        crop_encoded = label_enc_crop.transform([crop])[0]
        X_input = pd.DataFrame([[crop_encoded, month_encoded, temp, humidity, precipitation]], 
                                columns=['Crop', 'Month', 'Temperature', 'Humidity', 'Precipitation'])
        yield_prediction = model.predict(X_input)[0]
        crops_yield[crop] = yield_prediction

    best_crop = max(crops_yield, key=crops_yield.get)
    best_yield = crops_yield[best_crop]
    best_price = crop_prices.get(best_crop, 0) 
    best_revenue = best_yield * best_price  
    return best_crop, best_yield, best_revenue
