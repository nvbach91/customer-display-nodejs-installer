
/* EXAMPLE TO CALL THIS API
 
 $.ajax({
 url: 'http://localhost:2112/customerdisplay',
 dataType: 'jsonp', jsonp: 'callback', data: {msg: 'Nguyen Hoai Nam\n42.00 Kc'},
 success: function(resp){console.log(resp)}
 });
 
 */

//var dateFormat = require('dateformat');
var SERIALPORT = require('serialport');
var SerialPort = require('serialport').SerialPort;
var serialPort = null;
function initSerialPort() {
    var timeOutId = setTimeout(initSerialPort, 5000);

    if (serialPort !== null) {
        clearTimeout(timeOutId);
        //console.log(dateFormat(new Date(), 'isoDateTime') + ' Active: ' + serialPort.path);
    } else {
        console.log('Scanning for serial ports');
        SERIALPORT.list(function (err, ports) {
            var comPort = '';
            for (var i = 0; i < ports.length; i++) {
                var port = ports[i];
                if (port.pnpId && port.comName) {
                    if (port.pnpId.indexOf('USB') >= 0 && port.comName.indexOf('COM') >= 0) {
                        comPort = port.comName;
                        break;
                    }
                }
            }
            if (comPort !== '') {
                console.log('\tActive ' + comPort + ': Silicon Labs ');
                try {
                    serialPort = new SerialPort(comPort, {
                        baudrate: 9600,
                        dataBits: 8,
                        stopBits: 1,
                        parity: 'none'
                    });
                    serialPort.on('close', function () {
                        console.log('\tPort ' + comPort + ' closed');
                        serialPort = null;
                        timeOutId = setTimeout(initSerialPort, 5000);
                    });
                    serialPort.on('disconnect', function () {
                        console.log('\tPort ' + comPort + ' disconnected');
                        serialPort.close();
                    });
                } catch (err) {
                    console.log(err);
                }
            } else {
                console.log('\tNo serial ports are connected');
            }

        });
    }
}
;
function convertMessage(msg) {
    var res = '';
    for (var i = 0; i < msg.length; i++) {
        res += convertCharacter(msg[i]);
    }
    return res;
}
;
function convertCharacter(c) {
    // \x0a\x0d = newline (line feed + carriage return = cursor down 1 line and go to far left
    if (c === '\n') {
        return '\x0a\x0d';
    }
    var diacritics = 'ěéĚÉšŠčČřŘžŽýÝáÁíÍóÓďĎťŤňŇúůÚŮ'; // czech diacritics
    var nondiacrit = 'eeEEsScCrRzZyYaAiIoOdDtTnNuuUU';
    for (var i = 0; i < diacritics.length; i++) {
        if (c === diacritics[i]) {
            return nondiacrit[i];
        }
    }
    // return regular abc
    return c;
}

initSerialPort();

var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/customerdisplay', function (req, res) {
    var msg = req.query.msg;
    msg = convertMessage(msg);

    // \x0c = clear display, reset cursor to first position
    if (serialPort && serialPort.isOpen()) {
        serialPort.write('\x0c' + msg, function (err, bytesWritten) {
            if (err) {
                res.jsonp({success: false, msg: err.message});
            } else {
                res.jsonp({success: true, msg: msg});
            }
        });
    } else {
        res.jsonp({success: false, msg: 'Customer display is not connected'});
    }
});

/*var fs = require('fs');
var https = require('https');
var server = https.createServer({
    key: fs.readFileSync('./ssl/my.key'),
    cert: fs.readFileSync('./ssl/my.crt')
}, app)

server.listen(2112);*/

app.listen(2112, function () {
    console.log('Listening for custopmer display requests on http://localhost:2112');
});
