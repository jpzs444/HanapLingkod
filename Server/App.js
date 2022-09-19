const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const bcrypt = require("bcrypt");

//models
const Worker = require("./Models/Workers");
const Recruiter = require("./Models/Recruiters");
const ServiceCategory = require("./Models/ServiceCategory");
const ServiceSubCategory = require("./Models/SubCategory");
const Work = require("./Models/Work");

//helper
const Check = require("./Helpers/ifUserExist");
const notification = require("./Helpers/PushNotification");
//routes
const ServiceCategoryRoutes = require("./Routes/ServiceCategoryRoutes");
const ServiceSubCategoryRoutes = require("./Routes/ServiceSubCategory");
const UsernotificationRoutes = require("./Routes/UserNotificationRoutes");
const WorkerRoutes = require("./Routes/WorkerRoutes");
const WorkRoutes = require("./Routes/WorkRoutes");
const RecruiterRoutes = require("./Routes/RecruiterRoutes");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
mongoose.connect(
  "mongodb+srv://admin-Patrick:test123@cluster0.2anjoo0.mongodb.net/?retryWrites=true&w=majority"
  // "mongodb://localhost:27017/hanapLingkod"
);

const conn = mongoose.connection;

conn.on("error", () => console.error.bind(console, "connection error"));

conn.once("open", () => console.info("Connection to Database is successful"));

module.exports = conn;

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

// notification(
//   ["ExponentPushToken[SGLOLBPJ8RivZf4UtD8-TL]"],
//   "HanapLingkod",
//   "ang jologs ko sorry, i will be better"
// );

//Login
app.post("/login", async (req, res) => {
  console.log(req.body);
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ msg: "Not all fields have been entered" });
    }
    //check if the username exist in recruiter or worker
    let ifWorkerExist = await Worker.exists({ username: username });
    let ifRecruiterExist = await Recruiter.exists({ username: username });
    let user;
    if (ifWorkerExist) {
      user = await Worker.findOne({ username: username });
    } else {
      user = await Recruiter.findOne({ username: username });
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
    //initialize transactions
    const session = await conn.startSession();

    try {
      //initialize transactions
      session.startTransaction();
      // console.log(req.body);

      //hash the password using bcrypt
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      let workerObj = {
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
        workDescription: req.body.workDescription,
        role: "worker",
        verification: false,
        accountStatus: "active",
      };
      if (req.files.certificate !== undefined) {
        workerObj.licenseCertificate = req.files.certificate[0].filename;
      }

      //create worker
      const worker = await Worker.create([workerObj], { session });

      //save service sub category id for future use
      //convert category sub category min max price to arrays to create multiple works documents
      let serviceSubCategoryID;
      const Category = [].concat(req.body.Category);
      const SubCategory = [].concat(req.body.ServiceSubCategory);
      const min = [].concat(req.body.minPrice);
      const max = [].concat(req.body.maxPrice);

      for (var i = 0; i < Category.length; i += 1) {
        //check if the sub category is unlisted or not if unlisted create a new sub category if not query and get the id of the sub category
        if (Category[i] == "unlisted") {
          let unlistedID = await ServiceCategory.findOne(
            { Category: "unlisted" },
            { Category: 0 }
          );
          const serviceSubCategory = await ServiceSubCategory.create(
            [
              {
                ServiceID: unlistedID._id,
                ServiceSubCategory: SubCategory[i],
              },
            ],
            { session }
          );

          serviceSubCategoryID = serviceSubCategory[0].id;
        } else {
          let result = await ServiceSubCategory.findOne(
            { ServiceSubCategory: SubCategory[i] },
            { ServiceSubCategory: 0, ServiceID: 0 },
            { session }
          );
          serviceSubCategoryID = result._id;
        }
        //create work
        const work = await Work.create(
          [
            {
              ServiceSubId: serviceSubCategoryID,
              workerId: worker[0].id,
              minPrice: min[i],
              maxPrice: max[i],
            },
          ],
          { session }
        );
      }
      await session.commitTransaction();
      console.log("success");
      res.send("Succesfully Created");
    } catch (err) {
      console.log(err);

      await session.abortTransaction();

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
      console.log(req.file);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      const recruiter = new Recruiter({
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
        GovId: req.file.filename,
        verification: false,
        accountStatus: "active",
        role: "recruiter",
      });
      recruiter.save((err) => {
        if (err) {
          res.json({ message: err.message, type: "danger" });
        } else {
          res.send("Recruiter account created");
        }
      });
    } catch {
      res.status(500).send();
    }
  }
);

//routes
app.use(ServiceCategoryRoutes);
app.use(ServiceSubCategoryRoutes);
app.use(UsernotificationRoutes);
app.use(WorkerRoutes);
app.use(RecruiterRoutes);
app.use(WorkRoutes);

app.listen(3000, () => console.log("listening on port 3000."));
