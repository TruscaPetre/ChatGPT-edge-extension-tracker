console.log('content script loaded');

// Commit message: "Attach listener to the correct buttons" 

window.addEventListener('load', function() {
  console.log('window loaded'); 

  const potentialButtons = document.querySelectorAll("button.absolute");
  console.log("there are "+potentialButtons.length+" Send Message buttons found");
  if (potentialButtons && potentialButtons.length > 0) { 
    const myButton = potentialButtons[0];
    // attach your event listener
    myButton.addEventListener("click", () => { 
        logButtonClick("send_new_message");
    });
  }else{
    console.error("Element for send buttone not identified");
  } 
  // TODO: ADD A new textArea Listener when the page changes, since the textArea also changes.
  // First, select the text area using its ID.
  const textArea = document.querySelector('#prompt-textarea');
  if (textArea){
    console.log("text area found!"+textArea+" Prepare to register by enter key");
    // Then, add an event listener to it.
    textArea.addEventListener('keydown', (event) => { 
      // The key code for the Enter key is 13.
      if (event.keyCode === 13) {
          console.log("enter key pressed")
          // If the Enter key was pressed, check if the Shift key was also pressed.
          // This is because pressing Shift + Enter usually adds a new line in a text area instead of submitting it.
          if (!event.shiftKey) { 
              // Log to console and save to storage
              console.log('Message sent via Enter key.'); 
              // If the Shift key was not pressed along with the Enter key, consider it as a send event and log it.
              logButtonClick('send_new_message');
          }
      }
    });
  }
  else{
    console.error("TextArea not found.")
  }
  
});  

// Start observing the document with the configured parameters
const observer = new MutationObserver((mutationsList, observer) => {
  // Look through all mutations that just occurred
  for(let mutation of mutationsList) {
      // the added node has one or more nodes
      if (mutation.addedNodes.length){
        const potentialSaveSubmitButton = document.querySelectorAll("button.relative.mr-2");
        if (potentialSaveSubmitButton && potentialSaveSubmitButton.length > 0) {
          console.log("there are "+potentialSaveSubmitButton.length+" save&submit buttons found");
          const myButton = potentialSaveSubmitButton[0];
          // attach your event listener 
          myButton.addEventListener("click", () => logButtonClick("edit_submit_message"));
        } 
      } 
  }
});

// Start observing the document with the configured parameters
observer.observe(document, { childList: true, subtree: true });
 
 
function logButtonClick(buttonName) {
  console.log("Button "+ buttonName +" has been pressed");
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
});


function generateReport() {
  chrome.storage.local.get("activityLog", function (data) {
    const { activityLog } = data;
    if (!activityLog){
      alert("No activity has been logged yet!");
      return;
    } 
    const report = createReportElement(activityLog);
    document.body.appendChild(report);
  });
}

function createReportElement(activityLog) {
  const reportContainer = document.createElement("div");
  reportContainer.className = "report-container";
  reportContainer.style.color = "black";

  const closeButton = document.createElement("button");
  closeButton.textContent = "Close";
  closeButton.style.backgroundColor = "#4CAF50";
  closeButton.style.border = "none";
  closeButton.style.color = "white";
  closeButton.style.padding = "15px 32px";
  closeButton.style.textAlign = "center";
  closeButton.style.textDecoration = "none";
  closeButton.style.display = "inline-block";
  closeButton.style.fontSize = "16px";
  closeButton.style.margin = "4px 2px";
  closeButton.style.cursor = "pointer";
  closeButton.onclick = () => reportContainer.remove();
  reportContainer.appendChild(closeButton);
  
  console.log(activityLog);

  const reportData = aggregateReportData(activityLog);
   
  console.log(reportData);
  for (const [date, buttonCounts] of Object.entries(reportData)) {
    const row = document.createElement("div");
    row.className = "report-row";

    const dateElement = document.createElement("div");
    dateElement.className = "report-date";
    dateElement.textContent = date;
    row.appendChild(dateElement);

    const countElement = document.createElement("div");
    countElement.className = "report-count";
    countElement.textContent = `Send: ${buttonCounts.send_new_message}, Edit & Submit: ${buttonCounts.edit_submit_message}`;
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
      reportData[date] = { send_new_message: 0, edit_submit_message: 0 };
    }
    reportData[date][buttonName]++;
  }

  // Convert the report data to an array of [date, data] pairs
  const reportArray = Object.entries(reportData);

  // Sort the array in descending order by date
  reportArray.sort((a, b) => new Date(b[0]) - new Date(a[0]));

  // Convert the sorted array back into an object
  const sortedReportData = Object.fromEntries(reportArray);

  return sortedReportData;
}

