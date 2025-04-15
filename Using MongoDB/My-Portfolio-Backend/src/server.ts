import app from "./app";
import { connectDB } from "./db/connect.db";
import logger from "./logger/winston.logger";
import { ApiError } from "./utils/ApiError";

const port = process.env.PORT || 8000;

const StartServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      logger.info(`Server running at http://localhost:${port}/api/v1`);
    });
  } catch (error) {
    throw new ApiError(500);
  }
};

StartServer();
