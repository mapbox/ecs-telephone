var cf = require('cloudfriend');
var tape = require('tape');
var path = require('path');

tape('[template] is valid', function(assert) {
  cf.validate(path.resolve(__dirname, '..', 'cloudformation', 'ecs-telephone.template.js'))
    .then(() => {
      assert.pass('success');
      assert.end();
    })
    .catch(err =>  {
      assert.ifError(err, 'failed');
      assert.end();
    });
});
