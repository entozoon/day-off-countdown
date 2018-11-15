console.log("\x1Bc");

const fs = require("fs");
const { authInit } = require("./auth");
const { google } = require("googleapis");

const listEvents = auth => {
  const calendar = google.calendar({ version: "v3", auth });
  calendar.events.list(
    {
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      maxResults: 100,
      singleEvents: true,
      orderBy: "startTime"
    },
    (err, res) => {
      if (err) return console.log("The API returned an error: " + err);
      const events = res.data.items;
      if (events.length) {
        console.log("Upcoming 10 events:");
        events.map((event, i) => {
          const start = event.start.dateTime || event.start.date;
          console.log(`${start} - ${event.summary}`);
        });
      } else {
        console.log("No upcoming events found.");
      }
    }
  );
};

// authInit();
// .then(listEvents)
// .catch(e => console.log);

authInit()
  .then(listEvents)
  .catch(e => console.log(e));
