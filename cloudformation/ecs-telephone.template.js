const watchbot = require('@mapbox/watchbot');
const cf = require('@mapbox/cloudfriend');

const Parameters = {
  GitSha: { Type: 'String' },
  Cluster: { Type: 'String' },
  Family: { Type: 'String' },
  maxSize: { Type: 'Number' }
};

const Resources = {
  MathRole: {
    Type: 'AWS::IAM::Role',
    Properties: {
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Effect: 'Allow',
            Principal: { Service: ['lambda.amazonaws.com'] },
            Action: ['sts:AssumeRole']
          }
        ]
      }
    }
  },
  MathLambda: {
    Type: 'AWS::Lambda::Function',
    Properties: {
      Handler: 'index.Handler',
      Role: cf.ref('MathRole'),
      Code: {
        ZipFile: cf.sub(`
          var response = require('cfn-response');
          exports.handler = function(event,context){
            var result = Math.min(parseInt(${cf.ref(Parameters.maxSize)}) / 10, 100)
            response.send(event, context, response.SUCCESS, {Value: Result})
          }
          `),
      },
      Runtime: 'nodejs6.10'
    }
  },
  customMathResource: {
    Type: 'AWS::CloudFormation::CustomResource',
    Properties: {
      ServiceToken: cf.getAtt('MathLambda', 'Arn'),
      max: cf.ref('maxSize')
    }
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
  notificationEmail: 'devnull@mapbox.com'
});













module.exports = cf.merge({ Parameters }, { Resources }, watcher);
