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
  watchbotVersion: 'f6466a76daee447a1929dbd5d069821ac476d685',
  workers: 2,
  watchers: 2,
  reservation: { cpu: 256, memory: 128 },
  env: { StackRegion: cf.region },
  notificationEmail: cf.ref('AlarmEmail')
});

module.exports = watchbot.merge({ Parameters }, watcher);
