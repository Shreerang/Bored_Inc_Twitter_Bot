require("dotenv").config();
const Twit = require("twit");
const axios = require("axios");
const fs = require("fs");
const Path = require("path");
const tweet = require("./image_thread.js");

const current_date =
  new Date().getFullYear() +
  "-" +
  (Number(new Date().getMonth()) + 1) +
  "-" +
  new Date().getDate();
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
  consumer_key: process.env.consumer_key,
  consumer_secret: process.env.consumer_secret,
  access_token: process.env.access_token,
  access_token_secret: process.env.access_token_secret,
  timeout_ms: 60 * 1000,
});

axios
  .get(
    "https://www.nationalgeographic.com/photography/photo-of-the-day/_jcr_content/.gallery.json"
  )
  .then(function (response) {
    nat_geo_img = response.data.items
      ? response.data.items[0].image.uri
      : response.data.items[0].renditions[14].uri;
    nat_geo_img_title = response.data.items
      ? response.data.items[0].image.alt_text
      : response.data.items[0].image.title;
    nat_geo_img_credit = response.data.items
      ? "Photo credits: " + response.data.items[0].image.credit
      : "";
    nat_geo_img_title =
      nat_geo_img_title +
      "\n" +
      nat_geo_img_credit +
      "\n" +
      " #NationalGeographic #Photograph #DidYouKnow #DYK #photography #Photos #photo #Explore #wallpaper #DidYouKNow #DYK" +
      day_based_hashtag[new Date().getDay()];
    nat_geo_explanation = response.data.items
      ? response.data.items[0].image.caption
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
