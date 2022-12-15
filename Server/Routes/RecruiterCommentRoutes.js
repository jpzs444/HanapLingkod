const express = require("express");
const RecruiterComment = require("../Models/RecruiterComment");
const router = express.Router();
const WorkerComment = require("../Models/WorkerComment");
const { authenticateToken } = require("../Helpers/JWT");

// CORS
const cors = require("cors");
router.use(cors({ origin: "*" }));

router
  .route("/RecruiterComment/:user")
  .get(authenticateToken, async function (req, res) {
    try {
      let page;
      if (req.query.page) {
        page = parseInt(req.query.page);
      } else {
        page = 1;
      }
      const limit = 10;

      let filter = { reviewee: req.params.user };
      if (req.query.rating != undefined) {
        filter["rating"] = req.query.rating;
      }
      // console.log(filter);

      let comments = await RecruiterComment.find(filter)
        .sort({ serviceDate: -1 })
        .limit(limit * page)
        .lean();
      res.send({ comments });
    } catch (error) {
      res.send(error);
    }
  });
module.exports = router;
