const watchbot = require('@mapbox/watchbot');
const cf = require('@mapbox/cloudfriend');

const Parameters = {
  GitSha: { Type: 'String' },
  Cluster: { Type: 'String' },
  Family: { Type: 'String' }
};

const watcher = watchbot.template({
  cluster: cf.importValue(cf.sub('${Cluster}-cluster-arn')),
  service: 'ecs-telephone',
  family: cf.ref('Family'),
  serviceVersion: cf.ref('GitSha'),
  workers: 2,
  reservation: { cpu: 256, memory: 128 },
  env: { StackRegion: cf.region },
  notificationEmail: 'devnull@mapbox.com'
});

module.exports = watchbot.merge({ Parameters }, watcher);
