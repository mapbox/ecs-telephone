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
  notificationEmail: 'devnull@mapbox.com',
  watchbotVersion: '1c8fdc5094b0a9ec2fb364382f5a7aeb85f44294'
});

module.exports = watchbot.merge({ Parameters }, watcher);
