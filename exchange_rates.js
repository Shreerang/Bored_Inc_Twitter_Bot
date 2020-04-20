require("dotenv").config();
const Twit = require("twit");
const axios = require("axios");
const tweet = require("./thread.js");

const T = new Twit({
  consumer_key: process.env.consumer_key,
  consumer_secret: process.env.consumer_secret,
  access_token: process.env.access_token,
  access_token_secret: process.env.access_token_secret,
  timeout_ms: 60 * 1000,
});

const ria_link = "https://mbsy.co/cSszq";
const remitly_link = "http://remit.ly/9d5mua";
const transfer_wise_link = "https://transferwise.com/invite/u/913ff2";

let ria_remit_msg =
  "Now is a great time to send money to your loved ones using @RiaFinancial for your #Remittance today - " +
  ria_link +
  " Complete your first #moneytransfer and Ria will send you a $10 @amazon #GiftCard to thank you for choosing Ria!\n#dollars #currencytrading #news #money";

const remitly_remint_msg =
  "Now is a great time to send money to your loved ones using @remitly for your #Remittance today - " +
  remitly_link +
  "Remitly usually offers first time customers a higher exchange rate so that you can send more money home!\n#dollars #currencytrading #news #money #market";

const transfer_wise_msg =
  "Now is a great time to send money to your loved ones using @TransferWise for your #Remittance today - " +
  transfer_wise_link +
  "TransferWise offers a free international transfer for over $300 so you don't have to pay a transfer fee!\n#dollars #currencytrading #news #money #market #forextrader";

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
  USD: "🇺🇸",
};

function getPercentageChange(oldNumber, newNumber) {
  let decreaseValue = oldNumber - newNumber;
  return ((decreaseValue / oldNumber) * 100).toFixed(2);
}

// Publish this tweet only if it is a week day. Don't tweet on Saturday and Sunday
if (new Date().getDay() !== 0 && new Date().getDay() !== 6) {
  axios
    .get("https://api.exchangeratesapi.io/" + today + "?base=USD")
    .then(function (response) {
      let list_arr = [];
      let first_list = "";
      let second_list = "";
      let third_list = "";
      let fourth_list = "";
      let tweet_txt =
        "Today's #currency #exchangerates in comparison to yesterday against the US #dollar:\n";
      let sec_tweet_txt = "#forex #ForexMarket";
      let ter_tweet = "🤑💰💱💹";
      let promises = [];
      let current_rates = [];
      for (var rate in flags) {
        yesterday_rate_url =
          "https://api.exchangeratesapi.io/" +
          current_date +
          "?base=USD&symbols=" +
          rate;
        promises.push(axios.get(yesterday_rate_url));
        current_rates.push({
          currency: rate,
          current_rate: response.data.rates[rate].toFixed(2),
        });
      }
      axios.all(promises).then(function (results) {
        results.forEach(function (response, index) {
          let percent_change = getPercentageChange(
            current_rates[index].current_rate,
            response.data.rates[Object.keys(response.data.rates)[0]].toFixed(2)
          );
          list_arr.push(
            flags[current_rates[index].currency] +
              " is " +
              current_rates[index].current_rate +
              " " +
              current_rates[index].currency +
              (percent_change >= 0 ? "🔺by " : "🔻by ") +
              Math.abs(percent_change) +
              "%"
          );
        });
        for (let i = 0; i < list_arr.length; i++) {
          if (i < 7) {
            first_list = first_list + list_arr[i] + "\n";
          }
          if (i >= 7 && i < 17) {
            second_list = second_list + list_arr[i] + "\n";
          }
          if (i >= 17 && i < 27) {
            third_list = third_list + list_arr[i] + "\n";
          }
          if (i >= 27 && i < 32) {
            fourth_list = fourth_list + list_arr[i] + "\n";
          }
        }
        first_list = tweet_txt + first_list + "#forex";
        second_list = ter_tweet + "\n" + second_list + sec_tweet_txt;
        third_list = ter_tweet + "\n" + third_list + sec_tweet_txt;
        fourth_list = ter_tweet + "\n" + fourth_list + sec_tweet_txt;
        tweet(first_list, [
          second_list,
          third_list,
          fourth_list,
          ria_remit_msg,
          remitly_remint_msg,
          transfer_wise_msg,
        ]);
      });
    })
    .catch(function (error) {
      console.log(error);
    });
}
