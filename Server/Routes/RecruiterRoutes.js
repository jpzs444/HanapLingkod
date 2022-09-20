const express = require("express");
const router = express.Router();
const Recruiter = require("../Models/Recruiters");

router.route("/Recruiter").get(function (req, res) {
  Recruiter.find({}, function (err, found) {
    if (found) {
      res.send(found);
    } else {
      res.send("No such data found");
    }
  });
});

//////specific///

router
  .route("/Recruiter/:id")
  .get(function (req, res) {
    Recruiter.findOne({ _id: req.params.id }, function (err, found) {
      if (found) {
        res.send(found);
      } else {
        res.send("No such data found");
      }
    });
  })
  .put(function (req, res) {
    Recruiter.findOneAndUpdate(
      { _id: req.params.id },
      {
        profilePic: "psssic",
      },
      function (err) {
        if (!err) {
          res.send("Updated Successfully");
        } else {
          res.send(err);
        }
      }
    );
  })

  .delete(function (req, res) {
    Recruiter.findOneAndDelete({ _id: req.params.id }, function (err) {
      if (!err) {
        res.send("Deleted Successfully");
      } else {
        res.send(err);
      }
    });
  });

module.exports = router;
