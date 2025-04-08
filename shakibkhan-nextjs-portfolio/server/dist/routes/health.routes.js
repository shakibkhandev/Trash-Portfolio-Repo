"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const health_controllers_1 = require("../controllers/health.controllers");
exports.healthRoutes = express_1.default.Router();
exports.healthRoutes.get('/', health_controllers_1.serverRunning);
exports.healthRoutes.get('/health', health_controllers_1.healthCheck);
