const watchbot = require('@mapbox/watchbot');
const cf = require('@mapbox/cloudfriend');

const Parameters = {
  GitSha: { Type: 'String' },
  Cluster: { Type: 'String' },
  Family: { Type: 'String' }
};

const watcher = watchbot.template({
  cluster: cf.ref('Cluster'),
  service: 'ecs-telephone',
  family: cf.ref('Family'),
  serviceVersion: cf.ref('GitSha'),
  command: ['./index.js'],
  minSize: 1,
  reservation: { cpu: 256, memory: 128 },
  env: { StackRegion: cf.region },
  notificationEmail: 'devnull@mapbox.com',
});

watcher.Resources.WatchbotTask.Properties.ContainerDefinitions[0].MountPoints.push({
  ContainerPath: '/var',
  SourceVolume: 'var'
});

watcher.Resources.WatchbotTask.Properties.Volumes.push({
  Host: {
    SourcePath: '/var'
  },
  Name: 'docker-sock'
});

module.exports = cf.merge({ Parameters }, watcher);
