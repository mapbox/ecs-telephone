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
  watchbotVersion: 'ae362c2fddf701a348db50494bc8bc052ac453ca',
  reservation: { cpu: 2560, memory: 1280 },
  env: { StackRegion: cf.region },
  notificationEmail: 'devnull@mapbox.com'
});

module.exports = watchbot.merge({ Parameters }, watcher);
