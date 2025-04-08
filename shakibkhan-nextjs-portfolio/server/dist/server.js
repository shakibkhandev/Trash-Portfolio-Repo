"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const winston_logger_1 = __importDefault(require("./logger/winston.logger"));
const port = process.env.PORT || 8000;
const StartServer = () => {
    app_1.default.listen(port, () => {
        winston_logger_1.default.info(`Server running at http://localhost:${port}/api/v1`);
    });
};
StartServer();
