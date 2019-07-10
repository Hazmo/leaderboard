const express = require("express");
const fs = require("graceful-fs");

const fileUtils = require("./utils/fileUtils.js/index.js");

const PORT = process.env.PORT || 4000;

const app = express();

app.use(express.json());

app.get("/", (req, res) => res.send(fileUtils.getJson()));

app.post("/", (req, res) => {
  console.log(req.body);
  fileUtils.saveJson(req.body);
  return res.send("POST called!");
});

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}`));
