/**
 * =================================================================================
 *  ████████╗ █████╗  ██████╗██╗  ██╗██╗   ██╗ ██████╗ ███╗   ██╗    ██████╗ ██████╗ 
 *  ╚══██╔══╝██╔══██╗██╔════╝██║  ██║╚██╗ ██╔╝██╔═══██╗████╗  ██║    ██╔══██╗██╔══██╗
 *     ██║   ███████║██║     ███████║ ╚████╔╝ ██║   ██║██╔██╗ ██║    ██║  ██║██████╔╝
 *     ██║   ██╔══██║██║     ██╔══██║  ╚██╔╝  ██║   ██║██║╚██╗██║    ██║  ██║██╔══██╗
 *     ██║   ██║  ██║╚██████╗██║  ██║   ██║   ╚██████╔╝██║ ╚████║    ██████╔╝██████╔╝
 *     ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝   ╚═╝    ╚═════╝ ╚═╝  ╚═══╝    ╚═════╝ ╚═════╝ 
 * =================================================================================
 * Tachyon Core Database Engine & Admin Sync Web App Protocol
 * Version: 2.1.0 // Production Build
 * 
 * INSTRUCTIONS FOR DEPLOYMENT:
 * 1. Open Google Sheets.
 * 2. Click "Extensions" > "Apps Script".
 * 3. Delete any default template code and paste this entire script.
 * 4. Click the "Save" (floppy disk) icon.
 * 5. Click the blue "Deploy" button in the top-right corner > select "New deployment".
 * 6. Set deployment type to "Web app".
 * 7. Set Description to "Tachyon Cloud Sync Service".
 * 8. Set "Execute as" to "Me" (your Google account).
 * 9. Set "Who has access" to "Anyone" (required for website clients to connect).
 * 10. Click "Deploy", approve access permissions, and copy the Web App URL.
 * 11. Paste this URL into your website Admin Panel under "Google Sheets Webhook URL".
 * =================================================================================
 */

// Global spreadsheet binding reference
const ss = SpreadsheetApp.getActiveSpreadsheet();

/**
 * Validates and self-heals sheet structures by verifying headers.
 * If a sheet does not exist, it is created with the default headers.
 * If columns are missing, they are appended.
 */
function initializeAndVerifyDatabase() {
  const schema = {
    "Registrations": [
      "Ticket ID", "Timestamp", "Name", "Email Address", "GitHub Username", 
      "Selected Role", "Challenge Track", "Seat Number", "Galactic Core Score", 
      "Mainframe Grid Score", "Laser Paddle Score"
    ],
    "Email_Password": [
      "Email", "Password", "Name", "PIN"
    ],
    "Matchmaking": [
      "Team ID", "Name", "Email", "Role", "Track", "Timestamp"
    ],
    "Settings": [
      "KEY", "VALUE"
    ],
    "Organizers": [
      "Name", "Role", "Image URL", "Social Link", "Timestamp"
    ],
    "Sponsors": [
      "Name", "Logo URL", "Website", "Tier", "Timestamp"
    ],
    "System_Logs": [
      "Log ID", "Timestamp", "Action Type", "Status", "Details", "Payload Summary"
    ]
  };

  for (let sheetName in schema) {
    let sheet = ss.getSheetByName(sheetName);
    let expectedHeaders = schema[sheetName];
    
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      sheet.appendRow(expectedHeaders);
      
      // Auto-fit column widths and style headers
      sheet.getRange(1, 1, 1, expectedHeaders.length)
           .setFontWeight("bold")
           .setBackground("#222222")
           .setFontColor("#ffffff")
           .setHorizontalAlignment("center");
      sheet.setFrozenRows(1);
    } else {
      // Self-heal headers if any columns are missing
      let lastCol = sheet.getLastColumn();
      if (lastCol > 0) {
        let actualHeaders = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
        let headersSet = new Set(actualHeaders.map(h => h.toString().trim()));
        
        for (let header of expectedHeaders) {
          if (!headersSet.has(header)) {
            sheet.getRange(1, lastCol + 1).setValue(header)
                 .setFontWeight("bold")
                 .setBackground("#222222")
                 .setFontColor("#ffffff")
                 .setHorizontalAlignment("center");
            lastCol++;
          }
        }
      }
    }
  }
}

/**
 * Log transactions inside the System_Logs sheet for diagnostic tracking
 */
function logTransaction(action, status, details, payload) {
  try {
    const logSheet = ss.getSheetByName("System_Logs");
    if (logSheet) {
      const logId = "LOG-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
      const timestamp = new Date().toLocaleString();
      const payloadString = payload ? JSON.stringify(payload).substring(0, 1000) : "No Payload";
      logSheet.appendRow([logId, timestamp, action, status, details, payloadString]);
    }
  } catch (e) {
    console.error("Logging failed: " + e.toString());
  }
}

/**
 * Main Web App POST Endpoint Router. Handles inbound data request routing.
 */
function doPost(e) {
  try {
    // 1. Database Schema Integrity Self-Heal Check
    initializeAndVerifyDatabase();
    
    // 2. Parse inbound request contents safely
    if (!e || !e.postData || !e.postData.contents) {
      logTransaction("UNKNOWN", "ERROR", "Null or empty request body", null);
      return createResponse({ status: "error", message: "Inbound request contents are empty." });
    }
    
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    // Helper to get or create sheet (available inside doPost scope)
    function getOrCreateSheet(name, defaultHeaders) {
      var sheet = ss.getSheetByName(name);
      if (!sheet) {
        sheet = ss.insertSheet(name);
        sheet.appendRow(defaultHeaders);
        sheet.getRange(1, 1, 1, defaultHeaders.length)
             .setFontWeight("bold")
             .setBackground("#222222")
             .setFontColor("#ffffff")
             .setHorizontalAlignment("center");
        sheet.setFrozenRows(1);
      }
      return sheet;
    }

    const regSheet = ss.getSheetByName("Registrations");
    const authSheet = ss.getSheetByName("Email_Password");
    const matchSheet = ss.getSheetByName("Matchmaking");
    const settingsSheet = ss.getSheetByName("Settings");
    
    // =================================================================================
    // ROUTE 1: SIGN UP (ADMIN/USER CREDENTIALS REGISTRY)
    // =================================================================================
    if (action === "signUp") {
      const email = (data.email || "").toLowerCase().trim();
      const name = (data.name || "").trim();
      const password = data.password || "";
      const pin = data.pin ? data.pin.toString().trim() : "0000";
      
      if (!email || !password || !name) {
        logTransaction("signUp", "ERROR", "Missing required sign up parameters", data);
        return createResponse({ status: "error", message: "Email, Password, and Name are required." });
      }
      
      const rows = authSheet.getDataRange().getValues();
      for (let i = 1; i < rows.length; i++) {
        if (rows[i][0].toString().toLowerCase().trim() === email) {
          logTransaction("signUp", "CONFLICT", "Conflict: Email already exists: " + email, data);
          return createResponse({ status: "error", message: "Email already registered." });
        }
      }
      
      authSheet.appendRow([email, password, name, pin]);
      logTransaction("signUp", "SUCCESS", "New administrator user registered: " + email, { email, name });
      return createResponse({ status: "success", user: { name: name, email: email } });
    }
    
    // =================================================================================
    // ROUTE 2: LOGIN (USER CREDENTIALS AUTHENTICATION)
    // =================================================================================
    else if (action === "login") {
      const email = (data.email || "").toLowerCase().trim();
      const password = data.password || "";
      
      if (!email || !password) {
        logTransaction("login", "ERROR", "Missing credentials on payload", null);
        return createResponse({ status: "error", message: "Email and password are required." });
      }
      
      const rows = authSheet.getDataRange().getValues();
      for (let i = 1; i < rows.length; i++) {
        if (rows[i][0].toString().toLowerCase().trim() === email) {
          if (rows[i][1].toString() === password) {
            logTransaction("login", "SUCCESS", "Authorized access granted for " + email, null);
            return createResponse({ status: "success", user: { name: rows[i][2], email: email } });
          } else {
            logTransaction("login", "FAIL", "Invalid credential attempt for " + email, null);
            return createResponse({ status: "error", message: "Incorrect password" });
          }
        }
      }
      logTransaction("login", "NOT_FOUND", "No user found with email " + email, null);
      return createResponse({ status: "error", message: "User not found" });
    }
    
    // =================================================================================
    // ROUTE 3: RESET PASSWORD (PIN VALIDATION & OVERWRITE)
    // =================================================================================
    else if (action === "resetPassword") {
      const email = (data.email || "").toLowerCase().trim();
      const pin = (data.pin || "").toString().trim();
      const newPassword = data.password || "";
      
      if (!email || !pin || !newPassword) {
        logTransaction("resetPassword", "ERROR", "Missing parameters in request", null);
        return createResponse({ status: "error", message: "Email, PIN, and new Password are required." });
      }
      
      const rows = authSheet.getDataRange().getValues();
      for (let i = 1; i < rows.length; i++) {
        if (rows[i][0].toString().toLowerCase().trim() === email) {
          if (rows[i][3].toString().trim() === pin) {
            authSheet.getRange(i + 1, 2).setValue(newPassword);
            logTransaction("resetPassword", "SUCCESS", "Credentials updated successfully for: " + email, null);
            return createResponse({ status: "success", message: "Password reset successful." });
          } else {
            logTransaction("resetPassword", "FORBIDDEN", "Incorrect security PIN verification: " + email, null);
            return createResponse({ status: "error", message: "Incorrect Security PIN" });
          }
        }
      }
      logTransaction("resetPassword", "NOT_FOUND", "No reset target profile matching " + email, null);
      return createResponse({ status: "error", message: "User not found" });
    }
    
    // =================================================================================
    // ROUTE 4: GET TICKET (RETRIEVE SEAT DETAILS & HIGHSCORES)
    // =================================================================================
    else if (action === "getTicket") {
      const email = (data.email || "").toLowerCase().trim();
      
      if (!email) {
        logTransaction("getTicket", "ERROR", "Null query parameter", null);
        return createResponse({ status: "error", message: "Email is required." });
      }
      
      const rows = regSheet.getDataRange().getValues();
      for (let i = 1; i < rows.length; i++) {
        if (rows[i][3].toString().toLowerCase().trim() === email) {
          return createResponse({
            status: "success",
            ticket: {
              ticketId: rows[i][0],
              timestamp: rows[i][1],
              name: rows[i][2],
              email: rows[i][3],
              github: rows[i][4],
              role: rows[i][5],
              track: rows[i][6],
              seatNumber: rows[i][7],
              scores: {
                galacticCore: rows[i][8] || 0,
                mainframeGrid: rows[i][9] || 0,
                laserPaddle: rows[i][10] || 0
              }
            }
          });
        }
      }
      return createResponse({ status: "not_found", message: "Ticket not found." });
    }
    
    // =================================================================================
    // ROUTE 5: DEREGISTER (CLEAN DELETE ASSOCIATED REGISTRY ENTRIES)
    // =================================================================================
    else if (action === "deregister") {
      const ticketId = (data.ticketId || "").toString().trim();
      if (!ticketId) {
        logTransaction("deregister", "ERROR", "No target ID supplied", null);
        return createResponse({ status: "error", message: "Ticket ID is required." });
      }
      
      var userEmail = "";
      
      // Remove matching Registration rows
      const regRows = regSheet.getDataRange().getValues();
      for (let i = regRows.length - 1; i >= 1; i--) {
        if (String(regRows[i][0]).trim() === ticketId) {
          userEmail = String(regRows[i][3]).toLowerCase().trim();
          regSheet.deleteRow(i + 1);
        }
      }
      
      // Cleanup corresponding accounts and team registries
      if (userEmail) {
        const authRows = authSheet.getDataRange().getValues();
        for (let j = authRows.length - 1; j >= 1; j--) {
          if (String(authRows[j][0]).toLowerCase().trim() === userEmail) {
            authSheet.deleteRow(j + 1);
          }
        }
        
        const matchRows = matchSheet.getDataRange().getValues();
        for (let k = matchRows.length - 1; k >= 1; k--) {
          if (String(matchRows[k][2]).toLowerCase().trim() === userEmail) {
            matchSheet.deleteRow(k + 1);
          }
        }
      }
      
      logTransaction("deregister", "SUCCESS", "Purged system credentials and ticket registry for seat: " + ticketId, { ticketId, userEmail });
      return createResponse({ status: "success", message: "Seat data purged completely." });
    }

    // =================================================================================
    // ROUTE 6: GET REGISTRATIONS (GLOBAL LIST OF ALL REGISTERED BUILDERS)
    // =================================================================================
    else if (action === "getRegistrations") {
      const regs = [];
      const rows = regSheet.getDataRange().getValues();
      
      for (let i = 1; i < rows.length; i++) {
        regs.push({
          ticketId: rows[i][0],
          timestamp: rows[i][1],
          name: rows[i][2],
          email: rows[i][3],
          github: rows[i][4],
          role: rows[i][5],
          track: rows[i][6],
          seatNumber: rows[i][7],
          scores: {
            galacticCore: rows[i][8] || 0,
            mainframeGrid: rows[i][9] || 0,
            laserPaddle: rows[i][10] || 0
          }
        });
      }
      return createResponse({ status: "success", registrations: regs });
    }

    // =================================================================================
    // ROUTE 7: GET MATCHMAKING (GLOBAL LIST OF ACTIVE TEAM POSTINGS)
    // =================================================================================
    else if (action === "getMatchmaking") {
      const matches = [];
      const rows = matchSheet.getDataRange().getValues();
      
      for (let i = 1; i < rows.length; i++) {
        matches.push({
          teamId: rows[i][0],
          name: rows[i][1],
          email: rows[i][2],
          role: rows[i][3],
          track: rows[i][4],
          timestamp: rows[i][5]
        });
      }
      return createResponse({ status: "success", matchmaking: matches });
    }

    // =================================================================================
    // ROUTE 8: SAVE SETTINGS (GLOBAL SITE ACCENTS AND TIMELINE STORAGE)
    // =================================================================================
    else if (action === "saveSettings") {
      const key = data.key;
      const value = JSON.stringify(data.value);
      
      if (!key) {
        logTransaction("saveSettings", "ERROR", "Null parameter target", null);
        return createResponse({ status: "error", message: "Settings KEY parameter is required." });
      }
      
      const rows = settingsSheet.getDataRange().getValues();
      let foundIndex = -1;
      for (let i = 1; i < rows.length; i++) {
        if (rows[i][0].toString() === key) {
          foundIndex = i + 1;
          break;
        }
      }
      
      if (foundIndex !== -1) {
        settingsSheet.getRange(foundIndex, 2).setValue(value);
      } else {
        settingsSheet.appendRow([key, value]);
      }
      
      logTransaction("saveSettings", "SUCCESS", "Updated global parameter: " + key, null);
      return createResponse({ status: "success", message: "Global parameter saved." });
    }
    
    // =================================================================================
    // ROUTE 9: GET SETTINGS (RETRIEVE ALL TIMELINES & LINK SETTINGS)
    // =================================================================================
    else if (action === "getSettings") {
      const settings = {};
      const rows = settingsSheet.getDataRange().getValues();
      
      for (let i = 1; i < rows.length; i++) {
        try {
          settings[rows[i][0].toString()] = JSON.parse(rows[i][1]);
        } catch(e) {
          settings[rows[i][0].toString()] = rows[i][1];
        }
      }
      return createResponse({ status: "success", settings: settings });
    }

    // =================================================================================
    // ROUTE 10A: SAVE ORGANIZERS (WRITE CREW LIST TO DEDICATED SHEET)
    // =================================================================================
    else if (action === "saveOrganizers") {
      const organizers = data.organizers;
      if (!organizers || !Array.isArray(organizers)) {
        logTransaction("saveOrganizers", "ERROR", "Invalid organizers payload", data);
        return createResponse({ status: "error", message: "Organizers array is required." });
      }

      const orgSheet = getOrCreateSheet("Organizers", ["Name", "Role", "Image URL", "Social Link", "Timestamp"]);
      
      // Clear existing data (keep headers)
      if (orgSheet.getLastRow() > 1) {
        orgSheet.getRange(2, 1, orgSheet.getLastRow() - 1, orgSheet.getLastColumn()).clearContent();
      }
      
      // Write all organizers
      for (let i = 0; i < organizers.length; i++) {
        const org = organizers[i];
        orgSheet.appendRow([
          org.name || "",
          org.role || "",
          org.image || "",
          org.social || org.link || "",
          new Date().toLocaleString()
        ]);
      }
      
      logTransaction("saveOrganizers", "SUCCESS", "Saved " + organizers.length + " organizers to sheet", null);
      return createResponse({ status: "success", message: "Organizers saved globally." });
    }

    // =================================================================================
    // ROUTE 10B: GET ORGANIZERS (RETRIEVE CREW LIST FROM DEDICATED SHEET)
    // =================================================================================
    else if (action === "getOrganizers") {
      const orgSheet = getOrCreateSheet("Organizers", ["Name", "Role", "Image URL", "Social Link", "Timestamp"]);
      const rows = orgSheet.getDataRange().getValues();
      const organizers = [];
      
      for (let i = 1; i < rows.length; i++) {
        if (rows[i][0].toString().trim() !== "") {
          organizers.push({
            name: rows[i][0],
            role: rows[i][1],
            image: rows[i][2],
            social: rows[i][3]
          });
        }
      }
      return createResponse({ status: "success", organizers: organizers });
    }

    // =================================================================================
    // ROUTE 10C: SAVE SPONSORS (WRITE SPONSOR LIST TO DEDICATED SHEET)
    // =================================================================================
    else if (action === "saveSponsors") {
      const sponsors = data.sponsors;
      if (!sponsors || !Array.isArray(sponsors)) {
        logTransaction("saveSponsors", "ERROR", "Invalid sponsors payload", data);
        return createResponse({ status: "error", message: "Sponsors array is required." });
      }

      const spSheet = getOrCreateSheet("Sponsors", ["Name", "Logo URL", "Website", "Tier", "Timestamp"]);
      
      // Clear existing data (keep headers)
      if (spSheet.getLastRow() > 1) {
        spSheet.getRange(2, 1, spSheet.getLastRow() - 1, spSheet.getLastColumn()).clearContent();
      }
      
      // Write all sponsors
      for (let i = 0; i < sponsors.length; i++) {
        const sp = sponsors[i];
        spSheet.appendRow([
          sp.name || "",
          sp.logo || sp.image || "",
          sp.website || sp.link || "",
          sp.tier || "standard",
          new Date().toLocaleString()
        ]);
      }
      
      logTransaction("saveSponsors", "SUCCESS", "Saved " + sponsors.length + " sponsors to sheet", null);
      return createResponse({ status: "success", message: "Sponsors saved globally." });
    }

    // =================================================================================
    // ROUTE 10D: GET SPONSORS (RETRIEVE SPONSOR LIST FROM DEDICATED SHEET)
    // =================================================================================
    else if (action === "getSponsors") {
      const spSheet = getOrCreateSheet("Sponsors", ["Name", "Logo URL", "Website", "Tier", "Timestamp"]);
      const rows = spSheet.getDataRange().getValues();
      const sponsors = [];
      
      for (let i = 1; i < rows.length; i++) {
        if (rows[i][0].toString().trim() !== "") {
          sponsors.push({
            name: rows[i][0],
            logo: rows[i][1],
            image: rows[i][1],
            website: rows[i][2],
            link: rows[i][2],
            tier: rows[i][3]
          });
        }
      }
      return createResponse({ status: "success", sponsors: sponsors });
    }

    // =================================================================================
    // ROUTE 11: SCORE (UPDATE INDIVIDUAL ARCADE HIGHSCORES)
    // =================================================================================
    else if (action === "score") {
      const ticketId = (data.ticketId || "").toString().trim();
      const scoreVal = Number(data.score) || 0;
      const gameId = data.gameId; // "space", "tetris", or "pong"
      
      if (!ticketId || !gameId) {
        logTransaction("score", "ERROR", "Missing parameters in query", data);
        return createResponse({ status: "error", message: "Ticket ID and Game ID are required." });
      }
      
      const rows = regSheet.getDataRange().getValues();
      for (let i = 1; i < rows.length; i++) {
        if (String(rows[i][0]).trim() === ticketId) {
          var colNum = 9; // Col I: Galactic Core (space)
          if (gameId === "tetris") colNum = 10; // Col J: Mainframe Grid (tetris)
          if (gameId === "pong") colNum = 11; // Col K: Laser Paddle (pong)
          
          var cell = regSheet.getRange(i + 1, colNum);
          var currentVal = Number(cell.getValue()) || 0;
          
          if (scoreVal > currentVal) {
            cell.setValue(scoreVal);
            
            // Auto-sort registrations to rank top high scores at the top of the sheet
            regSheet.getRange(2, 1, regSheet.getLastRow() - 1, regSheet.getLastColumn())
                    .sort({ column: colNum, ascending: false });
                    
            logTransaction("score", "SUCCESS", `New highscore registered for ${ticketId} in ${gameId}: ${scoreVal}`, null);
            return createResponse({ status: "success", message: "New highscore successfully written!" });
          }
          
          return createResponse({ status: "success", message: "Existing highscore was higher. No update required." });
        }
      }
      logTransaction("score", "NOT_FOUND", "Failed to update highscore. Ticket ID not found: " + ticketId, data);
      return createResponse({ status: "error", message: "Ticket ID not found." });
    }

    // =================================================================================
    // ROUTE 11: JOIN TEAM / MATCHMAKING (SQUAD REGISTRATION LOG)
    // =================================================================================
    else if (action === "join_team") {
      const teamId = (data.teamId || "").trim();
      const name = (data.name || "").trim();
      const email = (data.email || "").toLowerCase().trim();
      const role = data.role || "developer";
      const track = data.track || "ai";
      
      if (!teamId || !name || !email) {
        logTransaction("join_team", "ERROR", "Missing parameters in registration payload", data);
        return createResponse({ status: "error", message: "Team ID, Name, and Email are required." });
      }
      
      matchSheet.appendRow([teamId, name, email, role, track, new Date().toLocaleString()]);
      logTransaction("join_team", "SUCCESS", `Member ${name} joined squad [${teamId}]`, { teamId, name, email });
      return createResponse({ status: "success", message: "Successfully appended matchmaking listing." });
    }
    
    // =================================================================================
    // ROUTE 12: DEFAULT REGISTER TICKET (SAVES SEAT NUMBER)
    // =================================================================================
    else {
      if (!data.ticketId || !data.email) {
        logTransaction("register", "ERROR", "Null ticket id or email", data);
        return createResponse({ status: "error", message: "Ticket ID and Email are required." });
      }

      // Check if registration already exists
      const rows = regSheet.getDataRange().getValues();
      let foundIndex = -1;
      for (let i = 1; i < rows.length; i++) {
        if (rows[i][3].toString().toLowerCase().trim() === data.email.toLowerCase().trim()) {
          foundIndex = i + 1;
          break;
        }
      }

      if (foundIndex !== -1) {
        // Update existing row
        regSheet.getRange(foundIndex, 1).setValue(data.ticketId);
        regSheet.getRange(foundIndex, 2).setValue(data.timestamp || new Date().toLocaleString());
        regSheet.getRange(foundIndex, 3).setValue(data.name || "");
        regSheet.getRange(foundIndex, 5).setValue(data.github || "");
        regSheet.getRange(foundIndex, 6).setValue(data.role || "");
        regSheet.getRange(foundIndex, 7).setValue(data.track || "");
        regSheet.getRange(foundIndex, 8).setValue(data.seatNumber || "");
        logTransaction("register", "SUCCESS", "Updated existing ticket row for: " + data.email, { ticketId: data.ticketId, email: data.email });
      } else {
        // Insert new row
        regSheet.appendRow([
          data.ticketId,
          data.timestamp || new Date().toLocaleString(),
          data.name,
          data.email.toLowerCase().trim(),
          data.github,
          data.role,
          data.track,
          data.seatNumber,
          "", "", ""
        ]);
        logTransaction("register", "SUCCESS", "Appended new ticket registration: " + data.ticketId, { email: data.email });
      }
      return createResponse({ status: "success", message: "Registration written successfully." });
    }
  } catch (err) {
    logTransaction("CRITICAL", "ERROR", "Exception thrown in doPost: " + err.toString(), null);
    return createResponse({ status: "error", message: err.toString() });
  }
}

/**
 * Handle HTTP GET Requests. Display diagnostic HTML status screen.
 */
function doGet(e) {
  const htmlOutput = 
    `<!doctype html>
     <html>
       <head>
         <title>Tachyon Database Engine</title>
         <style>
           body { background-color: #0A0A08; color: #6db349; font-family: monospace; padding: 30px; line-height: 1.6; }
           .container { border: 1px solid #6db349; padding: 20px; background-color: #000000; box-shadow: 0 0 20px rgba(109,179,73,0.2); max-width: 600px; margin: auto; }
           h1 { font-size: 22px; text-transform: uppercase; border-bottom: 2px solid #6db349; padding-bottom: 10px; margin-top: 0; }
           .status { color: #ffffff; background-color: #222222; padding: 5px 10px; border-radius: 3px; font-weight: bold; }
           .details { color: #888888; font-size: 11px; margin-top: 20px; }
         </style>
       </head>
       <body>
         <div class="container">
           <h1>[TACHYON MAINFRAME ENGINE]</h1>
           <p>DATABASE STATUS: <span class="status">ONLINE & LINKED</span></p>
           <p>SYSTEM ACCESS LEVEL: 0 // ACTIVE</p>
           <p>ENDPOINT PROTOCOL: POST ROUTING READY</p>
           <div class="details">
             CONNECTED SPREADSHEET ID: ${ss.getId()}<br>
             LOCALE COMPILER: APPS_SCRIPT_V8 // 2026<br>
             CRAFT. CODE. CREATE.
           </div>
         </div>
       </body>
     </html>`;
  return HtmlService.createHtmlOutput(htmlOutput).setTitle("Tachyon Database Engine");
}

/**
 * Helper utility to return clean ContentService JSON strings
 */
function createResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
                       .setMimeType(ContentService.MimeType.JSON);
}
