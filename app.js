var SerialPort = require("serialport").SerialPort
var serialPort = new SerialPort("COM6", {
    baudrate: 9600,
    dataBits: 8,
    stopBits: 1,
    parity: 'none'
});

serialPort.on('open', function () {
    var express = require('express');
    var app = express();
    var bodyParser = require('body-parser')

    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())
    
    app.get('/customerdisplay', function (req, res) {
        var msg = req.query.msg;
        msg = msg.replace("\n", "\x0a\x0d");
        serialPort.write('\x0c' + msg, function (err, bytesWritten) {
            if (err) {
                console.log('ERROR: ', err.message);
                res.jsonp({success: false, msg: err.messaage})
            } else {
                res.jsonp({success: true, msg: bytesWritten})
            }
        });
    });
    app.listen(2112, function () {
        console.log('Open app http://localhost:2112')
    });
});
/*

$.ajax({
  url: "http://localhost:2112/customerdisplay",
  dataType: "jsonp", jsonp: "callback", data: {msg: "Nguyen Hoai Nam\n42.00 Kc"},
  success: function(resp){console.log(resp)}
});

*/