const app = require('./src/app');
const { connectDB } = require('./src/config/db');
const { ensureBucketExists } = require("./src/config/minio");
const { connectRabbitMQ, startAssetConsumer } = require("./src/config/rabbitmq");
const { processAsset } = require("./src/services/asset.service");
const { PORT } = require("./src/config/env");

const startServer = async () => {
  await connectDB();
  await ensureBucketExists();
  await connectRabbitMQ();
  await startAssetConsumer(processAsset);

  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start backend:", error);
  process.exit(1);
});
