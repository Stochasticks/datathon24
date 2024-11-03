import json
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import yfinance as yf
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
    metric = request.args.get('metric')
    if ticker not in ticker_dict:
        return jsonify({"error": "Ticker not found"}), 404

    ticker_cik = ticker_dict[ticker]
    url = f"https://data.sec.gov/api/xbrl/companyconcept/CIK{ticker_cik}/us-gaap/{metric}.json"

    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        data = response.json()
        return jsonify(data)
    else:
        return jsonify({"error": f"Request failed with status code: {response.status_code}"}), response.status_code

@app.route('/api/balance_sheet', methods=['GET'])
def get_balance_sheet():
    # Get the stock symbol from query parameters
    stock_symbol = request.args.get('symbol')
    if not stock_symbol:
        return jsonify({"error": "No stock symbol provided"}), 400

    try:
        # Fetch the stock data
        print('symbol:', stock_symbol)
        stock = yf.Ticker(stock_symbol)
        print('stock: ', stock)
        
        # Get the balance sheet
        balance_sheet = stock.balance_sheet

        # print('balance_sheet: ', balance_sheet)
        
        # Reset the index to make it a column
        balance_sheet.reset_index(inplace=True)
        
        print("bb: ", balance_sheet)
        # Convert the DataFrame to a list of dictionaries
        balance_sheet_list = balance_sheet.to_dict(orient='records')

        # Prepare the response data structure
        response_data = {
            "columns": list(balance_sheet.columns),  # Columns for React table
            "data": balance_sheet_list  # Actual balance sheet data
        }

        print("response_data: ", response_data)

        # Convert response data to JSON string
        response_json = json.dumps(str(response_data).replace('Timestamp(', '').replace(')', ''))

        # Return the response
        return response_json, 200, {'Content-Type': 'application/json'}

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/income_statement', methods=['GET'])
def get_income_statement():
    # Get the stock symbol from query parameters
    stock_symbol = request.args.get('symbol')
    if not stock_symbol:
        return jsonify({"error": "No stock symbol provided"}), 400

    try:
        # Fetch the stock data
        print('symbol:', stock_symbol)
        stock = yf.Ticker(stock_symbol)
        print('stock: ', stock)
        
        # Get the income statement
        income_statement = stock.financials

        # Reset the index to make it a column
        income_statement.reset_index(inplace=True)
        
        print("income_statement: ", income_statement)
        
        # Convert the DataFrame to a list of dictionaries
        income_statement_list = income_statement.to_dict(orient='records')

        # Prepare the response data structure
        response_data = {
            "columns": list(income_statement.columns),  # Columns for React table
            "data": income_statement_list  # Actual income statement data
        }

        print("response_data: ", response_data)

        # Convert response data to JSON string
        response_json = json.dumps(str(response_data).replace('Timestamp(', '').replace(')', ''))

        # Return the response
        return response_json, 200, {'Content-Type': 'application/json'}

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/cash_flow_statement', methods=['GET'])
def get_cash_flow_statement():
    # Get the stock symbol from query parameters
    stock_symbol = request.args.get('symbol')
    if not stock_symbol:
        return jsonify({"error": "No stock symbol provided"}), 400

    try:
        # Fetch the stock data
        print('symbol:', stock_symbol)
        stock = yf.Ticker(stock_symbol)
        print('stock: ', stock)
        
        # Get the cash flow statement
        cash_flow_statement = stock.cashflow

        # Reset the index to make it a column
        cash_flow_statement.reset_index(inplace=True)
        
        print("cash_flow_statement: ", cash_flow_statement)
        
        # Convert the DataFrame to a list of dictionaries
        cash_flow_statement_list = cash_flow_statement.to_dict(orient='records')

        # Prepare the response data structure
        response_data = {
            "columns": list(cash_flow_statement.columns),  # Columns for React table
            "data": cash_flow_statement_list  # Actual cash flow statement data
        }

        print("response_data: ", response_data)

        # Convert response data to JSON string
        response_json = json.dumps(str(response_data).replace('Timestamp(', '').replace(')', ''))

        # Return the response
        return response_json, 200, {'Content-Type': 'application/json'}

    except Exception as e:
        return jsonify({"error": str(e)}), 500


load_ticker_dict()

if __name__ == '__main__':
    app.run(debug=True, port=9999)
