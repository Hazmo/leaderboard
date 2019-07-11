const jsonfile = require("jsonfile");
const FILE = process.env.ENVIRONMENT === "TEST" ? "mvc.test.json" : "mvc.json";
const aws = require("aws-sdk");

const S3_BUCKET = process.env.S3_BUCKET;
aws.config.region = "eu-west-2";

const s3 = new aws.S3();

exports.saveLeaderboard = obj => {
  jsonfile.writeFileSync(FILE, obj);

  const params = {
    Bucket: S3_BUCKET,
    Key: FILE,
    Body: JSON.stringify(obj)
  };

  s3.upload(params, (err, data) => {
    if (err) throw err;
    console.log(data.Location);
  });
};

exports.saveLeadboardBackup = async () => {
  const BACKUP_FILE = `${FILE}.backup-${Date.now()}`;
  const leaderboard = await this.getLeaderboard();

  const params = {
    Bucket: S3_BUCKET,
    Key: BACKUP_FILE,
    Body: JSON.stringify(leaderboard)
  };

  s3.upload(params, (err, data) => {
    if (err) throw err;
    console.log(data.Location);
  });

  return leaderboard;
};

exports.getLeaderboard = async () => {
  const params = {
    Bucket: S3_BUCKET,
    Key: FILE
  };

  const leaderboard_string = await s3
    .getObject(params)
    .promise()
    .then(res => res.Body.toString("utf-8"))
    .catch(err => err);

    console.log(leaderboard_string);

  return JSON.parse(leaderboard_string);
};
