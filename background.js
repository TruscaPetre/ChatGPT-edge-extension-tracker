// Create a context menu item when the extension is installed
chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({
      id: "generate_report",
      title: "Generate Chat Activity Report",
      contexts: ["page"],
      documentUrlPatterns: ["https://chat.openai.com/*"]
    });
  });