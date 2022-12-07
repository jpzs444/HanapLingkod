const express = require("express");
const router = express.Router();
const notification = require("../Helpers/PushNotification");
const RequestPost = require("../Models/RequestPost");
const dayjs = require("dayjs");
const PostComment = require("../Models/PostComment");
const Recruiters = require("../Models/Recruiters");
const Admin = require("../Models/Admin");
const bcrypt = require("bcrypt");
const Workers = require("../Models/Workers");
const { generateAccessToken, authenticateToken } = require("../Helpers/JWT");
const {
  BannedWorker,
  BannedRecruiter,
  PermanentBannedRecruiter,
  PermanendBannedWorker,
} = require("../Models/BannedUsers");
const RecruiterComment = require("../Models/RecruiterComment");
const WorkerComment = require("../Models/WorkerComment");
const ServiceRequest = require("../Models/ServiceRequest");
const Booking = require("../Models/Booking");
const Work = require("../Models/Work");
const Conversation = require("../Models/Conversation");
const Report = require("../Models/Report");
router.route("/signup/admin").post(async function (req, res) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  let AdminObj = {
    username: req.body.username,
    password: hashedPassword,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    middlename: req.body.middlename,
    birthday: req.body.birthday,
    age: req.body.age,
    sex: req.body.sex,
    phoneNumber: req.body.phoneNumber,
    emailAddress: req.body.emailAddress,
    role: "Admin",
    accountStatus: "active",
  };

  const admin = new Admin(AdminObj);
  admin.save((err) => {
    if (err) {
      res.json({ message: err.message, type: "danger" });
    } else {
      res.send("Admin account created");
    }
  });
});

router.route("/login/admin").post(async function (req, res) {
  console.log(req.body);
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ msg: "Not all fields have been entered" });
    }

    let user;
    user = await Admin.findOne({ username: username })
      .select("-pushtoken ")
      .lean();
    if (!user) {
      return res.status(400).json({ msg: "Invalid Username" }).lean();
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Password" });
    }
    const token = generateAccessToken(String(user._id), user.role);
    user["accessToken"] = "Bearer " + token;
    delete user.password;
    console.log(user);
    res.send(user);
  } catch (error) {
    res.status(500).json({ err: error.message });
  }
});

router.route("/verifyUser/:role").post(async function (req, res) {
  if (req.params.role === "recruiter") {
    Recruiters.findOneAndUpdate(
      { _id: req.body.id },
      { verification: true },
      function (err) {
        if (!err) {
          res.send("Updated Successfully");
        } else {
          res.send(err);
        }
      }
    );
  } else if (req.params.role === "worker") {
    Workers.findOneAndUpdate(
      { _id: req.body.id },
      { verification: true },
      function (err) {
        if (!err) {
          res.send("Updated Successfully");
        } else {
          res.send(err);
        }
      }
    );
  }
});

router
  .route("/banUser/:role")
  .get(async function (req, res) {
    if (req.params.role === "recruiter") {
      let bannedRecruiter = await BannedRecruiter.find({
        ban: true,
      })
        .lean()
        .exec();
      res.status(200).json(bannedRecruiter);
    } else if (req.params.role === "worker") {
      let bannedWorker = await BannedWorker.find({
        ban: true,
      })
        .lean()
        .exec();
      res.status(200).json(bannedWorker);
    }
  })
  .post(async function (req, res) {
    if (req.params.role === "recruiter") {
      let offense = await BannedRecruiter.count({
        recruiterId: req.body.id,
      })
        .lean()
        .exec();
      offense += 1;
      console.log(offense);
      if (offense === 6) {
        const permanentBannedRecruiter = new PermanentBannedRecruiter({
          recruiterId: req.body.id,
          ban: true,
        });
        const savedPermanentBannedRecruiter =
          await permanentBannedRecruiter.save();
      }
      const bannedRecruiter = new BannedRecruiter({
        recruiterId: req.body.id,
        ban: true,
        offense: offense,
      });
      const savedbannedRecruiter = await bannedRecruiter.save();
      res.status(200).json(savedbannedRecruiter);
    } else if (req.params.role === "worker") {
      let offense = await BannedWorker.count({
        workerId: req.body.id,
      })
        .lean()
        .exec();
      offense += 1;
      if (offense === 6) {
        const permanendBannedWorker = new PermanendBannedWorker({
          recruiterId: req.body.id,
          ban: true,
        });
        const savedPermanendBannedWorker = await permanendBannedWorker.save();
      }
      // console.log(offense);
      const bannedWorker = new BannedWorker({
        workerId: req.body.id,
        ban: true,
        offense: offense,
      });
      const savedbannedWorker = await bannedWorker.save();
      res.status(200).json(savedbannedWorker);
    }
  });
router.route("/unbanUser/:role").put(async function (req, res) {
  // console.log("asd");
  if (req.params.role === "recruiter") {
    let updatedBannedRecruiter = await BannedRecruiter.findOneAndUpdate(
      { _id: req.body.id },
      { ban: false },
      { new: true }
    );
    res.status(200).json(updatedBannedRecruiter);
  } else if (req.params.role === "worker") {
    let updatedBannedWorker = await BannedWorker.findOneAndUpdate(
      { _id: req.body.id },
      { ban: false },
      { new: true }
    );
    res.status(200).json(updatedBannedWorker);
  }
});

router.route("/permanentBanUser/:role").post(async function (req, res) {
  if (req.params.role === "recruiter") {
    const permanentBannedRecruiter = new PermanentBannedRecruiter({
      recruiterId: req.body.id,
      ban: true,
    });
    const savedPermanentBannedRecruiter = await permanentBannedRecruiter.save();
    res.status(200).json(savedPermanentBannedRecruiter);
  } else if (req.params.role === "worker") {
    const permanendBannedWorker = new PermanendBannedWorker({
      recruiterId: req.body.id,
      ban: true,
    });
    const savedPermanendBannedWorker = await permanendBannedWorker.save();
    res.status(200).json(savedPermanendBannedWorker);
  }
});

router.route("/unverifiedUsers").get(async function (req, res) {
  const unverifiedWorkers = await Workers.find({ verification: false })
    .select(
      "-unavailableTime -works -username -password -birthday -age -sex -phoneNumber -profilePic -prevWorks -workDescription"
    )
    .lean()
    .exec();
  const unverifiedRecruiters = await Recruiters.find({ verification: false })
    .select("-username -password -birthday -age -sex -phoneNumber -profilePic")
    .lean()
    .exec();
  res.send({
    unverifiedWorkers: unverifiedWorkers,
    unverifiedRecruiters: unverifiedRecruiters,
  });
});

router.route("/verifiedUsers").get(async function (req, res) {
  const verifiedWorkers = await Workers.find({ verification: true })
    .select(
      "-unavailableTime -works -username -password -birthday -age -sex -phoneNumber -profilePic -prevWorks -workDescription"
    )
    .lean()
    .exec();
  const verifiedRecruiters = await Recruiters.find({ verification: true })
    .select("-username -password -birthday -age -sex -phoneNumber -profilePic")
    .lean()
    .exec();
  res.send({
    verifiedWorkers: verifiedWorkers,
    verifiedRecruiters: verifiedRecruiters,
  });
});

router.route("/user/:role").get(async function (req, res) {
  if (req.params.role === "recruiter") {
    const Recruiter = await Recruiters.find({ _id: req.body.id })
      .select("-username -password")
      .lean()
      .exec();
    res.status(200).json(Recruiter);
  } else if (req.params.role === "worker") {
    const Worker = await Workers.find({ _id: req.body.id })
      .select("-unavailableTime -works -username -password ")
      .lean()
      .exec();
    res.status(200).json(Worker);
  }
});

router.route("/verifyAUser/:role").put(async function (req, res) {
  if (req.params.role === "recruiter") {
    Recruiters.findOneAndUpdate(
      { _id: req.body.id },
      { verification: true },
      function (err) {
        if (!err) {
          res.send("user verified");
        } else {
          res.send(err);
        }
      }
    );
  } else if (req.params.role === "worker") {
    Workers.findOneAndUpdate(
      { _id: req.body.id },
      { verification: true },
      function (err) {
        if (!err) {
          res.send("user verified");
        } else {
          res.send(err);
        }
      }
    );
  }
});

router.route("/deleteAUser/:role").put(async function (req, res) {
  if (req.params.role === "recruiter") {
    Recruiters.updateMany({ _id: req.body.id }, { deleteflag: true }).exec();

    RequestPost.updateMany(
      { recruiterId: req.body.id },
      {
        deleteflag: true,
      }
    ).exec();
    RecruiterComment.updateMany(
      { reviewee: req.body.id },
      {
        deleteflag: true,
      }
    ).exec();

    WorkerComment.updateMany(
      { reviewer: req.body.id },
      {
        deleteflag: true,
      }
    ).exec();
    ServiceRequest.updateMany(
      { recruiterId: req.body.id },
      {
        deleteflag: false,
      }
    ).exec();
    Booking.updateMany(
      { recruiterId: req.body.id },
      {
        deleteflag: false,
      }
    ).exec();
    res.send("Deleted Successfully");
  } else if (req.params.role === "worker") {
    Workers.updateMany({ _id: req.body.id }, { deleteflag: true }).exec();
    Work.updateMany({ workerId: req.body.id }, { deleteflag: true }).exec();
    ServiceRequest.updateMany(
      { workerId: req.body.id },
      {
        deleteflag: false,
      }
    ).exec();

    Booking.updateMany(
      { workerId: req.body.id },
      {
        deleteflag: false,
      }
    ).exec();

    RecruiterComment.updateMany(
      { reviewer: req.body.id },
      {
        deleteflag: true,
      }
    ).exec();

    WorkerComment.updateMany(
      { reviewee: req.body.id },
      {
        deleteflag: true,
      }
    ).exec();
    Conversation.updateMany(
      { members: req.body.id },
      {
        deleteflag: false,
      }
    ).exec();

    res.send("Deleted Successfully");
  }
});

router
  .route("/reportAUser")
  .post(async function (req, res) {
    const report = new Report({
      title: req.body.title,
      reportedUser: req.body.reportedUser,
      description: req.body.description,
    });
    const savedReport = await report.save();
    res.send(savedReport);
  })
  .get(async function (req, res) {
    let reports = await Report.find({}).select("-description").lean().exec();
    for (i of reports) {
      if ((await Workers.count({ _id: i.reportedUser }).lean().exec()) != 0) {
        let user = await Workers.findOne({ _id: i.reportedUser })
          .select("firstname lastname middlename role")
          .lean()
          .exec();
        i.user = user;
      }
      if (
        (await Recruiters.count({ _id: i.reportedUser }).lean().exec()) != 0
      ) {
        let user = await Recruiters.findOne({ _id: i.reportedUser })
          .select("firstname lastname middlename role")
          .lean()
          .exec();
        i.user = user;
      }
    }
    res.send(reports);
  });

router
  .route("/reportAUser/:id")
  .get(async function (req, res) {
    let report = await Report.findOne({ _id: req.params.id }).lean().exec();
    let reportedUser;
    if (
      (await Workers.count({ _id: report.reportedUser }).lean().exec()) != 0
    ) {
      let user = await Workers.findOne({ _id: report.reportedUser })
        .select(
          "-unavailableTime -works -username -password -birthday -age -sex -phoneNumber -prevWorks -workDescription"
        )
        .lean()
        .exec();
      reportedUser = user;
    }
    if (
      (await Recruiters.count({ _id: report.reportedUser }).lean().exec()) != 0
    ) {
      let user = await Recruiters.findOne({ _id: report.reportedUser })
        .select("-username -password -birthday -age -sex -phoneNumber")
        .lean()
        .exec();
      reportedUser = user;
    }
    res.send({ report: report, reportedUser: reportedUser });
  })
  .delete(async function (req, res) {
    Report.findOneAndUpdate(
      { _id: req.params.id },
      {
        deleteflag: true,
      }
    )
      .lean()
      .exec();
    res.send("deleted Succssfully");
  });

module.exports = router;
