console.log("\x1Bc");

const fs = require("fs"),
  { authInit } = require("./auth"),
  { google } = require("googleapis"),
  summaryIncludeMandatory = "myke";
summaryIncludeOptional1 = "off work";
summaryIncludeOptional2 = "holiday";

const getSoonestHoliday = auth =>
  new Promise((resolve, reject) => {
    const calendar = google.calendar({ version: "v3", auth });
    calendar.events.list(
      {
        calendarId: "primary",
        timeMin: new Date().toISOString(), // includes today, at least with non-timestamped events
        maxResults: 100,
        singleEvents: true,
        orderBy: "startTime"
      },
      (err, res) => {
        if (err) return reject("The API returned an error: " + err);
        const events = res.data.items;
        if (!events.length) return reject("No upcoming events found.");

        const holidays = events
          .map(e => {
            e.name = e.summary.toLowerCase();
            return e;
          })
          .filter(
            // myke * off work/holiday (terrible code but I'm tired)
            e =>
              e.name.includes(summaryIncludeMandatory) &&
              (e.name.includes(summaryIncludeOptional1) ||
                e.name.includes(summaryIncludeOptional2))
          )
          .map(e => {
            e.date = new Date(e.start.dateTime || e.start.date);
            return e;
          });

        if (!holidays) return reject("No upcoming holidays");

        return resolve(holidays[0]); // soonest
      }
    );
  });

const doSomethingMagical = holiday => {
  let daysToGo = (holiday.date - new Date()) / 1000 / 60 / 60 / 24;
  // 0 if today, 1 if tomorrow, ..
  daysToGo = Math.ceil(daysToGo);
  console.log(
    daysToGo === 0
      ? "Off work today!"
      : `${daysToGo} days to go until "${holiday.summary}"`
  );
};

authInit()
  .then(getSoonestHoliday)
  .catch(console.error)
  .then(doSomethingMagical);
