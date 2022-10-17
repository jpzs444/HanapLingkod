const express = require("express");
const router = express.Router();
const notification = require("../Helpers/PushNotification");
const RequestPost = require("../Models/RequestPost");
router
  .route("/request-post")
  .get(async function (req, res) {
    try {
      RequestPost.find({})
        .sort({ date: -1 })
        .exec(function (err, notif) {
          if (notif) {
            res.send(notif);
          } else {
            res.send("No such data found");
          }
        });
    } catch (error) {
      res.send(error);
    }
  })
  .post(async function (req, res) {
    try {
      const requestPost = new RequestPost({
        recruiterId: req.body.recruiterId,
        ServiceID: req.body.ServiceID,
        postDescription: req.body.postDescription,
        serviceDate: req.body.serviceDate,
        startTime: req.body.startTime,
        minPrice: req.body.minPrice,
        maxPrice: req.body.maxPrice,
        geometry: { type: "point", coordinates: [req.body.long, req.body.lat] },
        postToggle: 0,
      });
      requestPost.save(function (err) {
        if (!err) {
          res.send("New Request Created");
        } else {
          res.send(err);
        }
      });
    } catch (error) {
      res.send(error);
    }
  });
router
  .route("/request-post/:id")
  .get(async function (req, res) {
    try {
      RequestPost.findOne({ _id: req.params.id }).exec(function (err, notif) {
        if (notif) {
          res.send(notif);
        } else {
          res.send("No such data found");
        }
      });
    } catch (error) {
      res.send(error);
    }
  })
  .put(async function (req, res) {
    console.log("asd");
    RequestPost.findOneAndUpdate(
      { _id: req.params.id },
      {
        postDescription: req.body.postDescription,
        serviceDate: req.body.serviceDate,
        startTime: req.body.startTime,
        minPrice: req.body.minPrice,
        maxPrice: req.body.maxPrice,
        postToggle: req.body.postToggle,
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
  .delete(async function (req, res) {
    const session = await conn.startSession();
    const query = await RequestPost.findByIdAndDelete(
      {
        _id: req.params.id,
      },
      { session }
    );
    const { comments } = query;
    Comment.deleteMany(
      {
        _id: { $in: comments },
      },
      function (err) {
        if (err) {
          res.send(err);
        } else {
          console.log("comment succesfully deleted");
        }
      },
      { session }
    );
    res.send("success");
  });

router
  .route("/request-post-comment/:id")
  .post(async function (req, res) {
    const session = await conn.startSession();
    try {
      //initialize transactions
      session.startTransaction();
      // console.log(req.body);

      const comment = await Comment.create(
        [
          {
            workerId: req.body.workerId,
            comment: req.body.comment,
          },
        ],
        { session }
      );
      console.log(comment[0]._id);
      await RequestPost.findOneAndUpdate(
        { _id: req.params.id },
        {
          $push: { comments: comment[0]._id },
        },
        { session }
      );
      await session.commitTransaction();
      console.log("success");
      res.send("Succesfully Created");
    } catch (err) {
      console.log(err);
      await session.abortTransaction();
      res.status(500).send();
    }
  })
  .delete(async function (req, res) {
    const session = await conn.startSession();

    try {
      //initialize transactions
      session.startTransaction();

      await Comment.deleteOne(
        {
          _id: req.body.commentId,
        },
        { session }
      );
      await RequestPost.findOneAndUpdate(
        { _id: req.params.id },
        {
          $pull: { comments: req.body.commentId },
        },
        { session }
      );
      await session.commitTransaction();
      console.log("success");
      res.send("Succesfully Deleted");
    } catch (error) {
      console.log(err);
      await session.abortTransaction();
      res.status(500).send();
    }
  });

module.exports = router;
