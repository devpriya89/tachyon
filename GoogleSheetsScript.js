/**
 * Google Apps Script Web App for Tachyon Arcade & Website Registration Synchronization
 * 
 * Instructions:
 * 1. Open Google Sheets.
 * 2. Click Extensions > Apps Script.
 * 3. Delete any default template code and paste this script.
 * 4. Click Deploy > New Deployment.
 * 5. Set Select type to "Web app".
 * 6. Set Description to "Tachyon Registration Sync".
 * 7. Set Execute as to "Me" (your account).
 * 8. Set Who has access to to "Anyone".
 * 9. Click Deploy, authorize permissions, and copy the Web App URL.
 * 10. Paste this URL into the Admin Control Console under "Google Sheets Sync Webhook URL" or save it to localStorage.
 */

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Create header row if sheet is completely empty
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Ticket ID", "Full Name", "Email Address", "GitHub Username", "Selected Role", "Challenge Track", "Seat Number", "Timestamp", "Galactic Core Score", "Mainframe Grid Score", "Laser Paddle Score"]);
  }
  
  try {
    var data = JSON.parse(e.postData.contents);
    var action = data.action;
    var ticketId = data.ticketId;
    
    if (action === "register") {
      // Append a new registration record row to the sheet
      sheet.appendRow([
        ticketId,
        data.name || "",
        data.email || "",
        data.github || "",
        data.role || "",
        data.track || "",
        data.seatNumber || "",
        new Date().toLocaleString()
      ]);
      
      return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Registered ticket " + ticketId }))
        .setMimeType(ContentService.MimeType.JSON);
        
    } else if (action === "deregister") {
      // Find row matching ticketId and delete it
      var rows = sheet.getLastRow();
      if (rows > 1) {
        var range = sheet.getRange(2, 1, rows - 1, 1); // Get Ticket ID column starting from row 2
        var values = range.getValues();
        
        for (var i = 0; i < values.length; i++) {
          if (String(values[i][0]) === String(ticketId)) {
            sheet.deleteRow(i + 2); // Rows are 1-indexed; header is row 1
            return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Removed ticket " + ticketId }))
              .setMimeType(ContentService.MimeType.JSON);
          }
        }
      }
      
      return ContentService.createTextOutput(JSON.stringify({ status: "not_found", message: "Ticket " + ticketId + " not found in Sheet" }))
        .setMimeType(ContentService.MimeType.JSON);
    } else if (action === "score") {
      // Find user row matching ticketId, update game highscore if new score is higher
      var rows = sheet.getLastRow();
      if (rows > 1) {
        var range = sheet.getRange(2, 1, rows - 1, 1); // Get Ticket ID column
        var values = range.getValues();
        
        for (var i = 0; i < values.length; i++) {
          if (String(values[i][0]) === String(ticketId)) {
            var rowNum = i + 2;
            var colNum = 9; // Col 9: Galactic Core, Col 10: Mainframe Grid, Col 11: Laser Paddle
            if (data.gameId === "tetris") colNum = 10;
            if (data.gameId === "pong") colNum = 11;
            
            var cell = sheet.getRange(rowNum, colNum);
            var currentVal = Number(cell.getValue()) || 0;
            if (Number(data.score) > currentVal) {
              cell.setValue(Number(data.score));
            }
            
            return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Updated highscore for ticket " + ticketId }))
              .setMimeType(ContentService.MimeType.JSON);
          }
        }
      }
      return ContentService.createTextOutput(JSON.stringify({ status: "not_found", message: "Ticket " + ticketId + " not found" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Unknown action parameter" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return HtmlService.createHtmlOutput("<h3>Tachyon Webhook Endpoint Active</h3>");
}
