const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const bcrypt = require("bcrypt");

//models
const Worker = require("./Models/Workers");
const Recuiter = require("./Models/Recuiters");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
mongoose.connect("mongodb://localhost:27017/hanapLingkod");

//store photos
const storage = multer.diskStorage({
  //destination for files
  destination: function (request, file, callback) {
    callback(null, "./Public/Uploads");
  },

  //add back the extension
  filename: function (request, file, callback) {
    callback(null, Date.now() + file.originalname);
  },
});

//upload the image
const upload = multer({ storage: storage });

//upload multiple files
const multipleFile = upload.fields([
  { name: "govId" },
  { name: "certificate" },
]);

//middleware check if username already exist
function ifUserExist(req, res, next) {
  Recuiter.findOne({ username: req.query.username })
    .select("username")
    .lean()
    .then((result) => {
      if (result) {
        res.status(408).json({ error: "timeout 408" });
      }
    });
  Worker.findOne({ username: req.query.username })
    .select("username")
    .lean()
    .then((result) => {
      if (result) {
        res.status(408).json({ error: "timeout 408" });
      }
    });
  next();
  return;
}

//Login
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ msg: "Not all fields have been entered" });
    }
    //check if the username exist in recuiter or worker
    let ifWorkerExist = await Worker.exists({ username: username });
    let ifRecuiterExist = await Recuiter.exists({ username: username });
    let user;
    if (ifWorkerExist) {
      user = await Worker.findOne({ username: username });
      console.log("qq");
    } else {
      user = await Recuiter.findOne({ username: username });
    }
    if (!user) {
      return res.status(400).json({ msg: "Invalid Username" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Password" });
    }
    res.send(user);
  } catch (error) {
    res.status(500).json({ err: error.message });
  }
});

app.post("/signup/worker", multipleFile, async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const worker = new Worker({
      username: "String",
      password: "String",
      firstname: "String",
      lastname: "String",
      middlename: "String",
      birthday: 12 / 12 / 2002,
      age: 12,
      sex: "String",
      street: "String",
      purok: "String",
      barangay: "String",
      city: "String",
      province: "String",
      phoneNumber: "String",
      emailAddress: "String",
      profilePic: "String",
      GovId: "string",
      verification: false,
      accountStatus: "active",
    });
    worker.save((err) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Worker account created");
      }
    });
  } catch {
    res.status(500).send();
  }
});

//signup worker
app.post(
  "/signup/recruiter",
  ifUserExist,
  upload.single("govId"),
  async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const recuiter = new Recuiter({
      username: req.body.username,
      password: hashedPassword,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      middlename: req.body.middlename,
      birthday: req.body.birthday,
      age: req.body.age,
      sex: req.body.sex,
      street: req.body.street,
      purok: req.body.purok,
      barangay: req.body.barangay,
      city: req.body.city,
      province: req.body.province,
      phoneNumber: req.body.phoneNumber,
      emailAddress: req.body.emailAddress,
      profilePic: "",
      GovId: req.body.path,
      verification: false,
      accountStatus: "active",
      role: "recuiter",
    });
    recuiter.save((err) => {
      if (err) {
        res.json({ message: err.message, type: "danger" });
      } else {
        console.log();
        res.send("Recuiter account created");
      }
    });
  }
);

app.listen(3000, () => console.log("listening on port 3000."));
