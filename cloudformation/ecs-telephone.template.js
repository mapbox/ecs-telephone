const watchbot = require('@mapbox/watchbot');
const cf = require('cloudfriend');

const Parameters = {
  GitSha: { Type: 'String' },
  Cluster: { Type: 'String' },
  AlarmEmail: { Type: 'String' }
};

const watcher = watchbot.template({
  cluster: cf.ref('Cluster'),
  service: 'ecs-telephone',
  serviceVersion: cf.ref('GitSha'),
  watchbotVersion: '5984a62543dd769f86513735979dc0375cc69fde',
  workers: 2,
  watchers: 2,
  reservation: { cpu: 256, memory: 128 },
  env: { StackRegion: cf.region },
  notificationEmail: cf.ref('AlarmEmail'),
  errorThreshold: 2
});

module.exports = watchbot.merge({ Parameters }, watcher);
