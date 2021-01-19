require("dotenv").config();
const Twit = require("twit");
const axios = require("axios");
const fs = require("fs");
const Path = require("path");
const tweet = require("./image_thread.js");

const now = new Date();
const start = new Date(now.getFullYear(), 0, 0);
const diff = now - start;
const oneDay = 1000 * 60 * 60 * 24;
let day = Math.floor(diff / oneDay);

let nat_geo_img = "";
let nat_geo_img_title = "";
let nat_geo_explanation = "";

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
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  timeout_ms: 60 * 1000,
});

axios
  .get(
    "https://www.nationalgeographic.com/photography/proof/2017/04/39-photos-of-animals-in-action/_jcr_content/presentation-mode.pres.json"
  )
  .then(function (response) {
    nat_geo_img = response.data.items[0].items
      ? response.data.items[0].items[day].url
      : "";
    nat_geo_img_title = response.data.items[0].items
      ? response.data.items[0].items[day].altText
      : "";
    nat_geo_img_credit = response.data.items[0].items
      ? "Photograph by: " +
        response.data.items[0].items[day].credit.match(
          /<a [^>]+>([^<]+)<\/a>/
        )[1]
      : "";
    nat_geo_img_title =
      nat_geo_img_title +
      "\n\n" +
      nat_geo_img_credit +
      "\n\n" +
      " #NationalGeographic #Photograph #photography #Photos #photo #Explore #wallpaper #DidYouKNow #DYK " +
      day_based_hashtag[new Date().getDay()];
    nat_geo_explanation = response.data.items[0].items
      ? response.data.items[0].items[day].caption
      : "";
    downloadImage(nat_geo_img).then(() => {
      const img_path = Path.resolve(__dirname, "images", "img.jpg");
      const b64content = fs.readFileSync(img_path, { encoding: "base64" });

      T.post(
        "media/upload",
        { media_data: b64content },
        function (err, data, response) {
          var mediaIdStr = data.media_id_string;
          var altText = nat_geo_img_title;
          var meta_params = {
            media_id: mediaIdStr,
            alt_text: { text: altText },
          };

          T.post(
            "media/metadata/create",
            meta_params,
            function (err, data, response) {
              if (!err) {
                var params = {
                  status: nat_geo_img_title.substring(0, 280),
                  media_ids: [mediaIdStr],
                };
                tweet(
                  params,
                  nat_geo_explanation
                    .replace(/(<([^>]+)>)/gi, "")
                    .match(/.{1,280}/g)
                );
              }
            }
          );
        }
      );
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
