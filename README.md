# Text Analyzer

A simple web application that allows users to input text and analyze it using the Gemini API. The app processes the text, sends it to the API for content generation, and displays the refined results in a readable format. Perfect for text insights and AI-driven analysis.

## Features

- Input text and send it to the Gemini API for analysis.
- Receive refined and formatted text analysis results.
- Easy-to-use interface for text-based AI analysis.

## Setup Instructions

To get started with the project locally, follow these steps:

### 1. Clone the repository

First, clone this repository to your local machine:

```bash
git clone https://github.com/your-username/text-analyzer.git
```

### 2. Create a .env file

Create a `.env` file in the root of the project directory (next to the `src/` folder). Add the following line to it, replacing `your-api-key-here` with your actual Gemini API key:

```bash
VITE_GEMINI_API_KEY=your-api-key-here
```

*Note: If you don't have an API key yet, you can get one from the Gemini API documentation.*

### 3. Install dependencies

Navigate to the project directory and install the dependencies using either npm or yarn:

```bash
npm install
```
or

```bash
yarn install
```

### 4. Start the development server

Now, you can start the development server by running:

```bash
npm run dev
```
or

```bash
yarn dev
```

This will launch the app locally. You can now access it at `http://localhost:3000` (or whichever port is specified).

### 5. Enjoy!

Once the server is running, you can start entering text and analyze it through the Gemini API!