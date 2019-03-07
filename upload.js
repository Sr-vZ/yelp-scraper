const fs = require('fs');
const readline = require('readline');
const {
    google
} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

yelpData = JSON.parse(fs.readFileSync('yelpBIZdetail.json'))

// Load client secrets from a local file.
fs.readFile('yelp_credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Sheets API.
    authorize(JSON.parse(content), uploadData);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
    const {
        client_secret,
        client_id,
        redirect_uris
    } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getNewToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
    });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error while trying to retrieve access token', err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) return console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
            callback(oAuth2Client);
        });
    });
}

/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */

//  yelp project sheet https://docs.google.com/spreadsheets/d/1Gq2YHbBt9Z0gy8AnAQolwv6lfMFMQRrwv97-OrgtR-0/edit#gid=0
yelpSearch = []

function uploadData(auth) {
    const sheets = google.sheets({
        version: 'v4',
        auth
    });
    // this.sheetsService.spreadsheets.values.append({
    sheets.spreadsheets.values.append({
        spreadsheetId: '1Gq2YHbBt9Z0gy8AnAQolwv6lfMFMQRrwv97-OrgtR-0',
        range: 'Results',
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        resource: {
            values: [
                [yelpData[0].business_name, yelpData[0].phone_number, yelpData[0].business_address,yelpData[0].business_website],
                [yelpData[1].business_name, yelpData[1].phone_number, yelpData[1].business_address,yelpData[1].business_website]
            ],
        },
        auth:auth
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        // const rows = res.data.values;
        // if (rows.length) {
        //     console.log('URLs:');
        //     // Print columns A and E, which correspond to indices 0 and 4.
        //     rows.map((row) => {
        //         // console.log(`${row[0]}, ${row[4]}`);
        //         console.log(`${row[0]}`)
        //         yelpSearch.push({
        //             url: row[0]
        //         })
        //     });
        //     fs.writeFileSync('yelpSearch.json', JSON.stringify(yelpSearch))
        // } else {
        //     console.log('No data found.');
        // }
    });
}