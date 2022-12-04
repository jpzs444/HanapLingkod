const express = require("express");
const router = express.Router();
const WorkerComment = require("../Models/WorkerComment");
const { generateAccessToken, authenticateToken } = require("../Helpers/JWT");

router
  .route("/workerComment/:user")
  .get(authenticateToken, async function (req, res) {
    try {
      let page;
      if (req.query.page) {
        page = parseInt(req.query.page);
      } else {
        page = 1;
      }
      const limit = 10;
      let filter = { reviewee: req.params.user, deleteflag: false };
      if (req.query.rating != undefined) {
        filter["rating"] = req.query.rating;
      }
      // console.log(filter);
      let comments = await WorkerComment.find(filter)
        .sort({ serviceDate: -1 })
        .limit(limit * page)
        .lean();
      res.send({ comments });
    } catch (error) {
      res.send(error);
    }
  });
module.exports = router;
