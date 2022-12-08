const express = require("express");
const router = express.Router();
const notification = require("../Helpers/PushNotification");
const RequestPost = require("../Models/RequestPost");
const dayjs = require("dayjs");
const PostComment = require("../Models/PostComment");
const Recruiters = require("../Models/Recruiters");
const { authenticateToken } = require("../Helpers/JWT");
const { CheckIfBan } = require("../Helpers/banChecker");

router
  .route("/request-post")
  .get(
    // authenticateToken,
    async function (req, res) {
      try {
        let page;
        if (req.query.page) {
          page = parseInt(req.query.page);
        } else {
          page = 1;
        }
        const limit = 10;

        let result = await RequestPost.find({
          postToggle: true,
          deleteflag: false,
        })
          .sort({ date: -1 })
          .limit(limit * page)
          .lean()
          .exec();
        res.send(result);
      } catch (error) {
        res.send(error);
      }
    }
  )
  .post(authenticateToken, CheckIfBan, async function (req, res) {
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
        postToggle: 1,
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

router.route("/request-post-recruiter/:userId").get(
  // authenticateToken,
  async function (req, res) {
    try {
      let page;
      if (req.query.page) {
        page = parseInt(req.query.page);
      } else {
        page = 1;
      }
      const limit = 10;

      let result = await RequestPost.find({
        recruiterId: req.params.userId,
      })
        .sort({ date: -1 })
        .limit(limit * page)
        .lean()
        .exec();
      res.send(result);
    } catch (error) {
      res.send(error);
    }
  }
);

router
  .route("/request-post/:id")
  .get(authenticateToken, async function (req, res) {
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
  .put(authenticateToken, async function (req, res) {
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
  .delete(authenticateToken, async function (req, res) {
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
  .post(authenticateToken, async function (req, res) {
    const session = await conn.startSession();
    try {
      //initialize transactions
      session.startTransaction();
      // console.log(req.body);
      const post = await RequestPost.findOne({ _id: req.params.id })
        .select("recruiterId")
        .lean()
        .exec();
      const pushIDRecruiter = await Recruiters.findOne(
        { _id: post.recruiterId },
        { pushtoken: 1, _id: 0 }
      ).lean();
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
      console.log(post);
      console.log(pushIDRecruiter);
      await RequestPost.findOneAndUpdate(
        { _id: req.params.id },
        {
          $push: { postCommentId: comment[0]._id },
        },
        { session }
      );
      await session.commitTransaction();

      notification(
        [pushIDRecruiter.pushtoken],
        "New Comment on your Post!",
        "Kindly check your post. To stop receiving comments into your posts, you may turn off the status of your post in the posted requests.",
        { Type: "New Comment on post", id: req.params.id },
        post.recruiterId
      );

      console.log("success");
      res.send("Succesfully Created");
    } catch (err) {
      console.log(err);
      await session.abortTransaction();
      res.status(500).send();
    }
  })
  .delete(authenticateToken, async function (req, res) {
    const session = await conn.startSession();

    try {
      //initialize transactions
      session.startTransaction();
      console.log("asd");
      await PostComment.deleteOne(
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
      console.log(error);
      await session.abortTransaction();
      res.status(500).send();
    }
  });

module.exports = router;
