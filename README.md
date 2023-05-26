# ChatGPT-edge-extension-tracker

## Description
This is project is a browser extension for Microsoft Edge. The extension aims to track your messages timing in ChatGPT and provide detailed reports. All contribution guidelines, updates, and project details can be found in the README file.

## Features
The project does track the time of the messages written in chatGPT based on the "send message" buttons pressed in chatGPT interface.
Based on the logs that are generated when interacting with chatGPT, you can create reports that show you how many messages you sent.

## Installation

### Prerequisites
 Ensure you have Microsoft Edge browser installed.

### Steps to launch project

- Clone repository
- Load extension into browser:
  - Open the Extensions page by navigating to `edge://extensions`
  - Enable Developer mode
  - Click on "Load unpacked"
  - Select the project folder
- Make sure to Activate the extension in the Extensions page
- For easier access show the extension in the sidebar

## Usage

Navigate to [chat.openai.com](https://chat.openai.com/) and after you type a few messages press on the icon of the extension than press on "Generate Report" button.

## Development

After you try to use the extension, you may find error messages in the page `edge://extensions`, near the name of the extension, by clicking the button `Errors`. After you fix those errors to test the fix, first you should clear the page of errors by pressind the button `Clear all`. Than you should return to the `edge://extensions` page, than click on the `reload` button. Now you should test again the extension.

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct, and the process for submitting pull requests.

## License 

This project is licensed under the MIT License - see the LICENSE file for details