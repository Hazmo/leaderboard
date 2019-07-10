const jsonfile = require("jsonfile");
const FILE = "mvc.json";

exports.saveJson = obj => {
  jsonfile.writeFileSync(FILE, obj);
};

exports.getJson = () => {
  return jsonfile.readFileSync(FILE, {throws: false});
};
