const { Queue } = require("bullmq");
const connection = require("../config/redis");

const assetQueue = new Queue("asset-processing", {
  connection,
});

module.exports = assetQueue;