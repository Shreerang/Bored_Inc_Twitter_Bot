require('dotenv').config();
const Twit = require('twit');
const axios = require('axios');
const fs = require('fs');
const Path = require('path');
const puppeteer = require('puppeteer');

puppeteer.launch().then(async browser => {
    const page = await browser.newPage();

    await page.goto('http://chintoo.com/comics-strips/');

    const imgs = await page.$$eval('.entry-comic img', imgs => imgs.map(img => img.getAttribute('src')));

    let tweet_msg = "Chintoo is the most popular & favorite #marathi #cartoon #comicstrip that has brought a smile to several #Punekars over the years.\n\nEnjoy your daily dose of @Chintoo_toon #Chintoo\n\n#pune #sakal #MondayVibes #TuesdayThoughts #WednesdayWisdom #ThursdayThoughts #FridayFeeling #weekendvibes #WeekendKaVaar"
    
    downloadImage(imgs[0]).then(() => {
        const img_path = Path.resolve(__dirname, 'images', 'chintoo.jpg')
        const b64content = fs.readFileSync(img_path, { encoding: 'base64' })
    
        T.post('media/upload', { media_data: b64content }, function (err, data, response) {
            var mediaIdStr = data.media_id_string
            var altText = "Chintoo Cartoon strip"
            var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }
        
            T.post('media/metadata/create', meta_params, function (err, data, response) {
                if (!err) {
                var params = { status: tweet_msg.substring(0, 240), media_ids: [mediaIdStr] }
            
                T.post('statuses/update', params, function (err, data, response) {
                    // console.log(data)
                })
                }
            })
        })
    })

    await browser.close();
  });


const T = new Twit({
    consumer_key: process.env.consumer_key,
    consumer_secret: process.env.consumer_secret,
    access_token: process.env.access_token,
    access_token_secret: process.env.access_token_secret,
    timeout_ms: 60*1000,
})

async function downloadImage (image_path) {
    const url = image_path
    const path = Path.resolve(__dirname, 'images', 'chintoo.jpg')
    const writer = fs.createWriteStream(path)

    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
    })

    response.data.pipe(writer)

    return new Promise((resolve, reject) => {
        writer.on('finish', resolve)
        writer.on('error', reject)
    })
}