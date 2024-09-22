# Japanese Romaji Helper Chrome Extension

Japanese Romaji Helper is a Chrome extension that displays romaji (Latin script) for selected Japanese text, providing an easy way for users to read and understand Japanese characters.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Development](#development)
- [Backend Server](#backend-server)
- [Contributing](#contributing)
- [License](#license)

## Features

- Converts selected Japanese text to romaji
- Displays romaji in a user-friendly overlay
- Highlights selected text
- Toggle extension on/off from the popup

## Installation

1. Clone this repository:

   ```shell
   git clone https://github.com/cookabc/jp-romaji-helper.git
   ```

2. Install dependencies:

   ```shell
   pnpm install
   ```

3. Build the extension:

   ```shell
   pnpm run build
   ```

4. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `dist` folder in the project directory

## Usage

1. Enable the extension by clicking on the extension icon and toggling it on.
2. Select any Japanese text on a webpage.
3. An overlay will appear with the original text and its romaji translation.
4. Click the close button or anywhere outside the overlay to dismiss it.

## Development

The project uses Webpack for bundling and Babel for transpiling. The main files are:

- `src/content.js`: Content script that handles text selection and overlay display
- `src/background.js`: Background script for extension state management
- `src/popup.js`: Script for the extension popup
- `public/popup.html`: HTML for the extension popup
- `public/manifest.json`: Extension manifest file

To make changes:

1. Modify the source files in the `src` directory.
2. Run `pnpm run build` to rebuild the extension.
3. Reload the extension in Chrome to see your changes.

## Backend Server

The extension relies on a backend server for Japanese to romaji conversion. The server code is in `express.js`. To run the server:

1. Ensure you have the necessary dependencies installed.
2. Run the server:

   ```shell
   node express.js
   ```

The server will start on `http://localhost:3000`.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
