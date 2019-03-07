const sheets = require('./sheet.js');
const fs = require('fs')

yelpData = JSON.parse(fs.readFileSync('yelpBIZdetail.json'))
values = []
for (i = 0; i < yelpData.length; i++) {
  values.push([
    yelpData[i].business_name,
    yelpData[i].phone_number,
    yelpData[i].business_address,
    yelpData[i].business_website,
    yelpData[i].business_rating,
    yelpData[i].business_reviews,
    yelpData[i].services_offered,
    yelpData[i].yelpBIZpage
  ])
}
console.log(values[0])
sheets.append(
  // "Results!A2", [
  //   // ["data 1", "data 2", "data3"]
  //   values
  // ]
  "Results!A2",values
);