const mongoose = require("mongoose");
Worker = require("../Models/Workers");
const Recuiter = require("../Models/Recuiters");

//middleware check if username already exist
function ifRecruiterExist(req, res, next) {
  Recuiter.findOne({ username: req.query.username })
    .select("username")
    .lean()
    // .count()
    .then((result) => {
      if (result) {
        res.status(408).json({ error: "timeou11t 408" });
      } else {
        next();
      }
    });
}
function ifWorkerExist(req, res, next) {
  Worker.findOne({ username: req.query.username })
    .select("username")
    .lean()
    // .count()
    .then((result) => {
      if (result) {
        res.status(408).json({ error: "timeou11t 408" });
      } else {
        next();
      }
    });
}
module.exports = { ifRecruiterExist, ifWorkerExist };
