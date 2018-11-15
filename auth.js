const fs = require("fs");
// const readline = require("readline");
// const readline = require("readline-promise");
var readline = require("readline-promise").default;
const { google } = require("googleapis");

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = "./token.json";
const CREDENTIALS_PATH = "./credentials.json";

const getFile = filePath =>
  new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      err ? reject(`Error loading ${filePath}`) : resolve(JSON.parse(data));
    });
  });

module.exports = {
  authInit: () =>
    new Promise((resolve, reject) => {
      getFile(CREDENTIALS_PATH)
        .then(authorize)
        .catch(reject)
        .then(resolve);
    })
};

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
const authorize = credentials =>
  new Promise((resolve, reject) => {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );

    // Check if we have previously stored a token.
    // fs.readFile(TOKEN_PATH, (err, token) => {
    getFile(TOKEN_PATH)
      .then(token => {
        oAuth2Client.setCredentials(token);
        return resolve(oAuth2Client);
      })
      .catch(err => {
        console.log(`Creating new ${TOKEN_PATH}`);
        getAuthUrl(oAuth2Client)
          .then(authUrl => getAccessToken(authUrl, oAuth2Client))
          .catch(err => {
            throw new Error(`Token error:\n${err}`);
          })
          .then(oAuth2Client => {
            console.log("\nGood to go! Please re-run the script.");
          })
          .catch(console.error);
      });
  });

const getAuthUrl = oAuth2Client =>
  new Promise(resolve => {
    resolve(
      oAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES
      })
    );
  });
/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
const getAccessToken = (authUrl, oAuth2Client) =>
  new Promise((resolve, reject) => {
    console.log("Authorize this app by visiting this url:", authUrl);

    const rlp = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rlp.questionAsync("\nEnter the code from that page here: ").then(code => {
      rlp.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return reject("Error retrieving access token");
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
          if (err) return reject("Couldn't get oAuthClient with token");
          console.log("Token stored to", TOKEN_PATH);
        });
        resolve(oAuth2Client);
      });
    });
  });
