const express = require("express");
const router = express.Router();
const WorkerComment = require("../Models/WorkerComment");

router.route("/workerComment/:user").get(async function (req, res) {
  try {
    let page;
    if (req.query.page) {
      page = parseInt(req.query.page);
    } else {
      page = 1;
    }
    const limit = 10;

    let comments = await WorkerComment.find({
      reviewee: req.params.user,
    })
      .sort({ serviceDate: -1 })
      .limit(limit * page)
      .lean();
    res.send({ comments });
  } catch (error) {
    res.send(error);
  }
});
module.exports = router;
