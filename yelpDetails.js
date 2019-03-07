const fs = require('fs')
const puppeteer = require('puppeteer');

URLlist = []
temp = JSON.parse(fs.readFileSync('yelpBIZlist.json'))
for (i = 0; i < temp.length; i++) {
    URLlist[i] = temp[i].yelpBIZpage
}
console.log(URLlist);

(async () => {

    const browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox']
    });
    const page = await browser.newPage();


    yelpDB = []
    for (let i = 0; i < URLlist.length; i++) {
        await page.goto(URLlist[i]);
        await page.waitForSelector('body')


        yelpbiz = await page.evaluate(() => {
            jsonData = []
            // data = document.querySelectorAll('.mapbox-text')
            phone = ''
            if (document.querySelector('.biz-phone')) {
                phone = document.querySelector('.biz-phone').innerText
            }
            business = ''
            if (document.querySelector('.biz-page-header')) {
                business = document.querySelector('.biz-page-header').innerText.split('\n')[0]
            }
            bizAddress = ''
            if (document.querySelector('address')) {
                bizAddress = document.querySelector('address').innerText.trim()
            }
            rating = ''
            if (document.querySelector('.i-stars').querySelector('img')) {
                rating = document.querySelector('.i-stars').querySelector('img').alt
            }
            reviews = ''
            if (document.querySelector('.review-count')) {
                reviews = document.querySelector('.review-count').innerText
            }
            services = ''
            if (document.querySelector('.js-services-container')) {
                temp = document.querySelector('.js-services-container').querySelectorAll('li')
                for (s = 0; s < temp.length; s++) {
                    services += temp[s].innerText.trim() + ', '
                }
            }
            bizWeb = ''
            if (document.querySelector('.biz-website')) {
                x = document.querySelector('.biz-website').querySelector('a').href
                t = x.substring(x.indexOf('=') + 1, x.indexOf('&'))
                bizWeb = decodeURIComponent(t)
            }

            jsonData.push({
                business_name: business,
                phone_number: phone,
                business_address: bizAddress,
                business_website: bizWeb,
                business_rating: rating,
                business_reviews: reviews,
                services_offered: services,
                yelpBIZpage: document.URL
            })



            return jsonData
        })
        yelpDB = yelpDB.concat(yelpbiz)
    }
    // await page.goto('https://example.com');
    // await page.screenshot({path: 'example.png'});
    fs.writeFileSync('yelpBIZdetail.json', JSON.stringify(yelpDB))
    await browser.close();
})();