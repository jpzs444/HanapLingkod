const Worker = require("../Models/Workers");
const ServiceRequest = require("../Models/ServiceRequest");
const dayjs = require("dayjs");
var isBetween = require("dayjs/plugin/isBetween");
async function checkConflict(user, workId, endTime) {
  //   console.log(workId);
  dayjs.extend(isBetween);

  const result = await ServiceRequest.findOne({ _id: workId });
  const worker = await Worker.findOne({ _id: user });
  const { startTime } = result;
  const { unavailableTime } = worker;
  for (item of unavailableTime) {
    // console.log(item.startTime);
    // console.log(endTime);

    if (
      dayjs(startTime).isBetween(
        item.startTime,
        dayjs(item.endTime),
        null,
        "[]"
      ) ||
      dayjs(endTime).isBetween(item.startTime, dayjs(item.endTime), null, "[]")
    ) {
      console.log("conflict sched");
      return true;
    } else {
      console.log("no conflict sched");
      return false;
    }
  }
  return false;
}

module.exports = checkConflict;
