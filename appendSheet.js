// BEFORE RUNNING:
// ---------------
// 1. If not already done, enable the Google Sheets API
//    and check the quota for your project at
//    https://console.developers.google.com/apis/api/sheets
// 2. Install the Node.js client library by running
//    `npm install googleapis --save`
const fs = require('fs');
const {
  google
} = require('googleapis');
var sheets = google.sheets('v4');

yelpData = JSON.parse(fs.readFileSync('yelpBIZdetail.json'))

authorize(function (authClient) {
  var request = {
    // The ID of the spreadsheet to update.
    spreadsheetId: '1Gq2YHbBt9Z0gy8AnAQolwv6lfMFMQRrwv97-OrgtR-0', // TODO: Update placeholder value.

    // The A1 notation of a range to search for a logical table of data.
    // Values will be appended after the last row of the table.
    range: 'Results', // TODO: Update placeholder value.

    // How the input data should be interpreted.
    valueInputOption: 'RAW', // TODO: Update placeholder value.

    // How the input data should be inserted.
    insertDataOption: 'INSERT_ROWS', // TODO: Update placeholder value.

    resource: {
      // TODO: Add desired properties to the request body.
      values: [
        [yelpData[0].business_name, yelpData[0].phone_number, yelpData[0].business_address, yelpData[0].business_website],
        [yelpData[1].business_name, yelpData[1].phone_number, yelpData[1].business_address, yelpData[1].business_website]
      ],
    },

    auth: authClient,
  };

  sheets.spreadsheets.values.append(request, function (err, response) {
    if (err) {
      console.error(err);
      return;
    }

    // TODO: Change code below to process the `response` object:
    console.log(JSON.stringify(response, null, 2));
  });
});

function authorize(callback) {
  // TODO: Change placeholder below to generate authentication credentials. See
  // https://developers.google.com/sheets/quickstart/nodejs#step_3_set_up_the_sample
  //
  // Authorize using one of the following scopes:
  //   'https://www.googleapis.com/auth/drive'
  //   'https://www.googleapis.com/auth/drive.file'
  //   'https://www.googleapis.com/auth/spreadsheets'
  // var authClient = null;
  var authClient = 'https://www.googleapis.com/auth/spreadsheets';

  if (authClient == null) {
    console.log('authentication failed');
    return;
  }
  callback(authClient);
}