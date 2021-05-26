require("dotenv").config();
const Twit = require("twit");
const axios = require("axios");
const fs = require("fs");
const Path = require("path");

const T = new Twit({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  timeout_ms: 60 * 1000,
});

const current_date =
  new Date().getFullYear() + "/" + (Number(new Date().getMonth()) + 1);
const today = current_date + "/" + new Date().getDate();
const url = "https://www.google.com/doodles/json/" + current_date + "?hl=en";

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
  .get(url)
  .then(function (response) {
    const data = response.data;
    let doodles_arr = [];
    if (data.length >= 1) {
      for (let i = 0; i < data.length; i++) {
        const date =
          data[i].run_date_array["0"] +
          "/" +
          data[i].run_date_array["1"] +
          "/" +
          data[i].run_date_array["2"];
        if (date === today) {
          doodles_arr.push(data[i]);
        }
      }
    }
    for (let j = 0; j < doodles_arr.length; j++) {
      let tweet_msg =
        "Today's #GoogleDoodle " +
        (doodles_arr[j].share_text.includes('Happy') ? 'wishes everyone a ' : (doodles_arr[j].share_text.includes('Celebrating') ? 'is ' : 'celebrates ')) + 
        doodles_arr[j].share_text +
        " 🎉\n" +
        "Find out more at - https://www.google.com/doodles/" +
        doodles_arr[j].name +
        "\n" +
        day_based_hashtag[new Date().getDay()] +
        " #Google #Doodle #DidYouKnow #DYK #InterestingFacts #celebrated #Facts #KnowTheFacts";

      downloadImage(doodles_arr[j].alternate_url, j).then(() => {
        const img_path = Path.resolve(
          __dirname,
          "images",
          "doodle_" + j + ".jpg"
        );
        const b64content = fs.readFileSync(img_path, { encoding: "base64" });

        console.log(tweet_msg)

        // T.post(
        //   "media/upload",
        //   { media_data: b64content },
        //   function (err, data, response) {
        //     var mediaIdStr = data.media_id_string;
        //     var altText = doodles_arr[j].title;
        //     var meta_params = {
        //       media_id: mediaIdStr,
        //       alt_text: { text: altText },
        //     };

        //     T.post(
        //       "media/metadata/create",
        //       meta_params,
        //       function (err, data, response) {
        //         if (!err) {
        //           var params = {
        //             status: tweet_msg.substring(0, 240),
        //             media_ids: [mediaIdStr],
        //           };

        //           T.post(
        //             "statuses/update",
        //             params,
        //             function (err, data, response) {
        //               // console.log(data)
        //             }
        //           );
        //         }
        //       }
        //     );
        //   }
        // );
      });
    }
  })
  .catch(function (error) {
    console.log(error);
  });

async function downloadImage(image_path, img_num) {
  const url = image_path;
  const path = Path.resolve(__dirname, "images", "doodle_" + img_num + ".jpg");
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
