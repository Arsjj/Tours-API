import app from "./app";
import mongoose from "mongoose";
import "dotenv/config";

const DB = process.env.DATABASE?.replace('<password>', process.env.DATABASE_PASSWORD as string)
mongoose.connect(DB as string).then(() => {
  console.log("Succesfull Connection");
});


//START SERVER
const port = 7000;
app.listen(port, () => {
  console.log(`Server 78 started on port ${port}`);
});
