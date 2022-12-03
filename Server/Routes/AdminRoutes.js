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
const { BannedWorker, BannedRecruiter } = require("../Models/BannedUsers");
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
    const token = generateAccessToken(String(user._id));
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
        ban: false,
      })
        .lean()
        .exec();
      offense += 1;
      // console.log(offense);
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
        ban: false,
      })
        .lean()
        .exec();
      offense += 1;
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

module.exports = router;
