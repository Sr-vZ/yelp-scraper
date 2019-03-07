const fs = require('fs')
const puppeteer = require('puppeteer');

URLlist = []
temp = JSON.parse(fs.readFileSync('yelpSearch.json'))
for (i = 0; i < temp.length; i++) {
    URLlist[i] = temp[i].url
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
            data = document.querySelectorAll('.lemon--div__373c0__1mboc.businessName__373c0__1fTgn.border-color--default__373c0__2oFDT')
            for (d = 0; d < data.length; d++) {
                if (data[d]) {
                    if (data[d].querySelector('a').href.indexOf('adredir') < 0)
                        jsonData.push({
                            yelpBIZpage: data[d].querySelector('a').href
                        })
                }

            }
            return jsonData
        })
        yelpDB = yelpDB.concat(yelpbiz)
    }
    // await page.goto('https://example.com');
    // await page.screenshot({path: 'example.png'});
    fs.writeFileSync('yelpBIZlist.json',JSON.stringify(yelpDB))
    await browser.close();
})();