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
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Helper to get or create a sheet and set up headers
  function getOrCreateSheet(name, defaultHeaders) {
    var sheet = ss.getSheetByName(name);
    if (!sheet) {
      sheet = ss.insertSheet(name);
      sheet.appendRow(defaultHeaders);
    }
    return sheet;
  }
  
  // Initialize sheets with expected headers if they don't exist
  var regSheet = getOrCreateSheet("Registrations", [
    "Ticket ID", 
    "Full Name", 
    "Email Address", 
    "GitHub Username", 
    "Selected Role", 
    "Challenge Track", 
    "Seat Number", 
    "Timestamp", 
    "Galactic Core Score", 
    "Mainframe Grid Score", 
    "Laser Paddle Score"
  ]);
  
  var authSheet = getOrCreateSheet("Email_Password", [
    "Email", 
    "Password", 
    "Name", 
    "PIN"
  ]);
  
  var matchSheet = getOrCreateSheet("Matchmaking", [
    "Team ID", 
    "Name", 
    "Email", 
    "Role", 
    "Track", 
    "Timestamp"
  ]);
  
  try {
    var data = JSON.parse(e.postData.contents);
    var action = data.action;
    
    // --- SIGN UP ACTION ---
    if (action === "signUp") {
      var email = (data.email || "").toLowerCase().trim();
      var password = data.password || "";
      var name = data.name || "";
      var pin = data.pin || "";
      
      if (!email || !password) {
        return createResponse({ status: "error", message: "Email and password are required" });
      }
      
      // Check if email already exists in Email_Password sheet
      var authRows = authSheet.getLastRow();
      if (authRows > 1) {
        var emailColValues = authSheet.getRange(2, 1, authRows - 1, 1).getValues();
        for (var i = 0; i < emailColValues.length; i++) {
          if (emailColValues[i][0].toString().toLowerCase().trim() === email) {
            return createResponse({ status: "error", message: "Email already registered." });
          }
        }
      }
      
      // Append new credentials
      authSheet.appendRow([email, password, name, pin]);
      return createResponse({ status: "success", message: "User signed up successfully." });
    }
    
    // --- LOGIN ACTION ---
    else if (action === "login") {
      var email = (data.email || "").toLowerCase().trim();
      var password = data.password || "";
      
      var authRows = authSheet.getLastRow();
      if (authRows > 1) {
        var authData = authSheet.getRange(2, 1, authRows - 1, 4).getValues();
        for (var i = 0; i < authData.length; i++) {
          if (authData[i][0].toString().toLowerCase().trim() === email && authData[i][1].toString() === password) {
            return createResponse({
              status: "success",
              user: {
                name: authData[i][2],
                email: authData[i][0]
              }
            });
          }
        }
      }
      return createResponse({ status: "error", message: "Incorrect credentials." });
    }
    
    // --- RESET PASSWORD ACTION ---
    else if (action === "resetPassword") {
      var email = (data.email || "").toLowerCase().trim();
      var pin = (data.pin || "").toString().trim();
      var newPassword = data.password || "";
      
      var authRows = authSheet.getLastRow();
      if (authRows > 1) {
        var authData = authSheet.getRange(2, 1, authRows - 1, 4).getValues();
        for (var i = 0; i < authData.length; i++) {
          if (authData[i][0].toString().toLowerCase().trim() === email && authData[i][3].toString().trim() === pin) {
            // Update password in column 2 of the matched row
            authSheet.getRange(i + 2, 2).setValue(newPassword);
            return createResponse({ status: "success", message: "Password reset successful." });
          }
        }
      }
      return createResponse({ status: "error", message: "Invalid email or PIN." });
    }
    
    // --- REGISTER TICKET ACTION ---
    else if (action === "register") {
      var ticketId = data.ticketId;
      var email = (data.email || "").toLowerCase().trim();
      
      // Update if already exists, else append
      var regRows = regSheet.getLastRow();
      var foundIndex = -1;
      if (regRows > 1) {
        var emailValues = regSheet.getRange(2, 3, regRows - 1, 1).getValues();
        for (var i = 0; i < emailValues.length; i++) {
          if (emailValues[i][0].toString().toLowerCase().trim() === email) {
            foundIndex = i + 2;
            break;
          }
        }
      }
      
      if (foundIndex !== -1) {
        // Update existing row
        regSheet.getRange(foundIndex, 1).setValue(ticketId);
        regSheet.getRange(foundIndex, 2).setValue(data.name || "");
        regSheet.getRange(foundIndex, 4).setValue(data.github || "");
        regSheet.getRange(foundIndex, 5).setValue(data.role || "");
        regSheet.getRange(foundIndex, 6).setValue(data.track || "");
        regSheet.getRange(foundIndex, 7).setValue(data.seatNumber || "");
        regSheet.getRange(foundIndex, 8).setValue(new Date().toLocaleString());
        return createResponse({ status: "success", message: "Updated existing ticket " + ticketId });
      } else {
        // Append new registration row
        regSheet.appendRow([
          ticketId,
          data.name || "",
          email,
          data.github || "",
          data.role || "",
          data.track || "",
          data.seatNumber || "",
          new Date().toLocaleString(),
          "", // Galactic Core Score
          "", // Mainframe Grid Score
          ""  // Laser Paddle Score
        ]);
        return createResponse({ status: "success", message: "Registered ticket " + ticketId });
      }
    }
    
    // --- DEREGISTER TICKET ACTION (Deletes registration AND user details!) ---
    else if (action === "deregister") {
      var ticketId = data.ticketId;
      var userEmail = "";
      
      // 1. Find and delete from Registrations sheet
      var regRows = regSheet.getLastRow();
      if (regRows > 1) {
        var regRange = regSheet.getRange(2, 1, regRows - 1, 3); // Cols: Ticket ID (1), Name (2), Email (3)
        var regValues = regRange.getValues();
        for (var i = regValues.length - 1; i >= 0; i--) {
          if (String(regValues[i][0]).trim() === String(ticketId).trim()) {
            userEmail = String(regValues[i][2]).toLowerCase().trim();
            regSheet.deleteRow(i + 2);
          }
        }
      }
      
      // 2. Delete from Email_Password sheet if email is found/available
      if (userEmail) {
        var authRows = authSheet.getLastRow();
        if (authRows > 1) {
          var authEmailValues = authSheet.getRange(2, 1, authRows - 1, 1).getValues();
          for (var j = authEmailValues.length - 1; j >= 0; j--) {
            if (String(authEmailValues[j][0]).toLowerCase().trim() === userEmail) {
              authSheet.deleteRow(j + 2);
            }
          }
        }
        
        // 3. Delete from Matchmaking sheet if email is found
        var matchRows = matchSheet.getLastRow();
        if (matchRows > 1) {
          var matchEmailValues = matchSheet.getRange(2, 3, matchRows - 1, 1).getValues(); // Email is Col 3
          for (var k = matchEmailValues.length - 1; k >= 0; k--) {
            if (String(matchEmailValues[k][0]).toLowerCase().trim() === userEmail) {
              matchSheet.deleteRow(k + 2);
            }
          }
        }
      } else {
        // Fallback: If no email was resolved, search by ticketId in Registrations anyway
        var regRowsFallback = regSheet.getLastRow();
        if (regRowsFallback > 1) {
          var idValues = regSheet.getRange(2, 1, regRowsFallback - 1, 1).getValues();
          for (var idx = idValues.length - 1; idx >= 0; idx--) {
            if (String(idValues[idx][0]).trim() === String(ticketId).trim()) {
              regSheet.deleteRow(idx + 2);
            }
          }
        }
      }
      
      return createResponse({ status: "success", message: "Successfully removed ticket, account, and matchmaking details for " + ticketId });
    }
    
    // --- GET TICKET ACTION ---
    else if (action === "getTicket") {
      var email = (data.email || "").toLowerCase().trim();
      var regRows = regSheet.getLastRow();
      if (regRows > 1) {
        var regData = regSheet.getRange(2, 1, regRows - 1, 11).getValues();
        for (var i = 0; i < regData.length; i++) {
          if (regData[i][2].toString().toLowerCase().trim() === email) {
            return createResponse({
              status: "success",
              ticket: {
                ticketId: regData[i][0],
                name: regData[i][1],
                email: regData[i][2],
                github: regData[i][3],
                role: regData[i][4],
                track: regData[i][5],
                seatNumber: regData[i][6],
                timestamp: regData[i][7],
                scores: {
                  galacticCore: regData[i][8],
                  mainframeGrid: regData[i][9],
                  laserPaddle: regData[i][10]
                }
              }
            });
          }
        }
      }
      return createResponse({ status: "not_found", message: "No ticket found for email " + email });
    }
    
    // --- SCORE UPDATE ACTION ---
    else if (action === "score") {
      var ticketId = data.ticketId;
      var scoreVal = Number(data.score) || 0;
      var gameId = data.gameId; // "space", "tetris", "pong"
      
      var regRows = regSheet.getLastRow();
      if (regRows > 1) {
        var idValues = regSheet.getRange(2, 1, regRows - 1, 1).getValues();
        for (var i = 0; i < idValues.length; i++) {
          if (String(idValues[i][0]).trim() === String(ticketId).trim()) {
            var rowNum = i + 2;
            var colNum = 9; // Default to Galactic Core
            if (gameId === "tetris") colNum = 10;
            if (gameId === "pong") colNum = 11;
            
            var cell = regSheet.getRange(rowNum, colNum);
            var currentVal = Number(cell.getValue()) || 0;
            if (scoreVal > currentVal) {
              cell.setValue(scoreVal);
            }
            return createResponse({ status: "success", message: "Highscore updated." });
          }
        }
      }
      return createResponse({ status: "not_found", message: "Ticket not found." });
    }
    
    // --- JOIN TEAM / MATCHMAKING ACTION ---
    else if (action === "join_team") {
      var teamId = data.teamId;
      var name = data.name || "";
      var email = (data.email || "").toLowerCase().trim();
      var role = data.role || "";
      var track = data.track || "";
      
      matchSheet.appendRow([teamId, name, email, role, track, new Date().toLocaleString()]);
      return createResponse({ status: "success", message: "Joined team successfully." });
    }
    
    return createResponse({ status: "error", message: "Unknown action parameter" });
    
  } catch (error) {
    return createResponse({ status: "error", message: error.toString() });
  }
}

function doGet(e) {
  return HtmlService.createHtmlOutput("<h3>Tachyon Webhook Endpoint Active</h3>");
}

function createResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
