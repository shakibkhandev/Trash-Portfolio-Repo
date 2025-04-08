"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthCheck = exports.serverRunning = void 0;
const serverRunning = (req, res, next) => {
    try {
        res.status(200).json({ success: true, message: "Server is running" });
    }
    catch (err) {
        next(err);
    }
};
exports.serverRunning = serverRunning;
const healthCheck = (req, res, next) => {
    try {
        res.status(200).json({ success: true, message: "Server is healthy" });
    }
    catch (err) {
        next(err);
    }
};
exports.healthCheck = healthCheck;
