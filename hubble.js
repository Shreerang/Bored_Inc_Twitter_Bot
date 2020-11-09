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
const day = Math.floor(diff / oneDay);

let hubble_img = "";
let hubble_img_title = "";
let hubble_explanation = "";

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
  .get("http://hubblesite.org/api/v3/image/" + day)
  .then(function (response) {
    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
    hubble_img = response.data.image_files
      ? response.data.image_files[
          response.data.image_files.length - 1
        ].file_url.split(".")[3] === "jpg"
        ? "https:" +
          response.data.image_files[response.data.image_files.length - 1]
            .file_url
        : "https:" +
          response.data.image_files[response.data.image_files.length - 2]
            .file_url
      : "";
    hubble_img_title = response.data.name ? response.data.name + "💫🌌🔭" : "";
    hubble_img_title =
      hubble_img_title +
      "\n" +
      " #Hubble30 #Hubble #space #SpaceForce #NASA #Photograph #photography #NASAatHome #Explore #wallpaper " +
      day_based_hashtag[new Date().getDay()];
    hubble_explanation = response.data.description
      ? response.data.description
      : "";
    downloadImage(hubble_img).then(() => {
      const img_path = Path.resolve(__dirname, "images", "img.jpg");
      const b64content = fs.readFileSync(img_path, { encoding: "base64" });

      T.post("media/upload", { media_data: b64content }, function (
        err,
        data,
        response
      ) {
        var mediaIdStr = data.media_id_string;
        var altText = hubble_img_title;
        var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } };

        T.post("media/metadata/create", meta_params, function (
          err,
          data,
          response
        ) {
          if (!err) {
            var params = {
              status: hubble_img_title.substring(0, 280),
              media_ids: [mediaIdStr],
            };
            tweet(
              params,
              hubble_explanation.replace(/(<([^>]+)>)/gi, "").match(/.{1,280}/g)
            );
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
