const Worker = require("../Models/Workers");
const ServiceRequest = require("../Models/ServiceRequest");
const dayjs = require("dayjs");
var isBetween = require("dayjs/plugin/isBetween");

async function checkConflict(user, workId, endTime) {
  dayjs.extend(isBetween);

  const result = await ServiceRequest.findOne({ _id: workId });
  const worker = await Worker.findOne({ _id: user });
  const { startTime } = result;
  const { unavailableTime } = worker;
  for (item of unavailableTime) {
    if (
      dayjs(startTime).isBetween(
        item.startTime,
        dayjs(item.endTime),
        null,
        "[]"
      ) ||
      dayjs(endTime).isBetween(
        item.startTime,
        dayjs(item.endTime),
        null,
        "[]"
      ) ||
      dayjs(item.startTime).isBetween(startTime, dayjs(endTime), null, "[]") ||
      dayjs(item.endTime).isBetween(startTime, dayjs(endTime), null, "[]")
    ) {
      console.log(
        "item.startTime: " + item.startTime + " item.endTime: " + item.endTime
      );
      console.log("startTime: " + startTime + " endtime " + dayjs(endTime));
      console.log("conflict sched");
      // return res.status(400).send("some text");
      return true;
    }
  }
  console.log("no conflict sched");
  return false;
}

module.exports = checkConflict;
