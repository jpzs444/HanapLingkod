const ServiceRequest = require("../Models/ServiceRequest");
const dayjs = require("dayjs");

async function deleteCancelled() {
  let date = new Date();
  date = dayjs(date);
  let CancelledRequest = await ServiceRequest.find({
    requestStatus: 3,
  }).lean();
  for (item of CancelledRequest) {
    let { updated_at } = item;
    const time = dayjs(updated_at);
    if (date.diff(time, "d", true) >= 5) {
      console.log(item._id);
      ServiceRequest.findOneAndUpdate(
        { _id: item._id },
        { deleteflag: true },
        (err, doc) => {
          if (!err) {
            console.log("Docs with ID " + item._id + " is deleted");
          } else {
            console.log(err);
          }
        }
      );
    }
  }
}

module.exports = deleteCancelled;
