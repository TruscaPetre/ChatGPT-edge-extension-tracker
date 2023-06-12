console.log('content script loaded');

// Commit message: "Attach listener to the correct buttons" 

window.addEventListener('load', function() {
  console.log('window loaded'); 
  const potentialButtons = document.querySelectorAll("button.absolute"  );
  console.log("there are "+potentialButtons.length+" buttons found");
  if (potentialButtons && potentialButtons.length > 0) { 
    const myButton = potentialButtons[0];
    // attach your event listener
    myButton.addEventListener("click", () => {
        console.log("Button was clicked!");
        logButtonClick("send_new_message");
    });
}else{
  console.error("Element for send buttone not identified");
} 

// const sendMessageButton = document.querySelector("#send-new-message-button");
const saveSubmitButton = document.querySelector("#save-submit-button");

if (saveSubmitButton) {
  saveSubmitButton.addEventListener("click", () => logButtonClick("save_submit"));
} else {
  console.error("Element with ID 'save-submit-button' does not exist");
} 
});  



function logButtonClick(buttonName) {
  const timestamp = new Date().toISOString();
  const logEntry = { timestamp, buttonName };

  // Save the log entry in local storage
  chrome.storage.local.get("activityLog", function (data) {
    let { activityLog } = data;
    if (!activityLog) {
      activityLog = [];
    }
    activityLog.push(logEntry);
    chrome.storage.local.set({ activityLog });
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "generate_report") {
    generateReport();
  }
  if (request.action === "test") {
    console.log("Test message received!")
  }
});


function generateReport() {
  chrome.storage.local.get("activityLog", function (data) {
    const { activityLog } = data;
    const report = createReportElement(activityLog);
    document.body.appendChild(report);
  });
}

function createReportElement(activityLog) {
  const reportContainer = document.createElement("div");
  reportContainer.className = "report-container";

  const closeButton = document.createElement("button");
  closeButton.textContent = "Close";
  closeButton.onclick = () => reportContainer.remove();
  reportContainer.appendChild(closeButton);

  const reportData = aggregateReportData(activityLog);
  for (const [date, buttonCounts] of Object.entries(reportData)) {
    const row = document.createElement("div");
    row.className = "report-row";

    const dateElement = document.createElement("div");
    dateElement.className = "report-date";
    dateElement.textContent = date;
    row.appendChild(dateElement);

    const countElement = document.createElement("div");
    countElement.className = "report-count";
    countElement.textContent = `Send: ${buttonCounts.send_new_message}, Save & Submit: ${buttonCounts.save_submit}`;
    row.appendChild(countElement);

    reportContainer.appendChild(row);
  }

  return reportContainer;
}

function aggregateReportData(activityLog) {
  const reportData = {};

  for (const { timestamp, buttonName } of activityLog) {
    const date = new Date(timestamp).toLocaleDateString();
    if (!reportData[date]) {
      reportData[date] = { send_new_message: 0, save_submit: 0 };
    }
    reportData[date][buttonName]++;
  }

  return reportData;
}

