require("dotenv").config();
const Twit = require("twit");
const axios = require("axios");

const T = new Twit({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  timeout_ms: 60 * 1000,
});

const current_date =
  Number(new Date().getMonth()) + 1 + "/" + new Date().getDate();

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
  .get("http://history.muffinlabs.com/date/" + current_date)
  .then(function (response) {
    if(response.data.data.Events) {
      let status_msg =
      "In the year " + response.data.data.Events[0].year + " , " + response.data.data.Events[0].text + 
        "\n#OnThisDay 📅 #DidYouKnow #DYK #date #Trivia 👌🏻 #numbers #interestingfacts 🤔 #Facts 💭 #interesting #KnowTheFacts #Facts #FactsMatter #TodayInHistory " +
        day_based_hashtag[new Date().getDay()];
      T.post(
        "statuses/update",
        { status: status_msg.substring(0, 280) },
        function (err, data, response) {
          // console.log(data)
        }
      );
    }
  })
  .catch(function (error) {
    console.log(error);
  });
