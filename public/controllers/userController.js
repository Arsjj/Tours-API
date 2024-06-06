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
exports.deleteMe = exports.updateMe = exports.getMe = exports.deleteUser = exports.updateUser = exports.createUser = exports.getUser = exports.getUsers = void 0;
const catchAsync_1 = require("../utils/catchAsync");
const appError_1 = __importDefault(require("../utils/appError"));
const userModel_1 = __importDefault(require("../models/userModel"));
const handlerFactory_1 = require("./handlerFactory");
// const filterObj = (
//   obj: Record<string, any>,
//   ...allowedFields: Array<string>
// ) => {
//   const newObj: any = {};
//   Object.keys(obj).forEach((el) => {
//     if (!allowedFields.includes(el)) newObj[el] = obj[el];
//   });
//   return newObj;
// };
const createUser = (req, res) => {
    res.status(500).json({
        statuse: "error",
        message: "This route isn't defined yet",
    });
};
exports.createUser = createUser;
const getMe = (req, res, next) => {
    var _a;
    req.params.id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    next();
};
exports.getMe = getMe;
const updateMe = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
        return next(new appError_1.default("This route is not for password updates. Please use /updateMyPassword.", 400));
    }
    if (req.body.email) {
        return next(new appError_1.default("You can't change your email", 400));
    }
    // 2) Filtered out unwanted fields names that are not allowed to be updated
    // const filteredBody = filterObj(req.body, "email");
    // 3) Update user document
    const updatedUser = yield userModel_1.default.findByIdAndUpdate((_a = req.user) === null || _a === void 0 ? void 0 : _a.id, req.body, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({
        status: "success",
        data: {
            user: updatedUser,
        },
    });
}));
exports.updateMe = updateMe;
const deleteMe = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    yield userModel_1.default.findByIdAndUpdate((_b = req.user) === null || _b === void 0 ? void 0 : _b.id, { active: false });
    res.status(204).json({
        status: "success",
        data: null,
    });
}));
exports.deleteMe = deleteMe;
const getUser = (0, handlerFactory_1.getOne)(userModel_1.default);
exports.getUser = getUser;
const getUsers = (0, handlerFactory_1.getAll)(userModel_1.default);
exports.getUsers = getUsers;
const updateUser = (0, handlerFactory_1.updateOne)(userModel_1.default);
exports.updateUser = updateUser;
const deleteUser = (0, handlerFactory_1.deleteOne)(userModel_1.default);
exports.deleteUser = deleteUser;
//# sourceMappingURL=userController.js.map