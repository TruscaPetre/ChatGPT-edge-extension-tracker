document.getElementById("generateReport").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "generate_report" });
    });
  });
  
  chrome.commands.onCommand.addListener((command) => {
    if (command === "_execute_browser_action") {
      chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "generate_report" });
      });
    }
  });
  
  // Add context menu item
  chrome.contextMenus.create({
    id: "generate_report",
    title: "Generate Chat Activity Report",
    contexts: ["page"],
    documentUrlPatterns: ["https://chat.openai.com/*"]
  });
  
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "generate_report") {
      chrome.tabs.sendMessage(tab.id, { action: "generate_report" });
    }
  });
  