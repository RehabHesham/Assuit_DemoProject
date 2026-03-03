import app from "./app.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config(); // inject in global object process.env

// connect to Database
const MONGO_URI = process.env.MONGO_URI;
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log("MongoDB Connection error");
    console.log(err.message);
  });

// intiate server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
