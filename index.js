const fs = require('fs');
const request = require('request');
let jsonToCsv = require('./jsonToCsv');
const options = require('./authConfig.json');
const transformConvertor = require('./streams.js');

let fileName = `output/testOutput_${Date.parse(new Date)}.csv`;
let csvWriter = fs.createWriteStream(fileName);

let j2c = new jsonToCsv();

function responseAPI(options, pgNo) {
    return new Promise((resp, rej) => {
        options.qs = { page_number: pgNo };
        request(options, function (err, res) {
            if (err) {
                console.dir(err)
                rej(err);
            }
            if (res.statusCode !== 404) { resp(res); }
            else { resp(res); }
        })
    })
}

//////////////////////////

let dataOver = false, pgNo = 1;

function callFetch(pgNo) {
    var t = new transformConvertor();
    return responseAPI(options, pgNo).then((resp) => {
        if (resp.statusCode === 200) {
            t.write({ respArr: resp.body, pgNo: pgNo });
            t.pipe(csvWriter);
            pgNo++;
            return callFetch(pgNo).then(() => { });
        }
        else if (resp.statusCode === 404) {
            t.end();
            console.log('data Over');
        }
    })
}


//*******************************************************


callFetch(pgNo)
    .then((x) => {
        console.log('wrote all data to file');
        process.exit();
    });

module.exports = { callFetch: callFetch, fileName: fileName };






