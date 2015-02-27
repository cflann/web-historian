var worker = require('../workers/htmlfetcher');
var CronJob = require('cron').CronJob;


module.exports = function() {
  var job = new CronJob({
    cronTime: '00 */1 * * * *',
    onTick: worker,
    start: true,
    timeZone: 'America/Los_Angeles'
  });
  console.log('set up worker');

};
