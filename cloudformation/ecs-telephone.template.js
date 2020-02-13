const watchbot = require("@mapbox/watchbot");
const cf = require("@mapbox/cloudfriend");

const Parameters = {
  GitSha: { Type: "String" },
  Cluster: { Type: "String" },
  Family: { Type: "String" },
  Table: { Type: "String" },
  PageLimit: { Type: "Number" }
};

const watcher = watchbot.template({
  cluster: cf.ref("Cluster"),
  service: "ecs-telephone",
  family: cf.ref("Family"),
  serviceVersion: cf.ref("GitSha"),
  command: ["./index.js"],
  minSize: 1,
  reservation: { cpu: 512, softMemory: 256 },
  env: {
    StackRegion: cf.region,
    StackName: cf.stackName,
    Table: cf.ref("Table"),
    PageLimit: cf.ref("PageLimit")
  },
  notificationEmail: "devnull@mapbox.com",
  permissions: [
    {
      Effect: "Allow",
      Action: ["dynamodb:GetItem", "dynamodb:Scan"],
      Resource: [cf.arn("dynamodb", cf.sub("table/coredb-production-main"))]
    },
    {
      Effect: "Allow",
      Action: ["dynamodb:GetItem", "dynamodb:Scan"],
      Resource: [cf.arn("dynamodb", cf.sub("table/coredb-staging-main"))]
    },
    {
      Effect: "Allow",
      Action: ["s3:PutObject"],
      Resource: [
        cf.arn("s3", cf.sub("mapbox-billing-eng/test/${AWS::StackName}/*"))
      ]
    }
  ]
});

module.exports = cf.merge({ Parameters }, watcher);
