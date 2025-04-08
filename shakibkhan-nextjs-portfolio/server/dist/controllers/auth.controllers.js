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
exports.verifyToken = exports.adminAccessRequest = exports.refreshAccessToken = exports.resetPassword = exports.forgotPasswordRequest = exports.verifyEmail = exports.signOutFunction = exports.signUpFunction = exports.signInFunction = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_schema_1 = require("../schemas/auth.schema");
const prisma_1 = require("../services/prisma");
const ApiResponse_1 = require("../utils/ApiResponse");
const asyncHandler_1 = require("../utils/asyncHandler");
const generate_tokens_1 = require("../utils/generate.tokens");
const crypto_1 = __importDefault(require("crypto"));
const ApiError_1 = require("../utils/ApiError");
const mail_1 = require("../utils/mail");
// SignIn Function (login)
exports.signInFunction = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const parsedBody = auth_schema_1.signInSchema.safeParse(req.body);
    if (!parsedBody.success) {
        return res
            .status(400)
            .json({ success: false, error: parsedBody.error.errors });
    }
    // Find the user by email from the database
    const user = yield prisma_1.prisma.user.findFirst({
        where: { email, provider: "EMAIL" },
    });
    if (!user) {
        res.status(400).json({ message: "User not found" });
        return;
    }
    const isMatch = yield bcryptjs_1.default.compare(password, user.password);
    if (!isMatch) {
        res.status(400).json({ message: "Invalid password" });
        return;
    }
    const { accessToken, refreshToken } = yield (0, generate_tokens_1.generateAccessAndRefreshToken)(user.id);
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    };
    res
        .status(200)
        .cookie("accessToken", accessToken, options) // set the access token in the cookie
        .cookie("refreshToken", refreshToken, options) // set the refresh token in the cookie
        .json(new ApiResponse_1.ApiResponse(200, {
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            avatar: user.avatar,
        },
        accessToken: accessToken,
        refreshToken: refreshToken,
    }, // send access and refresh token in response if client decides to save them by themselves
    "User logged in successfully"));
}));
exports.signUpFunction = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, name } = req.body;
    const parsedBody = auth_schema_1.signUpSchema.safeParse(req.body);
    if (!parsedBody.success) {
        return res
            .status(400)
            .json({ success: false, error: parsedBody.error.errors });
    }
    // Check if the email already exists in the database
    const userExists = yield prisma_1.prisma.user.findFirst({
        where: { email, provider: "EMAIL" },
    });
    if (userExists) {
        throw new ApiError_1.ApiError(400, "User already exists");
    }
    // Hash the password before storing it
    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
    const nameParts = name.split(" "); // Split the name into words
    const firstNameInitial = nameParts[0].charAt(0); // Get the first letter of the first word
    const lastNameInitial = nameParts[nameParts.length - 1].charAt(0); // Get the first letter of the last word
    const nameShort = firstNameInitial + lastNameInitial;
    const urlString = `https://dummyimage.com/600x400/000/fff&text=${nameShort}`;
    const avatarUrl = urlString;
    const { hashedToken, tokenExpiry, unHashedToken } = (0, generate_tokens_1.generateTemporaryToken)();
    // Create the new user in the database
    const newUser = yield prisma_1.prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            avatar: avatarUrl,
            emailVerificationToken: hashedToken,
            emailVerificationExpiry: new Date(tokenExpiry),
        },
        select: {
            id: true,
            email: true,
            name: true,
            avatar: true,
        },
    });
    yield (0, mail_1.sendEmail)({
        email: newUser === null || newUser === void 0 ? void 0 : newUser.email,
        subject: "Please verify your email",
        mailgenContent: (0, mail_1.emailVerificationMailgenContent)(newUser.name, `${process.env.VERIFY_EMAIL_REDIRECT_URL}/${unHashedToken}`),
    });
    // // Generate JWT token for the new user
    // const token = generateToken(newUser);
    const user = yield prisma_1.prisma.user.findUnique({
        where: { email: newUser.email, id: newUser.id },
        select: {
            id: true,
            email: true,
            name: true,
            avatar: true,
        },
    });
    if (!user) {
        throw new ApiError_1.ApiError(500, "Something went wrong while registering the user");
    }
    return res
        .status(201)
        .json(new ApiResponse_1.ApiResponse(200, { user }, "Users registered successfully and verification email has been sent on your email."));
}));
// SignOut Function (logout)
exports.signOutFunction = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // No actual sign-out process on the server side if using JWT, just inform the client to delete the token
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    };
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse_1.ApiResponse(200, {}, "User logged out successfully"));
}));
exports.verifyEmail = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { verificationToken } = req.params;
    if (!verificationToken) {
        throw new ApiError_1.ApiError(400, "Email verification token is missing");
    }
    // generate a hash from the token that we are receiving
    let hashedToken = crypto_1.default
        .createHash("sha256")
        .update(verificationToken)
        .digest("hex");
    // While registering the user, same time when we are sending the verification mail
    // we have saved a hashed value of the original email verification token in the db
    // We will try to find user with the hashed token generated by received token
    // If we find the user another check is if token expiry of that token is greater than current time if not that means it is expired
    const user = yield prisma_1.prisma.user.findFirst({
        where: {
            emailVerificationToken: hashedToken,
            emailVerificationExpiry: {
                gte: new Date(), // current time is greater than or equal to emailVerificationExpiry
            },
        },
        select: {
            id: true,
        },
    });
    if (!user) {
        throw new ApiError_1.ApiError(489, "Token is invalid or expired");
    }
    yield prisma_1.prisma.user.update({
        where: {
            id: user.id,
        },
        data: {
            emailVerificationToken: null, // Use null instead of undefined
            emailVerificationExpiry: null, // Use null instead of undefined
            isEmailVerified: true, // Changed to match your schema's field name
        },
    });
    return res.status(200).json(new ApiResponse_1.ApiResponse(200, {}, "Email is verified"));
}));
exports.forgotPasswordRequest = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    // Get email from the client and check if user exists
    const user = yield prisma_1.prisma.user.findFirst({ where: { email } });
    if (!user) {
        throw new ApiError_1.ApiError(404, "User does not exists", []);
    }
    // Generate a temporary token
    const { unHashedToken, hashedToken, tokenExpiry } = (0, generate_tokens_1.generateTemporaryToken)(); // generate password reset creds
    yield prisma_1.prisma.user.update({
        where: { id: user.id },
        data: {
            forgotPasswordToken: hashedToken,
            forgotPasswordExpiry: new Date(tokenExpiry),
        },
    });
    // Send mail with the password reset link. It should be the link of the frontend url with token
    yield (0, mail_1.sendEmail)({
        email: user === null || user === void 0 ? void 0 : user.email,
        subject: "Password reset request",
        mailgenContent: (0, mail_1.forgotPasswordMailgenContent)(user.name, 
        // ! NOTE: Following link should be the link of the frontend page responsible to request password reset
        // ! Frontend will send the below token with the new password in the request body to the backend reset password endpoint
        `${process.env.FORGOT_PASSWORD_REDIRECT_URL}/${unHashedToken}`),
    });
    return res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, {}, "Password reset mail has been sent on your mail id"));
}));
exports.resetPassword = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { resetToken } = req.params;
    const { newPassword, confirmPassword } = req.body;
    // Create a hash of the incoming reset token
    let hashedToken = crypto_1.default
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    // See if user with hash similar to resetToken exists
    // If yes then check if token expiry is greater than current date
    const user = yield prisma_1.prisma.user.findFirst({
        where: {
            forgotPasswordToken: hashedToken,
            forgotPasswordExpiry: {
                gte: new Date(),
            },
        },
    });
    // If either of the one is false that means the token is invalid or expired
    if (!user) {
        throw new ApiError_1.ApiError(489, "Token is invalid or expired");
    }
    // compare the provided password and confirm password to ensure they match
    if (newPassword !== confirmPassword) {
        throw new ApiError_1.ApiError(400, "Passwords do not match");
    }
    const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 10);
    // if everything is ok and token id valid
    // reset the forgot password token and expiry
    yield prisma_1.prisma.user.update({
        where: { id: user.id },
        data: {
            forgotPasswordToken: undefined,
            forgotPasswordExpiry: undefined,
            password: hashedPassword, // hash the new password before storing it in the database
        },
    });
    return res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, {}, "Password reset successfully"));
}));
exports.refreshAccessToken = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken) {
        throw new ApiError_1.ApiError(401, "Unauthorized request");
    }
    try {
        const decodedToken = jsonwebtoken_1.default.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        const userId = typeof decodedToken === "object" && "id" in decodedToken
            ? decodedToken.id
            : null;
        if (!userId) {
            throw new ApiError_1.ApiError(401, "Invalid refresh token");
        }
        const user = yield prisma_1.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new ApiError_1.ApiError(401, "Invalid refresh token");
        }
        // check if incoming refresh token is same as the refresh token attached in the user document
        // This shows that the refresh token is used or not
        // Once it is used, we are replacing it with new refresh token below
        if (incomingRefreshToken !== (user === null || user === void 0 ? void 0 : user.refreshToken)) {
            // If token is valid but is used already
            throw new ApiError_1.ApiError(401, "Refresh token is expired or used");
        }
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        };
        const { accessToken, refreshToken: newRefreshToken } = yield (0, generate_tokens_1.generateAccessAndRefreshToken)(user.id);
        // Update the user's refresh token in the database
        yield prisma_1.prisma.user.update({
            where: { id: user.id },
            data: {
                refreshToken: newRefreshToken,
            },
        });
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(new ApiResponse_1.ApiResponse(200, { accessToken, refreshToken: newRefreshToken }, "Access token refreshed"));
    }
    catch (error) {
        throw new ApiError_1.ApiError(401, (error === null || error === void 0 ? void 0 : error.message) || "Invalid refresh token");
    }
}));
exports.adminAccessRequest = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { code } = req.body;
    const userId = req.user.id;
    if (!code) {
        throw new ApiError_1.ApiError(400, "Admin access code is required");
    }
    if (!userId) {
        throw new ApiError_1.ApiError(401, "Unauthorized request");
    }
    const adminAccessCode = process.env.ADMIN_PANEL_ACCESS_CODE;
    if (code !== adminAccessCode) {
        throw new ApiError_1.ApiError(403, "Unauthorized request. Invalid admin access code");
    }
    const adminUser = yield prisma_1.prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            isAdmin: true,
        },
    });
    return res.status(200).json(new ApiResponse_1.ApiResponse(200, {}, "Admin access granted"));
}));
exports.verifyToken = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    return res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, { isAdmin: user.isAdmin }, ""));
}));
