const watchbot = require('@mapbox/watchbot');
const cf = require('cloudfriend');

const Parameters = {
  GitSha: { Type: 'String' },
  Cluster: { Type: 'String' },
  VolumeName: { Type: 'String' }
};

const watcher = watchbot.template({
  cluster: cf.ref('Cluster'),
  service: 'ecs-telephone',
  serviceVersion: cf.ref('GitSha'),
  workers: 1,
  reservation: { cpu: 256, memory: 128 },
  mounts: {
    container: [cf.sub('/mnt/tmp/${volume}', { volume: cf.ref(VolumeName) })],
    host: ['']
  }
  env: { StackRegion: cf.region },
  notificationEmail: 'devnull@mapbox.com',
  watchbotVersion: '1d94902f7ea2a58764bdea1fd5304fcae6485bec'
});

module.exports = watchbot.merge({ Parameters }, watcher);
