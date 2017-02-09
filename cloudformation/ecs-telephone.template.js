const watchbot = require('@mapbox/watchbot');
const cf = require('cloudfriend');

const Parameters = {
  GitSha: { Type: 'String' },
  Cluster: { Type: 'String' }
};

const watcher = watchbot.template({
  cluster: cf.ref('Cluster'),
  service: 'ecs-telephone',
  serviceVersion: cf.ref('GitSha'),
  workers: 1,
  reservation: { cpu: 256, memory: 128 },
  env: { StackRegion: cf.region },
  notificationEmail: 'devnull@mapbox.com',
  watchbotVersion: 'b525fccade5db53f54b9892febc330695f2a172d'
});

module.exports = watchbot.merge({ Parameters }, watcher);
