var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name:'Customer Display Serial Interface',
  description: 'Listens for messages from HTTP request and display these messages to customer display through COM port',
  script: require('path').join(__dirname,'app.js')
});

svc.on('install',function(){
  svc.start();
  console.log('Install complete.');
  console.log('The service exists: ', svc.exists);
});

svc.install();