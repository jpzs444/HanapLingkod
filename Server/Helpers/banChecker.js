const { BannedRecruiter, BannedWorker } = require("../Models/BannedUsers");

async function CheckIfBan(req, res, next) {
  const { id } = req.CurrentuserId;
  const recruiterBannedCount = await BannedRecruiter.count({
    recruiterId: id,
    ban: true,
  })
    .lean()
    .exec();

  const workerbannedCount = await BannedWorker.count({
    workerId: id,
    ban: true,
  })
    .lean()
    .exec();
  if (recruiterBannedCount > 0 || workerbannedCount > 0) {
    res.status(403).json("Forbidden: User is Banned");
  } else {
    next();
  }
}

module.exports = { CheckIfBan };
