require("dotenv").config();
const Twit = require("twit");
const axios = require("axios");
const fs = require("fs");
const Path = require("path");
const tweet = require("./image_thread.js");

const current_hour = new Date().getHours();
let tourism_img = "";
let tourism_img_title = "";

const tourism_countries = [
  "France",
  "Spain",
  "United States",
  "China",
  "Italy",
  "Turkey",
  "Mexico",
  "Germany",
  "Thailand",
  "United Kingdom",
  "Australia",
  "India",
  "Japan",
  "Austria",
  "Greece",
  "Hong Kong",
  "Malaysia",
  "Russia",
  "Portugal",
  "Canada",
  "Poland",
  "Netherlands",
  "New Zealand",
  "Singapore",
];

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

axios
  .get(
    "https://api.unsplash.com/photos/random?client_id=" +
      process.env.unsplash_access_key +
      "&query='" +
      tourism_countries[current_hour] +
      " tourism'"
  )
  .then(function (response) {
    tourism_img = response.data
      ? response.data.links.download
      : response.data.links.download_location;
    tourism_img_title = response.data.description
      ? response.data.description
      : "";
    tourism_img_credit =
      "Today's photograph by: " +
      (response.data.user.twitter_username
        ? "@" + response.data.user.twitter_username
        : response.data.user.first_name + " " + response.data.user.last_name) +
      (response.data.user
        ? ". You can follow the photographer at " +
          response.data.user.portfolio_url
        : ".");
    tourism_img_title =
      tourism_img_title +
      "\n" +
      tourism_img_credit +
      "\n" +
      " #Photograph #photography #Photos #photo #Explore #wallpaper #tourism " +
      "#" +
      tourism_countries[current_hour].replace(/ +/g, "");
    day_based_hashtag[new Date().getDay()];
    downloadImage(tourism_img).then(() => {
      const img_path = Path.resolve(__dirname, "images", "img.jpg");
      const b64content = fs.readFileSync(img_path, { encoding: "base64" });

      T.post("media/upload", { media_data: b64content }, function (
        err,
        data,
        response
      ) {
        var mediaIdStr = data.media_id_string;
        var altText = tourism_img_title;
        var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } };

        T.post("media/metadata/create", meta_params, function (
          err,
          data,
          response
        ) {
          if (!err) {
            var params = {
              status: tourism_img_title.substring(0, 280),
              media_ids: [mediaIdStr],
            };
            tweet(params);
          }
        });
      });
    });
  })
  .catch(function (error) {
    console.log(error);
  });

async function downloadImage(image_path) {
  const url = image_path;
  const path = Path.resolve(__dirname, "images", "img.jpg");
  const writer = fs.createWriteStream(path);

  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}
