const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const bcrypt = require("bcrypt");

//models
const Worker = require("./Models/Workers");
const Recuiter = require("./Models/Recuiters");
const Work = require("./Models/Work");
const ServiceCategory = require("./Models/ServiceCategory");

//helper
const Check = require("./Helpers/ifUserExist");

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

//Login
app.post("/login", async (req, res) => {
  console.log(req.body);
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

app.post(
  "/signup/worker",
  Check.ifRecruiterExist,
  Check.ifWorkerExist,
  multipleFile,
  async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      const worker = new Worker({
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
        profilePic: "pic",
        GovId: req.files.govId[0].filename,
        licenseCertificate: req.files.certificate[0].filename,
        role: "worker",
        verification: false,
        accountStatus: "active",
      });

      worker.save((err) => {
        if (err) {
          console.log(err);
          res.status(500);
        } else {
          console.log("c");
        }
      });

      // const serviceCategory = new ServiceCategory({
      //   ServiceCategory: Unlisted,
      // });

      const work = new Work({
        // ServiceSubCode: ,
        workerId: worker.id,
        minPrice: req.body.minPrice,
        maxPrice: req.body.maxPrice,
      });
      work.save((err) => {
        if (err) {
          console.log(err);
        } else {
          res.send("Worker account created");
        }
      });
    } catch {
      res.status(500).send();
    }
  }
);

//signup recruiter
app.post(
  "/signup/recruiter",
  Check.ifRecruiterExist,
  Check.ifWorkerExist,
  upload.single("govId"),
  async (req, res) => {
    try {
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
        profilePic: "pic",
        GovId: req.body.path,
        verification: false,
        accountStatus: "active",
        role: "recuiter",
      });
      recuiter.save((err) => {
        if (err) {
          res.json({ message: err.message, type: "danger" });
        } else {
          res.send("Recuiter account created");
        }
      });
    } catch {
      res.status(500).send();
    }
  }
);

app.listen(3000, () => console.log("listening on port 3000."));
