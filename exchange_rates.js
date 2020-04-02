require("dotenv").config();
const Twit = require("twit");
const axios = require("axios");
const tweet = require("./thread.js");

const T = new Twit({
  consumer_key: process.env.consumer_key,
  consumer_secret: process.env.consumer_secret,
  access_token: process.env.access_token,
  access_token_secret: process.env.access_token_secret,
  timeout_ms: 60 * 1000
});

const ria_link = "https://mbsy.co/cSszq";
const remitly_link = "http://remit.ly/9d5mua";

const ria_remit_msg =
  "Now is a great time to send money to your loved ones using @RiaFinancial for your #Remittance today - " +
  ria_link +
  " Complete your first #moneytransfer and Ria will send you a $10 @amazon #GiftCard to thank you for choosing Ria!\n#dollars #currencytrading #news #money #market";

const remitly_remint_msg =
  "Now is a great time to send money to your loved ones using @remitly for your #Remittance today - " +
  remitly_link +
  "Remitly usually offers first time customers a higher exchange rate so that you can send more money home!\n#dollars #currencytrading #news #money #market";

let today =
  new Date().getFullYear() +
  "-" +
  (new Date().getMonth() + 1) +
  "-" +
  new Date().getDate();

let yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);

const current_date =
  yesterday.getFullYear() +
  "-" +
  (yesterday.getMonth() + 1) +
  "-" +
  yesterday.getDate();

const flags = {
  INR: "🇮🇳",
  CNY: "🇨🇳",
  MXN: "🇲🇽",
  PHP: "🇵🇭",
  EUR: "🇪🇺",
  CAD: "🇨🇦",
  JPY: "🇯🇵",
  HKD: "🇭🇰",
  ISK: "🇮🇸",
  DKK: "🇩🇰",
  HUF: "🇭🇺",
  CZK: "🇨🇿",
  GBP: "🇬🇧",
  RON: "🇷🇴",
  SEK: "🇸🇪",
  IDR: "🇮🇩",
  BRL: "🇧🇷",
  RUB: "🇷🇺",
  HRK: "🇭🇷",
  THB: "🇹🇭",
  CHF: "🇨🇭",
  MYR: "🇲🇾",
  BGN: "🇧🇬",
  TRY: "🇹🇷",
  NOK: "🇳🇴",
  NZD: "🇳🇿",
  ZAR: "🇿🇦",
  SGD: "🇸🇬",
  AUD: "🇦🇺",
  ILS: "🇮🇱",
  KRW: "🇰🇷",
  PLN: "🇵🇱",
  USD: "🇺🇸"
};

function getPercentageChange(oldNumber, newNumber) {
  let decreaseValue = oldNumber - newNumber;
  return ((decreaseValue / oldNumber) * 100).toFixed(2);
}

// Publish this tweet only if it is a week day. Don't tweet on Saturday and Sunday
if (new Date().getDay() !== 0 || new Date().getDay() !== 6) {
  axios
    .get("https://api.exchangeratesapi.io/" + today + "?base=USD")
    .then(function(response) {
      let list_string =
        "Today's #currency #exchangerates in comparison to yesterday against the US #dollar: \n";
      let promises = [];
      let current_rates = [];
      for (var rate in response.data.rates) {
        if (
          rate === "INR" ||
          rate === "CNY" ||
          rate === "MXN" ||
          rate === "PHP" ||
          rate === "EUR" ||
          rate === "CAD" ||
          rate === "JPY"
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
            flags[current_rates[index].currency] +
            " is " +
            current_rates[index].current_rate +
            " " +
            current_rates[index].currency +
            (percent_change > 0 ? "🔻by " : "🔺by ") +
            Math.abs(percent_change) +
            "%" +
            "\n";
        });
        list_string = list_string + "#forex #forextrader #forextrading";
        tweet(list_string, [ria_remit_msg, remitly_remint_msg]);
      });
    })
    .catch(function(error) {
      console.log(error);
    });
}
