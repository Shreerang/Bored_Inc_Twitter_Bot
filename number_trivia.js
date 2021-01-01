require("dotenv").config();
const Twit = require("twit");
const axios = require("axios");

const T = new Twit({
  consumer_key: process.env.consumer_key,
  consumer_secret: process.env.consumer_secret,
  access_token: process.env.access_token,
  access_token_secret: process.env.access_token_secret,
  timeout_ms: 60 * 1000,
});

const now = new Date();
const start = new Date(now.getFullYear(), 0, 0);
const diff = now - start;
const oneDay = 1000 * 60 * 60 * 24;
const day = Math.floor(diff / oneDay);

const day_based_hashtag = {
  0: "#SundayFunday #weekendvibes #WeekendKaVaar",
  1: "#MondayVibes",
  2: "#TuesdayThoughts",
  3: "#WednesdayWisdom",
  4: "#ThursdayThoughts",
  5: "#FridayFeeling",
  6: "#SundayFunday #weekendvibes #WeekendKaVaar",
};

axios
  .get("http://numbersapi.com/" + day)
  .then(function (response) {
    let status_msg =
      "📌Day " +
      day +
      " of " +
      new Date().getFullYear() +
      ": " +
      response.data +
      " 🧐💯\n" +
      day_based_hashtag[new Date().getDay()] +
      " #Numerology #Numbers #DidYouKnow #DYK #TodayShow #math";
    T.post(
      "statuses/update",
      { status: status_msg.substring(0, 280) },
      function (err, data, response) {
        // console.log(data)
      }
    );
  })
  .catch(function (error) {
    console.log(error);
  });
