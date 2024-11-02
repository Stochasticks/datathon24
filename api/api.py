from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests
from dotenv import load_dotenv

headers = {"User-Agent": "Benjamin Boucher(benjamin.boucher-charest@polymtl.ca)"}
ticker_dict = {}
load_dotenv()

app = Flask(__name__)
CORS(app)

def load_ticker_dict():
    url = "https://www.sec.gov/files/company_tickers.json"
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        try:
            json_response = response.json()
            global ticker_dict
            ticker_dict = {item['ticker']: str(item['cik_str']).zfill(10) for item in json_response.values()}
        except requests.exceptions.JSONDecodeError:
            print("Error: Response is not in JSON format.")
    else:
        print(f"Request failed with status code: {response.status_code}")

@app.route('/api/tickerinfo', methods=['GET'])
def ticker_info():
    ticker = request.args.get('ticker')
    if ticker not in ticker_dict:
        return jsonify({"error": "Ticker not found"}), 404
    
    ticker_CIK = ticker_dict[ticker]
    url = f"https://data.sec.gov/api/xbrl/companyconcept/CIK{ticker_CIK}/us-gaap/Assets.json"
    
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        data = response.json()
        return jsonify(data)
    else:
        return jsonify({"error": f"Request failed with status code: {response.status_code}"}), response.status_code

load_ticker_dict()

if __name__ == '__main__':
    app.run(debug=True, port=9999)
