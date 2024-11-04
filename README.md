### The application is available at this link without any building : 
### [Click here to use the hosted application](https://main.dmfjhi35mqoi1.amplifyapp.com/)

# Project Setup

This project consists of three separate repositories: 

1. **Frontend**: A React app
2. **API Backend**: A Flask app for financial endpoints
3. **Secondary API Backend**: An AWS Chalice app for OpenTicks chatbot

Follow the instructions below to start each repository.

---

## 1. Frontend (React App)

### Prerequisites

- Node.js (version 14.x or above)
- npm (version 6.x or above)

### Installation

1. Clone the repository and navigate to the frontend directory:

   ```bash
   git clone <frontend-repo-url>
   cd frontend
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

### Scripts

The following npm scripts are available:

- **Build Production**: Builds the app for production and copies `public` assets to the `dist` directory.
  
  ```bash
  npm run build
  ```

- **Build Development**: Builds the app in development mode.

  ```bash
  npm run build:dev
  ```

- **Serve Production**: Serves the production build from the `dist` directory at `localhost:3000`.

  ```bash
  npm run build:start
  ```

- **Start Production**: Starts the app in production mode with Webpack.

  ```bash
  npm run start
  ```

- **Start Development**: Starts the app in development mode with live-reload.

  ```bash
  npm run start:dev
  ```

- **Start with Hot Reload**: Starts the app in development mode with hot-reload enabled.

  ```bash
  npm run start:live
  ```

---

# APIs
## Stochasticks API

This repository contains two main components for OpenTicks, a financial analysis and chatbot platform:

1. **Flask API**: Provides various financial data endpoints, such as balance sheets, income statements, and sector comparisons.
2. **Chalice API**: Enables a chatbot interface for interacting with financial documents and data through an AI-powered question-answering service.

## Installation

### Prerequisites

- Python 3.8 or higher
- `pip` package manager
- Required dependencies listed in `requirements.txt`

### Environment Setup

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/openticks.git
   cd openticks
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```


## Flask API Endpoints

The Flask API provides endpoints to fetch financial data for specified stock symbols. Each endpoint returns structured data for easy integration with front-end applications.

### Running the Flask Server

Start the Flask server:
```bash
python app.py
```

### Endpoints

1. **Ticker Information**
   - **URL**: `/api/tickerinfo`
   - **Method**: GET
   - **Parameters**:
     - `ticker`: Stock symbol (e.g., `AAPL`)
     - `metric`: Financial metric (e.g., `Revenue`)
   - **Description**: Fetches financial metrics for the specified ticker symbol.

2. **Balance Sheet**
   - **URL**: `/api/balance_sheet`
   - **Method**: GET
   - **Parameters**:
     - `symbol`: Stock symbol (e.g., `AAPL`)
   - **Description**: Returns balance sheet data for the given stock symbol.

3. **Income Statement**
   - **URL**: `/api/income_statement`
   - **Method**: GET
   - **Parameters**:
     - `symbol`: Stock symbol (e.g., `AAPL`)
   - **Description**: Retrieves the income statement for the specified stock.

4. **Cash Flow Statement**
   - **URL**: `/api/cashflow`
   - **Method**: GET
   - **Parameters**:
     - `symbol`: Stock symbol (e.g., `AAPL`)
   - **Description**: Returns the cash flow statement for the given stock symbol.

5. **Financial Ratios**
   - **URL**: `/api/ratios`
   - **Method**: GET
   - **Parameters**:
     - `symbol`: Stock symbol (e.g., `AAPL`)
   - **Description**: Retrieves key financial ratios for the specified stock.

6. **Sector Comparison**
   - **URL**: `/api/sectorcomparison`
   - **Method**: GET
   - **Parameters**:
     - `symbol`: Stock symbol (e.g., `AAPL`)
   - **Description**: Returns a comparison of financial ratios with other stocks in the same sector.

## Chalice API (Chatbot) Endpoints

The Chalice API provides a chatbot service that allows users to interact with financial documents and data through questions.

### Running the Chalice App

Deploy or test the Chalice app locally:
```bash
chalice local
```

### Endpoints

1. **Chat with Document**
   - **URL**: `/chat`
   - **Method**: POST
   - **Headers**:
     - `Content-Type: application/json`
   - **Body Parameters**:
     - `question` (string): The question you wish to ask.
     - `chat_id` (string): Unique identifier for the chat session.
     - `files` (optional, base64-encoded): Document for the chatbot to analyze.
     - `file_name` (optional, string): Name of the file.
   - **Description**: Sends a question to the chatbot. Optionally, you can include a document for the bot to reference in its response.

## License
This project is not licensed under the MIT license and is intended solely for use within the context of the Datathon 2024 challenge organized by PolyFinances, BNC, and AWS. For commercial redistribution or other uses outside of this scope, please contact the parties listed below.

## Contact

For inquiries, please contact Fedwin Chatelier (fedwinc@gmail.com) or  Benjamin Boucher (benjamin.boucher-charest@polymtl.ca).