const ServiceCategory = require("../Models/ServiceCategory");
const ServiceRequest = require("../Models/ServiceRequest");
const ServiceSubCategory = require("../Models/SubCategory");
const Booking = require("../Models/Booking");
const Work = require("../Models/Work");

async function CategoryMiddleware(docs) {
  console.log("Service Middleware");
  //   console.log(docs);

  const subCatId = await ServiceSubCategory.find(
    {
      ServiceID: docs._id,
    },
    { __v: 0, ServiceID: 0, ServiceSubCategory: 0 }
  ).lean();
  for (id of subCatId) {
    let subDoc = await ServiceSubCategory.findOneAndUpdate(
      { _id: id._id },
      { deleteflag: 1 }
    );
    SubCategoryMiddleware(subDoc);
  }
}

async function SubCategoryMiddleware(docs) {
  console.log("Sub Service  Middleware");
  // console.log(docs._id);
  const workId = await Work.find(
    {
      ServiceSubId: docs._id,
    },
    { __v: 0, ServiceSubId: 0, workerId: 0, minPrice: 0, maxPrice: 0 }
  ).lean();
  // console.log(workId);
  for (id of workId) {
    let subDoc = await Work.findOneAndUpdate(
      { _id: id._id },
      { deleteflag: 1 }
    );
    // console.log(subDoc)
    WorkMiddleware(subDoc);
  }
  // let arrx
}

async function WorkMiddleware(docs) {
  // console.log(docs);
  console.log("Work Middleware");
  const serviceRequestId = await ServiceRequest.find(
    {
      workId: docs._id,
    },
    {
      workerId: 0,
      recruiterId: 0,
      workId: 0,
      subCategory: 0,
      minPrice: 0,
      maxPrice: 0,
      serviceDate: 0,
      startTime: 0,
      endTime: 0,
      description: 0,
      requestStatus: 0,
      comment: 0,
      geometry: 0,
      deleteflag: 0,
      created_at: 0,
    }
  ).lean();
  const BookingId = await Booking.find(
    {
      workId: docs._id,
    },
    {
      workerId: 0,
      recruiterId: 0,
      workId: 0,
      minPrice: 0,
      maxPrice: 0,
      serviceDate: 0,
      startTime: 0,
      endTime: 0,
      description: 0,
      address: 0,
      statusWorker: 0,
      statusRecruiter: 0,
      geometry: 0,
      deleteflag: 0,
      created_at: 0,
      bookingStatus: 0,
      otp: 0,
    }
  );
  // console.log(BookingId);
  for (id of serviceRequestId) {
    let subDoc = await ServiceRequest.findOneAndUpdate(
      { _id: id._id },
      { deleteflag: 1 }
    );
    // console.log(subDoc);
  }
  for (id of BookingId) {
    let subDoc2 = await Booking.findOneAndUpdate(
      { _id: id._id },
      { deleteflag: 1 }
    );
    console.log(subDoc2);
  }
}

module.exports = { CategoryMiddleware, SubCategoryMiddleware, WorkMiddleware };
