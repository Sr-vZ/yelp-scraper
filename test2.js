/**
 * Append data to a Google Spreadsheet
 *
 * You will need a file called '.env' with the following values:
 * 
 * - GOOGLE_ID (Google oAuth Client ID)
 * - GOOGLE_SECRET (Google oAuth Client Secret)
 * - GOOGLE_REFRESH_TOKEN (Google oAuth Refresh Token)
 * - GOOGLE_SPREADSHEET_ID (Google Spreadsheet ID)
 *
 * Requires Google Sheet API  access enabled (and Google+ for oAuth):
 * https://console.developers.google.com/apis/api/sheets.googleapis.com/overview
 * https://console.developers.google.com/apis/api/plus.googleapis.com/overview
 *
 * API Documentation:
 * https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/append
 *
 */
'use strict'

require('dotenv').config()

const google = require('googleapis')
const sheets = google.sheets('v4')

const updateSpreadsheet = () => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_ID,
    process.env.GOOGLE_SECRET
  )

  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN
  })

  oauth2Client
  .refreshAccessToken((err, tokens) => {
    if (err) return console.error(err)
      
    oauth2Client.setCredentials({
      access_token: tokens.access_token
    })

    // The following call will create a spreadsheet and return an ID that can
    // be used with the API. Note that oAuth API can only be used to access
    // files it creates, not files already on a drive (unless you apply to
    // Google for additional privilages.)
    /*
    sheets.spreadsheets.create({ auth: oauth2Client }, (err, response) => {
     if (err) return console.error(err)
     console.log(`New Spreadsheet ID: ${response.spreadsheetId}`)
    })
    */
     
    sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
      range: 'Sheet1',
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        values: [
          [new Date().toISOString(), "Some value", "Another value"]
        ],
      },
      auth: oauth2Client
    }, (err, response) => {
      if (err) return console.error(err)
    })

  })
}

// Run at startup
updateSpreadsheet()

setInterval(() => {
  updateSpreadsheet()
}, 60000 * 60) // Run again every hour