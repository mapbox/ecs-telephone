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
  workers: 10000,
  watchbotVersion: '0ed0f47261972cbe372177b4da80d21aefe461aa',
  reservation: { cpu: 2560, memory: 1280 },
  env: { StackRegion: cf.region },
  notificationEmail: 'devnull@mapbox.com'
});

module.exports = watchbot.merge({ Parameters }, watcher);
