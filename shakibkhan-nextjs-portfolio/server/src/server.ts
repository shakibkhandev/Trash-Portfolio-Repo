import app from "./app";
import logger from "./logger/winston.logger";

const port = process.env.PORT || 8000;

const StartServer = () => {
  app.listen(port, () => {
    logger.info(`Server running at http://localhost:${port}/api/v1`);
  });
};

StartServer();
