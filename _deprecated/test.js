/*var SerialPort = require("serialport").SerialPort
var serialPort = new SerialPort("COM6", {
    baudrate: 9600,
    dataBits: 8,
    stopBits: 1,
    parity: 'none'
});*/
require('serialport').list(function(err,ports){
    console.log(ports);
});/*
serialPort.on('open', function () {
        serialPort.write('\x0c' + '', function (err, bytesWritten) {
            if (err) {
                console.log('ERROR: ', err.message);
                //res.jsonp({success: false, msg: err.messaage})
            } else {
                //res.jsonp({success: true, msg: bytesWritten})
            }
        });
});*/