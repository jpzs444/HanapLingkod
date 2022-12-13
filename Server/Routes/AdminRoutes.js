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
const sendEmail = require("../Helpers/SendMail");
// CORS
const cors = require("cors");
router.use(cors({ origin: "*" }));

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

router.route("/notify-reporter/:action").post(async function (req, res) {
  let reporterquery = {};
  if (await Recruiters.exists({ _id: req.body.reporter })) {
    reporterquery = await Recruiters.findOne(
      { _id: req.body.reporter },
      { pushtoken: 1, _id: 0 }
    ).lean();
  } else if (await Workers.exists({ _id: req.body.reporter })) {
    reporterquery = await Workers.findOne(
      { _id: req.body.reporter },
      { pushtoken: 1, _id: 0 }
    ).lean();
  }
  if (req.params.action === "penalize") {
    notification(
      [reporterquery.pushtoken],
      "Your report for " +
        req.body.firstname +
        " " +
        req.body.lastname +
        " has been reviewed.",
      "The Admins of HanapLingkod have reviewed your report and imposed a penalty on the reported user.",
      { Type: "Offense Warning", id: req.body.reporter },
      req.body.reporter
    );
  } else if (req.params.action === "dismissed") {
    notification(
      [reporterquery.pushtoken],
      "Your report for " +
        req.body.firstname +
        " " +
        req.body.lastname +
        " has been dismissed.",
      "The Admins of HanapLingkod have reviewed the actions of your reported user and he/she will not be receiving a penalty. If you have inquiries, you may contact the Admins through hanaplingkod@gmail.com.",
      { Type: "Offense Warning", id: req.body.reporter },
      req.body.reporter
    );
  }
  console.log("Notification Sent");
  res.send("Notification Sent");
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
    const daysBanned = { 3: 1, 4: 3, 5: 7 };

    if (req.params.role === "recruiter") {
      let ban = true;
      let offense = await BannedRecruiter.count({
        recruiterId: req.body.id,
      })
        .lean()
        .exec();
      offense += 1;
      console.log(offense);

      if (offense === 1) {
        const pushIDRecruiter = await Recruiters.findOne(
          { _id: req.body.id },
          { pushtoken: 1, _id: 0 }
        ).lean();
        notification(
          [pushIDRecruiter.pushtoken],
          "A user has reported you and this serves as a warning to you.",
          "The Admins of HanapLingkod have evaluated your actions regarding the matter and decided to give you a strike. If you have inquiries, you may contact the Admins through hanaplingkod@gmail.com",
          { Type: "Offense Warning", id: req.body.id },
          req.body.id
        );
        ban = false;
      }

      if (offense === 2) {
        const pushIDRecruiter = await Recruiters.findOne(
          { _id: req.body.id },
          { pushtoken: 1, _id: 0 }
        ).lean();
        notification(
          [pushIDRecruiter.pushtoken],
          "A user has reported you and this serves as a warning to you.",
          "The Admins of HanapLingkod have evaluated your actions regarding the matter and decided to give you a strike. If you have inquiries, you may contact the Admins through hanaplingkod@gmail.com",
          { Type: "Offense Warning", id: req.body.id },
          req.body.id
        );
        ban = false;
      }
      if (offense === 6) {
        const permanentBannedRecruiter = new PermanentBannedRecruiter({
          recruiterId: req.body.id,
          ban: true,
        });
        const savedPermanentBannedRecruiter =
          await permanentBannedRecruiter.save();

        const pushIDRecruiter = await Recruiters.findOne(
          { _id: req.body.id },
          { pushtoken: 1, _id: 0 }
        ).lean();
        notification(
          [pushIDRecruiter.pushtoken],
          "A user has reported you and you are banned permanently",
          "The Admins of HanapLingkod have evaluated your actions regarding the matter and decided to ban you permanently. You can no longer use the application and you are restricted from logging in again. If you have inquiries, you may contact the Admins through hanaplingkod@gmail.com.",
          { Type: "Offense Warning", id: req.body.id },
          req.body.id
        );
      }

      if (offense === 3 || offense === 4 || offense === 5) {
        console.log("asd");
        const pushIDRecruiter = await Recruiters.findOne(
          { _id: req.body.id },
          { pushtoken: 1, _id: 0 }
        ).lean();
        notification(
          [pushIDRecruiter.pushtoken],
          "A user has reported you and you are banned as a penalty.",
          "The Admins of HanapLingkod have evaluated your actions regarding the matter and decided to ban you for " +
            daysBanned[offense] +
            " day/s. While banned, you will not be able to use certain features of the application. If you have inquiries, you may contact the Admins through hanaplingkod@gmail.com.",
          { Type: "Offense Warning", id: req.body.id },
          req.body.id
        );
      }

      const bannedRecruiter = new BannedRecruiter({
        recruiterId: req.body.id,
        ban: ban,
        offense: offense,
      });
      const savedbannedRecruiter = await bannedRecruiter.save();

      ServiceRequest.updateMany(
        { recruiterId: req.body.id },
        { requestStatus: 4 },
        function (err) {
          if (!err) {
            console.log("all req cancelled");
          } else {
            console.log(err);
          }
        }
      );

      res.status(200).json(savedbannedRecruiter);
    } else if (req.params.role === "worker") {
      let ban = true;
      let offense = await BannedWorker.count({
        workerId: req.body.id,
      })
        .lean()
        .exec();
      offense += 1;
      if (offense === 1) {
        const pushIDWorker = await Workers.findOne(
          { _id: req.body.id },
          { pushtoken: 1, _id: 0 }
        ).lean();
        notification(
          [pushIDWorker.pushtoken],
          "A user has reported you and this serves as a warning to you.",
          "The Admins of HanapLingkod have evaluated your actions regarding the matter and decided to give you a strike. If you have inquiries, you may contact the Admins through hanaplingkod@gmail.com.",
          { Type: "Offense Warning", id: req.body.id },
          req.body.id
        );
        ban = false;
        console.log(pushIDWorker);
      }

      if (offense === 2) {
        const pushIDWorker = await Workers.findOne(
          { _id: req.body.id },
          { pushtoken: 1, _id: 0 }
        ).lean();
        notification(
          [pushIDWorker.pushtoken],
          "A user has reported you about and this serves as a warning to you.",
          "The Admins of HanapLingkod have evaluated your actions regarding the matter and decided to give you a strike. If you have inquiries, you may contact the Admins through hanaplingkod@gmail.com.",
          { Type: "Offense Warning", id: req.body.id },
          req.body.id
        );
        ban = false;
        console.log(pushIDWorker);
      }

      if (offense === 6) {
        const permanendBannedWorker = new PermanendBannedWorker({
          workerId: req.body.id,
          ban: true,
        });
        const savedPermanendBannedWorker = await permanendBannedWorker.save();
        const pushIDWorker = await Workers.findOne(
          { _id: req.body.id },
          { pushtoken: 1, _id: 0 }
        ).lean();
        notification(
          [pushIDWorker.pushtoken],
          "A user has reported you and you are banned permanently",
          "The Admins of HanapLingkod have evaluated your actions regarding the matter and decided to ban you permanently. You can no longer use the application and you are restricted from logging in again. If you have inquiries, you may contact the Admins through hanaplingkod@gmail.com.",
          { Type: "Offense Warning", id: req.body.id },
          req.body.id
        );
      }
      console.log(offense);

      if (offense === 3 || offense === 4 || offense === 5) {
        const pushIDWorker = await Workers.findOne(
          { _id: req.body.id },
          { pushtoken: 1, _id: 0 }
        ).lean();
        notification(
          [pushIDWorker.pushtoken],
          "A user has reported you and you are banned as a penalty.",
          "The Admins of HanapLingkod have evaluated your actions regarding the matter and decided to ban you for " +
            daysBanned[offense] +
            " day/s. While banned, you will not be able to use certain features of the application. If you have inquiries, you may contact the Admins through hanaplingkod@gmail.com.",
          { Type: "Offense Warning", id: req.body.id },
          req.body.id
        );
      }

      const bannedWorker = new BannedWorker({
        workerId: req.body.id,
        ban: ban,
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

    const pushIDRecruiter = await Recruiters.findOne(
      { _id: req.body.id },
      { pushtoken: 1, _id: 0 }
    ).lean();
    notification(
      [pushIDRecruiter.pushtoken],
      "A user has reported you and you are banned permanently",
      "The Admins of HanapLingkod have evaluated your actions regarding the matter and decided to ban you permanently. You can no longer use the application and you are restricted from logging in again. If you have inquiries, you may contact the Admins through hanaplingkod@gmail.com.",
      { Type: "Offense Warning", id: req.body.id },
      req.body.id
    );

    res.status(200).json(savedPermanentBannedRecruiter);
  } else if (req.params.role === "worker") {
    const permanendBannedWorker = new PermanendBannedWorker({
      workerId: req.body.id,
      ban: true,
    });
    const savedPermanendBannedWorker = await permanendBannedWorker.save();
    const pushIDWorker = await Workers.findOne(
      { _id: req.body.id },
      { pushtoken: 1, _id: 0 }
    ).lean();
    notification(
      [pushIDWorker.pushtoken],
      "A user has reported you and you are banned permanently",
      "The Admins of HanapLingkod have evaluated your actions regarding the matter and decided to ban you permanently. You can no longer use the application and you are restricted from logging in again. If you have inquiries, you may contact the Admins through hanaplingkod@gmail.com.",
      { Type: "Offense Warning", id: req.body.id },
      req.body.id
    );
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
      senderId: req.body.senderId,
    });
    const savedReport = await report.save();
    res.send(savedReport);
  })
  .get(async function (req, res) {
    let reports = await Report.find({ deleteflag: false })
      .select("-description")
      .lean()
      .exec();
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
    let senderUser;
    let offense;
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

      offense = await BannedWorker.count({
        workerId: req.body.id,
      })
        .lean()
        .exec();
    }
    if (
      (await Recruiters.count({ _id: report.reportedUser }).lean().exec()) != 0
    ) {
      let user = await Recruiters.findOne({ _id: report.reportedUser })
        .select("-username -password -birthday -age -sex -phoneNumber")
        .lean()
        .exec();
      reportedUser = user;
      offense = await BannedRecruiter.count({
        recruiterId: report.reportedUser,
      })
        .lean()
        .exec();
    }

    if ((await Workers.count({ _id: report.senderId }).lean().exec()) != 0) {
      let sender = await Workers.findOne({ _id: report.senderId })
        .select(
          "-unavailableTime -works -username -password -birthday -age -sex -phoneNumber -prevWorks -workDescription"
        )
        .lean()
        .exec();
      senderUser = sender;
    }
    if ((await Recruiters.count({ _id: report.senderId }).lean().exec()) != 0) {
      let sender = await Recruiters.findOne({ _id: report.senderId })
        .select("-username -password -birthday -age -sex -phoneNumber")
        .lean()
        .exec();
      senderUser = sender;
    }

    res.send({
      report: report,
      reportedUser: reportedUser,
      senderUser: senderUser,
      offense: offense,
    });
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

router.route("/customerSupport").post(async function (req, res) {
  sendEmail(req.body.subject, req.body.text, req.body.email);
  res.send("Email has been sent");
});

router.route("/yourReports/:id").get(async function (req, res) {
  let reports = await Report.find({
    senderId: req.params.id,
  })
    .lean()
    .exec();
  for (i of reports) {
    if ((await Workers.count({ _id: i.reportedUser }).lean().exec()) != 0) {
      let user = await Workers.findOne({ _id: i.reportedUser })
        .select("firstname lastname middlename role")
        .lean()
        .exec();
      i.user = user;
    }
    if ((await Recruiters.count({ _id: i.reportedUser }).lean().exec()) != 0) {
      let user = await Recruiters.findOne({ _id: i.reportedUser })
        .select("firstname lastname middlename role")
        .lean()
        .exec();
      i.user = user;
    }
  }
  res.send(reports);
});

router.route("/strike/:role/:id").get(async function (req, res) {
  if (req.params.role === "recruiter") {
    console.log(req.params.id);
    let offense = await BannedRecruiter.count({
      recruiterId: req.params.id,
    })
      .lean()
      .exec();
    res.send(String(offense));
  } else if (req.params.role === "worker") {
    offense = await BannedWorker.count({
      workerId: req.params.id,
    })
      .lean()
      .exec();
    res.send(String(offense));
  }
});

router.route("/Admin-search").get(async function (req, res) {
  let keyword = req.query.keyword;
  var regex = new RegExp([keyword].join(""), "i");
  console.log(regex);

  let WorkerResult = await Workers.find({
    $or: [{ firstname: regex }, { lastname: regex }, { middlename: regex }],
  })
    .lean()
    .exec();

  let RecruiterResult = await Recruiters.find({
    $or: [{ firstname: regex }, { lastname: regex }, { middlename: regex }],
  })
    .lean()
    .exec();

  res.send({
    worker: WorkerResult,
    RecruiterResult: RecruiterResult,
  });
});

module.exports = router;
