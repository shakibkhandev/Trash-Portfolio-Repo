"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controllers_1 = require("../controllers/user.controllers");
const verify_middlewares_1 = require("../middlewares/verify.middlewares");
exports.userRoutes = express_1.default.Router();
// profile
exports.userRoutes.get("/profile", verify_middlewares_1.verifyJWT, user_controllers_1.getProfileInformation);
exports.userRoutes.put("/profile", verify_middlewares_1.verifyJWT, user_controllers_1.updateProfileInformation);
exports.userRoutes.delete("/profile", verify_middlewares_1.verifyJWT, user_controllers_1.deleteProfileInformation);
exports.userRoutes.put("/profile/change-password", verify_middlewares_1.verifyJWT, user_controllers_1.changeCurrentPassword);
// Portfolio
exports.userRoutes.get("/portfolio", user_controllers_1.getPortfolioInformation);
exports.userRoutes.post("/portfolio", verify_middlewares_1.verifyJWT, user_controllers_1.createPortfolio);
exports.userRoutes.put("/portfolio", verify_middlewares_1.verifyJWT, user_controllers_1.updatePortfolioInformation);
exports.userRoutes.delete("/portfolio", verify_middlewares_1.verifyJWT, user_controllers_1.deletePortfolioInformation);
// Skills
exports.userRoutes.get("/skills", user_controllers_1.getSkills);
exports.userRoutes.post("/skills", verify_middlewares_1.verifyJWT, user_controllers_1.addSkills);
exports.userRoutes.put("/skills/:id", verify_middlewares_1.verifyJWT, user_controllers_1.updateSkill);
exports.userRoutes.delete("/skills/:id", verify_middlewares_1.verifyJWT, user_controllers_1.deleteSkill);
// Education
exports.userRoutes.get("/education", user_controllers_1.getEducations);
exports.userRoutes.post("/education", verify_middlewares_1.verifyJWT, user_controllers_1.addEducation);
exports.userRoutes.put("/education/:id", verify_middlewares_1.verifyJWT, user_controllers_1.updateEducation);
exports.userRoutes.delete("/education/:id", verify_middlewares_1.verifyJWT, user_controllers_1.deleteEducation);
// Work Experience
exports.userRoutes.get("/work-experiences", user_controllers_1.getWorkExperiences);
exports.userRoutes.post("/work-experiences", verify_middlewares_1.verifyJWT, user_controllers_1.addWorkExperience);
exports.userRoutes.put("/work-experiences/:id", verify_middlewares_1.verifyJWT, user_controllers_1.updateWorkExperience);
exports.userRoutes.delete("/work-experiences/:id", verify_middlewares_1.verifyJWT, user_controllers_1.deleteWorkExperience);
// Projects
exports.userRoutes.get("/projects", user_controllers_1.getProjects);
exports.userRoutes.post("/projects", verify_middlewares_1.verifyJWT, user_controllers_1.addProject);
exports.userRoutes.put("/projects/:id", verify_middlewares_1.verifyJWT, user_controllers_1.updateProject);
exports.userRoutes.delete("/projects/:id", verify_middlewares_1.verifyJWT, user_controllers_1.deleteProject);
// Newsletter
exports.userRoutes.get("/newsletter", verify_middlewares_1.verifyJWT, user_controllers_1.getNewsletters);
exports.userRoutes.post("/newsletter", user_controllers_1.addNewsletter);
exports.userRoutes.delete("/newsletter/:id", verify_middlewares_1.verifyJWT, user_controllers_1.deleteNewsletter);
