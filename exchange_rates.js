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

// const current_date =
//   Number(new Date().getMonth()) + 1 + "/" + new Date().getDate();

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

axios
  .get("https://api.exchangeratesapi.io/latest?base=USD")
  .then(function(response) {
    let list_string = "Today's currency exchange rates: \n\n";
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
        list_string =
          list_string +
          flags["USD"] +
          "1 USD --> " +
          response.data.rates[rate].toFixed(2) +
          " " +
          rate +
          flags[rate] +
          "\n";
      }
    }
    list_string =
      list_string +
      "\n#currency #exchange #rates #dollar #dollars #currencytrading";
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
