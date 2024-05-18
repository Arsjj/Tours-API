import app from "./app";
import 'dotenv/config'

console.log(process.env.PORT);

//START SERVER
const port = 7000;
app.listen(port, () => {
  console.log(`Server 78 started on port ${port}`);
});
