const jsonfile = require("jsonfile");
const FILE = "mvc.json";

exports.saveLeaderboard = obj => {
  jsonfile.writeFileSync(FILE, obj);
};

exports.saveLeadboardBackup = () => {
  jsonfile.writeFileSync(`${FILE}.backup-${Date.now()}`, this.getLeaderboard())

}

exports.getLeaderboard = () => {
  return jsonfile.readFileSync(FILE, {throws: false});
};
