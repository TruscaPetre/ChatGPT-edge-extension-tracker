document.getElementById("generateReport").addEventListener("click", () => {
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      browser.tabs.sendMessage(tabs[0].id, { action: "generate_report" });
    });
  });
  
  browser.commands.onCommand.addListener((command) => {
    if (command === "_execute_browser_action") {
      browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        browser.tabs.sendMessage(tabs[0].id, { action: "generate_report" });
      });
    }
  });
  
  // Add context menu item
  browser.contextMenus.create({
    id: "generate_report",
    title: "Generate Chat Activity Report",
    contexts: ["page"],
    documentUrlPatterns: ["https://chat.openai.com/*"]
  });
  
  browser.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "generate_report") {
      browser.tabs.sendMessage(tab.id, { action: "generate_report" });
    }
  });
  