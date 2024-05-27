import app from "./app";
import mongoose from "mongoose";
import "dotenv/config";

process.on("uncaughtException", (err: Error) => {
  console.log(err.name, err.message);
  process.exit(1);
});

const DB = process.env.DATABASE?.replace(
  "<password>",
  process.env.DATABASE_PASSWORD as string
);
mongoose.connect(DB as string).then(() => {
  console.log("Succesfull Connection");
});

//START SERVER
const port = 7000;
const server = app.listen(port, () => {
  console.log(`Server 78 started on port ${port}`);
});

process.on("unhandledRejection", (err: Error) => {
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
