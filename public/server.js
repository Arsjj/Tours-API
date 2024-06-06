"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const mongoose_1 = __importDefault(require("mongoose"));
require("dotenv/config");
process.on("uncaughtException", (err) => {
    console.log(err.name, err.message);
    process.exit(1);
});
const DB = (_a = process.env.DATABASE) === null || _a === void 0 ? void 0 : _a.replace("<password>", process.env.DATABASE_PASSWORD);
mongoose_1.default.connect(DB).then(() => {
    console.log("Succesfull Connection");
});
//START SERVER
const port = 7000;
const server = app_1.default.listen(port, () => {
    console.log(`Server 78 started on port ${port}`);
});
process.on("unhandledRejection", (err) => {
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
//# sourceMappingURL=server.js.map