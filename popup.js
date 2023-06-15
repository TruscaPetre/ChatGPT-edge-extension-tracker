// When the "Generate Report" button in the popup is clicked,
// get the current tab and send a "generate_report" message to the content script in that tab.
document.getElementById("generateReport").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "generate_report" });
      window.close();
    });
  });
  
// When the browser action command (e.g., keyboard shortcut) is triggered,
// get the current tab and send a "generate_report" message to the content script in that tab.

chrome.commands.onCommand.addListener((command) => {
  if (command === "_execute_browser_action") {
    chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "generate_report" });
    });
  }
});
  
 
// When the context menu item is clicked, 
// send a "generate_report" message to the content script in the tab where the context menu was opened.
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "generate_report") {
    chrome.tabs.sendMessage(tab.id, { action: "generate_report" });
  }
});

// Function to send a message to a content script in a specific tab.
// If sending the message fails (because the content script isn't ready),
// it waits 100 milliseconds and then tries again.

function sendMessageToContentScript(tabId, message) {
  chrome.tabs.sendMessage(tabId, message, (response) => {
    if (chrome.runtime.lastError) {
      // An error means the content script is not ready, wait a bit and retry
      setTimeout(() => sendMessageToContentScript(tabId, message), 100);
    } else {
      // No error means the message was sent successfully
      console.log("Message sent successfully: ", message);
    }
  });
}