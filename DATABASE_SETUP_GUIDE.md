# Google Sheets Database Setup Guide

This guide will help you connect your website's **Admission Inquiry** form directly to a secure **Google Sheet** inside your Google Drive. 

Whenever a viewer submits the form on your website, their details (Timestamp, Student Name, Parent Name, Phone, Program, and Message) will instantly save as a new row in your spreadsheet.

---

## 🛠️ Step-by-Step Setup Instructions

### 1. Create Your Google Sheet
1. Open [Google Sheets](https://sheets.google.com/) and click **Blank Spreadsheet**.
2. Name your spreadsheet at the top: `THE YASHAS V ACADEMY - Inquiry Database`.
3. In the first row, type the following column headers (A1 to F1):
   * **A1**: `Timestamp`
   * **B1**: `Student Name`
   * **C1**: `Parent Name`
   * **D1**: `Phone Number`
   * **E1**: `Program of Interest`
   * **F1**: `Message / Notes`
4. Bold and style the headers so it looks clean!

---

### 2. Add the Cloud Script Database API
1. In your Google Sheet menu bar, click on **Extensions** ➔ **Apps Script**.
2. Delete any template code currently inside the editor (delete the empty `myFunction`).
3. **Copy and Paste** the exact script block below into the editor:

```javascript
function doPost(e) {
  try {
    // Open your active spreadsheet database
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getSheets()[0]; // Targets the first sheet tab
    
    // Parse the JSON data sent from the website
    var data = JSON.parse(e.postData.contents);
    
    // Assemble the row details
    var row = [
      new Date(), // Current Date & Time
      data.studentName,
      data.parentName,
      "'" + data.phone, // Prepends single quote to treat phone as text (keeps '+' and leading zeros)
      data.program,
      data.message
    ];
    
    // Append row to the bottom of your sheet
    sheet.appendRow(row);
    
    // Return a secure CORS-friendly JSON confirmation
    return ContentService.createTextOutput(JSON.stringify({ result: "success" }))
                         .setMimeType(ContentService.MimeType.JSON);
  } catch(error) {
    // Return error trace
    return ContentService.createTextOutput(JSON.stringify({ result: "error", message: error.toString() }))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. Click the 💾 **Save** icon at the top (or press `Ctrl + S`).

---

### 3. Deploy the Apps Script as a Web App
1. Click the blue **Deploy** button at the top-right and select **New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Fill in the configuration details exactly as follows:
   * **Description**: `Admissions Inquiry API`
   * **Execute as**: **Me (your_email@gmail.com)**
   * **Who has access**: **Anyone** *(This is critical so your website can send data without asking parents to sign in!)*
4. Click **Deploy**.
5. Google will ask you to **Authorize Access**. Click **Authorize Access**, choose your Google account, click **Advanced** (at the bottom), and then click **Go to Untitled project (unsafe)** to grant script permissions to write to your Sheet.
6. Copy the generated **Web App URL** (it ends in `/exec`).

---

### 4. Connect Your Website
1. Open your project's [app.js](file:///C:/Users/Admin/.gemini/antigravity/scratch/edu-blueprint/app.js) file.
2. Go to **line 80** where the `DATABASE_URL` is defined:
   ```javascript
   const DATABASE_URL = 'YOUR_GOOGLE_SHEETS_WEB_APP_URL';
   ```
3. Replace `'YOUR_GOOGLE_SHEETS_WEB_APP_URL'` with the **Web App URL** you copied in Step 3, for example:
   ```javascript
   const DATABASE_URL = 'https://script.google.com/macros/s/AKfycby...exec';
   ```
4. Save the [app.js](file:///C:/Users/Admin/.gemini/antigravity/scratch/edu-blueprint/app.js) file.

---

## 🚀 How to Access and Manage Your Data
* **Where is it?**: Open [Google Drive](https://drive.google.com/) or Google Sheets at any time on your computer or the official Google Sheets app on your phone.
* **Notifications**: If you want Google Sheets to notify you by email every time a new inquiry is submitted:
  1. In your sheet, go to **Tools** ➔ **Notification settings** ➔ **Edit notifications**.
  2. Select "Any changes are made" and "Email right away".
* **Spreadsheet Power**: You can filter, sort, format, print, or export this sheet to PDF/Excel at any time using Google Sheets' native tools.
