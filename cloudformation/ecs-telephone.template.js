const watchbot = require('@mapbox/watchbot');
const cf = require('@mapbox/cloudfriend');
const categorizer = require('@mapbox/categorizer');

const Parameters = {
  GitSha: { Type: 'String' },
  Cluster: { Type: 'String' },
  Team: categorizer.team('platform'),
  CostCategory: categorizer.category(['rd'])
};

const watcher = watchbot.template({
  cluster: cf.ref('Cluster'),
  service: 'ecs-telephone',
  family: categorizer.family(),
  serviceVersion: cf.ref('GitSha'),
  workers: 1,
  reservation: { cpu: 256, memory: 128 },
  env: { StackRegion: cf.region },
  notificationEmail: 'devnull@mapbox.com'
});

module.exports = watchbot.merge({ Parameters }, watcher);
