const express = require("express");
const router = express.Router();
const notification = require("../Helpers/PushNotification");
const RequestPost = require("../Models/RequestPost");
const dayjs = require("dayjs");
const PostComment = require("../Models/PostComment");

router
  .route("/request-post")
  .get(async function (req, res) {
    try {
      let page;
      if (req.query.page) {
        page = parseInt(req.query.page);
      } else {
        page = 1;
      }
      const limit = 10;

      let result = await RequestPost.find({})
        .sort({ date: -1 })
        .limit(limit * page)
        .lean()
        .exec();
      res.send(result);
    } catch (error) {
      res.send(error);
    }
  })
  .post(async function (req, res) {
    try {
      let startTime = dayjs(
        req.body.serviceDate + " " + req.body.startTime
      ).toISOString();

      console.log(startTime);
      const requestPost = new RequestPost({
        recruiterId: req.body.recruiterId,
        ServiceID: req.body.ServiceID,
        postDescription: req.body.postDescription,
        serviceDate: req.body.serviceDate,
        startTime: startTime,
        minPrice: req.body.minPrice,
        maxPrice: req.body.maxPrice,
        address: req.body.address,
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
      let query = await RequestPost.find({ _id: req.params.id }).lean().exec();
      let comments = await PostComment.find({
        _id: {
          $in: query[0].postCommentId,
        },
      }).exec();
      console.log(comments);
      res.send({ post: query, comment: comments });
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
    PostComment.deleteMany(
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

      const comment = await PostComment.create(
        [
          {
            workerId: req.body.workerId,
            message: req.body.message,
          },
        ],
        { session }
      );
      console.log(comment[0]._id);
      await RequestPost.findOneAndUpdate(
        { _id: req.params.id },
        {
          $push: { postCommentId: comment[0]._id },
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
