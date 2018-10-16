var stream = require('stream');
var util = require('util');
let jsonToCsv = require('./jsonToCsv');
let j2c = new jsonToCsv();
var Transform = stream.Transform;

function Convertor( options) { 
  Transform.call(this, {objectMode:true});
}
util.inherits(Convertor, Transform);

Convertor.prototype._transform = function (obj, enc, cb) {   
    console.log('asach');
    let  respArr=  JSON.parse(obj.respArr)
     respArr = respArr.map((x, i) => {
        return {
            id: x.id,
            first_name: x.first_name,
            last_name: x.last_name,
            email: x.email,
            gender: x.gender,
            ip_address: x.ip_address,
            address: x.address.street + ' ' + x.address.City + ' ' + x.address.State + ' ' + x.address.Country
        }
    });
    let csvData = j2c.convert(respArr, obj.pgNo);   
    if (obj.pgNo === 1) this.push(csvData.keys);
    csvData.valueSet.forEach(v => {
        this.push(v);
    });  
  cb();
};

module.exports=Convertor;

