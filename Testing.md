# Manual testing framework for the extension

This document contains instructions for manually testing all aspects of the extension. 

## Features to be tested

- Tracking "send" button. 
- Tracking "edit & respond" button.
- Store the data locally.
- Generate report.

## How to test each feature

- Tracking "send" button. & Tracking "edit & respond" button. Store the data locally.
  - Open https://ai.com
  - Start a new chat
  - Edit the message you sent earlier
  - Open local storage where logs are stored
  - Verify that you have 2 new entries
  - Verify that the data in the entries are correct
- Generate report.
  - Open the extensions menu in the browser
  - Click on the extension icon
  - Click on the generate report button
  - You should see how many times you sent messages to chatGPT in the past 3 days


## Edge cases

- The extension is reloaded while https://ai.com is open
- No button is clicked
- Button is clicked many times in quick succession

## Development tests


- Test that the extention is injected
  - Load a page on https://chat.openai.com
  - Open developer tools ( F12 or Ctrl+shift+I, or right click & "Inspect")
  - Click on the console tab
  - You can type "content" in the filter to highlight the log message and hide the others
- Test that content script is correctly referenced in the manifest.json and is loaded when chat page is open
  - Load a page on https://chat.openai.com
  - Open developers tools
  - Click on the "Sources" tab
  - In the left-hand pane, expand the section "Content Scripts"
  - Click on your extension's name ("name" from `manifest.json`)
  - You should see the `content.js` file listed, check it's content
  - 