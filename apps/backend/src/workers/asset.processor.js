const { Worker } = require("bullmq");
const connection = require("../config/redis");
const Asset = require("../modules/asset/asset.model");

const worker = new Worker(
  "asset-processing",
  async (job) => {
    const { assetId, mimeType } = job.data;

    console.log("Processing:", assetId);

    // Fake processing (replace with Sharp/FFmpeg)
    await new Promise(res => setTimeout(res, 2000));

    await Asset.findByIdAndUpdate(assetId, {
      status: "completed",
    });
  },
  { connection }
);

worker.on("completed", job => {
  console.log("Job done:", job.id);
});