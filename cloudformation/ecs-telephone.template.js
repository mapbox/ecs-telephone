const watchbot = require('@mapbox/watchbot');
const cf = require('@mapbox/cloudfriend');

const Parameters = {
  GitSha: { Type: 'String' },
  Cluster: { Type: 'String' },
  Family: { Type: 'String' },
  DiskReservationSize: {
    Description: 'Disk reservation size, in GB',
    Type: 'Number'
  }
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
  placementConstraints: [
    {
      Type: 'memberOf',
      Expression: cf.join(['attribute:availableDiskSpace >= ', cf.ref('DiskReservationSize')])
    }
  ]
});

module.exports = cf.merge({ Parameters }, watcher);
