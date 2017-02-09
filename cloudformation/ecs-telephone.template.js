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
  watchbotVersion: '1bf97387eb62bd0d6906ab3593fb4248aa1e5051',
  workers: 2,
  watchers: 2,
  reservation: { cpu: 256, memory: 128 },
  env: { StackRegion: cf.region },
  notificationEmail: cf.ref('AlarmEmail')
});

module.exports = watchbot.merge({ Parameters }, watcher);
