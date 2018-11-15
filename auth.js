const fs = require("fs");
// const readline = require("readline");
// const readline = require("readline-promise");
var readline = require("readline-promise").default;
const { google } = require("googleapis");

module.exports = {
  authInit: () =>
    new Promise((resolve, reject) => {
      const rlp = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      rlp.questionAsync("Test?").then(answer => {
        resolve("RESOLVING WITH: " + answer);
      });
    })
};

// // If modifying these scopes, delete token.json.
// const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];
// // The file token.json stores the user's access and refresh tokens, and is
// // created automatically when the authorization flow completes for the first
// // time.
// const TOKEN_PATH = "./token.json";

// module.exports = {
//   authInit: () =>
//     new Promise((resolve, reject) => {
//       // Load client secrets from a local file.
//       fs.readFile("credentials.json", (err, content) => {
//         if (err) reject("Error loading client secret file:", err);
//         // Authorize a client with credentials, then call the Google Calendar API.
//         authorize(JSON.parse(content)).then(resolve);
//       });
//     })
// };

// /**
//  * Create an OAuth2 client with the given credentials, and then execute the
//  * given callback function.
//  * @param {Object} credentials The authorization client credentials.
//  * @param {function} callback The callback to call with the authorized client.
//  */
// const authorize = credentials =>
//   new Promise((resolve, reject) => {
//     const { client_secret, client_id, redirect_uris } = credentials.installed;
//     const oAuth2Client = new google.auth.OAuth2(
//       client_id,
//       client_secret,
//       redirect_uris[0]
//     );

//     // Check if we have previously stored a token.
//     fs.readFile(TOKEN_PATH, (err, token) => {
//       console.log("checking token");
//       if (err)
//         getAccessToken(oAuth2Client)
//           .then(resolve)
//           .catch(e => {
//             console.log("token error");
//             console.log(e);
//           });
//       while (typeof token == "undefined") {
//         // Force it to hang here until input
//       }
//       console.log("shouldnt be here yet", token);
//       oAuth2Client.setCredentials(JSON.parse(token));
//       // callback(oAuth2Client);
//       resolve(oAuth2Client);
//     });
//   });

// /**
//  * Get and store new token after prompting for user authorization, and then
//  * execute the given callback with the authorized OAuth2 client.
//  * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
//  * @param {getEventsCallback} callback The callback for the authorized client.
//  */
// const getAccessToken = oAuth2Client =>
//   new Promise((resolve, reject) => {
//     const authUrl = oAuth2Client.generateAuthUrl({
//       access_type: "offline",
//       scope: SCOPES
//     });

//     const rlp = readline.createInterface({
//       input: process.stdin,
//       output: process.stdout,
//       terminal: true
//     });

//     console.log("Authorize this app by visiting this url:", authUrl);

//     rlp.questionAsync("Foo?").then(answer => {
//       console.log("Foo TYPED!", answer);
//     });

//     // rlp.questionAsync("Enter the code from that page here: ", code => {
//     //   console.log("CODE TYPED!", code);
//     //   rl.close();
//     //   oAuth2Client.getToken(code, (err, token) => {
//     //     if (err) return console.error("Error retrieving access token", err);
//     //     oAuth2Client.setCredentials(token);
//     //     // Store the token to disk for later program executions
//     //     fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
//     //       if (err) console.error(err);
//     //       console.log("Token stored to", TOKEN_PATH);
//     //     });
//     //     resolve(oAuth2Client);
//     //   });
//     // });
//   });
