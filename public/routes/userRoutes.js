"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const authController_1 = require("../controllers/authController");
const userRouter = express_1.default.Router();
userRouter.post("/sign-up", authController_1.signUp);
userRouter.post("/sign-in", authController_1.signIn);
userRouter.post("/forgot-password", authController_1.forgotPassword);
userRouter.patch("/reset-passwprd", authController_1.resetPassword);
//protected routes
userRouter.use(authController_1.protect);
userRouter.patch("/update-passwprd", authController_1.updatePassword);
userRouter.get("/me", userController_1.getMe, userController_1.getUser);
userRouter.patch("/update-me", userController_1.updateMe);
userRouter.patch("/delete-me", userController_1.deleteMe);
//only for admins
userRouter.use((0, authController_1.restrictTo)("admin"));
userRouter.route("/").get(userController_1.getUsers).post(userController_1.createUser);
userRouter.route("/:id").get(userController_1.getUser).patch(userController_1.updateUser).delete(userController_1.deleteUser);
exports.default = userRouter;
//# sourceMappingURL=userRoutes.js.map