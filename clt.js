var request = require('request');
var async = require('async');

console.info('start client');

var settings = { rate: 10, max: 5000};
var timeout = 1000 / settings.rate;
var stats = { outstanding: 0, errors: 0, codes: {}, skips: 0 };

setInterval(function() {
  if (stats.outstanding >= settings.max) {
    stats.skips++;
    return;
  }
  stats.outstanding++;
  request({
      method: 'POST',
      maxSockets: 35,
      headers: {
        'connection': 'close'
      },
      url: 'https://localhost:4000'
    }, function(err, res){
    stats.outstanding--;
    if (err) {
      stats.errors++;
      stats.lasterr = err;
    }
    else {
      if (!stats.codes[res.statusCode]) {
        stats.codes[res.statusCode] = 1;
      }
      else {
        stats.codes[res.statusCode]++;
      }
    }
  });
}, timeout);

setInterval(function() {
  console.info('stats:', stats);
}, 10000);

console.info('client started');