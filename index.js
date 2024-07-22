//tutorial: https://dev.to/mcrowder65/creating-a-nodejs-script-that-can-write-to-google-docs-4hpk

//Step 0: run "npm i" to install all necessary (really only 1) package(s).
//1. Go to https://console.cloud.google.com/apis/dashboard and enable Google Docs API and Gmail API.
//2. Create Credentials from there and make sure to include the scope of seeing all doc files (docs.readonly or something like that).
// You will need to create a new file called credentials.json and store your new credentials there (or just renam the file you download from GCP).
//3. Run Application with "node ." --> It'll give you a link to authorize your app. You should then be sent to a generic local host page.
// On this page (normal to say could not reach) you will find your token in the URL of the page between "code=" and "&scope"
// Grab this code and put it in the console!
// 4. You're done, now you can run this app infiite amount of times to do your dirty bidding 0_0


//======================= FIRST TIME EXECUTION =================//
const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const wait = require('node:timers/promises').setTimeout; //to be able to wait.

const SCOPES = ["https://www.googleapis.com/auth/documents"]; // If modifying these scopes, delete token.json.
const TOKEN_PATH = "token.json"; // The file token.json stores the user's access and refresh tokens, and is created automatically on first time.

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id,
        client_secret,
        redirect_uris[0]
    );

    fs.readFile(TOKEN_PATH, (err, token) => { // Check if for a previously stored a token.
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
        access_type: "offline",
        scope: SCOPES
    });
    console.log("Authorize this app by visiting this url:", authUrl);
    rl.question("Enter the code from that page here: ", code => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error("Error retrieving access token", err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), error => {
                if (error) return console.error(error);
                console.log("Token stored to", TOKEN_PATH);
            });
            callback(oAuth2Client);
        });
    });
}

//======================= MAIN EXECUTION =================//
// Authorize a client with credentials, then call the Gmail API.
fs.readFile("credentials.json", (err, content) => {
    if (err) return console.log("Error loading client secret file:", err);
    authorize(JSON.parse(content), () => console.log("authorized!"));
});


//const { google } = require("googleapis");
const token = require("./token.json");
const credentials = require("./credentials.json");
const { exit } = require("process");

//Helper authorization every time we do an edit.
async function authorize() {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id,
        client_secret,
        redirect_uris[0]
    );
    oAuth2Client.setCredentials(token);
    return oAuth2Client;
}

//MAIN:
async function main() {
    let DOCUMENT_ID = "";
    //Fetch URL 
    try {
        rl.question("Please input the URL of the document you would like to scan: ", input => {
            rl.close();
            const searchTerm1 = 'document/d/';
            const index1 = input.indexOf(searchTerm1);
            const searchTerm2 = '/edit';
            const index2 = input.indexOf(searchTerm2);
            DOCUMENT_ID = input.slice(index1 + 11, index2);
            console.log("Your document ID is ", DOCUMENT_ID);
        });
    }
    catch (err) { console.log("ERROR: ", err); }
    //Wait for URL
    while (DOCUMENT_ID === "") { await wait(1_000); }
    //Authorize & Access
    console.log("working...");
    const auth = await authorize();
    const docs = google.docs({ version: "v1", auth });
    //Update Document
    await docs.documents.batchUpdate({
        auth,
        documentId: DOCUMENT_ID,
        requestBody: {
            requests: [
                {
                    insertText: {
                        location: {
                            index: 1
                        },
                        text: "Hello World!\n"
                    }
                }
            ]
        }
    });

    //done!
    console.log("done!");
}

main();
