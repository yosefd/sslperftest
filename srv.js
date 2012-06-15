var path = require('path');
var fs = require('fs');
var https = require('https');

console.info('start sslsrv');

var timeout = 60;

var options = {

  // key: readCertSync('sc_private_1024.pem'),
  // cert: readCertSync('sc_public_1024.pem')

  key: readCertSync('sc_private_2048.pem'),
  cert: readCertSync('sc_public_2048.pem')
};

function readCertSync(fileName) {
  return fs.readFileSync(path.join(__dirname, fileName));
}

var count = 0;
var stats = {};

setInterval(function() {
  stats = { reqpersec: (count / timeout) };
  count = 0;
  console.info('stats:', stats);
}, timeout * 1000);

https.createServer(options, function(req, res) {
  if (req.method === 'POST') {
    count++;
    res.end();
  }
  else {
    res.end(JSON.stringify(stats, null, 2));
  }
}).listen(4000);


console.info('sslsrv started');

