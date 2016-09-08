const watchbot = require('watchbot');
const cf = require('cloudfriend');

const Parameters = {
  GitSha: { Type: 'String' },
  Cluster: { Type: 'String' }
};

const watcher = watchbot.template({
  cluster: cf.ref('Cluster'),
  service: 'ecs-telephone',
  serviceVersion: cf.ref('GitSha'),
  watchbotVersion: '87fc503d963c4769b76d36988c361c62e9d03984',
  workers: 1,
  reservation: { cpu: 256, memory: 128 },
  env: { StackRegion: cf.region },
  notificationEmail: 'devnull@mapbox.com'
});

module.exports = watchbot.merge({ Parameters }, watcher);
