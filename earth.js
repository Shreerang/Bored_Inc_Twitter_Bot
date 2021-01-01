require("dotenv").config();
const Twit = require("twit");
const axios = require("axios");
const fs = require("fs");
const Path = require("path");
// const tweet = require("./thread.js");
// const text_tweet = require("./text_thread.js");

const current_date = new Date();
current_date.setDate(current_date.getDate() - 2);
const date =
  current_date.getFullYear() +
  "-" +
  (Number(current_date.getMonth()) + 1) +
  "-" +
  current_date.getDate();

const url_date =
  current_date.getFullYear() +
  "/" +
  (Number(current_date.getMonth()) + 1) +
  "/" +
  current_date.getDate();

const nasa_api_key = process.env.nasa_api_key;
let nasa_img = "";
// let nasa_img_title = "";
// let nasa_explanation = "";
let tweet_status = ""; // @TODO: Figure out a way to display complete discription

const day_based_hashtag = {
  0: "#SundayFunday #weekendvibes #WeekendKaVaar",
  1: "#MondayVibes",
  2: "#TuesdayThoughts",
  3: "#WednesdayWisdom #WallpaperWednesday",
  4: "#ThursdayThoughts",
  5: "#FridayFeeling",
  6: "#SundayFunday #weekendvibes #WeekendKaVaar",
};

const T = new Twit({
  consumer_key: process.env.consumer_key,
  consumer_secret: process.env.consumer_secret,
  access_token: process.env.access_token,
  access_token_secret: process.env.access_token_secret,
  timeout_ms: 60 * 1000,
});

// axios
//   .get(
//     "https://api.nasa.gov/EPIC/api/natural/date/" +
//       date +
//       "/?api_key=" +
//       nasa_api_key
//   )
//   .then(function (response) {
//     // console.log(response.data);
//     // let nasa_images = [];
//     // for (let i = 0; i < response.data.length; i++) {
//     //   nasa_images.push(
//     //     "https://api.nasa.gov/EPIC/archive/natural/" +
//     //       url_date +
//     //       "/png/" +
//     //       response.data[i].image +
//     //       ".png?api_key=" +
//     //       nasa_api_key
//     //   );
//     // }
//   })
//   .catch(function (error) {
//     console.log(error);
//   });

var images = [
  "http://i.imgur.com/2OO33vX.jpg",
  "http://i.imgur.com/qOwVaSN.png",
  "http://i.imgur.com/Vo5mFZJ.gif",
];

var gifshot = require("gifshot");
var base64ImageToFile = require("base64image-to-file");
const path = Path.resolve(__dirname, "images");
gifshot.createGIF({ images: images, numFrames: images.length }, function (obj) {
  if (!obj.error) {
    base64ImageToFile(obj.image, path, "animation.gif", function (err) {
      if (err) {
        alert(err);
      } else {
        alert("Should be all good");
      }
    });
  }
});
