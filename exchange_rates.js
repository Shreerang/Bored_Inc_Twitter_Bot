require("dotenv").config();
const Twit = require("twit");
const axios = require("axios");

const T = new Twit({
  consumer_key: process.env.consumer_key,
  consumer_secret: process.env.consumer_secret,
  access_token: process.env.access_token,
  access_token_secret: process.env.access_token_secret,
  timeout_ms: 60 * 1000
});

let yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);

const current_date =
  yesterday.getFullYear() +
  "-" +
  (yesterday.getMonth() + 1) +
  "-" +
  yesterday.getDate();

const flags = {
  CAD: "🇨🇦",
  HKD: "🇭🇰",
  ISK: "🇮🇸",
  PHP: "🇵🇭",
  DKK: "🇩🇰",
  HUF: "🇭🇺",
  CZK: "🇨🇿",
  GBP: "🇬🇧",
  RON: "🇷🇴",
  SEK: "🇸🇪",
  IDR: "🇮🇩",
  INR: "🇮🇳",
  BRL: "🇧🇷",
  RUB: "🇷🇺",
  HRK: "🇭🇷",
  JPY: "🇯🇵",
  THB: "🇹🇭",
  CHF: "🇨🇭",
  EUR: "🇪🇺",
  MYR: "🇲🇾",
  BGN: "",
  TRY: "",
  CNY: "🇨🇳",
  NOK: "",
  NZD: "",
  ZAR: "",
  MXN: "🇲🇽",
  SGD: "🇸🇬",
  AUD: "🇦🇺",
  ILS: "",
  KRW: "",
  PLN: "",
  USD: "🇺🇸"
};

function getPercentageChange(oldNumber, newNumber) {
  let decreaseValue = oldNumber - newNumber;
  return (decreaseValue / oldNumber) * 100;
}

axios
  .get("https://api.exchangeratesapi.io/latest?base=USD")
  .then(function(response) {
    let list_string = "Today's currency exchange rates: \n\n";
    let yesterday_rate = "";
    let promises = [];
    let current_rates = [];
    for (var rate in response.data.rates) {
      if (
        rate === "INR" ||
        rate === "CAD" ||
        rate === "GBP" ||
        rate === "EUR" ||
        rate === "SGD" ||
        rate === "AUD" ||
        rate === "CNY"
      ) {
        yesterday_rate_url =
          "https://api.exchangeratesapi.io/" +
          current_date +
          "?base=USD&symbols=" +
          rate;
        promises.push(axios.get(yesterday_rate_url));
        current_rates.push({
          currency: rate,
          current_rate: response.data.rates[rate].toFixed(2)
        });
      }
    }
    axios.all(promises).then(function(results) {
      results.forEach(function(response, index) {
        let percent_change = getPercentageChange(
          current_rates[index].current_rate,
          response.data.rates[Object.keys(response.data.rates)[0]].toFixed(2)
        );
        list_string =
          list_string +
          //   flags["USD"] +
          flags[rate] +
          "1 USD is " +
          current_rates[index].current_rate +
          " " +
          current_rates[index].currency +
          (percent_change > 0 ? " down by " : " up by ") +
          percent_change +
          "% compared to yesterday" +
          "\n";
      });
      list_string =
        list_string +
        "\n#currency #exchange #rates #dollar #dollars #currencytrading";
      console.log(list_string);
    });
    T.post("statuses/update", { status: list_string }, function(
      err,
      data,
      response
    ) {
      // console.log(data)
    });
  })
  .catch(function(error) {
    console.log(error);
  });
