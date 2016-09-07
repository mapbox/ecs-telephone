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
  workers: 1,
  reservation: { cpu: 256 },
  env: { StackRegion: cf.region }
});

module.exports = watchbot.merge({ Parameters }, watcher);
