from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import requests
import yaml

app = Flask(__name__)
CORS(app)
API_KEY=None
with open("app.yaml", "r") as file:
    config = yaml.safe_load(file)
    API_KEY = config['env_variables']['TOMORROW_API_KEY']

@app.route("/")
def index():
    return send_file('index.html')

@app.route("/get-weather-details", methods=['GET'])
def get_weather_details():

    lat = request.args.get('lat')
    long = request.args.get('long')

    base_url = 'https://api.tomorrow.io/v4/timelines'
    fields = 'temperature,temperatureApparent,temperatureMin,temperatureMax,windSpeed,windDirection,humidity,pressureSeaLevel,uvIndex,weatherCode,precipitationProbability,precipitationType,sunriseTime,sunsetTime,visibility,moonPhase,cloudCover'
    units = 'imperial'
    timesteps = '1d'
    timezone = 'America/Los_Angeles'

    url = f'{base_url}?location={lat},{long}&fields={fields}&units={units}&timesteps={timesteps}&timezone={timezone}&apikey={API_KEY}'
    headers = {
                "accept": "application/json",
                "Accept-Encoding": "gzip"
            }

    response = requests.get(url, headers=headers, timeout=10)
    try:
        data = response.json()
        data = data['data']['timelines'][0]['intervals']
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@app.route("/get-weather-chart-details", methods=['GET'])
def get_weather_chart_details():
    lat = request.args.get('lat')
    long = request.args.get('long')
    startTime = request.args.get('startTime')
    # endTime = request.args.get('endTime')

    base_url = 'https://api.tomorrow.io/v4/timelines'
    fields = 'humidity,pressureSeaLevel,temperature,windSpeed,windDirection'
    units = 'imperial'
    timesteps = '1h'
    timezone = 'America/Los_Angeles'

    url = f'{base_url}?location={lat},{long}&fields={fields}&units={units}&timesteps={timesteps}&startTime={startTime}&timezone={timezone}&apikey={API_KEY}'
    headers = {
                "accept": "application/json",
                "Accept-Encoding": "gzip"
            }

    print('Hitting URL:', url)
    response = requests.get(url, headers=headers, timeout=10)
    try:
        data = response.json()
        data = data['data']['timelines'][0]['intervals']
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

if __name__=='__main__':
    app.run(debug=False)