"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = exports.generateAccessAndRefreshToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
exports.generateTemporaryToken = generateTemporaryToken;
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_1 = require("../constants");
const prisma_1 = require("../services/prisma");
const ApiError_1 = require("./ApiError");
// Function to generate temporary token
function generateTemporaryToken() {
    // This token should be client-facing (e.g., for email verification)
    const unHashedToken = crypto_1.default.randomBytes(20).toString("hex");
    // This should stay in the DB to compare at the time of verification
    const hashedToken = crypto_1.default
        .createHash("sha256")
        .update(unHashedToken)
        .digest("hex");
    // This is the expiry time for the token (20 minutes)
    const tokenExpiry = Date.now() + constants_1.USER_TEMPORARY_TOKEN_EXPIRY;
    return { unHashedToken, hashedToken, tokenExpiry };
}
const generateAccessToken = (user) => {
    return jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1d",
    });
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (user) => {
    return jsonwebtoken_1.default.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "10d",
    });
};
exports.generateRefreshToken = generateRefreshToken;
const generateAccessAndRefreshToken = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma_1.prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
                email: true,
            },
        });
        if (!user) {
            throw new Error("User not found");
        }
        const accessToken = (0, exports.generateAccessToken)(user);
        const refreshToken = (0, exports.generateRefreshToken)(user);
        // Store refresh token in the database
        yield prisma_1.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                refreshToken: refreshToken,
            },
        });
        return { accessToken, refreshToken };
    }
    catch (error) {
        throw new ApiError_1.ApiError(500, "Something went wrong while generating the access token");
    }
});
exports.generateAccessAndRefreshToken = generateAccessAndRefreshToken;
// Helper function to generate JWT token
const generateToken = (user) => {
    return jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, // Use env variable for secret
    {
        expiresIn: "1h", // Token expires in 1 hour
    });
};
exports.generateToken = generateToken;
