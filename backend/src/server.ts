import express from "express";
import { serverConfig } from "./config";
import logger from "./config/logger.config";
import {
  appErrorHandler,
  genericErrorHandler,
} from "./middlewares/error.middleware";
import v1Router from "./routers/v1/index.router";
import fileUpload from "express-fileupload";
const app = express();

app.use(express.json());
app.use(fileUpload({ useTempFiles: true }));

app.use("/api/v1", v1Router);

app.use(appErrorHandler);
app.use(genericErrorHandler);

app.listen(serverConfig.PORT, () => {
  logger.info(`Server is running on http://localhost:${serverConfig.PORT}`);
});
